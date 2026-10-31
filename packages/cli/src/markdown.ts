/**
 * Markdown source parsing: YAML frontmatter plus line/inline directives written as HTML comments.
 *
 *   <!-- @entry id=top region=top order=100 when="transport == 'prefill'" -->   split a module file
 *   <!-- @section stage:final style=imperative -->                              split a workflow file
 *   <!-- @as assistant -->                                                       start a new message
 *   <!-- @style dialogue --> … <!-- @end -->                                     style-only fragment
 *   <!-- @if params.x != "" --> … <!-- @else --> … <!-- @end -->                 conditional fragment
 *   <!-- @template --> … <!-- @end -->                                           EJS template
 *
 * Author comments (`<!--# … -->`, single- or multi-line) are removed and never sent. Directives and
 * comments inside fenced code blocks are literal text. Ordinary comments (e.g. `<!-- Workflow
 * Start -->`) are prompt text and are kept. The tokenizer and content compiler live in the protocol
 * package (`directives.ts`) so the extension can compile user modules with the same rules.
 */
import { parse as parseYaml } from 'yaml';
import { compileTokens, tokenizeDirectives, type Chunk, type Content, type Expr, type Token } from '@advanced-preset/protocol';
import type { Diagnostics, Where } from './diagnostics';

export { parseAttributes, type Chunk, type Directive, type Token } from '@advanced-preset/protocol';

export interface MarkdownFile {
  data: Record<string, unknown>;
  chunks: Chunk[];
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

  const chunks = tokenizeDirectives(body, split, bodyLine, (message, line) =>
    diag.error(message, line === undefined ? where : { ...where, line }),
  );
  return { data, chunks };
}

/** Compile chunk tokens into message blocks with conditional pieces. */
export function compileContent(tokens: Token[], diag: Diagnostics, where: Where, onExpr?: (e: Expr, where: Where) => void): Content {
  return compileTokens(
    tokens,
    (message, line) => diag.error(message, line === undefined ? where : { ...where, line }),
    onExpr && ((e, line) => onExpr(e, { ...where, line })),
    where.file,
  );
}
