/**
 * Multimodal settings (`extension_settings.advancedPreset.media`): CORS proxy, image generation and
 * speech synthesis connections. Global, not per preset; binaries live in IndexedDB (`media-db.ts`).
 */
import type { ImageApi, SpeechApi } from '@advanced-preset/protocol';
import type { SpeechConnection, VoiceBinding, VoiceRef } from '@/media/speech/types';
import { settings, save } from './settings';

export { IMAGE_APIS, SPEECH_APIS, type ImageApi, type SpeechApi } from '@advanced-preset/protocol';
export type { SpeechConnection, VoiceBinding, VoiceRef };

export type CorsMode = 'auto' | 'on' | 'off';
export interface CorsSettings { mode: CorsMode; proxy: 'host' | 'custom'; customUrl: string }

export interface ConnectionBase {
  id: string;
  name: string;
  api: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  /** Advanced: extra / overriding request headers. */
  headers: Record<string, string>;
  /** Advanced: JSON object deep-merged into the request body ('' for none). */
  body: string;
}

/** A reference image of a connection (`blob`: IndexedDB key). */
export interface StoredRef { id: string; description: string; blob: string }

export interface ImageConnection extends ConnectionBase {
  api: ImageApi;
  /** Style prompt AP appends to every request (never given to the preset). */
  style: string;
  /** NovelAI negative prompt. */
  negative?: string;
  nsfwBlock: boolean;
  /** Reference images (openai / gemini). */
  refs: StoredRef[];
  /** Gemini only: request shape (default `interactions`). */
  endpoint?: 'interactions' | 'generateContent';
}

export interface MediaSettings {
  cors: CorsSettings;
  image: { enabled: boolean; auto: boolean; active: string | null; connections: ImageConnection[] };
  speech: { enabled: boolean; auto: boolean; narrator: boolean; active: string | null; connections: SpeechConnection[] };
}

/** Default endpoint and model per image API. */
export const IMAGE_DEFAULTS: Record<ImageApi, { baseUrl: string; model: string; nsfwBlock: boolean }> = {
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-image-2.6-flare', nsfwBlock: true },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-nano-banana-2.1', nsfwBlock: true },
  novelai: { baseUrl: 'https://image.novelai.net', model: 'nai-diffusion-4-5-full', nsfwBlock: false },
};

/** Reference images are only sent to these APIs. */
export const supportsRefs = (api: ImageApi): boolean => api === 'openai' || api === 'gemini';

const defaults = (): MediaSettings => ({
  cors: { mode: 'auto', proxy: 'host', customUrl: '' },
  image: { enabled: false, auto: true, active: null, connections: [] },
  speech: { enabled: false, auto: false, narrator: false, active: null, connections: [] },
});

/** The media settings, with missing parts filled in (reactive, like `settings()`). */
export function mediaSettings(): MediaSettings {
  const s = settings() as { media?: MediaSettings };
  const d = defaults();
  if (!s.media || typeof s.media !== 'object') s.media = d;
  const m = s.media as unknown as Record<string, Record<string, unknown>>;
  // Only fill in what is missing: this runs inside computed properties, and replacing the sections
  // with fresh objects on every read would invalidate them again (an endless render loop).
  for (const [k, section] of Object.entries(d) as [string, Record<string, unknown>][]) {
    const cur = m[k];
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) { m[k] = section; continue; }
    for (const [kk, v] of Object.entries(section)) if (!(kk in cur)) cur[kk] = v;
  }
  return s.media;
}

export const saveMedia = save;

export const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

export function newImageConnection(api: ImageApi, name: string): ImageConnection {
  const d = IMAGE_DEFAULTS[api];
  return { id: newId(), name, api, baseUrl: d.baseUrl, apiKey: '', model: d.model, headers: {}, body: '', style: '', negative: '', nsfwBlock: d.nsfwBlock, refs: [] };
}

/**
 * Switch a connection to another API: endpoint, model and NSFW default follow the API unless the
 * user changed them from the previous API's defaults.
 */
export function changeImageApi(c: ImageConnection, api: ImageApi): void {
  if (c.api === api) return;
  const from = IMAGE_DEFAULTS[c.api];
  const to = IMAGE_DEFAULTS[api];
  if (!c.baseUrl || c.baseUrl === from.baseUrl) c.baseUrl = to.baseUrl;
  if (!c.model || c.model === from.model) c.model = to.model;
  if (c.nsfwBlock === from.nsfwBlock) c.nsfwBlock = to.nsfwBlock;
  c.api = api;
}

/** The selected connection of a section (falls back to the first one). */
export function activeConnection<C extends ConnectionBase>(section: { active: string | null; connections: C[] }): C | undefined {
  return section.connections.find((c) => c.id === section.active) ?? section.connections[0];
}

/** A copy of a connection under a new id (binary keys are shared, not duplicated). */
export function copyConnection<C extends ConnectionBase>(c: C, name: string): C {
  return { ...JSON.parse(JSON.stringify(c)), id: newId(), name } as C;
}
