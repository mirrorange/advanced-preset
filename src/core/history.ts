/**
 * History rewriting (§9.1) on the interceptor's shallow chat copy, plus the alignment used by the
 * script path (§9.2). Pure functions over a minimal message shape; the real chat is never touched.
 */
import {
  activeModules, annotationDepth, fillHistoryTemplate, formatSynopsisLine, hasStructureValue, historyContentKey, historyEchoOf, historyPlacement, injectAnnotations, insertPieces, parseMeta, resolverOf, test,
  type APreset, type Configuration, type PlacedPiece, type StructureKind, type Synopsis, type TokenSavingConfig, type Vars, type Workflow,
} from '@advanced-preset/protocol';
import type { Sidecar } from '@/store/sidecar';

export interface HistoryItem {
  is_user: boolean;
  mes: string;
  extra?: Record<string, any>;
  is_system?: boolean;
  name?: string;
  send_date?: string;
}

export interface RewriteOptions {
  trigger: string;
  wrap: boolean;
  /** `userInput` missing (older stored shapes) behaves as `truncate`. */
  tokenSaving: Omit<TokenSavingConfig, 'userInput'> & { userInput?: TokenSavingConfig['userInput'] };
  /** Token saving: replaces an older assistant message that has a synopsis. */
  synopsisTemplate: string;
  /** Structure id of the synopsis kind (if declared). */
  synopsisId?: string;
  /** Structure history (I-139): structures recent assistant messages carry again. */
  echoes?: HistoryEchoes;
  /** Latest effective recap: messages up to `coversUpTo` (real index) may be dropped. */
  recap?: { coversUpTo: number } | null;
  /** Real chat index of each item (for recap coverage). */
  realIndex: (i: number) => number;
  /** Item index of the current user input (kept verbatim), or -1. */
  currentInput: number;
  /** Re-inject inline annotations as CriticMarkup into the last `depth` assistant messages (I-80). */
  annotations?: { depth: number };
  /** Item index of the assistant message being continued: it never carries structures. */
  continuing?: number;
  /**
   * Storylines (I-149): items of side storylines other than the current one. With token saving and
   * a synopsis structure they get the synopsis / user input rule whatever their depth.
   */
  background?: (index: number) => boolean;
}

/** One structure's history rule (I-139), placed relative to the message text. */
export interface EchoRule {
  id: string;
  kind: StructureKind;
  depth: number;
  /** Carried by recent messages this turn (requested by a switched-on module, condition holds). */
  active: boolean;
  pieces: { template: string; key: number; rank: number; raw?: boolean }[];
}

/**
 * Every structure that declares history, in declaration order. Inactive rules stay listed: a
 * sticky rendering (cache optimization) may still carry them.
 */
export interface HistoryEchoes {
  rules: EchoRule[];
  /** Sort key of the message text. */
  contentKey: number;
}

/**
 * How one history message is rendered. Plain data so that cache optimization can keep the rendering
 * of the previous request (sticky rendering) and apply the current rules later.
 */
export interface RenderMode {
  /** Full text, replaced by its synopsis (assistant), truncated (user) or left out. */
  body: 'full' | 'synopsis' | 'truncate' | 'drop';
  /** `truncate`: character limit. */
  max?: number;
  /** Inline annotations re-injected as CriticMarkup. */
  annotations?: boolean;
  /** Full assistant text that also carries these structures (structure history, I-139), in rule order. */
  echo?: string[];
}

/**
 * Compact form stored between requests: `f` / `s` / `x` / `t<max>`, then `a` (annotations) and
 * `+<id>` per carried structure. `y` (synopsis, before 1.10) is still read.
 */
export function encodeMode(m: RenderMode): string {
  const body = m.body === 'full' ? 'f' : m.body === 'synopsis' ? 's' : m.body === 'drop' ? 'x' : `t${m.max ?? 0}`;
  if (m.body !== 'full') return body;
  return body + (m.annotations ? 'a' : '') + (m.echo ?? []).map((id) => `+${id}`).join('');
}

