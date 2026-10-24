/**
 * Built-in structure kinds (D4). The extension owns the semantics, data schema, parsing and UI of
 * each kind; presets only name them (tag / field) and supply format prompts.
 */
import { isInlineStructure, type StructureDecl, type StructureKind } from './types';
import { childText, findTags, removeBlocks, unescapeXml } from './tags';

export type JsonSchema = Record<string, unknown>;

export interface MemoryOp {
  scope: 'memory' | 'global_memory';
  operation: 'replace' | 'delete';
  key: string;
  content: string | null;
}
export interface Synopsis { time: string; location: string; event: string; summary: string }
export interface UserOption { label: string; content: string }

export interface StructureValues {
  reply: string;
  memory: MemoryOp[];
  recap: string | null;
  impersonate: string;
  synopsis: Synopsis;
  options: UserOption[];
  custom: string | Record<string, string>;
}

/** Sub-fields of each kind, in schema order. Presets may describe them (`StructureDecl.properties`) but not rename them. */
export const STRUCTURE_PROPERTIES: Record<StructureKind, readonly string[]> = {
  reply: [],
  impersonate: [],
  recap: [],
  memory: ['scope', 'operation', 'key', 'content'],
  synopsis: ['time', 'location', 'event', 'summary'],
  options: ['label', 'content'],
  custom: [],
  annotations: [],
};

/**
 * JSON Schema of a structure's field (used by structured output and tool parameters). The shape is
 * fixed by the kind; descriptions come from the preset and are passed through `expand`.
 */
export function structureFieldSchema(decl: StructureDecl, expand: (text: string) => string = (t) => t): JsonSchema {
  const d = (t?: string) => (t ? expand(t).trim() || undefined : undefined);
  const describe = (s: JsonSchema, text?: string): JsonSchema => {
    const description = d(text);
    return description ? { ...s, description } : s;
  };
  const sub = (key: string, s: JsonSchema = { type: 'string' }) => describe(s, decl.properties?.[key]);
  const withDesc = (s: JsonSchema) => describe(s, decl.description);
  switch (decl.kind) {
    case 'reply':
    case 'impersonate':
      return withDesc({ type: 'string' });
    case 'recap':
      return withDesc({ type: ['string', 'null'] });
    case 'memory':
      return withDesc({
        type: 'array',
        items: {
          type: 'object',
          properties: {
            scope: sub('scope', { type: 'string', enum: ['memory', 'global_memory'] }),
            operation: sub('operation', { type: 'string', enum: ['replace', 'delete'] }),
            key: sub('key'),
            content: sub('content', { type: ['string', 'null'] }),
          },
          required: ['scope', 'operation', 'key', 'content'],
          additionalProperties: false,
        },
      });
    case 'synopsis':
      return withDesc({
        type: 'object',
        properties: { time: sub('time'), location: sub('location'), event: sub('event'), summary: sub('summary') },
        required: ['time', 'location', 'event', 'summary'],
        additionalProperties: false,
      });
    case 'options':
      return withDesc({
        type: 'array',
        items: {
          type: 'object',
          properties: { label: sub('label'), content: sub('content') },
          required: ['label', 'content'],
          additionalProperties: false,
        },
        ...(decl.count ? { minItems: decl.count, maxItems: decl.count } : {}),
      });
    case 'annotations':
      return withDesc({ type: 'string' });
    case 'custom':
      return decl.shape === 'kv' ? withDesc({ type: 'object', additionalProperties: { type: 'string' } }) : withDesc({ type: 'string' });
  }
}

/** Optional structures do not go into `required` of the generated schema. */
export function isStructureOptional(kind: StructureKind): boolean {
  return kind === 'memory' || kind === 'recap';
}

const asString = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));

