/**
 * Memory and recap event logs (§12.2–12.3, D13).
 * - Chat memory: events on the active swipe of every message, folded from message 0 — deleting or
 *   swiping messages rolls back naturally.
 * - Global memory: an append-only log per AP preset with a cursor (undo / redo), not tied to messages.
 */
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
  /** Reference to a global-memory log entry produced by this turn. */
  | { type: 'global.ref'; index: number };

export interface MemoryEvent {
  op: 'replace' | 'delete';
  key: string;
  content?: string;
  /** Value before this event (null = absent), so undo can be expressed as a compensating event. */
  prev: string | null;
  source: 'model' | 'user' | 'undo';
  at: number;
}

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
    if (info?.extra?.[META_KEY]) (info.extra[META_KEY] as { events: ChatEvent[] }).events = structuredClone(sc.events);
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
    if (e.op === 'replace') mem[e.key] = e.content ?? '';
    else delete mem[e.key];
  }
  return mem;
}

/** Append a global event at the cursor (discarding any redo tail). Returns its log index. */
export function appendGlobal(state: PresetState, op: MemoryEvent['op'], key: string, content: string | undefined, source: MemoryEvent['source']): number {
  const g = state.globalMemory;
  const prev = globalMemory(state)[key] ?? null;
  g.log.splice(g.cursor);
  g.log.push({ op, key, content, prev, source, at: Date.now() });
  g.cursor = g.log.length;
  save();
  return g.cursor - 1;
}

export const canUndoGlobal = (s: PresetState) => s.globalMemory.cursor > 0;
export const canRedoGlobal = (s: PresetState) => s.globalMemory.cursor < s.globalMemory.log.length;
export function undoGlobal(s: PresetState) { if (canUndoGlobal(s)) { s.globalMemory.cursor--; save(); } }
export function redoGlobal(s: PresetState) { if (canRedoGlobal(s)) { s.globalMemory.cursor++; save(); } }

/** Undo one specific global event (card action): append a compensating event restoring `prev`. */
export function revertGlobalEvent(state: PresetState, index: number): void {
  const e = state.globalMemory.log[index];
  if (!e) return;
  if (e.prev === null) appendGlobal(state, 'delete', e.key, undefined, 'undo');
  else appendGlobal(state, 'replace', e.key, e.prev, 'undo');
}

/** Apply model memory operations: chat ops become sidecar events, global ops go to the log now. */
export function applyMemoryOps(state: PresetState, ops: MemoryOp[]): ChatEvent[] {
  const events: ChatEvent[] = [];
  for (const op of ops) {
    if (op.scope === 'global_memory') {
      const index = appendGlobal(state, op.operation, op.key, op.content ?? '', 'model');
      events.push({ type: 'global.ref', index });
    } else if (op.operation === 'replace') events.push({ type: 'memory.replace', key: op.key, content: op.content ?? '', source: 'model' });
    else events.push({ type: 'memory.delete', key: op.key, source: 'model' });
  }
  return events;
}
