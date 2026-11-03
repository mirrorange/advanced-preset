import { describe, expect, it } from 'vitest';
import {
  assemble, defaultVars, FORMAT_VERSION, isIfName, replaceStorylineTag, storylineNameFrom, uniqueStorylineName, validStorylineName, activeStructures, normalizeStructure, extractStructureTags, structureFieldSchema, upgradeArtifact, parseExpr, parseStorylineTag, resolverOf, storylineSeparator, stripStorylineTag, test as testExpr, withStorylineTag,
  type APreset, type Configuration,
} from '../src';

describe('storyline tags', () => {
  it('parses a trailing #name and #!name', () => {
    expect(parseStorylineTag('Open the door. #cellar')).toEqual({ form: 'name', name: 'cellar', switchMain: false, hide: false, ifLine: false, at: 15, text: 'Open the door.' });
    expect(parseStorylineTag('Go on.\n#!新主线  ')).toMatchObject({ form: 'name', name: '新主线', switchMain: true, text: 'Go on.' });
    expect(parseStorylineTag('#ifRain')).toMatchObject({ name: 'ifRain', text: '' });
    expect(parseStorylineTag('#a b')).toBeNull();
    expect(parseStorylineTag(`x #${'n'.repeat(65)}`)).toBeNull();
    expect(stripStorylineTag('hi #a')).toBe('hi');
    expect(stripStorylineTag('hi')).toBe('hi');
  });

  it('needs no space before the #, except after ASCII word characters (C#, issue#42, page#anchor)', () => {
    expect(parseStorylineTag('好的，去地下室吧#地下室')).toMatchObject({ form: 'name', name: '地下室', at: 8, text: '好的，去地下室吧' });
    expect(parseStorylineTag('Go.#cellar')).toMatchObject({ name: 'cellar', text: 'Go.' });
    expect(parseStorylineTag('a#b')).toBeNull();
    expect(parseStorylineTag('I like C#')).toBeNull();
    expect(parseStorylineTag('see issue#42')).toBeNull();
    expect(parseStorylineTag('https://x.org/a#b')).toBeNull();
    expect(parseStorylineTag('quote &#39')).toBeNull();
    expect(parseStorylineTag('x ##')).toBeNull();
  });

  it('nameless tags: # / #! the most recent other storyline, #? / #!? a new storyline', () => {
    expect(parseStorylineTag('x #')).toMatchObject({ form: 'recent', name: '', switchMain: false, text: 'x' });
    expect(parseStorylineTag('接着写#')).toMatchObject({ form: 'recent', text: '接着写' });
    expect(parseStorylineTag('x #!')).toMatchObject({ form: 'recent', switchMain: true });
    expect(parseStorylineTag('好#?')).toMatchObject({ form: 'new', name: '', switchMain: false, text: '好' });
    expect(parseStorylineTag('Do you know C#?')).toBeNull();
    expect(parseStorylineTag('x #!? ')).toMatchObject({ form: 'new', switchMain: true });
    expect(parseStorylineTag('x #?a')).toBeNull();
    expect(parseStorylineTag('x #!!a')).toBeNull();
    expect(stripStorylineTag('x #?')).toBe('x');
  });

  it('#@ hides the storyline, #if? is a new if-line (I-161, I-162)', () => {
    expect(parseStorylineTag('x #@cellar')).toMatchObject({ form: 'name', name: 'cellar', hide: true, switchMain: false });
    expect(parseStorylineTag('x #@')).toMatchObject({ form: 'recent', hide: true });
    expect(parseStorylineTag('x #@?')).toMatchObject({ form: 'new', hide: true, ifLine: false });
    expect(parseStorylineTag('x #if?')).toMatchObject({ form: 'new', name: '', hide: false, ifLine: true });
    expect(parseStorylineTag('梦#IF?')).toMatchObject({ form: 'new', ifLine: true });
    expect(parseStorylineTag('x #@if?')).toMatchObject({ form: 'new', hide: true, ifLine: true });
    expect(parseStorylineTag('x #ifRain')).toMatchObject({ form: 'name', name: 'ifRain', ifLine: false });
    expect(parseStorylineTag('x #!if?')).toBeNull();
    expect(parseStorylineTag('x #!@a')).toBeNull();
    expect(parseStorylineTag('x #@!a')).toBeNull();
    expect(parseStorylineTag('x #@@a')).toBeNull();
    expect(validStorylineName('@a')).toBe(false);
    expect(validStorylineName('if?')).toBe(false);
    expect(replaceStorylineTag('x #@', parseStorylineTag('x #@')!, 'B')).toBe('x #@B');
    expect(storylineNameFrom('@Dream')).toBe('Dream');
  });

  it('cleans names chosen by the AI', () => {
    expect(storylineNameFrom('  "The Old Lighthouse" ')).toBe('The_Old_Lighthouse');
    expect(storylineNameFrom('#!?地下室#')).toBe('地下室');
    expect(storylineNameFrom('   ')).toBe('');
    expect(storylineNameFrom(42)).toBe('');
    expect([...storylineNameFrom('x'.repeat(80))].length).toBe(64);
    expect(uniqueStorylineName('cellar', new Set(['cellar', 'cellar-2']))).toBe('cellar-3');
    expect(uniqueStorylineName('cellar', new Set())).toBe('cellar');
    expect(validStorylineName('?x')).toBe(false);
    expect(validStorylineName('!x')).toBe(false);
    expect(validStorylineName('a?')).toBe(true);
  });

  it('rewrites tags', () => {
    const tag = parseStorylineTag('好的#')!;
    expect(replaceStorylineTag('好的#', tag, 'cellar')).toBe('好的#cellar');
    expect(replaceStorylineTag('x  #!', parseStorylineTag('x  #!')!, 'B')).toBe('x  #!B');
    expect(replaceStorylineTag('x #', parseStorylineTag('x #')!, '')).toBe('x');
    expect(withStorylineTag('hi', 'old')).toBe('hi #old');
    expect(withStorylineTag('hi #a', 'b')).toBe('hi #b');
    expect(withStorylineTag('hi #a', '')).toBe('hi');
    expect(withStorylineTag('', 'b', true)).toBe('#!b');
  });

  it('knows if-lines by name and expands separators literally', () => {
    expect(isIfName('ifRain')).toBe(true);
    expect(isIfName('IF-2')).toBe(true);
    expect(isIfName('gift')).toBe(false);
    const expand = (s: string) => s.replaceAll('{{user}}', 'U');
    expect(storylineSeparator('<!-- {{user}}: {{storyline}} -->', '{{user}} $&', expand)).toBe('<!-- U: {{user}} $& -->');
  });
});

