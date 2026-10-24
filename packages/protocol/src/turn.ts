/**
 * Turn output parsing: dialogue style (actor prefixes / tags) and object style (JSON fields or tool
 * arguments) both produce a {@link TurnResult}.
 */
import { isInlineStructure, type Stage, type StructureDecl } from './types';
import { extractStructureTags, normalizeStructure } from './structures';
import { childText, escapeRe, findTags, partialTagTail, removeBlocks, stripComments, unescapeXml } from './tags';
import { stageFieldName, terminalContentIndex, type Patch } from './workflow';

export type StageStatus = 'pending' | 'streaming' | 'done' | 'missing' | 'interrupted';
export interface StageResult {
  text?: string;
  patches?: Patch[];
  status: StageStatus;
}

export interface TurnResult {
  stages: Record<string, StageResult>;
  structures: Record<string, unknown>;
  /** Stage currently being written (streaming). */
  current: string | null;
  /** Final story content so far (the last non-empty content stage). */
  content: string;
  /** True once the terminal content stage has started. */
  contentStarted: boolean;
  /** Structures whose block/field is still incomplete. */
  openStructures: string[];
  warnings: string[];
}

export function emptyTurn(stages: Stage[]): TurnResult {
  return {
    stages: Object.fromEntries(stages.map((s) => [s.id, { status: 'pending' as StageStatus }])),
    structures: {},
    current: null,
    content: '',
    contentStarted: false,
    openStructures: [],
    warnings: [],
  };
}

function finalizeContent(stages: Stage[], r: TurnResult, final = true) {
  r.content = '';
  for (let i = stages.length - 1; i >= 0; i--) {
    const s = stages[i]!;
    if (s.kind !== 'content') continue;
    const t = r.stages[s.id]?.text?.trim();
    if (t) { r.content = t; break; }
  }
  // While streaming, hold back a trailing fragment that may become a tag.
  if (!final && r.content) r.content = r.content.slice(0, r.content.length - partialTagTail(r.content)).trimEnd();
}

function markStatuses(stages: Stage[], r: TurnResult, final: boolean) {
  for (const s of stages) {
    const st = r.stages[s.id]!;
    const has = (st.text !== undefined && st.text.trim() !== '') || (st.patches !== undefined);
    if (final) st.status = has ? 'done' : 'missing';
    else st.status = s.id === r.current ? 'streaming' : has ? 'done' : 'pending';
  }
}

function parsePatchBlocks(inner: string[]): Patch[] {
  return inner.map((b) => ({ old_string: childText(b, 'old_string') ?? '', new_string: childText(b, 'new_string') ?? '' }));
}

export interface DialogueOptions {
  stages: Stage[];
  /** Actor id → rendered prefix (e.g. `Freesia: `). */
  prefixes: Record<string, string>;
  /** Actor id of the user (a user prefix ends the turn). */
  user: string;
  contentMarker: string;
  structures: StructureDecl[];
  /** `tag`: every stage is wrapped in `<stage_tag>`. */
  format: 'prefix' | 'tag';
  final: boolean;
}

