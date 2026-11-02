/**
 * Custom structure components (I-137): shown only when the user enabled the preset's custom UI for
 * its current code. Built-in presets and the `ap dev` source are trusted (enabled unless turned off).
 */
import { structureUiHash, type APreset } from '@advanced-preset/protocol';
import { save, settings } from './settings';
import { getPresetEntry } from './presets';
import { presetState } from './config';

export function customUiEnabled(preset: APreset): boolean {
  const hash = structureUiHash(preset);
  if (!hash) return false;
  const s = settings().presets[preset.id]?.customUi;
  const source = getPresetEntry(preset.id)?.source;
  if (source === 'builtin' || source === 'dev') return s && s.hash === hash ? s.enabled : true;
  return Boolean(s?.enabled && s.hash === hash);
}

/** Whether the user already decided about this exact code (install prompts skip it). */
export function customUiDecided(preset: APreset): boolean {
  const s = settings().presets[preset.id]?.customUi;
  return Boolean(s && s.hash === structureUiHash(preset));
}

export function setCustomUi(preset: APreset, enabled: boolean): void {
  presetState(preset).customUi = { enabled, hash: structureUiHash(preset) };
  save();
}
