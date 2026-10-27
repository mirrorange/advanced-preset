/**
 * Source tree → `APreset` artifact.
 *
 *   preset.yaml          manifest
 *   modules/**\/*.md      one module per file (frontmatter + entries)
 *   workflows/*.md       one workflow per file (frontmatter + sections)
 *   module-templates/*.md  example user modules (raw text; see module-templates.ts)
 *   locales/<lang>.yaml  panel strings
 *
 * Compilation is pure over a `SourceTree` (path → text) so it can be tested without a disk.
 * Cross-reference checks live in `validate.ts`.
 */
import { createHash } from 'node:crypto';
import { parse as parseYaml } from 'yaml';
import {
  isInlineStructure, templateLiterals,
  CACHE_DEFAULTS, CONNECTION_DEFAULTS, DEFAULT_TOOLS, FORMAT_VERSION, STRUCTURE_KINDS, STRUCTURE_PROPERTIES, TRANSPORTS, parseExpr,
  type APreset, type Actor, type CarrierDecl, type CarrierPrompt, type Configuration, type Content, type Entry, type Expr,
  BUILD_VAR_TYPES, type BuildVarDecl, type BuildVarType, type BuildVarUpdate,
  type Group, type InsertionPoint, type Migration, type Module, type Param, type ParamOption, type RecommendedConfiguration,
  type RegexDecl, type Region, type Role, type SemanticAnchor, type Stage, type StageKind, type StructureDecl, type Style,
  type FieldText, type SyntheticTurn, type ToolsDecl, type Transport, type Workflow, type WorkflowSections,
  DEFAULT_SYNOPSIS_HISTORY_TEMPLATE, USER_INPUT_MODES, type UserInputMode,
} from '@advanced-preset/protocol';
import { Diagnostics, type Where } from './diagnostics';
import { compileContent, parseMarkdown, type Chunk } from './markdown';
import { compileModuleTemplates } from './module-templates';

export type SourceTree = Map<string, string>;

/**
 * Version of the *source* format (`preset.yaml#formatVersion`). Independent of the artifact
 * `FORMAT_VERSION`: source changes so far are backward compatible (legacy keys still compile).
 */
export const SOURCE_FORMAT_VERSION = 1;

/** Where each compiled thing came from, for diagnostics produced after compilation. */
export interface SourceMap {
  exprs: { expr: Expr; where: Where }[];
  texts: { text: string; where: Where }[];
  /** `@template` sources (checked for references; their literal text is in `texts`). */
  templates: { source: string; where: Where }[];
  entries: Map<string, Where>;
  modules: Map<string, Where>;
  workflows: Map<string, Where>;
}

export interface CompileResult {
  preset?: APreset;
  diag: Diagnostics;
  map: SourceMap;
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : v == null ? fallback : String(v));
const ROLES: Role[] = ['system', 'user', 'assistant'];
const ANCHORS: SemanticAnchor[] = ['historyStart', 'historyEnd', 'tail'];
const STAGE_KINDS: StageKind[] = ['text', 'content', 'patch'];
const STYLES: Style[] = ['dialogue', 'imperative'];

/** ST native prompts the Carrier may reference by identifier. */
export const NATIVE_PROMPTS: Record<string, { name: string; marker: boolean }> = {
  main: { name: 'Main Prompt', marker: false },
  worldInfoBefore: { name: 'World Info (before)', marker: true },
  personaDescription: { name: 'Persona Description', marker: true },
  charDescription: { name: 'Char Description', marker: true },
  charPersonality: { name: 'Char Personality', marker: true },
  scenario: { name: 'Scenario', marker: true },
  enhanceDefinitions: { name: 'Enhance Definitions', marker: false },
  nsfw: { name: 'Auxiliary Prompt', marker: false },
  worldInfoAfter: { name: 'World Info (after)', marker: true },
  dialogueExamples: { name: 'Chat Examples', marker: true },
  chatHistory: { name: 'Chat History', marker: true },
  jailbreak: { name: 'Post-History Instructions', marker: false },
};

export const anchorText = (region: string) => `⟦ap:region:${region}⟧`;
export const anchorIdentifier = (region: string) => `ap_${region}`;

/**
 * `tools` source → ToolsDecl. Every model-visible text of the transport layer lives here; unset
 * parts fall back to {@link DEFAULT_TOOLS}. Legacy (format 1) keys are still accepted:
 * `submit: <description>`, `stagePrefix`, `stageResult`, `nudge`.
 */