/** `synopsisId`: the structure a legacy `y` refers to. */
export function decodeMode(code: string | undefined, synopsisId?: string): RenderMode | undefined {
  const m = code ? /^(?:(f)(y?)(a?)((?:\+[^+]+)*)|(s)|(x)|t(\d+))$/.exec(code) : null;
  if (!m) return undefined;
  if (m[1]) {
    const echo = [...(m[2] && synopsisId ? [synopsisId] : []), ...(m[4] ? m[4].slice(1).split('+') : [])];
    return { body: 'full', ...(m[3] ? { annotations: true } : {}), ...(echo.length ? { echo } : {}) };
  }
  if (m[5]) return { body: 'synopsis' };
  if (m[6]) return { body: 'drop' };
  return { body: 'truncate', max: Number(m[7]) };
}

const sidecarOf = (m: HistoryItem): Sidecar | undefined => {
  const s = m.extra?.advanced_preset;
  return s && s.v === 1 ? (s as Sidecar) : undefined;
};
const PURE_TURNS = new Set(['meta-pure', 'summary', 'impersonate']);

/** Fills `{{time}}` `{{location}}` `{{event}}` `{{summary}}` (token-saving replacement). */
export const formatSynopsis = (template: string, s: Synopsis): string => formatSynopsisLine(template, s);

const synopsisOf = (item: HistoryItem, id?: string): Synopsis | undefined =>
  id ? (sidecarOf(item)?.structures?.[id] as Synopsis | undefined) : undefined;
const structureOf = (item: HistoryItem, id: string): unknown => sidecarOf(item)?.structures?.[id];

/** A history message after the fixed rewrites (pure meta turns dropped, meta segments stripped). */
export interface PlannedItem {
  item: HistoryItem;
  /** Index in the input list. */
  index: number;
  /** Rendering by the current rules; `null` for system items (passed through as is). */
  fresh: RenderMode | null;
  /** Rendering fixed by a deterministic rule (recap coverage): sticky rendering does not apply. */
  forced?: boolean;
}

/**
 * History rewriting as a plan (§9.1): steps 1–2 change the list, steps 3–5 only decide the
 * {@link RenderMode} of each remaining message.
 */
export function planHistory(items: HistoryItem[], o: RewriteOptions): PlannedItem[] {
  type Row = { item: HistoryItem; index: number };
  let rows: Row[] = items.map((item, index) => ({ item, index }));

  // 1. Drop pure meta turns (assistant + the user message that asked), except the current input.
  const drop = new Set<number>();
  rows.forEach(({ item }, i) => {
    if (item.is_user || item.is_system) return;
    const sc = sidecarOf(item);
    if (!sc || !PURE_TURNS.has(sc.turn)) return;
    drop.add(i);
    for (let j = i - 1; j >= 0; j--) {
      if (rows[j]!.item.is_user) { if (j !== o.currentInput) drop.add(j); break; }
      if (!rows[j]!.item.is_system) break;
    }
  });
  rows = rows.filter((r) => !drop.has(r.index));

  // 2. Strip meta segments from earlier user messages.
  rows = rows.map((r) => {
    if (!r.item.is_user || r.index === o.currentInput || !o.trigger) return r;
    const m = parseMeta(r.item.mes, o.trigger, o.wrap);
    if (!m.present) return r;
    return { ...r, item: { ...r.item, mes: m.stripped } };
  }).filter((r) => r.item.mes.trim() !== '' || !r.item.is_user);

  const plan: PlannedItem[] = rows.map((r) => ({ ...r, fresh: r.item.is_system ? null : { body: 'full' } }));

  // 3. Token saving: count assistant turns from the end.
  if (o.tokenSaving.enabled) {
    let assistants = 0;
    const depth: number[] = new Array(plan.length).fill(0);
    for (let i = plan.length - 1; i >= 0; i--) {
      if (!plan[i]!.item.is_user && !plan[i]!.item.is_system) assistants++;
      depth[i] = assistants;
    }
    const keep = Math.max(0, o.tokenSaving.keepFullTurns);
    // a user message shares the depth of the assistant reply that follows it
    const inFull = (i: number) => depth[i]! <= keep;
    const covered = o.recap?.coversUpTo ?? -1;
    plan.forEach((p, i) => {
      if (!p.fresh || p.index === o.currentInput) return;
      if (inFull(i) && !(o.synopsisId && o.background?.(p.index))) return;
      if (covered >= 0 && o.realIndex(p.index) <= covered) { p.fresh = { body: 'drop' }; p.forced = true; return; }
      if (p.item.is_user) {
        const mode = o.tokenSaving.userInput ?? 'truncate';
        const max = o.tokenSaving.truncateUserAfter;
        if (mode === 'remove') p.fresh = { body: 'drop' };
        else if (mode === 'truncate' && max > 0 && p.item.mes.length > max) p.fresh = { body: 'truncate', max };
        return;
      }
      if (synopsisOf(p.item, o.synopsisId)) p.fresh = { body: 'synopsis' };
    });
  }

  // Steps 4–5 only touch assistant messages that are still verbatim after the rewrites above.
  const recentAssistants = (depth: number): PlannedItem[] => {
    const out: PlannedItem[] = [];
    for (let i = plan.length - 1; i >= 0 && out.length < depth; i--) {
      const p = plan[i]!;
      if (p.fresh && !p.item.is_user && p.fresh.body !== 'drop') out.push(p);
    }
    return out;
  };

  // 4. Inline annotations: only untouched assistant messages near the end.
  for (const p of recentAssistants(o.annotations?.depth ?? 0)) {
    if (p.fresh!.body === 'full' && sidecarOf(p.item)?.annotations?.length) p.fresh!.annotations = true;
  }

  // 5. Structure history (I-139): the last `depth` assistant messages keep their text and also carry
  //    the structure (e.g. a synopsis keeps a time/place reference while older turns are verbatim).
  //    Messages replaced by their synopsis (token saving) still count towards the depth.
  for (const rule of o.echoes?.rules ?? []) {
    if (!rule.active) continue;
    for (const p of recentAssistants(rule.depth)) {
      if (p.fresh!.body !== 'full' || p.index === o.continuing || !hasStructureValue(structureOf(p.item, rule.id))) continue;
      p.fresh!.echo = [...(p.fresh!.echo ?? []), rule.id];
    }
  }
  return plan;
}

