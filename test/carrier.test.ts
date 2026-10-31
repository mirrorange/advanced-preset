import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, resolveConfiguration } from '@advanced-preset/protocol';
import { petals } from './helpers';

const state: Record<string, unknown> = {};
vi.mock('@/store/config', () => ({ presetState: () => state, activeConfiguration: (p: any) => resolveConfiguration(p, 'other', {}), updateConfiguration: () => {} }));
vi.mock('@/store/settings', () => ({ save: () => {} }));
const { ensureCarrier, buildCarrier, carrierName } = await import('@/store/carrier');

/** A minimal ST preset manager: `savePreset` without `skipUpdate` applies the preset like ST's `updateList`. */
function manager(selected: string) {
  const presets: Record<string, any>[] = [];
  const preset_names: Record<string, number> = {};
  const saves: { name: string; applied: boolean }[] = [];
  let applied: Record<string, any> | null = null;
  const m = {
    getPresetList: () => ({ presets, preset_names }),
    getCompletionPresetByName: (n: string) => presets[preset_names[n]!],
    getSelectedPresetName: () => selected,
    findPreset: (n: string) => preset_names[n],
    selectPreset: async () => {},
    savePreset: async (name: string, body: any, o: { skipUpdate?: boolean } = {}) => {
      saves.push({ name, applied: !o.skipUpdate });
      if (preset_names[name] === undefined) { presets.push(body); preset_names[name] = presets.length - 1; } else presets[preset_names[name]!] = body;
      if (!o.skipUpdate) { applied = body; selected = name; }
    },
  };
  return { m, saves, applied: () => applied };
}

let pm: ReturnType<typeof manager>;
beforeEach(() => { for (const k of Object.keys(state)) delete state[k]; (globalThis as any).SillyTavern = { getContext: () => ({ getPresetManager: () => pm.m, chatCompletionSettings: {} }) }; });
afterEach(() => { delete (globalThis as any).SillyTavern; });

describe('Carrier rebuild', () => {
  const old = () => {
    const p = cloneData(petals);
    p.hash = 'old';
    p.carrier.prompts = p.carrier.prompts.filter((x) => x.identifier !== 'ap_input');
    p.carrier.prompt_order = p.carrier.prompt_order.filter((x) => x.identifier !== 'ap_input');
    return buildCarrier(p, resolveConfiguration(p, 'other', {}));
  };

  it('re-applies a Carrier that is in use, so new region anchors reach ST', async () => {
    pm = manager(carrierName(petals));
    await pm.m.savePreset(carrierName(petals), old(), { skipUpdate: true });
    await ensureCarrier(petals);
    expect(pm.saves.at(-1)).toEqual({ name: carrierName(petals), applied: true });
    expect((pm.applied()!.prompts as any[]).some((x) => x.identifier === 'ap_input')).toBe(true);
  });

  it('only saves a Carrier that is not in use', async () => {
    pm = manager('Default');
    await pm.m.savePreset(carrierName(petals), old(), { skipUpdate: true });
    await ensureCarrier(petals);
    expect(pm.saves.at(-1)).toEqual({ name: carrierName(petals), applied: false });
    expect(pm.applied()).toBeNull();
  });

  it('leaves an up-to-date Carrier alone', async () => {
    pm = manager(carrierName(petals));
    await pm.m.savePreset(carrierName(petals), buildCarrier(petals, resolveConfiguration(petals, 'other', {})), { skipUpdate: true });
    await ensureCarrier(petals);
    expect(pm.saves).toHaveLength(1);
  });
});
