/**
 * Storylines (I-144 – I-152): which storyline each chat message belongs to, how the history of a
 * generation is arranged, and the group marks that carry the arrangement to PROMPT_READY.
 *
 * - A user message belongs to the storyline of its trailing `#tag` (none: the main storyline). `#?` /
 *   `#!?` follow the reply after them (the AI named the storyline there); `#` / `#!` without a name
 *   (normally rewritten to the name when sent) mean the most recent other storyline before them.
 * - An assistant message belongs to the storyline stored on its swipe (`extra.advanced_preset_storyline`,
 *   written when AP generated it or when the main storyline was switched); otherwise, like system
 *   messages, to the storyline of the message before it.
 * - The main storyline may have a name (chat metadata); a tag with that name is the main storyline.
 * - A turn may see the chat differently from the stored data (I-159): a `#?` input is a new storyline
 *   still without a name; a `#!` input makes its storyline the main one once the reply is received,
 *   but the turn already sees the history that way ({@link planTurn}).
 *
 * Arranged history: [other normal storylines, by first appearance][main][current, if not main].
 * If-lines are only visible to themselves. Pure functions; the chat is never touched here.
 */
import { isIfName, parseStorylineTag, replaceStorylineTag, stripStorylineTag, type StorylineVars } from '@advanced-preset/protocol';

/** Per-swipe storyline of an assistant message (`''`: the main storyline). */
export const STORYLINE_KEY = 'advanced_preset_storyline';
/** On a `#!?` user message: its new main storyline exists (a swipe only renames it). */
export const SWITCHED_KEY = 'advanced_preset_storyline_switched';

/**
 * Keys of storylines without a name yet (never valid names, which cannot start with `?`):
 * a `#?` / `#!?` input whose reply is missing, the new storyline of this turn, and the unnamed
 * previous main storyline of a `#!` turn.
 */
export const PENDING_LINE = '?';
export const NEW_LINE = '?new';
export const OLD_MAIN_LINE = '?main';
export const isPendingLine = (key: string): boolean => key.startsWith('?');

/** `chatMetadata.advanced_preset.storylines`. */
export interface StorylineMeta {
  /** Name of the main storyline (unset: unnamed). */
  main?: string;
  /** If-line switches set by the user (otherwise names starting with `if`). What the storyline is about (`storyline.if`). */
  if?: Record<string, boolean>;
  /**
   * Visibility switches (I-161): `true` hides the storyline from the other storylines. Otherwise
   * if-lines are hidden and normal storylines visible. The main storyline is always visible.
   */
  hidden?: Record<string, boolean>;
}

export interface LineMessage {
  is_user: boolean;
  is_system?: boolean;
  mes: string;
  extra?: Record<string, any>;
}

/** The storyline stored on an assistant message's current swipe, if any. */
const storedLine = (m: LineMessage | undefined): string | undefined => {
  const v = m && !m.is_user ? m.extra?.[STORYLINE_KEY] : undefined;
  return typeof v === 'string' ? v : undefined;
};

/**
 * Storyline name of each message as written (`''`: untagged). Not resolved against the main
 * storyline's name, except that `meta` tells which names a nameless `#` skips (the main storyline).
 */
export function messageLines(chat: readonly LineMessage[], meta: StorylineMeta = {}): string[] {
  const out: string[] = [];
  let prev = '';
  let recent = '';
  chat.forEach((m, i) => {
    let line = prev;
    if (m.is_user) {
      const tag = parseStorylineTag(m.mes);
      line = !tag ? '' : tag.form === 'name' ? tag.name : tag.form === 'recent' ? recent : storedLine(chat[i + 1]) ?? PENDING_LINE;
    } else {
      const v = storedLine(m);
      if (v !== undefined) line = v;
    }
    out.push(line);
    prev = line;
    if (line !== '' && line !== meta.main && !isPendingLine(line)) recent = line;
  });
  return out;
}

/** Key of a storyline: `''` for the main storyline (untagged or tagged with the main storyline's name). */
export const lineKey = (name: string, meta: StorylineMeta): string => (name === '' || name === meta.main ? '' : name);

export function isIfLine(key: string, meta: StorylineMeta): boolean {
  if (key === '') return false;
  return meta.if?.[key] ?? isIfName(key);
}

/** The storyline is invisible to the other storylines (never the main storyline). Not shown to the AI. */
export function isHiddenLine(key: string, meta: StorylineMeta): boolean {
  if (key === '') return false;
  return meta.hidden?.[key] ?? isIfLine(key, meta);
}

