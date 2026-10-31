/** `ap preview`: show what a configuration produces — regions, stages and transport artifacts. */
import {
  TRANSPORTS, assemble, wrapInput, normalizeList, localizeUserModuleSource, presetUserModules, presetUserModuleTemplates, userModuleFromSource, defaultVars, plainBuildVars, resolveConfiguration, turnArtifacts, withUserModules, workflowSummary, actorName,
  type APreset, type ParamValue, type Transport, type UserModule, type UserModuleSource,
} from '@advanced-preset/protocol';

export interface PreviewOptions {
  transport?: string;
  workflow?: string;
  config?: string;
  meta?: 'pure' | 'mixed';
  modules?: Record<string, boolean>;
  /** Param values set on top of the configuration (`--param id=value`). */
  params?: Record<string, ParamValue>;
  /** The user's input (`--input`): with input shaping declared, the turn is shaped (`input.shaped`). */
  input?: string;
  /** User modules merged in (keyword rules see empty chat text). */
  userModules?: UserModule[];
  json?: boolean;
}

function pick(all: UserModuleSource[], ids: string[], noun: string): UserModuleSource[] | string {
  const unknown = ids.filter((id) => id !== 'all' && id !== 'none' && !all.some((t) => t.id === id));
  if (unknown.length) return `unknown ${noun} ${unknown.join(', ')} (have: ${all.map((t) => t.id).join(', ') || 'none'})`;
  if (ids.includes('none')) return [];
  return ids.includes('all') ? all : ids.map((id) => all.find((t) => t.id === id)!);
}

/**
 * User modules created from user module templates (`ids`, or `all`), as the panel would create them
 * for the UI language `lang`. Returns an error message for unknown ids.
 */
export function templateModules(preset: APreset, ids: string[], lang?: string): UserModule[] | string {
  const picked = pick(presetUserModuleTemplates(preset), ids, 'user module template');
  if (typeof picked === 'string') return picked;
  const labels = (id: string) => (lang ? preset.locales[lang.toLowerCase()]?.userModuleTemplates?.[id] : undefined);
  return picked.map((t) => userModuleFromSource(localizeUserModuleSource(t, lang, labels(t.id)), `tpl-${t.id}`));
}

/**
 * The preset's bundled user modules as a fresh install gets them for the UI language `lang`:
 * by default those that start enabled; `ids` (or `all`) enables exactly those, `none` none.
 * Returns an error message for unknown ids.
 */
export function bundledModules(preset: APreset, ids?: string[], lang?: string): UserModule[] | string {
  const all = presetUserModules(preset);
  const picked = ids ? pick(all, ids, 'bundled user module') : all.filter((m) => m.enabled !== false);
  if (typeof picked === 'string') return picked;
  const labels = (id: string) => (lang ? preset.locales[lang.toLowerCase()]?.userModules?.[id] : undefined);
  return picked.map((m) => userModuleFromSource(localizeUserModuleSource(m, lang, labels(m.id)), m.id));
}

/**
 * `--param id=value`: numbers for number params; for list params a JSON array
 * (`'words=["a","b"]'`) or comma-separated items (`words=a,b`), `words=` for an empty list.
 * Returns an error message for unknown params or malformed values.
 */
export function parseParamArg(preset: APreset, arg: string): { id: string; value: ParamValue } | string {
  const eq = arg.indexOf('=');
  if (eq <= 0) return `--param expects id=value, got \`${arg}\``;
  const id = arg.slice(0, eq).trim();
  const raw = arg.slice(eq + 1);
  const decl = preset.params.find((p) => p.id === id);
  if (!decl) return `unknown param \`${id}\` (have: ${preset.params.map((p) => p.id).join(', ') || 'none'})`;
  if (decl.type === 'number') {
    const n = Number(raw);
    return raw.trim() !== '' && Number.isFinite(n) ? { id, value: n } : `--param ${id}: expected a number, got \`${raw}\``;
  }
  if (decl.type !== 'list') return { id, value: raw };
  if (raw.trim().startsWith('[')) {
    try {
      const v: unknown = JSON.parse(raw);
      if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return { id, value: normalizeList(v) };
    } catch { /* reported below */ }
    return `--param ${id}: expected a JSON array of strings, got \`${raw}\``;
  }
  return { id, value: normalizeList(raw.split(',')) };
}

