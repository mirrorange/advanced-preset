/**
 * Workflow → transport artifacts: stage field names, JSON Schema (structured / single tool),
 * per-stage tools (multi-step) and the `{{ap::workflow::summary}}` text.
 */
import type { Stage, StructureDecl, Workflow } from './types';
import { test, type Resolver } from './expr';
import { isStructureOptional, structureFieldSchema, type JsonSchema } from './structures';

export interface Patch {
  old_string: string;
  new_string: string;
}

export const PATCH_SCHEMA: JsonSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: { old_string: { type: 'string' }, new_string: { type: 'string' } },
    required: ['old_string', 'new_string'],
    additionalProperties: false,
  },
};

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

/** `step<N>_<actor>_<stage>` — numbered so that models emit fields in order. */
export function stageFieldName(stages: Stage[], stage: Stage): string {
  return `step${stages.indexOf(stage) + 1}_${stage.actor}_${stage.id}`;
}

export function stageToolName(prefix: string, stage: Stage): string {
  return `${prefix}${stage.id}`;
}

export function stageSchema(stage: Stage, description?: string): JsonSchema {
  const base = stage.kind === 'patch' ? { ...PATCH_SCHEMA } : { type: 'string' };
  return description ? { ...base, description } : base;
}

export interface TurnSchemaOptions {
  stageDescriptions?: Record<string, string>;
}

/** Ordered JSON-schema properties for the whole turn: stages with structures inserted after the anchor stage. */
export function buildTurnSchema(workflow: Workflow, stages: Stage[], structures: StructureDecl[], opts: TurnSchemaOptions = {}): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];
  const anchor = structuresAnchorIndex(workflow, stages);
  const addStructures = () => {
    for (const s of structures) {
      properties[s.field] = structureFieldSchema(s);
      if (!isStructureOptional(s.kind)) required.push(s.field);
    }
  };
  stages.forEach((stage, i) => {
    const name = stageFieldName(stages, stage);
    properties[name] = stageSchema(stage, opts.stageDescriptions?.[stage.id]);
    if (!stage.optional) required.push(name);
    if (i === anchor) addStructures();
  });
  if (anchor < 0) addStructures();
  return { type: 'object', properties, required, additionalProperties: false };
}

export interface ToolDef {
  type: 'function';
  function: { name: string; description: string; parameters: JsonSchema };
}

export function tool(name: string, description: string, parameters: JsonSchema): ToolDef {
  return { type: 'function', function: { name, description, parameters } };
}

/** Multi-step tools: one tool per stage. Structures are extra parameters of the anchor stage tool. */
export function buildStageTools(workflow: Workflow, stages: Stage[], structures: StructureDecl[], prefix: string, descriptions: Record<string, string>): ToolDef[] {
  const anchor = structuresAnchorIndex(workflow, stages);
  return stages.map((stage, i) => {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];
    if (stage.kind === 'patch') {
      properties.edits = PATCH_SCHEMA;
      required.push('edits');
    } else {
      properties.content = { type: 'string' };
      required.push('content');
    }
    if (i === anchor) {
      for (const s of structures) {
        properties[s.field] = structureFieldSchema(s);
        if (!isStructureOptional(s.kind)) required.push(s.field);
      }
    }
    return tool(stageToolName(prefix, stage), descriptions[stage.id] ?? stage.label, { type: 'object', properties, required, additionalProperties: false });
  });
}

/** `Start -> Asking Questions (Freesia) -> … -> (End)` */
export function workflowSummary(stages: Stage[], actorName: (actor: string) => string, label: (stage: Stage) => string = (s) => s.label): string {
  const parts = stages.map((s) => `${label(s)} (${actorName(s.actor)})${s.optional ? ' [optional]' : ''}`);
  return ['Start', ...parts, '(End)'].join(' -> ');
}
