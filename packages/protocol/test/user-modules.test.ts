import { describe, expect, it } from 'vitest';
import {
  activeUserModules, compileText, compileTrigger, evaluate, formatExpr, groupMembers, migrateUserModules, missingPoints, normalizeUserModuleGroups, parseUserModuleFile, ruleError,
  userModuleFile, withUserModules, type APreset, type Entry, type Migration, type UserModule, type UserModuleGroup,
} from '../src';

const entry = (id: string, region: string, order: number): Entry => ({ id, module: id.split('/')[0]!, region, order, content: [{ pieces: [{ text: id }] }] });
const preset = {
  regions: [
    { id: 'top', role: 'system', merge: 'join', separator: '\n\n' },
    { id: 'settings', role: 'system', merge: 'none', separator: '', native: true },
    { id: 'task', role: 'user', merge: 'join', separator: '\n\n' },
  ],
  modules: [{ id: 'core', name: 'Core', toggle: 'always', default: true, structures: [], vars: [] }],
  entries: [entry('core/a', 'top', 100), entry('core/b', 'top', 200), entry('core/t', 'task', 100), entry('core/c', 'top', 300)],
  insertionPoints: [
    { id: 'after-a', label: 'After A', region: 'top', order: 100 },
    { id: 'early', label: 'Early', region: 'top', order: 50 },
    { id: 'task-end', label: 'Task end', region: 'task', order: 900 },
    { id: 'native', label: 'Native', region: 'settings', order: 1 },
  ],
} as unknown as APreset;

const mod = (id: string, points: string[], over: Partial<UserModule> = {}): UserModule => ({
  id, name: id, enabled: true, entries: points.map((point, i) => ({ id: `e${i}`, point, text: `${id}@${point}` })), vars: [], trigger: { match: 'all', rules: [] }, ...over,
});

