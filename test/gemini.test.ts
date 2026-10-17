import { describe, expect, it } from 'vitest';
import { normalizeStructure, toGeminiSchema, type Transport } from '@advanced-preset/protocol';
import { createDriver } from '@/core/transports';
import { ctxFor } from './helpers';

const ALLOWED = new Set([
  'type', 'format', 'title', 'description', 'nullable', 'enum', 'maxItems', 'minItems', 'properties', 'required',
  'minProperties', 'maxProperties', 'minLength', 'maxLength', 'pattern', 'example', 'anyOf', 'propertyOrdering', 'items',
  'minimum', 'maximum',
]);

/** Every node must be valid for Gemini's `Schema` proto. */
function assertGemini(s: any, path = '$'): void {
  expect(s && typeof s === 'object', path).toBe(true);
  for (const k of Object.keys(s)) expect(ALLOWED.has(k), `${path}.${k}`).toBe(true);
  if ('type' in s) expect(typeof s.type, `${path}.type`).toBe('string');
  if (s.type === 'object') {
    expect(Object.keys(s.properties ?? {}).length, `${path}.properties`).toBeGreaterThan(0);
    expect(s.propertyOrdering).toEqual(Object.keys(s.properties));
  }
  for (const [n, p] of Object.entries(s.properties ?? {})) assertGemini(p, `${path}.${n}`);
  if (s.items) assertGemini(s.items, `${path}[]`);
  for (const [i, m] of (s.anyOf ?? []).entries()) assertGemini(m, `${path}|${i}`);
}

const base = { chat_completion_source: 'makersuite', stream: true, messages: [{ role: 'user', content: 'Hi' }] };
const caller = { tools: [{ type: 'function', function: { name: 'st_tool', parameters: { type: 'object', properties: { q: { type: ['string', 'null'] } }, additionalProperties: false } } }] };

describe('gemini schemas', () => {
  it('converts unions, nullables and unsupported keywords', () => {
    const out = toGeminiSchema({
      type: 'object',
      properties: {
        recap: { type: ['string', 'null'], description: 'r' },
        mem: { type: 'array', items: { type: 'object', properties: { content: { type: ['string', 'null'] }, op: { const: 'x' } }, required: ['content', 'gone'], additionalProperties: false } },
        kv: { type: 'object', additionalProperties: { type: 'string' } },
        any: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        multi: { type: ['string', 'number'] },
      },
      additionalProperties: false,
      $schema: 'x',
    });
    assertGemini(out);
    expect(out.properties).toMatchObject({
      recap: { type: 'string', nullable: true, description: 'r' },
      mem: { items: { properties: { content: { type: 'string', nullable: true }, op: { type: 'string', enum: ['x'] } }, required: ['content'] } },
      kv: { type: 'string' },
      any: { type: 'integer', nullable: true },
      multi: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    });
  });

  it('kv custom structures accept a JSON-encoded string', () => {
    expect(normalizeStructure('custom', '{"a":1}', { kind: 'custom', shape: 'kv' } as never)).toEqual({ a: '1' });
  });

  for (const transport of ['structured', 'tool-single', 'tool-multi'] as Transport[]) {
    it(`${transport}: every schema sent to Gemini is valid`, () => {
      const ctx = ctxFor(transport);
      // every structure kind, including the nullable ones (memory.content / recap) that broke Gemini
      const extra = (kind: string, shape?: string) => ({ id: kind, kind, tag: kind, field: kind, ...(shape ? { shape } : {}), formatPrompt: { tag: '', field: '' } });
      ctx.structures = [extra('memory'), extra('recap'), extra('custom', 'kv'), ...ctx.structures] as never;
      const driver = createDriver({ ctx, base, messages: base.messages as never, caller: caller as never, family: 'gemini' });
      const body = driver.body(0) as any;
      const schemas = [
        ...(body.tools ?? []).map((t: any) => t.function.parameters).filter((p: any) => p && Object.keys(p.properties ?? {}).length),
        ...(body.json_schema ? [body.json_schema.value] : []),
      ];
      expect(schemas.length).toBeGreaterThan(0);
      for (const s of schemas) assertGemini(s);
      expect(JSON.stringify(body)).not.toMatch(/"type":\[|additionalProperties/);
    });
  }

  it('other families keep the original JSON Schema', () => {
    const ctx = ctxFor('tool-single');
    const body = createDriver({ ctx, base, messages: base.messages as never, caller: { tools: [] }, family: 'openai' }).body(0) as any;
    expect(JSON.stringify(body)).toMatch(/additionalProperties/);
  });
});
