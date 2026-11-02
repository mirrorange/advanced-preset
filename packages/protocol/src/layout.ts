/**
 * Turn layout (I-134 / I-135): stages and structures of one turn sorted together.
 *
 * Stages keep their declaration order; each has a sort key (`Stage.order`, default 100 × position).
 * Structures are placed by `StructureOrder` (an absolute key or before / after a stage), falling back
 * to the legacy anchor (`structures.after`, else the terminal content stage). The layout gives every
 * object-style field its model-visible name, and tells the multi-step transport which stage tool
 * carries each structure.
 */
import { CONTENT_STAGE_REF, isInlineStructure, type Stage, type StructureDecl, type StructureOrder, type ToolsDecl, type Workflow } from './types';

/** First Advanced Preset version that understands stage / structure order, `orderPrefix`, `status` and structure UI. */
export const STRUCTURE_LAYOUT_SINCE = '1.10.0';
/** Default ordering prefix (`tools.orderPrefix: true`). */
export const DEFAULT_ORDER_PREFIX = '{{n}}_';
/** Distance between the default sort keys of consecutive stages. */
export const STAGE_ORDER_STEP = 100;

export type LayoutItem =
  | { type: 'stage'; stage: Stage; key: number; position: number; name: string }
  | { type: 'structure'; structure: StructureDecl; key: number; position: number; name: string };

export interface TurnLayout {
  /** Stages and (non-inline) structures in turn order. */
  items: LayoutItem[];
  /** Whether names carry the ordering prefix. */
  prefixed: boolean;
  stageField(stage: Stage): string;
  structureField(decl: StructureDecl): string;
  /** Multi-step: the stage whose tool carries the structure (the preceding stage, else the following one). */
  hostOf(decl: StructureDecl): Stage | undefined;
  /** Multi-step: structures carried by a stage tool, in turn order. */
  carriedBy(stage: Stage): StructureDecl[];
  /** Multi-step: the stage tool's own parameter name (prefixed when the tool also carries structures). */
  stageParam(stage: Stage, base: string): string;
}