const preset = {
  id: 'p', version: '1.0.0',
  actors: { narrator: { name: 'N' }, user: { name: 'U' } },
  styles: { prefill: 'dialogue', plaintext: 'dialogue', structured: 'imperative', 'tool-single': 'imperative', 'tool-multi': 'imperative' },
  regions: [{ id: 'sys', role: 'system', separator: '\n\n' }],
  params: [], groups: {}, regex: [], structures: {}, workflows: [], vars: [], insertionPoints: [],
  modules: [{ id: 'core', name: 'core', toggle: 'always', default: true, structures: [], vars: [] }],
  entries: [
    { id: 'core/side', module: 'core', region: 'sys', order: 100, when: parseExpr('!storyline.main'), content: [{ pieces: [{ text: 'Side story {{ap::storyline}} (main: {{ap::storyline::main}})' }] }] },
    { id: 'core/if', module: 'core', region: 'sys', order: 110, when: parseExpr('storyline.if && storyline.new'), content: [{ pieces: [{ text: 'A new if-line.' }] }] },
  ],
} as unknown as APreset;
const config = { modules: {}, params: {}, identity: { names: {}, prefixes: {} }, connection: { transport: 'structured', workflow: '' }, tokenSaving: { enabled: false } } as unknown as Configuration;

describe('storyline vars and macros', () => {
  it('default to the main storyline', () => {
    const vars = defaultVars(preset, config);
    expect(vars.storyline).toEqual({ name: '', main: true, if: false, new: false, grouped: false, naming: false, namingMain: false, switching: false });
    expect(assemble({ preset, config, vars, data: {} }).regions.sys).toEqual([]);
  });

  it('render the current and the main storyline names', () => {
    const vars = defaultVars(preset, config, { storyline: { name: 'ifRain', main: false, if: true, new: true, grouped: true, naming: false, namingMain: false, switching: false } });
    const a = assemble({ preset, config, vars, data: { storyline: { name: 'ifRain', main: 'Road' } } });
    expect(a.regions.sys).toEqual([{ role: 'system', content: 'Side story ifRain (main: Road)\n\nA new if-line.' }]);
    expect(testExpr(parseExpr('storyline.name == "ifRain"'), resolverOf(a.vars))).toBe(true);
  });

  it('get the user switch in memory when declared', () => {
    const base = { ...preset, formatVersion: FORMAT_VERSION, hash: 'h', configurationDefaults: { ...config }, configurations: [], defaultConfiguration: 'default', locales: {}, tools: {} } as unknown as APreset;
    const plain = upgradeArtifact(JSON.parse(JSON.stringify(base)))!;
    expect('storylines' in plain.configurationDefaults).toBe(false);
    const decl = upgradeArtifact(JSON.parse(JSON.stringify({ ...base, storylines: { separator: 's {{storyline}}', mainSeparator: 'm' } })))!;
    expect(decl.configurationDefaults.storylines).toEqual({ enabled: true, freezeVariables: true });
  });
});

