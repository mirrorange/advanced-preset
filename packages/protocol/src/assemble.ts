/**
 * Pure prompt assembly shared by the extension and `ap preview`:
 * condition variables, `ap::` macros, module activation, region rendering and workflow sections.
 * Everything that needs SillyTavern (history, substituteParams, Carrier positions) stays outside.
 */
import type { APreset, Configuration, Content, Module, Region, Role, Stage, StructureDecl, Style, Transport, Workflow } from './types';
import { test, type Resolver } from './expr';
import { expandMacros } from './macros';
import { renderContent, type TemplateRenderer } from './content';
import { cloneData } from './clone';
import { deepFreeze, renderTemplate, TemplateError } from './template';
import { activeStages, stageFieldName, stageToolName, workflowSummary } from './workflow';
import { computeBuildVars, formatVar, plainBuildVars, type BuildVars } from './build-vars';

export interface Message {
  role: Role;
  content: string;
}

/** Condition variables of one generation (§6.7). */
export interface Vars {
  transport: Transport;
  style: Style;
  workflow: string;
  gen: { origin: 'story' | 'task'; type: string; callerTools: boolean; callerSchema: boolean };
  meta: { present: boolean; pure: boolean; mixed: boolean; task: 'summary' | 'impersonate' | null; recent: boolean };
  modules: Record<string, boolean>;
  params: Record<string, string | number>;
  flags: Record<string, boolean>;
  features: { tokenSaving: boolean };
  /** `stages.<id>`: whether the current workflow runs that stage this turn. */
  stages: Record<string, boolean>;
  chat: { group: boolean };
  memory: { hasChat: boolean; hasGlobal: boolean };
  recap: { present: boolean };
}

export function resolverOf(vars: Vars): Resolver {
  return (path) => {
    let cur: unknown = vars;
    for (const seg of path.split('.')) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = (cur as Record<string, unknown>)[seg];
    }
    return cur;
  };
}

/** Runtime data available to macros. */
export interface MacroData {
  metaText?: string;
  memory?: { chat: unknown; global: unknown };
  recap?: string;
  recentMeta?: string;
  customLast?: Record<string, string>;
}

/** Whether an exclusive set may be left with no module selected (`groups[set].allowNone`). */
export function exclusiveAllowsNone(preset: APreset, set: string): boolean {
  return Boolean(preset.groups[set]?.allowNone);
}

/**
 * Module activation: always-on modules + enabled user modules, one winner per exclusive set
 * (first enabled in module order). A set that does not allow none falls back to its default
 * module (else its first module) when nothing in it is enabled. Then the module-level `when`.
 */
export function activeModules(preset: APreset, config: Configuration, resolve?: Resolver): Module[] {
  const winner = new Map<string, string>();
  for (const m of preset.modules) {
    if (m.exclusive && m.toggle === 'user' && config.modules[m.id] === true && !winner.has(m.exclusive)) winner.set(m.exclusive, m.id);
  }
  for (const m of preset.modules) {
    const set = m.exclusive;
    if (!set || winner.has(set) || exclusiveAllowsNone(preset, set)) continue;
    const members = preset.modules.filter((x) => x.exclusive === set && x.toggle === 'user');
    const pick = members.find((x) => x.default) ?? members[0];
    if (pick) winner.set(set, pick.id);
  }
  const out = preset.modules.filter((m) => {
    if (m.toggle === 'always') return true;
    return m.exclusive ? winner.get(m.exclusive) === m.id : config.modules[m.id] === true;
  });
  return resolve ? out.filter((m) => test(m.when, resolve)) : out;
}

/** `modules.<id>` variables: switch state after exclusivity (independent of module `when`). */
export function moduleSwitches(preset: APreset, config: Configuration): Record<string, boolean> {
  const on = new Set(activeModules(preset, config).map((m) => m.id));
  return Object.fromEntries(preset.modules.map((m) => [m.id, on.has(m.id)]));
}

/** Structures requested this turn (declared by active modules), in declaration order. */
export function activeStructures(preset: APreset, modules: Module[]): StructureDecl[] {
  const ids = new Set(modules.flatMap((m) => m.structures));
  return Object.values(preset.structures).filter((s) => ids.has(s.id));
}

export interface AssemblyInput {
  preset: APreset;
  config: Configuration;
  vars: Vars;
  data?: MacroData;
}

export interface Assembly {
  vars: Vars;
  resolve: Resolver;
  modules: Module[];
  structures: StructureDecl[];
  /** Build variables after the active modules' updates. */
  buildVars: BuildVars;
  workflow?: Workflow;
  stages: Stage[];
  /** Rendered messages per region id (non-native regions only). */
  regions: Record<string, Message[]>;
  expand: (text: string) => string;
  /** Problems found while assembling (template errors). */
  warnings: string[];
}

/** Display name of an actor (configuration override first). Native ST macros remain for substituteParams. */
export function actorName(preset: APreset, config: Configuration, actor: string): string {
  return config.identity.names[actor] || preset.actors[actor]?.name || actor;
}

