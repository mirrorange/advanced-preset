/**
 * Workflow → transport artifacts: stage field names, JSON Schema (structured / single tool),
 * per-stage tools (multi-step) and the `{{ap::workflow::summary}}` text.
 *
 * The shapes (which fields / tools exist and what they hold) are defined here; every name and
 * description comes from the preset (`tools`, `Stage.field`, `Stage.tool`, structure texts).
 */
import { isInlineStructure, type FieldText, type Stage, type StructureDecl, type ToolsDecl, type Workflow } from './types';
import { test, type Resolver } from './expr';
import { isStructureOptional, structureFieldSchema, type JsonSchema } from './structures';
import { turnLayout, withFieldName, type TurnLayout } from './layout';

export interface Patch {
  old_string: string;
  new_string: string;
}

/**
 * Defaults used by the CLI when a preset omits `tools`, and for upgrading format-1 artifacts
 * (whose tool names were fixed by the extension).
 */
export const DEFAULT_TOOLS: ToolsDecl = {
  turn: { name: 'ap_turn', field: 'step{{n}}_{{actor}}_{{stage}}', fieldDescription: '{{label}}' },
  submit: { name: 'ap_submit_turn', description: 'Submit the complete workflow for this turn: every stage in order, then the final content and structures.' },
  stage: { name: 'ap_stage_{{stage}}', description: '{{label}}', param: { name: 'content' }, patchParam: { name: 'edits' } },
  patch: {},
  envelope: { thinking: { name: 'thinking' }, result: { name: 'result' } },
  structurePrefix: 'z_',
  results: {
    next: 'Recorded. Continue with `{{next}}`.',
    done: 'Recorded. The workflow is complete.',
    unknown: 'Unknown tool {{name}}.',
    nudge: 'Continue the workflow: call `{{next}}` now.',
  },
  jsonStringHint: '(JSON object encoded as a string)',
  callerSchemaHint: 'After your thinking, output the result as one JSON code block (```json … ```) that matches this JSON Schema:\n\n```json\n{{schema}}\n```',
};

export type Expand = (text: string) => string;
const same: Expand = (s) => s;