export function preview(source: APreset, o: PreviewOptions): string {
  const { preset, skipped } = o.userModules ? withUserModules(source, o.userModules) : { preset: source, skipped: [] };
  const config = resolveConfiguration(preset, o.config ?? preset.defaultConfiguration, {
    connection: { ...(o.transport ? { transport: o.transport as Transport } : {}), ...(o.workflow ? { workflow: o.workflow } : {}) },
    modules: o.modules,
    params: o.params,
  });
  if (!TRANSPORTS.includes(config.connection.transport)) throw new Error(`unknown transport ${config.connection.transport}`);
  const pure = o.meta === 'pure';
  const vars = defaultVars(preset, config, {
    meta: { present: Boolean(o.meta), pure, mixed: o.meta === 'mixed', task: null, recent: false },
    gen: { origin: pure ? 'task' : 'story', type: 'normal', callerTools: false, callerSchema: false },
    input: { shaped: Boolean(preset.inputShaping) && o.input !== undefined },
  });
  const workflow = pure ? preset.workflows.find((w) => w.kind === 'task') : undefined;
  if (workflow) vars.workflow = workflow.id;
  const a = assemble({ preset, config, vars, data: { metaText: o.meta ? '(meta text)' : '', inputText: o.input ?? '' } }, workflow);
  // What happens to the last user message of the chat history (ST macros stay unexpanded here).
  const shaping = preset.inputShaping;
  const historyInput = o.input === undefined ? undefined : !shaping ? o.input : shaping.mode === 'wrap' ? wrapInput(shaping.template, o.input, a.expand) : null;
  const transport = vars.transport;
  const wf = a.workflow;

  const artifacts: Record<string, unknown> = {};
  if (wf) {
    // Same builder as the extension; ST macros ({{user}}, …) stay unexpanded here.
    const t = turnArtifacts(preset.tools, wf, a.stages, a.structures, a.expand);
    const synthetic = preset.syntheticTurns.find((s) => s.id === config.connection.syntheticTurn);
    const init = synthetic && transport.startsWith('tool-') ? [{ type: 'function', function: { name: synthetic.tool.name, description: a.expand(synthetic.tool.description), parameters: { type: 'object', properties: {} } } }] : [];
    if (transport === 'structured') artifacts.schema = t.schema();
    if (transport === 'tool-single') artifacts.tools = [...init, t.submitTool()];
    if (transport === 'tool-multi') artifacts.tools = [...init, ...t.stageTools()];
  }
  if (o.json) return JSON.stringify({ ...(historyInput !== undefined ? { historyInput } : {}), vars: a.vars, buildVars: plainBuildVars(a.buildVars), ...(skipped.length ? { skipped } : {}), ...(a.warnings.length ? { warnings: a.warnings } : {}), modules: a.modules.map((m) => m.id), structures: a.structures.map((s) => s.id), stages: a.stages, regions: a.regions, ...artifacts }, null, 2);

  const lines: string[] = [];
  const rule = (title: string) => lines.push('', `━━ ${title} ${'━'.repeat(Math.max(4, 60 - title.length))}`);
  lines.push(`${preset.name} ${preset.version} · ${transport} (${vars.style}) · workflow ${wf?.id ?? '—'} · config ${o.config ?? preset.defaultConfiguration}`);
  lines.push(`modules: ${a.modules.map((m) => m.id).join(', ')}`);
  for (const x of skipped) lines.push(`skipped: user module ${x.module} entry ${x.entry} (unknown insertion point \`${x.point}\`)`);
  for (const w of a.warnings) lines.push(`warning: ${w}`);
  const size = (v: (typeof a.buildVars)[string]) => (typeof v === 'string' ? `${v.length} chars` : `${Array.isArray(v) ? v.length : v.size} items`);
  if (preset.vars.length) lines.push(`vars: ${Object.entries(a.buildVars).map(([k, v]) => `${k} (${size(v)})`).join(', ')}`);
  lines.push(`structures: ${a.structures.map((s) => s.id).join(', ') || '—'}`);
  if (shaping) lines.push(`input shaping: ${shaping.mode}${o.input === undefined ? ' (not shaped: no --input)' : ''}`);
  if (wf) lines.push(`stages: ${workflowSummary(a.stages, (x) => actorName(preset, config, x))}`);
  for (const r of preset.regions) {
    if (r.native) { rule(`${r.id} (native)`); continue; }
    const msgs = a.regions[r.id] ?? [];
    rule(`${r.id}${msgs.length ? '' : ' (empty)'}`);
    for (const m of msgs) lines.push(`[${m.role}]`, m.content, '');
    if (r.id === preset.anchors.historyStart && historyInput !== undefined) {
      rule('chat history (ST) · last user message');
      lines.push(historyInput === null ? '(extracted: placed by {{ap::input::text}})' : historyInput, '');
    }
  }
  for (const [k, v] of Object.entries(artifacts)) {
    rule(k);
    lines.push(JSON.stringify(v, null, 2));
  }
  return lines.join('\n');
}
