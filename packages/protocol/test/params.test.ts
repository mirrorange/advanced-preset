import { describe, expect, it } from 'vitest';
import {
  assemble, compileText, compileTrigger, defaultVars, diffObjects, deepMerge, isParamUnset, normalizeList, paramValue, paramValueMatches, paramValues, parseExpr, test as testExpr,
  type APreset, type Configuration, type Param,
} from '../src';

const words: Param = { id: 'words', type: 'list', label: 'Words', default: [] };
const length: Param = { id: 'length', type: 'number', label: 'Length', default: 0 };
const lang: Param = { id: 'lang', type: 'text', label: 'Language', default: '' };

describe('param values', () => {
  it('normalizes list items: trimmed, non-empty, first occurrence wins', () => {
    expect(normalizeList([' a ', '', 'b', 'a', 3, null, {}])).toEqual(['a', 'b', '3']);
    expect(paramValue(words, [' x', 'x ', 'y'])).toEqual(['x', 'y']);
  });

  it('falls back to the default when a stored value has the wrong shape', () => {
    expect(paramValue({ ...words, default: ['d'] }, 'not a list')).toEqual(['d']);
    expect(paramValue(words, undefined)).toEqual([]);
    expect(paramValue(length, '12')).toBe(12);
    expect(paramValue(length, ['x'])).toBe(0);
    expect(paramValue(lang, ['x'])).toBe('');
    expect(paramValue(lang, 'English')).toBe('English');
  });

  it('checks shapes and unset values', () => {
    expect(paramValueMatches(words, ['a'])).toBe(true);
    expect(paramValueMatches(words, 'a')).toBe(false);
    expect(paramValueMatches(words, [1])).toBe(false);
    expect(paramValueMatches(length, '1')).toBe(false);
    expect(paramValueMatches(lang, 1)).toBe(true);
    for (const v of ['', 0, []]) expect(isParamUnset(v)).toBe(true);
    for (const v of ['x', 1, ['x']]) expect(isParamUnset(v)).toBe(false);
  });

  it('gives every declared param its effective value', () => {
    expect(paramValues({ params: [words, length, lang] }, { params: { words: ['a', 'a'], stale: 'x' } })).toEqual({ words: ['a'], length: 0, lang: '' });
  });

  it('replaces lists wholesale in configuration layers and diffs them as values', () => {
    const base = { params: { words: ['a', 'b'] } };
    expect(deepMerge(base, { params: { words: ['c'] } })).toEqual({ params: { words: ['c'] } });
    expect(deepMerge(base, { params: { words: [] } })).toEqual({ params: { words: [] } });
    expect(diffObjects({ params: { words: ['a', 'b'] } }, base)).toBeUndefined();
    expect(diffObjects({ params: { words: ['b', 'a'] } }, base)).toEqual({ params: { words: ['b', 'a'] } });
  });
});

describe('list params in conditions', () => {
  const resolve = (v: unknown) => (path: string) => (path === 'params.words' ? v : undefined);
  it('treats an empty list as false', () => {
    expect(testExpr(parseExpr('params.words'), resolve([]))).toBe(false);
    expect(testExpr(parseExpr('params.words'), resolve(['a']))).toBe(true);
    expect(testExpr(parseExpr('!params.words'), resolve([]))).toBe(true);
    expect(testExpr(parseExpr('params.words && true'), resolve([]))).toBe(false);
    expect(testExpr(parseExpr('params.words || false'), resolve(['a']))).toBe(true);
  });
  it('tests membership with `in`', () => {
    expect(testExpr(parseExpr('"a" in params.words'), resolve(['a', 'b']))).toBe(true);
    expect(testExpr(parseExpr('"c" in params.words'), resolve(['a', 'b']))).toBe(false);
  });
  it('user-module switch rules test for items', () => {
    const on = compileTrigger({ match: 'all', rules: [{ kind: 'var', path: 'params.words', op: 'on' }] });
    const off = compileTrigger({ match: 'all', rules: [{ kind: 'var', path: 'params.words', op: 'off' }] });
    expect(testExpr(on, resolve([]))).toBe(false);
    expect(testExpr(on, resolve(['a']))).toBe(true);
    expect(testExpr(off, resolve([]))).toBe(true);
  });
});

describe('list params in assembly', () => {
  const preset = {
    id: 'p', version: '1.0.0',
    actors: { narrator: { name: 'N' }, user: { name: 'U' } },
    styles: { prefill: 'dialogue', plaintext: 'dialogue', structured: 'imperative', 'tool-single': 'imperative', 'tool-multi': 'imperative' },
    regions: [{ id: 'top', role: 'system', merge: 'join', separator: '\n\n' }],
    params: [{ ...words, unset: 'nothing' }, { id: 'tags', type: 'list', label: 'Tags', default: ['t1'], separator: ' / ' }, { id: 'more', type: 'list', label: 'More', default: [], fallback: 'tags' }],
    groups: {}, regex: [], structures: {}, workflows: [], vars: [], insertionPoints: [],
    modules: [{ id: 'core', name: 'core', toggle: 'always', default: true, structures: [], vars: [] }],
    entries: [
      { id: 'core/macro', module: 'core', region: 'top', order: 1, content: compileText('Avoid: {{ap::param::words}}. Tags: {{ap::param::tags}}. More: {{ap::param::more}}.').content },
      { id: 'core/if', module: 'core', region: 'top', order: 2, content: compileText('<!-- @if params.words -->Has words.<!-- @else -->No words.<!-- @end -->').content },
      { id: 'core/tpl', module: 'core', region: 'top', order: 3, content: compileText('<!-- @template --><% for (const w of params.words) { %>- <%- w %>\n<% } %>count=<%- params.words.length %><!-- @end -->').content },
    ],
  } as unknown as APreset;
  const config = (params: Record<string, unknown>) => ({ modules: {}, params, identity: { names: {}, prefixes: {} }, connection: { transport: 'structured', workflow: '' }, tokenSaving: { enabled: false }, sampling: {} }) as unknown as Configuration;
  const render = (params: Record<string, unknown>) => {
    const c = config(params);
    const a = assemble({ preset, config: c, vars: defaultVars(preset, c) }, undefined);
    expect(a.warnings).toEqual([]);
    return a.regions.top![0]!.content;
  };

  it('joins items in macros, with unset text and fallbacks for empty lists', () => {
    expect(render({ words: ['闪过', '一丝'] }).split('\n\n')[0]).toBe('Avoid: 闪过, 一丝. Tags: t1. More: t1.');
    expect(render({ words: [], tags: ['a', 'b'] }).split('\n\n')[0]).toBe('Avoid: nothing. Tags: a / b. More: a / b.');
  });

  it('exposes lists to @if and templates', () => {
    expect(render({ words: ['a', 'b'] }).split('\n\n').slice(1)).toEqual(['Has words.', '- a\n- b\ncount=2']);
    expect(render({ words: [] }).split('\n\n').slice(1)).toEqual(['No words.', 'count=0']);
    // A stored value of the wrong shape is read as the default.
    expect(render({ words: 'oops' }).split('\n\n').slice(1)).toEqual(['No words.', 'count=0']);
  });
});