/** Parse dialogue-style model text (prefill / plaintext transports). Pure: re-run on the accumulated text while streaming. */
export function parseDialogue(raw: string, o: DialogueOptions): TurnResult {
  const r = emptyTurn(o.stages);
  let text = stripComments(raw);

  // A user prefix at a line start means the model started speaking for the user: cut there.
  const userPrefix = o.prefixes[o.user]?.trimEnd();
  if (userPrefix) {
    const m = new RegExp(`(^|\\n)[ \\t]*${escapeRe(userPrefix)}`).exec(text);
    if (m) text = text.slice(0, m.index);
  }

  const structures = extractStructureTags(text, o.structures);
  r.structures = structures.values;
  r.openStructures = structures.open;
  text = structures.text;

  // Tagged stages.
  const tagOf = (s: Stage) => s.tag ?? (o.format === 'tag' ? s.id : undefined);
  const tagged = new Set<string>();
  let lastOpenTag: string | null = null;
  for (const s of o.stages) {
    const tag = tagOf(s);
    if (!tag) continue;
    const blocks = findTags(text, tag);
    if (s.kind === 'content' && o.format === 'prefix') {
      // content stages are never tag-bound in prefix format unless explicitly tagged
    }
    tagged.add(s.id);
    if (!blocks.length) continue;
    if (s.kind === 'patch') r.stages[s.id]!.patches = parsePatchBlocks(blocks.filter((b) => !b.open).map((b) => b.inner));
    else r.stages[s.id]!.text = unescapeXml(blocks.map((b) => b.inner).join('\n\n')).trim();
    if (blocks.some((b) => b.open)) lastOpenTag = s.id;
    text = removeBlocks(text, blocks);
  }

  const untagged = o.stages.filter((s) => !tagged.has(s.id));
  const terminal = terminalContentIndex(o.stages);
  const terminalStage = terminal >= 0 ? o.stages[terminal]! : undefined;

  if (untagged.length) {
    const actorRes = Object.entries(o.prefixes)
      .filter(([id]) => id !== o.user)
      .map(([id, p]) => ({ id, re: escapeRe(p.trimEnd()) }))
      .filter((x) => x.re);
    const splitRe = actorRes.length ? new RegExp(`(^|\\n)[ \\t]*(${actorRes.map((x) => x.re).join('|')})[ \\t]*`, 'g') : null;
    const segments: { actor: string | null; text: string }[] = [];
    if (splitRe) {
      let at = 0;
      let actor: string | null = null;
      for (const m of text.matchAll(splitRe)) {
        segments.push({ actor, text: text.slice(at, m.index) });
        const p = m[2]!;
        actor = actorRes.find((x) => new RegExp(`^${x.re}$`).test(p))?.id ?? null;
        at = m.index! + m[0].length;
      }
      segments.push({ actor, text: text.slice(at) });
    } else segments.push({ actor: null, text });

    let idx = -1; // index into untagged
    let inContent = false;
    let markerSeen = false;
    const append = (stage: Stage, t: string) => {
      const st = r.stages[stage.id]!;
      st.text = (st.text ? `${st.text}\n\n` : '') + t;
    };
    const markerAt = (t: string) => (o.contentMarker ? t.indexOf(o.contentMarker) : -1);
    const afterContent = terminalStage ? untagged.filter((s) => o.stages.indexOf(s) > terminal) : [];

    for (const seg of segments) {
      let t = seg.text;
      if (!t.trim() && seg.actor === null) continue;
      if (inContent) {
        // After the marker only prefixes of stages that follow the content stage split the text.
        const nextStage = seg.actor ? afterContent.find((s) => s.actor === seg.actor && untagged.indexOf(s) > idx) : undefined;
        if (!nextStage) {
          append(terminalStage!, seg.actor ? `${o.prefixes[seg.actor]}${t}` : t);
          continue;
        }
        inContent = false;
        idx = untagged.indexOf(nextStage);
        append(nextStage, t);
        r.current = nextStage.id;
        continue;
      }
      if (seg.actor === null) {
        if (idx < 0) idx = 0; // leading unprefixed text belongs to the first stage
      } else if (idx < 0 || untagged[idx]!.actor !== seg.actor) {
        const n = untagged.findIndex((s, i) => i > idx && s.actor === seg.actor);
        if (n >= 0) idx = n;
        else if (idx < 0) idx = 0;
      }
      const m = markerAt(t);
      if (m >= 0 && terminalStage) {
        t = t.slice(m + o.contentMarker.length);
        inContent = true;
        idx = untagged.indexOf(terminalStage);
        r.contentStarted = true;
        markerSeen = true;
        r.current = terminalStage.id;
        if (t.trim()) append(terminalStage, t);
        continue;
      }
      const stage = untagged[idx];
      if (!stage) continue;
      if (t.trim()) append(stage, t);
      r.current = stage.id;
      if (stage === terminalStage) { r.contentStarted = true; inContent = true; }
    }
    for (const s of untagged) {
      const st = r.stages[s.id]!;
      if (st.text !== undefined) st.text = st.text.trim();
    }
    if (o.final && o.contentMarker && !markerSeen && terminalStage && r.stages[terminalStage.id]!.text) r.warnings.push('content-marker-missing');
    // Fallback (D20): no marker found → the last narrator segment is the content.
    if (o.final && terminalStage && !r.stages[terminalStage.id]!.text && !tagged.has(terminalStage.id)) {
      const narratorStages = untagged.filter((s) => s !== terminalStage && s.actor === terminalStage.actor && r.stages[s.id]!.text);
      const last = narratorStages[narratorStages.length - 1];
      if (last) {
        r.stages[terminalStage.id]!.text = r.stages[last.id]!.text;
        r.stages[last.id]!.text = undefined;
        r.warnings.push('content-marker-missing');
      } else if (!untagged.some((s) => r.stages[s.id]!.text)) {
        const rest = text.trim();
        if (rest) { r.stages[terminalStage.id]!.text = rest; r.warnings.push('no-stages-found'); }
      }
    }
  } else if (terminalStage) {
    // Fully tagged workflows (e.g. task: <thinking> + free content): the remainder is content.
    const rest = text.trim();
    if (rest && !r.stages[terminalStage.id]!.text) r.stages[terminalStage.id]!.text = rest;
  }

  if (lastOpenTag && !o.final) r.current = lastOpenTag;
  if (terminalStage && r.stages[terminalStage.id]!.text) r.contentStarted = true;
  finalizeContent(o.stages, r, o.final);
  markStatuses(o.stages, r, o.final);
  return r;
}

