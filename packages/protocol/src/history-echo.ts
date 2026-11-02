/**
 * Structure history (I-139): recent assistant messages carry a structure again. Each structure may
 * declare a template (field placeholders), where the text goes (before / after the message text or
 * at a sort key on the turn axis) and a condition. The extension decides per message which
 * structures it carries (so that cache optimization can keep that choice) and renders them here.
 */
import { CONTENT_STAGE_REF, DEFAULT_SYNOPSIS_HISTORY_TEMPLATE, isInlineStructure, type HistoryPosition, type Stage, type StructureDecl, type StructureHistory, type StructureKind, type Workflow } from './types';
import type { Expr } from './expr';
import { stageOrderKey, structureOrderOf } from './layout';
import { STRUCTURE_PROPERTIES, statusText, type StatusBar, type Synopsis, type UserOption } from './structures';

/** Default synopsis line (token-saving replacement and default history template). */
export const DEFAULT_SYNOPSIS_LINE = '[{{time}} · {{location}}] {{event}}: {{summary}}';
/** Default `history.template`: the synopsis line, else the whole value as text. */
export const defaultHistoryTemplate = (kind: StructureKind): string => (kind === 'synopsis' ? DEFAULT_SYNOPSIS_LINE : '{{value}}');

/**
 * One text a structure inserts into a history message. `raw` pieces (legacy synopsis templates
 * around `{{content}}`) are glued to the message text as written; others are separated by a blank line.
 */
export interface HistoryPiece {
  template: string;
  position?: HistoryPosition;
  raw?: boolean;
}

/** Normalized structure history of a declaration (both artifact shapes). */
export interface HistoryEcho {
  depth: number;
  when?: Expr;
  pieces: HistoryPiece[];
}

const LEGACY_CONTENT = '{{content}}';

/** Pieces of a legacy synopsis `historyTemplate`: the text before `{{content}}` and the text after it. */
export function legacyHistoryPieces(template: string): HistoryPiece[] {
  const at = template.indexOf(LEGACY_CONTENT);
  if (at < 0) return [{ template, position: 'after' }];
  const before = template.slice(0, at);
  const after = template.slice(at + LEGACY_CONTENT.length).replaceAll(LEGACY_CONTENT, '');
  return [
    ...(before ? [{ template: before, position: 'before' as const, raw: true }] : []),
    ...(after ? [{ template: after, position: 'after' as const, raw: true }] : []),
  ];
}

/**
 * Structure history of a declaration, or `undefined` when it has none. Annotations keep their own
 * numeric `history` (CriticMarkup, I-80); a numeric `history` on a synopsis is the legacy form.
 */
export function historyEchoOf(decl: StructureDecl): HistoryEcho | undefined {
  const h = decl.history;
  if (h === undefined || isInlineStructure(decl)) return undefined;
  if (typeof h === 'number') {
    if (decl.kind !== 'synopsis' || !(h > 0)) return undefined;
    return { depth: h, pieces: legacyHistoryPieces(decl.historyTemplate ?? DEFAULT_SYNOPSIS_HISTORY_TEMPLATE) };
  }
  if (!h || typeof h !== 'object' || !(h.depth > 0)) return undefined;
  const s = h as StructureHistory;
  return { depth: s.depth, ...(s.when ? { when: s.when } : {}), pieces: [{ template: s.template ?? defaultHistoryTemplate(decl.kind), ...(s.position !== undefined ? { position: s.position } : {}) }] };
}

/** Annotation re-injection depth (I-80): a numeric `history` on the annotations structure. */
export const annotationDepth = (decl: StructureDecl): number => (decl.kind === 'annotations' && typeof decl.history === 'number' ? decl.history : 0);

// ---- placement --------------------------------------------------------------------------------

const contentStageIndex = (stages: Stage[]): number => {
  for (let i = stages.length - 1; i >= 0; i--) if (stages[i]!.kind === 'content') return i;
  return -1;
};

/** Sort key of the message text: the workflow's terminal content stage (0 without one). */
export function historyContentKey(workflow: Pick<Workflow, 'stages'> | undefined): number {
  const stages = workflow?.stages ?? [];
  const i = contentStageIndex(stages);
  return i >= 0 ? stageOrderKey(workflow!, stages[i]!) : 0;
}

/**
 * Sort key of a piece relative to the message text (which sits at the terminal content stage's key
 * with rank 0). `before` / `after` hug the text; a number is an absolute key (after a stage with the
 * same key); unset follows the structure's own position in the workflow (I-134).
 */