describe('user modules', () => {
  it('inserts entries after preset entries of the same order, in module order', () => {
    const { preset: p, skipped } = withUserModules(preset, [mod('x', ['after-a', 'early', 'task-end']), mod('y', ['after-a', 'gone', 'native'])]);
    expect(p.entries.map((e) => e.id)).toEqual(['user-x/e1', 'core/a', 'user-x/e0', 'user-y/e0', 'core/b', 'core/t', 'user-x/e2', 'core/c']);
    expect(skipped).toEqual([{ module: 'y', entry: 'e1', point: 'gone' }, { module: 'y', entry: 'e2', point: 'native' }]);
    expect(p.modules.map((m) => m.id)).toEqual(['core', 'user-x', 'user-y']);
    expect(preset.entries).toHaveLength(4);
    expect(withUserModules(preset, [mod('z', ['early'], { enabled: false })]).preset).toBe(preset);
    expect(missingPoints(preset, mod('y', ['after-a', 'gone'])).map((e) => e.point)).toEqual(['gone']);
  });

  it('leaves out entries and variable updates switched off inside a module', () => {
    const p = { ...preset, vars: [{ id: 'qs', type: 'list' }, { id: 'tags', type: 'list' }] } as unknown as APreset;
    const m = mod('x', ['after-a', 'early'], {
      vars: [{ var: 'qs', type: 'list', items: ['q'], enabled: false }, { var: 'tags', type: 'list', items: ['t'] }],
    });
    m.entries[1]!.enabled = false;
    const merged = withUserModules(p, [m]).preset;
    expect(merged.entries.map((e) => e.id).filter((id) => id.startsWith('user-'))).toEqual(['user-x/e0']);
    expect(merged.modules.find((x) => x.id === 'user-x')!.vars).toEqual([{ var: 'tags', type: 'list', items: ['t'] }]);
    const items = mod('z', [], {
      vars: [
        { var: 'qs', type: 'list', items: ['a', { text: 'b', enabled: false }] },
        { var: 'tags', type: 'list', items: [{ text: 'c', enabled: false }] },
      ],
    });
    expect(withUserModules(p, [items]).preset.modules.find((x) => x.id === 'user-z')!.vars).toEqual([{ var: 'qs', type: 'list', items: ['a'] }]);
    const dict = { ...p, vars: [{ id: 'qs', type: 'dict' }] } as unknown as APreset;
    const keys = mod('d', [], { vars: [{ var: 'qs', type: 'dict', items: [{ key: 'k', value: 'v' }, { key: 'gone', value: null, enabled: false }] }] });
    expect(withUserModules(dict, [keys]).preset.modules.find((x) => x.id === 'user-d')!.vars).toEqual([{ var: 'qs', type: 'dict', items: [{ key: 'k', value: 'v' }] }]);
    const off = mod('y', ['early'], { vars: [{ var: 'qs', type: 'list', items: ['q'], enabled: false }] });
    off.entries[0]!.enabled = false;
    expect(withUserModules(p, [off]).preset).toBe(p);
  });

  it('compiles text with directives and an optional first role', () => {
    const { content, errors } = compileText('Hello\n<!-- @if params.x == "1" -->\nX\n<!-- @end -->\n<!-- @as assistant -->\nOK', 'user');
    expect(errors).toEqual([]);
    expect(content.map((b) => b.role)).toEqual(['user', 'assistant']);
    expect(content[0]!.pieces[1]!.when).toBeDefined();
    expect(compileText('<!-- @if -->').errors[0]!.line).toBe(1);
    expect(compileText('a <!-- @wat -->').errors[0]!.message).toMatch(/unknown directive/);
  });

  it('compiles triggers, deciding keyword rules from chat text', () => {
    const vars: Record<string, unknown> = { transport: 'prefill', 'params.mood': 'dark', 'modules.nsfw': true, 'params.n': 3 };
    const resolve = (p: string) => vars[p];
    const run = (m: UserModule['trigger'], texts = { input: 'The Dragon wakes', recent: ['older', 'oldest castle'] }) => {
      const e = compileTrigger(m, texts);
      return e ? Boolean(evaluate(e, resolve)) : true;
    };
    expect(run({ match: 'all', rules: [] })).toBe(true);
    expect(run({ match: 'all', rules: [{ kind: 'var', path: 'transport', op: 'in', value: ['prefill', 'plaintext'] }, { kind: 'var', path: 'modules.nsfw', op: 'on' }] })).toBe(true);
    expect(run({ match: 'all', rules: [{ kind: 'var', path: 'params.n', op: '>=', value: 4 }] })).toBe(false);
    expect(run({ match: 'any', rules: [{ kind: 'var', path: 'params.n', op: '>=', value: 4 }, { kind: 'keyword', target: 'input', words: ['dragon'], op: 'any' }] })).toBe(true);
    expect(run({ match: 'all', rules: [{ kind: 'keyword', target: 'recent', depth: 1, words: ['castle'], op: 'any' }] })).toBe(false);
    expect(run({ match: 'all', rules: [{ kind: 'keyword', target: 'recent', depth: 2, words: ['castle'], op: 'any' }] })).toBe(true);
    expect(run({ match: 'all', rules: [{ kind: 'keyword', target: 'input', words: ['^the\\s+d'], regex: true, op: 'none' }] })).toBe(false);
    expect(run({ match: 'all', rules: [{ kind: 'expr', source: 'params.mood == "dark" && !modules.nsfw' }] })).toBe(false);
    // Incomplete rules are ignored; invalid expressions never fire.
    expect(run({ match: 'all', rules: [{ kind: 'keyword', target: 'input', words: [' '], op: 'any' }, { kind: 'var', path: 'params.mood', op: '==', value: '' }] })).toBe(true);
    expect(run({ match: 'all', rules: [{ kind: 'expr', source: 'params.(' }] })).toBe(false);
    expect(ruleError({ kind: 'expr', source: 'a ==' })).toBeTruthy();
    expect(ruleError({ kind: 'keyword', target: 'input', words: ['('], regex: true, op: 'any' })).toBeTruthy();
    expect(formatExpr(compileTrigger({ match: 'all', rules: [{ kind: 'var', path: 'workflow', op: 'notIn', value: ['a'] }] })!)).toBe('!((workflow in ["a"]))');
  });

  it('migrates insertion points and variable names on preset updates', () => {
    const m = mod('x', ['old-point', 'kept'], {
      trigger: { match: 'all', rules: [{ kind: 'var', path: 'modules.old', op: 'on' }, { kind: 'expr', source: 'params.p == 1 && modules.old-ish' }] },
    });
    const migrations: Migration[] = [
      { from: '<2.0.0', rename: { insertionPoints: { 'old-point': 'new-point' }, modules: { old: 'new' }, params: { p: 'q' } } },
      { from: '<1.0.0', rename: { insertionPoints: { kept: 'never' } } },
    ];
    const [out] = migrateUserModules([m], migrations, '1.5.0');
    expect(out!.entries.map((e) => e.point)).toEqual(['new-point', 'kept']);
    expect(out!.trigger.rules).toEqual([{ kind: 'var', path: 'modules.new', op: 'on' }, { kind: 'expr', source: 'params.q == 1 && modules.old-ish' }]);
    expect(migrateUserModules([m], migrations, '2.0.0')[0]).toBe(m);
  });

  it('round-trips export files and normalises untrusted input', () => {
    const file = JSON.parse(JSON.stringify(userModuleFile([mod('x', ['early'])], { id: 'p', version: '1.0.0' })));
    expect(parseUserModuleFile(file)).toEqual({ preset: { id: 'p', version: '1.0.0' }, modules: [mod('x', ['early'])], groups: [] });
    const loose = parseUserModuleFile({ name: 'n', entries: [{ point: 'p', role: 'bogus', text: 1 }], trigger: { match: 'any', rules: [{ kind: 'nope' }, { kind: 'var', path: 'x', op: '==', value: { a: 1 } }] } });
    expect(loose.modules[0]).toEqual({ id: '', name: 'n', enabled: true, entries: [{ id: 'e1', point: 'p', text: '' }], vars: [], trigger: { match: 'any', rules: [{ kind: 'var', path: 'x', op: '==' }] } });
    const parts = parseUserModuleFile({ entries: [{ point: 'p', text: '', enabled: false }, { point: 'q', text: '', enabled: 'no' }], vars: [{ var: 'v', type: 'list', items: [], enabled: false }] });
    expect(parts.modules[0]!.entries.map((e) => e.enabled)).toEqual([false, undefined]);
    expect(parts.modules[0]!.vars).toEqual([{ var: 'v', type: 'list', items: [], enabled: false }]);
    const items = parseUserModuleFile({ entries: [], vars: [
      { var: 'l', type: 'list', items: ['a', { text: 'b', enabled: false }, { text: 'c', enabled: true }, { text: 1 }, 2] },
      { var: 'd', type: 'dict', items: [{ key: 'k', value: 'v', enabled: false }, { key: 'j', value: 'w', enabled: true }] },
    ] });
    expect(items.modules[0]!.vars).toEqual([
      { var: 'l', type: 'list', items: ['a', { text: 'b', enabled: false }, 'c'] },
      { var: 'd', type: 'dict', items: [{ key: 'k', value: 'v', enabled: false }, { key: 'j', value: 'w' }] },
    ]);
    expect(() => parseUserModuleFile({ format: 'advanced-preset.user-modules', version: 2 })).toThrow();
    expect(() => parseUserModuleFile([1])).toThrow();
  });
});

