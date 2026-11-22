/**
 * User modules (per preset, in `PresetState.userModules`) and their groups
 * (`PresetState.userModuleGroups`): CRUD, import / export and the chat text their keyword rules
 * scan. Merging into the preset happens in the assembler (`withUserModules`).
 *
 * The flat list is always in display order (ungrouped first, then each group in group order) and a
 * single group has at most one module on (`normalizeUserModuleGroups`); every change below keeps
 * that, and reading the list repairs settings that break it.
 */
import {
  cloneData, compareVersions, emptyTrigger, groupMembers, migrateUserModules, lostRefs, normalizeUserModuleGroups, parseUserModuleFile,
  userModuleFile, userModuleFromSource,
  type APreset, type KeywordTexts, type UserGroupMode, type UserModuleSourceBody, type UserEntry, type UserModule, type UserModuleFile,
  type UserModuleGroup,
} from '@advanced-preset/protocol';
import { presetState } from './config';
import { save } from './settings';

/** Messages scanned for `recent` keyword rules at most. */
const SCAN_LIMIT = 50;

function inOrder(modules: UserModule[], groups: UserModuleGroup[]): boolean {
  const n = normalizeUserModuleGroups(modules, groups);
  return n.groups.length === groups.length && n.modules.every((m, i) => m === modules[i]);
}

export function userModules(preset: APreset): UserModule[] {
  const s = presetState(preset);
  const list = (s.userModules ??= []);
  for (const m of list) m.vars ??= []; // saved before build variables existed
  const groups = s.userModuleGroups ?? [];
  if (inOrder(list, groups)) return list;
  commit(preset, list, groups);
  return s.userModules;
}

export function userModuleGroups(preset: APreset): UserModuleGroup[] {
  userModules(preset);
  return (presetState(preset).userModuleGroups ??= []);
}

/** Store both lists in normalized form and save. */
function commit(preset: APreset, modules: UserModule[], groups: UserModuleGroup[]): void {
  const s = presetState(preset);
  const n = normalizeUserModuleGroups(modules, groups);
  s.userModules = n.modules;
  s.userModuleGroups = n.groups;
  save();
}

const findModule = (preset: APreset, id: string) => userModules(preset).find((m) => m.id === id);
const findGroup = (preset: APreset, id: string | null | undefined) => (id ? userModuleGroups(preset).find((g) => g.id === id) : undefined);

/** Whether a module joining `group` must start switched off (a single group that has one on). */
function blocked(preset: APreset, group: string | undefined, except?: string): boolean {
  return findGroup(preset, group)?.mode === 'single' && userModules(preset).some((m) => m.group === group && m.id !== except && m.enabled);
}

const shortId = () => Math.random().toString(36).slice(2, 8);

function uniqueId(taken: Iterable<string>): string {
  const used = new Set(taken);
  let id = shortId();
  while (used.has(id)) id = shortId();
  return id;
}

export function newEntry(preset: APreset, module?: UserModule): UserEntry {
  const point = preset.insertionPoints[0]?.id ?? '';
  return { id: uniqueId(module?.entries.map((e) => e.id) ?? []), point, text: '' };
}

/** Add a module at the end of `group` (absent: ungrouped), switched off when the group is single and has one on. */
function addModule(preset: APreset, m: UserModule, group?: string): UserModule {
  if (findGroup(preset, group)) {
    m.group = group;
    if (blocked(preset, group)) m.enabled = false;
  }
  commit(preset, [...userModules(preset), m], userModuleGroups(preset));
  return findModule(preset, m.id)!;
}

/** A blank module at the end of `group` (absent: ungrouped). */
export function createUserModule(preset: APreset, name: string, group?: string): UserModule {
  const list = userModules(preset);
  const m: UserModule = { id: uniqueId(list.map((x) => x.id)), name, enabled: true, entries: [], vars: [], trigger: emptyTrigger() };
  if (preset.insertionPoints.length) m.entries.push(newEntry(preset, m));
  return addModule(preset, m, group);
}

