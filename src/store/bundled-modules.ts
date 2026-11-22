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
 *
 * Groups the preset declares (`userModuleGroups`) are installed the same way: the first time a
 * version carries one it is added after the user's groups; from then on its name, mode, folding
 * and order are the user's, and a group the user deleted is not added again. The group a module
 * is in counts as its position: a new module goes into its group (ungrouped when the user does
 * not have it), an installed one stays where the user put it.
 */
import {
  cloneData, localizeUserModuleGroup, localizeUserModuleSource, normalizeUserModule, normalizeUserModuleGroups, presetUserModuleGroups, presetUserModules,
  userModuleFingerprint, userModuleSourceFingerprint, userModuleToSource, type APreset, type UserModule, type UserModuleGroup, type UserModuleSource,
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
  /** New modules to append, in preset order (in their group when the user has it). */
  add: UserModule[];
  /** New groups to append, in preset order (named for the UI language). */
  groups: UserModuleGroup[];
  /** Ids of the preset's groups synced after the sync (installed now or earlier). */
  groupRecords: string[];
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

const groupLabels = (preset: APreset, lang: string | undefined, id: string) => {
  const table = lang ? preset.locales?.[lang] ?? preset.locales?.[lang.split('-')[0]!] : undefined;
  return table?.userModuleGroups?.[id];
};

/** The user's groups and the preset groups synced so far (`PresetState.userModuleGroups` / `bundledGroups`). */
export interface UserGroupsState {
  list: UserModuleGroup[];
  records?: string[];
}

/** What syncing the preset's bundled modules (and groups) into `list` would do (pure). */
export function planBundledSync(
  preset: APreset, list: UserModule[], records: Record<string, BundledRecord> | undefined, lang?: string, groups: UserGroupsState = { list: [] },
): BundledPlan {
  const plan: BundledPlan = { add: [], groups: [], groupRecords: [], conflicts: [], records: {}, incomingCopy: {} };
  for (const g of presetUserModuleGroups(preset)) {
    if (!g || typeof g.id !== 'string' || !g.id || plan.groupRecords.includes(g.id)) continue;
    plan.groupRecords.push(g.id);
    // Known (the user has it, or deleted it) → the user's; new → install.
    if (groups.list.some((x) => x.id === g.id) || groups.records?.includes(g.id)) continue;
    plan.groups.push(localizeUserModuleGroup({ id: g.id, name: g.name, mode: g.mode === 'single' ? 'single' : 'multi', ...(g.collapsed ? { collapsed: true } : {}) }, groupLabels(preset, lang, g.id)));
  }
  const groupIds = new Set([...groups.list, ...plan.groups].map((g) => g.id));
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
      else {
        plan.add.push(typeof src.group === 'string' && groupIds.has(src.group) ? { ...incoming, group: src.group } : incoming);
        plan.records[src.id] = { source, copy };
      }
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
export function planIsEmpty(plan: BundledPlan, records: Record<string, BundledRecord> | undefined, groupRecords: string[] = []): boolean {
  if (plan.add.length || plan.groups.length || plan.conflicts.length) return false;
  if (plan.groupRecords.length !== groupRecords.length || plan.groupRecords.some((id) => !groupRecords.includes(id))) return false;
  const a = records ?? {};
  const keys = new Set([...Object.keys(a), ...Object.keys(plan.records)]);
  return [...keys].every((k) => a[k]?.source === plan.records[k]?.source && a[k]?.copy === plan.records[k]?.copy);
}

/**
 * Apply a plan: add new groups and modules, replace the conflicts in `take` with the preset's
 * version (keeping the user's enabled state, group and position). A single group keeps the module
 * that was on first (the user's choice over a new module).
 */
export function applyBundledSync(preset: APreset, plan: BundledPlan, take: Iterable<string> = []): void {
  const s = presetState(preset);
  const list = userModules(preset);
  const records = { ...plan.records };
  const next = [...list];
  for (const id of take) {
    const c = plan.conflicts.find((x) => x.id === id);
    const i = next.findIndex((m) => m.id === id);
    if (!c || i < 0) continue;
    const { enabled, group } = next[i]!;
    next.splice(i, 1, { ...c.incoming, enabled, ...(group !== undefined ? { group } : {}) });
    records[id] = { source: records[id]!.source, copy: plan.incomingCopy[id]! };
  }
  // New modules go to the end of their group or of the ungrouped ones.
  const n = normalizeUserModuleGroups([...next, ...plan.add], [...(s.userModuleGroups ?? []), ...plan.groups]);
  s.userModules = n.modules;
  s.userModuleGroups = n.groups;
  s.bundledModules = records;
  if (plan.groupRecords.length) s.bundledGroups = plan.groupRecords;
  else delete s.bundledGroups;
  save();
}

/**
 * The preset as exported with the chosen user modules bundled (they replace what it carried), with
 * the user's groups they are in (`groups`: the user's list). A bundled module the user left
 * unchanged keeps its source, translations included; so does a group the user left as the preset
 * gave it (a renamed group loses the preset's translated names).
 */
export function presetWithUserModules(preset: APreset, modules: UserModule[], lang?: string, groups: UserModuleGroup[] = []): APreset {
  const sources = presetUserModules(preset);
  const userModulesOut = modules.map((m): UserModuleSource => {
    const src = sources.find((x) => x.id === m.id);
    const incoming = src && incomingModule(preset, src, lang, m.enabled);
    if (src && incoming && userModuleFingerprint(incoming) === userModuleFingerprint(m)) {
      const { enabled: _ignored, group: _position, ...rest } = cloneData(src);
      return { ...rest, ...(m.enabled ? {} : { enabled: false }), ...(m.group !== undefined ? { group: m.group } : {}) };
    }
    return userModuleToSource(m);
  });
  const presetGroups = presetUserModuleGroups(preset);
  const locales = cloneData(preset.locales ?? {});
  const groupsOut = groups.filter((g) => modules.some((m) => m.group === g.id)).map((g): UserModuleGroup => {
    const src = presetGroups.find((x) => x.id === g.id);
    const same = (a: UserModuleGroup, b: UserModuleGroup) => a.name === b.name && a.mode === b.mode && Boolean(a.collapsed) === Boolean(b.collapsed);
    if (src && same(localizeUserModuleGroup(src, groupLabels(preset, lang, src.id)), g)) return cloneData(src);
    for (const table of Object.values(locales)) if (table?.userModuleGroups) delete table.userModuleGroups[g.id];
    return { id: g.id, name: g.name, mode: g.mode, ...(g.collapsed ? { collapsed: true } : {}) };
  });
  const { userModuleGroups: _replaced, ...rest } = preset;
  return { ...rest, locales, userModules: userModulesOut, ...(groupsOut.length ? { userModuleGroups: groupsOut } : {}) };
}
