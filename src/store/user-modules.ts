/**
 * User modules (per preset, in `PresetState.userModules`): CRUD, import / export and the chat text
 * their keyword rules scan. Merging into the preset happens in the assembler (`withUserModules`).
 */
import {
  cloneData, compareVersions, emptyTrigger, migrateUserModules, lostRefs, parseUserModuleFile, userModuleFile,
  type APreset, type KeywordTexts, type UserEntry, type UserModule, type UserModuleFile,
} from '@advanced-preset/protocol';
import { presetState } from './config';
import { save } from './settings';

/** Messages scanned for `recent` keyword rules at most. */
const SCAN_LIMIT = 50;

export function userModules(preset: APreset): UserModule[] {
  const s = presetState(preset);
  return (s.userModules ??= []);
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

export function createUserModule(preset: APreset, name: string): UserModule {
  const list = userModules(preset);
  const m: UserModule = { id: uniqueId(list.map((x) => x.id)), name, enabled: true, entries: [], vars: [], trigger: emptyTrigger() };
  if (preset.insertionPoints.length) m.entries.push(newEntry(preset, m));
  list.push(m);
  save();
  return list[list.length - 1]!;
}

export function duplicateUserModule(preset: APreset, id: string, name: (original: string) => string): UserModule | undefined {
  const list = userModules(preset);
  const i = list.findIndex((m) => m.id === id);
  if (i < 0) return undefined;
  const copy: UserModule = { ...cloneData(list[i]!), id: uniqueId(list.map((x) => x.id)), name: name(list[i]!.name) };
  list.splice(i + 1, 0, copy);
  save();
  return list[i + 1];
}

export function removeUserModule(preset: APreset, id: string): void {
  const s = presetState(preset);
  s.userModules = (s.userModules ?? []).filter((m) => m.id !== id);
  save();
}

/** Move a module to `to` (index in the list). Order decides insertion order at a shared point. */
export function moveUserModule(preset: APreset, id: string, to: number): void {
  const list = userModules(preset);
  const from = list.findIndex((m) => m.id === id);
  if (from < 0 || to < 0 || to >= list.length || from === to) return;
  const [m] = list.splice(from, 1);
  list.splice(to, 0, m!);
  save();
}

export function exportUserModules(preset: APreset, ids?: string[]): UserModuleFile {
  const list = userModules(preset).filter((m) => !ids || ids.includes(m.id));
  return userModuleFile(cloneData(list), preset);
}

/**
 * Add the modules of an exported file. Imported modules always get fresh ids (a re-import is a
 * copy, never an overwrite). Files from an older version of the preset are migrated first.
 */
export function importUserModules(preset: APreset, raw: unknown): { added: UserModule[]; missing: number } {
  const file = parseUserModuleFile(raw);
  let modules = file.modules;
  if (file.preset?.id === preset.id && file.preset.version && compareVersions(file.preset.version, preset.version) < 0)
    modules = migrateUserModules(modules, preset.migrations, file.preset.version);
  const list = userModules(preset);
  const added = modules.map((m) => {
    const copy = { ...m, id: uniqueId(list.map((x) => x.id)) };
    list.push(copy);
    return copy;
  });
  save();
  return { added, missing: added.filter((m) => lostRefs(preset, m).length).length };
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
