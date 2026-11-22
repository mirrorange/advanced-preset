import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { activeUserModules, cloneData, type APreset, type UserModule, type UserModuleSource } from '@advanced-preset/protocol';
import { applyBundledSync, planBundledSync, planIsEmpty, presetWithUserModules } from '@/store/bundled-modules';
import { presetState } from '@/store/config';
import {
  createUserModule, createUserModuleFromTemplate, createUserModuleGroup, duplicateUserModule, exportUserModuleGroup, exportUserModules,
  importUserModules, moveUserModule, moveUserModuleGroup, removeUserModule, removeUserModuleGroup, renameUserModuleGroup, setUserModuleEnabled,
  setUserModuleGroupCollapsed, setUserModuleGroupEnabled, setUserModuleGroupMode, userModuleGroups, userModules,
} from '@/store/user-modules';
import { petals, withoutTemplates } from './helpers';

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  (globalThis as any).SillyTavern = { getContext: () => ({ extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {} }) };
});
afterEach(() => { delete (globalThis as any).SillyTavern; vi.unstubAllGlobals(); });

let n = 0;
function preset(): APreset {
  const p = withoutTemplates(petals);
  p.id = `groups-${++n}`;
  return p;
}

const names = (p: APreset) => userModules(p).map((m) => m.name);
const on = (p: APreset) => userModules(p).filter((m) => m.enabled).map((m) => m.name);
const byName = (p: APreset, name: string) => userModules(p).find((m) => m.name === name)!;
/** Modules a, b (ungrouped), then groups S (single: s1, s2) and M (multi: m1, m2). */
function setup() {
  const p = preset();
  createUserModule(p, 'a');
  createUserModule(p, 'b');
  const s = createUserModuleGroup(p, 'S', 'single');
  const m = createUserModuleGroup(p, 'M');
  createUserModule(p, 's1', s.id);
  createUserModule(p, 's2', s.id);
  createUserModule(p, 'm1', m.id);
  createUserModule(p, 'm2', m.id);
  return { p, s: s.id, m: m.id };
}