export interface ObjectOptions {
  stages: Stage[];
  structures: StructureDecl[];
  final: boolean;
  /** Keys still being streamed (the last key of a partial object). */
  openKey?: string;
  /** Field name of a stage (defaults to the default template). */
  fieldOf?: (stage: Stage) => string;
}

/** Parse a turn object (structured output / single tool arguments). */
export function parseTurnObject(obj: Record<string, unknown> | null | undefined, o: ObjectOptions): TurnResult {
  const r = emptyTurn(o.stages);
  const src = obj ?? {};
  const fieldOf = o.fieldOf ?? ((s: Stage) => stageFieldName(o.stages, s));
  const findKey = (name: string, stage?: Stage) => {
    if (name in src) return src[name];
    if (stage) {
      // tolerate models that drop the numeric prefix or reorder actor names
      const k = Object.keys(src).find((x) => x === stage.id || x.endsWith(`_${stage.id}`));
      return k ? src[k] : undefined;
    }
    return undefined;
  };
  let lastPresent: string | null = null;
  for (const s of o.stages) {
    const v = findKey(fieldOf(s), s);
    if (v === undefined) continue;
    lastPresent = s.id;
    if (s.kind === 'patch') r.stages[s.id]!.patches = normalizePatches(v);
    else r.stages[s.id]!.text = typeof v === 'string' ? v : JSON.stringify(v);
  }
  for (const d of o.structures) {
    if (isInlineStructure(d)) continue;
    const v = findKey(d.field);
    const n = normalizeStructure(d.kind, v, d);
    if (n !== undefined) r.structures[d.id] = n;
    if (!o.final && o.openKey === d.field) r.openStructures.push(d.id);
  }
  const terminal = terminalContentIndex(o.stages);
  if (!o.final) {
    const openStage = o.stages.find((s) => fieldOf(s) === o.openKey || s.id === o.openKey);
    r.current = openStage?.id ?? (o.openKey ? null : lastPresent);
  }
  if (terminal >= 0 && r.stages[o.stages[terminal]!.id]!.text !== undefined) r.contentStarted = true;
  finalizeContent(o.stages, r, o.final);
  markStatuses(o.stages, r, o.final);
  return r;
}

export function normalizePatches(v: unknown): Patch[] {
  const arr = Array.isArray(v) ? v : v && typeof v === 'object' && Array.isArray((v as { edits?: unknown }).edits) ? (v as { edits: unknown[] }).edits : [];
  return arr
    .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object')
    .map((x) => ({ old_string: String(x.old_string ?? x.old ?? ''), new_string: String(x.new_string ?? x.new ?? '') }));
}