/** Replace `{{key}}` placeholders (only the given keys; other macros are left for `expand`). */
export function fillTemplate(text: string, vars: Record<string, string | number>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{{${k}}}`, String(v));
  return out;
}

export function activeStages(workflow: Workflow, resolve: Resolver): Stage[] {
  return workflow.stages.filter((s) => test(s.when, resolve));
}

/** Index of the terminal content stage (the last `content` stage). */
export function terminalContentIndex(stages: Stage[]): number {
  for (let i = stages.length - 1; i >= 0; i--) if (stages[i]!.kind === 'content') return i;
  return -1;
}

/** Stage after which structures are placed (defaults to the terminal content stage). */
export function structuresAnchorIndex(workflow: Workflow, stages: Stage[]): number {
  if (workflow.structuresAfter) {
    const i = stages.findIndex((s) => s.id === workflow.structuresAfter);
    if (i >= 0) return i;
  }
  const t = terminalContentIndex(stages);
  return t >= 0 ? t : stages.length - 1;
}

/** Template variables of a stage: `{{n}}` is numbered among the active stages so that models emit fields in order. */
export function stageVars(stages: Stage[], stage: Stage): Record<string, string | number> {
  return { n: stages.indexOf(stage) + 1, stage: stage.id, actor: stage.actor, label: stage.label };
}

/** Structured-output field of a stage (default template `step<N>_<actor>_<stage>`). */
export function stageFieldName(stages: Stage[], stage: Stage, tools: Pick<ToolsDecl, 'turn'> = DEFAULT_TOOLS): string {
  return fillTemplate(stage.field?.name ?? tools.turn.field, stageVars(stages, stage));
}

/** Multi-step tool name of a stage. */
export function stageToolName(stages: Stage[], stage: Stage, tools: Pick<ToolsDecl, 'stage'> = DEFAULT_TOOLS): string {
  return fillTemplate(stage.tool?.name ?? tools.stage.name, stageVars(stages, stage));
}

/** Multi-step tool parameter holding the stage value (`content` text or patch `edits` by default). */
export function stageParam(stage: Stage, tools: Pick<ToolsDecl, 'stage'> = DEFAULT_TOOLS): FieldText {
  const base = stage.kind === 'patch' ? tools.stage.patchParam : tools.stage.param;
  const o = stage.tool?.param;
  const description = o?.description ?? base.description;
  return { name: o?.name ?? base.name, ...(description ? { description } : {}) };
}

const withDescription = (schema: JsonSchema, description: string | undefined): JsonSchema => (description ? { ...schema, description } : schema);

export function patchSchema(tools: Pick<ToolsDecl, 'patch'> = DEFAULT_TOOLS, expand: Expand = same, description?: string): JsonSchema {
  const p = tools.patch;
  const d = (t?: string) => (t ? expand(t) : undefined);
  return withDescription({
    type: 'array',
    items: {
      type: 'object',
      properties: { old_string: withDescription({ type: 'string' }, d(p.old)), new_string: withDescription({ type: 'string' }, d(p.new)) },
      required: ['old_string', 'new_string'],
      additionalProperties: false,
    },
  }, description ?? d(p.description));
}

export function stageSchema(stage: Stage, description?: string, tools: Pick<ToolsDecl, 'patch'> = DEFAULT_TOOLS, expand: Expand = same): JsonSchema {
  return stage.kind === 'patch' ? patchSchema(tools, expand, description) : withDescription({ type: 'string' }, description);
}

export interface ToolDef {
  type: 'function';
  function: { name: string; description?: string; parameters: JsonSchema };
}

export function tool(name: string, description: string | undefined, parameters: JsonSchema): ToolDef {
  return { type: 'function', function: { name, ...(description ? { description } : {}), parameters } };
}

/**
 * Everything a transport needs for one turn, with names and descriptions resolved from the preset.
 * `expand` runs macro expansion over descriptions (not over names).
 */
export interface TurnArtifacts {
  /** Stages and structures of this turn in order, with their field names (I-134). */
  layout: TurnLayout;
  fieldOf(stage: Stage): string;
  /** Field (structured / single tool) or stage-tool parameter (multi-step) of a structure. */
  structureFieldOf(decl: StructureDecl): string;
  toolOf(stage: Stage): string;
  paramOf(stage: Stage): string;
  stageOfTool(name: string): Stage | undefined;
  /** Structured output: `json_schema` name / description / value. */
  schema(): { name: string; description?: string; value: JsonSchema };
  /** Ordered turn object schema: stages, with structures inserted after the anchor stage. */
  turnSchema(): JsonSchema;
  /** Single-step tool (parameters default to the turn schema). */
  submitTool(parameters?: JsonSchema): ToolDef;
  /** Multi-step tools: one per stage; structures are extra parameters of the anchor stage tool. */
  stageTools(): ToolDef[];
  /** Caller-schema envelope `{ <thinking>, <result> }` (task turns, D18). */
  envelope(caller: JsonSchema): JsonSchema;
  envelopeKeys: { thinking: string; result: string };
  /** Every tool name this turn may expose (submit + stage tools). */
  toolNames(): string[];
}

export function turnArtifacts(tools: ToolsDecl, workflow: Workflow, stages: Stage[], allStructures: StructureDecl[], expand: Expand = same): TurnArtifacts {
  // Inline structures (annotations) live in the content itself: no field, no tool parameter.
  const structures = allStructures.filter((s) => !isInlineStructure(s));
  const desc = (template: string | undefined, stage?: Stage) => {
    if (!template) return undefined;
    const t = expand(stage ? fillTemplate(template, stageVars(stages, stage)) : template).trim();
    return t || undefined;
  };
  const layout = turnLayout(workflow, stages, structures, tools, (s) => stageFieldName(stages, s, tools));
  const fieldOf = (s: Stage) => layout.stageField(s);
  const structureFieldOf = (d: StructureDecl) => layout.structureField(d);
  const toolOf = (s: Stage) => stageToolName(stages, s, tools);
  const paramOf = (s: Stage) => layout.stageParam(s, stageParam(s, tools).name);
  const addStructure = (properties: Record<string, JsonSchema>, required: string[], d: StructureDecl) => {
    const name = structureFieldOf(d);
    properties[name] = structureFieldSchema(withFieldName(d, name), expand);
    if (!isStructureOptional(d.kind)) required.push(name);
  };
  const turnSchema = (): JsonSchema => {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];
    for (const it of layout.items) {
      if (it.type === 'structure') { addStructure(properties, required, it.structure); continue; }
      const stage = it.stage;
      properties[it.name] = stageSchema(stage, desc(stage.field?.description ?? tools.turn.fieldDescription, stage), tools, expand);
      if (!stage.optional) required.push(it.name);
    }
    return { type: 'object', properties, required, additionalProperties: false };
  };
  const stageTools = (): ToolDef[] => stages.map((stage) => {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];
    const param = stageParam(stage, tools);
    const carried = layout.carriedBy(stage);
    const own = layout.items.find((it) => it.type === 'stage' && it.stage === stage)!;
    const addOwn = () => {
      const name = paramOf(stage);
      properties[name] = stageSchema(stage, desc(param.description, stage), tools, expand);
      required.push(name);
    };
    // The stage's own parameter and the structures it carries, in turn order.
    let ownAdded = false;
    for (const d of carried) {
      const at = layout.items.findIndex((it) => it.type === 'structure' && it.structure === d);
      if (!ownAdded && at > own.position - 1) { addOwn(); ownAdded = true; }
      addStructure(properties, required, d);
    }
    if (!ownAdded) addOwn();
    return tool(toolOf(stage), desc(stage.tool?.description ?? tools.stage.description, stage), { type: 'object', properties, required, additionalProperties: false });
  });
  const keys = { thinking: tools.envelope.thinking.name, result: tools.envelope.result.name };
  return {
    layout,
    fieldOf,
    structureFieldOf,
    toolOf,
    paramOf,
    stageOfTool: (name) => stages.find((s) => toolOf(s) === name),
    schema: () => {
      const description = desc(tools.turn.description);
      return { name: tools.turn.name, ...(description ? { description } : {}), value: turnSchema() };
    },
    turnSchema,
    submitTool: (parameters) => tool(tools.submit.name, desc(tools.submit.description), parameters ?? turnSchema()),
    stageTools,
    envelope: (caller) => ({
      type: 'object',
      properties: {
        [keys.thinking]: withDescription({ type: 'string' }, desc(tools.envelope.thinking.description)),
        [keys.result]: withDescription(caller, desc(tools.envelope.result.description) ?? (caller.description as string | undefined)),
      },
      required: [keys.thinking, keys.result],
      additionalProperties: false,
    }),
    envelopeKeys: keys,
    toolNames: () => [tools.submit.name, ...stages.map(toolOf)],
  };
}

/** Back-compat helper: ordered turn schema with default names. */
export function buildTurnSchema(workflow: Workflow, stages: Stage[], structures: StructureDecl[], tools: ToolsDecl = DEFAULT_TOOLS, expand?: Expand): JsonSchema {
  return turnArtifacts(tools, workflow, stages, structures, expand).turnSchema();
}

/** `Start -> Asking Questions (Freesia) -> … -> (End)` */
export function workflowSummary(stages: Stage[], actorName: (actor: string) => string, label: (stage: Stage) => string = (s) => s.label): string {
  const parts = stages.map((s) => `${label(s)} (${actorName(s.actor)})${s.optional ? ' [optional]' : ''}`);
  return ['Start', ...parts, '(End)'].join(' -> ');
}
