/** Installing / updating / removing user presets (panel "Presets" tab). */
import { compareVersions, type APreset } from '@advanced-preset/protocol';
import { nativeFetch, st } from '@/st/host';
import { settings, save } from '@/store/settings';
import { getPreset, installPreset, isBuiltin, removeInstalled, toArtifact } from '@/store/presets';
import { migratePresetState } from '@/store/config';
import { ensureCarrier, findCarrier } from '@/store/carrier';
import { t } from '@/i18n';
import { confirmPresetTemplates } from './trust';

/** GitHub page URLs → raw file URLs. */
export function rawUrl(url: string): string {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(url.trim());
  return m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}` : url.trim();
}

export async function installArtifact(raw: unknown, source?: string): Promise<APreset> {
  const data = toArtifact(raw);
  if (!data) throw new Error(t('presets.invalid'));
  if (data.minAdvancedPreset && compareVersions(__AP_VERSION__, data.minAdvancedPreset) < 0) {
    throw new Error(t('presets.tooNew', { version: data.minAdvancedPreset }));
  }
  // Templates run code: ask unless the code is unchanged from the copy being replaced (I-110).
  await confirmPresetTemplates(data, getPreset(data.id));
  installPreset(data);
  if (source) settings().sources[data.id] = source;
  save();
  const effective = getPreset(data.id) ?? data;
  migratePresetState(effective);
  await ensureCarrier(effective);
  return effective;
}

export async function installFromUrl(url: string): Promise<APreset> {
  const r = await nativeFetch(rawUrl(url), { cache: 'no-store' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return installArtifact(await r.json(), url.trim());
}

export async function installFromFile(file: File): Promise<APreset> {
  return installArtifact(JSON.parse(await file.text()));
}

export async function removePreset(id: string): Promise<void> {
  removeInstalled(id);
  delete settings().sources[id];
  save();
  if (isBuiltin(id)) {
    const p = getPreset(id);
    if (p) { migratePresetState(p); await ensureCarrier(p); }
    return;
  }
  const carrier = findCarrier(id);
  if (carrier) await st().getPresetManager('openai')?.deletePreset(carrier);
}
