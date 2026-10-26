import { describe, expect, it } from 'vitest';
import {
  assemble, compileText, defaultVars, presetTemplates, userModuleTemplates, withUserModules,
  type APreset, type Configuration, type Content, type Module, type UserModule,
} from '../src';

const mod = (id: string, vars: Module['vars'] = [], over: Partial<Module> = {}): Module => ({ id, name: id, toggle: 'always', default: true, structures: [], vars, ...over });
const content = (src: string): Content => compileText(src).content;

describe('@template directive', () => {
  it('keeps the template body verbatim as one template piece', () => {
    const { content: c, errors } = compileText('Before\n<!-- @template -->\n<% if (n) { %>\n<!-- kept comment -->x\n<% } %>\n<!-- @end -->\nAfter');
    expect(errors).toEqual([]);
    expect(c).toHaveLength(1);
    expect(c[0]!.pieces).toEqual([
      { text: 'Before\n' },
      { text: '<% if (n) { %>\n<!-- kept comment -->x\n<% } %>\n', template: { line: 3 } },
      { text: 'After' },
    ]);
  });

  it('removes author comments inside templates and supports inline use', () => {
    const { content: c } = compileText('a <!-- @template --><%= 1 + 1 %><!--# note --><!-- @end --> b');
    expect(c[0]!.pieces).toEqual([{ text: 'a ' }, { text: '<%= 1 + 1 %>', template: { line: 1 } }, { text: ' b' }]);
  });

  it('takes the condition of the surrounding @if / @style', () => {
    const { content: c } = compileText('<!-- @style dialogue --><!-- @template --><%- style %><!-- @end --><!-- @end -->');
    expect(c[0]!.pieces[0]!.template).toBeDefined();
    expect(c[0]!.pieces[0]!.when).toEqual({ t: 'bin', op: '==', l: { t: 'var', path: 'style' }, r: { t: 'lit', v: 'dialogue' } });
  });

  it('reports directives inside a template, unclosed templates and template syntax errors with source lines', () => {
    expect(compileText('<!-- @template -->\n<!-- @if x -->\n<!-- @end -->').errors).toEqual([
      { message: expect.stringContaining('@if cannot be used inside @template'), line: 2 },
    ]);
    expect(compileText('<!-- @template -->\n<% x %>').errors).toEqual([{ message: 'unclosed @template (opened at line 1)', line: 1 }]);
    expect(compileText('x\n<!-- @template -->\nfine\n<%= oops\n<!-- @end -->').errors).toEqual([
      { message: 'template: Could not find matching close tag for "<%=".', line: 4 },
    ]);
    expect(compileText('<!-- @template x -->a<!-- @end -->').errors[0]!.message).toBe('@template takes no arguments');
    expect(compileText('<!-- @template -->\n<% if ( { %>\n<!-- @end -->').errors[0]!.message).toMatch(/^template: .*while compiling the template/);
  });

  it('cannot start a message inside a template', () => {
    expect(compileText('<!-- @template --><!-- @as user --><!-- @end -->').errors[0]!.message).toMatch(/@as cannot be used inside @template/);
  });
});

const preset = {
  id: 'p', version: '1.0.0',
  actors: { narrator: { name: 'Freesia', prefix: 'Freesia: ' }, user: { name: 'U', prefix: 'U: ' } },
  styles: { prefill: 'dialogue', plaintext: 'dialogue', structured: 'imperative', 'tool-single': 'imperative', 'tool-multi': 'imperative' },
  regions: [{ id: 'top', role: 'system', merge: 'join', separator: '\n\n' }],
  params: [{ id: 'length', type: 'number', label: 'Length', default: 0, unset: 'any length' }],
  groups: {}, regex: [], structures: {}, workflows: [],
  vars: [{ id: 'qs', type: 'dict' }, { id: 'tags', type: 'list' }, { id: 'note', type: 'string' }],
  insertionPoints: [{ id: 'top', label: 'Top', region: 'top', order: 1000 }],
  modules: [
    mod('core', [{ var: 'qs', type: 'dict', items: [{ key: 'outline', value: 'Outline?' }, { key: 'tone', value: 'Tone?' }] }, { var: 'tags', type: 'list', items: ['a', 'b'] }, { var: 'note', type: 'string', text: 'N' }]),
    mod('pacing', [], { toggle: 'user', default: false }),
  ],
  entries: [] as APreset['entries'],
  migrations: [],
} as unknown as APreset;
const config = {
  modules: { pacing: true }, params: { length: 300 }, sampling: { temperature: 0.7 },
  identity: { names: {}, prefixes: {} }, connection: { transport: 'structured', workflow: '' }, tokenSaving: { enabled: false },
} as unknown as Configuration;

