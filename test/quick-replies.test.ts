import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, type APreset, type QuickReplyDecl, type QuickReplySetDecl } from '@advanced-preset/protocol';
import type { QuickReplyApi } from '@/st/host';
import { settings } from '@/store/settings';
import { petals } from './helpers';

const { desiredSets, syncQuickReplies } = await import('@/app/quick-replies');

/** ST's Quick Reply extension in memory: sets, the global list, context menus resolved by name when a reply is added. */
function fakeApi() {
  const sets: any[] = [];
  const global: { name: string; isVisible: boolean }[] = [];
  const api: QuickReplyApi = {
    getSetByName: (name) => sets.find((s) => s.name === name),
    createSet: async (name, props = {}) => {
      const set = {
        name, disableSend: false, placeBeforeInput: false, injectInput: false, color: 'transparent', onlyBorderColor: false, ...props,
        qrList: [] as any[], saves: 0,
        addQuickReply(data: Record<string, any>) {
          this.qrList.push({ ...data, id: this.qrList.length + 1, contextList: (data.contextList ?? []).map((c: any) => ({ ...c, set: sets.find((s) => s.name === c.set) ?? null })) });
        },
        save() { this.saves++; },
      };
      sets.push(set);
      return set;
    },
    deleteSet: async (name) => { sets.splice(sets.findIndex((s) => s.name === name), 1); },
    addGlobalSet: (name, isVisible = true) => { if (!global.some((g) => g.name === name)) global.push({ name, isVisible }); },
    removeGlobalSet: (name) => { global.splice(global.findIndex((g) => g.name === name), 1); },
    listGlobalSets: () => global.map((g) => g.name),
  };
  return { api, sets, global };
}

const reply = (id: string, over: Partial<QuickReplyDecl> = {}): QuickReplyDecl => ({
  id, label: id, icon: '', showLabel: false, title: '', message: `@{{ap::name::narrator}} ${id}`, contextList: [], preventAutoExecute: true, isHidden: false, automationId: '',
  executeOnStartup: false, executeOnUser: false, executeOnAi: false, executeOnChatChange: false, executeOnGroupMemberDraft: false, executeOnNewChat: false, executeBeforeGeneration: false,
  ...over,
});
const qrSet = (id: string, name: string, over: Partial<QuickReplySetDecl> = {}): QuickReplySetDecl => ({
  id, name, global: true, visible: true, disableSend: false, placeBeforeInput: false, injectInput: false, color: 'transparent', onlyBorderColor: false, qrList: [reply('a')], ...over,
});
function preset(id: string, sets: QuickReplySetDecl[]): APreset {
  const p = cloneData(petals);
  p.id = id;
  p.quickReplySets = sets;
  return p;
}
const active = (p: APreset) => ({ presetId: p.id, sets: desiredSets(p) });

let lang = 'en';
beforeEach(() => {
  lang = 'en';
  vi.stubGlobal('localStorage', { getItem: () => lang });
  (globalThis as any).toastr = { warning: vi.fn() };
  (globalThis as any).SillyTavern = { getContext: () => ({ extensionSettings: {}, saveSettingsDebounced: vi.fn() }) };
  delete settings().quickReplies;
});
afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; vi.unstubAllGlobals(); });

