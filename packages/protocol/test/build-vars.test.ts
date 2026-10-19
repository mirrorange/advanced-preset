import { describe, expect, it } from 'vitest';
import {
  assemble, computeBuildVars, defaultVars, formatVar, migrateUserModules, missingVars, normalizeUserModule, withUserModules, yamlList, yamlMap,
  type APreset, type BuildVarDecl, type Configuration, type Module, type UserModule,
} from '../src';

const decls: BuildVarDecl[] = [
  { id: 'notes', type: 'string', separator: '\n' },
  { id: 'tags', type: 'list' },
  { id: 'qs', type: 'dict' },
];
const mod = (id: string, vars: Module['vars'], over: Partial<Module> = {}): Module => ({ id, name: id, toggle: 'always', default: true, structures: [], vars, ...over });

describe('build variables', () => {
  it('appends strings and lists and sets dict keys in module order', () => {
    const v = computeBuildVars(decls, [
      mod('a', [{ var: 'notes', type: 'string', text: 'one' }, { var: 'tags', type: 'list', items: ['x'] }, { var: 'qs', type: 'dict', items: [{ key: 'b', value: 'B' }, { key: 'a', value: 'A' }] }]),
      mod('b', [{ var: 'notes', type: 'string', text: 'two' }, { var: 'tags', type: 'list', items: ['y', 'z'] }, { var: 'qs', type: 'dict', items: [{ key: 'b', value: 'B2' }, { key: 'c', value: 'C' }] }]),
      mod('c', [{ var: 'qs', type: 'dict', items: [{ key: 'a', value: null }] }, { var: 'unknown', type: 'list', items: ['?'] }, { var: 'tags', type: 'string', text: 'wrong type' }]),
    ]);
    expect(v.notes).toBe('one\ntwo');
    expect(v.tags).toEqual(['x', 'y', 'z']);
    // An overridden key keeps its first position; null removes.
    expect([...(v.qs as Map<string, string>)]).toEqual([['b', 'B2'], ['c', 'C']]);
    expect(Object.keys(v)).toEqual(['notes', 'tags', 'qs']);
  });

  it('formats readable YAML and reads single items', () => {
    expect(yamlList(['Plain question?', 'a: b', '`code` first', 'true', 'two\nlines'])).toBe('- Plain question?\n- "a: b"\n- "`code` first"\n- "true"\n- |\n  two\n  lines');
    const map = new Map([['outline', 'How will it unfold?'], ['multi word', 'x #1'], ['tone', 'Calm # not a comment']]);
    expect(yamlMap(map)).toBe('outline: How will it unfold?\nmulti word: "x #1"\ntone: "Calm # not a comment"');
    expect(formatVar(map, 'keys')).toBe('- outline\n- multi word\n- tone');
    expect(formatVar(map, 'values')).toBe('- How will it unfold?\n- "x #1"\n- "Calm # not a comment"');
    expect(formatVar(map, 'outline')).toBe('How will it unfold?');
    expect(formatVar(map, 'missing')).toBe('');
    expect(formatVar(['a', 'b', 'c'], '1')).toBe('b');
    expect(formatVar(['a', 'b', 'c'], '-1')).toBe('c');
    expect(formatVar(['a'], 'x')).toBe('');
    expect(formatVar([])).toBe('');
    expect(formatVar('text')).toBe('text');
    expect(formatVar('text', '0')).toBe('');
  });
});

