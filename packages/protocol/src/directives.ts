/**
 * Directive syntax shared by preset sources and user modules. Directives are HTML comments:
 *
 *   <!-- @as assistant -->                                       start a new message
 *   <!-- @style dialogue --> … <!-- @end -->                     style-only fragment
 *   <!-- @if params.x != "" --> … <!-- @else --> … <!-- @end -->  conditional fragment
 *
 * Directives inside fenced code blocks are literal text. Ordinary comments are prompt text.
 */
import { and, parseExpr, type Expr } from './expr';
import type { Block, Content, Role } from './types';

export interface Directive {
  name: string;
  /** Positional words (e.g. `stage:final`, `assistant`). */
  args: string[];
  attrs: Record<string, string>;
  /** Raw attribute source, used by `@if` which takes an expression. */
  raw: string;
  line: number;
}

export type Token = { kind: 'text'; text: string } | { kind: 'directive'; directive: Directive };

export interface Chunk {
  /** The directive that opened this chunk (e.g. `@entry`), absent for the leading chunk. */
  head?: Directive;
  /** Body tokens: text and inline directives. */
  tokens: Token[];
  line: number;
}

/** Receives compile problems; `line` is the 1-based source line when known. */
export type DirectiveErrorSink = (message: string, line?: number) => void;

const DIRECTIVE_RE = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g;
const FENCE_RE = /^\s*(```|~~~)/;

/** Parse `key=value key="quoted value" word` into positional args and attributes. */
export function parseAttributes(src: string): { args: string[]; attrs: Record<string, string> } {
  const args: string[] = [];
  const attrs: Record<string, string> = {};
  const re = /([\w:.-]+)(?:\s*=\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^\s"']+)))?/g;
  for (const m of src.matchAll(re)) {
    const value = m[2] ?? m[3] ?? m[4];
    if (value === undefined) args.push(m[1]!);
    else attrs[m[1]!] = value.replace(/\\(["'\\])/g, '$1');
  }
  return { args, attrs };
}

/**
 * Tokenise a body. `split` names the directives that start a new chunk.
 * A directive alone on its line consumes the whole line (including the newline).
 */
export function tokenizeDirectives(body: string, split: string[] = [], firstLine = 1): Chunk[] {
  const chunks: Chunk[] = [{ tokens: [], line: firstLine }];
  const push = (t: Token) => {
    const tokens = chunks[chunks.length - 1]!.tokens;
    const last = tokens[tokens.length - 1];
    if (t.kind === 'text' && last?.kind === 'text') last.text += t.text;
    else tokens.push(t);
  };

  const lines = body.replace(/\r\n?/g, '\n').split('\n');
  let fenced = false;
  lines.forEach((line, i) => {
    const nl = i < lines.length - 1 ? '\n' : '';
    const lineNo = firstLine + i;
    if (FENCE_RE.test(line)) fenced = !fenced;
    if (fenced || !line.includes('<!--')) return push({ kind: 'text', text: line + nl });

    const matches = [...line.matchAll(DIRECTIVE_RE)];
    if (!matches.length) return push({ kind: 'text', text: line + nl });
    const alone = line.replace(DIRECTIVE_RE, '').trim() === '';
    let pos = 0;
    for (const m of matches) {
      if (m.index! > pos) push({ kind: 'text', text: line.slice(pos, m.index) });
      const raw = m[2]!.trim();
      const directive: Directive = { name: m[1]!, ...parseAttributes(raw), raw, line: lineNo };
      if (split.includes(directive.name)) chunks.push({ head: directive, tokens: [], line: lineNo });
      else push({ kind: 'directive', directive });
      pos = m.index! + m[0].length;
    }
    if (!alone) push({ kind: 'text', text: line.slice(pos) + nl });
  });
  return chunks;
}

const ROLES: Role[] = ['system', 'user', 'assistant'];
const STYLES = ['dialogue', 'imperative'];

/** Compile body tokens into message blocks with conditional pieces. */
export function compileTokens(tokens: Token[], error: DirectiveErrorSink, onExpr?: (e: Expr, line: number) => void): Content {
  const blocks: Block[] = [{ pieces: [] }];
  type Frame = { cond: Expr; negated?: boolean; style?: boolean; line: number };
  const stack: Frame[] = [];
  const current = () => and(...stack.map((f) => (f.negated ? ({ t: 'not', e: f.cond } as Expr) : f.cond)));

  for (const token of tokens) {
    if (token.kind === 'text') {
      const when = current();
      blocks[blocks.length - 1]!.pieces.push(when ? { text: token.text, when } : { text: token.text });
      continue;
    }
    const d = token.directive;
    switch (d.name) {
      case 'as': {
        const role = d.args[0] as Role;
        if (!ROLES.includes(role)) error(`@as expects one of ${ROLES.join(' | ')}`, d.line);
        if (stack.length) error('@as cannot be used inside @if / @style', d.line);
        blocks.push({ role: ROLES.includes(role) ? role : undefined, pieces: [] });
        break;
      }
      case 'style': {
        const style = d.args[0];
        if (style === 'end') { stack.pop(); break; }
        if (!style || !STYLES.includes(style)) { error(`@style expects dialogue | imperative`, d.line); break; }
        // `@style b` directly after `@style a` switches instead of nesting.
        if (stack.length && stack[stack.length - 1]!.style) stack.pop();
        stack.push({ cond: parseExpr(`style == "${style}"`), style: true, line: d.line });
        break;
      }
      case 'if': {
        try {
          const cond = parseExpr(d.raw);
          onExpr?.(cond, d.line);
          stack.push({ cond, line: d.line });
        } catch (e) {
          error((e as Error).message, d.line);
          stack.push({ cond: { t: 'lit', v: false }, line: d.line });
        }
        break;
      }
      case 'else': {
        const top = stack[stack.length - 1];
        if (!top || top.negated) error('@else without matching @if', d.line);
        else top.negated = true;
        break;
      }
      case 'end':
        if (!stack.length) error('@end without matching @if / @style', d.line);
        stack.pop();
        break;
      default:
        error(`unknown directive @${d.name}`, d.line);
    }
  }
  if (stack.length) error(`unclosed @if / @style (opened at line ${stack[stack.length - 1]!.line})`);
  return blocks.filter((b) => b.pieces.some((p) => p.text.trim()));
}

export interface DirectiveError {
  message: string;
  line?: number;
}

/**
 * Compile free text (e.g. a user module entry) into content. The first message takes `role`
 * when given; `@as` starts further messages.
 */
export function compileText(text: string, role?: Role): { content: Content; errors: DirectiveError[] } {
  const errors: DirectiveError[] = [];
  const [chunk] = tokenizeDirectives(text);
  const content = compileTokens(chunk!.tokens, (message, line) => errors.push({ message, line }));
  if (role && content[0] && !content[0].role) content[0] = { ...content[0], role };
  return { content, errors };
}
