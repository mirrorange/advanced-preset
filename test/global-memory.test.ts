import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MemoryOp } from '@advanced-preset/protocol';
import {
  appendGlobal, commitGlobalOps, ensureEventIds, globalMemory, planMemoryOps, refId, revertGlobalEvent, setGlobalActive, undoGlobal,
  type MemoryEvent,
} from '@/store/eventlog';
import type { PresetState } from '@/store/settings';

const state = (log: MemoryEvent[] = [], cursor = log.length): PresetState =>
  ({ active: { ref: { kind: 'recommended', id: 'x' }, diff: {} }, saved: [], globalMemory: { log, cursor } }) as PresetState;

const ops: MemoryOp[] = [
  { scope: 'global_memory', operation: 'replace', key: 'taboo', content: 'no gore' },
  { scope: 'chat_memory', operation: 'replace', key: 'mood', content: 'calm' },
  { scope: 'global_memory', operation: 'delete', key: 'style' },
] as MemoryOp[];

beforeEach(() => {
  (globalThis as any).SillyTavern = { getContext: () => ({ extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {} }) };
});
afterEach(() => { delete (globalThis as any).SillyTavern; });

describe('global memory events', () => {
  it('plans global ops with ids referenced by the sidecar, without touching the log', () => {
    const { events, global } = planMemoryOps(ops);
    expect(events.map((e) => e.type)).toEqual(['global.ref', 'memory.replace', 'global.ref']);
    expect(global).toHaveLength(2);
    expect(events.filter((e) => e.type === 'global.ref').map(refId)).toEqual(global.map((g) => g.id));
    expect(global[1]).not.toHaveProperty('content');
  });

  it('commits planned ops once, with their ids', () => {
    const s = state();
    const { global } = planMemoryOps(ops);
    commitGlobalOps(s, global);
    commitGlobalOps(s, global);
    expect(s.globalMemory.log.map((e) => e.id)).toEqual(global.map((g) => g.id));
    expect(s.globalMemory.log.every((e) => e.source === 'model')).toBe(true);
    expect(globalMemory(s)).toEqual({ taboo: 'no gore' });
  });

  it('inactive events are skipped and can be switched back on', () => {
    const s = state();
    appendGlobal(s, 'replace', 'a', '1', 'user', 'e1');
    appendGlobal(s, 'replace', 'a', '2', 'model', 'e2');
    appendGlobal(s, 'replace', 'b', 'x', 'model', 'e3');
    expect(setGlobalActive(s, ['e2', 'e3'], false)).toBe(true);
    expect(globalMemory(s)).toEqual({ a: '1' });
    expect(setGlobalActive(s, ['e2', 'e3'], false)).toBe(false);
    expect(setGlobalActive(s, ['e2'], true)).toBe(true);
    expect(globalMemory(s)).toEqual({ a: '2' });
    expect(s.globalMemory.log[1]).not.toHaveProperty('inactive');
  });

  it('ignores ids that are no longer on the chain (undo followed by a new edit)', () => {
    const s = state();
    appendGlobal(s, 'replace', 'a', '1', 'model', 'e1');
    undoGlobal(s);
    appendGlobal(s, 'replace', 'a', 'user', 'user', 'e2');
    expect(s.globalMemory.log.map((e) => e.id)).toEqual(['e2']);
    expect(setGlobalActive(s, ['e1'], false)).toBe(false);
    expect(setGlobalActive(s, ['e1'], true)).toBe(false);
    expect(globalMemory(s)).toEqual({ a: 'user' });
  });

  it('gives legacy entries ids that match legacy index refs', () => {
    const legacy = [
      { op: 'replace', key: 'a', content: '1', prev: null, source: 'model', at: 0 },
      { op: 'replace', key: 'b', content: '2', prev: null, source: 'model', at: 0 },
    ] as unknown as MemoryEvent[];
    const s = state(legacy);
    expect(ensureEventIds(s.globalMemory.log)).toBe(true);
    expect(ensureEventIds(s.globalMemory.log)).toBe(false);
    const id = refId({ type: 'global.ref', index: 1 })!;
    expect(setGlobalActive(s, [id], false)).toBe(true);
    expect(globalMemory(s)).toEqual({ a: '1' });
  });

  it('reverts one event by id', () => {
    const s = state();
    appendGlobal(s, 'replace', 'a', '1', 'user', 'e1');
    appendGlobal(s, 'replace', 'a', '2', 'model', 'e2');
    revertGlobalEvent(s, 'e2');
    expect(globalMemory(s)).toEqual({ a: '1' });
    revertGlobalEvent(s, 'missing');
    expect(s.globalMemory.log).toHaveLength(3);
  });
});
