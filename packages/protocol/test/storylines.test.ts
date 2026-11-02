import { describe, expect, it } from 'vitest';
import {
  assemble, defaultVars, FORMAT_VERSION, isIfName, upgradeArtifact, parseExpr, parseStorylineTag, resolverOf, storylineSeparator, stripStorylineTag, test as testExpr, withStorylineTag,
  type APreset, type Configuration,
} from '../src';

describe('storyline tags', () => {
  it('parses a trailing #name and #!name', () => {
    expect(parseStorylineTag('Open the door. #cellar')).toEqual({ name: 'cellar', switchMain: false, at: 14, text: 'Open the door.' });
    expect(parseStorylineTag('Go on.\n#!新主线  ')).toMatchObject({ name: '新主线', switchMain: true, text: 'Go on.' });
    expect(parseStorylineTag('#ifRain')).toMatchObject({ name: 'ifRain', text: '' });
    expect(parseStorylineTag('a#b')).toBeNull();
    expect(parseStorylineTag('#a b')).toBeNull();
    expect(parseStorylineTag('x #')).toBeNull();
    expect(parseStorylineTag(`x #${'n'.repeat(65)}`)).toBeNull();
    expect(stripStorylineTag('hi #a')).toBe('hi');
    expect(stripStorylineTag('hi')).toBe('hi');
  });

  it('rewrites tags', () => {
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
    expect(vars.storyline).toEqual({ name: '', main: true, if: false, new: false, grouped: false });
    expect(assemble({ preset, config, vars, data: {} }).regions.sys).toEqual([]);
  });

  it('render the current and the main storyline names', () => {
    const vars = defaultVars(preset, config, { storyline: { name: 'ifRain', main: false, if: true, new: true, grouped: true } });
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
