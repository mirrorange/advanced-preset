/**
 * ConfigStore (§7): per-preset configuration layers
 * `configurationDefaults ⊕ layer(ref) ⊕ active.diff`, where the layer is a recommended
 * configuration or a saved user configuration. Only sparse diffs are stored (D9).
 */
import {
  applyMigrations, compareVersions, deepMerge, diffObjects, migrateUserModules, missingPoints, pruneDiff, recommended,
  type APreset, type Configuration, type SparseDiff, cloneData,
} from '@advanced-preset/protocol';
import { toast } from '@/st/host';
import { t } from '@/i18n';
import { settings, save, type ConfigRef, type PresetState, type SavedConfig } from './settings';

export function presetState(preset: APreset): PresetState {
  const all = settings().presets;
  let s = all[preset.id];
  if (!s) {
    s = all[preset.id] = {
      active: { ref: { kind: 'recommended', id: preset.defaultConfiguration }, diff: {} },
      saved: [],
      globalMemory: { log: [], cursor: 0 },
      version: preset.version,
      hash: preset.hash,
    };
    save();
  }
  return s;
}

function layer(preset: APreset, s: PresetState, ref: ConfigRef): SparseDiff | undefined {
  if (ref.kind === 'saved') return s.saved.find((c) => c.id === ref.id)?.diff;
  return recommended(preset, ref.id)?.diff;
}

/** Base configuration (defaults ⊕ layer) without the user's live edits. */
export function baseConfiguration(preset: APreset, ref = presetState(preset).active.ref): Configuration {
  return deepMerge(preset.configurationDefaults, layer(preset, presetState(preset), ref));
}

export function activeConfiguration(preset: APreset): Configuration {
  const s = presetState(preset);
  return deepMerge(baseConfiguration(preset, s.active.ref), s.active.diff);
}

/** Replace the effective configuration (stored as a diff against the base layer). */
export function setConfiguration(preset: APreset, full: Configuration): void {
  const s = presetState(preset);
  s.active.diff = (diffObjects(full, baseConfiguration(preset, s.active.ref)) ?? {}) as SparseDiff;
  save();
}

export function updateConfiguration(preset: APreset, mutate: (c: Configuration) => void): Configuration {
  const c = activeConfiguration(preset);
  mutate(c);
  setConfiguration(preset, c);
  return c;
}

export function selectConfiguration(preset: APreset, ref: ConfigRef): void {
  const s = presetState(preset);
  s.active = { ref, diff: {} };
  save();
}

export const isModified = (preset: APreset) => Object.keys(presetState(preset).active.diff ?? {}).length > 0;

export function resetConfiguration(preset: APreset): void {
  presetState(preset).active.diff = {};
  save();
}

export function saveConfigurationAs(preset: APreset, name: string): SavedConfig {
  const s = presetState(preset);
  const full = activeConfiguration(preset);
  const saved: SavedConfig = { id: `u${Date.now().toString(36)}`, name, diff: (diffObjects(full, preset.configurationDefaults) ?? {}) as SparseDiff };
  s.saved.push(saved);
  s.active = { ref: { kind: 'saved', id: saved.id }, diff: {} };
  save();
  return saved;
}

/** Overwrite a saved configuration with the current effective configuration. */
export function overwriteSaved(preset: APreset, id: string): void {
  const s = presetState(preset);
  const target = s.saved.find((c) => c.id === id);
  if (!target) return;
  target.diff = (diffObjects(activeConfiguration(preset), preset.configurationDefaults) ?? {}) as SparseDiff;
  if (s.active.ref.kind === 'saved' && s.active.ref.id === id) s.active.diff = {};
  save();
}

export function renameSaved(preset: APreset, id: string, name: string): void {
  const c = presetState(preset).saved.find((x) => x.id === id);
  if (c) { c.name = name; save(); }
}

export function deleteSaved(preset: APreset, id: string): void {
  const s = presetState(preset);
  s.saved = s.saved.filter((c) => c.id !== id);
  if (s.active.ref.kind === 'saved' && s.active.ref.id === id) s.active = { ref: { kind: 'recommended', id: preset.defaultConfiguration }, diff: s.active.diff };
  save();
}

/**
 * §7.3: after a preset update, rename keys by `migrations`, then drop keys the new schema no longer
 * has. Returns removed paths (logged as warnings). Idempotent per (version, hash).
 * User modules get the same renames; a version update that leaves some of them pointing at
 * insertion points the preset no longer declares raises a warning (their content is skipped).
 */
export function migratePresetState(preset: APreset): string[] {
  const s = presetState(preset);
  if (s.version === preset.version && s.hash === preset.hash) return [];
  const from = s.version ?? '0.0.0';
  const upgraded = compareVersions(from, preset.version) < 0;
  const removed: string[] = [];
  const shape = preset.configurationDefaults as unknown as Record<string, unknown>;
  const fix = (d: SparseDiff): SparseDiff => {
    const out = (upgraded ? applyMigrations(d, preset.migrations, from) : cloneData(d)) as Record<string, unknown>;
    removed.push(...pruneDiff(out, shape));
    // module / param maps are keyed by id: drop ids that no longer exist
    const mods = out.modules as Record<string, unknown> | undefined;
    if (mods) for (const k of Object.keys(mods)) if (!preset.modules.some((m) => m.id === k)) { delete mods[k]; removed.push(`modules.${k}`); }
    const params = out.params as Record<string, unknown> | undefined;
    if (params) for (const k of Object.keys(params)) if (!preset.params.some((p) => p.id === k)) { delete params[k]; removed.push(`params.${k}`); }
    return out as SparseDiff;
  };
  s.active.diff = fix(s.active.diff ?? {});
  for (const c of s.saved) c.diff = fix(c.diff);
  if (s.active.ref.kind === 'recommended' && !preset.configurations.some((c) => c.id === s.active.ref.id)) s.active.ref = { kind: 'recommended', id: preset.defaultConfiguration };
  if (s.userModules?.length && upgraded) s.userModules = migrateUserModules(s.userModules, preset.migrations, from);
  const lost = (s.userModules ?? []).filter((m) => m.enabled && missingPoints(preset, m).length).map((m) => m.name);
  const known = s.version !== undefined;
  s.version = preset.version;
  s.hash = preset.hash;
  save();
  if (removed.length) console.warn(`[AP] ${preset.id}: dropped obsolete configuration keys`, removed);
  if (lost.length && known && s.version !== from) toast('warning', t('um.lostAfterUpdate', { names: lost.join(', ') }), preset.name);
  return removed;
}
