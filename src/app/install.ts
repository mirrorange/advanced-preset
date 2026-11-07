/**
 * Installing / updating / removing user presets (panel "Presets" tab).
 *
 * Updates: a copy installed from a link updates from that link; one installed from a file (or a
 * preset file AP took over) from the `updateUrl` its artifact declares. AP checks them at startup
 * and installs newer versions by itself. A preset that needs a newer AP makes AP update itself
 * first; the install resumes after the reload.
 */
import { compareVersions, isUpdateUrl, type APreset } from '@advanced-preset/protocol';
import { nativeFetch, st, toast } from '@/st/host';
import { settings, save } from '@/store/settings';
import { builtinPreset, getPreset, getPresetEntry, installPreset, isBuiltin, listPresets, removeInstalled, toArtifact } from '@/store/presets';
import { migratePresetState } from '@/store/config';
import { ensureCarrier, findCarrier } from '@/store/carrier';
import { presetName, t } from '@/i18n';
import { confirmCustomUi, confirmPresetTemplates, confirmQuickReplyAutomation, isTrustDeclined } from './trust';
import { syncBundledModules } from './bundled-modules';
import { updateForPreset } from './updater';

/** Thrown when AP is updating itself to install the preset; the install resumes after the reload. */
export class ApUpdating extends Error {
  constructor(preset: APreset) {
    super(t('presets.apUpdating', { name: presetName(preset) }));
    this.name = 'ApUpdating';
  }
}

export const isApUpdating = (e: unknown): e is ApUpdating => e instanceof ApUpdating;

