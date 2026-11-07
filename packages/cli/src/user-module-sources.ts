/**
 * User modules shipped by a preset → UserModuleSource[]:
 *
 *   user-modules/<id>.md                      bundled user modules (installed into the user's list)
 *   user-module-templates/<id>.md             templates (offered when creating a module)
 *   <dir>/<id>.<lang>.md                      a whole translation, used when the panel language is <lang>
 *
 * Both are user modules written as files, so their text is kept *raw* (author comments, directives
 * and macros included) because the user edits it in the panel; it is only compiled here to report
 * errors and to feed `ap check`.
 *
 * Frontmatter: `name`, `point` / `role` (first entry), `vars`, `when` or `trigger`; `enabled`
 * (bundled modules) and `description` (templates). Further entries start with
 * `<!-- @entry point=<id> role=<role> -->` on a line of its own (`enabled=false`: switched off).
 * In `vars`, the YAML tag `!off` switches off a whole update, a dict key or a list item.
 */
import {
  compileTrigger, listItem, normalizeUserModule, parseAttributes, ruleError, tokenizeDirectives,
  type BuildVarUpdate, type Content, type Expr, type InsertionPoint, type Role, type Token, type Trigger,
  type UserModuleSource, type UserModuleSourceBody, type UserModuleSourceEntry, type UserVarUpdate,
} from '@advanced-preset/protocol';
import type { Diagnostics, Where } from './diagnostics';
import { splitFrontmatter } from './markdown';
import { isPair, isSeq, parseDocument, visit, type ScalarTag, type CollectionTag } from 'yaml';

