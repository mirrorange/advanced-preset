/**
 * Storylines (I-144 – I-152): which storyline each chat message belongs to, how the history of a
 * generation is arranged, and the group marks that carry the arrangement to PROMPT_READY.
 *
 * - A user message belongs to the storyline of its trailing `#tag` (none: the main storyline).
 * - An assistant message belongs to the storyline stored on its swipe (`extra.advanced_preset_storyline`,
 *   written when AP generated it or when the main storyline was switched); otherwise, like system
 *   messages, to the storyline of the message before it.
 * - The main storyline may have a name (chat metadata); a tag with that name is the main storyline.
 *
 * Arranged history: [other normal storylines, by first appearance][main][current, if not main].
 * If-lines are only visible to themselves. Pure functions; the chat is never touched here.
 */
import { isIfName, parseStorylineTag, stripStorylineTag, type StorylineVars } from '@advanced-preset/protocol';

/** Per-swipe storyline of an assistant message (`''`: the main storyline). */
export const STORYLINE_KEY = 'advanced_preset_storyline';

/** `chatMetadata.advanced_preset.storylines`. */
export interface StorylineMeta {
  /** Name of the main storyline (unset: unnamed). */
  main?: string;
  /** If-line switches set by the user (otherwise names starting with `if`). */
  if?: Record<string, boolean>;
}

export interface LineMessage {
  is_user: boolean;
  is_system?: boolean;
  mes: string;
  extra?: Record<string, any>;
}

/** Storyline name of each message as written (`''`: untagged). Not resolved against the main storyline's name. */
export function messageLines(chat: readonly LineMessage[]): string[] {
  const out: string[] = [];
  let prev = '';
  for (const m of chat) {
    let line = prev;
    if (m.is_user) line = parseStorylineTag(m.mes)?.name ?? '';
    else {
      const v = m.extra?.[STORYLINE_KEY];
      if (typeof v === 'string') line = v;
    }
    out.push(line);
    prev = line;
  }
  return out;
}

/** Key of a storyline: `''` for the main storyline (untagged or tagged with the main storyline's name). */
export const lineKey = (name: string, meta: StorylineMeta): string => (name === '' || name === meta.main ? '' : name);

export function isIfLine(key: string, meta: StorylineMeta): boolean {
  if (key === '') return false;
  return meta.if?.[key] ?? isIfName(key);
}

/** Display name of a storyline key (`''` → the main storyline's name, possibly empty). */
export const lineName = (key: string, meta: StorylineMeta): string => (key === '' ? meta.main ?? '' : key);

export interface StorylineGroup {
  key: string;
  name: string;
  main: boolean;
  if: boolean;
}

export interface Arrangement {
  /** Key of the current storyline. */
  current: string;
  /** Visible storylines in history order (group index = position). */
  groups: StorylineGroup[];
  /** Input indices in arranged order (messages of invisible if-lines left out). */
  order: number[];
  /** Group index of each entry of `order`. */
  groupOf: number[];
  /** Messages of if-lines that this storyline does not see. */
  hidden: number;
  /** More than one storyline is visible: the history is grouped and gets separators. */
  grouped: boolean;
  /** The current storyline has no message other than `exclude` (this turn starts it). */
  isNew: boolean;
}

/**
 * Arranges items (their storyline keys in `keys`) for the storyline `current`. `exclude` (the
 * current input) does not count when deciding whether the storyline is new.
 */
export function arrangeLines(keys: readonly string[], current: string, meta: StorylineMeta, exclude = -1): Arrangement {
  const seen: string[] = [];
  for (const k of keys) if (k !== '' && k !== current && !seen.includes(k)) seen.push(k);
  const visible = (k: string) => k === '' || k === current || !isIfLine(k, meta);
  const groupKeys = [...seen.filter(visible), '', ...(current !== '' ? [current] : [])];
  const groups: StorylineGroup[] = groupKeys.map((key) => ({ key, name: lineName(key, meta), main: key === '', if: isIfLine(key, meta) }));
  const index = new Map(groupKeys.map((k, i) => [k, i]));
  const order: number[] = [];
  const groupOf: number[] = [];
  let hidden = 0;
  for (let g = 0; g < groupKeys.length; g++) {
    keys.forEach((k, i) => {
      if (index.get(k) === g) { order.push(i); groupOf.push(g); }
    });
  }
  keys.forEach((k) => { if (!index.has(k)) hidden++; });
  const present = new Set(order.map((i) => keys[i]));
  const grouped = groupKeys.filter((k) => present.has(k)).length > 1;
  const isNew = !keys.some((k, i) => k === current && i !== exclude);
  return { current, groups, order, groupOf, hidden, grouped, isNew };
}