describe('storyline structure (I-158)', () => {
  const decl = { id: 'storyline', kind: 'storyline', tag: 'storyline', field: 'storyline', formatPrompt: { tag: '', field: '' }, properties: { name: 'Name it' } } as const;
  const p = { ...preset, structures: { storyline: decl }, modules: [{ ...preset.modules[0]!, structures: ['storyline'] }] } as unknown as APreset;
  const sv = (naming: boolean, namingMain: boolean) => ({ storyline: { name: '', main: false, if: false, new: true, grouped: true, naming, namingMain, switching: false } });

  it('is only requested when a storyline is named, with the names to give', () => {
    expect(activeStructures(p, p.modules)).toEqual([]);
    expect(activeStructures(p, p.modules, sv(false, false))).toEqual([]);
    expect(activeStructures(p, p.modules, sv(true, false))[0]!.requested).toEqual(['name']);
    const both = activeStructures(p, p.modules, sv(true, true))[0]!;
    expect(both.requested).toEqual(['name', 'previous_main']);
    expect(structureFieldSchema(both)).toEqual({
      type: 'object', properties: { name: { type: 'string', description: 'Name it' }, previous_main: { type: 'string' } }, required: ['name', 'previous_main'], additionalProperties: false,
    });
    expect((structureFieldSchema(activeStructures(p, p.modules, sv(false, true))[0]!) as any).required).toEqual(['previous_main']);
  });

  it('parses JSON, aliases and tag blocks', () => {
    expect(normalizeStructure('storyline', { name: ' Cellar ', previousMain: 'Road' })).toEqual({ name: 'Cellar', previous_main: 'Road' });
    expect(normalizeStructure('storyline', 'Cellar')).toEqual({ name: 'Cellar', previous_main: '' });
    expect(normalizeStructure('storyline', '{"name":"A"}')).toEqual({ name: 'A', previous_main: '' });
    expect(normalizeStructure('storyline', {})).toBeUndefined();
    expect(extractStructureTags('story <storyline><name>Cellar</name><previous_main>Road</previous_main></storyline>', [decl as any]).values.storyline).toEqual({ name: 'Cellar', previous_main: 'Road' });
    expect(extractStructureTags('story\n<storyline>Cellar</storyline>', [decl as any])).toMatchObject({ values: { storyline: { name: 'Cellar', previous_main: '' } } });
  });
});