/** GitHub page URLs → raw file URLs. */
export function rawUrl(url: string): string {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(url.trim());
  return m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}` : url.trim();
}

const PENDING = 'advancedPreset.pendingInstall';

/** Keep the artifact for after the reload (sessionStorage outlives a reload of the tab). */
function stash(artifact: APreset, source?: string): void {
  try {
    sessionStorage.setItem(PENDING, JSON.stringify({ artifact, ...(source ? { source } : {}) }));
  } catch (e) {
    console.warn('[AP] could not keep the preset for after the update', e);
  }
}

export async function installArtifact(raw: unknown, source?: string): Promise<APreset> {
  const data = toArtifact(raw);
  if (!data) throw new Error(t('presets.invalid'));
  if (data.minAdvancedPreset && compareVersions(__AP_VERSION__, data.minAdvancedPreset) < 0) {
    if (await updateForPreset(data.minAdvancedPreset, presetName(data))) {
      stash(data, source);
      throw new ApUpdating(data);
    }
    throw new Error(t('presets.tooNew', { version: data.minAdvancedPreset }));
  }
  // Templates run code: ask unless the code is unchanged from the copy being replaced (I-110).
  await confirmPresetTemplates(data, getPreset(data.id));
  // So do quick replies that run by themselves.
  await confirmQuickReplyAutomation(data, getPreset(data.id));
  installPreset(data);
  if (source) settings().sources[data.id] = source;
  if (settings().declinedUpdates?.[data.id]) delete settings().declinedUpdates![data.id];
  save();
  const effective = getPreset(data.id) ?? data;
  migratePresetState(effective);
  // Custom structure components (I-137): trust and enable, or install with them hidden.
  if (getPresetEntry(effective.id)?.source === 'installed') await confirmCustomUi(effective);
  await ensureCarrier(effective);
  await syncBundledModules(effective);
  return effective;
}

async function fetchArtifact(url: string): Promise<unknown> {
  const r = await nativeFetch(rawUrl(url), { cache: 'no-store' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

/** Install from a link; `remember`: keep the link as the preset's update source. */
export async function installFromUrl(url: string, remember = true): Promise<APreset> {
  return installArtifact(await fetchArtifact(url), remember ? url.trim() : undefined);
}

export async function installFromFile(file: File): Promise<APreset> {
  return installArtifact(JSON.parse(await file.text()));
}

/** Where an installed preset updates from: the link it was installed from, else its `updateUrl`. */
export function updateSource(id: string): { url: string; remembered: boolean } | undefined {
  if (getPresetEntry(id)?.source !== 'installed') return undefined;
  const remembered = settings().sources[id];
  if (remembered) return { url: remembered, remembered: true };
  const declared = getPreset(id)?.updateUrl;
  return isUpdateUrl(declared) ? { url: declared.trim(), remembered: false } : undefined;
}

/** Panel "update": download from the update source and install whatever it holds. */
export async function updateFromSource(id: string): Promise<APreset> {
  const src = updateSource(id);
  if (!src) throw new Error(t('presets.noSource'));
  return installFromUrl(src.url, src.remembered);
}

/**
 * Startup check (after the preset files were taken over): install newer versions from each
 * installed preset's update source. A build the user declined to trust is not asked about again.
 */
export async function checkPresetUpdates(): Promise<void> {
  for (const { preset } of listPresets()) {
    const src = updateSource(preset.id);
    if (!src) continue;
    let data: APreset | null;
    try {
      data = toArtifact(await fetchArtifact(src.url));
    } catch (e) {
      console.warn('[AP] preset update check failed', preset.id, src.url, e);
      continue;
    }
    if (!data || data.id !== preset.id) { console.warn('[AP] the update source does not hold this preset', preset.id, src.url); continue; }
    if (compareVersions(data.version, preset.version) <= 0 || settings().declinedUpdates?.[data.id] === data.hash) continue;
    try {
      const updated = await installArtifact(data, src.remembered ? src.url : undefined);
      toast('success', t('presets.autoUpdated', { version: updated.version }), presetName(updated));
    } catch (e) {
      if (isApUpdating(e)) return;
      if (isTrustDeclined(e)) {
        settings().declinedUpdates = { ...settings().declinedUpdates, [data.id]: data.hash };
        save();
        toast('info', e.message, presetName(data));
      } else console.warn('[AP] preset update failed', preset.id, e);
    }
  }
}

/** An install interrupted by AP updating itself: finish it after the reload. */
export async function resumePendingInstall(): Promise<void> {
  const raw = sessionStorage.getItem(PENDING);
  if (!raw) return;
  sessionStorage.removeItem(PENDING);
  let pending: { artifact?: unknown; source?: string };
  try { pending = JSON.parse(raw); } catch { return; }
  try {
    const preset = await installArtifact(pending.artifact, pending.source);
    toast('success', t('presets.installed'), presetName(preset));
  } catch (e) {
    if (isApUpdating(e)) return;
    if (isTrustDeclined(e)) toast('info', e.message, t('app.name'));
    else toast('error', e instanceof Error ? e.message : String(e), t('app.name'));
  }
}

/**
 * Installed copies of a built-in preset that the shipped built-in has overtaken (the extension
 * updated with a newer version): drop them, so the preset is the built-in again. Before the
 * presets are migrated at startup.
 */
export function dropSupersededCopies(): APreset[] {
  const dropped: APreset[] = [];
  for (const [id, raw] of Object.entries(settings().installed)) {
    const builtin = builtinPreset(id);
    const copy = toArtifact(raw);
    if (!builtin || !copy || compareVersions(builtin.version, copy.version) <= 0) continue;
    removeInstalled(id);
    delete settings().sources[id];
    if (settings().declinedUpdates?.[id]) delete settings().declinedUpdates![id];
    dropped.push(builtin);
  }
  return dropped;
}

export async function removePreset(id: string): Promise<void> {
  removeInstalled(id);
  delete settings().sources[id];
  if (settings().declinedUpdates?.[id]) delete settings().declinedUpdates![id];
  save();
  if (isBuiltin(id)) {
    const p = getPreset(id);
    if (p) { migratePresetState(p); await ensureCarrier(p); await syncBundledModules(p); }
    return;
  }
  const carrier = findCarrier(id);
  if (carrier) await st().getPresetManager('openai')?.deletePreset(carrier);
}
