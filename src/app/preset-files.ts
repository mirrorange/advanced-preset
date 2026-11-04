/**
 * Preset files among ST's presets (I-171). A preset file (see the protocol's preset-file.ts) imported
 * while AP was not installed — or saved into ST some other way — is an ordinary ST preset that
 * carries an AP preset. AP installs that preset (asking for trust as any install does), replaces the
 * file with the preset's Carrier and selects the Carrier when the file was selected. The install
 * notice and the installer script go with the file.
 *
 * Runs at startup and whenever a preset file gets selected. An artifact this AP cannot read (newer
 * format, or a newer `minAdvancedPreset`) is left alone: the file's installer offers the update.
 */
import { compareVersions, presetFileData, upgradeArtifact } from '@advanced-preset/protocol';
import { st, toast, type PresetManager } from '@/st/host';
import { getPreset } from '@/store/presets';
import { ensureCarrier } from '@/store/carrier';
import { settings, save } from '@/store/settings';
import { refreshActivePreset } from '@/ui/state';
import { presetName, t } from '@/i18n';
import { installArtifact } from './install';
import { isTrustDeclined } from './trust';

type Manager = PresetManager & { getPresetList(): { presets: Record<string, any>[]; preset_names: Record<string, number> } };
const pm = () => st().getPresetManager('openai') as Manager | undefined;

/** ST presets that are preset files: name and carried (raw) artifact. */
export function presetFilesInList(): { name: string; artifact: unknown }[] {
  const list = pm()?.getPresetList();
  if (!list) return [];
  return Object.entries(list.preset_names).flatMap(([name, index]) => {
    const data = presetFileData(list.presets[index]);
    return data ? [{ name, artifact: data.artifact }] : [];
  });
}

async function adopt(name: string, raw: unknown): Promise<void> {
  const data = upgradeArtifact(raw);
  if (!data) { console.warn('[AP] preset file in an unsupported format', name); return; }
  if (data.minAdvancedPreset && compareVersions(__AP_VERSION__, data.minAdvancedPreset) < 0) return;
  // A file whose preset the user declined is not asked about again (until it carries another build).
  const declined = settings().declinedPresetFiles ?? {};
  if (declined[name] === data.hash) return;
  const installed = getPreset(data.id);
  // Install unless the same or a newer version is installed already (never downgrade).
  if (!installed || (installed.hash !== data.hash && compareVersions(data.version, installed.version) >= 0)) {
    try {
      await installArtifact(data);
    } catch (e) {
      if (isTrustDeclined(e)) {
        settings().declinedPresetFiles = { ...declined, [name]: data.hash };
        save();
        toast('info', e.message, presetName(data));
      } else toast('error', e instanceof Error ? e.message : String(e), name);
      return;
    }
  }
  const preset = getPreset(data.id);
  const m = pm();
  if (!preset || !m) return;
  const selected = m.getSelectedPresetName() === name;
  const carrier = await ensureCarrier(preset, { select: selected });
  // The Carrier replaces the file (a file named like the Carrier was overwritten in place).
  if (carrier !== name) await m.deletePreset(name);
  if (declined[name]) {
    const { [name]: _, ...rest } = declined;
    settings().declinedPresetFiles = rest;
    save();
  }
  refreshActivePreset();
  toast('success', t('presetFile.adopted', { file: name, carrier }), presetName(preset));
}

let queue: Promise<void> = Promise.resolve();

/** Take over the preset files in ST's list (`only`: just the one with this name). One run at a time. */
export function adoptPresetFiles(only?: string): Promise<void> {
  queue = queue.then(async () => {
    for (const { name, artifact } of presetFilesInList()) {
      if (only !== undefined && name !== only) continue;
      try { await adopt(name, artifact); } catch (e) { console.error('[AP] preset file adoption failed', name, e); }
    }
  });
  return queue;
}

/** A preset file was selected (ST's preset dropdown, `/preset`, another extension): take it over. */
export function onPresetChanged(): void {
  const name = pm()?.getSelectedPresetName();
  if (name && presetFilesInList().some((f) => f.name === name)) void adoptPresetFiles(name);
}
