/**
 * PresetStore: built-in artifacts shipped in `dist/presets`, user-installed artifacts and the
 * live `ap dev` source. Lookup order: dev override → installed → built-in.
 */
import { reactive } from 'vue';
import { FORMAT_VERSION, compareVersions, type APreset } from '@advanced-preset/protocol';
import { extensionBaseUrl, nativeFetch } from '@/st/host';
import { settings, save } from './settings';

export type PresetSource = 'builtin' | 'installed' | 'dev';
export interface PresetEntry { preset: APreset; source: PresetSource }

const builtins = reactive(new Map<string, APreset>());
const devPresets = reactive(new Map<string, APreset>());

export async function loadBuiltins(): Promise<void> {
  try {
    const base = `${extensionBaseUrl()}dist/presets/`;
    const index: { file: string }[] = await (await nativeFetch(`${base}index.json`, { cache: 'no-cache' })).json();
    for (const { file } of index) {
      const a = (await (await nativeFetch(base + file, { cache: 'no-cache' })).json()) as APreset;
      if (isArtifact(a)) builtins.set(a.id, a);
    }
  } catch (e) {
    console.error('[AP] failed to load built-in presets', e);
  }
}

export function isArtifact(a: unknown): a is APreset {
  const x = a as APreset;
  return Boolean(x) && typeof x === 'object' && x.formatVersion === FORMAT_VERSION && typeof x.id === 'string' && Array.isArray(x.entries);
}

export function listPresets(): PresetEntry[] {
  const ids = new Set([...builtins.keys(), ...Object.keys(settings().installed), ...devPresets.keys()]);
  return [...ids].map((id) => getPresetEntry(id)!).filter(Boolean).sort((a, b) => a.preset.name.localeCompare(b.preset.name));
}

export function getPresetEntry(id: string): PresetEntry | undefined {
  const dev = devPresets.get(id);
  if (dev) return { preset: dev, source: 'dev' };
  const inst = settings().installed[id];
  const bi = builtins.get(id);
  // An installed copy older than the shipped built-in is superseded by the built-in.
  if (inst && (!bi || compareVersions(inst.version, bi.version) >= 0)) return { preset: inst, source: 'installed' };
  if (bi) return { preset: bi, source: 'builtin' };
  return undefined;
}

export const getPreset = (id: string) => getPresetEntry(id)?.preset;

export function installPreset(a: APreset): void {
  settings().installed[a.id] = a;
  save();
}

export function removeInstalled(id: string): void {
  delete settings().installed[id];
  save();
}

export function setDevPreset(a: APreset | null, id?: string): void {
  if (a) devPresets.set(a.id, a);
  else if (id) devPresets.delete(id);
  else devPresets.clear();
}

export const isBuiltin = (id: string) => builtins.has(id);