export function createMacroExpander(input: AssemblyInput, stages: Stage[], workflow: Workflow | undefined, buildVars: BuildVars): (text: string) => string {
  const resolve = createMacroResolver(input, stages, workflow, buildVars);
  return (text) => expandMacros(text, resolve);
}

/** Resolves one `{{ap::…}}` macro (argument list) to its text; `undefined` for unknown macros. */
export function createMacroResolver(input: AssemblyInput, stages: Stage[], workflow: Workflow | undefined, buildVars: BuildVars): (args: string[]) => string | undefined {
  const { preset, config, vars, data = {} } = input;
  const paramText = (id: string, depth = 0): string => {
    const p = preset.params.find((x) => x.id === id);
    if (!p) return '';
    const v = config.params[id] ?? p.default;
    const unset = v === '' || v === 0 || v === undefined;
    if (unset) {
      if (p.fallback && depth < 4) {
        const fb = paramText(p.fallback, depth + 1);
        if (fb) return fb;
      }
      return p.unset ?? '';
    }
    const opt = p.options?.find((o) => String(o.value) === String(v));
    return opt?.text ?? String(v);
  };
  // Variable values may hold macros: expand them before formatting (bounded, values may refer to each other).
  let varDepth = 0;
  const expandValue = (s: string) => (varDepth > 4 ? s : expandMacros(s, resolve));
  const readVar = (id: string, selector?: string): string => {
    const v = buildVars[id];
    if (v === undefined) return '';
    varDepth++;
    try {
      const expanded = typeof v === 'string' ? expandValue(v) : Array.isArray(v) ? v.map(expandValue) : new Map([...v].map(([k, x]) => [k, expandValue(x)]));
      return formatVar(expanded, selector);
    } finally {
      varDepth--;
    }
  };
  const style = vars.style;
  const resolve = (args: string[]): string | undefined => {
    const [head, a, b] = args;
    switch (head) {
      case 'name': return actorName(preset, config, a!);
      case 'prefix': return config.identity.prefixes[a!] || preset.actors[a!]?.prefix || `${actorName(preset, config, a!)}: `;
      case 'param': return paramText(a!);
      case 'lang': return preset.params.some((p) => p.id === 'language') ? paramText('language') || 'the language used in the story so far' : 'the language used in the story so far';
      case 'structure': {
        const s = preset.structures[a!];
        if (!s) return '';
        if (b === 'last') return data.customLast?.[a!] ?? '';
        return style === 'dialogue' ? s.formatPrompt.tag : s.formatPrompt.field;
      }
      case 'workflow':
        if (a === 'hint') return workflow?.hint ?? '';
        return workflowSummary(stages, (actor) => actorName(preset, config, actor));
      case 'input': return data.metaText ?? '';
      case 'memory': return JSON.stringify((a === 'global' ? data.memory?.global : data.memory?.chat) ?? {}, null, 2);
      case 'recap': return data.recap ?? '';
      case 'recent_meta': return data.recentMeta ?? '';
      case 'var': return readVar(a!, b);
      default: return undefined;
    }
  };
  return resolve;
}

/**
 * The scope of `@template` templates (I-109): every condition variable (`transport`, `gen`, `params`,
 * `modules`, …), the build variables as plain values (`vars`: string / array / object), the
 * configuration's sampling settings and `macro(name, ...args)` (= `{{ap::name::args}}`). Frozen:
 * templates cannot change what later templates or the assembly see.
 */
export function templateScope(vars: Vars, buildVars: BuildVars, config: Configuration, macro: (args: string[]) => string | undefined, expand: (text: string) => string): Record<string, unknown> {
  return deepFreeze({
    ...cloneData(vars),
    vars: cloneData(plainBuildVars(buildVars)),
    sampling: cloneData(config.sampling ?? {}),
    macro: (...args: unknown[]) => {
      const v = macro(args.map((x) => String(x).trim()));
      return v === undefined ? '' : expand(v);
    },
  });
}

/** Template renderer of one assembly: errors become warnings and the template renders nothing. */
function templateRenderer(scope: () => Record<string, unknown>, warnings: string[], where: string): TemplateRenderer {
  return (piece) => {
    try {
      return renderTemplate(piece.text, scope());
    } catch (e) {
      const rel = e instanceof TemplateError ? e.line : undefined;
      const line = piece.template?.line !== undefined && rel !== undefined ? piece.template.line + rel - 1 : piece.template?.line;
      const loc = [piece.template?.file, line].filter((x) => x !== undefined).join(':');
      warnings.push(`template in ${where}${loc ? ` (${loc})` : ''}: ${e instanceof Error ? e.message : String(e)}`);
      return '';
    }
  };
}