const preset = {
  id: 'p', version: '1.0.0',
  actors: { narrator: { name: 'Freesia' }, user: { name: 'U' } },
  styles: { prefill: 'dialogue', plaintext: 'dialogue', structured: 'imperative', 'tool-single': 'imperative', 'tool-multi': 'imperative' },
  regions: [{ id: 'top', role: 'system', merge: 'join', separator: '\n\n' }],
  params: [], groups: {}, regex: [], structures: {}, workflows: [],
  vars: [{ id: 'qs', type: 'dict' }, { id: 'tags', type: 'list' }],
  insertionPoints: [{ id: 'top', label: 'Top', region: 'top', order: 1000 }],
  modules: [
    mod('core', [{ var: 'qs', type: 'dict', items: [{ key: 'outline', value: 'Ask {{ap::name::narrator}} for an outline.' }, { key: 'tone', value: 'Tone?' }] }]),
    mod('extra', [{ var: 'tags', type: 'list', items: ['t1'] }], { toggle: 'user', default: false }),
  ],
  entries: [{ id: 'core/main', module: 'core', region: 'top', order: 100, content: [{ pieces: [{ text: 'Q:\n{{ap::var::qs::values}}\nT:{{ap::var::tags}}|{{ap::var::qs::tone}}' }] }] }],
  migrations: [{ from: '<2.0.0', rename: { vars: { questions: 'qs' } } }],
} as unknown as APreset;
const config = { modules: {}, params: {}, identity: { names: {}, prefixes: {} }, connection: { transport: 'structured', workflow: '' }, tokenSaving: { enabled: false } } as unknown as Configuration;
const run = (p: APreset, c = config) => assemble({ preset: p, config: c, vars: defaultVars(p, c) });

describe('build variables in assembly', () => {
  it('expands values and follows active modules', () => {
    expect(run(preset).regions.top![0]!.content).toBe('Q:\n- Ask Freesia for an outline.\n- Tone?\nT:|Tone?');
    const on = { ...config, modules: { extra: true } } as Configuration;
    expect(run(preset, on).regions.top![0]!.content).toContain('T:- t1|');
  });

  it('lets user modules override and remove preset keys', () => {
    const um: UserModule = {
      id: 'u', name: 'U', enabled: true, entries: [], trigger: { match: 'all', rules: [] },
      vars: [
        { var: 'qs', type: 'dict', items: [{ key: 'tone', value: '' }, { key: 'outline', value: 'Mine.' }, { key: 'new', value: 'New?' }] },
        { var: 'tags', type: 'list', items: ['', 'u1'] },
        { var: 'gone', type: 'list', items: ['x'] },
      ],
    };
    const merged = withUserModules(preset, [um]).preset;
    const a = run(merged);
    expect(a.regions.top![0]!.content).toBe('Q:\n- Mine.\n- New?\nT:- u1|');
    expect(missingVars(preset, um).map((u) => u.var)).toEqual(['gone']);
  });

  it('normalizes and migrates user variable updates', () => {
    const m = normalizeUserModule({ id: 'u', name: 'U', entries: [], vars: [{ var: 'questions', type: 'dict', items: [{ key: 'k', value: 'v' }, { key: 'x' }] }, { var: 1 }, { var: 's', type: 'nope' }] })!;
    expect(m.vars).toEqual([{ var: 'questions', type: 'dict', items: [{ key: 'k', value: 'v' }, { key: 'x', value: null }] }]);
    expect(migrateUserModules([m], preset.migrations as never, '1.0.0')[0]!.vars[0]!.var).toBe('qs');
    expect(normalizeUserModule({ id: 'old', name: 'Old', entries: [] })!.vars).toEqual([]);
  });

  it('exposes the stages of the workflow as condition variables', () => {
    const wf = { id: 'w', name: 'W', kind: 'story', stages: [{ id: 'questions', actor: 'narrator', kind: 'text', label: 'Q' }, { id: 'skip', actor: 'narrator', kind: 'content', label: 'S', when: { t: 'lit', v: false } }], sections: { intro: {}, outro: {}, stages: {} } };
    const p = { ...preset, workflows: [wf] } as unknown as APreset;
    const a = run(p, { ...config, connection: { transport: 'structured', workflow: 'w' } } as Configuration);
    expect(a.vars.stages).toEqual({ questions: true });
    expect(a.resolve('stages.skip')).toBeUndefined();
  });
});
