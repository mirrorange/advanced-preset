/**
 * Memory and recap event logs (§12.2–12.3, D13).
 * - Chat memory: events on the active swipe of every message, folded from message 0 — deleting or
 *   swiping messages rolls back naturally.
 * - Global memory: an append-only log per AP preset with a cursor (undo / redo). Events written by a
 *   turn carry a stable id that the turn's sidecar references; they are switched off while that
 *   message version is revoked (deleted, regenerated, swiped away) and back on when it is selected
 *   again (I-98).
 */
import { cloneData } from '@advanced-preset/protocol';
import type { MemoryOp } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import { getSidecar } from './sidecar';
import { save } from './settings';
import type { PresetState } from './settings';

export type MemoryMap = Record<string, string>;

export type ChatEvent =
  | { type: 'memory.replace'; key: string; content: string; source: 'model' | 'user' }
  | { type: 'memory.delete'; key: string; source: 'model' | 'user' }
  | { type: 'recap.set'; text: string; coversUpTo: number; source: 'model' | 'user' }
  /** Reference to a global-memory log entry produced by this turn (`index`: refs written before ids existed). */
  | { type: 'global.ref'; id?: string; index?: number };

export interface MemoryEvent {
  /** Stable id (log positions shift when undo is followed by a new edit). */
  id: string;
  op: 'replace' | 'delete';
  key: string;
  content?: string;
  /** Value before this event (null = absent), so undo can be expressed as a compensating event. */
  prev: string | null;
  source: 'model' | 'user' | 'undo';
  at: number;
  /** The message version that wrote this event is currently revoked; the event is skipped. */
  inactive?: boolean;
}

/** A global operation of a finished turn, committed once its message exists (I-98). */
export interface PendingGlobalOp { id: string; op: MemoryEvent['op']; key: string; content?: string }

export function newEventId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Id of a legacy log entry: its position when ids were introduced, which is what legacy refs point at. */
export const legacyEventId = (index: number) => `legacy-${index}`;

/** Give legacy log entries their ids. Returns whether anything changed. */
export function ensureEventIds(log: MemoryEvent[]): boolean {
  let changed = false;
  log.forEach((e, i) => { if (!e.id) { e.id = legacyEventId(i); changed = true; } });
  return changed;
}

/** Log id a chat event refers to (legacy refs only have the log index). */
export function refId(e: ChatEvent): string | undefined {
  if (e.type !== 'global.ref') return undefined;
  return e.id ?? (typeof e.index === 'number' ? legacyEventId(e.index) : undefined);
}

export const findGlobal = (state: PresetState, id: string): number => state.globalMemory.log.findIndex((e) => e.id === id);

const META_KEY = 'advanced_preset';

function seedEvents(): ChatEvent[] {
  return (st().chatMetadata?.[META_KEY]?.seedEvents as ChatEvent[] | undefined) ?? [];
}

/** Every chat event in order, with the message index it belongs to (-1 = seed). */
export function chatEvents(upTo = Infinity): { at: number; event: ChatEvent }[] {
  const out = seedEvents().map((event) => ({ at: -1, event }));
  st().chat.forEach((m, i) => {
    if (i > upTo) return;
    for (const event of getSidecar(m)?.events ?? []) out.push({ at: i, event });
  });
  return out;
}

export function chatMemory(upTo = Infinity): MemoryMap {
  const mem: MemoryMap = {};
  for (const { event: e } of chatEvents(upTo)) {
    if (e.type === 'memory.replace') mem[e.key] = e.content;
    else if (e.type === 'memory.delete') delete mem[e.key];
  }
  return mem;
}

export interface RecapState { text: string; coversUpTo: number; at: number }

export function currentRecap(upTo = Infinity): RecapState | null {
  let r: RecapState | null = null;
  for (const { at, event: e } of chatEvents(upTo)) if (e.type === 'recap.set') r = e.text ? { text: e.text, coversUpTo: e.coversUpTo, at } : null;
  return r;
}

