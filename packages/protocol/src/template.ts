/**
 * EJS-compatible templates (`<!-- @template -->` … `<!-- @end -->`, I-109).
 *
 * The compiler follows EJS 3 (`lib/ejs.js`, default options) so templates behave exactly as EJS
 * documents them:
 *
 *   <% code %>      scriptlet, no output          <%_ code %>   scriptlet, strips the whitespace before it
 *   <%= value %>    output, HTML-escaped          <%- value %>  output, unescaped
 *   <%# comment %>  nothing                       <%%  %%>      literal `<%` / `%>`
 *   %>  close       -%>  close + drop the next newline       _%>  close + drop the whitespace after it
 *
 * The data object is the template's scope (`with (locals) { … }`), so `params.length` and
 * `locals.params.length` are the same. `include` and custom delimiters are not supported.
 *
 * Templates are JavaScript: they run in the page with full access to it. The extension only
 * installs presets / user modules containing templates after the user trusts them.
 */

/** A template problem. `line` is the 1-based line inside the template source when known. */
export class TemplateError extends Error {
  readonly line?: number;
  constructor(message: string, line?: number) {
    super(message);
    this.name = 'TemplateError';
    this.line = line;
  }
}

export type TemplateFn = (data: Record<string, unknown>) => string;

const TOKEN_RE = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/;
const CLOSERS = new Set(['%>', '-%>', '_%>']);

type Mode = 'eval' | 'escaped' | 'raw' | 'comment' | 'literal' | null;

