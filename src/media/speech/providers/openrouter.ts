/**
 * OpenRouter `/audio/speech` (OpenAI compatible) for every speech model it routes to. What a model
 * can do follows the provider in its id (`elevenlabs/eleven-v3` → ElevenLabs' inline tags): inline
 * tags and `{{ap::speech::format}}`, voice cloning (reference audio sent with each request) and the
 * default voices. Voices are listed per model by `/audio/speech/models/{author}/{slug}`.
 *
 * Audio: mp3, decoded to PCM (the PCM sample rate differs per provider); models that only return PCM
 * (Gemini, HeyGen) are read at their known rate.
 */
import type { SpeechProvider, SpeechProviderCaps, VoiceOption } from '../types';
import { baseOf, blobBase64, bodyChunks, ensureOk, joinUrl, mergeBody, mergeHeaders, SpeechError } from '../util';
import { decodeAudio } from '../decode';
import { elevenlabs } from './elevenlabs';
import { fish } from './fish';
import { gemini } from './gemini';
import { minimax } from './minimax';

const names = (ids: string[]): VoiceOption[] => ids.map((id) => ({ id, name: id[0]!.toUpperCase() + id.slice(1) }));

const HEYGEN_TAGS = ['sad', 'happy', 'excited', 'angry', 'whispers', 'shouts', 'slowly', 'quickly', 'laughs', 'sighs', 'gasps', 'clears throat'];

/** Capabilities by the provider part of the model id. */
const BY_PROVIDER: Record<string, Partial<SpeechProviderCaps> & { pcm?: number }> = {
  elevenlabs: {
    format: elevenlabs.format, tags: elevenlabs.tags,
    voices: names(['george', 'sarah', 'adam', 'alice', 'bella', 'brian', 'charlie', 'daniel', 'jessica', 'laura', 'liam', 'lily', 'matilda', 'river', 'roger', 'will']),
  },
  'fish-audio': { format: fish.format, tags: fish.tags, clone: { text: 'optional' } },
  minimax: { format: minimax.format, tags: minimax.tags },
  google: { format: gemini.format, tags: gemini.tags, voices: gemini.voices, pcm: 24000 },
  heygen: {
    format: 'Inside a speech tag you may add HeyGen audio tags in square brackets, in lower-case English, right before the words they affect: '
      + `${HEYGEN_TAGS.map((t) => `[${t}]`).join(' ')}. A delivery tag lasts for a sentence or two; a sound tag plays once. `
      + 'Example: <speech character="Mia">[sad] I walked past our old house today. [sighs] The garden is gone.</speech>',
    tags: fish.tags,
    clone: { text: 'none' },
    voices: names(['nadine', 'tabitha', 'bram', 'gareth', 'noelle', 'meredith', 'sabrina', 'lucian', 'weston', 'vincent']),
    pcm: 44100,
  },
  'bytedance-seed': { clone: { text: 'none' } },
};

/** The provider part of a model id (`elevenlabs/eleven-v3` → `elevenlabs`). */
export const modelProvider = (model: string) => model.trim().split('/')[0]!.toLowerCase();

const NONE: SpeechProviderCaps = { format: '', tags: null, voices: [] };
const caps = (model: string): SpeechProviderCaps & { pcm?: number } => ({ ...NONE, ...BY_PROVIDER[modelProvider(model)] });

const RATE = 24000;
const DEFAULT_MODEL = 'elevenlabs/eleven-v3';
const modelOf = (model: string) => model.trim() || DEFAULT_MODEL;

/** Voices published for a model, by Base URL and model (fetched once). */
const listed = new Map<string, Promise<VoiceOption[]>>();

/** Sample rate of a raw PCM response: `rate=` in its Content-Type, else the provider's, else 24 kHz. */
function pcmRate(type: string, model: string): number {
  const m = /rate=(\d+)/i.exec(type);
  return (m && Number(m[1])) || caps(model).pcm || RATE;
}