export function compileTools(src: unknown, diag: Diagnostics, text: (s: string, where: Where) => string, file = 'preset.yaml'): ToolsDecl {
  const o = isObj(src) ? src : {};
  const at = (path: string): Where => ({ file, path: `tools.${path}` });
  const opt = (v: unknown, path: string): string | undefined => (v === undefined || v === null ? undefined : text(str(v), at(path)));
  const field = (v: unknown, path: string, fallback: FieldText): FieldText => {
    const f = typeof v === 'string' ? { name: v } : isObj(v) ? v : {};
    const description = f.description !== undefined ? opt(f.description, `${path}.description`) : fallback.description;
    return { name: str(f.name, fallback.name), ...(description ? { description } : {}) };
  };
  const legacy = ['stagePrefix', 'stageResult', 'nudge', 'structures'].filter((k) => k in o);
  if (legacy.length || typeof o.submit === 'string')
    diag.warn(`legacy tools keys (${[...legacy, ...(typeof o.submit === 'string' ? ['submit: <text>'] : [])].join(', ')}); see the README for the tools section`, { file, path: 'tools' });
  const D = DEFAULT_TOOLS;
  const turn = isObj(o.turn) ? o.turn : {};
  const submit = isObj(o.submit) ? o.submit : typeof o.submit === 'string' ? { description: o.submit } : {};
  const stage = isObj(o.stage) ? o.stage : {};
  const patch = isObj(o.patch) ? o.patch : {};
  const env = isObj(o.envelope) ? o.envelope : {};
  const results = isObj(o.results) ? o.results : {};
  const pick = <T>(v: T | undefined, fallback: T) => (v === undefined ? fallback : v);
  const tools: ToolsDecl = {
    turn: {
      name: str(turn.name, D.turn.name),
      field: str(turn.field, D.turn.field),
      ...((): Partial<ToolsDecl['turn']> => {
        const description = opt(turn.description, 'turn.description');
        const fieldDescription = pick(opt(turn.fieldDescription, 'turn.fieldDescription'), D.turn.fieldDescription);
        return { ...(description ? { description } : {}), ...(fieldDescription ? { fieldDescription } : {}) };
      })(),
    },
    submit: { name: str(submit.name, D.submit.name), description: pick(opt(submit.description, 'submit.description'), D.submit.description) },
    stage: {
      name: str(stage.name, typeof o.stagePrefix === 'string' ? `${o.stagePrefix}{{stage}}` : D.stage.name),
      description: pick(opt(stage.description, 'stage.description'), D.stage.description),
      param: field(stage.param, 'stage.param', D.stage.param),
      patchParam: field(stage.patchParam, 'stage.patchParam', D.stage.patchParam),
    },
    patch: Object.fromEntries((['description', 'old', 'new'] as const).flatMap((k) => (patch[k] !== undefined ? [[k, opt(patch[k], `patch.${k}`)!]] : []))),
    envelope: { thinking: field(env.thinking, 'envelope.thinking', D.envelope.thinking), result: field(env.result, 'envelope.result', D.envelope.result) },
    results: {
      next: text(str(results.next ?? o.stageResult, D.results.next), at('results.next')),
      done: text(str(results.done, D.results.done), at('results.done')),
      unknown: text(str(results.unknown, D.results.unknown), at('results.unknown')),
      nudge: text(str(results.nudge ?? o.nudge, D.results.nudge), at('results.nudge')),
    },
    callerSchemaHint: text(str(o.callerSchemaHint, D.callerSchemaHint), at('callerSchemaHint')),
  };
  const hint = o.jsonStringHint === undefined ? D.jsonStringHint : opt(o.jsonStringHint, 'jsonStringHint');
  if (hint) tools.jsonStringHint = hint;
  tools.structurePrefix = o.structurePrefix === undefined || o.structurePrefix === null ? D.structurePrefix! : str(o.structurePrefix);
  if (tools.structurePrefix && !/^[A-Za-z_]\w*$/.test(tools.structurePrefix)) diag.error(`tools.structurePrefix \`${tools.structurePrefix}\` must be letters, digits and underscores, not starting with a digit`, at('structurePrefix'));
  const known = new Set(['turn', 'submit', 'stage', 'patch', 'envelope', 'results', 'structurePrefix', 'jsonStringHint', 'callerSchemaHint', ...legacy]);
  for (const k of Object.keys(o)) if (!known.has(k)) diag.warn(`unknown tools key \`${k}\``, at(k));
  return tools;
}

