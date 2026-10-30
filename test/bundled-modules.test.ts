import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, presetTemplates, type APreset, type UserModuleSource } from '@advanced-preset/protocol';
import { planBundledSync, presetWithUserModules } from '@/store/bundled-modules';
import { presetState } from '@/store/config';
import { userModules } from '@/store/user-modules';
import { petals, withoutTemplates } from './helpers';

const downloads: { file: string; data: APreset }[] = [];
vi.mock('@/ui/download', () => ({
  downloadJson: (file: string, data: APreset) => downloads.push({ file, data: cloneData(data) }),
  fileSlug: (s: string) => s,
}));

const { syncBundledModules, exportPreset } = await import('@/app/bundled-modules');

/** Just enough DOM for the checklist popup. */
class El {
  children: El[] = [];
  style: Record<string, string> = {};
  dataset: Record<string, string> = {};
  className = '';
  textContent = '';
  type = '';
  checked = false;
  constructor(public tag: string) {}
  append(...xs: (El | string)[]) { for (const x of xs) if (typeof x !== 'string') this.children.push(x); }
  cloneNode() { return this; }
  get innerText(): string { return [this.textContent, ...this.children.map((c): string => c.innerText)].join(' '); }
}
const items = (root: El): { id: string; box: El; text: string }[] =>
  root.children.flatMap((c) => (c.dataset.apItem ? [{ id: c.dataset.apItem, box: c.children[0]!, text: c.innerText }] : items(c)));

let lang = 'en';
/** Popup answer: called with the item list, may toggle boxes; returns true for OK. */
let answer: (list: ReturnType<typeof items>) => boolean = () => true;
const popup = vi.fn(async (root: El) => (answer(items(root)) ? 1 : 0));

beforeEach(() => {
  lang = 'en';
  answer = () => true;
  popup.mockClear();
  downloads.length = 0;
  vi.stubGlobal('localStorage', { getItem: () => lang });
  vi.stubGlobal('document', { createElement: (tag: string) => new El(tag) });
  (globalThis as any).toastr = { info: vi.fn(), error: vi.fn() };
  (globalThis as any).SillyTavern = {
    getContext: () => ({
      extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {},
      callGenericPopup: popup, POPUP_TYPE: { CONFIRM: 2 }, POPUP_RESULT: { AFFIRMATIVE: 1 },
    }),
  };
});
afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; vi.unstubAllGlobals(); });

const style: UserModuleSource = {
  id: 'house-style',
  name: 'House style',
  entries: [{ point: 'writing-style', text: '<!--# Edit me -->\nShort sentences.' }],
  vars: [],
  trigger: { match: 'all', rules: [{ kind: 'expr', source: '!meta.pure' }] },
  locales: { 'zh-cn': { name: '家常文风', entries: [{ point: 'writing-style', text: '短句。' }], vars: [], trigger: { match: 'all', rules: [] } } },
};
const quiet: UserModuleSource = { id: 'quiet', name: 'Quiet', enabled: false, entries: [{ point: 'after-role', role: 'user', text: 'Be quiet.' }], vars: [], trigger: { match: 'all', rules: [] } };

let n = 0;
function preset(sources: UserModuleSource[] = [style, quiet], version = '1.0.0'): APreset {
  const p = withoutTemplates(petals);
  p.id = `bundled-${++n}`;
  p.version = version;
  p.userModules = cloneData(sources);
  return p;
}
/** The same preset id at a later version with other sources. */
const update = (p: APreset, sources: UserModuleSource[], version = '1.1.0'): APreset => ({ ...p, version, userModules: cloneData(sources) });

