/**
 * CarrierManager (§8, D7): one ST Chat Completion preset per AP preset (`AP · <name>`).
 * Selecting a Carrier activates its AP preset; manual edits stay in the Carrier until the AP preset
 * is reinstalled or updated. Sampling is synced both ways with the configuration layer (§7.4).
 */
import type { APreset, Configuration } from '@advanced-preset/protocol';
import { st, toast, type PresetManager } from '@/st/host';
import { presetState, activeConfiguration, updateConfiguration } from './config';
import { save } from './settings';
import { t } from '@/i18n';

export const CARRIER_EXT = 'advanced_preset';
export interface CarrierMeta { presetId: string; version: string; hash: string }

/** Preset keys whose `oai_settings` name differs (ST `settingsToUpdate`). */
const SETTING_ALIASES: Record<string, string> = {
  temperature: 'temp_openai',
  frequency_penalty: 'freq_pen_openai',
  presence_penalty: 'pres_pen_openai',
  top_p: 'top_p_openai',
  top_k: 'top_k_openai',
  top_a: 'top_a_openai',
  min_p: 'min_p_openai',
  repetition_penalty: 'repetition_penalty_openai',
};
const settingKey = (k: string) => SETTING_ALIASES[k] ?? k;

const pm = (): PresetManager & { getPresetList(): { presets: Record<string, any>[]; preset_names: Record<string, number> } } =>
  st().getPresetManager('openai') as never;

export const carrierName = (preset: APreset) => `AP · ${preset.name}`;

/** AP preset id of the currently applied ST preset, if it is a Carrier. */
export function activeCarrierPresetId(): string | null {
  const ext = st().chatCompletionSettings?.extensions?.[CARRIER_EXT] as CarrierMeta | undefined;
  return ext?.presetId ?? null;
}

function stablePromptsHash(obj: { prompts?: unknown; prompt_order?: unknown }): string {
  const s = JSON.stringify([obj.prompts ?? null, obj.prompt_order ?? null]);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  return h.toString(16);
}

export function buildCarrier(preset: APreset, config: Configuration): Record<string, unknown> {
  const order = preset.carrier.prompt_order.map((o) => ({ ...o }));
  return {
    ...structuredClone(config.sampling),
    prompts: structuredClone(preset.carrier.prompts),
    prompt_order: [100000, 100001].map((character_id) => ({ character_id, order: structuredClone(order) })),
    extensions: { [CARRIER_EXT]: { presetId: preset.id, version: preset.version, hash: preset.hash } satisfies CarrierMeta },
  };
}

/** Name of an existing Carrier for this preset (by metadata, so renamed presets are still found). */
export function findCarrier(presetId: string): string | null {
  const m = pm();
  if (!m) return null;
  const { presets, preset_names } = m.getPresetList();
  for (const [name, index] of Object.entries(preset_names)) {
    if ((presets[index]?.extensions?.[CARRIER_EXT] as CarrierMeta | undefined)?.presetId === presetId) return name;
  }
  return null;
}

/** Write a Carrier object to disk and to ST's in-memory preset list. `select` applies it. */
async function writeCarrier(name: string, body: Record<string, unknown>, select: boolean): Promise<void> {
  const m = pm();
  if (select) { await m.savePreset(name, body); return; }
  await m.savePreset(name, body, { skipUpdate: true });
  const { presets, preset_names } = m.getPresetList();
  if (preset_names[name] !== undefined) presets[preset_names[name]!] = body;
}

/**
 * Make sure the Carrier exists and matches the preset version. Rebuilds (resetting manual edits,
 * with a notice) when the artifact changed or `force` is set.
 */
export async function ensureCarrier(preset: APreset, opts: { select?: boolean; force?: boolean } = {}): Promise<string> {
  const m = pm();
  const s = presetState(preset);
  const existing = findCarrier(preset.id);
  const name = existing ?? carrierName(preset);
  const current = existing ? m.getCompletionPresetByName(existing) : undefined;
  const meta = current?.extensions?.[CARRIER_EXT] as CarrierMeta | undefined;
  const stale = !current || opts.force || meta?.hash !== preset.hash;
  if (stale) {
    if (current && s.carrierHash && stablePromptsHash(current) !== s.carrierHash) toast('info', t('carrier.reset', { name }));
    const body = buildCarrier(preset, activeConfiguration(preset));
    // Keep the user's connection-bound fields if any were stored in the Carrier.
    if (current) for (const k of ['chat_completion_source', 'reverse_proxy', 'proxy_password']) if (current[k] !== undefined) body[k] = current[k];
    s.carrierHash = stablePromptsHash(body);
    save();
    await writeCarrier(name, body, Boolean(opts.select));
  } else if (opts.select && m.getSelectedPresetName() !== name) {
    const value = m.findPreset(name);
    if (value !== undefined) await m.selectPreset(value);
  }
  return name;
}

export async function activatePreset(preset: APreset): Promise<void> {
  await ensureCarrier(preset, { select: true });
}

/** Config → Carrier: write sampling into the Carrier (and apply it when it is selected). */
export async function pushSampling(preset: APreset): Promise<void> {
  const name = findCarrier(preset.id);
  if (!name) return;
  const m = pm();
  const current = m.getCompletionPresetByName(name);
  if (!current) return;
  const body = { ...current, ...structuredClone(activeConfiguration(preset).sampling) };
  const selected = m.getSelectedPresetName() === name;
  syncing = true;
  try { await writeCarrier(name, body, selected); } finally { syncing = false; }
}

let syncing = false;

/** Carrier → config: copy changed sampling fields of the live ST settings into the active diff. */
export function pullSampling(preset: APreset): boolean {
  if (syncing || activeCarrierPresetId() !== preset.id) return false;
  const live = st().chatCompletionSettings;
  const config = activeConfiguration(preset);
  const changed: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(config.sampling)) {
    const lv = live[settingKey(k)];
    if (lv !== undefined && JSON.stringify(lv) !== JSON.stringify(v)) changed[k] = structuredClone(lv);
  }
  if (!Object.keys(changed).length) return false;
  updateConfiguration(preset, (c) => Object.assign(c.sampling, changed));
  return true;
}