/** Display name of a storyline key (`''` → the main storyline's name, possibly empty; storylines without a name yet: `''`). */
export const lineName = (key: string, meta: StorylineMeta): string => (key === '' ? meta.main ?? '' : isPendingLine(key) ? '' : key);

export interface StorylineGroup {
  key: string;
  name: string;
  main: boolean;
  if: boolean;
  hidden: boolean;
}

export interface Arrangement {
  /** Key of the current storyline. */
  current: string;
  /** Visible storylines in history order (group index = position). */
  groups: StorylineGroup[];
  /** Input indices in arranged order (messages of invisible storylines left out). */
  order: number[];
  /** Group index of each entry of `order`. */
  groupOf: number[];
  /** Messages of invisible storylines that this storyline does not see. */
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
  const visible = (k: string) => k === '' || k === current || !isHiddenLine(k, meta);
  const groupKeys = [...seen.filter(visible), '', ...(current !== '' ? [current] : [])];
  const groups: StorylineGroup[] = groupKeys.map((key) => ({ key, name: lineName(key, meta), main: key === '', if: isIfLine(key, meta), hidden: isHiddenLine(key, meta) }));
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

/** What a turn does to the storylines (I-159). */
export interface TurnNaming {
  /** The AI names the current storyline (`#?`, `#!?`; renames the main storyline on a swipe of a `#!?` turn). */
  naming: boolean;
  /** The AI names the unnamed previous main storyline (a `#!` switch). */
  namingMain: boolean;
  /** The current storyline becomes the main one when the reply is received (`#!name`, `#!?`). */
  switching: boolean;
  /** `#!name`: the storyline that becomes the main one. */
  target?: string;
  /** The previous main storyline's name when it has one (a switch). */
  oldName?: string;
  /** A swipe of a `#!?` turn: the main storyline it created gets the new name. */
  renameMain?: boolean;
  /** `#@…`: the storyline becomes invisible to the others when the reply is received (I-161). */
  hide?: boolean;
  /** `#if?`: the new storyline is an if-line (I-162). */
  ifLine?: boolean;
}

export const NO_NAMING: TurnNaming = { naming: false, namingMain: false, switching: false };

/** `storyline.*` of a generation on `current`. */
export function storylineVars(current: string, meta: StorylineMeta, isNew: boolean, grouped = false, naming: TurnNaming = NO_NAMING): StorylineVars {
  return {
    name: naming.naming ? '' : lineName(current, meta), main: current === '', if: isIfLine(current, meta), new: isNew, grouped,
    naming: naming.naming, namingMain: naming.namingMain, switching: naming.switching,
  };
}

/** How one generation sees the storylines of the chat (I-159). */
export interface TurnPlan extends TurnNaming {
  /** Storyline key of every chat message as this turn sees it. */
  keys: string[];
  /** Storyline metadata as this turn sees it (the main storyline after a `#!` switch). */
  meta: StorylineMeta;
  /** Key of the current storyline. */
  current: string;
  /** Index of the input in the chat (-1: none). */
  input: number;
  /** A nameless `#` / `#!` resolved to the most recent other storyline: the input's new text. */
  rewrite?: string;
  /** A nameless `#` / `#!` with no other storyline before it: back to the main storyline. */
  noRecent?: boolean;
}

/**
 * Plans a generation whose input is chat message `input` (-1: none, the storyline of the last
 * message). Pure: the chat is not touched (the caller applies `rewrite`).
 * - `#` / `#!`: the most recent storyline other than the main one before the input.
 * - `#?`: a new storyline the AI names when replying (`#if?`: an if-line; `#@…`: hidden from the others).
 * - `#!name` / `#!?`: the storyline becomes the main one when the reply is received; the turn sees the
 *   history as if it already were (the previous main storyline is a normal storyline, unnamed ones
 *   named by the AI). A `#!?` input whose switch happened (a swipe) renames the main storyline.
 */
export function planTurn(chat: readonly LineMessage[], input: number, meta: StorylineMeta): TurnPlan {
  const keys = messageLines(chat, meta).map((l) => lineKey(l, meta));
  const plain = (current: string, seen = meta): TurnPlan => ({ keys, meta: seen, current, input, ...NO_NAMING });
  const msg = input >= 0 ? chat[input] : undefined;
  if (!msg) return plain(keys.at(-1) ?? '');
  let tag = msg.is_user ? parseStorylineTag(msg.mes) : null;
  if (!tag) return plain(keys[input] ?? '');
  // Everything after the input (a swipe's message being generated again) belongs to the turn.
  const own = (key: string) => { for (let i = input; i < keys.length; i++) keys[i] = key; };
  let rewrite: string | undefined;
  let noRecent = false;
  if (tag.form === 'recent') {
    let name = '';
    for (let i = input - 1; i >= 0 && !name; i--) if (keys[i] !== '' && !isPendingLine(keys[i]!)) name = keys[i]!;
    rewrite = replaceStorylineTag(msg.mes, tag, name);
    noRecent = !name;
    own(name);
    if (!name) return { ...plain(''), rewrite, noRecent };
    tag = { ...tag, form: 'name', name };
  }
  const extra = rewrite !== undefined ? { rewrite } : {};
  if (!tag.switchMain) {
    // `#@`: applied once the reply is received (visibility never changes what this turn sees).
    const hide = tag.hide ? { hide: true } : {};
    if (tag.form === 'new') {
      own(NEW_LINE);
      // `#if?`: an if-line already (`storyline.if`) before it has a name.
      if (tag.ifLine) return { ...plain(NEW_LINE, { ...meta, if: { ...(meta.if ?? {}), [NEW_LINE]: true } }), naming: true, ifLine: true, ...hide };
      return { ...plain(NEW_LINE), naming: true, ...hide };
    }
    const current = keys[input]!;
    return { ...plain(current), ...extra, ...(current !== '' ? hide : {}) };
  }
  // `#!…`
  if (tag.form === 'name' && lineKey(tag.name, meta) === '') { own(''); return { ...plain(''), ...extra }; }
  if (tag.form === 'new' && msg.extra?.[SWITCHED_KEY]) { own(''); return { ...plain(''), naming: true, renameMain: true }; }
  const target = tag.form === 'name' ? tag.name : '';
  const oldName = meta.main ?? '';
  const mainUsed = keys.some((k, i) => k === '' && i < input && !chat[i]!.is_system);
  const old = oldName || OLD_MAIN_LINE;
  for (let i = 0; i < keys.length; i++) keys[i] = i >= input ? '' : keys[i] === '' ? old : keys[i] === target ? '' : keys[i]!;
  // The previous main storyline stays a visible, normal storyline; the new one is the main storyline.
  const ifs = { ...(meta.if ?? {}), [old]: false };
  delete ifs[target];
  const hidden = { ...(meta.hidden ?? {}) };
  delete hidden[old];
  delete hidden[target];
  const seen: StorylineMeta = { ...(target ? { main: target } : {}), if: ifs, hidden };
  return {
    keys, meta: seen, current: '', input, ...extra,
    naming: tag.form === 'new', namingMain: !oldName && mainUsed, switching: true,
    ...(target ? { target } : {}), ...(oldName ? { oldName } : {}),
  };
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
  /** What the turn does to the storylines (naming, switching the main storyline). */
  naming: TurnNaming;
  /** Index of the input in the chat (-1: none). */
  input: number;
  /** Chat indices as this storyline sees the chat (structures, memory and recap read them, I-153). */
  view: number[];
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
 * Arranges history items (copies of chat messages, `realIndex` into the chat planned in `plan`) for
 * the plan's current storyline. Returns new item copies without storyline tags, in arranged order,
 * with their real indices and groups.
 */
export function arrangeTurn<T extends LineMessage>(items: readonly T[], realIndex: readonly number[], plan: TurnPlan, currentInput: number): {
  items: T[]; realIndex: number[]; groups: number[]; currentInput: number; turn: StorylineTurn;
} {
  const { meta, current } = plan;
  const own = messageLines(items, meta).map((l) => lineKey(l, meta));
  const keys = items.map((_, i) => {
    const r = realIndex[i] ?? -1;
    return r >= 0 && r < plan.keys.length ? plan.keys[r]! : i === currentInput ? current : own[i]!;
  });
  const a = arrangeLines(keys, current, meta, currentInput);
  const naming: TurnNaming = { naming: plan.naming, namingMain: plan.namingMain, switching: plan.switching, ...(plan.target ? { target: plan.target } : {}), ...(plan.oldName ? { oldName: plan.oldName } : {}), ...(plan.renameMain ? { renameMain: true } : {}), ...(plan.hide ? { hide: true } : {}), ...(plan.ifLine ? { ifLine: true } : {}) };
  const outItems = a.order.map((i) => {
    const it = items[i]!;
    const mes = untagged(it);
    return mes === it.mes ? it : { ...it, mes };
  });
  const turn: StorylineTurn = {
    current,
    naming,
    input: plan.input,
    view: arrangeLines(plan.keys, current, meta).order,
    vars: storylineVars(current, meta, a.isNew, a.grouped, naming),
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