/**
 * A new module copied from a preset's user module template (already localized), at the end of
 * `group`. The copy is the user's own: later preset updates do not change it. A name already in
 * the list gets a number.
 */
export function createUserModuleFromTemplate(preset: APreset, body: UserModuleSourceBody, group?: string): UserModule {
  const list = userModules(preset);
  const names = new Set(list.map((m) => m.name));
  let name = body.name;
  for (let n = 2; names.has(name); n++) name = `${body.name} ${n}`;
  return addModule(preset, userModuleFromSource(body, uniqueId(list.map((x) => x.id)), { name }), group);
}

/** A copy right after the original, in its group (off when the group is single and the original is on). */
export function duplicateUserModule(preset: APreset, id: string, name: (original: string) => string): UserModule | undefined {
  const list = userModules(preset);
  const i = list.findIndex((m) => m.id === id);
  if (i < 0) return undefined;
  const copy: UserModule = { ...cloneData(list[i]!), id: uniqueId(list.map((x) => x.id)), name: name(list[i]!.name) };
  if (blocked(preset, copy.group)) copy.enabled = false;
  commit(preset, [...list.slice(0, i + 1), copy, ...list.slice(i + 1)], userModuleGroups(preset));
  return findModule(preset, copy.id);
}

export function removeUserModule(preset: APreset, id: string): void {
  commit(preset, userModules(preset).filter((m) => m.id !== id), userModuleGroups(preset));
}

/** Switch a module on / off. In a single group, switching one on switches the others off. */
export function setUserModuleEnabled(preset: APreset, id: string, on: boolean): void {
  const m = findModule(preset, id);
  if (!m) return;
  if (on && findGroup(preset, m.group)?.mode === 'single') {
    for (const x of userModules(preset)) if (x.group === m.group && x !== m) x.enabled = false;
  }
  m.enabled = on;
  save();
}

/**
 * Move a module to position `index` of `group` (`null`: ungrouped; index among the group's other
 * modules, clamped). Order decides insertion order at a shared point. A module moved into a single
 * group that already has one on is switched off.
 */
export function moveUserModule(preset: APreset, id: string, group: string | null, index: number): void {
  const list = userModules(preset);
  const m = list.find((x) => x.id === id);
  if (!m) return;
  const target = group !== null ? findGroup(preset, group)?.id : undefined;
  if (group !== null && !target) return;
  const rest = list.filter((x) => x !== m);
  const members = groupMembers(rest, target ?? null);
  const before = members[Math.max(0, index)];
  const moved: UserModule = { ...m };
  if (target) moved.group = target;
  else delete moved.group;
  if (target !== m.group && moved.enabled && blocked(preset, target, m.id)) moved.enabled = false;
  const at = before ? rest.indexOf(before) : rest.length;
  const next = [...rest.slice(0, at), moved, ...rest.slice(at)];
  if (next.every((x, i) => x.id === list[i]!.id) && moved.group === m.group && moved.enabled === m.enabled) return;
  commit(preset, next, userModuleGroups(preset));
}

// ---------------------------------------------------------------------------------------------
// Groups

export function createUserModuleGroup(preset: APreset, name: string, mode: UserGroupMode = 'multi'): UserModuleGroup {
  const groups = userModuleGroups(preset);
  const g: UserModuleGroup = { id: uniqueId(groups.map((x) => x.id)), name, mode };
  commit(preset, userModules(preset), [...groups, g]);
  return findGroup(preset, g.id)!;
}

export function renameUserModuleGroup(preset: APreset, id: string, name: string): void {
  const g = findGroup(preset, id);
  if (g) { g.name = name; save(); }
}

/** Change a group's mode. Single → only the first module that was on stays on. */
export function setUserModuleGroupMode(preset: APreset, id: string, mode: UserGroupMode): void {
  const g = findGroup(preset, id);
  if (!g || g.mode === mode) return;
  g.mode = mode;
  commit(preset, userModules(preset), userModuleGroups(preset));
}

