import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Synopsis } from '@advanced-preset/protocol';
import { getSidecar, withStructure, type Sidecar } from '@/store/sidecar';
import { setStructure } from '@/ui/actions';
import { rewriteHistory, type HistoryItem } from '@/core/history';

const synopsis: Synopsis = { time: 'Dusk', location: 'Harbor', event: 'Arrival', summary: 'The ship docks.' };
const sidecar = (): Sidecar => ({
  v: 1, presetId: 'p', presetVersion: '1.0.0', genId: 'g', origin: 'story', transport: 'structured', workflow: 'linear', turn: 'story',
  stages: [], patchesApplied: false, structures: { synopsis, options: [{ label: 'a', content: 'b' }] }, events: [],
});

function mockST(chat: unknown[]) {
  const ctx = { chat, saveChat: vi.fn(async () => {}), updateMessageBlock: vi.fn(), eventSource: { emit: vi.fn(async () => {}) }, eventTypes: {} };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
  return ctx;
}

afterEach(() => { delete (globalThis as any).SillyTavern; });

describe('withStructure', () => {
  it('replaces one structure without touching the original or other structures', () => {
    const sc = sidecar();
    const edited = { ...synopsis, event: 'Departure' };
    const next = withStructure(sc, 'synopsis', edited);
    expect(next.structures.synopsis).toEqual(edited);
    expect(next.structures.synopsis).not.toBe(edited);
    expect(next.structures.options).toBe(sc.structures.options);
    expect(sc.structures.synopsis).toEqual(synopsis);
  });
});

describe('setStructure', () => {
  it('writes the message and its current swipe, saves, and leaves mes alone', async () => {
    const sc = sidecar();
    const msg = { name: 'A', is_user: false, mes: 'Story', swipe_id: 1, swipes: ['old', 'Story'], swipe_info: [{ extra: {} }, { extra: { advanced_preset: sc } }], extra: { advanced_preset: sc } };
    const ctx = mockST([{ name: 'U', is_user: true, mes: 'hi' }, msg]);
    const edited = { ...synopsis, time: 'Midnight', summary: 'Edited by hand.' };
    expect(await setStructure(1, 'synopsis', edited)).toBe(true);
    expect(getSidecar(msg as any)?.structures.synopsis).toEqual(edited);
    expect((msg.swipe_info[1]!.extra as any).advanced_preset.structures.synopsis).toEqual(edited);
    expect(msg.swipe_info[0]!.extra).toEqual({});
    expect(msg.mes).toBe('Story');
    expect(ctx.saveChat).toHaveBeenCalledOnce();
    expect(ctx.updateMessageBlock).not.toHaveBeenCalled();
    expect(ctx.eventSource.emit).not.toHaveBeenCalled();
  });
  it('does nothing for messages without a sidecar', async () => {
    const ctx = mockST([{ name: 'A', is_user: false, mes: 'x' }]);
    expect(await setStructure(0, 'synopsis', synopsis)).toBe(false);
    expect(await setStructure(5, 'synopsis', synopsis)).toBe(false);
    expect(ctx.saveChat).not.toHaveBeenCalled();
  });
  it('later requests use the edited synopsis', async () => {
    const sc = sidecar();
    const msg = { name: 'A', is_user: false, mes: 'Story', extra: { advanced_preset: sc } };
    mockST([msg, { name: 'U', is_user: true, mes: 'next' }]);
    await setStructure(0, 'synopsis', { ...synopsis, event: 'Edited event' });
    const items = [msg, { is_user: true, mes: 'next' }] as HistoryItem[];
    const out = rewriteHistory(items, {
      trigger: '', wrap: true, tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 5, userInput: 'truncate' },
      synopsisTemplate: '{{event}}', synopsisId: 'synopsis', synopsisHistory: { depth: 1, template: '{{content}} [{{time}}] {{event}}' },
      recap: null, realIndex: (i) => i, currentInput: 1,
    });
    expect(out[0]!.mes).toBe('Story [Dusk] Edited event');
  });
});