describe('user module groups (store)', () => {
  it('creates groups and modules in them, in display order', () => {
    const { p, s, m } = setup();
    expect(userModuleGroups(p).map((g) => [g.name, g.mode])).toEqual([['S', 'single'], ['M', 'multi']]);
    createUserModule(p, 'c');
    expect(names(p)).toEqual(['a', 'b', 'c', 's1', 's2', 'm1', 'm2']);
    expect(userModules(p).map((x) => x.group ?? null)).toEqual([null, null, null, s, s, m, m]);
    // A module created in a single group that already has one on starts off.
    expect(on(p)).toEqual(['a', 'b', 'c', 's1', 'm1', 'm2']);
    expect(createUserModule(p, 'x', 'no-such-group').group).toBeUndefined();
  });

  it('switches the other modules of a single group off', () => {
    const { p, m } = setup();
    setUserModuleEnabled(p, byName(p, 's2').id, true);
    expect(on(p)).toEqual(['a', 'b', 's2', 'm1', 'm2']);
    setUserModuleEnabled(p, byName(p, 's2').id, false);
    expect(on(p)).toEqual(['a', 'b', 'm1', 'm2']);
    setUserModuleEnabled(p, byName(p, 'm1').id, false);
    expect(on(p)).toEqual(['a', 'b', 'm2']);
    setUserModuleEnabled(p, byName(p, 'm1').id, true);
    expect(on(p)).toEqual(['a', 'b', 'm1', 'm2']);
    // multi → single keeps the first that was on.
    setUserModuleGroupMode(p, m, 'single');
    expect(on(p)).toEqual(['a', 'b', 'm1']);
    setUserModuleGroupMode(p, m, 'multi');
    setUserModuleEnabled(p, byName(p, 'm2').id, true);
    expect(on(p)).toEqual(['a', 'b', 'm1', 'm2']);
  });

  it('moves modules within a group, across groups and out of groups', () => {
    const { p, s, m } = setup();
    moveUserModule(p, byName(p, 'b').id, null, 0);
    expect(names(p)).toEqual(['b', 'a', 's1', 's2', 'm1', 'm2']);
    moveUserModule(p, byName(p, 'a').id, m, 1);
    expect(names(p)).toEqual(['b', 's1', 's2', 'm1', 'a', 'm2']);
    expect(byName(p, 'a').group).toBe(m);
    moveUserModule(p, byName(p, 'm2').id, s, 99);
    expect(names(p)).toEqual(['b', 's1', 's2', 'm2', 'm1', 'a']);
    // Moved into a single group that has one on → off.
    expect(byName(p, 'm2').enabled).toBe(false);
    moveUserModule(p, byName(p, 's1').id, null, 1);
    expect(names(p)).toEqual(['b', 's1', 's2', 'm2', 'm1', 'a']);
    expect(byName(p, 's1').group).toBeUndefined();
    expect(byName(p, 's1').enabled).toBe(true);
    // Into the now empty-of-on single group: stays on.
    moveUserModule(p, byName(p, 'b').id, s, 0);
    expect(names(p)).toEqual(['s1', 'b', 's2', 'm2', 'm1', 'a']);
    expect(byName(p, 'b').enabled).toBe(true);
    // Reordering inside a single group keeps the state.
    moveUserModule(p, byName(p, 'b').id, s, 2);
    expect(names(p)).toEqual(['s1', 's2', 'm2', 'b', 'm1', 'a']);
    expect(on(p)).toEqual(['s1', 'b', 'm1', 'a']);
    moveUserModule(p, byName(p, 'a').id, 'no-such-group', 0);
    expect(byName(p, 'a').group).toBe(m);
  });

  it('moves an empty group target and reorders, renames, folds and removes groups', () => {
    const { p, s, m } = setup();
    const e = createUserModuleGroup(p, 'E');
    moveUserModule(p, byName(p, 'a').id, e.id, 0);
    expect(names(p)).toEqual(['b', 's1', 's2', 'm1', 'm2', 'a']);
    moveUserModuleGroup(p, e.id, 0);
    expect(userModuleGroups(p).map((g) => g.name)).toEqual(['E', 'S', 'M']);
    expect(names(p)).toEqual(['b', 'a', 's1', 's2', 'm1', 'm2']);
    renameUserModuleGroup(p, s, 'Styles');
    setUserModuleGroupCollapsed(p, s, true);
    expect(userModuleGroups(p)[1]).toEqual({ id: s, name: 'Styles', mode: 'single', collapsed: true });
    setUserModuleGroupCollapsed(p, s, false);
    expect('collapsed' in userModuleGroups(p)[1]!).toBe(false);
    removeUserModuleGroup(p, s, { withModules: false });
    expect(names(p)).toEqual(['b', 's1', 's2', 'a', 'm1', 'm2']);
    expect(byName(p, 's1').group).toBeUndefined();
    removeUserModuleGroup(p, m, { withModules: true });
    expect(names(p)).toEqual(['b', 's1', 's2', 'a']);
    expect(userModuleGroups(p).map((g) => g.name)).toEqual(['E']);
  });

  it('switches a whole group off and on, keeping each module\'s switch and the single choice', () => {
    const { p, s, m } = setup();
    setUserModuleEnabled(p, byName(p, 's2').id, true);
    setUserModuleEnabled(p, byName(p, 'm2').id, false);
    setUserModuleGroupEnabled(p, s, false);
    setUserModuleGroupEnabled(p, m, false);
    expect(userModuleGroups(p).map((g) => g.enabled)).toEqual([false, false]);
    expect(on(p)).toEqual(['a', 'b', 's2', 'm1']);
    expect(activeUserModules(userModules(p), userModuleGroups(p)).map((x) => x.name)).toEqual(['a', 'b']);
    // Still editable while off; switching the group on restores the modules as they are.
    setUserModuleEnabled(p, byName(p, 's1').id, true);
    setUserModuleGroupEnabled(p, s, true);
    expect('enabled' in userModuleGroups(p)[0]!).toBe(false);
    expect(activeUserModules(userModules(p), userModuleGroups(p)).filter((x) => x.enabled).map((x) => x.name)).toEqual(['a', 'b', 's1']);
    // Off groups are exported and imported off.
    const one = cloneData(exportUserModuleGroup(p, m));
    expect(one.groups).toEqual([{ id: m, name: 'M', mode: 'multi', enabled: false }]);
    expect(cloneData(exportUserModules(p)).groups!.map((g) => g.enabled)).toEqual([undefined, false]);
    const q = preset();
    expect(importUserModules(q, one).groups[0]).toMatchObject({ name: 'M', enabled: false });
  });

  it('duplicates and creates from templates in the same group', () => {
    const { p, s } = setup();
    const copy = duplicateUserModule(p, byName(p, 's1').id, (x) => `${x} copy`)!;
    expect(names(p)).toEqual(['a', 'b', 's1', 's1 copy', 's2', 'm1', 'm2']);
    expect(copy).toMatchObject({ group: s, enabled: false });
    const t = createUserModuleFromTemplate(p, { name: 'tpl', entries: [], vars: [], trigger: { match: 'all', rules: [] } }, s);
    expect(t.group).toBe(s);
    expect(names(p).slice(2, 6)).toEqual(['s1', 's1 copy', 's2', 'tpl']);
    removeUserModule(p, t.id);
    expect(names(p)).not.toContain('tpl');
  });

  it('repairs settings that break the invariant when they are read', () => {
    const p = preset();
    const mod = (name: string, group?: string): UserModule => ({ id: name, name, enabled: true, entries: [], vars: [], trigger: { match: 'all', rules: [] }, ...(group ? { group } : {}) });
    const st = presetState(p);
    st.userModuleGroups = [{ id: 'g', name: 'G', mode: 'single' }];
    st.userModules = [mod('x', 'g'), mod('y'), mod('z', 'g'), mod('w', 'gone')];
    expect(names(p)).toEqual(['y', 'w', 'x', 'z']);
    expect(on(p)).toEqual(['y', 'w', 'x']);
    expect(byName(p, 'w').group).toBeUndefined();
  });

  it('exports groups with their modules and imports them as new copies', () => {
    const { p, s } = setup();
    const all = cloneData(exportUserModules(p));
    expect(all.version).toBe(1);
    expect(all.groups!.map((g) => g.name)).toEqual(['S', 'M']);
    expect(exportUserModules(p, [byName(p, 'a').id]).groups).toBeUndefined();
    const one = cloneData(exportUserModuleGroup(p, s));
    expect(one.modules.map((m) => m.name)).toEqual(['s1', 's2']);
    expect(one.groups).toEqual([{ id: s, name: 'S', mode: 'single' }]);

    const q = preset();
    createUserModule(q, 'mine');
    const r = importUserModules(q, one);
    expect(r.groups.map((g) => g.name)).toEqual(['S']);
    expect(r.added.map((m) => [m.name, m.group])).toEqual([['s1', r.groups[0]!.id], ['s2', r.groups[0]!.id]]);
    expect(r.missing).toBe(0);
    // Again: another copy, not an overwrite.
    const again = importUserModules(q, one);
    expect(again.groups[0]!.id).not.toBe(r.groups[0]!.id);
    expect(userModuleGroups(q)).toHaveLength(2);
    expect(names(q)).toEqual(['mine', 's1', 's2', 's1', 's2']);
    // A file without groups goes to the ungrouped modules.
    importUserModules(q, exportUserModules(p, [byName(p, 'a').id]));
    expect(names(q)).toEqual(['mine', 'a', 's1', 's2', 's1', 's2']);
    // An empty group is exported and imported too.
    const e = createUserModuleGroup(p, 'Empty', 'single');
    const er = importUserModules(q, cloneData(exportUserModuleGroup(p, e.id)));
    expect(er).toMatchObject({ added: [], groups: [{ name: 'Empty', mode: 'single' }] });
  });

  it('keeps the single constraint for imported files that break it', () => {
    const p = preset();
    const r = importUserModules(p, {
      format: 'advanced-preset.user-modules', version: 1,
      groups: [{ id: 'g', name: 'G', mode: 'single' }],
      modules: [{ id: 'x', name: 'x', entries: [], group: 'g' }, { id: 'y', name: 'y', entries: [], group: 'g' }],
    });
    expect(r.added.map((m) => m.enabled)).toEqual([true, false]);
  });

  it('bundled modules install ungrouped; taking the preset version keeps the group', () => {
    const src = (id: string, text: string): UserModuleSource => ({ id, name: id, entries: [{ point: 'writing-style', text }], vars: [], trigger: { match: 'all', rules: [] } });
    const p = preset();
    p.userModules = [src('one', 'v1')];
    const g = createUserModuleGroup(p, 'G');
    createUserModule(p, 'grouped', g.id);
    applyBundledSync(p, planBundledSync(p, userModules(p), presetState(p).bundledModules));
    expect(names(p)).toEqual(['one', 'grouped']);
    moveUserModule(p, 'one', g.id, 0);
    byName(p, 'one').entries[0]!.text = 'mine';
    const next = { ...p, version: '2.0.0', userModules: [src('one', 'v2'), src('two', 'v1')] };
    const plan = planBundledSync(next, userModules(next), presetState(next).bundledModules);
    expect(plan.conflicts.map((c) => c.id)).toEqual(['one']);
    applyBundledSync(next, plan, ['one']);
    expect(names(next)).toEqual(['two', 'one', 'grouped']);
    expect(byName(next, 'one')).toMatchObject({ group: g.id, entries: [{ text: 'v2' }] });
  });
});

