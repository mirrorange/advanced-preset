/**
 * Condition expressions (`when`). Compiled to a JSON AST at build time and evaluated at runtime
 * without `eval`.
 *
 * Grammar: `== != < <= > >= in && || !`, parentheses, string / number / boolean / null / array
 * literals, dotted identifiers (segments may contain `-`, e.g. `modules.mode-preface`).
 */

export type Literal = string | number | boolean | null;
export type BinaryOp = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | '&&' | '||';
export type Expr =
  | { t: 'lit'; v: Literal }
  | { t: 'arr'; items: Expr[] }
  | { t: 'var'; path: string }
  | { t: 'not'; e: Expr }
  | { t: 'bin'; op: BinaryOp; l: Expr; r: Expr };

export class ExprError extends Error {
  constructor(message: string, readonly source: string, readonly pos: number) {
    super(`${message} at ${pos} in \`${source}\``);
  }
}

type Token =
  | { k: 'op'; v: string; pos: number }
  | { k: 'str'; v: string; pos: number }
  | { k: 'num'; v: number; pos: number }
  | { k: 'id'; v: string; pos: number }
  | { k: 'end'; pos: number };

const OPS = ['==', '!=', '<=', '>=', '&&', '||', '<', '>', '!', '(', ')', '[', ']', ','];

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i]!;
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      let s = '';
      while (j < src.length && src[j] !== c) {
        if (src[j] === '\\' && j + 1 < src.length) { s += src[j + 1]; j += 2; continue; }
        s += src[j++];
      }
      if (j >= src.length) throw new ExprError('Unterminated string', src, i);
      out.push({ k: 'str', v: s, pos: i });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(src[i + 1] ?? ''))) {
      const m = /^-?\d+(\.\d+)?/.exec(src.slice(i))!;
      out.push({ k: 'num', v: Number(m[0]), pos: i });
      i += m[0].length;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z0-9_-]*(\.[A-Za-z_][A-Za-z0-9_-]*)*/.exec(src.slice(i))!;
      out.push({ k: 'id', v: m[0], pos: i });
      i += m[0].length;
      continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (!op) throw new ExprError(`Unexpected character '${c}'`, src, i);
    out.push({ k: 'op', v: op, pos: i });
    i += op.length;
  }
  out.push({ k: 'end', pos: src.length });
  return out;
}

const PRECEDENCE: Record<string, number> = { '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '<=': 4, '>': 4, '>=': 4, in: 4 };

/** Parse an expression source into an AST. Throws {@link ExprError}. */
export function parseExpr(src: string): Expr {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p]!;
  const next = () => toks[p++]!;
  const expectOp = (v: string) => {
    const t = next();
    if (t.k !== 'op' || t.v !== v) throw new ExprError(`Expected '${v}'`, src, t.pos);
  };
  const binOp = (t: Token): string | null => {
    if (t.k === 'op' && t.v in PRECEDENCE) return t.v;
    if (t.k === 'id' && t.v === 'in') return 'in';
    return null;
  };

  function primary(): Expr {
    const t = next();
    switch (t.k) {
      case 'str': return { t: 'lit', v: t.v };
      case 'num': return { t: 'lit', v: t.v };
      case 'id':
        if (t.v === 'true') return { t: 'lit', v: true };
        if (t.v === 'false') return { t: 'lit', v: false };
        if (t.v === 'null') return { t: 'lit', v: null };
        return { t: 'var', path: t.v };
      case 'op':
        if (t.v === '!') return { t: 'not', e: primary() };
        if (t.v === '(') { const e = expr(0); expectOp(')'); return e; }
        if (t.v === '[') {
          const items: Expr[] = [];
          if (!(peek().k === 'op' && (peek() as { v: string }).v === ']')) {
            do { items.push(expr(0)); } while (peek().k === 'op' && (peek() as { v: string }).v === ',' && next());
          }
          expectOp(']');
          return { t: 'arr', items };
        }
        throw new ExprError(`Unexpected '${t.v}'`, src, t.pos);
      default:
        throw new ExprError('Unexpected end of expression', src, t.pos);
    }
  }

  function expr(minPrec: number): Expr {
    let left = primary();
    for (;;) {
      const op = binOp(peek());
      if (!op) break;
      const prec = PRECEDENCE[op]!;
      if (prec < minPrec) break;
      next();
      const right = expr(prec + 1);
      left = { t: 'bin', op: op as BinaryOp, l: left, r: right };
    }
    return left;
  }

  const e = expr(0);
  const end = peek();
  if (end.k !== 'end') throw new ExprError('Unexpected token', src, end.pos);
  return e;
}

export type Resolver = (path: string) => unknown;

function looseEq(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (typeof a === 'number' && typeof b === 'string') return String(a) === b;
  if (typeof a === 'string' && typeof b === 'number') return a === String(b);
  return false;
}

export function evaluate(e: Expr, resolve: Resolver): unknown {
  switch (e.t) {
    case 'lit': return e.v;
    case 'arr': return e.items.map((x) => evaluate(x, resolve));
    case 'var': return resolve(e.path);
    case 'not': return !evaluate(e.e, resolve);
    case 'bin': {
      if (e.op === '&&') return Boolean(evaluate(e.l, resolve)) && Boolean(evaluate(e.r, resolve));
      if (e.op === '||') return Boolean(evaluate(e.l, resolve)) || Boolean(evaluate(e.r, resolve));
      const l = evaluate(e.l, resolve);
      const r = evaluate(e.r, resolve);
      switch (e.op) {
        case '==': return looseEq(l, r);
        case '!=': return !looseEq(l, r);
        case 'in':
          if (Array.isArray(r)) return r.some((x) => looseEq(l, x));
          if (typeof r === 'string') return typeof l === 'string' && r.includes(l);
          return false;
        default: {
          const a = Number(l ?? 0);
          const b = Number(r ?? 0);
          if (e.op === '<') return a < b;
          if (e.op === '<=') return a <= b;
          if (e.op === '>') return a > b;
          return a >= b;
        }
      }
    }
  }
}

export function test(e: Expr | undefined, resolve: Resolver): boolean {
  return e ? Boolean(evaluate(e, resolve)) : true;
}

/** Every variable path referenced by an expression. */
export function variables(e: Expr, out: Set<string> = new Set()): Set<string> {
  switch (e.t) {
    case 'var': out.add(e.path); break;
    case 'arr': e.items.forEach((x) => variables(x, out)); break;
    case 'not': variables(e.e, out); break;
    case 'bin': variables(e.l, out); variables(e.r, out); break;
  }
  return out;
}

/** Render an AST back to source (for diagnostics / debug views). */
export function formatExpr(e: Expr): string {
  switch (e.t) {
    case 'lit': return typeof e.v === 'string' ? JSON.stringify(e.v) : String(e.v);
    case 'arr': return `[${e.items.map(formatExpr).join(', ')}]`;
    case 'var': return e.path;
    case 'not': return `!${e.e.t === 'bin' ? `(${formatExpr(e.e)})` : formatExpr(e.e)}`;
    case 'bin': return `(${formatExpr(e.l)} ${e.op} ${formatExpr(e.r)})`;
  }
}

/** `a && b` helper used when combining module, entry and fragment conditions. */
export function and(...parts: (Expr | undefined)[]): Expr | undefined {
  const xs = parts.filter((x): x is Expr => Boolean(x));
  if (!xs.length) return undefined;
  return xs.reduce((l, r) => ({ t: 'bin', op: '&&', l, r }));
}