/** `storyline.*` of a generation on `current`. */
export function storylineVars(current: string, meta: StorylineMeta, isNew: boolean): StorylineVars {
  return { name: lineName(current, meta), main: current === '', if: isIfLine(current, meta), new: isNew };
}

/** Text without the storyline tag (user messages only; what the model and the classifier see). */
export const untagged = (m: LineMessage): string => (m.is_user ? stripStorylineTag(m.mes) : m.mes);

// ---- group marks (interceptor / backfill → PROMPT_READY) -------------------------------------

/** Group marks: supplementary private use U+F0100 + group, distinct from the cache and input marks. */
const MARK_BASE = 0xf0100;
export const MAX_GROUPS = 256;
const LINE_MARK_RE = /⟦\uDB80([\uDD00-\uDDFF])⟧/g;

export const lineMark = (group: number): string => `⟦${String.fromCodePoint(MARK_BASE + Math.min(group, MAX_GROUPS - 1))}⟧`;

/** The text without group marks and the first group found (-1: none). */
export function takeLineMark(text: string): { text: string; group: number } {
  if (!text.includes('⟦')) return { text, group: -1 };
  let group = -1;
  const out = text.replace(LINE_MARK_RE, (_, low: string) => {
    if (group < 0) group = low.charCodeAt(0) - 0xdd00;
    return '';
  });
  return { text: out, group };
}

// ---- arranging the final prompt (PROMPT_READY) -----------------------------------------------

/** A prompt message (Chat Completion shape, see `@/st/host`). */
export interface PromptMessage {
  role: string;
  content: unknown;
  tool_calls?: unknown[];
}

export interface PlaceOptions<M extends PromptMessage> {
  /** Group of a history message (-1: not a chat message of the history: injection, nudge, …). */
  groupOf: (m: M) => number;
  /** Group index of the current storyline and of the main storyline. */
  current: number;
  main: number;
  /** Separator before the messages of group `g` (`null`: none). */
  separator: (g: number) => M | null;
  /** Messages ST appends after the history (empty-message replacement, group nudge): kept at the end. */
  isNudge: (m: M) => boolean;
}

/**
 * Groups the history messages `[from, to)` of `list` in place (stable by group index) with a
 * separator before each group. Other messages in the range are placed like ST placed them, but
 * relative to the history without the current storyline (world info and depth injections drive the
 * main storyline): an injection `d` chat messages before the end stays `d` messages before the end
 * of `[other storylines][main]`. Tool call / result messages follow the message they belong to;
 * messages before the first history message and trailing nudges stay where they are.
 * Returns the new end of the range.
 */
export function placeLines<M extends PromptMessage>(list: M[], from: number, to: number, o: PlaceOptions<M>): number {
  const range = list.slice(from, to);
  let end = range.length;
  while (end > 0 && o.groupOf(range[end - 1]!) < 0 && o.isNudge(range[end - 1]!)) end--;
  const first = range.findIndex((m, i) => i < end && o.groupOf(m) >= 0);
  if (first < 0) return to;
  type Entry = { m: M; g: number; followers: M[]; before: M[] };
  const entries: Entry[] = [];
  const injections: { m: M; depth: number }[] = [];
  const after: number[] = new Array(end + 1).fill(0);
  for (let i = end - 1; i >= 0; i--) after[i] = after[i + 1]! + (o.groupOf(range[i]!) >= 0 ? 1 : 0);
  for (let i = first; i < end; i++) {
    const m = range[i]!;
    const g = o.groupOf(m);
    if (g >= 0) entries.push({ m, g, followers: [], before: [] });
    else if (m.role === 'tool' || (Array.isArray(m.tool_calls) && m.tool_calls.length)) entries[entries.length - 1]!.followers.push(m);
    else injections.push({ m, depth: after[i + 1]! });
  }
  const seq = [...entries].sort((a, b) => a.g - b.g);
  const base = o.current !== o.main ? seq.filter((e) => e.g !== o.current) : seq;
  const atEnd: M[] = [];
  for (const inj of injections) {
    const pos = Math.max(0, base.length - inj.depth);
    if (pos >= base.length) atEnd.push(inj.m);
    else base[pos]!.before.push(inj.m);
  }
  const out: M[] = range.slice(0, first);
  let group = -1;
  let flushed = false;
  for (const e of seq) {
    if (e.g !== group) {
      group = e.g;
      if (group === o.current && o.current !== o.main) { out.push(...atEnd); flushed = true; }
      const sep = o.separator(group);
      if (sep) out.push(sep);
    }
    out.push(...e.before, e.m, ...e.followers);
  }
  if (!flushed) out.push(...atEnd);
  out.push(...range.slice(end));
  list.splice(from, to - from, ...out);
  return from + out.length;
}

