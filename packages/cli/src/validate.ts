/** Cross-reference checks over a compiled artifact (`ap check`, and every `ap build`). */
import {
  MACRO_HEADS, TOOL_ARG_STREAMING, TRANSPORTS, listMacros, pruneDiff, deepMerge, variables, turnArtifacts, structuresAnchorIndex,
  type APreset, type Expr,
} from '@advanced-preset/protocol';
import type { Diagnostics, Where } from './diagnostics';
import type { SourceMap } from './compile';

/** Fixed condition variables (§6.7) and the literal values they may be compared with. */
const FIXED_VARS: Record<string, readonly string[] | null> = {
  transport: TRANSPORTS,
  style: ['dialogue', 'imperative'],
  workflow: null,
  'gen.origin': ['story', 'task'],
  'gen.type': ['normal', 'continue', 'swipe', 'regenerate', 'quiet', 'impersonate', 'script'],
  'gen.callerTools': null,
  'gen.callerSchema': null,
  'meta.present': null,
  'meta.pure': null,
  'meta.mixed': null,
  'meta.task': ['summary', 'impersonate'],
  'meta.recent': null,
  'features.tokenSaving': null,
  'chat.group': null,
  'memory.hasChat': null,
  'memory.hasGlobal': null,
  'recap.present': null,
  'features.questions': null,
};