export type SourceKind = 'module' | 'template';
export const USER_MODULE_DIRS: Record<SourceKind, string> = { module: 'user-modules', template: 'user-module-templates' };
const NOUN: Record<SourceKind, string> = { module: 'user module', template: 'user module template' };
const fileRe = (dir: string) => new RegExp(`^${dir}/([a-z0-9][a-z0-9-]*)(?:\\.([A-Za-z]{2,3}(?:-[A-Za-z0-9]+)*))?\\.md$`);
const ROLES: Role[] = ['system', 'user', 'assistant'];
const ENTRY_RE = /^\s*<!--\s*@entry\b([\s\S]*?)-->\s*$/;
const FENCE_RE = /^\s*(```|~~~)/;

export interface SourceContext {
  diag: Diagnostics;
  insertionPoints: InsertionPoint[];
  expr: (src: unknown, where: Where) => Expr | undefined;
  content: (tokens: Token[], where: Where) => Content;
  varUpdates: (src: unknown, where: Where) => BuildVarUpdate[];
  /** Records condition expressions for `ap check` (trigger rules). */
  onExpr: (e: Expr, where: Where) => void;
}

interface RawPart {
  attrs?: Record<string, string>;
  text: string;
  /** Line of the first text line (or of the marker for empty parts). */
  line: number;
  markerLine?: number;
}

/**
 * Split a body at `@entry` lines, keeping every other line verbatim. Markers inside fenced code
 * blocks and author comments (`<!--# … -->`, nested pairs balanced) are text.
 */
export function splitTemplateBody(body: string, firstLine: number): RawPart[] {
  const parts: { attrs?: Record<string, string>; markerLine?: number; lines: { text: string; no: number }[] }[] = [{ lines: [] }];
  let fenced = false;
  let depth = 0; // > 0 inside an author comment
  /** Balance `<!--` / `-->` from `from`; returns the index after the closing `-->` (or the line end). */
  const scan = (line: string, from: number): number => {
    const re = /<!--|-->/g;
    re.lastIndex = from;
    for (let m = re.exec(line); m; m = re.exec(line)) {
      depth += m[0] === '<!--' ? 1 : -1;
      if (depth === 0) return re.lastIndex;
    }
    return line.length;
  };
  body.split('\n').forEach((line, i) => {
    const no = firstLine + i;
    let pos = 0;
    if (depth > 0) pos = scan(line, 0);
    else {
      const m = ENTRY_RE.exec(line);
      if (!fenced && m) {
        parts.push({ attrs: parseAttributes(m[1]!.trim()).attrs, markerLine: no, lines: [] });
        return;
      }
      if (FENCE_RE.test(line)) fenced = !fenced;
    }
    if (!fenced) {
      const open = /<!--[ \t]*#/g;
      open.lastIndex = pos;
      for (let m = depth === 0 ? open.exec(line) : null; m; m = depth === 0 ? open.exec(line) : null) {
        depth = 1;
        open.lastIndex = scan(line, m.index + m[0].length);
      }
    }
    parts[parts.length - 1]!.lines.push({ text: line, no });
  });
  // Trim blank lines around each part; `line` is the first kept line.
  return parts.map((p) => {
    let a = 0;
    let b = p.lines.length;
    while (a < b && !p.lines[a]!.text.trim()) a++;
    while (b > a && !p.lines[b - 1]!.text.trim()) b--;
    const kept = p.lines.slice(a, b);
    return {
      ...(p.attrs ? { attrs: p.attrs } : {}),
      ...(p.markerLine !== undefined ? { markerLine: p.markerLine } : {}),
      text: kept.map((x) => x.text).join('\n').replace(/[ \t]+$/, ''),
      line: kept[0]?.no ?? p.markerLine ?? firstLine,
    };
  });
}

function parseTrigger(fm: Record<string, unknown>, ctx: SourceContext, where: Where): Trigger {
  const { diag } = ctx;
  if (fm.when !== undefined && fm.trigger !== undefined) diag.error('use either `when` or `trigger`, not both', where);
  let trigger: Trigger = { match: 'all', rules: [] };
  if (fm.when !== undefined && fm.when !== null && fm.when !== '') {
    trigger = { match: 'all', rules: [{ kind: 'expr', source: String(fm.when) }] };
  } else if (fm.trigger !== undefined) {
    const raw = fm.trigger as { rules?: unknown };
    const n = normalizeUserModule({ entries: [], trigger: fm.trigger })!;
    const given = Array.isArray(raw?.rules) ? raw.rules.length : 0;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) diag.error('trigger must be a mapping `{ match, rules }`', where);
    else if (n.trigger.rules.length !== given) diag.error(`trigger has ${given - n.trigger.rules.length} invalid rule(s) (see the user module format)`, where);
    trigger = n.trigger;
  }
  trigger.rules.forEach((r, i) => {
    const err = ruleError(r);
    if (err) diag.error(`trigger rule ${i + 1}: ${err}`, where);
  });
  const e = compileTrigger(trigger);
  if (e) ctx.onExpr(e, where);
  return trigger;
}

interface Compiled extends UserModuleSourceBody { enabled?: boolean }

const OFF = '!off';
/** `!off` on any node keeps its value; the marks are read from the document. */
const OFF_TAGS: (ScalarTag | CollectionTag)[] = [
  { tag: OFF, resolve: (v: string) => v } as ScalarTag,
  { tag: OFF, collection: 'map', resolve: (v) => v } as CollectionTag,
  { tag: OFF, collection: 'seq', resolve: (v) => v } as CollectionTag,
];

/** Where `!off` was written: a path of mapping keys, plus the index for a list item. */
interface OffMark { keys: string[]; index?: number }

/** Parse frontmatter YAML, collecting `!off` marks. */
function parseFrontmatter(yaml: string): { data: unknown; marks: OffMark[]; error?: string } {
  const doc = parseDocument(yaml, { customTags: OFF_TAGS });
  if (doc.errors.length) return { data: undefined, marks: [], error: doc.errors[0]!.message };
  const marks: OffMark[] = [];
  visit(doc, {
    Node(key, node, path) {
      if ((node as { tag?: string }).tag !== OFF) return;
      const keys = path.filter(isPair).map((p) => String((p.key as { value?: unknown })?.value ?? p.key));
      marks.push(isSeq(path[path.length - 1]) && typeof key === 'number' ? { keys, index: key } : { keys });
    },
  });
  return { data: doc.toJS(), marks };
}

