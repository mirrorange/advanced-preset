import { afterEach, describe, expect, it, vi } from 'vitest';
import { chatMemory } from '@/store/eventlog';
import { detachRegeneratingSidecar, getSidecar, type Sidecar } from '@/store/sidecar';
import { onMessageSwiped } from '@/app/memory-sync';
import type { ChatEvent } from '@/store/eventlog';

const sidecar = (events: ChatEvent[], presetId = 'p'): Sidecar => ({
  v: 1, presetId, presetVersion: '1.0.0', genId: 'g', origin: 'story', transport: 'structured', workflow: 'linear', turn: 'story',
  stages: [], patchesApplied: false, structures: {}, events,
});

function mockST(chat: any[], extra: Record<string, unknown> = {}) {
  const ctx = { chat, chatMetadata: {}, saveChat: vi.fn(async () => {}), eventSource: { emit: vi.fn(async () => {}) }, eventTypes: {}, ...extra };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
  return ctx;
}

/** ST `syncSwipeToMes`: the message mirrors the selected swipe's extra. */
function selectSwipe(msg: any, id: number) {
  msg.swipe_id = id;
  msg.mes = msg.swipes[id];
  msg.extra = structuredClone(msg.swipe_info[id].extra) ?? {};
}

/** ST overswipe: `swipe_id` points one past the last swipe; `extra` is left as it was (minus a few ST keys). */
function overswipe(msg: any) {
  msg.swipe_id = msg.swipes.length;
}

const remember = (key: string, content: string): ChatEvent => ({ type: 'memory.replace', key, content, source: 'model' });

function twoSwipes() {
  const a = sidecar([remember('mood', 'calm')]);
  const b = sidecar([remember('mood', 'angry'), remember('weapon', 'sword')]);
  const msg: any = {
    name: 'A', is_user: false, mes: 'B', swipe_id: 1, swipes: ['A', 'B'],
    swipe_info: [{ extra: { advanced_preset: a } }, { extra: { advanced_preset: structuredClone(b) } }],
    extra: { advanced_preset: b },
  };
  return msg;
}

afterEach(() => { delete (globalThis as any).SillyTavern; });

describe('chat memory and swipe regeneration', () => {
  it('rolls back the memory written by the swiped turn while the new swipe is generated', () => {
    const msg = twoSwipes();
    mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    expect(chatMemory()).toEqual({ mood: 'angry', weapon: 'sword' });
    overswipe(msg);
    // ST's leftover extra still carries the old turn's events.
    expect(chatMemory()).toEqual({ mood: 'angry', weapon: 'sword' });
    onMessageSwiped(1);
    expect(chatMemory()).toEqual({});
    expect(getSidecar(msg)).toBeUndefined();
    // The swiped-away version keeps its own copy.
    expect((msg.swipe_info[1].extra as any).advanced_preset.events).toHaveLength(2);
  });

  it('a streamed new swipe does not inherit the old sidecar', () => {
    const msg = twoSwipes();
    mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    overswipe(msg);
    onMessageSwiped(1);
    // ST streaming: swipe_info[swipe_id] = clone of the message extra.
    msg.swipes[2] = 'C';
    msg.swipe_info[2] = { extra: structuredClone(msg.extra) };
    expect(msg.swipe_info[2].extra.advanced_preset).toBeUndefined();
    expect(chatMemory()).toEqual({});
  });

  it('memory comes back when an earlier version is selected again', () => {
    const msg = twoSwipes();
    mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    overswipe(msg);
    onMessageSwiped(1);
    selectSwipe(msg, 0);
    expect(chatMemory()).toEqual({ mood: 'calm' });
    selectSwipe(msg, 1);
    expect(chatMemory()).toEqual({ mood: 'angry', weapon: 'sword' });
  });

  it('leaves ordinary swipes and user messages alone', () => {
    const msg = twoSwipes();
    mockST([{ name: 'U', is_user: true, mes: 'hi', extra: { advanced_preset: sidecar([]) } }, msg]);
    onMessageSwiped(1);
    expect(getSidecar(msg)).toBeDefined();
    expect(detachRegeneratingSidecar(0)).toBe(false);
    expect(detachRegeneratingSidecar(5)).toBe(false);
    const plain: any = { name: 'A', is_user: false, mes: 'x', extra: { advanced_preset: sidecar([remember('k', 'v')]) } };
    mockST([plain]);
    expect(detachRegeneratingSidecar(0)).toBe(false);
    expect(chatMemory()).toEqual({ k: 'v' });
  });
});
