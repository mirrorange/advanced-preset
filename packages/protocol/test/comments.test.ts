import { describe, expect, it } from 'vitest';
import { compileText, tokenizeDirectives } from '../src';

/** Plain text of each compiled block. */
const text = (src: string) => compileText(src).content.map((b) => b.pieces.map((p) => p.text).join(''));

describe('author comments', () => {
  it('removes single-line comments and the lines they occupy', () => {
    expect(text('<!--# note -->\nline\n  <!--# indented -->\nend')).toEqual(['line\nend']);
    expect(text('<!-- # spaced is also a comment -->\nok')).toEqual(['ok']);
  });

  it('removes inline comments with the whitespace on one side', () => {
    expect(text('a <!--# x --> b\nc')).toEqual(['a b\nc']);
    expect(text('a<!--# x -->b')).toEqual(['ab']);
    expect(text('tail <!--# x -->\nnext')).toEqual(['tail\nnext']);
  });

  it('removes multi-line comments, keeping surrounding text on its line', () => {
    expect(text('top\n<!--#\nline one\nline two\n-->\nafter')).toEqual(['top\nafter']);
    expect(text('Hello <!--# a\nb\n--> world\nnext')).toEqual(['Hello world\nnext']);
    expect(text('Hello <!--# a\n-->\nnext')).toEqual(['Hello\nnext']);
    expect(text('<!--# a\n--> world')).toEqual(['world']);
  });

  it('does not execute directives inside comments', () => {
    const src = 'top\n<!--#\n<!-- @as assistant -->\n<!-- @if broken ( -->\n<!-- @wat -->\n-->\n<!--# <!-- @end --> -->\nafter';
    const { content, errors } = compileText(src);
    expect(errors).toEqual([]);
    expect(content).toHaveLength(1);
    expect(content[0]!.pieces.map((p) => p.text).join('')).toBe('top\nafter');
  });

  it('keeps nested ordinary comments inside the comment', () => {
    expect(text('<!--# the <!-- Workflow Start --> marker is for the model -->\nbody')).toEqual(['body']);
  });

  it('ignores fences inside comments and comments inside fences', () => {
    expect(text('<!--#\n```\n-->\n<!-- @if true -->x<!-- @end -->')).toEqual(['x']);
    expect(text('```\n<!--# literal -->\n```')).toEqual(['```\n<!--# literal -->\n```']);
  });

  it('works next to directives', () => {
    const { content, errors } = compileText('<!-- @if params.x == "1" --> <!--# why -->\nX\n<!-- @end -->\nY');
    expect(errors).toEqual([]);
    expect(content[0]!.pieces.map((p) => p.text)).toEqual(['X\n', 'Y']);
    expect(content[0]!.pieces[0]!.when).toBeDefined();
  });

  it('keeps ordinary comments as prompt text', () => {
    expect(text('<!-- Workflow Start -->\n<!--#not sent-->')).toEqual(['<!-- Workflow Start -->\n']);
  });

  it('reports an unclosed comment with its line', () => {
    const { content, errors } = compileText('a\n<!--# open\nb');
    expect(errors).toEqual([{ message: 'unclosed comment <!--# (opened at line 2)', line: 2 }]);
    expect(content[0]!.pieces.map((p) => p.text).join('')).toBe('a\n');
  });

  it('keeps line numbers of later directives', () => {
    const [chunk, next] = tokenizeDirectives('<!--#\n\n\n-->\n<!-- @entry id=x -->\nb', ['entry'], 10);
    expect(chunk!.tokens).toEqual([]);
    expect(next!.head).toMatchObject({ name: 'entry', line: 14 });
  });
});
