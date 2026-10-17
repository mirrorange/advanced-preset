/**
 * Gemini (makersuite / vertexai) only accepts an OpenAPI-3.0 subset of JSON Schema in
 * `function_declarations[].parameters` and `responseSchema`: `type` must be a single value,
 * nullability is `nullable: true`, and keywords like `additionalProperties` / `const` / `oneOf`
 * are rejected ("Unknown name …", "Proto field is not repeating, cannot start list").
 * SillyTavern forwards OpenAI-style schemas to Gemini untouched, so we convert them here.
 */
import type { JsonSchema } from './structures';

/** Keywords of Gemini's `Schema` message. Everything else is dropped. */
const KEEP = new Set([
  'type', 'format', 'title', 'description', 'nullable', 'enum', 'maxItems', 'minItems', 'properties', 'required',
  'minProperties', 'maxProperties', 'minLength', 'maxLength', 'pattern', 'example', 'anyOf', 'propertyOrdering', 'items',
  'minimum', 'maximum',
]);
const TYPES = new Set(['string', 'number', 'integer', 'boolean', 'array', 'object']);
const FORMATS: Record<string, string[]> = { string: ['enum', 'date-time'], number: ['float', 'double'], integer: ['int32', 'int64'] };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Convert one JSON Schema node (recursively) into a Gemini-compatible schema. Never mutates the input. */
export function toGeminiSchema(schema: unknown): JsonSchema {
  if (!isObj(schema)) return { type: 'string' };
  const src: Record<string, unknown> = { ...schema };

  // oneOf / allOf → anyOf (allOf with one member is inlined)
  if (Array.isArray(src.allOf) && src.allOf.length === 1 && isObj(src.allOf[0])) {
    const { allOf: _drop, ...own } = src;
    return toGeminiSchema({ ...(src.allOf[0] as Record<string, unknown>), ...own });
  }
  if (Array.isArray(src.oneOf) && !src.anyOf) src.anyOf = src.oneOf;
  if (src.const !== undefined && src.enum === undefined) src.enum = [src.const];

  const out: JsonSchema = {};
  let nullable = src.nullable === true;
  let types = (Array.isArray(src.type) ? src.type : src.type === undefined ? [] : [src.type]).map(String);
  if (types.includes('null')) { nullable = true; types = types.filter((t) => t !== 'null'); }
  types = types.filter((t) => TYPES.has(t));

  if (Array.isArray(src.anyOf)) {
    const members = src.anyOf.filter(isObj);
    const nonNull = members.filter((m) => m.type !== 'null');
    if (nonNull.length < members.length) nullable = true;
    if (nonNull.length === 1 && !types.length) {
      const inner = toGeminiSchema(nonNull[0]);
      return finish({ ...inner, ...(src.description ? { description: src.description } : {}) }, nullable);
    }
    if (nonNull.length) out.anyOf = nonNull.map((m) => toGeminiSchema(m));
  }

  if (types.length > 1) {
    // a multi-type union becomes anyOf of single-type copies
    const rest = { ...src, type: undefined, anyOf: undefined, oneOf: undefined, nullable: undefined };
    const members = types.map((t) => toGeminiSchema({ ...rest, type: t }));
    return finish({ anyOf: members, ...(typeof src.description === 'string' ? { description: src.description } : {}) }, nullable);
  }
  const type = types[0];
  if (type) out.type = type;

  for (const [k, v] of Object.entries(src)) {
    if (v === undefined || !KEEP.has(k) || k === 'type' || k === 'anyOf' || k === 'nullable') continue;
    switch (k) {
      case 'properties':
        if (isObj(v)) out.properties = Object.fromEntries(Object.entries(v).map(([n, s]) => [n, toGeminiSchema(s)]));
        break;
      case 'items':
        out.items = toGeminiSchema(Array.isArray(v) ? v[0] : v);
        break;
      case 'enum': {
        const values = Array.isArray(v) ? v.filter((x) => x !== null && x !== undefined).map(String) : [];
        if (values.length && (!type || type === 'string')) { out.enum = values; out.type = 'string'; }
        break;
      }
      case 'format':
        if (type && FORMATS[type]?.includes(String(v))) out.format = v;
        break;
      case 'required':
        if (Array.isArray(v)) out.required = v.map(String);
        break;
      default:
        out[k] = v;
    }
  }

  if (out.type === 'object' || (!out.type && out.properties)) {
    const props = isObj(out.properties) ? out.properties : {};
    const names = Object.keys(props);
    if (!names.length) {
      // Gemini rejects OBJECT without properties (e.g. free-form maps): ask for a JSON-encoded string instead.
      const desc = typeof out.description === 'string' ? `${out.description} ` : '';
      return finish({ type: 'string', description: `${desc}(JSON object encoded as a string)`.trim() }, nullable);
    }
    out.type = 'object';
    if (Array.isArray(out.required)) out.required = (out.required as string[]).filter((r) => names.includes(r));
    // Gemini otherwise emits properties alphabetically; keep the declared (stage) order.
    out.propertyOrdering = names;
  }
  if (out.type === 'array' && !out.items) out.items = { type: 'string' };
  return finish(out, nullable);
}

function finish(s: JsonSchema, nullable: boolean): JsonSchema {
  if (nullable) s.nullable = true;
  return s;
}

/** Apply {@link toGeminiSchema} to OpenAI-style tool definitions (`{ type: 'function', function: { parameters } }`). */
export function toGeminiTools<T>(tools: T[]): T[] {
  return tools.map((t: any) => {
    const params = t?.function?.parameters;
    if (!isObj(params)) return t;
    const props = isObj(params.properties) ? params.properties : {};
    // Parameterless tools: ST drops `parameters` when `properties` is empty, keep that shape.
    if (!Object.keys(props).length) return t;
    return { ...t, function: { ...t.function, parameters: toGeminiSchema(params) } };
  });
}
