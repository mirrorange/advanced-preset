/**
 * Multi-model workflows: a turn's stages split into phases (one request each, executed by the
 * binding of the phase's actor), the merged result, and the replay of earlier phases in the
 * request of a later one. Pure: the extension builds the requests, `ap preview` and tests reuse it.
 */
import { CONTENT_STAGE_REF, isInlineStructure, type Stage, type StructureDecl, type Workflow } from './types';
import { hostWithin, structureOrderOf, type TurnLayout } from './layout';
import { emptyTurn, type TurnResult } from './turn';
import { terminalContentIndex, type Patch } from './workflow';
import { partialTagTail } from './tags';

/** First Advanced Preset version that runs multi-model phases and stage regions (`beforeStage`). */
export const STAGE_REGIONS_SINCE = '1.13.0';

export interface Phase {
  index: number;
  /** Actor executing the phase (`''` when the turn is one phase without multi-model). */
  actor: string;
  stages: Stage[];
  /** Structures the phase's request asks for (non-inline ones go with the stage that carries them). */
  structures: StructureDecl[];
}

/** Maximal runs of consecutive stages with the same actor (`multi`), else one phase with every stage. */
export function phaseGroups(stages: Stage[], multi: boolean): { actor: string; stages: Stage[] }[] {
  if (!multi || !stages.length) return [{ actor: '', stages }];
  const out: { actor: string; stages: Stage[] }[] = [];
  for (const s of stages) {
    const last = out[out.length - 1];
    if (last && last.actor === s.actor) last.stages.push(s);
    else out.push({ actor: s.actor, stages: [s] });
  }
  return out;
}

/**
 * Stage whose phase writes a structure: the stage it is placed before / after (`@content`: the
 * terminal content stage; `structures.after` for unpositioned ones), for an absolute sort key the
 * closest preceding stage (the first stage when it comes before all of them). A reference to a stage
 * that is not active falls back to the structures anchor, as in the layout. Inline structures live
 * in the terminal content.
 */
export function structureStage(workflow: Pick<Workflow, 'structureOrder' | 'structuresAfter'>, stages: Stage[], layout: Pick<TurnLayout, 'items'> | undefined, decl: StructureDecl): Stage | undefined {
  const terminal = terminalContentIndex(stages);
  const content = terminal >= 0 ? stages[terminal] : undefined;
  const ref = (id: string) => (id === CONTENT_STAGE_REF ? content : stages.find((s) => s.id === id));
  const anchor = (workflow.structuresAfter ? stages.find((s) => s.id === workflow.structuresAfter) : undefined) ?? content ?? stages[stages.length - 1];
  if (isInlineStructure(decl)) return content ?? anchor;
  const o = structureOrderOf(workflow, decl);
  if (typeof o === 'number') {
    const at = layout ? layout.items.findIndex((it) => it.type === 'structure' && it.structure.id === decl.id) : -1;
    for (let i = at - 1; i >= 0; i--) { const it = layout!.items[i]!; if (it.type === 'stage') return it.stage; }
    return stages[0];
  }
  return ('before' in o ? ref(o.before) : ref(o.after)) ?? anchor;
}

/** Phases of a turn; each structure goes with the phase of its {@link structureStage}. */
export function planPhases(stages: Stage[], structures: StructureDecl[], layout: Pick<TurnLayout, 'items'> | undefined, multi: boolean, workflow: Pick<Workflow, 'structureOrder' | 'structuresAfter'> = {}): Phase[] {
  const groups = phaseGroups(stages, multi);
  const phases: Phase[] = groups.map((g, index) => ({ index, actor: g.actor, stages: g.stages, structures: [] }));
  if (phases.length === 1) { phases[0]!.structures = [...structures]; return phases; }
  for (const d of structures) {
    const stage = structureStage(workflow, stages, layout, d);
    const i = stage ? phases.findIndex((p) => p.stages.includes(stage)) : -1;
    phases[i >= 0 ? i : phases.length - 1]!.structures.push(d);
  }
  return phases;
}

/** Results of the phases run so far (each parsed over its own stages) as one turn over every stage. */
export function mergeTurns(stages: Stage[], parts: { stages: Stage[]; turn: TurnResult }[], final: boolean): TurnResult {
  const r = emptyTurn(stages);
  for (const p of parts) {
    for (const s of p.stages) { const x = p.turn.stages[s.id]; if (x) r.stages[s.id] = { ...x }; }
    Object.assign(r.structures, p.turn.structures);
    r.openStructures.push(...p.turn.openStructures);
    r.warnings.push(...p.turn.warnings);
    if (p.turn.current) r.current = p.turn.current;
    if (p.turn.contentStarted) r.contentStarted = true;
  }
  if (final) r.current = null;
  for (let i = stages.length - 1; i >= 0; i--) {
    const s = stages[i]!;
    if (s.kind !== 'content') continue;
    const t = r.stages[s.id]?.text?.trim();
    if (t) { r.content = t; break; }
  }
  if (!final && r.content) r.content = r.content.slice(0, r.content.length - partialTagTail(r.content)).trimEnd();
  return r;
}