/** EJS `escapeXML`. */
export function escapeXML(markup: unknown): string {
  if (markup == undefined) return '';
  return String(markup).replace(/[&<>'"]/g, (c) => ESCAPES[c]!);
}
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&#34;', "'": '&#39;' };

/** Split like EJS `parseTemplateText`: alternating text and tags, no empty strings. */
function tokens(text: string): string[] {
  return text.split(TOKEN_RE).filter((s) => s !== '');
}

/** EJS's whitespace slurping around `<%_` / `_%>`. */
const slurp = (src: string) => src.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

/** Generate the function body of a template (EJS `generateSource` with `compileDebug`). */
export function templateSource(src: string): string {
  const matches = tokens(slurp(src));
  let out = '';
  let mode: Mode = null;
  let truncate = false;
  let line = 1;

  const addOutput = (text: string) => {
    if (truncate) {
      // Only the single line break directly after `-%>` / `_%>`.
      text = text.replace(/^(?:\r\n|\r|\n)/, '');
      truncate = false;
    }
    if (text) out += `    ; __append(${JSON.stringify(text)})\n`;
  };
  const stripSemi = (s: string) => s.replace(/;(\s*$)/, '$1');

  matches.forEach((tok, i) => {
    if (tok.startsWith('<%') && !tok.startsWith('<%%')) {
      const closing = matches[i + 2];
      if (!closing || !CLOSERS.has(closing)) throw new TemplateError(`Could not find matching close tag for "${tok}".`, line);
    }
    const newlines = tok.split('\n').length - 1;
    switch (tok) {
      case '<%':
      case '<%_': mode = 'eval'; break;
      case '<%=': mode = 'escaped'; break;
      case '<%-': mode = 'raw'; break;
      case '<%#': mode = 'comment'; break;
      case '<%%': mode = 'literal'; out += `    ; __append("<%")\n`; break;
      case '%%>': mode = 'literal'; out += `    ; __append("%>")\n`; break;
      case '%>':
      case '-%>':
      case '_%>':
        if (mode === 'literal') addOutput(tok);
        mode = null;
        truncate = tok.startsWith('-') || tok.startsWith('_');
        break;
      default: {
        let code = tok;
        // A `//` comment without a following line break would swallow the generated code after it.
        if ((mode === 'eval' || mode === 'escaped' || mode === 'raw') && code.lastIndexOf('//') > code.lastIndexOf('\n')) code += '\n';
        switch (mode) {
          case 'eval': out += `    ; ${code}\n`; break;
          case 'escaped': out += `    ; __append(escapeFn(${stripSemi(code)}))\n`; break;
          case 'raw': out += `    ; __append(${stripSemi(code)})\n`; break;
          case 'comment': break;
          case 'literal':
          case null: addOutput(code); break;
        }
      }
    }
    if (newlines) {
      line += newlines;
      out += `    ; __line = ${line}\n`;
    }
  });

  return [
    'var __line = 1;',
    'var __output = "";',
    'function __append(s) { if (s !== undefined && s !== null) __output += s }',
    'try {',
    '  with (locals || {}) {',
    out,
    '  }',
    '  return __output;',
    '} catch (e) { rethrow(e, __line); }',
  ].join('\n');
}

const include = () => {
  throw new Error('include() is not supported in Advanced Preset templates');
};
const rethrow = (e: unknown, line: number): never => {
  throw new TemplateError(e instanceof Error ? `${e.name === 'Error' ? '' : `${e.name}: `}${e.message}` : String(e), line);
};

const cache = new Map<string, TemplateFn>();
const CACHE_LIMIT = 500;

/**
 * Compile a template into a render function (memoised by source). Throws `TemplateError` for
 * unclosed tags and JavaScript syntax errors. Compiling never runs template code.
 */
export function compileTemplate(src: string): TemplateFn {
  const hit = cache.get(src);
  if (hit) return hit;
  const body = templateSource(src);
  let fn: (locals: unknown, escapeFn: typeof escapeXML, inc: typeof include, re: typeof rethrow) => string;
  try {
    fn = new Function('locals, escapeFn, include, rethrow', body) as typeof fn;
  } catch (e) {
    throw new TemplateError(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
  }
  const render: TemplateFn = (data) => fn(data, escapeXML, include, rethrow);
  if (cache.size >= CACHE_LIMIT) cache.clear();
  cache.set(src, render);
  return render;
}

/** Render a template. Throws `TemplateError` (with the template line) on compile or runtime errors. */
export function renderTemplate(src: string, data: Record<string, unknown>): string {
  return compileTemplate(src)(data);
}

/** Problems of a template that can be found without running it (unclosed tags, syntax errors). */
export function checkTemplate(src: string): TemplateError | null {
  try {
    compileTemplate(src);
    return null;
  } catch (e) {
    return e instanceof TemplateError ? e : new TemplateError(String(e));
  }
}

/** Literal (output) text of a template, outside every tag — e.g. for macro checks. */
export function templateLiterals(src: string): string[] {
  const out: string[] = [];
  let mode: Mode = null;
  for (const tok of tokens(slurp(src))) {
    if (tok === '<%' || tok === '<%_') mode = 'eval';
    else if (tok === '<%=' || tok === '<%-' || tok === '<%#') mode = 'raw';
    else if (tok === '<%%' || tok === '%%>') { mode = 'literal'; out.push(tok === '<%%' ? '<%' : '%>'); }
    else if (CLOSERS.has(tok)) { if (mode === 'literal') out.push(tok); mode = null; }
    else if (mode === null || mode === 'literal') out.push(tok);
  }
  return out;
}

/** JavaScript code of a template (scriptlets and output tags, not comments) — e.g. for reference checks. */
export function templateCode(src: string): string[] {
  const out: string[] = [];
  let mode: Mode = null;
  for (const tok of tokens(slurp(src))) {
    if (tok === '<%' || tok === '<%_' || tok === '<%=' || tok === '<%-') mode = 'eval';
    else if (tok === '<%#') mode = 'comment';
    else if (tok === '<%%' || tok === '%%>') mode = 'literal';
    else if (CLOSERS.has(tok)) mode = null;
    else if (mode === 'eval') out.push(tok);
  }
  return out;
}

/** Recursively freeze plain data so templates cannot change what other templates see. */
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value as Record<string, unknown>)) deepFreeze(v);
  }
  return value;
}