export const openrouter: SpeechProvider = {
  api: 'openrouter',
  defaults: { baseUrl: 'https://openrouter.ai/api/v1', model: DEFAULT_MODEL },
  models: [
    'elevenlabs/eleven-v3', 'elevenlabs/eleven-v4', 'elevenlabs/eleven-flash-v2.5', 'google/gemini-3.8-flash-tts', 'google/gemini-2.5-pro-tts',
    'fish-audio/s2.1-pro', 'heygen/heygen-voice-1', 'bytedance-seed/seed-audio-1-0', 'microsoft/mai-voice-2.1', 'mistralai/voxtral-mini-tts-2603',
    'qwen/qwen3-tts-1.7b', 'x-ai/grok-voice-tts-1.0', 'deepgram/aura-2', 'hexgrad/kokoro-82m',
  ],
  ...NONE,
  forModel(model) {
    const { pcm: _rate, ...c } = caps(modelOf(model));
    return { clone: undefined, ...c };
  },

  async search(env, conn, query, signal) {
    const model = modelOf(conn.model);
    const base = baseOf(conn, this.defaults.baseUrl);
    const key = `${base}|${model}`;
    let p = listed.get(key);
    if (!p) {
      const url = joinUrl(base, `audio/speech/models/${model.split('/').map(encodeURIComponent).join('/')}`);
      p = env.fetch(url, { headers: mergeHeaders(conn, conn.apiKey ? { Authorization: `Bearer ${conn.apiKey}` } : {}), signal })
        .then(ensureOk)
        .then(async (resp) => {
          const j = (await resp.json()) as Record<string, unknown>;
          const m = (j.data && typeof j.data === 'object' ? j.data : j) as { output_modalities?: { supported_parameters?: { voice?: { values?: unknown } } }[] };
          const values = (m.output_modalities ?? []).flatMap((o) => (Array.isArray(o.supported_parameters?.voice?.values) ? o.supported_parameters.voice.values : []));
          return [...new Set(values.filter((v): v is string => typeof v === 'string'))].map((id) => ({ id, name: id }));
        });
      listed.set(key, p);
      p.catch(() => listed.delete(key));
    }
    const q = query.trim().toLowerCase();
    return (await p).filter((v) => !q || v.id.toLowerCase().includes(q));
  },

  async synthesize(env, { conn, text, voice, signal }) {
    const model = modelOf(conn.model);
    const c = caps(model);
    const body: Record<string, unknown> = { model, input: text, response_format: c.pcm ? 'pcm' : 'mp3' };
    if (voice?.kind === 'clone') {
      // The recording is the voice (a voice id as well is rejected by some providers).
      const audio = await env.blob(voice.audio);
      if (!audio) throw new SpeechError('Reference audio is missing.');
      const data = `data:${audio.type || 'audio/wav'};base64,${await blobBase64(audio)}`;
      body.input_references = [{ type: 'input_audio', input_audio: { data } }, ...(voice.text?.trim() ? [{ type: 'text', text: voice.text.trim() }] : [])];
    } else {
      const id = voice?.id ?? c.voices[0]?.id;
      if (id) body.voice = id;
    }
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'audio/speech'), {
      method: 'POST',
      headers: mergeHeaders(conn, { 'Content-Type': 'application/json', Authorization: `Bearer ${conn.apiKey}` }),
      body: JSON.stringify(mergeBody(conn, body)),
      signal,
    }));
    const type = resp.headers.get('content-type') ?? '';
    if (/pcm|l16/i.test(type) || (!type && c.pcm)) return { sampleRate: pcmRate(type, model), chunks: bodyChunks(resp, signal) };
    const decoded = await decodeAudio(new Uint8Array(await resp.arrayBuffer()), RATE);
    return { sampleRate: decoded.sampleRate, chunks: (async function* () { yield decoded.pcm; })() };
  },
};
