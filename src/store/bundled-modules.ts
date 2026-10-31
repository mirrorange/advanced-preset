/**
 * Bundled user modules (`preset.userModules`, from `user-modules/` in the preset source): installed
 * into the user's own list the first time a preset version carries them, then ordinary user modules
 * the user may edit, disable or delete.
 *
 * Each synced module keeps a record of two fingerprints: the preset's source (all translations) and
 * the copy the preset gave the user. On a later version:
 *   - source unchanged              → nothing (the user's copy is theirs)
 *   - module deleted by the user    → stays deleted
 *   - user's copy equals the new one → nothing
 *   - otherwise                     → a conflict: keep the user's copy or take the preset's
 * `modified` tells whether the user changed their copy since the preset gave it to them.
 */
import {
  cloneData, localizeUserModuleSource, normalizeUserModule, presetUserModules, userModuleFingerprint, userModuleSourceFingerprint,
  userModuleToSource, type APreset, type UserModule, type UserModuleSource,
} from '@advanced-preset/protocol';
import { presetState } from './config';
import { save } from './settings';
import { userModules } from './user-modules';

export interface BundledRecord {
  /** `userModuleSourceFingerprint` of the preset's source when last synced. */
  source: string;
  /** `userModuleFingerprint` of the copy the preset last gave the user (`''`: unknown). */
  copy: string;
}

export interface BundledConflict {
  id: string;
  /** The preset's version, as a module (localized; the user's enabled state). */
  incoming: UserModule;
  installed: UserModule;
  /** The user changed their copy since the preset gave it (or it did not come from the preset). */
  modified: boolean;
}

export interface BundledPlan {
  /** New modules to append, in preset order. */
  add: UserModule[];
  conflicts: BundledConflict[];
  /** Records after the sync, assuming every conflict keeps the user's copy. */
  records: Record<string, BundledRecord>;
  /** Fingerprint of each conflict's incoming copy (record when the preset's version is taken). */
  incomingCopy: Record<string, string>;
}

/** The source as a user module for `lang`; `null` for malformed (untrusted) data. */
function incomingModule(preset: APreset, src: UserModuleSource, lang: string | undefined, enabled: boolean): UserModule | null {
  const table = lang ? preset.locales?.[lang] ?? preset.locales?.[lang.split('-')[0]!] : undefined;
  const body = localizeUserModuleSource(src, lang, table?.userModules?.[src.id]);
  return normalizeUserModule({ ...cloneData(body), id: src.id, enabled });
}

/** What syncing the preset's bundled modules into `list` would do (pure). */
export function planBundledSync(preset: APreset, list: UserModule[], records: Record<string, BundledRecord> | undefined, lang?: string): BundledPlan {
  const plan: BundledPlan = { add: [], conflicts: [], records: {}, incomingCopy: {} };
  const seen = new Set<string>();
  for (const src of presetUserModules(preset)) {
    if (!src || typeof src.id !== 'string' || !src.id || seen.has(src.id)) continue;
    seen.add(src.id);
    const installed = list.find((m) => m.id === src.id);
    const incoming = incomingModule(preset, src, lang, installed?.enabled ?? src.enabled !== false);
    if (!incoming) continue;
    const source = userModuleSourceFingerprint(src);
    const copy = userModuleFingerprint(incoming);
    const rec = records?.[src.id];
    if (rec?.source === source) { plan.records[src.id] = rec; continue; }
    if (!installed) {
      // Deleted by the user (known) stays deleted; unknown → install.
      if (rec) plan.records[src.id] = { source, copy: rec.copy };
      else { plan.add.push(incoming); plan.records[src.id] = { source, copy }; }
      continue;
    }
    const current = userModuleFingerprint(installed);
    if (current === copy) { plan.records[src.id] = { source, copy }; continue; }
    plan.conflicts.push({ id: src.id, incoming, installed, modified: !rec || current !== rec.copy });
    plan.records[src.id] = { source, copy: rec?.copy ?? '' };
    plan.incomingCopy[src.id] = copy;
  }
  return plan;
}

/** Whether applying the plan changes nothing. */
export function planIsEmpty(plan: BundledPlan, records: Record<string, BundledRecord> | undefined): boolean {
  if (plan.add.length || plan.conflicts.length) return false;
  const a = records ?? {};
  const keys = new Set([...Object.keys(a), ...Object.keys(plan.records)]);
  return [...keys].every((k) => a[k]?.source === plan.records[k]?.source && a[k]?.copy === plan.records[k]?.copy);
}

/** Apply a plan: append new modules, replace the conflicts in `take` with the preset's version. */
export function applyBundledSync(preset: APreset, plan: BundledPlan, take: Iterable<string> = []): void {
  const s = presetState(preset);
  const list = userModules(preset);
  const records = { ...plan.records };
  for (const id of take) {
    const c = plan.conflicts.find((x) => x.id === id);
    const i = list.findIndex((m) => m.id === id);
    if (!c || i < 0) continue;
    list.splice(i, 1, { ...c.incoming, enabled: list[i]!.enabled });
    records[id] = { source: records[id]!.source, copy: plan.incomingCopy[id]! };
  }
  list.push(...plan.add);
  s.bundledModules = records;
  save();
}

/**
 * The preset as exported with the chosen user modules bundled (they replace what it carried).
 * A bundled module the user left unchanged keeps its source, translations included.
 */
export function presetWithUserModules(preset: APreset, modules: UserModule[], lang?: string): APreset {
  const sources = presetUserModules(preset);
  const userModulesOut = modules.map((m): UserModuleSource => {
    const src = sources.find((x) => x.id === m.id);
    const incoming = src && incomingModule(preset, src, lang, m.enabled);
    if (src && incoming && userModuleFingerprint(incoming) === userModuleFingerprint(m)) {
      const { enabled: _ignored, ...rest } = cloneData(src);
      return { ...rest, ...(m.enabled ? {} : { enabled: false }) };
    }
    return userModuleToSource(m);
  });
  return { ...preset, userModules: userModulesOut };
}