const run = (src: string, over: Partial<APreset> = {}, varsOver = {}) => {
  const p = { ...preset, entries: [{ id: 'core/main', module: 'core', region: 'top', order: 100, content: content(src) }], ...over } as APreset;
  const a = assemble({ preset: p, config, vars: defaultVars(p, config, varsOver) });
  return { text: a.regions.top!.map((m) => m.content).join('\n---\n'), warnings: a.warnings };
};

describe('templates in assembly', () => {
  it('reads condition variables, parameters and generation variables', () => {
    const src = '<!-- @template -->\n<%- transport %>/<%- style %>/<%- gen.type %>/<%- params.length %>/<%- modules.pacing %>/<%- sampling.temperature %>\n<!-- @end -->';
    expect(run(src, {}, { gen: { origin: 'story', type: 'swipe', callerTools: false, callerSchema: false } }).text).toBe('structured/imperative/swipe/300/true/0.7');
  });

  it('reads build variables as plain values', () => {
    const src = '<!-- @template -->\n<% for (const [k, v] of Object.entries(vars.qs)) { -%>\n<%- k %>=<%- v %>\n<% } -%>\n<%- vars.tags.join("+") %> <%- vars.note %> <%- Array.isArray(vars.tags) %>\n<!-- @end -->';
    expect(run(src).text).toBe('outline=Outline?\ntone=Tone?\na+b N true');
  });

  it('expands macros in the output and offers macro()', () => {
    const src = '<!-- @template --><%- "{{ap::name::narrator}}" %> / <%- macro("param", "length") %> / <%- macro("var", "qs", "tone") %> / [<%- macro("nope") %>]<!-- @end -->';
    expect(run(src).text).toBe('Freesia / 300 / Tone? / []');
  });

  it('escapes <%= like EJS', () => {
    expect(run('<!-- @template --><%= "<a & \\"b\\">" %><!-- @end -->').text).toBe('&lt;a &amp; &#34;b&#34;&gt;');
  });

  it('drops a failing template, keeps the rest and reports where it failed', () => {
    const p = content('ok\n<!-- @template -->\nline\n<%- missing.x %>\n<!-- @end -->\nend');
    p[0]!.pieces[1]!.template!.file = 'modules/core.md';
    const { text, warnings } = run('', { entries: [{ id: 'core/main', module: 'core', region: 'top', order: 100, content: p }] } as Partial<APreset>);
    expect(text).toBe('ok\nend');
    expect(warnings).toEqual(['template in entry core/main (modules/core.md:4): ReferenceError: missing is not defined']);
  });

  it('gives templates a frozen scope', () => {
    // Templates run in sloppy mode (like EJS): writes to the frozen scope are ignored.
    const src = '<!-- @template --><% params.length = 1; vars.tags.push("x") %><!-- @end -->';
    expect(run(src).warnings[0]).toMatch(/TypeError/); // push on a frozen array throws
    expect(run('<!-- @template --><% params.length = 1 %><%- params.length %> <%- Object.isFrozen(vars.qs) %><!-- @end -->').text).toBe('300 true');
  });

  it('drops a block whose template renders nothing', () => {
    expect(run('<!-- @template --><% if (false) { %>x<% } %><!-- @end -->\n<!-- @as user -->\nhello').text).toBe('hello');
  });

  it('finds templates in presets and user modules', () => {
    const p = { ...preset, entries: [{ id: 'core/main', module: 'core', region: 'top', order: 100, content: content('<!-- @template --><%- 1 %><!-- @end -->') }] } as APreset;
    expect(presetTemplates(p)).toEqual(['<%- 1 %>']);
    expect(presetTemplates(preset)).toEqual([]);
    const um = { id: 'u1', name: 'Mine', enabled: true, trigger: { match: 'all', rules: [] }, entries: [{ id: 'e1', point: 'top', text: 'x <!-- @template --><%- gen.type %><!-- @end -->' }], vars: [] } as unknown as UserModule;
    expect(userModuleTemplates([um])).toEqual(['<%- gen.type %>']);
    const merged = withUserModules(preset, [um]).preset;
    const a = assemble({ preset: merged, config, vars: defaultVars(merged, config) });
    expect(a.regions.top!.map((m) => m.content)).toEqual(['x normal']);
  });
});