/** Text of a planned message under `mode` (`null`: left out). Missing data falls back to the full text. */
export function renderItem(p: PlannedItem, mode: RenderMode | null, o: RewriteOptions): string | null {
  const { item } = p;
  if (!mode || item.is_system) return item.mes;
  switch (mode.body) {
    case 'drop': return null;
    case 'truncate': {
      const max = mode.max ?? 0;
      return max > 0 && item.mes.length > max ? `${item.mes.slice(0, max)}…` : item.mes;
    }
    case 'synopsis': {
      const syn = item.is_user ? undefined : synopsisOf(item, o.synopsisId);
      return syn ? formatSynopsis(o.synopsisTemplate, syn) : item.mes;
    }
    default: {
      let mes = item.mes;
      if (item.is_user) return mes;
      const list = mode.annotations ? sidecarOf(item)?.annotations : undefined;
      if (list?.length) mes = injectAnnotations(mes, list);
      if (mode.echo?.length && o.echoes) mes = insertEchoes(mes, item, mode.echo, o.echoes);
      return mes;
    }
  }
}

/** Message text with the carried structures inserted around it. Structures without a value or rule are skipped. */
function insertEchoes(mes: string, item: HistoryItem, ids: string[], echoes: HistoryEchoes): string {
  const pieces: PlacedPiece[] = [];
  echoes.rules.forEach((rule, r) => {
    if (!ids.includes(rule.id)) return;
    const value = structureOf(item, rule.id);
    if (!hasStructureValue(value)) return;
    rule.pieces.forEach((p, i) => pieces.push({ text: fillHistoryTemplate(p.template, rule.kind, value), key: p.key, rank: p.rank, order: r * 16 + i, ...(p.raw ? { raw: true } : {}) }));
  });
  return pieces.length ? insertPieces(mes, echoes.contentKey, pieces) : mes;
}

/** The rewritten list with the input index of each item (items are shallow copies when changed). */
export function rewriteHistoryIndexed(items: HistoryItem[], o: RewriteOptions): { item: HistoryItem; index: number }[] {
  const out: { item: HistoryItem; index: number }[] = [];
  for (const p of planHistory(items, o)) {
    const mes = renderItem(p, p.fresh, o);
    if (mes === null) continue;
    out.push({ item: mes === p.item.mes ? p.item : { ...p.item, mes }, index: p.index });
  }
  return out;
}

