/**
 * Speech synthesis provider contract (design §4, §6). Every provider turns one line of text and one
 * voice into a stream of 16-bit signed little-endian mono PCM, so playback, caching and WAV export
 * are shared. Providers never touch settings or storage directly: they get a `SpeechEnv`.
 */

import type { SpeechApi } from '@advanced-preset/protocol';

export type { SpeechApi };

export type VoiceRef =
  /** Built-in speaker, voice library id or provider-side voice / reference id. */
  | { kind: 'voice'; id: string; name?: string }
  /**
   * User reference audio (IndexedDB key) and its transcript. `consent` is a second recording some
   * providers require (Gemini). `id` caches the provider-side clone id once created.
   */
  | { kind: 'clone'; audio: string; text?: string; consent?: string; id?: string; name?: string };

export interface SpeechConnection {
  id: string;
  name: string;
  api: SpeechApi;
  baseUrl: string;
  apiKey: string;
  model: string;
  /** Advanced: extra / overriding request headers. */
  headers: Record<string, string>;
  /** Advanced: JSON object deep-merged into the request body. */
  body: string;
  /** Voice of unbound characters (and of narration when no narrator voice is set). */
  voice: VoiceRef | null;
  narrator: VoiceRef | null;
  /** Story character → voice (`null`: the default voice). */
  bindings: { character: string; voice: VoiceRef | null }[];
}

/** A voice the user can pick (built-in list or library search result). */
export interface VoiceOption {
  id: string;
  name: string;
  description?: string;
  /** Sample audio URL, when the provider has one. */
  preview?: string;
  /** Library voice owner, for providers that add library voices to the account (`adopt`). */
  owner?: string;
}

/** What a provider may use: network (CORS-aware) and stored reference audio. */
export interface SpeechEnv {
  fetch(url: string, init: RequestInit): Promise<Response>;
  blob(key: string): Promise<Blob | undefined>;
}

export interface SynthesisRequest {
  conn: SpeechConnection;
  /** Text to speak, provider inline tags included. */
  text: string;
  /** `null`: the provider's default voice. A clone has its `id` resolved when the provider needs one. */
  voice: VoiceRef | null;
  signal?: AbortSignal;
}

export interface PcmStream {
  sampleRate: number;
  /** PCM16LE mono bytes; chunk boundaries are arbitrary (may split a sample). */
  chunks: AsyncIterable<Uint8Array>;
}

export interface SpeechProvider {
  api: SpeechApi;
  defaults: { baseUrl: string; model: string };
  /** Built-in voices (first one is the default). */
  voices: VoiceOption[];
  /** Models offered in the connection editor (free text is allowed too). */
  models: string[];
  /** Prompt text for `{{ap::speech::format}}`: one short English paragraph, '' when no tags exist. */
  format: string;
  /** Inline markup the model may write inside a speech tag: removed for display, kept for synthesis. */
  tags: RegExp | null;
  /** Clone support: `audio` reference audio; `text` transcript; `consent` second recording. */
  clone?: { text: 'none' | 'optional' | 'required'; consent?: boolean };
  /** Voice library / account voices search. */
  search?(env: SpeechEnv, conn: SpeechConnection, query: string, signal?: AbortSignal): Promise<VoiceOption[]>;
  /**
   * Create the provider-side voice for a clone and return its id (cached in `VoiceRef.id`). Providers
   * that take reference audio inline with each request (Fish) do not implement this.
   */
  createClone?(env: SpeechEnv, conn: SpeechConnection, ref: Extract<VoiceRef, { kind: 'clone' }>, signal?: AbortSignal): Promise<string>;
  /** Library voices that must be added to the account before use (ElevenLabs); returns the usable id. */
  adopt?(env: SpeechEnv, conn: SpeechConnection, voice: VoiceOption, signal?: AbortSignal): Promise<string>;
  synthesize(env: SpeechEnv, req: SynthesisRequest): Promise<PcmStream>;
}
