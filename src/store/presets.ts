/**
 * PresetStore: built-in artifacts shipped in `dist/presets`, user-installed artifacts and the
 * live `ap dev` source. Lookup order: dev override → installed → built-in.
 */
import { reactive } from 'vue';
import { compareVersions, upgradeArtifact, type APreset } from '@advanced-preset/protocol';
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
      const a = upgradeArtifact(await (await nativeFetch(base + file, { cache: 'no-cache' })).json());
      if (a) builtins.set(a.id, a);
    }
  } catch (e) {
    console.error('[AP] failed to load built-in presets', e);
  }
}

/** Parse an artifact of any supported format into the current one (`null` if it is not an artifact). */
export const toArtifact = (a: unknown): APreset | null => upgradeArtifact(a);

export function listPresets(): PresetEntry[] {
  const ids = new Set([...builtins.keys(), ...Object.keys(settings().installed), ...devPresets.keys()]);
  return [...ids].map((id) => getPresetEntry(id)!).filter(Boolean).sort((a, b) => a.preset.name.localeCompare(b.preset.name));
}

export function getPresetEntry(id: string): PresetEntry | undefined {
  const dev = devPresets.get(id);
  if (dev) return { preset: dev, source: 'dev' };
  const inst = installedArtifact(id);
  const bi = builtins.get(id);
  // An installed copy older than the shipped built-in is superseded by the built-in.
  if (inst && (!bi || compareVersions(inst.version, bi.version) >= 0)) return { preset: inst, source: 'installed' };
  if (bi) return { preset: bi, source: 'builtin' };
  return undefined;
}

/** Installed copies may predate the current artifact format: upgrade them (memoised per stored object). */
const upgraded = new WeakMap<object, APreset | null>();
function installedArtifact(id: string): APreset | undefined {
  const raw = settings().installed[id];
  if (!raw) return undefined;
  if (!upgraded.has(raw)) upgraded.set(raw, upgradeArtifact(raw));
  return upgraded.get(raw) ?? undefined;
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
