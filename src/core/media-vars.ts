/**
 * Runtime values of the media features for the engine (`image.*` / `speech.*` variables, macro data,
 * the speech tag cleaner). The settings layer provides them (image: T2, speech: T3); without a
 * provider everything is off. The engine ANDs `on` with the preset's declaration.
 */
import { IMAGE_OFF, SPEECH_OFF, type APreset, type ImageRef, type ImageVars, type SpeechCleaner, type SpeechVars } from '@advanced-preset/protocol';

export interface ImageRuntime {
  vars: ImageVars;
  /** Reference images of the selected connection (`{{ap::image::refs}}`). */
  refs: ImageRef[];
}

export interface SpeechRuntime {
  vars: SpeechVars;
  /** Format notes of the selected API (`{{ap::speech::format}}`). */
  format: string;
  /** Characters with a bound voice on the selected connection (`{{ap::speech::characters}}`). */
  characters: string[];
  /** Provider tags removed from displayed lines (kept for synthesis); default: `<tag>` and `[tag]`. */
  cleaner?: SpeechCleaner;
}

export interface MediaRuntime {
  image(): ImageRuntime;
  speech(): SpeechRuntime;
}

const OFF: MediaRuntime = {
  image: () => ({ vars: { ...IMAGE_OFF }, refs: [] }),
  speech: () => ({ vars: { ...SPEECH_OFF }, format: '', characters: [] }),
};

let provided: Partial<MediaRuntime> = {};

/** Register the image and / or speech side (later calls replace the parts they pass). */
export function provideMedia(part: Partial<MediaRuntime>): void {
  provided = { ...provided, ...part };
}

/** Current providers; missing parts are off. */
export function mediaRuntime(): MediaRuntime {
  return { image: provided.image ?? OFF.image, speech: provided.speech ?? OFF.speech };
}

/** Tests: forget the providers. */
export function resetMedia(): void {
  provided = {};
}

const safe = <T>(f: () => T, fallback: () => T, what: string): T => {
  try { return f(); } catch (e) { console.error(`[AP] ${what} runtime failed`, e); return fallback(); }
};

/** Image values for a generation with `preset` (off unless the preset declares `image`). */
export function imageRuntime(preset: Pick<APreset, 'image'>): ImageRuntime {
  if (!preset.image) return OFF.image();
  const r = safe(() => mediaRuntime().image(), OFF.image, 'image');
  if (!r.vars.on) return { vars: { ...IMAGE_OFF }, refs: [] };
  const refs = r.vars.api === 'novelai' ? [] : r.refs;
  return { vars: { ...r.vars, refs: refs.length > 0 }, refs };
}

/** Speech values for a generation with `preset` (off unless the preset declares `speech`). */
export function speechRuntime(preset: Pick<APreset, 'speech'>): SpeechRuntime {
  if (!preset.speech) return OFF.speech();
  const r = safe(() => mediaRuntime().speech(), OFF.speech, 'speech');
  if (!r.vars.on) return { vars: { ...SPEECH_OFF }, format: '', characters: [] };
  const characters = [...new Set(r.characters.map((c) => c.trim()).filter(Boolean))];
  return { ...r, characters, vars: { ...r.vars, characters: characters.length > 0 } };
}