describe('bundled user modules', () => {
  it('installs them on first sight in preset order and state, as ordinary modules', async () => {
    const p = preset();
    await syncBundledModules(p);
    const list = userModules(p);
    expect(list.map((m) => [m.id, m.name, m.enabled])).toEqual([['house-style', 'House style', true], ['quiet', 'Quiet', false]]);
    expect(list[1]!.entries).toEqual([{ id: 'e1', point: 'after-role', role: 'user', text: 'Be quiet.' }]);
    expect(popup).not.toHaveBeenCalled();
    expect((globalThis as any).toastr.info).toHaveBeenCalledOnce();
    // Nothing changes on the next sync.
    await syncBundledModules(p);
    expect(userModules(p)).toHaveLength(2);
  });

  it('installs the copy for the panel language', async () => {
    lang = 'zh-CN';
    const p = preset();
    await syncBundledModules(p);
    expect(userModules(p)[0]).toMatchObject({ name: '家常文风', entries: [{ text: '短句。' }] });
  });

  it('keeps edits, deletions and states while the preset does not change the module', async () => {
    const p = preset();
    await syncBundledModules(p);
    const list = userModules(p);
    list[0]!.entries[0]!.text = 'Mine.';
    list[1]!.enabled = true;
    const next = update(p, [style, quiet, { ...quiet, id: 'extra', name: 'Extra' }]);
    list.splice(1, 1); // delete "quiet"
    await syncBundledModules(next);
    expect(popup).not.toHaveBeenCalled();
    expect(userModules(p).map((m) => m.id)).toEqual(['house-style', 'extra']);
    expect(userModules(p)[0]!.entries[0]!.text).toBe('Mine.');
  });

  it('asks which copy to keep when the preset changed a module the user has a different copy of', async () => {
    const p = preset();
    await syncBundledModules(p);
    const list = userModules(p);
    list[0]!.entries[0]!.text = 'Mine.';
    list[1]!.enabled = true;
    const changed = (s: UserModuleSource, text: string) => ({ ...s, entries: [{ ...s.entries[0]!, text }] });
    let seen: { id: string; checked: boolean; text: string }[] = [];
    answer = (xs) => { seen = xs.map((x) => ({ id: x.id, checked: x.box.checked, text: x.text })); return true; };
    await syncBundledModules(update(p, [changed(style, 'New style.'), changed(quiet, 'New quiet.')]));
    expect(popup).toHaveBeenCalledOnce();
    // Edited copy: unchecked by default (keep mine); untouched copy: checked (take the preset's).
    expect(seen.map((x) => [x.id, x.checked])).toEqual([['house-style', false], ['quiet', true]]);
    expect(seen[0]!.text).toContain('edited by you');
    expect(seen[1]!.text).toContain('not edited');
    const after = userModules(p);
    expect(after[0]!.entries[0]!.text).toBe('Mine.');
    expect(after[1]).toMatchObject({ id: 'quiet', enabled: true, entries: [{ id: 'e1', text: 'New quiet.' }] });
    // Decided once: the same version does not ask again.
    await syncBundledModules(update(p, [changed(style, 'New style.'), changed(quiet, 'New quiet.')]));
    expect(popup).toHaveBeenCalledOnce();
  });

  it('cancel keeps every copy of the user and does not ask again for that version', async () => {
    const p = preset([style]);
    await syncBundledModules(p);
    answer = () => false;
    const next = update(p, [{ ...style, name: 'Renamed' }]);
    await syncBundledModules(next);
    expect(userModules(p)[0]!.name).toBe('House style');
    await syncBundledModules(next);
    expect(popup).toHaveBeenCalledOnce();
  });

  it('can take an edited copy over when the user checks it', async () => {
    const p = preset([style]);
    await syncBundledModules(p);
    userModules(p)[0]!.name = 'Mine';
    answer = (xs) => { xs[0]!.box.checked = true; return true; };
    await syncBundledModules(update(p, [{ ...style, name: 'Theirs' }]));
    expect(userModules(p)[0]!.name).toBe('Theirs');
  });

  it('does not ask for a language switch alone', async () => {
    const p = preset([style]);
    await syncBundledModules(p);
    lang = 'zh-cn';
    await syncBundledModules(p);
    expect(popup).not.toHaveBeenCalled();
    expect(userModules(p)[0]!.name).toBe('House style');
  });

  it('treats an existing module with the same id but different content as edited', () => {
    const p = preset([style]);
    const mine = { id: 'house-style', name: 'Other', enabled: true, entries: [], vars: [], trigger: { match: 'all' as const, rules: [] } };
    const plan = planBundledSync(p, [mine], undefined, 'en');
    expect(plan.add).toEqual([]);
    expect(plan.conflicts.map((c) => [c.id, c.modified])).toEqual([['house-style', true]]);
    // Same content → simply linked.
    const same = planBundledSync(p, [{ ...mine, name: 'House style', entries: [{ id: 'x', ...style.entries[0]! }], trigger: style.trigger }], undefined, 'en');
    expect(same.conflicts).toEqual([]);
    expect(Object.keys(same.records)).toEqual(['house-style']);
  });

  it('ignores malformed bundled modules', () => {
    const p = preset([style]);
    p.userModules.push({ id: 7 } as unknown as UserModuleSource, { id: 'bad', entries: 'x' } as unknown as UserModuleSource);
    const plan = planBundledSync(p, [], undefined, 'en');
    expect(plan.add.map((m) => m.id)).toEqual(['house-style']);
  });

  it('`ap dev` takes untouched copies without asking and still asks for edited ones', async () => {
    const p = preset();
    await syncBundledModules(p, { auto: true });
    userModules(p)[0]!.name = 'Mine';
    let asked: string[] = [];
    answer = (xs) => { asked = xs.map((x) => x.id); return true; };
    await syncBundledModules(update(p, [{ ...style, name: 'Theirs' }, { ...quiet, name: 'Hush' }]), { auto: true });
    expect(asked).toEqual(['house-style']);
    expect(userModules(p).map((m) => m.name)).toEqual(['Mine', 'Hush']);
  });

  it('counts template code in bundled modules for the trust prompt', () => {
    const p = preset([{ ...style, entries: [{ point: 'writing-style', text: '<!-- @template --><%- gen.type %><!-- @end -->' }] }]);
    expect(presetTemplates(p)).toEqual(['<%- gen.type %>']);
  });
});