export function setUserModuleGroupCollapsed(preset: APreset, id: string, collapsed: boolean): void {
  const g = findGroup(preset, id);
  if (!g) return;
  if (collapsed) g.collapsed = true;
  else delete g.collapsed;
  save();
}

/** Move a group to position `to` among the groups (its modules move with it). */
export function moveUserModuleGroup(preset: APreset, id: string, to: number): void {
  const groups = userModuleGroups(preset);
  const from = groups.findIndex((g) => g.id === id);
  if (from < 0 || to < 0 || to >= groups.length || from === to) return;
  const next = [...groups];
  const [g] = next.splice(from, 1);
  next.splice(to, 0, g!);
  commit(preset, userModules(preset), next);
}

/** Delete a group; its modules go with it (`withModules`) or become ungrouped (at the end). */
export function removeUserModuleGroup(preset: APreset, id: string, o: { withModules: boolean }): void {
  const groups = userModuleGroups(preset);
  if (!groups.some((g) => g.id === id)) return;
  const list = userModules(preset);
  const kept = o.withModules ? list.filter((m) => m.group !== id) : list.map((m) => (m.group === id ? (({ group: _g, ...rest }) => rest)(m) : m));
  commit(preset, kept, groups.filter((g) => g.id !== id));
}

// ---------------------------------------------------------------------------------------------
// Files

/** The chosen modules (default: all) with the groups they belong to. */
export function exportUserModules(preset: APreset, ids?: string[]): UserModuleFile {
  const list = userModules(preset).filter((m) => !ids || ids.includes(m.id));
  return userModuleFile(cloneData(list), preset, cloneData(userModuleGroups(preset)));
}

/** A whole group with all its modules (an empty group is exported too). */
export function exportUserModuleGroup(preset: APreset, id: string): UserModuleFile {
  const g = findGroup(preset, id);
  if (!g) return userModuleFile([], preset);
  return { ...userModuleFile(cloneData(groupMembers(userModules(preset), id)), preset), groups: [cloneData(g)] };
}

/**
 * Add the modules and groups of an exported file. Everything imported gets fresh ids (a re-import
 * is a copy, never an overwrite): groups are added after the existing ones, modules without a group
 * at the end of the ungrouped ones. Files from an older version of the preset are migrated first.
 */
export function importUserModules(preset: APreset, raw: unknown): { added: UserModule[]; groups: UserModuleGroup[]; missing: number } {
  const file = parseUserModuleFile(raw);
  let modules = file.modules;
  if (file.preset?.id === preset.id && file.preset.version && compareVersions(file.preset.version, preset.version) < 0)
    modules = migrateUserModules(modules, preset.migrations, file.preset.version);
  const groupIds = userModuleGroups(preset).map((g) => g.id);
  const remap = new Map<string, string>();
  const groups = file.groups.map((g) => {
    const id = uniqueId(groupIds);
    groupIds.push(id);
    remap.set(g.id, id);
    return { ...g, id };
  });
  const ids = userModules(preset).map((m) => m.id);
  const added = modules.map((m) => {
    const id = uniqueId(ids);
    ids.push(id);
    const copy: UserModule = { ...m, id };
    if (m.group !== undefined) copy.group = remap.get(m.group)!;
    return copy;
  });
  commit(preset, [...userModules(preset), ...added], [...userModuleGroups(preset), ...groups]);
  const stored = added.map((m) => findModule(preset, m.id)!);
  return { added: stored, groups: groups.map((g) => findGroup(preset, g.id)!), missing: stored.filter((m) => lostRefs(preset, m).length).length };
}

/** Keyword rule input: the current user message, then earlier non-system messages, newest first. */
export function keywordTexts(chat: { mes?: string; is_system?: boolean }[], inputIndex: number): KeywordTexts {
  const recent: string[] = [];
  for (let i = chat.length - 1; i >= 0 && recent.length < SCAN_LIMIT; i--) {
    const m = chat[i]!;
    if (!m.is_system && m.mes) recent.push(m.mes);
  }
  return { input: inputIndex >= 0 ? chat[inputIndex]?.mes ?? '' : '', recent };
}
