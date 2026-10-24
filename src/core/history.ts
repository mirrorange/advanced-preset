/**
 * History rewriting (§9.1) on the interceptor's shallow chat copy, plus the alignment used by the
 * script path (§9.2). Pure functions over a minimal message shape; the real chat is never touched.
 */
import { activeModules, injectAnnotations, parseMeta, type APreset, type Configuration, type Synopsis } from '@advanced-preset/protocol';
import type { Sidecar } from '@/store/sidecar';

export interface HistoryItem {
  is_user: boolean;
  mes: string;
  extra?: Record<string, any>;
  is_system?: boolean;
  name?: string;
}

export interface RewriteOptions {
  trigger: string;
  wrap: boolean;
  tokenSaving: { enabled: boolean; keepFullTurns: number; truncateUserAfter: number };
  synopsisTemplate: string;
  /** Structure id of the synopsis kind (if declared). */
  synopsisId?: string;
  /** Latest effective recap: messages up to `coversUpTo` (real index) may be dropped. */
  recap?: { coversUpTo: number } | null;
  /** Real chat index of each item (for recap coverage). */
  realIndex: (i: number) => number;
  /** Item index of the current user input (kept verbatim), or -1. */
  currentInput: number;
  /** Re-inject inline annotations as CriticMarkup into the last `depth` assistant messages (I-80). */
  annotations?: { depth: number };
}

const sidecarOf = (m: HistoryItem): Sidecar | undefined => {
  const s = m.extra?.advanced_preset;
  return s && s.v === 1 ? (s as Sidecar) : undefined;
};
const PURE_TURNS = new Set(['meta-pure', 'summary', 'impersonate']);

export function formatSynopsis(template: string, s: Synopsis): string {
  return template.replace(/\{\{(time|location|event|summary)\}\}/g, (_, k: keyof Synopsis) => s[k] ?? '');
}

/** Returns the rewritten list (new array; items are shallow copies when changed). */
export function rewriteHistory(items: HistoryItem[], o: RewriteOptions): HistoryItem[] {
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

  // 3. Token saving: count assistant turns from the end.
  if (o.tokenSaving.enabled) {
    let assistants = 0;
    const depth: number[] = new Array(rows.length).fill(0);
    for (let i = rows.length - 1; i >= 0; i--) {
      if (!rows[i]!.item.is_user && !rows[i]!.item.is_system) assistants++;
      depth[i] = assistants;
    }
    const keep = Math.max(0, o.tokenSaving.keepFullTurns);
    // a user message shares the depth of the assistant reply that follows it
    const inFull = (i: number) => depth[i]! <= keep;
    const covered = o.recap?.coversUpTo ?? -1;
    rows = rows.flatMap((r, i) => {
      if (inFull(i) || r.index === o.currentInput) return [r];
      if (covered >= 0 && o.realIndex(r.index) <= covered) return [];
      if (r.item.is_user) {
        const max = o.tokenSaving.truncateUserAfter;
        return [max > 0 && r.item.mes.length > max ? { ...r, item: { ...r.item, mes: `${r.item.mes.slice(0, max)}…` } } : r];
      }
      const syn = o.synopsisId ? (sidecarOf(r.item)?.structures?.[o.synopsisId] as Synopsis | undefined) : undefined;
      return [syn ? { ...r, item: { ...r.item, mes: formatSynopsis(o.synopsisTemplate, syn) } } : r];
    });
  }
  // 4. Inline annotations: only untouched assistant messages near the end.
  const depth = o.annotations?.depth ?? 0;
  if (depth > 0) {
    let seen = 0;
    for (let i = rows.length - 1; i >= 0 && seen < depth; i--) {
      const r = rows[i]!;
      if (r.item.is_user || r.item.is_system) continue;
      seen++;
      const list = sidecarOf(r.item)?.annotations;
      if (!list?.length || r.item.mes !== items[r.index]!.mes) continue;
      const mes = injectAnnotations(r.item.mes, list);
      if (mes !== r.item.mes) rows[i] = { ...r, item: { ...r.item, mes } };
    }
  }
  return rows.map((r) => r.item);
}

/** History re-injection depth for the preset (I-80): the annotations structure is declared by a switched-on module. */
export function annotationHistory(preset: APreset, config: Configuration): { depth: number } | undefined {
  const decl = Object.values(preset.structures).find((s) => s.kind === 'annotations');
  if (!decl?.history) return undefined;
  const requested = activeModules(preset, config).some((m) => m.structures.includes(decl.id));
  return requested ? { depth: decl.history } : undefined;
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