/** Switch off what the marks point at: `vars.<id>`, `vars.<id>.<key>` (dict) or `vars.<id>[i]` (list). */
function applyOffMarks(updates: UserVarUpdate[], marks: OffMark[], diag: Diagnostics, where: Where): void {
  for (const { keys, index } of marks) {
    const at = { ...where, path: keys.join('.') + (index !== undefined ? `[${index}]` : '') };
    const [head, id, key, ...rest] = keys;
    const u = head === 'vars' && id !== undefined && !rest.length ? updates.find((x) => x.var === id) : undefined;
    if (head !== 'vars' || id === undefined || rest.length || (key !== undefined && index !== undefined)) {
      diag.error('`!off` switches off a variable update, a dict key or a list item (in `vars`)', at);
    } else if (!u) {
      continue; // unknown variable or wrong value: already reported
    } else if (key === undefined && index === undefined) {
      u.enabled = false;
    } else if (index !== undefined && u.type === 'list') {
      u.items[index] = listItem(String(u.items[index]), false);
    } else if (key !== undefined && u.type === 'dict') {
      const item = u.items.find((x) => x.key === key);
      if (item) item.enabled = false;
    } else {
      diag.error('`!off` switches off a variable update, a dict key or a list item (in `vars`)', at);
    }
  }
}

function compileBody(file: string, src: string, ctx: SourceContext, id: string, kind: SourceKind, translation: boolean): Compiled | undefined {
  const { diag } = ctx;
  const noun = NOUN[kind];
  const { yaml, body, bodyLine } = splitFrontmatter(src);
  const where = { file, line: 1 };
  let fm: Record<string, unknown> = {};
  let marks: OffMark[] = [];
  if (yaml) {
    const parsed = parseFrontmatter(yaml);
    if (parsed.error) {
      diag.error(`invalid frontmatter: ${parsed.error}`, where);
      return undefined;
    }
    if (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) fm = parsed.data as Record<string, unknown>;
    else diag.error('frontmatter must be a mapping', where);
    marks = parsed.marks;
  }
  if (fm.id !== undefined && String(fm.id) !== id) diag.error(`${noun} id comes from the file name (\`${id}\`)`, { ...where, path: 'id' });

  const entries: UserModuleSourceEntry[] = [];
  const parts = splitTemplateBody(body, bodyLine);
  parts.forEach((part, i) => {
    const head = i === 0 ? { point: fm.point, role: fm.role } : part.attrs ?? {};
    const at = { file, line: part.markerLine ?? part.line };
    if (i === 0 && head.point === undefined) {
      if (part.text.trim()) diag.error('text before the first `@entry` needs `point` in the frontmatter', { file, line: part.line });
      if (fm.role !== undefined) diag.error('`role` needs `point` in the frontmatter', where);
      return;
    }
    const point = String(head.point ?? '');
    if (!point) return diag.error('@entry needs `point=<insertion point>`', at);
    if (!ctx.insertionPoints.some((p) => p.id === point)) diag.error(`unknown insertion point \`${point}\``, at);
    const entry: UserModuleSourceEntry = { point, text: part.text };
    if (head.role !== undefined) {
      if (!ROLES.includes(head.role as Role)) diag.error(`role must be ${ROLES.join(' | ')}`, at);
      else entry.role = head.role as Role;
    }
    const enabled = i === 0 ? undefined : part.attrs?.enabled;
    if (enabled === 'false') entry.enabled = false;
    else if (enabled !== undefined && enabled !== 'true') diag.error('@entry `enabled` must be true or false', at);
    for (const k of Object.keys(i === 0 ? {} : part.attrs ?? {})) if (!['point', 'role', 'enabled'].includes(k)) diag.warn(`unknown @entry attribute \`${k}\` in a ${noun}`, at);
    // Compiled only for diagnostics and `ap check`; the artifact keeps the raw text.
    const [chunk] = tokenizeDirectives(part.text, [], part.line, (message, line) => diag.error(message, { file, ...(line !== undefined ? { line } : {}) }));
    ctx.content(chunk!.tokens, { file, line: part.line });
    entries.push(entry);
  });
  if (!entries.length) diag.warn(`${noun} has no entries (set \`point\` in the frontmatter or add \`@entry point=…\`)`, where);

  const name = fm.name === undefined ? id : String(fm.name);
  const vars: UserVarUpdate[] = ctx.varUpdates(fm.vars, { ...where, path: 'vars' });
  applyOffMarks(vars, marks, diag, where);
  const out: Compiled = {
    name,
    ...(fm.description !== undefined && kind === 'template' ? { description: String(fm.description).trim() } : {}),
    entries,
    vars,
    trigger: parseTrigger(fm, ctx, { ...where, path: fm.trigger !== undefined ? 'trigger' : 'when' }),
  };
  if (fm.description !== undefined && kind === 'module') diag.warn('`description` is only shown for user module templates (use an author comment `<!--# … -->` instead)', { ...where, path: 'description' });
  if (fm.enabled !== undefined) {
    if (kind === 'template') diag.warn('`enabled` only applies to bundled user modules (a module made from a template starts enabled)', { ...where, path: 'enabled' });
    else if (translation) diag.warn('`enabled` comes from the source file; it is ignored in translations', { ...where, path: 'enabled' });
    else if (typeof fm.enabled !== 'boolean') diag.error('`enabled` must be true or false', { ...where, path: 'enabled' });
    else out.enabled = fm.enabled;
  }
  const known = new Set(['id', 'name', 'description', 'enabled', 'point', 'role', 'vars', 'when', 'trigger']);
  for (const k of Object.keys(fm)) if (!known.has(k)) diag.warn(`unknown frontmatter key \`${k}\` in a ${noun}`, { ...where, path: k });
  return out;
}

