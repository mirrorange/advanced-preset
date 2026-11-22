/**
 * ElevenLabs `/v1/text-to-speech/{voice}/stream` with PCM output. Voices: premade, account voices
 * and the shared Voice Library (added to the account on first use); clones are Instant Voice Clones.
 */
import type { SpeechProvider } from '../types';
import { baseOf, bodyChunks, ensureOk, joinUrl, mergeBody, mergeHeaders, SpeechError } from '../util';

const RATE = 24000;

const PREMADE: [string, string][] = [
  ['JBFqnCBsd6RMkjVDRZzb', 'George'],
  ['21m00Tcm4TlvDq8ikWAM', 'Rachel'],
  ['EXAVITQu4vr4xnSDxMaL', 'Sarah'],
  ['pNInz6obpgDQGcFmaJgB', 'Adam'],
  ['nPczCjzI2devNBz1zQrb', 'Brian'],
  ['pFZP5JQG7iQjIQuC4Bku', 'Lily'],
  ['IKne3meq5aSn9XLyUdCD', 'Charlie'],
  ['XB0fDUnXU5powFXDhCwa', 'Charlotte'],
];

interface ApiVoice { voice_id: string; name?: string; description?: string | null; preview_url?: string | null; public_owner_id?: string }

const key = (k: string) => ({ 'xi-api-key': k });

export const elevenlabs: SpeechProvider = {
  api: 'elevenlabs',
  defaults: { baseUrl: 'https://api.elevenlabs.io', model: 'eleven_v3' },
  models: ['eleven_v3', 'eleven_v4', 'eleven_v4_turbo', 'eleven_multilingual_v2', 'eleven_flash_v2_5'],
  voices: PREMADE.map(([id, name]) => ({ id, name })),
  format: 'Inside a speech tag you may add ElevenLabs audio tags in square brackets right before the words they affect: emotions such as [excited] [sad] [angry] [nervous] [sarcastic] [curious], delivery such as [whispers] [shouts] [softly], and sounds such as [laughs] [sighs] [gasps] [crying] [clears throat]; use [pause] or an ellipsis for a pause. Example: <speech character="Mia">[whispers] Don\'t move. [pause] Something is out there.</speech>',
  tags: /\[[^[\]\n]{1,60}\]/g,
  clone: { text: 'none' },

  async search(env, conn, query, signal) {
    const base = baseOf(conn, this.defaults.baseUrl);
    const headers = mergeHeaders(conn, key(conn.apiKey));
    const q = query.trim();
    const mine = new URL(joinUrl(base, 'v2/voices'));
    mine.searchParams.set('page_size', '30');
    if (q) mine.searchParams.set('search', q);
    const shared = new URL(joinUrl(base, 'v1/shared-voices'));
    shared.searchParams.set('page_size', '30');
    if (q) shared.searchParams.set('search', q);
    const list = async (url: URL) => {
      const resp = await ensureOk(await env.fetch(url.toString(), { headers, signal }));
      return ((await resp.json()) as { voices?: ApiVoice[] }).voices ?? [];
    };
    const [own, library] = await Promise.all([list(mine), list(shared).catch(() => [] as ApiVoice[])]);
    const seen = new Set(own.map((v) => v.voice_id));
    return [...own, ...library.filter((v) => !seen.has(v.voice_id))].map((v) => ({
      id: v.voice_id, name: v.name || v.voice_id, description: v.description || undefined, preview: v.preview_url || undefined,
      owner: v.public_owner_id || undefined,
    }));
  },

  async adopt(env, conn, voice, signal) {
    if (!voice.owner) return voice.id;
    const url = joinUrl(baseOf(conn, this.defaults.baseUrl), `v1/voices/add/${encodeURIComponent(voice.owner)}/${encodeURIComponent(voice.id)}`);
    const resp = await env.fetch(url, { method: 'POST', headers: mergeHeaders(conn, { ...key(conn.apiKey), 'Content-Type': 'application/json' }), body: JSON.stringify({ new_name: voice.name }), signal });
    // Already in the account: the library id works as is.
    if (resp.status === 400 || resp.status === 409) return voice.id;
    return ((await (await ensureOk(resp)).json()) as { voice_id?: string }).voice_id || voice.id;
  },

  async createClone(env, conn, ref, signal) {
    const audio = await env.blob(ref.audio);
    if (!audio) throw new SpeechError('Reference audio is missing.');
    const form = new FormData();
    form.append('name', `AP ${ref.audio.slice(-8)}`);
    form.append('files', audio, 'reference');
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'v1/voices/add'), { method: 'POST', headers: mergeHeaders(conn, key(conn.apiKey)), body: form, signal }));
    const id = ((await resp.json()) as { voice_id?: string }).voice_id;
    if (!id) throw new SpeechError('No voice id returned.');
    return id;
  },

  async synthesize(env, { conn, text, voice, signal }) {
    const id = voice?.kind === 'voice' ? voice.id : voice?.id;
    if (voice?.kind === 'clone' && !id) throw new SpeechError('The cloned voice has not been created.');
    const url = new URL(joinUrl(baseOf(conn, this.defaults.baseUrl), `v1/text-to-speech/${encodeURIComponent(id || PREMADE[0]![0])}/stream`));
    url.searchParams.set('output_format', `pcm_${RATE}`);
    const body = mergeBody(conn, { text, model_id: conn.model || this.defaults.model });
    const resp = await ensureOk(await env.fetch(url.toString(), {
      method: 'POST', headers: mergeHeaders(conn, { ...key(conn.apiKey), 'Content-Type': 'application/json' }), body: JSON.stringify(body), signal,
    }));
    return { sampleRate: RATE, chunks: bodyChunks(resp, signal) };
  },
};