/** Append a user-sourced chat event on the last message's active swipe (or the chat seed). */
export async function appendUserChatEvent(event: ChatEvent): Promise<void> {
  const ctx = st();
  const last = ctx.chat.length - 1;
  const msg = ctx.chat[last];
  const sc = getSidecar(msg);
  if (msg && sc) {
    sc.events.push(event);
    const info = msg.swipe_info?.[msg.swipe_id ?? 0];
    if (info?.extra?.[META_KEY]) (info.extra[META_KEY] as { events: ChatEvent[] }).events = cloneData(sc.events);
    await ctx.saveChat();
  } else {
    const meta = (ctx.chatMetadata[META_KEY] ??= {});
    (meta.seedEvents ??= []).push(event);
    await ctx.saveMetadata();
  }
}

// ---- global memory -------------------------------------------------------------------------

export function globalMemory(state: PresetState): MemoryMap {
  const mem: MemoryMap = {};
  for (const e of state.globalMemory.log.slice(0, state.globalMemory.cursor)) {
    if (e.inactive) continue;
    if (e.op === 'replace') mem[e.key] = e.content ?? '';
    else delete mem[e.key];
  }
  return mem;
}

/**
 * Append a global event at the cursor (discarding any redo tail: references to those events are no
 * longer on the chain and are ignored from then on). Returns its log index.
 */
export function appendGlobal(state: PresetState, op: MemoryEvent['op'], key: string, content: string | undefined, source: MemoryEvent['source'], id = newEventId()): number {
  const g = state.globalMemory;
  ensureEventIds(g.log);
  const prev = globalMemory(state)[key] ?? null;
  g.log.splice(g.cursor);
  g.log.push({ id, op, key, content, prev, source, at: Date.now() });
  g.cursor = g.log.length;
  save();
  return g.cursor - 1;
}

export const canUndoGlobal = (s: PresetState) => s.globalMemory.cursor > 0;
export const canRedoGlobal = (s: PresetState) => s.globalMemory.cursor < s.globalMemory.log.length;
export function undoGlobal(s: PresetState) { if (canUndoGlobal(s)) { s.globalMemory.cursor--; save(); } }
export function redoGlobal(s: PresetState) { if (canRedoGlobal(s)) { s.globalMemory.cursor++; save(); } }

/** Undo one specific global event (card action): append a compensating event restoring `prev`. */
export function revertGlobalEvent(state: PresetState, id: string): void {
  const e = state.globalMemory.log[findGlobal(state, id)];
  if (!e) return;
  if (e.prev === null) appendGlobal(state, 'delete', e.key, undefined, 'undo');
  else appendGlobal(state, 'replace', e.key, e.prev, 'undo');
}

/**
 * Plan model memory operations: chat ops become sidecar events; global ops get their ids now (the
 * sidecar references them) but are only committed to the log when the message arrives, so a turn
 * that never becomes a message leaves no global memory behind.
 */
export function planMemoryOps(ops: MemoryOp[]): { events: ChatEvent[]; global: PendingGlobalOp[] } {
  const events: ChatEvent[] = [];
  const global: PendingGlobalOp[] = [];
  for (const op of ops) {
    if (op.scope === 'global_memory') {
      const id = newEventId();
      global.push({ id, op: op.operation, key: op.key, ...(op.operation === 'replace' ? { content: op.content ?? '' } : {}) });
      events.push({ type: 'global.ref', id });
    } else if (op.operation === 'replace') events.push({ type: 'memory.replace', key: op.key, content: op.content ?? '', source: 'model' });
    else events.push({ type: 'memory.delete', key: op.key, source: 'model' });
  }
  return { events, global };
}

/** Commit planned global operations (on message receipt). */
export function commitGlobalOps(state: PresetState, ops: PendingGlobalOp[]): void {
  for (const op of ops) if (findGlobal(state, op.id) < 0) appendGlobal(state, op.op, op.key, op.content, 'model', op.id);
}

/**
 * Switch events on or off by id (message version selected / revoked). Ids that are not in the log —
 * dropped by undo followed by a new edit, or from another installation — are ignored. Returns
 * whether anything changed (the caller saves).
 */
export function setGlobalActive(state: PresetState, ids: Iterable<string>, active: boolean): boolean {
  let changed = false;
  for (const id of ids) {
    const e = state.globalMemory.log[findGlobal(state, id)];
    if (!e || !e.inactive === active) continue;
    if (active) delete e.inactive;
    else e.inactive = true;
    changed = true;
  }
  return changed;
}
