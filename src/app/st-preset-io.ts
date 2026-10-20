/**
 * ST's Chat Completion preset import / export buttons (I-70). Import: AP artifacts are installed as
 * AP presets, selected and the panel opened; any other file goes on to ST unchanged. Export: while
 * a Carrier is selected the AP artifact is saved instead of the Carrier.
 *
 * ST binds both through jQuery on the elements themselves, so capture-phase listeners on `window`
 * run first. The import decision needs the file's contents, so the event is held and re-dispatched
 * to ST when the file is not an artifact.
 */
import { toast } from '@/st/host';
import { getPreset } from '@/store/presets';
import { activatePreset, activeCarrierPresetId } from '@/store/carrier';
import { installArtifact } from './install';
import { downloadJson, fileSlug } from '@/ui/download';
import { openPanel, refreshActivePreset } from '@/ui/state';
import { presetName, t } from '@/i18n';

const IMPORT_INPUT = 'openai_preset_import_file';
const EXPORT_BUTTON = 'export_oai_preset';

/** Same shape check as the artifact loader, without the format version: old artifacts are reported, not handed to ST. */
export function looksLikeArtifact(raw: unknown): boolean {
  return typeof raw === 'object' && raw !== null && typeof (raw as { id?: unknown }).id === 'string' && Array.isArray((raw as { entries?: unknown }).entries);
}

const forwarded = new WeakSet<Event>();

async function onImport(input: HTMLInputElement, file: File): Promise<void> {
  let raw: unknown;
  try { raw = JSON.parse(await file.text()); } catch { raw = undefined; }
  if (!looksLikeArtifact(raw)) {
    const e = new Event('input', { bubbles: true });
    forwarded.add(e);
    input.dispatchEvent(e);
    return;
  }
  input.value = '';
  try {
    const preset = await installArtifact(raw);
    await activatePreset(preset);
    refreshActivePreset();
    toast('success', t('presets.installed'), presetName(preset));
    openPanel('presets');
  } catch (e) {
    toast('error', e instanceof Error ? e.message : String(e), t('app.name'));
  }
}

export function exportActivePreset(): boolean {
  const id = activeCarrierPresetId();
  const preset = id ? getPreset(id) : undefined;
  if (!preset) return false;
  downloadJson(`${fileSlug(preset.id)}.apreset.json`, preset);
  return true;
}

export function installPresetIo(): void {
  window.addEventListener('input', (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement) || input.id !== IMPORT_INPUT || forwarded.has(e)) return;
    const file = input.files?.[0];
    if (!file) return;
    e.stopImmediatePropagation();
    void onImport(input, file);
  }, true);

  window.addEventListener('click', (e) => {
    if (!(e.target instanceof Element) || !e.target.closest(`#${EXPORT_BUTTON}`)) return;
    if (!exportActivePreset()) return;
    e.stopImmediatePropagation();
    e.preventDefault();
  }, true);
}
