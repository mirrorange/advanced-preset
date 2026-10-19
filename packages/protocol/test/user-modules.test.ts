import { describe, expect, it } from 'vitest';
import {
  compileText, compileTrigger, evaluate, formatExpr, migrateUserModules, missingPoints, parseUserModuleFile, ruleError,
  userModuleFile, withUserModules, type APreset, type Entry, type Migration, type UserModule,
} from '../src';

const entry = (id: string, region: string, order: number): Entry => ({ id, module: id.split('/')[0]!, region, order, content: [{ pieces: [{ text: id }] }] });
const preset = {
  regions: [
    { id: 'top', role: 'system', merge: 'join', separator: '\n\n' },
    { id: 'settings', role: 'system', merge: 'none', separator: '', native: true },
    { id: 'task', role: 'user', merge: 'join', separator: '\n\n' },
  ],
  modules: [{ id: 'core', name: 'Core', toggle: 'always', default: true, structures: [], questions: { mandatory: [], optional: [] } }],
  entries: [entry('core/a', 'top', 100), entry('core/b', 'top', 200), entry('core/t', 'task', 100), entry('core/c', 'top', 300)],
  insertionPoints: [
    { id: 'after-a', label: 'After A', region: 'top', order: 100 },
    { id: 'early', label: 'Early', region: 'top', order: 50 },
    { id: 'task-end', label: 'Task end', region: 'task', order: 900 },
    { id: 'native', label: 'Native', region: 'settings', order: 1 },
  ],
} as unknown as APreset;

const mod = (id: string, points: string[], over: Partial<UserModule> = {}): UserModule => ({
  id, name: id, enabled: true, entries: points.map((point, i) => ({ id: `e${i}`, point, text: `${id}@${point}` })), trigger: { match: 'all', rules: [] }, ...over,
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
    expect(parseUserModuleFile(file)).toEqual({ preset: { id: 'p', version: '1.0.0' }, modules: [mod('x', ['early'])] });
    const loose = parseUserModuleFile({ name: 'n', entries: [{ point: 'p', role: 'bogus', text: 1 }], trigger: { match: 'any', rules: [{ kind: 'nope' }, { kind: 'var', path: 'x', op: '==', value: { a: 1 } }] } });
    expect(loose.modules[0]).toEqual({ id: '', name: 'n', enabled: true, entries: [{ id: 'e1', point: 'p', text: '' }], trigger: { match: 'any', rules: [{ kind: 'var', path: 'x', op: '==' }] } });
    expect(() => parseUserModuleFile({ format: 'advanced-preset.user-modules', version: 2 })).toThrow();
    expect(() => parseUserModuleFile([1])).toThrow();
  });
});