describe('user module groups shipped with a preset', () => {
  const src = (id: string, over: Partial<UserModuleSource> = {}): UserModuleSource => ({ id, name: id, entries: [{ point: 'writing-style', text: id }], vars: [], trigger: { match: 'all', rules: [] }, ...over });
  const sync = (p: APreset, lang = 'en') => {
    const s = presetState(p);
    const plan = planBundledSync(p, userModules(p), s.bundledModules, lang, { list: userModuleGroups(p), records: s.bundledGroups });
    const empty = planIsEmpty(plan, s.bundledModules, s.bundledGroups);
    applyBundledSync(p, plan, plan.conflicts.map((c) => c.id));
    return empty;
  };
  const layout = (p: APreset) => userModules(p).map((m) => `${m.name}${m.group ? `@${m.group}` : ''}${m.enabled ? '' : '(off)'}`);
  function shipped(): APreset {
    const p = preset();
    p.userModuleGroups = [{ id: 'styles', name: 'Styles', mode: 'single' }, { id: 'extras', name: 'Extras', mode: 'multi', collapsed: true }];
    p.locales = { ...p.locales, 'zh-cn': { ...p.locales['zh-cn'], userModuleGroups: { styles: { name: '文风' } } } };
    p.userModules = [src('plain', { group: 'styles' }), src('ornate', { group: 'styles', enabled: false }), src('loose'), src('note', { group: 'extras' })];
    return p;
  }

  it('installs groups and puts new modules into them, after the user\'s own', () => {
    const p = shipped();
    createUserModule(p, 'mine');
    const g = createUserModuleGroup(p, 'Mine');
    createUserModule(p, 'in-mine', g.id);
    expect(sync(p, 'zh-cn')).toBe(false);
    expect(userModuleGroups(p)).toEqual([{ id: g.id, name: 'Mine', mode: 'multi' }, { id: 'styles', name: '文风', mode: 'single' }, { id: 'extras', name: 'Extras', mode: 'multi', collapsed: true }]);
    expect(layout(p)).toEqual(['mine', 'loose', `in-mine@${g.id}`, 'plain@styles', 'ornate@styles(off)', 'note@extras']);
    expect(presetState(p).bundledGroups).toEqual(['styles', 'extras']);
    expect(sync(p)).toBe(true);
  });

  it('leaves installed groups and positions to the user; deleted groups stay deleted', () => {
    const p = shipped();
    sync(p);
    renameUserModuleGroup(p, 'styles', 'My styles');
    setUserModuleGroupMode(p, 'extras', 'single');
    moveUserModule(p, 'plain', null, 0);
    removeUserModuleGroup(p, 'extras', { withModules: false });
    const next: APreset = {
      ...p, version: '2.0.0',
      userModuleGroups: [...p.userModuleGroups!, { id: 'more', name: 'More', mode: 'multi' }],
      userModules: [src('plain', { group: 'extras', entries: [{ point: 'writing-style', text: 'v2' }] }), src('ornate', { group: 'styles', enabled: false }), src('loose'), src('note', { group: 'extras' }), src('late', { group: 'extras' }), src('fresh', { group: 'more' }), src('pick', { group: 'styles' })],
    };
    sync(next);
    expect(userModuleGroups(next).map((g) => g.name)).toEqual(['My styles', 'More']);
    // `plain` took the new version but stayed where the user put it; `late` goes ungrouped (its
    // group was deleted); `pick` is the only one on in its single group.
    expect(byName(next, 'plain').entries[0]!.text).toBe('v2');
    expect(layout(next)).toEqual(['plain', 'loose', 'note', 'late', 'ornate@styles(off)', 'pick@styles', 'fresh@more']);
    expect(sync({ ...next, version: '2.0.1' })).toBe(true);
    // A new module of a single group that has one on starts off (the user's choice wins).
    const third: APreset = { ...next, version: '3.0.0', userModules: [...next.userModules, src('later', { group: 'styles' })] };
    sync(third);
    expect(layout(third).slice(-3)).toEqual(['pick@styles', 'later@styles(off)', 'fresh@more']);
  });

  it('installs a group switched off when the preset says so; the switch is then the user\'s', () => {
    const p = shipped();
    p.userModuleGroups = [{ ...p.userModuleGroups![0]!, enabled: false }, p.userModuleGroups![1]!];
    sync(p, 'zh-cn');
    expect(userModuleGroups(p).map((g) => [g.id, g.name, g.enabled])).toEqual([['styles', '文风', false], ['extras', 'Extras', undefined]]);
    expect(layout(p)).toContain('plain@styles');
    setUserModuleGroupEnabled(p, 'styles', true);
    setUserModuleGroupEnabled(p, 'extras', false);
    const next: APreset = { ...p, version: '2.0.0' };
    expect(sync(next)).toBe(true);
    expect(userModuleGroups(next).map((g) => g.enabled)).toEqual([undefined, false]);
    // Exported with the user's switches; an unchanged group keeps its source and translations.
    const out = presetWithUserModules(next, userModules(next), 'zh-cn', userModuleGroups(next));
    expect(out.userModuleGroups).toEqual([{ id: 'styles', name: 'Styles', mode: 'single' }, { id: 'extras', name: 'Extras', mode: 'multi', collapsed: true, enabled: false }]);
    expect(out.locales['zh-cn']!.userModuleGroups).toEqual({ styles: { name: '文风' } });
  });

  it('exports the groups of the chosen modules; unchanged groups keep their source', () => {
    const p = shipped();
    sync(p, 'zh-cn');
    const g = createUserModuleGroup(p, 'Mine', 'single');
    createUserModule(p, 'own', g.id);
    const chosen = userModules(p).filter((m) => m.name !== 'note');
    const out = presetWithUserModules(p, chosen, 'zh-cn', userModuleGroups(p));
    expect(out.userModuleGroups).toEqual([{ id: 'styles', name: 'Styles', mode: 'single' }, { id: g.id, name: 'Mine', mode: 'single' }]);
    expect(out.userModules.map((m) => [m.id, m.group])).toEqual([['loose', undefined], ['plain', 'styles'], ['ornate', 'styles'], [byName(p, 'own').id, g.id]]);
    expect(out.locales['zh-cn']!.userModuleGroups).toEqual({ styles: { name: '文风' } });
    // Renamed or moved: the user's state wins.
    renameUserModuleGroup(p, 'styles', 'Mine too');
    moveUserModule(p, 'loose', 'styles', 0);
    const again = presetWithUserModules(p, userModules(p), 'zh-cn', userModuleGroups(p));
    expect(again.userModuleGroups![0]).toEqual({ id: 'styles', name: 'Mine too', mode: 'single' });
    expect(again.locales['zh-cn']!.userModuleGroups).toEqual({});
    expect(p.locales['zh-cn']!.userModuleGroups).toEqual({ styles: { name: '文风' } });
    expect(again.userModules.find((m) => m.id === 'loose')).toMatchObject({ group: 'styles', enabled: false });
    expect(presetWithUserModules(p, userModules(p).filter((m) => !m.group), 'en', userModuleGroups(p))).not.toHaveProperty('userModuleGroups');
  });
});