/** Compile the bundled user modules or the templates (sources first, then translations), sorted by file path. */
export function compileUserModuleSources(tree: Map<string, string>, ctx: SourceContext, kind: SourceKind): UserModuleSource[] {
  const dir = USER_MODULE_DIRS[kind];
  const re = fileRe(dir);
  const files = [...tree.keys()].filter((p) => p.startsWith(`${dir}/`)).sort();
  const sources: UserModuleSource[] = [];
  const translations: { file: string; id: string; lang: string }[] = [];
  for (const file of files) {
    const m = re.exec(file);
    if (!m) {
      ctx.diag.error(`${NOUN[kind]} files are \`${dir}/<id>.md\` or \`<id>.<lang>.md\` (id in lower-case kebab-case)`, { file });
      continue;
    }
    if (m[2]) { translations.push({ file, id: m[1]!, lang: m[2].toLowerCase() }); continue; }
    const body = compileBody(file, tree.get(file)!, ctx, m[1]!, kind, false);
    if (!body) continue;
    const { enabled, ...rest } = body;
    sources.push({ id: m[1]!, ...(enabled === false ? { enabled } : {}), ...rest });
  }
  for (const { file, id, lang } of translations) {
    const src = sources.find((x) => x.id === id);
    if (!src) { ctx.diag.error(`translation of unknown ${NOUN[kind]} \`${id}\` (add ${dir}/${id}.md)`, { file }); continue; }
    const body = compileBody(file, tree.get(file)!, ctx, id, kind, true);
    if (body) { const { enabled: _ignored, ...rest } = body; (src.locales ??= {})[lang] = rest; }
  }
  return sources;
}