describe('exporting a preset with user modules', () => {
  it('asks which modules to bundle and replaces what the preset carried', async () => {
    const p = preset();
    await syncBundledModules(p);
    const list = userModules(p);
    list.push({ id: 'mine', name: 'Mine', enabled: false, entries: [{ id: 'e1', point: 'after-role', text: 'My text.' }], vars: [], trigger: { match: 'all', rules: [] } });
    list[0]!.enabled = false;
    let seen: string[] = [];
    answer = (xs) => { seen = xs.map((x) => x.id); xs.find((x) => x.id === 'quiet')!.box.checked = false; return true; };
    expect(await exportPreset(p)).toBe(true);
    expect(seen).toEqual(['house-style', 'quiet', 'mine']);
    const [{ file, data }] = downloads;
    expect(file).toBe(`${p.id}.apreset.json`);
    expect(data.hash).toBe(p.hash);
    // Unchanged bundled module: its source with translations, in the user's state.
    expect(data.userModules[0]).toEqual({ ...style, enabled: false });
    expect(data.userModules[1]).toEqual({ id: 'mine', name: 'Mine', enabled: false, entries: [{ point: 'after-role', text: 'My text.' }], vars: [], trigger: { match: 'all', rules: [] } });
    expect(data.userModules).toHaveLength(2);
  });

  it('exports edited bundled modules as the user has them', () => {
    const p = preset([style]);
    const edited = { id: 'house-style', name: 'House style', enabled: true, entries: [{ id: 'e1', point: 'writing-style', text: 'Edited.' }], vars: [], trigger: style.trigger };
    expect(presetWithUserModules(p, [edited], 'en').userModules).toEqual([{ id: 'house-style', name: 'House style', entries: [{ point: 'writing-style', text: 'Edited.' }], vars: [], trigger: style.trigger }]);
  });

  it('exports without asking when there are no user modules, and not at all on cancel', async () => {
    const p = preset([]);
    expect(await exportPreset(p)).toBe(true);
    expect(popup).not.toHaveBeenCalled();
    expect(downloads[0]!.data.userModules).toEqual([]);
    const q = preset([style]);
    await syncBundledModules(q);
    answer = () => false;
    expect(await exportPreset(q)).toBe(false);
    expect(downloads).toHaveLength(1);
  });

  it('a re-imported export links to the modules it came from', async () => {
    const p = preset([]);
    const list = userModules(p);
    list.push({ id: 'mine', name: 'Mine', enabled: true, entries: [{ id: 'e1', point: 'after-role', text: 'My text.' }], vars: [], trigger: { match: 'all', rules: [] } });
    await exportPreset(p);
    const exported = downloads[0]!.data;
    await syncBundledModules({ ...p, userModules: exported.userModules });
    expect(popup).toHaveBeenCalledOnce(); // only the export choice
    expect(userModules(p)).toHaveLength(1);
    expect(presetState(p).bundledModules).toHaveProperty('mine');
  });
});
