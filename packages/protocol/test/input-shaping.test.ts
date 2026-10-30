import { describe, expect, it } from 'vitest';
import { assemble, defaultVars, DEFAULT_INPUT_TEMPLATE, parseExpr, test as testExpr, resolverOf, wrapInput, type APreset, type Configuration } from '../src';

const preset = {
  id: 'p', version: '1.0.0',
  actors: { narrator: { name: 'Freesia' }, user: { name: 'U' } },
  styles: { prefill: 'dialogue', plaintext: 'dialogue', structured: 'imperative', 'tool-single': 'imperative', 'tool-multi': 'imperative' },
  regions: [{ id: 'input', role: 'system', merge: { wrap: 'input' }, separator: '\n\n' }],
  params: [], groups: {}, regex: [], structures: {}, workflows: [], vars: [], insertionPoints: [],
  modules: [{ id: 'core', name: 'core', toggle: 'always', default: true, structures: [], vars: [] }],
  entries: [{ id: 'core/input', module: 'core', region: 'input', order: 100, when: parseExpr('input.shaped'), content: [{ pieces: [{ text: '{{ap::name::user}} wrote: {{ap::input::text}}' }] }] }],
  inputShaping: { mode: 'extract', template: DEFAULT_INPUT_TEMPLATE },
} as unknown as APreset;
const config = { modules: {}, params: {}, identity: { names: {}, prefixes: {} }, connection: { transport: 'structured', workflow: '' }, tokenSaving: { enabled: false } } as unknown as Configuration;

describe('input shaping', () => {
  it('is off by default and the macro is empty then', () => {
    const vars = defaultVars(preset, config);
    expect(vars.input).toEqual({ shaped: false });
    const a = assemble({ preset, config, vars, data: { inputText: 'hello' } });
    expect(a.regions.input).toEqual([]);
    expect(a.expand('[{{ap::input::text}}]')).toBe('[]');
  });

  it('renders {{ap::input::text}} and `input.shaped` entries when shaped', () => {
    const vars = defaultVars(preset, config, { input: { shaped: true } });
    const a = assemble({ preset, config, vars, data: { inputText: 'hello', metaText: 'meta' } });
    expect(a.regions.input).toEqual([{ role: 'system', content: '<input>\nU wrote: hello\n</input>' }]);
    expect(a.expand('{{ap::input::meta}}')).toBe('meta');
    expect(testExpr(parseExpr('input.shaped && !meta.pure'), resolverOf(a.vars))).toBe(true);
  });

  it('wraps after macro expansion, leaving the text as written', () => {
    const expand = (s: string) => s.replaceAll('{{ap::name::user}}', 'U').replaceAll('{{user}}', 'ST');
    expect(wrapInput(DEFAULT_INPUT_TEMPLATE, 'a {{user}} b')).toBe('<input>\na {{user}} b\n</input>');
    expect(wrapInput('<{{ap::name::user}}>{{content}}</{{ap::name::user}}>', 'x {{user}}', expand)).toBe('<U>x {{user}}</U>');
    expect(wrapInput('{{content}} / {{content}}', '$& $1', expand)).toBe('$& $1 / $& $1');
  });
});
