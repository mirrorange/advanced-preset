/**
 * Parameter values (I-119). Parameters are `text` / `number` / `select` scalars or `list` (an
 * ordered list of strings, e.g. banned words). Stored configuration values are user data and may
 * not match the declaration (a param changed type, hand-edited exports), so every reader goes
 * through `paramValue()`.
 */
import type { APreset, Configuration, Param, ParamType, ParamValue } from './types';

export const PARAM_TYPES: readonly ParamType[] = ['text', 'number', 'select', 'list'];
/** First Advanced Preset version that understands `list` params. */
export const LIST_PARAMS_SINCE = '1.9.0';
/** Text placed between items by `{{ap::param::<list>}}` when the param declares no `separator`. */
export const DEFAULT_LIST_SEPARATOR = ', ';

/** Trimmed, non-empty, de-duplicated items (first occurrence wins). */
export function normalizeList(items: readonly unknown[]): string[] {
  const out: string[] = [];
  for (const x of items) {
    if (typeof x !== 'string' && typeof x !== 'number') continue;
    const s = String(x).trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

/** Whether a raw value has the shape of the param's type (lists: arrays of strings). */
export function paramValueMatches(param: Pick<Param, 'type'>, v: unknown): boolean {
  if (param.type === 'list') return Array.isArray(v) && v.every((x) => typeof x === 'string');
  if (param.type === 'number') return typeof v === 'number' && Number.isFinite(v);
  return typeof v === 'string' || typeof v === 'number';
}

/** Default value of a type: `''`, `0` or `[]`. */
export function emptyParamValue(type: ParamType): ParamValue {
  return type === 'list' ? [] : type === 'number' ? 0 : '';
}

/** A raw value coerced to the param's type; values of the wrong shape fall back to the default. */
export function paramValue(param: Param, raw: unknown): ParamValue {
  const v = raw === undefined ? param.default : raw;
  if (param.type === 'list') {
    if (Array.isArray(v)) return normalizeList(v);
    return Array.isArray(param.default) ? normalizeList(param.default) : [];
  }
  if (param.type === 'number') {
    const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
    return Number.isFinite(n) ? n : typeof param.default === 'number' ? param.default : 0;
  }
  if (typeof v === 'string' || typeof v === 'number') return v;
  return typeof param.default === 'string' || typeof param.default === 'number' ? param.default : '';
}

/** '' / 0 / [] mean "not set": the param's `unset` text (or fallback param) is used instead. */
export function isParamUnset(v: ParamValue | undefined): boolean {
  return v === undefined || v === '' || v === 0 || (Array.isArray(v) && v.length === 0);
}

/** Every declared param with its effective value (condition variables `params.*`, template scope). */
export function paramValues(preset: Pick<APreset, 'params'>, config: Pick<Configuration, 'params'>): Record<string, ParamValue> {
  return Object.fromEntries(preset.params.map((p) => [p.id, paramValue(p, config.params?.[p.id])]));
}