export function validate(p: APreset, map: SourceMap, diag: Diagnostics): void {
  const M = 'preset.yaml';
  const moduleIds = new Set(p.modules.map((m) => m.id));
  const paramIds = new Set(p.params.map((x) => x.id));
  const flagIds = new Set(p.regex.map((r) => r.id));
  const regionIds = new Set(p.regions.map((r) => r.id));
  const workflowIds = new Set(p.workflows.map((w) => w.id));

  // ── condition variables ─────────────────────────────────────────────────────
  const checkVar = (path: string, where: Where) => {
    if (path in FIXED_VARS) return;
    const [root, ...rest] = path.split('.');
    const key = rest.join('.');
    const known = root === 'modules' ? moduleIds : root === 'params' ? paramIds : root === 'flags' ? flagIds : undefined;
    if (!known) return diag.error(`unknown variable \`${path}\``, where);
    if (!known.has(key)) diag.error(`unknown ${root.slice(0, -1)} \`${key}\` in condition`, where);
  };
  const literalsFor = (e: Expr): string[] => (e.t === 'lit' && typeof e.v === 'string' ? [e.v] : e.t === 'arr' ? e.items.flatMap(literalsFor) : []);
  const checkLiterals = (e: Expr, where: Where): void => {
    if (e.t === 'not') return checkLiterals(e.e, where);
    if (e.t !== 'bin') return;
    if (['==', '!=', 'in'].includes(e.op) && e.l.t === 'var') {
      const allowed = e.l.path === 'workflow' ? [...workflowIds] : FIXED_VARS[e.l.path];
      if (allowed) for (const v of literalsFor(e.r)) if (!allowed.includes(v)) diag.error(`\`${e.l.path}\` is never ${JSON.stringify(v)} (expected ${allowed.join(' | ')})`, where);
    }
    checkLiterals(e.l, where);
    checkLiterals(e.r, where);
  };
  for (const { expr, where } of map.exprs) {
    for (const v of variables(expr)) checkVar(v, where);
    checkLiterals(expr, where);
  }

  // ── macros ──────────────────────────────────────────────────────────────────
  const structureIds = new Set(Object.keys(p.structures));
  for (const { text, where } of map.texts) {
    for (const args of listMacros(text)) {
      const [head, ...rest] = args;
      const spec = MACRO_HEADS[head!];
      const shown = `{{ap::${args.join('::')}}}`;
      if (!spec) { diag.error(`unknown macro ${shown}`, where); continue; }
      if (rest.length < spec.min || rest.length > spec.max) { diag.error(`${shown}: expected ${spec.min === spec.max ? spec.min : `${spec.min}–${spec.max}`} argument(s)`, where); continue; }
      const a = rest[0];
      const bad = (what: string) => diag.error(`${shown}: ${what}`, where);
      switch (head) {
        case 'name':
        case 'prefix':
          if (!p.actors[a!]) bad(`unknown actor \`${a}\``);
          break;
        case 'param':
          if (!paramIds.has(a!)) bad(`unknown param \`${a}\``);
          break;
        case 'structure':
          if (!structureIds.has(a!)) bad(`unknown structure \`${a}\``);
          else if (rest[1] !== undefined && (rest[1] !== 'last' || p.structures[a!]!.kind !== 'custom')) bad('only custom structures support `::last`');
          break;
        case 'workflow':
          if (a !== 'summary' && a !== 'hint') bad('expected summary | hint');
          break;
        case 'input':
          if (a !== 'meta') bad('expected meta');
          break;
        case 'memory':
          if (a !== 'chat' && a !== 'global') bad('expected chat | global');
          break;
        case 'questions':
          if (a !== 'mandatory' && a !== 'optional') bad('expected mandatory | optional');
          break;
      }
    }
  }

  // ── regions / anchors ───────────────────────────────────────────────────────
  for (const [a, rid] of Object.entries(p.anchors)) if (!regionIds.has(rid)) diag.error(`anchor ${a} → unknown region \`${rid}\``, { file: M, path: 'anchors' });
  for (const [k, rid] of [['workflowRegion', p.workflowRegion], ['questionsRegion', p.questionsRegion]] as const)
    if (rid !== undefined && !regionIds.has(rid)) diag.error(`unknown region \`${rid}\``, { file: M, path: k });
  for (const e of p.entries) {
    const where = map.entries.get(e.id) ?? {};
    const region = p.regions.find((r) => r.id === e.region);
    if (!region) diag.error(`entry ${e.id}: unknown region \`${e.region}\``, where);
    else if (region.native) diag.error(`entry ${e.id}: region \`${e.region}\` is native (ST owns it)`, where);
  }
  for (const r of p.regions) {
    if (r.native && p.workflowRegion === r.id) diag.error('workflowRegion cannot be a native region', { file: M, path: 'workflowRegion' });
    if (!r.native && !p.entries.some((e) => e.region === r.id) && r.id !== p.workflowRegion) diag.warn(`region \`${r.id}\` receives no entries`, { file: M, path: 'regions' });
  }

  // ── modules / groups ────────────────────────────────────────────────────────
  const exclusive = new Map<string, string[]>();
  for (const m of p.modules) {
    const where = map.modules.get(m.id) ?? {};
    if (m.group && !p.groups[m.group]) diag.warn(`module ${m.id}: group \`${m.group}\` is not declared in groups`, where);
    if (m.exclusive) {
      if (!p.groups[m.exclusive]) diag.warn(`module ${m.id}: exclusive group \`${m.exclusive}\` is not declared in groups`, where);
      exclusive.set(m.exclusive, [...(exclusive.get(m.exclusive) ?? []), m.id]);
      if (m.toggle === 'always') diag.error(`module ${m.id}: always-on modules cannot be exclusive`, where);
    }
    for (const s of m.structures) if (!structureIds.has(s)) diag.error(`module ${m.id}: unknown structure \`${s}\``, where);
    if (m.toggle === 'user' && !m.group) diag.warn(`module ${m.id}: user module without a group is shown under "Other"`, where);
  }
  const defaults = p.configurationDefaults.modules;
  for (const [g, ids] of exclusive) {
    const on = ids.filter((id) => defaults[id]);
    if (on.length > 1) diag.warn(`exclusive group \`${g}\`: several modules enabled by default (${on.join(', ')}); the first in moduleOrder wins`, { file: M, path: 'configurationDefaults.modules' });
    if (!on.length && !p.groups[g]?.allowNone) diag.warn(`exclusive group \`${g}\` has no default and does not allow none`, { file: M, path: 'groups' });
  }
  for (const id of p.moduleOrder) if (id !== '*' && !moduleIds.has(id)) diag.warn(`moduleOrder: unknown module \`${id}\``, { file: M, path: 'moduleOrder' });

  // ── params ──────────────────────────────────────────────────────────────────
  for (const x of p.params) {
    const where = { file: M, path: `params.${x.id}` };
    if (x.fallback && !paramIds.has(x.fallback)) diag.error(`fallback param \`${x.fallback}\` does not exist`, where);
    if (x.type === 'select' && !x.options?.length) diag.error('select params need options', where);
    if (x.group && !p.groups[x.group]) diag.warn(`group \`${x.group}\` is not declared`, where);
  }

  // ── structures ──────────────────────────────────────────────────────────────
  const byKind = new Map<string, string[]>();
  for (const s of Object.values(p.structures)) if (s.kind !== 'custom') byKind.set(s.kind, [...(byKind.get(s.kind) ?? []), s.id]);
  for (const [k, ids] of byKind) if (ids.length > 1) diag.error(`only one structure of kind ${k} is allowed (${ids.join(', ')})`, { file: M, path: 'structures' });
  const fields = new Map<string, string>();
  for (const s of Object.values(p.structures)) {
    if (fields.has(s.field)) diag.error(`structures ${fields.get(s.field)} and ${s.id} share field \`${s.field}\``, { file: M, path: 'structures' });
    fields.set(s.field, s.id);
  }

  // ── tool / field names (checked with every stage active) ──────────────────
  const TOOL_NAME = /^[A-Za-z0-9_-]{1,64}$/;
  const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
  const T = { file: M, path: 'tools' };
  if (!TOOL_NAME.test(p.tools.turn.name)) diag.error(`tools.turn.name \`${p.tools.turn.name}\` must match ${TOOL_NAME}`, T);
  if (!TOOL_NAME.test(p.tools.submit.name)) diag.error(`tools.submit.name \`${p.tools.submit.name}\` must match ${TOOL_NAME}`, T);
  const env = p.tools.envelope;
  for (const f of [env.thinking, env.result]) if (!FIELD_NAME.test(f.name)) diag.error(`envelope field \`${f.name}\` must match ${FIELD_NAME}`, T);
  if (env.thinking.name === env.result.name) diag.error('envelope thinking and result fields must differ', T);
  const synthetic = new Set(p.syntheticTurns.map((t) => t.tool.name));
  if (synthetic.has(p.tools.submit.name)) diag.error(`tools.submit.name \`${p.tools.submit.name}\` is also a synthetic turn tool`, T);
  const structureFields = new Set(Object.values(p.structures).map((s) => s.field));
  function checkNames(w: APreset['workflows'][number], where: Where) {
    const structs = Object.values(p.structures);
    const a = turnArtifacts(p.tools, w, w.stages, structs);
    const seenFields = new Map<string, string>();
    const seenTools = new Map<string, string>();
    const anchor = structuresAnchorIndex(w, w.stages);
    w.stages.forEach((s, i) => {
      const field = a.fieldOf(s);
      const tool = a.toolOf(s);
      const param = a.paramOf(s);
      const at = `workflow ${w.id}: stage ${s.id}`;
      if (!FIELD_NAME.test(field)) diag.error(`${at}: field name \`${field}\` must match ${FIELD_NAME}`, where);
      if (structureFields.has(field)) diag.error(`${at}: field \`${field}\` collides with a structure field`, where);
      if (seenFields.has(field)) diag.error(`${at}: field \`${field}\` is also used by stage ${seenFields.get(field)}`, where);
      seenFields.set(field, s.id);
      if (!TOOL_NAME.test(tool)) diag.error(`${at}: tool name \`${tool}\` must match ${TOOL_NAME}`, where);
      if (seenTools.has(tool)) diag.error(`${at}: tool \`${tool}\` is also used by stage ${seenTools.get(tool)}`, where);
      if (tool === p.tools.submit.name || synthetic.has(tool)) diag.error(`${at}: tool \`${tool}\` collides with the submit / synthetic turn tool`, where);
      seenTools.set(tool, s.id);
      if (!FIELD_NAME.test(param)) diag.error(`${at}: tool parameter \`${param}\` must match ${FIELD_NAME}`, where);
      if (i === anchor && structureFields.has(param)) diag.error(`${at}: tool parameter \`${param}\` collides with a structure field`, where);
    });
  }

  // ── workflows ───────────────────────────────────────────────────────────────
  const usedStyles = new Set(Object.values(p.styles));
  for (const w of p.workflows) {
    const where = map.workflows.get(w.id) ?? {};
    for (const s of w.stages) {
      if (!p.actors[s.actor]) diag.error(`workflow ${w.id}: stage ${s.id} has unknown actor \`${s.actor}\``, where);
      for (const st of usedStyles) if (!w.sections.stages[s.id]?.[st]) diag.warn(`workflow ${w.id}: stage ${s.id} has no ${st} section`, where);
    }
    if (w.kind === 'task' && w.stages.some((s) => s.questions)) diag.warn(`workflow ${w.id}: task workflows do not receive questions`, where);
    checkNames(w, where);
  }
  if (!p.workflows.some((w) => w.kind === 'task')) diag.warn('no task workflow: meta replies and script calls fall back to the main workflow', { file: M });

  // ── configurations ──────────────────────────────────────────────────────────
  const c = p.configurationDefaults.connection;
  const checkConnection = (conn: Partial<typeof c>, path: string) => {
    if (conn.transport !== undefined && !TRANSPORTS.includes(conn.transport)) diag.error(`unknown transport \`${conn.transport}\``, { file: M, path });
    if (conn.streamToolArguments !== undefined && !TOOL_ARG_STREAMING.includes(conn.streamToolArguments)) diag.error(`unknown streamToolArguments \`${conn.streamToolArguments}\` (expected ${TOOL_ARG_STREAMING.join(' / ')})`, { file: M, path });
    if (conn.workflow !== undefined) {
      const wf = p.workflows.find((w) => w.id === conn.workflow);
      if (!wf) diag.error(`unknown workflow \`${conn.workflow}\``, { file: M, path });
      else if (wf.kind !== 'story') diag.error(`workflow \`${conn.workflow}\` is a task workflow`, { file: M, path });
    }
    if (conn.syntheticTurn && !p.syntheticTurns.some((s) => s.id === conn.syntheticTurn)) diag.error(`unknown synthetic turn \`${conn.syntheticTurn}\``, { file: M, path });
  };
  checkConnection(c, 'configurationDefaults.connection');
  for (const rc of p.configurations) {
    const path = `configurations.${rc.id}`;
    const diff = structuredClone(rc.diff) as Record<string, unknown>;
    for (const removed of pruneDiff(diff, p.configurationDefaults as unknown as Record<string, unknown>)) diag.error(`unknown configuration key \`${removed}\``, { file: M, path });
    checkConnection(rc.diff.connection ?? {}, `${path}.connection`);
    const full = deepMerge(p.configurationDefaults, rc.diff);
    for (const [g, ids] of exclusive) if (ids.filter((id) => full.modules[id]).length > 1) diag.warn(`${rc.id}: exclusive group \`${g}\` has several modules enabled`, { file: M, path });
  }
  if (new Set(p.configurations.map((x) => x.id)).size !== p.configurations.length) diag.error('duplicate configuration ids', { file: M, path: 'configurations' });
  if (!p.configurations.some((x) => x.id === p.defaultConfiguration)) diag.error(`defaultConfiguration \`${p.defaultConfiguration}\` is not a configuration`, { file: M, path: 'defaultConfiguration' });
  for (const m of p.migrations) if (!/^(<=?|>=?|=)?\s*\d+(\.\d+){0,2}/.test(m.from)) diag.error(`migration range \`${m.from}\` is not a semver range`, { file: M, path: 'migrations' });

  // ── locales ─────────────────────────────────────────────────────────────────
  for (const [lang, table] of Object.entries(p.locales)) {
    const file = `locales/${lang}.yaml`;
    const known: Record<string, Set<string>> = {
      modules: moduleIds,
      params: paramIds,
      groups: new Set(Object.keys(p.groups)),
      workflows: workflowIds,
      configurations: new Set(p.configurations.map((x) => x.id)),
      structures: structureIds,
    };
    for (const [section, ids] of Object.entries(known)) {
      const t = table[section];
      if (t && typeof t === 'object') for (const k of Object.keys(t)) if (!ids.has(k)) diag.warn(`${section}.${k} does not exist`, { file });
    }
    for (const [wid, w] of Object.entries(table.workflows ?? {})) {
      const wf = p.workflows.find((x) => x.id === wid);
      for (const sid of Object.keys(w?.stages ?? {})) if (wf && !wf.stages.some((s) => s.id === sid)) diag.warn(`workflows.${wid}.stages.${sid} does not exist`, { file });
    }
  }
}
