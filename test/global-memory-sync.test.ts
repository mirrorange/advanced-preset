import { beforeEach, describe, expect, it, vi } from 'vitest';
import { appendGlobal, commitGlobalOps, globalMemory, planMemoryOps, undoGlobal, type ChatEvent, type MemoryEvent } from '@/store/eventlog';
import { settings, type PresetState } from '@/store/settings';
import type { Sidecar } from '@/store/sidecar';
import { onMessageSwiped, resetMemorySync, scanGlobalRefs, syncGlobalRefs } from '@/app/memory-sync';

const ctx: any = { extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {}, chatId: 'chat-a', getCurrentChatId: () => ctx.chatId };
(globalThis as any).SillyTavern = { getContext: () => ctx };

const sidecar = (events: ChatEvent[], presetId = 'p'): Sidecar => ({
  v: 1, presetId, presetVersion: '1.0.0', genId: 'g', origin: 'story', transport: 'structured', workflow: 'linear', turn: 'story',
  stages: [], patchesApplied: false, structures: {}, events,
});
const ref = (id: string): ChatEvent => ({ type: 'global.ref', id });
const user = (mes = 'hi') => ({ name: 'U', is_user: true, mes });

/** An assistant message whose swipes reference the given global event ids. */
function message(swipes: string[][], selected = swipes.length - 1, presetId = 'p'): any {
  const info = swipes.map((ids) => ({ extra: { advanced_preset: sidecar(ids.map(ref), presetId) } }));
  return { name: 'A', is_user: false, mes: `v${selected}`, swipe_id: selected, swipes: swipes.map((_, i) => `v${i}`), swipe_info: info, extra: structuredClone(info[selected]!.extra) };
}
function selectSwipe(msg: any, id: number) {
  msg.swipe_id = id;
  msg.mes = msg.swipes[id];
  msg.extra = structuredClone(msg.swipe_info[id].extra) ?? {};
  onMessageSwiped(ctx.chat.indexOf(msg));
}
/** ST overswipe, then AP receives the new version with its own global ops. */
function regenerateBySwipe(msg: any, s: PresetState, newIds: { key: string; content: string }[]) {
  msg.swipe_id = msg.swipes.length;
  onMessageSwiped(ctx.chat.indexOf(msg));
  const plan = planMemoryOps(newIds.map((x) => ({ scope: 'global_memory', operation: 'replace', key: x.key, content: x.content })) as any);
  msg.swipes.push('new');
  msg.swipe_info.push({ extra: structuredClone(msg.extra) });
  const sc = sidecar(plan.events);
  msg.extra.advanced_preset = sc;
  msg.swipe_info[msg.swipe_id].extra.advanced_preset = structuredClone(sc);
  commitGlobalOps(s, plan.global);
  syncGlobalRefs();
  return plan.global.map((g) => g.id);
}

function presetWith(log: [string, string, string][], id = 'p'): PresetState {
  const s = { active: { ref: { kind: 'recommended', id: 'x' }, diff: {} }, saved: [], globalMemory: { log: [] as MemoryEvent[], cursor: 0 } } as PresetState;
  settings().presets[id] = s;
  const st = settings().presets[id]!;
  for (const [eid, key, content] of log) appendGlobal(st, 'replace', key, content, 'model', eid);
  return st;
}

beforeEach(() => {
  resetMemorySync();
  ctx.chatId = 'chat-a';
  ctx.chat = [];
  for (const k of Object.keys(settings().presets)) delete settings().presets[k];
});

describe('scanGlobalRefs', () => {
  it('splits refs of selected versions from other swipes; selected wins', () => {
    const chat = [user(), message([['e1'], ['e2', 'e3']]), user(), message([['e3'], ['e4']], 0)];
    const { active, inactive } = scanGlobalRefs(chat as any);
    expect([...active].map((k) => k.split('\u0000')[1]).sort()).toEqual(['e2', 'e3']);
    expect([...inactive].map((k) => k.split('\u0000')[1]).sort()).toEqual(['e1', 'e4']);
  });
  it('a swipe being generated has no selected version', () => {
    const msg = message([['e1']]);
    msg.swipe_id = 1;
    const { active, inactive } = scanGlobalRefs([msg]);
    expect(active.size).toBe(0);
    // The stale mirror does not count; the old version is just another swipe.
    expect([...inactive].map((k) => k.split('\u0000')[1])).toEqual(['e1']);
  });
});