const fill = (text: string, vars: Record<string, string | number>) => {
  let out = text;
  for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{{${k}}}`, String(v));
  return out;
};

/** Sort key of a stage: `order`, else 100 × its position among the workflow's declared stages. */
export function stageOrderKey(workflow: Pick<Workflow, 'stages'>, stage: Stage): number {
  if (typeof stage.order === 'number') return stage.order;
  const i = workflow.stages.findIndex((s) => s.id === stage.id);
  return (i >= 0 ? i + 1 : workflow.stages.length + 1) * STAGE_ORDER_STEP;
}

/** Effective position of a structure in a workflow: workflow override → structure → legacy anchor. */
export function structureOrderOf(workflow: Pick<Workflow, 'structureOrder' | 'structuresAfter'>, decl: StructureDecl): StructureOrder {
  return workflow.structureOrder?.[decl.id] ?? decl.order ?? { after: workflow.structuresAfter ?? CONTENT_STAGE_REF };
}

/** Index of the stage after which unpositioned structures go (legacy `structures.after` / terminal content / last stage). */
function anchorIndex(workflow: Pick<Workflow, 'structuresAfter'>, stages: Stage[]): number {
  if (workflow.structuresAfter) {
    const i = stages.findIndex((s) => s.id === workflow.structuresAfter);
    if (i >= 0) return i;
  }
  for (let i = stages.length - 1; i >= 0; i--) if (stages[i]!.kind === 'content') return i;
  return stages.length - 1;
}

/** Name of an ordering-prefixed field: `{{n}}` is the position, zero-padded to the widest position. */
export function orderPrefixed(prefix: string, position: number, total: number, base: string): string {
  const digits = String(Math.max(total, 1)).length;
  return fill(prefix, { n: String(position).padStart(digits, '0') }) + base;
}

/**
 * Lay out one turn. `stageBase` gives a stage's field name before any ordering prefix (the
 * `tools.turn.field` / `stage.field.name` template); legacy presets keep it as the final name.
 */
export function turnLayout(
  workflow: Pick<Workflow, 'stages' | 'structureOrder' | 'structuresAfter'>,
  stages: Stage[],
  allStructures: StructureDecl[],
  tools: Pick<ToolsDecl, 'orderPrefix'>,
  stageBase: (stage: Stage) => string,
): TurnLayout {
  const structures = allStructures.filter((s) => !isInlineStructure(s));
  // rank: 0 = stage, -1 = before a stage, 1 = after a stage / absolute key; ties keep declaration order.
  type Draft = { type: 'stage'; stage: Stage; key: number } | { type: 'structure'; structure: StructureDecl; key: number };
  type Sortable = { item: Draft; rank: number; index: number };
  const list: Sortable[] = stages.map((stage, index) => ({ item: { type: 'stage', stage, key: stageOrderKey(workflow, stage) }, rank: 0, index }));
  const anchor = anchorIndex(workflow, stages);
  const anchorKey = anchor >= 0 ? list[anchor]!.item.key : Number.POSITIVE_INFINITY;
  const stageKey = (ref: string): number | undefined => {
    if (ref === CONTENT_STAGE_REF) {
      for (let i = stages.length - 1; i >= 0; i--) if (stages[i]!.kind === 'content') return list[i]!.item.key;
      return undefined;
    }
    const i = stages.findIndex((s) => s.id === ref);
    return i >= 0 ? list[i]!.item.key : undefined;
  };
  structures.forEach((structure, index) => {
    const o = structureOrderOf(workflow, structure);
    let key: number;
    let rank = 1;
    if (typeof o === 'number') key = o;
    else if ('before' in o) {
      const k = stageKey(o.before);
      if (k === undefined) key = anchorKey;
      else { key = k; rank = -1; }
    } else key = stageKey(o.after) ?? anchorKey;
    list.push({ item: { type: 'structure', structure, key }, rank, index });
  });
  list.sort((a, b) => a.item.key - b.item.key || a.rank - b.rank || a.index - b.index);

  const prefix = tools.orderPrefix || '';
  const total = list.length;
  const items: LayoutItem[] = list.map(({ item }, i) => {
    const base = item.type === 'stage' ? stageBase(item.stage) : item.structure.field;
    const name = prefix ? orderPrefixed(prefix, i + 1, total, base) : base;
    return { ...item, position: i + 1, name } as LayoutItem;
  });

  const stageItem = new Map<Stage, LayoutItem>();
  const structureItem = new Map<StructureDecl, LayoutItem>();
  for (const it of items) {
    if (it.type === 'stage') stageItem.set(it.stage, it);
    else structureItem.set(it.structure, it);
  }
  const hosts = new Map<StructureDecl, Stage>();
  items.forEach((it, i) => {
    if (it.type !== 'structure') return;
    let host: Stage | undefined;
    for (let j = i - 1; j >= 0 && !host; j--) { const x = items[j]!; if (x.type === 'stage') host = x.stage; }
    for (let j = i + 1; j < items.length && !host; j++) { const x = items[j]!; if (x.type === 'stage') host = x.stage; }
    if (host) hosts.set(it.structure, host);
  });
  const carriedBy = (stage: Stage) => items.flatMap((it) => (it.type === 'structure' && hosts.get(it.structure) === stage ? [it.structure] : []));

  return {
    items,
    prefixed: Boolean(prefix),
    stageField: (stage) => stageItem.get(stage)?.name ?? stageBase(stage),
    structureField: (decl) => structureItem.get(decl)?.name ?? decl.field,
    hostOf: (decl) => hosts.get(decl),
    carriedBy,
    stageParam: (stage, base) => {
      const it = stageItem.get(stage);
      return prefix && it && carriedBy(stage).length ? orderPrefixed(prefix, it.position, total, base) : base;
    },
  };
}

/** Structure texts with `{{field}}` filled in (ordering-prefixed presets keep the placeholder in the artifact). */
export function withFieldName(decl: StructureDecl, name: string): StructureDecl {
  const r = (t: string) => t.replaceAll('{{field}}', name);
  if (![decl.description, decl.formatPrompt.field, ...Object.values(decl.properties ?? {})].some((t) => t?.includes('{{field}}'))) return decl;
  return {
    ...decl,
    ...(decl.description !== undefined ? { description: r(decl.description) } : {}),
    ...(decl.properties ? { properties: Object.fromEntries(Object.entries(decl.properties).map(([k, v]) => [k, r(v)])) } : {}),
    formatPrompt: { ...decl.formatPrompt, field: r(decl.formatPrompt.field) },
  };
}