export function compile(tree: SourceTree): CompileResult {
  const diag = new Diagnostics();
  const map: SourceMap = { exprs: [], texts: [], templates: [], entries: new Map(), modules: new Map(), workflows: new Map() };
  const manifestSrc = tree.get('preset.yaml');
  if (manifestSrc === undefined) {
    diag.error('preset.yaml not found');
    return { diag, map };
  }
  const M = 'preset.yaml';
  let raw: Obj;
  try {
    const parsed = parseYaml(manifestSrc);
    if (!isObj(parsed)) throw new Error('top level must be a mapping');
    raw = parsed;
  } catch (e) {
    diag.error(`invalid YAML: ${(e as Error).message}`, { file: M });
    return { diag, map };
  }

  const expr = (src: unknown, where: Where): Expr | undefined => {
    if (src === undefined || src === null || src === '') return undefined;
    if (typeof src === 'boolean') return { t: 'lit', v: src };
    try {
      const e = parseExpr(String(src));
      map.exprs.push({ expr: e, where });
      return e;
    } catch (e) {
      diag.error((e as Error).message, where);
      return undefined;
    }
  };
  const text = (s: string, where: Where) => {
    map.texts.push({ text: s, where });
    return s;
  };
  const content = (tokens: Chunk['tokens'], where: Where): Content => {
    const c = compileContent(tokens, diag, where, (e, w) => map.exprs.push({ expr: e, where: w }));
    for (const b of c) for (const p of b.pieces) {
      if (!p.template) { map.texts.push({ text: p.text, where }); continue; }
      const at = { ...where, ...(p.template.line !== undefined ? { line: p.template.line } : {}) };
      map.templates.push({ source: p.text, where: at });
      // Macros are checked in the literal text only: code may build macro text at runtime.
      for (const lit of templateLiterals(p.text)) map.texts.push({ text: lit, where: at });
    }
    return c;
  };

  // ── metadata ────────────────────────────────────────────────────────────────
  if (raw.formatVersion !== undefined && raw.formatVersion !== SOURCE_FORMAT_VERSION)
    diag.error(`unsupported formatVersion ${String(raw.formatVersion)} (expected ${SOURCE_FORMAT_VERSION})`, { file: M, path: 'formatVersion' });
  const id = str(raw.id);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) diag.error('id must be lower-case kebab-case', { file: M, path: 'id' });
  const version = str(raw.version, '0.0.0');
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) diag.error('version must be semver', { file: M, path: 'version' });

  // ── actors ──────────────────────────────────────────────────────────────────
  const actors: Record<string, Actor> = {};
  for (const [aid, a] of Object.entries(isObj(raw.actors) ? raw.actors : {})) {
    const o = isObj(a) ? a : {};
    actors[aid] = {
      name: text(str(o.name, aid), { file: M, path: `actors.${aid}.name` }),
      prefix: text(str(o.prefix, `{{ap::name::${aid}}}: `), { file: M, path: `actors.${aid}.prefix` }),
      ...(o.color ? { color: str(o.color) } : {}),
    };
  }
  if (!Object.keys(actors).length) diag.error('at least one actor is required', { file: M, path: 'actors' });
  const narrator = str(raw.narrator, Object.keys(actors)[0] ?? 'narrator');
  const user = str(raw.user, 'user');
  for (const [k, v] of [['narrator', narrator], ['user', user]] as const)
    if (!actors[v]) diag.error(`${k} actor \`${v}\` is not declared`, { file: M, path: k });

  // ── styles ──────────────────────────────────────────────────────────────────
  const styleSrc = isObj(raw.styles) ? raw.styles : {};
  const styles = Object.fromEntries(
    TRANSPORTS.map((t) => {
      const s = str(styleSrc[t], t === 'prefill' || t === 'plaintext' ? 'dialogue' : 'imperative') as Style;
      if (!STYLES.includes(s)) diag.error(`style must be dialogue | imperative`, { file: M, path: `styles.${t}` });
      return [t, s];
    }),
  ) as Record<Transport, Style>;
  for (const k of Object.keys(styleSrc)) if (!TRANSPORTS.includes(k as Transport)) diag.warn(`unknown transport \`${k}\``, { file: M, path: `styles.${k}` });

  // ── regions & anchors ───────────────────────────────────────────────────────
  const regions: Region[] = [];
  const anchors: Partial<Record<SemanticAnchor, string>> = {};
  (Array.isArray(raw.regions) ? raw.regions : []).forEach((r: unknown, i: number) => {
    const o = isObj(r) ? r : {};
    const where = { file: M, path: `regions[${i}]` };
    const rid = str(o.id);
    if (!rid) return diag.error('region id is required', where);
    if (regions.some((x) => x.id === rid)) diag.error(`duplicate region \`${rid}\``, where);
    const role = str(o.role, 'system') as Role;
    if (!ROLES.includes(role)) diag.error(`role must be ${ROLES.join(' | ')}`, where);
    let merge: Region['merge'] = 'none';
    if (o.merge === 'join' || o.merge === 'none') merge = o.merge;
    else if (isObj(o.merge) && typeof o.merge.wrap === 'string') merge = { wrap: o.merge.wrap };
    else if (o.merge !== undefined) diag.error('merge must be none | join | { wrap: <tag> }', where);
    regions.push({ id: rid, role, merge, separator: str(o.separator, '\n\n'), ...(o.native ? { native: true } : {}) });
    if (o.anchor !== undefined) {
      const a = str(o.anchor) as SemanticAnchor;
      if (!ANCHORS.includes(a)) diag.error(`anchor must be ${ANCHORS.join(' | ')}`, where);
      else anchors[a] = rid;
    }
  });
  for (const [a, rid] of Object.entries(isObj(raw.anchors) ? raw.anchors : {})) {
    if (!ANCHORS.includes(a as SemanticAnchor)) diag.error(`unknown semantic anchor \`${a}\``, { file: M, path: `anchors.${a}` });
    else anchors[a as SemanticAnchor] = str(rid);
  }
  for (const a of ANCHORS) if (!anchors[a]) diag.error(`semantic anchor \`${a}\` is not mapped to a region`, { file: M, path: 'anchors' });

  // ── insertion points (user modules) ───────────────────────────────────────
  const insertionPoints: InsertionPoint[] = [];
  (Array.isArray(raw.insertionPoints) ? raw.insertionPoints : []).forEach((r: unknown, i: number) => {
    const o = isObj(r) ? r : {};
    const where = { file: M, path: `insertionPoints[${i}]` };
    const pid = str(o.id);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(pid)) return diag.error('insertion point id must be lower-case kebab-case', where);
    if (insertionPoints.some((x) => x.id === pid)) return diag.error(`duplicate insertion point \`${pid}\``, where);
    const rid = str(o.region);
    const region = regions.find((x) => x.id === rid);
    if (!region) diag.error(`unknown region \`${rid}\``, where);
    else if (region.native) diag.error(`region \`${rid}\` is native; user modules cannot insert there`, where);
    const order = o.order === undefined ? 1000 : Number(o.order);
    if (!Number.isFinite(order)) diag.error('order must be a number', where);
    const point: InsertionPoint = { id: pid, label: str(o.label, pid), region: rid, order };
    if (o.description !== undefined) point.description = str(o.description).trim();
    insertionPoints.push(point);
  });

  // ── build variables ─────────────────────────────────────────────────────────
  // `vars: { <id>: <type> }` or `{ <id>: { type, label?, description?, separator? } }`.
  const vars: BuildVarDecl[] = [];
  if (raw.vars !== undefined && !isObj(raw.vars)) diag.error('vars must be a mapping of id → type', { file: M, path: 'vars' });
  for (const [vid, v] of Object.entries(isObj(raw.vars) ? raw.vars : {})) {
    const where = { file: M, path: `vars.${vid}` };
    const o: Obj = isObj(v) ? v : { type: v };
    if (!/^[A-Za-z][\w-]*$/.test(vid)) { diag.error('variable id must start with a letter (letters, digits, _ and -)', where); continue; }
    if (!BUILD_VAR_TYPES.includes(o.type as BuildVarType)) { diag.error(`variable type must be ${BUILD_VAR_TYPES.join(' | ')}`, where); continue; }
    const decl: BuildVarDecl = { id: vid, type: o.type as BuildVarType };
    if (o.label !== undefined) decl.label = str(o.label);
    if (o.description !== undefined) decl.description = str(o.description).trim();
    if (o.separator !== undefined) {
      if (decl.type === 'string') decl.separator = str(o.separator);
      else diag.warn('separator only applies to string variables', where);
    }
    vars.push(decl);
  }

  // ── params & groups ─────────────────────────────────────────────────────────
  const params: Param[] = (Array.isArray(raw.params) ? raw.params : []).map((p: unknown, i: number) => {
    const o = isObj(p) ? p : {};
    const where = { file: M, path: `params[${i}]` };
    const type = str(o.type, 'text') as Param['type'];
    if (!['text', 'number', 'select'].includes(type)) diag.error('param type must be text | number | select', where);
    const options: ParamOption[] | undefined = Array.isArray(o.options)
      ? o.options.map((x: unknown) => (isObj(x) ? { value: x.value as string | number, ...(x.label !== undefined ? { label: str(x.label) } : {}), ...(x.text !== undefined ? { text: text(str(x.text), where) } : {}) } : { value: x as string | number }))
      : undefined;
    const param: Param = {
      id: str(o.id),
      type,
      label: str(o.label, str(o.id)),
      default: (o.default as string | number | undefined) ?? (type === 'number' ? 0 : ''),
    };
    for (const k of ['description', 'group', 'unset', 'fallback', 'unit'] as const) if (o[k] !== undefined) param[k] = str(o[k]);
    for (const k of ['min', 'max'] as const) if (typeof o[k] === 'number') param[k] = o[k] as number;
    if (param.unset) text(param.unset, where);
    if (options) param.options = options;
    if (!param.id) diag.error('param id is required', where);
    return param;
  });
  const groups: Record<string, Group> = {};
  let groupOrder = 0;
  for (const [gid, g] of Object.entries(isObj(raw.groups) ? raw.groups : {})) {
    const o = isObj(g) ? g : {};
    groupOrder += 10;
    groups[gid] = {
      label: str(o.label, gid),
      order: typeof o.order === 'number' ? o.order : groupOrder,
      ...(o.description ? { description: str(o.description) } : {}),
      ...(o.allowNone ? { allowNone: true } : {}),
      ...(o.tab ? { tab: str(o.tab) as Group['tab'] } : {}),
    };
  }

  const tools = compileTools(raw.tools, diag, text, M);

  // ── structures ──────────────────────────────────────────────────────────────
  // Field names get `tools.structurePrefix` (I-94); `{{field}}` in the field-style texts is the final name.
  const structures: Record<string, StructureDecl> = {};
  for (const [sid, s] of Object.entries(isObj(raw.structures) ? raw.structures : {})) {
    const o = isObj(s) ? s : {};
    const where = { file: M, path: `structures.${sid}` };
    const kind = str(o.kind, sid) as StructureDecl['kind'];
    if (!STRUCTURE_KINDS.includes(kind)) diag.error(`structure kind must be one of ${STRUCTURE_KINDS.join(', ')}`, where);
    const fp = isObj(o.formatPrompt) ? o.formatPrompt : {};
    const inline = isInlineStructure({ kind });
    const base = str(o.field, sid);
    const field = inline ? base : `${tools.structurePrefix ?? ''}${base}`;
    const fieldText = (v: unknown, path: string, check = true) => {
      const t = str(v).replaceAll('{{field}}', field);
      if (check && !inline && field !== base && t.includes(`\`${base}\``))
        diag.warn(`mentions \`${base}\`, but the field is \`${field}\` (tools.structurePrefix); write {{field}} instead`, { ...where, path: `${where.path}.${path}` });
      return text(t, where);
    };
    const decl: StructureDecl = {
      id: sid,
      kind,
      tag: str(o.tag, sid),
      field,
      formatPrompt: { tag: text(str(fp.tag), where), field: fieldText(fp.field, 'formatPrompt.field') },
    };
    if (o.description !== undefined) decl.description = fieldText(o.description, 'description');
    if (isObj(o.properties)) {
      const allowed = STRUCTURE_PROPERTIES[kind] ?? [];
      const props: Record<string, string> = {};
      for (const [k, v] of Object.entries(o.properties)) {
        if (!allowed.includes(k)) { diag.error(`${kind} has no sub-field \`${k}\`${allowed.length ? ` (expected ${allowed.join(' | ')})` : ''}`, { ...where, path: `${where.path}.properties.${k}` }); continue; }
        props[k] = fieldText(v, `properties.${k}`, false);
      }
      if (Object.keys(props).length) decl.properties = props;
    }
    if (typeof o.count === 'number') decl.count = o.count;
    if (kind === 'custom') {
      decl.shape = o.shape === 'kv' ? 'kv' : 'text';
      decl.display = o.display === 'hidden' ? 'hidden' : 'card';
    }
    if (kind === 'annotations') {
      // Inline: the same instructions apply to every transport, so one text may serve both.
      if (!decl.formatPrompt.tag) decl.formatPrompt.tag = decl.formatPrompt.field;
      if (!decl.formatPrompt.field) decl.formatPrompt.field = decl.formatPrompt.tag;
    }
    if (o.history !== undefined) {
      if (kind !== 'annotations' && kind !== 'synopsis') diag.error('only annotations and synopsis structures support `history`', { ...where, path: `${where.path}.history` });
      else if (typeof o.history === 'number' && Number.isInteger(o.history) && o.history >= 0) decl.history = o.history;
      else diag.error('`history` must be a non-negative integer', { ...where, path: `${where.path}.history` });
    }
    if (kind === 'synopsis' && (o.history !== undefined || o.historyTemplate !== undefined)) {
      decl.historyTemplate = str(o.historyTemplate, DEFAULT_SYNOPSIS_HISTORY_TEMPLATE);
      if (!decl.historyTemplate.includes('{{content}}')) diag.warn('`historyTemplate` has no `{{content}}`: kept messages would lose their text', { ...where, path: `${where.path}.historyTemplate` });
    } else if (o.historyTemplate !== undefined) diag.warn('`historyTemplate` only applies to synopsis structures and is ignored', { ...where, path: `${where.path}.historyTemplate` });
    if (o.title !== undefined) decl.title = text(str(o.title), where);
    if (!/^[A-Za-z_][\w.-]*$/.test(decl.tag)) diag.error(`invalid tag name \`${decl.tag}\``, where);
    if (!/^[A-Za-z_]\w*$/.test(decl.field)) diag.error(`invalid field name \`${decl.field}\``, where);
    structures[sid] = decl;
  }

  // ── regex ───────────────────────────────────────────────────────────────────
  const regex: RegexDecl[] = (Array.isArray(raw.regex) ? raw.regex : []).map((r: unknown, i: number) => {
    const o = isObj(r) ? r : {};
    const where = { file: M, path: `regex[${i}]` };
    const decl: RegexDecl = { id: str(o.id), pattern: str(o.pattern), flags: str(o.flags, 'i'), target: str(o.target, 'meta') as RegexDecl['target'] };
    try {
      new RegExp(decl.pattern, decl.flags);
    } catch (e) {
      diag.error(`invalid regex: ${(e as Error).message}`, where);
    }
    if (!/^(input|meta|recent:\d+)$/.test(decl.target)) diag.error('target must be input | meta | recent:<N>', where);
    const req = expr(o.requires, where);
    if (req) decl.requires = req;
    return decl;
  });

  // ── meta / token saving / synthetic turns / tools / theme ──────────────────
  const metaSrc = isObj(raw.meta) ? raw.meta : {};
  const tasksSrc = isObj(metaSrc.tasks) ? metaSrc.tasks : {};
  const meta: APreset['meta'] = {
    trigger: text(str(metaSrc.trigger, `@{{ap::name::${narrator}}}`), { file: M, path: 'meta.trigger' }),
    wrap: metaSrc.wrap !== false,
    recentCount: typeof metaSrc.recentCount === 'number' ? metaSrc.recentCount : 3,
    tasks: {},
    impersonatePrompt: text(str(metaSrc.impersonatePrompt, `${str(metaSrc.trigger, `@{{ap::name::${narrator}}}`)} Write my next reply for me.`), { file: M, path: 'meta.impersonatePrompt' }),
  };
  for (const [task, cond] of Object.entries(tasksSrc)) {
    if (task !== 'summary' && task !== 'impersonate') { diag.error(`unknown meta task \`${task}\``, { file: M, path: `meta.tasks.${task}` }); continue; }
    const e = expr(cond, { file: M, path: `meta.tasks.${task}` });
    if (e) meta.tasks[task] = e;
  }
  const tsSrc = isObj(raw.tokenSaving) ? raw.tokenSaving : {};
  const userInputMode = (v: unknown, path: string): UserInputMode | undefined => {
    if (v === undefined) return undefined;
    if (USER_INPUT_MODES.includes(v as UserInputMode)) return v as UserInputMode;
    diag.error(`\`userInput\` must be one of ${USER_INPUT_MODES.join(', ')}`, { file: M, path });
    return undefined;
  };
  const tokenSaving: APreset['tokenSaving'] = {
    keepFullTurns: typeof tsSrc.keepFullTurns === 'number' ? tsSrc.keepFullTurns : 6,
    truncateUserAfter: typeof tsSrc.truncateUserAfter === 'number' ? tsSrc.truncateUserAfter : 2000,
    userInput: userInputMode(tsSrc.userInput, 'tokenSaving.userInput') ?? 'truncate',
    synopsisTemplate: str(tsSrc.synopsisTemplate, '[{{time}} · {{location}}] {{event}}: {{summary}}'),
  };
  const syntheticTurns: SyntheticTurn[] = (Array.isArray(raw.syntheticTurns) ? raw.syntheticTurns : []).map((s: unknown, i: number) => {
    const o = isObj(s) ? s : {};
    const where = { file: M, path: `syntheticTurns[${i}]` };
    const toolSrc = isObj(o.tool) ? o.tool : {};
    const resp = isObj(o.response) ? o.response : {};
    const turn: SyntheticTurn = {
      id: str(o.id),
      label: str(o.label, str(o.id)),
      user: text(str(o.user), where),
      tool: { name: str(toolSrc.name, 'ap_workflow_init'), description: text(str(toolSrc.description), where) },
      response: { single: text(str(resp.single), where), multi: text(str(resp.multi), where), parallel: text(str(resp.parallel ?? resp.multi), where) },
    };
    if (o.thoughtSignature) turn.thoughtSignature = str(o.thoughtSignature);
    if (!/^[A-Za-z_][\w-]*$/.test(turn.tool.name)) diag.error('invalid tool name', where);
    return turn;
  });
  const theme = isObj(raw.theme) ? (raw.theme as APreset['theme']) : {};

  // ── modules ─────────────────────────────────────────────────────────────────
  const modules: Module[] = [];
  const entries: Entry[] = [];
  const moduleFiles = [...tree.keys()].filter((p) => p.startsWith('modules/') && p.endsWith('.md')).sort();
  for (const file of moduleFiles) {
    const parsed = parseMarkdown(tree.get(file)!, ['entry'], diag, { file });
    const fm = parsed.data;
    const where = { file, line: 1 };
    const mid = str(fm.id, file.replace(/^.*\//, '').replace(/\.md$/, ''));
    if (modules.some((m) => m.id === mid)) diag.error(`duplicate module id \`${mid}\``, where);
    const toggle: Module['toggle'] = fm.toggle === 'always' || fm.system === true ? 'always' : 'user';
    if (fm.questions !== undefined) diag.error('`questions` was replaced by build variables: declare them in preset.yaml#vars and update them with `vars`', where);
    const mod: Module = {
      id: mid,
      name: str(fm.name, mid),
      toggle,
      default: toggle === 'always' ? true : fm.default === true,
      structures: Array.isArray(fm.structures) ? fm.structures.map((s) => str(s)) : [],
      vars: varUpdates(fm.vars, vars, diag, { ...where, path: 'vars' }, text),
      source: file,
    };
    if (fm.description !== undefined) mod.description = str(fm.description).trim();
    if (fm.group !== undefined) mod.group = str(fm.group);
    if (fm.exclusive !== undefined) mod.exclusive = str(fm.exclusive);
    const mw = expr(fm.when, { ...where, path: 'when' });
    if (mw) mod.when = mw;
    modules.push(mod);
    map.modules.set(mid, where);

    const defRegion = fm.region === undefined ? undefined : str(fm.region);
    const defOrder = typeof fm.order === 'number' ? fm.order : 1000;
    parsed.chunks.forEach((chunk, ci) => {
      const hasText = chunk.tokens.some((t) => t.kind === 'text' && t.text.trim());
      if (!chunk.head && !hasText) return;
      const at = { file, line: chunk.line };
      const attrs = chunk.head?.attrs ?? {};
      const local = attrs.id ?? (chunk.head ? `entry${ci}` : 'main');
      const region = attrs.region ?? defRegion;
      if (!region) return diag.error('entry has no region (set `region` in frontmatter or on @entry)', at);
      const order = attrs.order !== undefined ? Number(attrs.order) : defOrder;
      if (!Number.isFinite(order)) diag.error('order must be a number', at);
      const eid = `${mid}/${local}`;
      if (entries.some((e) => e.id === eid)) diag.error(`duplicate entry id \`${eid}\``, at);
      const entry: Entry = { id: eid, module: mid, region, order, content: content(chunk.tokens, at) };
      const ew = expr(attrs.when, at);
      if (ew) entry.when = ew;
      entries.push(entry);
      map.entries.set(eid, at);
    });
  }

  // module order: listed ids first (in listed order) with `*` standing for every unlisted module (path order)
  const moduleOrder = Array.isArray(raw.moduleOrder) ? raw.moduleOrder.map((x) => str(x)) : ['*'];
  if (!moduleOrder.includes('*')) moduleOrder.push('*');
  const rank = (mid: string) => {
    const i = moduleOrder.indexOf(mid);
    if (i >= 0) return i * 10000;
    return moduleOrder.indexOf('*') * 10000 + 1 + modules.findIndex((m) => m.id === mid);
  };
  modules.sort((a, b) => rank(a.id) - rank(b.id));
  const regionIndex = (rid: string) => regions.findIndex((r) => r.id === rid);
  entries.sort((a, b) => regionIndex(a.region) - regionIndex(b.region) || a.order - b.order || rank(a.module) - rank(b.module));

  // ── module templates (example user modules) ─────────────────────────────────
  const moduleTemplates = compileModuleTemplates(tree, {
    diag,
    insertionPoints,
    expr,
    content,
    varUpdates: (src, where) => varUpdates(src, vars, diag, where, text),
    onExpr: (e, where) => map.exprs.push({ expr: e, where }),
  });

  // ── workflows ───────────────────────────────────────────────────────────────
  const workflows: Workflow[] = [];
  const workflowFiles = [...tree.keys()].filter((p) => /^workflows\/[^/]+\.md$/.test(p)).sort();
  for (const file of workflowFiles) {
    const wf = compileWorkflow(file, tree.get(file)!, diag, expr, content, text);
    if (!wf) continue;
    if (workflows.some((w) => w.id === wf.id)) diag.error(`duplicate workflow id \`${wf.id}\``, { file });
    workflows.push(wf);
    map.workflows.set(wf.id, { file });
  }
  if (Array.isArray(raw.workflowOrder)) {
    const order = raw.workflowOrder.map((x) => str(x));
    workflows.sort((a, b) => (order.indexOf(a.id) + 1 || 1e6) - (order.indexOf(b.id) + 1 || 1e6));
  }

  // ── carrier ─────────────────────────────────────────────────────────────────
  const carrier = compileCarrier(isObj(raw.carrier) ? raw.carrier : {}, regions, str(raw.name, id), diag);

  // ── configuration defaults & recommendations ───────────────────────────────
  const cd = isObj(raw.configurationDefaults) ? raw.configurationDefaults : {};
  const sect = (k: string): Obj => (isObj(cd[k]) ? (cd[k] as Obj) : {});
  const storyWorkflow = workflows.find((w) => w.kind === 'story')?.id ?? '';
  const identitySrc = sect('identity');
  const configurationDefaults: Configuration = {
    connection: {
      ...CONNECTION_DEFAULTS,
      workflow: storyWorkflow,
      syntheticTurn: syntheticTurns[0]?.id ?? null,
      ...(sect('connection') as Partial<Configuration['connection']>),
    },
    sampling: { ...sect('sampling') },
    identity: {
      names: Object.fromEntries(Object.keys(actors).map((a) => [a, ''])),
      prefixes: Object.fromEntries(Object.keys(actors).map((a) => [a, ''])),
    },
    modules: Object.fromEntries(modules.filter((m) => m.toggle === 'user').map((m) => [m.id, m.default])),
    params: Object.fromEntries(params.map((p) => [p.id, p.default])),
    tokenSaving: { enabled: false, keepFullTurns: tokenSaving.keepFullTurns, truncateUserAfter: tokenSaving.truncateUserAfter, userInput: tokenSaving.userInput, ...(sect('tokenSaving') as object) },
    cache: { ...CACHE_DEFAULTS, ...(sect('cache') as Partial<Configuration['cache']>) },
    meta: { enabled: true, recentCount: meta.recentCount, ...(sect('meta') as object) },
  };
  for (const k of ['names', 'prefixes'] as const) if (isObj(identitySrc[k])) Object.assign(configurationDefaults.identity[k], identitySrc[k]);
  for (const [k, v] of Object.entries(sect('modules'))) {
    if (!(k in configurationDefaults.modules)) diag.error(`configurationDefaults.modules: unknown user module \`${k}\``, { file: M, path: `configurationDefaults.modules.${k}` });
    else configurationDefaults.modules[k] = Boolean(v);
  }
  for (const [k, v] of Object.entries(sect('params'))) {
    if (!(k in configurationDefaults.params)) diag.error(`configurationDefaults.params: unknown param \`${k}\``, { file: M, path: `configurationDefaults.params.${k}` });
    else configurationDefaults.params[k] = v as string | number;
  }
  userInputMode(sect('tokenSaving').userInput, 'configurationDefaults.tokenSaving.userInput');
  /** `cache` section of the defaults or of a recommended configuration's diff. */
  const checkCache = (c: Obj, path: string) => {
    for (const [k, v] of Object.entries(c)) {
      const where = { file: M, path: `${path}.${k}` };
      if (!(k in CACHE_DEFAULTS)) diag.warn(`unknown cache option \`${k}\``, where);
      else if (k === 'enabled' ? typeof v !== 'boolean' : typeof v !== 'number' || !Number.isFinite(v) || v < 0) diag.error(k === 'enabled' ? '`enabled` must be a boolean' : `\`${k}\` must be a number ≥ 0`, where);
    }
  };
  checkCache(sect('cache'), 'configurationDefaults.cache');
  /** `meta` section of the defaults or of a recommended configuration's diff. */
  const checkMeta = (c: Obj, path: string) => {
    if ('enabled' in c && typeof c.enabled !== 'boolean') diag.error('`enabled` must be a boolean', { file: M, path: `${path}.enabled` });
  };
  checkMeta(sect('meta'), 'configurationDefaults.meta');
  for (const k of Object.keys(cd)) if (!(k in configurationDefaults)) diag.warn(`unknown configuration section \`${k}\``, { file: M, path: `configurationDefaults.${k}` });

  const configurations: RecommendedConfiguration[] = (Array.isArray(raw.configurations) ? raw.configurations : []).map((c: unknown, i: number) => {
    const o = isObj(c) ? c : {};
    const rc: RecommendedConfiguration = { id: str(o.id), name: str(o.name, str(o.id)), diff: (isObj(o.diff) ? o.diff : {}) as RecommendedConfiguration['diff'] };
    if (o.description !== undefined) rc.description = str(o.description);
    if (!rc.id) diag.error('configuration id is required', { file: M, path: `configurations[${i}]` });
    if (isObj(rc.diff.tokenSaving)) userInputMode(rc.diff.tokenSaving.userInput, `configurations[${i}].diff.tokenSaving.userInput`);
    if (isObj(rc.diff.cache)) checkCache(rc.diff.cache, `configurations[${i}].diff.cache`);
    if (isObj(rc.diff.meta)) checkMeta(rc.diff.meta, `configurations[${i}].diff.meta`);
    return rc;
  });
  if (!configurations.length) configurations.push({ id: 'default', name: 'Default', diff: {} });
  const defaultConfiguration = str(raw.defaultConfiguration, configurations[0]!.id);

  const migrations: Migration[] = (Array.isArray(raw.migrations) ? raw.migrations : []).map((m: unknown, i: number) => {
    const o = isObj(m) ? m : {};
    const rename = (isObj(o.rename) ? o.rename : {}) as Migration['rename'];
    const known = {
      modules: new Set(modules.map((x) => x.id)),
      params: new Set(params.map((x) => x.id)),
      insertionPoints: new Set(insertionPoints.map((x) => x.id)),
      vars: new Set(vars.map((x) => x.id)),
    };
    for (const section of Object.keys(rename) as (keyof Migration['rename'])[]) {
      const where = { file: M, path: `migrations[${i}].rename.${section}` };
      if (!(section in known)) { diag.warn(`unknown rename section \`${section}\``, where); continue; }
      for (const [from, to] of Object.entries(isObj(rename[section]) ? rename[section]! : {}))
        if (!known[section].has(String(to))) diag.warn(`\`${from}\` is renamed to \`${String(to)}\`, which this version does not declare`, where);
    }
    return { from: str(o.from), rename };
  });

  // ── locales ─────────────────────────────────────────────────────────────────
  const locales: APreset['locales'] = {};
  for (const [file, src] of tree) {
    const m = /^locales\/([\w-]+)\.ya?ml$/.exec(file);
    if (!m) continue;
    try {
      const parsed = parseYaml(src);
      if (isObj(parsed)) locales[m[1]!.toLowerCase()] = parsed as APreset['locales'][string];
      else diag.error('locale file must be a mapping', { file });
    } catch (e) {
      diag.error(`invalid YAML: ${(e as Error).message}`, { file });
    }
  }

  const preset: APreset = {
    formatVersion: FORMAT_VERSION,
    id,
    name: str(raw.name, id),
    version,
    ...(raw.author !== undefined ? { author: str(raw.author) } : {}),
    ...(raw.description !== undefined ? { description: str(raw.description).trim() } : {}),
    ...(raw.minAdvancedPreset !== undefined ? { minAdvancedPreset: str(raw.minAdvancedPreset) } : {}),
    hash: '',
    actors,
    narrator,
    user,
    styles,
    plaintextFormat: raw.plaintextFormat === 'tag' ? 'tag' : 'prefix',
    contentMarker: str(raw.contentMarker, '<START_OF_CONTENT>'),
    prefillGuide: text(str(raw.prefillGuide), { file: M, path: 'prefillGuide' }),
    historyItemTemplate: str(raw.historyItemTemplate, '{{prefix}}{{content}}'),
    stageHeading: text(str(raw.stageHeading, '### Step {{n}}: {{label}} ({{actor}})'), { file: M, path: 'stageHeading' }),
    stop: Array.isArray(raw.stop) ? raw.stop.map((s) => str(s)) : [],
    regions,
    anchors: anchors as APreset['anchors'],
    workflowRegion: str(raw.workflowRegion, anchors.tail ?? ''),
    params,
    groups,
    modules,
    entries,
    insertionPoints,
    moduleTemplates,
    vars,
    workflows,
    structures,
    regex,
    meta,
    tokenSaving,
    syntheticTurns,
    tools,
    theme,
    carrier,
    configurationDefaults,
    configurations,
    defaultConfiguration,
    migrations,
    moduleOrder,
    locales,
  };
  preset.hash = hashPreset(preset);
  return { preset, diag, map };
}

const isScalar = (v: unknown): v is string | number | boolean => ['string', 'number', 'boolean'].includes(typeof v);

/**
 * A module's `vars`: `{ <id>: value }`. Strings take text, lists an item or a list of items,
 * dicts a mapping (a `null` value removes the key). Values are scalars only (lists and dicts are shallow).
 */
function varUpdates(src: unknown, decls: BuildVarDecl[], diag: Diagnostics, where: Where, text: (s: string, w: Where) => string): BuildVarUpdate[] {
  if (src === undefined) return [];
  if (!isObj(src)) { diag.error('vars must be a mapping of variable id → value', where); return []; }
  const out: BuildVarUpdate[] = [];
  for (const [id, v] of Object.entries(src)) {
    const at = { ...where, path: `vars.${id}` };
    const decl = decls.find((d) => d.id === id);
    if (!decl) { diag.error(`unknown variable \`${id}\` (declare it in preset.yaml#vars)`, at); continue; }
    const scalarText = (x: unknown, w: Where) => text(String(x), w);
    switch (decl.type) {
      case 'string':
        if (!isScalar(v)) diag.error(`\`${id}\` is a string variable: expected text`, at);
        else out.push({ var: id, type: 'string', text: scalarText(v, at) });
        break;
      case 'list': {
        const items = Array.isArray(v) ? v : [v];
        if (!items.every(isScalar)) { diag.error(`\`${id}\` is a list variable: expected an item or a list of plain items`, at); break; }
        out.push({ var: id, type: 'list', items: items.map((x, i) => scalarText(x, { ...at, path: `vars.${id}[${i}]` })) });
        break;
      }
      case 'dict': {
        if (!isObj(v)) { diag.error(`\`${id}\` is a dict variable: expected a mapping`, at); break; }
        const bad = Object.entries(v).filter(([, x]) => x !== null && !isScalar(x)).map(([k]) => k);
        if (bad.length) { diag.error(`\`${id}\` is a dict variable: values must be plain (${bad.join(', ')})`, at); break; }
        out.push({ var: id, type: 'dict', items: Object.entries(v).map(([key, x]) => ({ key, value: x === null ? null : scalarText(x, { ...at, path: `vars.${id}.${key}` }) })) });
        break;
      }
    }
  }
  return out;
}

function compileWorkflow(
  file: string,
  src: string,
  diag: Diagnostics,
  expr: (s: unknown, w: Where) => Expr | undefined,
  content: (tokens: Chunk['tokens'], w: Where) => Content,
  text: (s: string, w: Where) => string,
): Workflow | undefined {
  const parsed = parseMarkdown(src, ['section'], diag, { file });
  const fm = parsed.data;
  const id = str(fm.id, file.replace(/^.*\//, '').replace(/\.md$/, ''));
  const kind = fm.kind === 'task' ? 'task' : 'story';
  const stages: Stage[] = [];
  (Array.isArray(fm.stages) ? fm.stages : []).forEach((s: unknown, i: number) => {
    const o = isObj(s) ? s : {};
    const where = { file, path: `stages[${i}]` };
    const stage: Stage = { id: str(o.id), actor: str(o.actor), kind: str(o.kind, 'text') as StageKind, label: str(o.label, str(o.id)) };
    if (!/^[a-z][\w-]*$/i.test(stage.id)) diag.error('stage id is required (letters, digits, _ and -)', where);
    if (stages.some((x) => x.id === stage.id)) diag.error(`duplicate stage \`${stage.id}\``, where);
    if (!STAGE_KINDS.includes(stage.kind)) diag.error(`stage kind must be ${STAGE_KINDS.join(' | ')}`, where);
    if (o.optional) stage.optional = true;
    if (o.tag !== undefined) stage.tag = str(o.tag);
    if (o.field !== undefined) {
      const f = isObj(o.field) ? o.field : { description: o.field };
      const out: Stage['field'] = {};
      if (f.name !== undefined) out.name = str(f.name);
      if (f.description !== undefined) out.description = text(str(f.description), where);
      stage.field = out;
    }
    if (o.tool !== undefined) {
      const t = isObj(o.tool) ? o.tool : { description: o.tool };
      const out: NonNullable<Stage['tool']> = {};
      if (t.name !== undefined) out.name = str(t.name);
      if (t.description !== undefined) out.description = text(str(t.description), where);
      if (t.param !== undefined) {
        const p = isObj(t.param) ? t.param : { name: t.param };
        out.param = {};
        if (p.name !== undefined) out.param.name = str(p.name);
        if (p.description !== undefined) out.param.description = text(str(p.description), where);
      }
      stage.tool = out;
    }
    if (o.executor !== undefined && o.executor !== 'default') diag.error('only `executor: default` is supported in v1', where);
    const w = expr(o.when, where);
    if (w) stage.when = w;
    stages.push(stage);
  });
  if (!stages.length) diag.error('workflow has no stages', { file });
  if (kind === 'story' && !stages.some((s) => s.kind === 'content')) diag.error('story workflows need a `content` stage', { file });

  const sections: WorkflowSections = { intro: {}, outro: {}, stages: {} };
  const seen = new Set<string>();
  for (const chunk of parsed.chunks) {
    const at = { file, line: chunk.line };
    if (!chunk.head) {
      if (chunk.tokens.some((t) => t.kind === 'text' && t.text.trim())) diag.warn('text before the first @section is ignored', at);
      continue;
    }
    const name = chunk.head.args[0] ?? '';
    const styleAttr = chunk.head.attrs.style;
    const targetStyles: Style[] = styleAttr ? [styleAttr as Style] : STYLES;
    if (styleAttr && !STYLES.includes(styleAttr as Style)) { diag.error('style must be dialogue | imperative', at); continue; }
    const body = content(chunk.tokens, at);
    if (name === 'preamble') {
      if (styleAttr) diag.warn('preamble is shared by both styles; `style` ignored', at);
      if (sections.preamble) diag.error('duplicate preamble section', at);
      sections.preamble = body;
      continue;
    }
    let slot: Partial<Record<Style, Content>> | undefined;
    if (name === 'intro') slot = sections.intro;
    else if (name === 'outro') slot = sections.outro;
    else if (name.startsWith('stage:')) {
      const sid = name.slice(6);
      if (!stages.some((s) => s.id === sid)) { diag.error(`section for unknown stage \`${sid}\``, at); continue; }
      slot = sections.stages[sid] ??= {};
    } else {
      diag.error(`unknown section \`${name}\` (expected preamble | intro | outro | stage:<id>)`, at);
      continue;
    }
    for (const st of targetStyles) {
      const key = `${name}@${st}`;
      if (seen.has(key)) diag.error(`duplicate section \`${name}\` for style ${st}`, at);
      seen.add(key);
      slot[st] = body;
    }
  }

  const wf: Workflow = { id, name: str(fm.name, id), kind, stages, sections };
  if (fm.description !== undefined) wf.description = str(fm.description).trim();
  if (fm.hint !== undefined) wf.hint = str(fm.hint).trim();
  const after = isObj(fm.structures) ? fm.structures.after : undefined;
  if (after !== undefined) {
    wf.structuresAfter = str(after);
    if (!stages.some((s) => s.id === wf.structuresAfter)) diag.error(`structures.after: unknown stage \`${wf.structuresAfter}\``, { file });
  }
  return wf;
}

/**
 * Carrier source:
 *
 *   carrier:
 *     label: 🌸 Petals                 # anchor prompt name prefix
 *     order: [top, role, { main: false }, worldInfoBefore, …]
 *     prompts: { main: { content: "" } }   # overrides / extra prompts by identifier
 *
 * Region ids become anchor prompts, ST identifiers become native prompts.
 */
function compileCarrier(src: Obj, regions: Region[], presetName: string, diag: Diagnostics): CarrierDecl {
  const M = 'preset.yaml';
  const label = str(src.label, presetName);
  const overrides = isObj(src.prompts) ? src.prompts : {};
  const prompts: CarrierPrompt[] = [];
  const prompt_order: CarrierDecl['prompt_order'] = [];
  const order = Array.isArray(src.order) ? src.order : [];
  const add = (identifier: string, enabled: boolean, where: Where) => {
    const region = regions.find((r) => r.id === identifier);
    let p: CarrierPrompt | undefined;
    if (region && !region.native) {
      p = { identifier: anchorIdentifier(region.id), name: `${label} · ${region.id}`, role: region.role, content: anchorText(region.id), system_prompt: false, marker: false, injection_position: 0, injection_depth: 4, forbid_overrides: true };
    } else if (NATIVE_PROMPTS[identifier]) {
      const n = NATIVE_PROMPTS[identifier];
      p = n.marker ? { identifier, name: n.name, system_prompt: true, marker: true } : { identifier, name: n.name, system_prompt: true, role: 'system', content: '', marker: false };
    } else if (isObj(overrides[identifier])) {
      p = { identifier, name: identifier, role: 'system', content: '', system_prompt: false, marker: false, injection_position: 0, injection_depth: 4 };
    } else {
      return diag.error(`carrier.order: \`${identifier}\` is neither a region, an ST prompt nor declared in carrier.prompts`, where);
    }
    if (isObj(overrides[identifier])) Object.assign(p, overrides[identifier]);
    if (prompts.some((x) => x.identifier === p!.identifier)) return diag.error(`carrier.order: duplicate \`${identifier}\``, where);
    prompts.push(p);
    prompt_order.push({ identifier: p.identifier, enabled });
  };
  order.forEach((item: unknown, i: number) => {
    const where = { file: M, path: `carrier.order[${i}]` };
    if (typeof item === 'string') add(item, true, where);
    else if (isObj(item) && Object.keys(item).length === 1) {
      const [k, v] = Object.entries(item)[0]!;
      add(k, v !== false, where);
    } else diag.error('carrier.order items are `id` or `{ id: false }`', where);
  });
  for (const r of regions) if (!r.native && !prompt_order.some((o) => o.identifier === anchorIdentifier(r.id))) diag.error(`region \`${r.id}\` has no anchor in carrier.order`, { file: M, path: 'carrier.order' });
  if (!prompt_order.some((o) => o.identifier === 'chatHistory')) diag.error('carrier.order must contain chatHistory', { file: M, path: 'carrier.order' });
  return { prompts, prompt_order };
}

/** Canonical JSON (sorted keys) used for hashing. */
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(',')}]`;
  if (v && typeof v === 'object')
    return `{${Object.keys(v as Obj).sort().filter((k) => (v as Obj)[k] !== undefined).map((k) => `${JSON.stringify(k)}:${canonicalJson((v as Obj)[k])}`).join(',')}}`;
  return JSON.stringify(v);
}

export function hashPreset(p: APreset): string {
  return createHash('sha256').update(canonicalJson({ ...p, hash: undefined })).digest('hex').slice(0, 16);
}
