/**
 * Markdown source parsing: YAML frontmatter plus line/inline directives written as HTML comments.
 *
 *   <!-- @entry id=top region=top order=100 when="transport == 'prefill'" -->   split a module file
 *   <!-- @section stage:final style=imperative -->                              split a workflow file
 *   <!-- @as assistant -->                                                       start a new message
 *   <!-- @style dialogue --> … <!-- @end -->                                     style-only fragment
 *   <!-- @if params.x != "" --> … <!-- @else --> … <!-- @end -->                 conditional fragment
 *
 * Directives inside fenced code blocks are literal text. Ordinary comments (e.g. `<!-- Workflow
 * Start -->`) are prompt text and are kept.
 */
import { parse as parseYaml } from 'yaml';
import { and, parseExpr, type Block, type Content, type Expr, type Role } from '@advanced-preset/protocol';
import type { Diagnostics, Where } from './diagnostics';

export interface Directive {
  name: string;
  /** Positional words (e.g. `stage:final`, `assistant`). */
  args: string[];
  attrs: Record<string, string>;
  /** Raw attribute source, used by `@if` which takes an expression. */
  raw: string;
  line: number;
}

export interface Chunk {
  /** The directive that opened this chunk (`@entry` / `@section`), absent for the leading chunk. */
  head?: Directive;
  /** Body tokens: text and inline directives (`@as`, `@style`, `@if`, `@else`, `@end`). */
  tokens: Token[];
  line: number;
}

export type Token = { kind: 'text'; text: string } | { kind: 'directive'; directive: Directive };

export interface MarkdownFile {
  data: Record<string, unknown>;
  chunks: Chunk[];
}

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

export function splitFrontmatter(src: string): { yaml: string; body: string; bodyLine: number } {
  const text = src.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const m = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
  if (!m) return { yaml: '', body: text, bodyLine: 1 };
  return { yaml: m[1]!, body: text.slice(m[0].length), bodyLine: m[0].split('\n').length };
}

/**
 * Tokenise a Markdown body. `split` names the directives that start a new chunk.
 * A directive alone on its line consumes the whole line (including the newline).
 */
export function parseMarkdown(src: string, split: string[], diag: Diagnostics, where: Where): MarkdownFile {
  const { yaml, body, bodyLine } = splitFrontmatter(src);
  let data: Record<string, unknown> = {};
  if (yaml) {
    try {
      const parsed = parseYaml(yaml);
      if (parsed && typeof parsed === 'object') data = parsed as Record<string, unknown>;
      else diag.error('frontmatter must be a mapping', where);
    } catch (e) {
      diag.error(`invalid frontmatter: ${(e as Error).message}`, where);
    }
  }

  const chunks: Chunk[] = [{ tokens: [], line: bodyLine }];
  const push = (t: Token) => {
    const tokens = chunks[chunks.length - 1]!.tokens;
    const last = tokens[tokens.length - 1];
    if (t.kind === 'text' && last?.kind === 'text') last.text += t.text;
    else tokens.push(t);
  };

  const lines = body.split('\n');
  let fenced = false;
  lines.forEach((line, i) => {
    const nl = i < lines.length - 1 ? '\n' : '';
    const lineNo = bodyLine + i;
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
  return { data, chunks };
}

const ROLES: Role[] = ['system', 'user', 'assistant'];
const STYLES = ['dialogue', 'imperative'];

/** Compile chunk tokens into message blocks with conditional pieces. */
export function compileContent(tokens: Token[], diag: Diagnostics, where: Where, onExpr?: (e: Expr, where: Where) => void): Content {
  const blocks: Block[] = [{ pieces: [] }];
  type Frame = { cond: Expr; negated?: boolean; line: number };
  const stack: Frame[] = [];
  const current = () => and(...stack.map((f) => (f.negated ? ({ t: 'not', e: f.cond } as Expr) : f.cond)));

  for (const token of tokens) {
    if (token.kind === 'text') {
      const when = current();
      blocks[blocks.length - 1]!.pieces.push(when ? { text: token.text, when } : { text: token.text });
      continue;
    }
    const d = token.directive;
    const at = { ...where, line: d.line };
    switch (d.name) {
      case 'as': {
        const role = d.args[0] as Role;
        if (!ROLES.includes(role)) diag.error(`@as expects one of ${ROLES.join(' | ')}`, at);
        if (stack.length) diag.error('@as cannot be used inside @if / @style', at);
        blocks.push({ role: ROLES.includes(role) ? role : undefined, pieces: [] });
        break;
      }
      case 'style': {
        const style = d.args[0];
        if (style === 'end') { stack.pop(); break; }
        if (!style || !STYLES.includes(style)) { diag.error(`@style expects dialogue | imperative`, at); break; }
        // `@style b` directly after `@style a` switches instead of nesting.
        if (stack.length && (stack[stack.length - 1] as Frame & { style?: boolean }).style) stack.pop();
        stack.push(Object.assign({ cond: parseExpr(`style == "${style}"`), line: d.line }, { style: true }));
        break;
      }
      case 'if': {
        try {
          const cond = parseExpr(d.raw);
          onExpr?.(cond, at);
          stack.push({ cond, line: d.line });
        } catch (e) {
          diag.error((e as Error).message, at);
          stack.push({ cond: { t: 'lit', v: false }, line: d.line });
        }
        break;
      }
      case 'else': {
        const top = stack[stack.length - 1];
        if (!top || top.negated) diag.error('@else without matching @if', at);
        else top.negated = true;
        break;
      }
      case 'end':
        if (!stack.length) diag.error('@end without matching @if / @style', at);
        stack.pop();
        break;
      default:
        diag.error(`unknown directive @${d.name}`, at);
    }
  }
  if (stack.length) diag.error(`unclosed @if / @style (opened at line ${stack[stack.length - 1]!.line})`, where);
  return blocks.filter((b) => b.pieces.some((p) => p.text.trim()));
}