/** One earlier stage as replayed in a later phase's request. */
export interface ReplayItem {
  stage: Stage;
  text?: string;
  patches?: Patch[];
  /** Structures carried by the stage (its tool / after its text), with their values. */
  structures: { decl: StructureDecl; value: unknown }[];
}

/**
 * Stages of earlier phases that produced output, in turn order, with the structures they carry.
 * Previous reasoning is never part of a turn result, so it is dropped here by construction.
 */
export function replayItems(phases: Phase[], turn: TurnResult, layout: Pick<TurnLayout, 'items'> | undefined): ReplayItem[] {
  const out: ReplayItem[] = [];
  for (const p of phases) {
    for (const stage of p.stages) {
      const r = turn.stages[stage.id];
      const hasText = typeof r?.text === 'string' && r.text.trim() !== '';
      if (!r || (!hasText && !r.patches)) continue;
      // A phase's structures ride on its stages (closest preceding one, else following), as in its request.
      const carried = layout ? p.structures.filter((d) => !isInlineStructure(d) && hostWithin(layout, p.stages, d) === stage) : [];
      out.push({
        stage,
        ...(hasText ? { text: r.text } : {}),
        ...(r.patches ? { patches: r.patches } : {}),
        structures: carried.filter((d) => turn.structures[d.id] !== undefined).map((d) => ({ decl: d, value: turn.structures[d.id] })),
      });
    }
  }
  return out;
}

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const scalar = (v: unknown) => (Array.isArray(v) ? v.map(String).join(', ') : v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
const children = (o: Record<string, unknown>) => Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => `<${k}>${escapeXml(scalar(v))}</${k}>`).join('');

/** A structure value written back as the dialogue-style tag block the model would have written. */
export function structureTagText(decl: StructureDecl, value: unknown): string {
  const tag = decl.tag;
  const block = (inner: string) => `<${tag}>${inner}</${tag}>`;
  if (typeof value === 'string') return block(value);
  if (decl.kind === 'options' && Array.isArray(value)) {
    return block(value.map((o: { label?: string; content?: string }) => `<option title="${escapeXml(o.label ?? '').replace(/"/g, '&quot;')}">${o.content ?? ''}</option>`).join('\n'));
  }
  if (Array.isArray(value)) return value.map((x) => block(x && typeof x === 'object' ? children(x as Record<string, unknown>) : escapeXml(scalar(x)))).join('\n');
  if (value && typeof value === 'object') return block(children(value as Record<string, unknown>));
  return block(escapeXml(scalar(value)));
}

export interface DialogueReplayOptions {
  /** Actor id → rendered prefix (`Freesia: `). */
  prefixes: Record<string, string>;
  /** `tag`: every stage is wrapped in `<stage>`. */
  format: 'prefix' | 'tag';
  contentMarker: string;
  /** All stages of the turn (to find the terminal content stage). */
  stages: Stage[];
}

/** Earlier stages as dialogue text (prefill / plaintext), in the format the parser reads back. */
export function dialogueReplay(items: ReplayItem[], o: DialogueReplayOptions): string {
  const terminal = terminalContentIndex(o.stages);
  const terminalId = terminal >= 0 ? o.stages[terminal]!.id : undefined;
  const parts: string[] = [];
  for (const it of items) {
    const s = it.stage;
    const tag = s.tag ?? (o.format === 'tag' || s.kind === 'patch' ? s.id : undefined);
    if (it.patches) parts.push(it.patches.map((p) => `<${tag}><old_string>${escapeXml(p.old_string)}</old_string><new_string>${escapeXml(p.new_string)}</new_string></${tag}>`).join('\n'));
    else if (tag) parts.push(`<${tag}>\n${it.text ?? ''}\n</${tag}>`);
    else {
      const marker = s.id === terminalId && o.contentMarker ? `${o.contentMarker}\n` : '';
      parts.push(`${o.prefixes[s.actor] ?? ''}${marker}${it.text ?? ''}`);
    }
    for (const x of it.structures) parts.push(structureTagText(x.decl, x.value));
  }
  return parts.join('\n\n');
}

/** Earlier stages as the turn object (structured output), field names as the whole turn names them. */
export function objectReplay(items: ReplayItem[], names: { fieldOf(stage: Stage): string; structureFieldOf(decl: StructureDecl): string }): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const it of items) {
    out[names.fieldOf(it.stage)] = it.patches ?? it.text ?? '';
    for (const x of it.structures) out[names.structureFieldOf(x.decl)] = x.value;
  }
  return out;
}

/** Earlier stages as multi-step tool calls: tool name and arguments (stage parameter + carried structures). */
export function toolReplay(items: ReplayItem[], names: { toolOf(stage: Stage): string; paramOf(stage: Stage): string; structureFieldOf(decl: StructureDecl): string }): { stage: Stage; name: string; arguments: Record<string, unknown> }[] {
  return items.map((it) => {
    const args: Record<string, unknown> = { [names.paramOf(it.stage)]: it.patches ?? it.text ?? '' };
    for (const x of it.structures) args[names.structureFieldOf(x.decl)] = x.value;
    return { stage: it.stage, name: names.toolOf(it.stage), arguments: args };
  });
}
