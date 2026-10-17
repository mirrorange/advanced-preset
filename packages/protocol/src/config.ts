/**
 * Configuration layers (D8/D9): `configurationDefaults ⊕ recommended[base] ⊕ user diff`.
 * User data only stores sparse diffs, so new defaults flow in automatically.
 */
import { cloneData } from './clone';
import type { APreset, Configuration, Migration, SparseDiff } from './types';
import { satisfies } from './semver';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

export function deepMerge<T>(base: T, ...layers: unknown[]): T {
  let out: unknown = cloneData(base);
  for (const layer of layers) out = mergeTwo(out, layer);
  return out as T;
}

function mergeTwo(a: unknown, b: unknown): unknown {
  if (b === undefined) return a;
  if (!isObj(a) || !isObj(b)) return cloneData(b);
  const out: Obj = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = mergeTwo(a[k], v);
  return out;
}

/** Sparse difference `full − base` (only changed leaves; arrays compared as values). */
export function diffObjects(full: unknown, base: unknown): unknown {
  if (isObj(full) && isObj(base)) {
    const out: Obj = {};
    for (const [k, v] of Object.entries(full)) {
      const d = diffObjects(v, base[k]);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return JSON.stringify(full) === JSON.stringify(base) ? undefined : cloneData(full);
}

/** Drop keys of `diff` that do not exist in `shape` (the defaults). Returns removed paths. */
export function pruneDiff(diff: Obj, shape: Obj, path = '', removed: string[] = [], openMaps = OPEN_MAPS): string[] {
  for (const k of Object.keys(diff)) {
    const p = path ? `${path}.${k}` : k;
    if (openMaps.has(path)) continue; // free-form maps (sampling) accept any key
    if (!(k in shape)) { delete diff[k]; removed.push(p); continue; }
    if (isObj(diff[k]) && isObj(shape[k])) {
      pruneDiff(diff[k] as Obj, shape[k] as Obj, p, removed, openMaps);
      if (!Object.keys(diff[k] as Obj).length) delete diff[k];
    }
  }
  return removed;
}
const OPEN_MAPS = new Set(['sampling']);

export function applyMigrations(diff: SparseDiff, migrations: Migration[], fromVersion: string): SparseDiff {
  const out = cloneData(diff) as Obj;
  for (const mig of migrations) {
    if (!satisfies(fromVersion, mig.from)) continue;
    for (const section of ['modules', 'params'] as const) {
      const map = mig.rename[section];
      const target = out[section];
      if (!map || !isObj(target)) continue;
      for (const [from, to] of Object.entries(map)) {
        if (from in target) { target[to] = target[from]; delete target[from]; }
      }
    }
  }
  return out as SparseDiff;
}

export function recommended(preset: APreset, id: string) {
  return preset.configurations.find((c) => c.id === id) ?? preset.configurations.find((c) => c.id === preset.defaultConfiguration);
}

/** Effective configuration for a base recommendation and a user diff. */
export function resolveConfiguration(preset: APreset, base: string, diff: SparseDiff | undefined): Configuration {
  return deepMerge(preset.configurationDefaults, recommended(preset, base)?.diff, diff);
}

/** User diff relative to the base recommendation. */
export function diffConfiguration(preset: APreset, base: string, full: Configuration): SparseDiff {
  const baseFull = deepMerge(preset.configurationDefaults, recommended(preset, base)?.diff);
  return (diffObjects(full, baseFull) ?? {}) as SparseDiff;
}
