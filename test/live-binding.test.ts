import { afterEach, describe, expect, it, vi } from 'vitest';
import { bindLive, live, liveOn, type LiveGeneration } from '@/core/live';
import { useMessageView } from '@/ui/message/model';
import { bumpChat } from '@/ui/state';
import type { Sidecar } from '@/store/sidecar';

// The theme builds stylesheets (DOM only).
vi.mock('@/ui/theme', () => ({ actorColor: () => '' }));

const sidecar = (genId: string): Sidecar => ({
  v: 1, presetId: 'p', presetVersion: '1.0.0', genId, origin: 'story', transport: 'structured', workflow: 'linear', turn: 'story',
  stages: [{ id: 'reply', actor: 'narrator', kind: 'content', label: 'Reply', text: 'old', status: 'done' }], patchesApplied: false, structures: {}, events: [],
});

const generation = (over: Partial<LiveGeneration> = {}): LiveGeneration => ({
  genId: 'new', presetId: 'p', transport: 'structured', workflow: 'linear', stages: [], structures: {}, reasoning: '',
  status: 'running', streaming: true, step: 0, startedAt: 0, mesId: null, swipeId: null, ...over,
});

function mockST(chat: any[]) {
  const ctx = { chat, chatMetadata: {}, extensionSettings: {}, eventSource: { emit: vi.fn(async () => {}) }, eventTypes: {} };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
}

/** An assistant message on its second swipe, overswiped to generate a third one. */
function overswiped() {
  const a = sidecar('a');
  const msg: any = { name: 'A', is_user: false, mes: '...', swipe_id: 1, swipes: ['A'], swipe_info: [{ extra: { advanced_preset: a } }], extra: {} };
  return { msg, a };
}

afterEach(() => { live.current = null; delete (globalThis as any).SillyTavern; });

describe('live generation bound to a swipe', () => {
  it('binds the swipe being generated', () => {
    const { msg } = overswiped();
    mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    live.current = generation();
    const g = live.current!;
    bindLive(g, 1);
    expect(g.mesId).toBe(1);
    expect(g.swipeId).toBe(1);
    expect(liveOn(1)).toBe(g);
  });

  it('an interrupted swipe reverted to the previous one shows its stored sidecar again', () => {
    const { msg, a } = overswiped();
    mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    live.current = generation();
    const g = live.current!;
    bindLive(g, 1);
    const view = useMessageView(() => 1);
    expect(view.value?.live).toBe(true);

    // Stopped before any output: ST swipes back to the previous swipe (syncSwipeToMes).
    g.status = 'aborted';
    msg.swipe_id = 0;
    msg.mes = 'A';
    msg.extra = structuredClone(msg.swipe_info[0].extra);
    bumpChat();

    expect(liveOn(1)).toBeNull();
    expect(view.value?.live).toBe(false);
    expect(view.value?.genId).toBe(a.genId);
    expect(view.value?.stages.map((s) => s.text)).toEqual(['old']);
  });

  it('an interrupted swipe that is still selected keeps showing the interrupted generation', () => {
    const { msg } = overswiped();
    mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    live.current = generation();
    const g = live.current!;
    bindLive(g, 1);
    // Stopped with partial output: ST keeps the new swipe (its extra still has no sidecar).
    g.status = 'aborted';
    msg.swipes.push('partial');
    bumpChat();
    expect(useMessageView(() => 1).value?.live).toBe(true);
  });
});