export function historyPlacement(workflow: Pick<Workflow, 'stages' | 'structureOrder' | 'structuresAfter'> | undefined, decl: StructureDecl, position: HistoryPosition | undefined): { key: number; rank: number } {
  const stages: Stage[] = workflow?.stages ?? [];
  const keyOf = (s: Stage) => stageOrderKey(workflow!, s);
  const content = contentStageIndex(stages);
  const contentKey = historyContentKey(workflow);
  if (position === 'before') return { key: contentKey, rank: -1 };
  if (position === 'after') return { key: contentKey, rank: 1 };
  if (typeof position === 'number') return { key: position, rank: 1 };
  if (!workflow) {
    const o = decl.order;
    return { key: contentKey, rank: o && typeof o === 'object' && 'before' in o ? -1 : 1 };
  }
  const stageKey = (ref: string): number | undefined => {
    if (ref === CONTENT_STAGE_REF) return content >= 0 ? contentKey : undefined;
    const s = stages.find((x) => x.id === ref);
    return s ? keyOf(s) : undefined;
  };
  const anchor = (workflow.structuresAfter ? stageKey(workflow.structuresAfter) : undefined) ?? contentKey;
  const o = structureOrderOf(workflow, decl);
  if (typeof o === 'number') return { key: o, rank: 1 };
  if ('before' in o) {
    const k = stageKey(o.before);
    return k === undefined ? { key: anchor, rank: 1 } : { key: k, rank: -1 };
  }
  return { key: stageKey(o.after) ?? anchor, rank: 1 };
}

// ---- rendering --------------------------------------------------------------------------------

const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));

/** Whether a stored structure value has anything to carry. */
export function hasStructureValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).some((v) => str(v).trim() !== '');
  return true;
}

/** The whole value as text (`{{value}}`). */
export function structureValueText(kind: StructureKind, value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  switch (kind) {
    case 'synopsis': return fillHistoryTemplate(DEFAULT_SYNOPSIS_LINE, kind, value, false);
    case 'status': return statusText(value as StatusBar);
    case 'options': return Array.isArray(value) ? (value as UserOption[]).map((o) => `- ${o?.label ? `${o.label}: ` : ''}${o?.content ?? ''}`).join('\n') : str(value);
    default:
      if (!Array.isArray(value) && typeof value === 'object') return Object.entries(value as Record<string, unknown>).map(([k, v]) => `${k}: ${str(v)}`).join('\n');
      return JSON.stringify(value, null, 2);
  }
}

/**
 * Fills `{{value}}` and the kind's sub-fields (any key of a kv custom structure). Unknown
 * placeholders (e.g. ST macros) stay as written.
 */
export function fillHistoryTemplate(template: string, kind: StructureKind, value: unknown, withValue = true): string {
  const obj = value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
  const fields = new Set<string>(STRUCTURE_PROPERTIES[kind] ?? []);
  return template.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (all, k: string) => {
    if (k === 'value' && withValue) return structureValueText(kind, value);
    if (obj && (fields.has(k) || (kind === 'custom' && k in obj))) return str(obj[k]);
    if (fields.has(k)) return '';
    return all;
  });
}

/** Fills a synopsis template (`{{time}}` `{{location}}` `{{event}}` `{{summary}}`). */
export const formatSynopsisLine = (template: string, s: Partial<Synopsis>): string => fillHistoryTemplate(template, 'synopsis', s, false);

/** A rendered piece placed around the message text. */
export interface PlacedPiece { text: string; key: number; rank: number; order: number; raw?: boolean }

/**
 * Message text with the pieces inserted: sorted by key, rank (before < text < after) and `order`;
 * empty pieces are skipped.
 */
export function insertPieces(content: string, contentKey: number, pieces: PlacedPiece[]): string {
  const cmp = (a: { key: number; rank: number; order: number }, b: { key: number; rank: number; order: number }) => a.key - b.key || a.rank - b.rank || a.order - b.order;
  const text = { key: contentKey, rank: 0, order: 0 };
  const list = pieces.filter((p) => p.text !== '').sort(cmp);
  const before = list.filter((p) => cmp(p, text) < 0);
  const after = list.filter((p) => cmp(p, text) > 0);
  let out = content;
  for (let i = before.length - 1; i >= 0; i--) { const p = before[i]!; out = p.raw ? p.text + out : `${p.text}\n\n${out}`; }
  for (const p of after) out = p.raw ? out + p.text : `${out}\n\n${p.text}`;
  return out;
}