/** Returns the rewritten list (new array; items are shallow copies when changed). */
export function rewriteHistory(items: HistoryItem[], o: RewriteOptions): HistoryItem[] {
  return rewriteHistoryIndexed(items, o).map((r) => r.item);
}

/** History re-injection depth for the preset (I-80): the annotations structure is declared by a switched-on module. */
export function annotationHistory(preset: APreset, config: Configuration): { depth: number } | undefined {
  const decl = Object.values(preset.structures).find((s) => s.kind === 'annotations');
  const depth = decl ? annotationDepth(decl) : 0;
  if (!depth) return undefined;
  const requested = activeModules(preset, config).some((m) => m.structures.includes(decl!.id));
  return requested ? { depth } : undefined;
}

/** Synopsis options for {@link rewriteHistory}: the token-saving replacement template and the structure. */
export function synopsisOptions(preset: APreset): Pick<RewriteOptions, 'synopsisTemplate' | 'synopsisId'> {
  const decl = Object.values(preset.structures).find((s) => s.kind === 'synopsis');
  return { synopsisTemplate: preset.tokenSaving.synopsisTemplate, synopsisId: decl?.id };
}

/**
 * Structure history rules (I-139). A rule is active when a switched-on module requests the
 * structure and its `when` holds under `vars`; pieces are placed by `workflow` (the story workflow
 * whose turns make up the history).
 */
export function historyEchoes(preset: APreset, config: Configuration, vars: Vars | undefined, workflow: Workflow | undefined): HistoryEchoes | undefined {
  const requested = new Set(activeModules(preset, config).flatMap((m) => m.structures));
  const resolve = vars ? resolverOf(vars) : undefined;
  const rules: EchoRule[] = [];
  for (const decl of Object.values(preset.structures)) {
    const echo = historyEchoOf(decl);
    if (!echo) continue;
    const active = requested.has(decl.id) && (!echo.when || (resolve ? test(echo.when, resolve) : false));
    rules.push({
      id: decl.id,
      kind: decl.kind,
      depth: echo.depth,
      active,
      pieces: echo.pieces.map((p) => ({ template: p.template, ...historyPlacement(workflow, decl, p.position), ...(p.raw ? { raw: true } : {}) })),
    });
  }
  return rules.length ? { rules, contentKey: historyContentKey(workflow) } : undefined;
}

// ---- script path alignment (§9.2) ----------------------------------------------------------

const normalize = (s: string) => s.replace(/\{\{[^{}]*\}\}/g, '').replace(/\s+/g, '');

function bigrams(s: string): Map<string, number> {
  const m = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) { const b = s.slice(i, i + 2); m.set(b, (m.get(b) ?? 0) + 1); }
  return m;
}

/** Sørensen–Dice coefficient over character bigrams. */
export function dice(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const A = bigrams(a);
  const B = bigrams(b);
  let inter = 0;
  for (const [k, n] of A) inter += Math.min(n, B.get(k) ?? 0);
  return (2 * inter) / (a.length - 1 + (b.length - 1));
}

/**
 * Align prompt messages `H` (role + text) with chat messages `C` from the tail.
 * Returns for every H index the matched C index (or -1) and the match rate.
 */
export function alignHistory(H: { role: string; text: string }[], C: { role: string; text: string }[], threshold = 0.9): { map: number[]; rate: number } {
  const map = new Array(H.length).fill(-1);
  let ci = C.length - 1;
  let matched = 0;
  for (let hi = H.length - 1; hi >= 0 && ci >= 0; hi--) {
    const h = H[hi]!;
    const hn = normalize(h.text);
    // look back a few chat messages to tolerate injected/missing items
    for (let k = ci; k >= Math.max(0, ci - 3); k--) {
      const c = C[k]!;
      if (c.role !== h.role) continue;
      const cn = normalize(c.text);
      if (hn === cn || hn.includes(cn) || dice(hn, cn) >= threshold) { map[hi] = k; ci = k - 1; matched++; break; }
    }
  }
  return { map, rate: H.length ? matched / H.length : 1 };
}