function regionMessages(region: Region, blocks: { role?: Role; text: string }[]): Message[] {
  if (!blocks.length) return [];
  if (region.merge === 'none') return blocks.map((b) => ({ role: b.role ?? region.role, content: b.text }));
  // join / wrap: consecutive role-less blocks merge; `@as` blocks stay separate messages.
  const out: Message[] = [];
  let buffer: string[] = [];
  const flush = () => {
    if (!buffer.length) return;
    const joined = buffer.join(region.separator);
    out.push({ role: region.role, content: typeof region.merge === 'object' ? `<${region.merge.wrap}>\n${joined}\n</${region.merge.wrap}>` : joined });
    buffer = [];
  };
  for (const b of blocks) {
    if (b.role) { flush(); out.push({ role: b.role, content: b.text }); }
    else buffer.push(b.text);
  }
  flush();
  return out;
}

/** Workflow prompt content: preamble + intro + per-stage sections (+ imperative headings) + outro. */
export function workflowContent(preset: APreset, workflow: Workflow, stages: Stage[], style: Style, transport: Transport, config: Configuration): Content {
  const s = workflow.sections;
  const out: Content = [...(s.preamble ?? []), ...(s.intro[style] ?? [])];
  stages.forEach((stage, i) => {
    const body = s.stages[stage.id]?.[style];
    if (!body?.length) return;
    if (style === 'imperative' && preset.stageHeading) {
      const target = transport === 'tool-multi' ? stageToolName(stages, stage, preset.tools) : stageFieldName(stages, stage, preset.tools);
      const heading = preset.stageHeading
        .replaceAll('{{n}}', String(i + 1))
        .replaceAll('{{label}}', stage.label)
        .replaceAll('{{actor}}', actorName(preset, config, stage.actor))
        .replaceAll('{{target}}', target)
        .replaceAll('{{optional}}', stage.optional ? ' (optional)' : '');
      const [first, ...rest] = body;
      out.push({ ...first, pieces: [{ text: `${heading}\n\n` }, ...first!.pieces] }, ...rest);
    } else out.push(...body);
  });
  out.push(...(s.outro[style] ?? []));
  return out;
}

/** Render every non-native region (plus the workflow into `workflowRegion`). */
export function assemble(input: AssemblyInput, workflowOverride?: Workflow): Assembly {
  const { preset, config } = input;
  const vars = { ...input.vars };
  const workflow = workflowOverride ?? preset.workflows.find((w) => w.id === vars.workflow);
  const preResolve = resolverOf(vars);
  const stages = workflow ? activeStages(workflow, preResolve) : [];
  vars.stages = Object.fromEntries(stages.map((s) => [s.id, true]));
  const resolve = resolverOf(vars);
  const modules = activeModules(preset, config, resolve);
  const structures = activeStructures(preset, modules);
  const buildVars = computeBuildVars(preset.vars, modules);
  const macro = createMacroResolver({ ...input, vars }, stages, workflow, buildVars);
  const expand = (text: string) => expandMacros(text, macro);
  const activeIds = new Set(modules.map((m) => m.id));
  const warnings: string[] = [];
  let scope: Record<string, unknown> | undefined;
  const getScope = () => (scope ??= templateScope(vars, buildVars, config, macro, expand));

  const blocksByRegion = new Map<string, { role?: Role; text: string; workflow?: boolean }[]>();
  for (const e of preset.entries) {
    if (!activeIds.has(e.module) || !test(e.when, resolve)) continue;
    const list = blocksByRegion.get(e.region) ?? [];
    list.push(...renderContent(e.content, resolve, expand, templateRenderer(getScope, warnings, `entry ${e.id}`)));
    blocksByRegion.set(e.region, list);
  }
  if (workflow) {
    const list = blocksByRegion.get(preset.workflowRegion) ?? [];
    // One workflow is one prompt: role-less blocks merge into a single message; `@as` blocks stay separate.
    const content = workflowContent(preset, workflow, stages, vars.style, vars.transport, config);
    for (const b of renderContent(content, resolve, expand, templateRenderer(getScope, warnings, `workflow ${workflow.id}`))) {
      const last = list[list.length - 1];
      if (!b.role && last && !last.role && last.workflow) last.text += `\n\n${b.text}`;
      else list.push({ ...b, workflow: true });
    }
    blocksByRegion.set(preset.workflowRegion, list);
  }
  const regions: Record<string, Message[]> = {};
  for (const r of preset.regions) if (!r.native) regions[r.id] = regionMessages(r, blocksByRegion.get(r.id) ?? []);
  return { vars, resolve, modules, structures, buildVars, workflow, stages, regions, expand, warnings };
}

/** Default variables for previews and tests. */
export function defaultVars(preset: APreset, config: Configuration, over: Partial<Vars> = {}): Vars {
  const transport = over.transport ?? config.connection.transport;
  return {
    transport,
    style: preset.styles[transport],
    workflow: config.connection.workflow,
    gen: { origin: 'story', type: 'normal', callerTools: false, callerSchema: false },
    meta: { present: false, pure: false, mixed: false, task: null, recent: false },
    modules: moduleSwitches(preset, config),
    params: { ...config.params },
    flags: Object.fromEntries(preset.regex.map((r) => [r.id, false])),
    features: { tokenSaving: config.tokenSaving.enabled },
    stages: {},
    chat: { group: false },
    memory: { hasChat: false, hasGlobal: false },
    recap: { present: false },
    ...over,
  };
}
