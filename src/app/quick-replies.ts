/**
 * Quick Reply sets of the active preset. While a preset's Carrier is selected (and AP is enabled),
 * its sets are written into ST's Quick Reply extension and the `global` ones are added to the global
 * set list; with any other preset they leave the list (the sets themselves stay, so other set lists
 * that use them keep working). Sets of presets that no longer declare them are deleted.
 *
 * AP owns the sets it created (`settings.quickReplies`): a set of the same name made by the user is
 * never overwritten. A set is rewritten only when what AP would write changes (preset update,
 * identity names, UI language), so edits made in ST's editor last until then, like Carrier edits.
 */
import { computed, watch } from 'vue';
import { actorName, cloneData, stQuickReplySet, type APreset, type QuickReplySetDecl, type StQuickReplySet } from '@advanced-preset/protocol';
import { quickReplyApi, toast, type QuickReplyApi } from '@/st/host';
import { settings, save } from '@/store/settings';
import { listPresets } from '@/store/presets';
import { activeConfiguration } from '@/store/config';
import { activePreset } from '@/ui/state';
import { presetLocale, t } from '@/i18n';

export interface DesiredSet { decl: QuickReplySetDecl; st: StQuickReplySet }

/** What AP writes for a preset's sets in the current configuration and UI language. */
export function desiredSets(preset: APreset): DesiredSet[] {
  const config = activeConfiguration(preset);
  const name = (a: string) => (preset.actors[a] ? actorName(preset, config, a) : undefined);
  const locale = presetLocale(preset)?.quickReplySets;
  return (preset.quickReplySets ?? []).map((decl) => ({ decl, st: stQuickReplySet(decl, name, locale?.[decl.id]) }));
}

function fingerprint(v: unknown): string {
  const s = JSON.stringify(v);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  return h.toString(16);
}

/** Replace the contents of an existing set with `data`. */
function fill(api: QuickReplyApi, data: StQuickReplySet): void {
  const set = api.getSetByName(data.name);
  if (!set) return;
  set.disableSend = data.disableSend;
  set.placeBeforeInput = data.placeBeforeInput;
  set.injectInput = data.injectInput;
  set.color = data.color;
  set.onlyBorderColor = data.onlyBorderColor;
  for (const qr of set.qrList) { qr.unrender?.(); qr.unrenderSettings?.(); }
  set.qrList.splice(0);
  for (const qr of data.qrList) set.addQuickReply(cloneData(qr) as unknown as Record<string, unknown>);
  set.updateColor?.();
  set.rerender?.();
  void set.save();
}

const warned = new Set<string>();

/**
 * Bring ST's sets in line with `active` (the active preset, or `null`). `known`: every available
 * preset, to tell sets of a preset that dropped them from sets of an inactive preset.
 */
export async function syncQuickReplies(api: QuickReplyApi, active: { presetId: string; sets: DesiredSet[] } | null, known: APreset[]): Promise<void> {
  const owned = (settings().quickReplies ??= {});
  const inGlobal = (name: string) => api.listGlobalSets().includes(name);
  const removeGlobal = (name: string) => { try { if (inGlobal(name)) api.removeGlobalSet(name); } catch { /* set is gone */ } };
  let changed = false;

  // Sets their preset no longer declares (or whose preset is gone).
  for (const [name, rec] of Object.entries(owned)) {
    const preset = known.find((p) => p.id === rec.presetId);
    if (preset?.quickReplySets?.some((s) => s.name === name)) continue;
    if (api.getSetByName(name)) {
      removeGlobal(name);
      try { await api.deleteSet(name); } catch (e) { console.warn('[AP] could not delete Quick Reply set', name, e); }
    }
    delete owned[name];
    changed = true;
  }
  // Sets of other presets leave the global list.
  for (const [name, rec] of Object.entries(owned)) if (rec.presetId !== active?.presetId) removeGlobal(name);

  if (active) {
    // A set of the same name that AP did not create is the user's.
    const mine = active.sets.filter(({ st }) => {
      if (!api.getSetByName(st.name) || owned[st.name]) return true;
      if (!warned.has(st.name)) { warned.add(st.name); toast('warning', t('quickReplies.conflict', { name: st.name }), t('app.name')); }
      return false;
    });
    // Create every set before filling any, so that context menus between them resolve.
    const fresh = new Set<string>();
    for (const { st } of mine) {
      if (api.getSetByName(st.name)) continue;
      await api.createSet(st.name, { disableSend: st.disableSend, placeBeforeInput: st.placeBeforeInput, injectInput: st.injectInput });
      fresh.add(st.name);
    }
    for (const { st } of mine) {
      const hash = fingerprint(st);
      if (fresh.has(st.name) || owned[st.name]?.hash !== hash) {
        fill(api, st);
        owned[st.name] = { presetId: active.presetId, hash };
        changed = true;
      }
    }
    for (const { decl, st } of mine) if (decl.global && !inGlobal(st.name)) api.addGlobalSet(st.name, decl.visible);
  }
  if (changed) save();
}

/** Keep ST's Quick Reply sets in line with the active preset (call once ST is ready). */
export function installQuickReplies(): void {
  const target = computed(() => {
    const preset = settings().enabled ? activePreset.value : undefined;
    const sets = preset ? desiredSets(preset) : [];
    const known = listPresets().map((e) => e.preset);
    return {
      active: preset ? { presetId: preset.id, sets } : null,
      known,
      key: JSON.stringify([preset?.id ?? null, sets.map((s) => s.st), known.map((p) => [p.id, (p.quickReplySets ?? []).map((s) => s.name)])]),
    };
  });
  let queue = Promise.resolve();
  const run = () => {
    const api = quickReplyApi();
    if (!api) return;
    const { active, known } = target.value;
    queue = queue.then(() => syncQuickReplies(api, active, known)).catch((e) => console.error('[AP] Quick Reply sync failed', e));
  };
  watch(() => target.value.key, run, { immediate: true });
}
