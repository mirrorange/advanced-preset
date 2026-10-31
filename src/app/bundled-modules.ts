/**
 * Bundled user modules in the UI: installing them with a preset (asking which copy to keep when the
 * preset's version differs from the user's) and choosing which of the user's modules to bundle when
 * exporting a preset.
 */
import type { APreset, UserModule } from '@advanced-preset/protocol';
import { confirmPopup, toast } from '@/st/host';
import { presetState } from '@/store/config';
import { getPreset } from '@/store/presets';
import { applyBundledSync, planBundledSync, planIsEmpty, presetWithUserModules, type BundledConflict } from '@/store/bundled-modules';
import { userModules } from '@/store/user-modules';
import { downloadJson, fileSlug } from '@/ui/download';
import { locale, presetName, t } from '@/i18n';

/** Popup body: a heading, a paragraph and one checkbox per item; returns the element and the boxes. */
function checklist(title: string, body: string, items: { id: string; label: string; note?: string; checked: boolean }[]) {
  const root = document.createElement('div');
  root.style.textAlign = 'start';
  const h = document.createElement('h3');
  h.textContent = title;
  const p = document.createElement('p');
  p.textContent = body;
  const list = document.createElement('div');
  list.style.cssText = 'display:flex;flex-direction:column;gap:0.4em;max-height:50vh;overflow:auto';
  const boxes = new Map<string, HTMLInputElement>();
  for (const item of items) {
    const label = document.createElement('label');
    label.className = 'checkbox_label';
    label.dataset.apItem = item.id;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = item.checked;
    const name = document.createElement('span');
    name.textContent = item.label;
    label.append(box, name);
    if (item.note) {
      const note = document.createElement('small');
      note.className = 'text_muted';
      note.textContent = item.note;
      label.append(' ', note);
    }
    boxes.set(item.id, box);
    list.append(label);
  }
  root.append(h, p, list);
  return { root, checked: () => [...boxes].filter(([, b]) => b.checked).map(([id]) => id) };
}

/** Ask which conflicts take the preset's version. Cancel keeps every copy of the user's. */
async function chooseIncoming(preset: APreset, conflicts: BundledConflict[]): Promise<string[]> {
  const { root, checked } = checklist(
    t('um.bundled.conflictTitle'),
    t('um.bundled.conflictBody', { name: presetName(preset) }),
    conflicts.map((c) => ({
      id: c.id,
      label: c.installed.name || c.incoming.name || c.id,
      note: t(c.modified ? 'um.bundled.modified' : 'um.bundled.unmodified'),
      checked: !c.modified,
    })),
  );
  return (await confirmPopup(root, t('um.bundled.apply'), t('um.bundled.keepAll'))) ? checked() : [];
}

export interface SyncOptions {
  /**
   * Take the preset's version without asking when the user never changed their copy (`ap dev`:
   * the source files are the author's own). Copies the user edited are still asked about.
   */
  auto?: boolean;
}

async function sync(preset: APreset, o: SyncOptions): Promise<void> {
  const state = presetState(preset);
  const plan = planBundledSync(preset, userModules(preset), state.bundledModules, locale());
  if (planIsEmpty(plan, state.bundledModules)) return;
  const take = o.auto ? plan.conflicts.filter((c) => !c.modified).map((c) => c.id) : [];
  const ask = plan.conflicts.filter((c) => !take.includes(c.id));
  if (ask.length) take.push(...(await chooseIncoming(preset, ask)));
  applyBundledSync(preset, plan, take);
  if (plan.add.length) {
    toast('info', t('um.bundled.added', { n: plan.add.length, names: plan.add.map((m) => m.name).join(', ') }), presetName(preset));
  }
}

const queues = new Map<string, Promise<void>>();

/**
 * Install the preset's bundled user modules into the user's list (after `migratePresetState`).
 * Runs one at a time per preset; a run queued behind an open dialog uses the latest artifact.
 */
export function syncBundledModules(preset: APreset, o: SyncOptions = {}): Promise<void> {
  const id = preset.id;
  const run = (queues.get(id) ?? Promise.resolve()).then(() => sync(getPreset(id) ?? preset, o)).catch((e) => console.error('[AP] bundled module sync failed', id, e));
  queues.set(id, run);
  return run;
}

/**
 * Download the preset with the user's chosen modules bundled. Without user modules the artifact is
 * saved as it is; `false` when the user cancels the choice.
 */
export async function exportPreset(preset: APreset): Promise<boolean> {
  const list = userModules(preset);
  let chosen: UserModule[] = [];
  if (list.length) {
    const { root, checked } = checklist(
      t('um.bundled.exportTitle', { name: presetName(preset) }),
      t('um.bundled.exportBody'),
      list.map((m) => ({ id: m.id, label: m.name || t('um.untitled'), ...(m.enabled ? {} : { note: t('um.bundled.disabled') }), checked: true })),
    );
    if (!(await confirmPopup(root, t('um.bundled.export'), t('common.cancel')))) return false;
    const ids = checked();
    chosen = list.filter((m) => ids.includes(m.id));
  }
  downloadJson(`${fileSlug(preset.id)}.apreset.json`, presetWithUserModules(preset, chosen, locale()));
  return true;
}