// ---- one generation ---------------------------------------------------------------------------

/** Storylines of a generation (GenerationContext.storylines). */
export interface StorylineTurn {
  /** Key of the current storyline (`''`: main). */
  current: string;
  vars: StorylineVars;
  /** Name of the main storyline (may be empty). */
  mainName: string;
  groups: StorylineGroup[];
  currentGroup: number;
  mainGroup: number;
  grouped: boolean;
  /** Messages left out (if-lines this storyline does not see). */
  hidden: number;
  /** Group of each history message of the prompt (read from the marks at PROMPT_READY, set by the backfill). */
  marks?: WeakMap<object, number>;
}

/**
 * Arranges history items (copies of chat messages, `realIndex` into the chat whose storyline keys
 * are `realKeys`) for the storyline of `currentInput` (or of the last item). Returns new item
 * copies without storyline tags, in arranged order, with their real indices and groups.
 */
export function arrangeTurn<T extends LineMessage>(items: readonly T[], realIndex: readonly number[], realKeys: readonly string[], currentInput: number, meta: StorylineMeta): {
  items: T[]; realIndex: number[]; groups: number[]; currentInput: number; turn: StorylineTurn;
} {
  const own = messageLines(items).map((l) => lineKey(l, meta));
  const keys = items.map((_, i) => {
    const r = realIndex[i] ?? -1;
    return r >= 0 && r < realKeys.length ? realKeys[r]! : own[i]!;
  });
  const at = currentInput >= 0 ? currentInput : items.length - 1;
  const current = at >= 0 ? keys[at]! : '';
  const a = arrangeLines(keys, current, meta, currentInput);
  const outItems = a.order.map((i) => {
    const it = items[i]!;
    const mes = untagged(it);
    return mes === it.mes ? it : { ...it, mes };
  });
  const turn: StorylineTurn = {
    current,
    vars: storylineVars(current, meta, a.isNew),
    mainName: meta.main ?? '',
    groups: a.groups,
    currentGroup: a.groups.findIndex((g) => g.key === current),
    mainGroup: a.groups.findIndex((g) => g.main),
    grouped: a.grouped,
    hidden: a.hidden,
  };
  return { items: outItems, realIndex: a.order.map((i) => realIndex[i] ?? -1), groups: a.groupOf, currentInput: currentInput >= 0 ? a.order.indexOf(currentInput) : -1, turn };
}

/** History items of side storylines other than the current one (token saving, I-149). */
export const inBackground = (turn: StorylineTurn, group: number | undefined): boolean =>
  group !== undefined && group !== turn.currentGroup && group !== turn.mainGroup;

/** Removes the group marks of `list` (every message) and records the group of each marked message. */
export function takeLineMarks(list: readonly PromptMessage[], into = new WeakMap<object, number>()): WeakMap<object, number> {
  for (const m of list) {
    if (typeof m.content === 'string') {
      const r = takeLineMark(m.content);
      if (r.group >= 0) { m.content = r.text; if (!into.has(m)) into.set(m, r.group); }
      continue;
    }
    if (!Array.isArray(m.content)) continue;
    for (const p of m.content as any[]) {
      if (!p || typeof p !== 'object' || typeof p.text !== 'string') continue;
      const r = takeLineMark(p.text);
      if (r.group >= 0) { p.text = r.text; if (!into.has(m)) into.set(m, r.group); }
    }
  }
  return into;
}