/** Coerce a field value (JSON mode) into the kind's data shape. Returns `undefined` when absent/invalid. */
export function normalizeStructure(kind: StructureKind, value: unknown, decl?: StructureDecl): unknown {
  if (value === undefined) return undefined;
  switch (kind) {
    case 'annotations':
      return undefined;
    case 'reply':
    case 'impersonate': {
      const s = asString(value).trim();
      return s ? s : undefined;
    }
    case 'recap': {
      if (value === null) return null;
      const s = asString(value).trim();
      return s ? s : null;
    }
    case 'memory': {
      const arr = Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : [];
      const ops: MemoryOp[] = [];
      for (const raw of arr) {
        if (!raw || typeof raw !== 'object') continue;
        const o = raw as Record<string, unknown>;
        const key = asString(o.key ?? o.title).trim();
        if (!key) continue;
        const operation = o.operation === 'delete' ? 'delete' : 'replace';
        const scope = o.scope === 'global_memory' || o.scope === 'global' ? 'global_memory' : 'memory';
        ops.push({ scope, operation, key, content: operation === 'delete' ? null : asString(o.content) });
      }
      return ops;
    }
    case 'synopsis': {
      if (!value || typeof value !== 'object') return undefined;
      const o = value as Record<string, unknown>;
      return { time: asString(o.time), location: asString(o.location), event: asString(o.event), summary: asString(o.summary) } satisfies Synopsis;
    }
    case 'options': {
      if (!Array.isArray(value)) return undefined;
      return value
        .map((x): Record<string, unknown> => (x && typeof x === 'object' ? (x as Record<string, unknown>) : { content: x }))
        .map((o) => ({ label: asString(o.label ?? o.title).trim(), content: asString(o.content ?? o.text).trim() }))
        .filter((o) => o.content || o.label) satisfies UserOption[];
    }
    case 'custom': {
      if (decl?.shape === 'kv') {
        if (typeof value === 'string') {
          // Gemini receives free-form maps as JSON-encoded strings (see gemini.ts)
          try { value = JSON.parse(value); } catch { return undefined; }
        }
        if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
        return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, asString(v)]));
      }
      const s = asString(value).trim();
      return s ? s : undefined;
    }
  }
}

export interface TagExtraction {
  /** Text with all recognised structure blocks removed. */
  text: string;
  values: Record<string, unknown>;
  /** Structures whose block is still open (streaming). */
  open: string[];
}

/** Parse one tag block of a kind into its data shape. */
function parseTagBlocks(decl: StructureDecl, blocks: ReturnType<typeof findTags>): unknown {
  const last = blocks[blocks.length - 1];
  if (!last) return undefined;
  switch (decl.kind) {
    case 'annotations':
      return undefined;
    case 'reply':
    case 'impersonate':
      return normalizeStructure(decl.kind, unescapeXml(last.inner));
    case 'recap':
      return normalizeStructure('recap', unescapeXml(last.inner));
    case 'memory':
      return normalizeStructure(
        'memory',
        blocks.filter((b) => !b.open).map((b) => ({
          scope: childText(b.inner, 'scope'),
          operation: childText(b.inner, 'operation'),
          key: childText(b.inner, 'key'),
          content: childText(b.inner, 'content') ?? null,
        })),
      );
    case 'synopsis':
      return {
        time: childText(last.inner, 'time') ?? '',
        location: childText(last.inner, 'location') ?? '',
        event: childText(last.inner, 'event') ?? '',
        summary: childText(last.inner, 'summary') ?? '',
      } satisfies Synopsis;
    case 'options':
      return findTags(last.inner, 'option')
        .map((o) => ({ label: (o.attrs.title ?? o.attrs.label ?? '').trim(), content: unescapeXml(o.inner).trim() }))
        .filter((o) => o.content || o.label);
    case 'custom': {
      if (decl.shape === 'kv') {
        const out: Record<string, string> = {};
        for (const m of last.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) out[m[1]!] = unescapeXml(m[2]!).trim();
        return out;
      }
      return normalizeStructure('custom', unescapeXml(last.inner), decl);
    }
  }
}

/** Extract structure tag blocks from model text (dialogue style). */
export function extractStructureTags(text: string, decls: StructureDecl[]): TagExtraction {
  const values: Record<string, unknown> = {};
  const open: string[] = [];
  const all: { start: number; end: number }[] = [];
  for (const decl of decls) {
    if (isInlineStructure(decl)) continue;
    const blocks = findTags(text, decl.tag);
    if (!blocks.length) continue;
    all.push(...blocks);
    if (blocks.some((b) => b.open)) open.push(decl.id);
    const v = parseTagBlocks(decl, blocks);
    if (v !== undefined) values[decl.id] = v;
  }
  return { text: removeBlocks(text, all), values, open };
}

/** Plain text of a reply (restricted HTML: `<p>`, `<p special>`, `<blockquote>`). */
export function replyToPlainText(html: string): string {
  return unescapeXml(
    html
      .replace(/<\/(p|blockquote)>\s*/gi, '\n\n')
      .replace(/<(p|blockquote)(\s[^>]*)?>/gi, '')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