describe('user module groups', () => {
  const g = (id: string, mode: UserModuleGroup['mode'] = 'multi'): UserModuleGroup => ({ id, name: id, mode });
  const ids = (list: UserModule[]) => list.map((m) => m.id);

  it('puts ungrouped modules first, then each group in group order, keeping relative order', () => {
    const list = [mod('a', [], { group: 'g2' }), mod('b', []), mod('c', [], { group: 'g1' }), mod('d', [], { group: 'g2' }), mod('e', [])];
    const n = normalizeUserModuleGroups(list, [g('g1'), g('g2')]);
    expect(ids(n.modules)).toEqual(['b', 'e', 'c', 'a', 'd']);
    expect(n.modules[0]).toBe(list[1]);
    expect(ids(groupMembers(n.modules, 'g2'))).toEqual(['a', 'd']);
    expect(ids(groupMembers(n.modules, null))).toEqual(['b', 'e']);
  });

  it('ungroups modules of unknown groups and drops duplicate groups', () => {
    const list = [mod('a', [], { group: 'gone' }), mod('b', [], { group: 'g1' })];
    const n = normalizeUserModuleGroups(list, [g('g1'), { ...g('g1'), name: 'dup' }, g('')]);
    expect(n.groups).toEqual([g('g1')]);
    expect(n.modules[0]).toEqual(mod('a', []));
    expect('group' in n.modules[0]!).toBe(false);
    expect(list[0]!.group).toBe('gone');
  });

  it('keeps only the first module on in a single group (all off is fine)', () => {
    const list = [mod('a', [], { group: 's', enabled: false }), mod('b', [], { group: 's' }), mod('c', [], { group: 's' }), mod('d', [], { group: 'm' }), mod('e', [], { group: 'm' })];
    const n = normalizeUserModuleGroups(list, [g('s', 'single'), g('m')]);
    expect(n.modules.map((m) => m.enabled)).toEqual([false, true, false, true, true]);
    expect(list[2]!.enabled).toBe(true);
    const off = normalizeUserModuleGroups([mod('x', [], { group: 's', enabled: false })], [g('s', 'single')]);
    expect(off.modules[0]!.enabled).toBe(false);
  });

  it('writes the groups modules use into export files and reads them back', () => {
    const list = [mod('a', ['early'], { group: 'g1' }), mod('b', ['early'])];
    const file = JSON.parse(JSON.stringify(userModuleFile(list, { id: 'p', version: '1.0.0' }, [g('g1', 'single'), g('unused')])));
    expect(file.version).toBe(1);
    expect(file.groups).toEqual([g('g1', 'single')]);
    expect(parseUserModuleFile(file)).toEqual({ preset: { id: 'p', version: '1.0.0' }, modules: list, groups: [g('g1', 'single')] });
    expect('groups' in userModuleFile([mod('x', [])], undefined, [g('g1')])).toBe(false);
  });

  it('normalises untrusted groups and drops references to groups not in the file', () => {
    const parsed = parseUserModuleFile({
      format: 'advanced-preset.user-modules', version: 1,
      groups: [{ id: 'g1', name: 'One', mode: 'single', collapsed: true }, { id: 'g2', mode: 'weird', collapsed: 'yes' }, { id: 'g1', name: 'dup' }, { name: 'no id' }, 3],
      modules: [{ entries: [], group: 'g1' }, { entries: [], group: 'g9' }, { entries: [], group: 5 }],
    });
    expect(parsed.groups).toEqual([{ id: 'g1', name: 'One', mode: 'single', collapsed: true }, { id: 'g2', name: '', mode: 'multi' }]);
    expect(parsed.modules.map((m) => m.group)).toEqual(['g1', undefined, undefined]);
    // A bare module never carries a group (there is no group to refer to).
    expect(parseUserModuleFile({ entries: [], group: 'g1' }).modules[0]!.group).toBeUndefined();
  });

  it('leaves the modules of a switched-off group out, keeping their own switches', () => {
    const list = [mod('a', ['early'], { group: 'off' }), mod('b', ['early']), mod('c', ['early'], { group: 'on' }), mod('d', ['early'], { group: 'gone' })];
    const groups = [{ ...g('off'), enabled: false }, g('on')];
    const active = activeUserModules(list, groups);
    expect(ids(active)).toEqual(['b', 'c', 'd']);
    expect(list[0]!.enabled).toBe(true);
    expect(activeUserModules(list, [g('off'), g('on')])).toBe(list);
    expect(activeUserModules(list)).toBe(list);
    const merged = withUserModules(preset, active).preset;
    expect(merged.modules.map((m) => m.id)).toEqual(['core', 'user-b', 'user-c', 'user-d']);
    expect(merged.entries.some((e) => e.module === 'user-a')).toBe(false);
  });

  it('keeps a group\'s off switch in files (on is not written)', () => {
    const list = [mod('a', [], { group: 'g1' }), mod('b', [], { group: 'g2' })];
    const file = JSON.parse(JSON.stringify(userModuleFile(list, undefined, [{ ...g('g1'), enabled: false }, g('g2')])));
    expect(file.groups).toEqual([{ ...g('g1'), enabled: false }, g('g2')]);
    expect(parseUserModuleFile(file).groups).toEqual([{ ...g('g1'), enabled: false }, g('g2')]);
    const odd = parseUserModuleFile({ format: 'advanced-preset.user-modules', version: 1, modules: [], groups: [{ id: 'x', enabled: true }, { id: 'y', enabled: 'no' }] });
    expect(odd.groups).toEqual([{ id: 'x', name: '', mode: 'multi' }, { id: 'y', name: '', mode: 'multi' }]);
  });

  it('files from the AP release before groups are read unchanged', () => {
    const old = { format: 'advanced-preset.user-modules', version: 1, modules: [{ id: 'x', name: 'x', enabled: true, entries: [], vars: [], trigger: { match: 'all', rules: [] } }] };
    expect(parseUserModuleFile(old)).toEqual({ modules: [mod('x', [])], groups: [] });
  });
});