describe('global memory follows the message lifecycle', () => {
  it('swipe regeneration revokes the old version and selecting it again restores it', () => {
    const s = presetWith([['e1', 'taboo', 'no gore']]);
    const msg = message([['e1']]);
    ctx.chat = [user(), msg];
    syncGlobalRefs({ reload: true });
    expect(globalMemory(s)).toEqual({ taboo: 'no gore' });

    const [e2] = regenerateBySwipe(msg, s, [{ key: 'taboo', content: 'no spiders' }]);
    expect(s.globalMemory.log.find((e) => e.id === 'e1')?.inactive).toBe(true);
    expect(globalMemory(s)).toEqual({ taboo: 'no spiders' });

    selectSwipe(msg, 0);
    expect(globalMemory(s)).toEqual({ taboo: 'no gore' });
    expect(s.globalMemory.log.find((e) => e.id === e2)?.inactive).toBe(true);

    selectSwipe(msg, 1);
    expect(globalMemory(s)).toEqual({ taboo: 'no spiders' });
  });

  it('the old version is already revoked while the new swipe is generated', () => {
    const s = presetWith([['e1', 'taboo', 'no gore']]);
    const msg = message([['e1']]);
    ctx.chat = [user(), msg];
    syncGlobalRefs({ reload: true });
    msg.swipe_id = 1;
    onMessageSwiped(1);
    expect(globalMemory(s)).toEqual({});
  });

  it('deleting or regenerating a message revokes its events', () => {
    const s = presetWith([['e1', 'a', '1'], ['e2', 'b', '2']]);
    ctx.chat = [user(), message([['e1']]), user(), message([['e2']])];
    syncGlobalRefs({ reload: true });
    ctx.chat.length = 3; // ST deleteLastMessage (also used by regenerate)
    syncGlobalRefs();
    expect(globalMemory(s)).toEqual({ a: '1' });
    ctx.chat.splice(1, 2);
    syncGlobalRefs();
    expect(globalMemory(s)).toEqual({});
  });

  it('deleting the selected swipe switches to the remaining version', () => {
    const s = presetWith([['e1', 'k', 'old'], ['e2', 'k', 'new']]);
    const msg = message([['e1'], ['e2']]);
    ctx.chat = [user(), msg];
    syncGlobalRefs({ reload: true });
    expect(globalMemory(s)).toEqual({ k: 'new' });
    // ST deleteSwipe: splice, new swipe_id, MESSAGE_SWIPE_DELETED (extra still stale), then swipe → MESSAGE_SWIPED.
    msg.swipes.splice(1, 1);
    msg.swipe_info.splice(1, 1);
    msg.swipe_id = 0;
    syncGlobalRefs();
    selectSwipe(msg, 0);
    expect(globalMemory(s)).toEqual({ k: 'old' });
    expect(s.globalMemory.log.find((e) => e.id === 'e2')?.inactive).toBe(true);
  });

  it('switching chats does not revoke anything; loading a chat applies its own versions', () => {
    const s = presetWith([['e1', 'k', 'old'], ['e2', 'k', 'new']]);
    const msgA = message([['e1'], ['e2']]);
    ctx.chat = [user(), msgA];
    syncGlobalRefs({ reload: true });
    ctx.chatId = 'chat-b';
    ctx.chat = [user('other')];
    syncGlobalRefs({ reload: true });
    expect(globalMemory(s)).toEqual({ k: 'new' });
    // A branch of chat A where the older version is selected.
    ctx.chatId = 'branch';
    ctx.chat = [user(), message([['e1'], ['e2']], 0)];
    syncGlobalRefs({ reload: true });
    expect(globalMemory(s)).toEqual({ k: 'old' });
    // Chat id changed without CHAT_CHANGED: treated as a load, not as deletions.
    ctx.chatId = 'chat-c';
    ctx.chat = [];
    syncGlobalRefs();
    expect(globalMemory(s)).toEqual({ k: 'old' });
  });

  it('ignores refs that are no longer on the chain', () => {
    const s = presetWith([['e1', 'k', 'model']]);
    const msg = message([['e1'], []]);
    ctx.chat = [user(), msg];
    syncGlobalRefs({ reload: true });
    expect(s.globalMemory.log[0]!.inactive).toBe(true);
    undoGlobal(s);
    appendGlobal(s, 'replace', 'k', 'user', 'user', 'u1');
    selectSwipe(msg, 0);
    expect(s.globalMemory.log.map((e) => e.id)).toEqual(['u1']);
    expect(globalMemory(s)).toEqual({ k: 'user' });
  });

  it('routes refs to the preset that wrote them and leaves user edits alone', () => {
    const p = presetWith([['e1', 'k', 'p']], 'p');
    const q = presetWith([['e1', 'k', 'q']], 'q');
    appendGlobal(q, 'replace', 'manual', 'yes', 'user', 'u1');
    ctx.chat = [user(), message([['e1'], []], 1, 'q')];
    syncGlobalRefs({ reload: true });
    expect(globalMemory(p)).toEqual({ k: 'p' });
    expect(globalMemory(q)).toEqual({ manual: 'yes' });
  });

  it('turns that never became a message leave no global memory', () => {
    const s = presetWith([]);
    planMemoryOps([{ scope: 'global_memory', operation: 'replace', key: 'k', content: 'v' }] as any);
    expect(globalMemory(s)).toEqual({});
  });
});
