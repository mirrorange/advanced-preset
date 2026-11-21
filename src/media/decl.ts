/** Whether a preset declares the multimodal features (manifest `image` / `speech`); without them AP shows and requests nothing. */
import type { APreset } from '@advanced-preset/protocol';

type MediaDecls = { image?: unknown; speech?: unknown };

export const declaresImage = (p: APreset | undefined): boolean => Boolean(p && (p as MediaDecls).image);
export const declaresSpeech = (p: APreset | undefined): boolean => Boolean(p && (p as MediaDecls).speech);
export const declaresMedia = (p: APreset | undefined): boolean => declaresImage(p) || declaresSpeech(p);
