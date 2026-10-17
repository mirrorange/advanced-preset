import { describe, expect, it } from 'vitest';
import { evaluate, formatExpr, parseExpr, variables } from '../src/expr';

const env: Record<string, unknown> = {
  transport: 'prefill',
  'meta.pure': false,
  'modules.mode-preface': true,
  'params.length': 600,
  'params.language': '',
};
const r = (p: string) => env[p];

describe('expressions', () => {
  it('parses and evaluates the condition grammar', () => {
    expect(evaluate(parseExpr('transport == "prefill"'), r)).toBe(true);
    expect(evaluate(parseExpr('transport in ["structured", "tool-single"]'), r)).toBe(false);
    expect(evaluate(parseExpr('!meta.pure && modules.mode-preface'), r)).toBe(true);
    expect(evaluate(parseExpr('params.length > 0 && params.language != ""'), r)).toBe(false);
    expect(evaluate(parseExpr('(a || modules.mode-preface) && !(meta.pure)'), r)).toBe(true);
    expect(evaluate(parseExpr("params.length >= 600 && params.length <= 800"), r)).toBe(true);
  });
  it('gives && higher precedence than ||', () => {
    expect(formatExpr(parseExpr('a || b && c'))).toBe('(a || (b && c))');
  });
  it('collects variables', () => {
    expect([...variables(parseExpr('!meta.pure && gen.type != "impersonate"'))]).toEqual(['meta.pure', 'gen.type']);
  });
  it('reports syntax errors with position', () => {
    expect(() => parseExpr('a ==')).toThrow(/Unexpected end/);
    expect(() => parseExpr('a = b')).toThrow(/Unexpected character/);
    expect(() => parseExpr('"open')).toThrow(/Unterminated/);
  });
});