describe('Quick Reply sets of the active preset', () => {
  it('writes the sets in ST form and adds the global ones to the global list', async () => {
    const p = preset('qa', [
      qrSet('main', 'AP · QA', { color: '#f00', qrList: [reply('a', { icon: 'fa-at', contextList: [{ set: 'AP · QA · more', isChained: true }] }), reply('b')] }),
      qrSet('more', 'AP · QA · more', { global: false }),
    ]);
    const { api, sets, global } = fakeApi();
    await syncQuickReplies(api, active(p), [p]);
    expect(sets.map((s) => s.name)).toEqual(['AP · QA', 'AP · QA · more']);
    const main = sets[0]!;
    expect(main.color).toBe('#f00');
    expect(main.qrList.map((q: any) => [q.label, q.message])).toEqual([['a', '@Freesia a'], ['b', '@Freesia b']]);
    // The context menu set existed before the replies were added.
    expect(main.qrList[0].contextList[0]).toMatchObject({ set: sets[1], isChained: true });
    expect(global).toEqual([{ name: 'AP · QA', isVisible: true }]);
    expect(settings().quickReplies).toEqual({ 'AP · QA': { presetId: 'qa', hash: expect.any(String) }, 'AP · QA · more': { presetId: 'qa', hash: expect.any(String) } });
  });

  it('removes them from the global list with another preset and adds them back', async () => {
    const p = preset('qa', [qrSet('main', 'AP · QA')]);
    const { api, sets, global } = fakeApi();
    await syncQuickReplies(api, active(p), [p]);
    await syncQuickReplies(api, null, [p]);
    expect(global).toEqual([]);
    expect(sets).toHaveLength(1);
    await syncQuickReplies(api, active(p), [p]);
    expect(global.map((g) => g.name)).toEqual(['AP · QA']);
  });

  it('rewrites a set only when its contents change (edits in ST last until then)', async () => {
    const p = preset('qa', [qrSet('main', 'AP · QA')]);
    const { api, sets } = fakeApi();
    await syncQuickReplies(api, active(p), [p]);
    sets[0]!.qrList[0].message = 'edited in ST';
    await syncQuickReplies(api, null, [p]);
    await syncQuickReplies(api, active(p), [p]);
    expect(sets[0]!.qrList[0].message).toBe('edited in ST');
    // A new narrator name changes what AP writes.
    const renamed = cloneData(p);
    renamed.actors.narrator!.name = 'Iris';
    await syncQuickReplies(api, active(renamed), [renamed]);
    expect(sets[0]!.qrList.map((q: any) => q.message)).toEqual(['@Iris a']);
  });

  it('uses the translation of the UI language', async () => {
    lang = 'zh-cn';
    const p = preset('qa', [qrSet('main', 'AP · QA')]);
    p.locales['zh-cn'] = { ...p.locales['zh-cn'], quickReplySets: { main: { qrList: { a: { label: '甲', message: '@{{ap::name::narrator}} 甲' } } } } };
    const { api, sets } = fakeApi();
    await syncQuickReplies(api, active(p), [p]);
    expect(sets[0]!.qrList[0]).toMatchObject({ label: '甲', message: '@Freesia 甲' });
  });

  it('never overwrites a set the user made', async () => {
    const p = preset('qa', [qrSet('main', 'AP · QA')]);
    const { api, sets, global } = fakeApi();
    const mine = await api.createSet('AP · QA');
    mine.addQuickReply({ label: 'mine' });
    await syncQuickReplies(api, active(p), [p]);
    expect(sets[0]!.qrList.map((q: any) => q.label)).toEqual(['mine']);
    expect(global).toEqual([]);
    expect((globalThis as any).toastr.warning).toHaveBeenCalledOnce();
    expect(settings().quickReplies).toEqual({});
  });

  it('recreates a set the user deleted, and deletes sets the preset dropped', async () => {
    const p = preset('qa', [qrSet('main', 'AP · QA'), qrSet('old', 'AP · QA · old')]);
    const { api, sets } = fakeApi();
    await syncQuickReplies(api, active(p), [p]);
    await api.deleteSet('AP · QA');
    const next = preset('qa', [qrSet('main', 'AP · QA')]);
    await syncQuickReplies(api, active(next), [next]);
    expect(sets.map((s) => s.name)).toEqual(['AP · QA']);
    expect(sets[0]!.qrList).toHaveLength(1);
    expect(Object.keys(settings().quickReplies!)).toEqual(['AP · QA']);
    // The preset is gone altogether.
    await syncQuickReplies(api, null, []);
    expect(sets).toEqual([]);
    expect(settings().quickReplies).toEqual({});
  });
});
