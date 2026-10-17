/**
 * Deep copy of JSON-like data. Unlike `structuredClone` it reads through proxies (e.g. Vue reactive
 * state), so callers never need to unwrap before copying. `undefined` object members are dropped.
 */
export function cloneData<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => cloneData(v)) as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) if (v !== undefined) out[k] = cloneData(v);
  return out as T;
}
