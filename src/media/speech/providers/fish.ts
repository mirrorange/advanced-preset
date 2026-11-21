/**
 * Fish Audio `/v1/tts`: chunked PCM. Voices are model ids (`reference_id`); a clone sends its
 * reference audio inline (`references`, MessagePack only).
 */
import type { SpeechProvider } from '../types';
import { encodeMsgpack } from '../msgpack';
import { baseOf, bodyChunks, ensureOk, joinUrl, mergeBody, mergeHeaders, SpeechError } from '../util';

const RATE = 24000;

export const fish: SpeechProvider = {
  api: 'fish',
  defaults: { baseUrl: 'https://api.fish.audio', model: 's2.1-pro' },
  models: ['s2.1-pro', 's2.1-pro-free', 's2-pro', 'drama-3', 's3-pro'],
  voices: [],
  format: 'Inside a speech tag you may add Fish Audio delivery cues in square brackets right before the words they affect: emotions such as [happy] [sad] [angry] [nervous] [sarcastic], tones such as [whispering] [shouting] [soft tone], sounds such as [laughing] [sighing] [gasping] [sobbing], pauses [break] [long-break], or a short free-form direction like [quietly, voice trembling]. Example: <speech character="Mia">[whispering] Don\'t move. [break] Something is out there.</speech>',
  tags: /\[[^[\]\n]{1,60}\]/g,
  clone: { text: 'optional' },

  async search(env, conn, query, signal) {
    const url = new URL(joinUrl(baseOf(conn, this.defaults.baseUrl), 'model'));
    url.searchParams.set('page_size', '20');
    if (query.trim()) url.searchParams.set('title', query.trim());
    const resp = await ensureOk(await env.fetch(url.toString(), { headers: mergeHeaders(conn, conn.apiKey ? { Authorization: `Bearer ${conn.apiKey}` } : {}), signal }));
    const data = await resp.json() as { items?: { _id: string; title?: string; description?: string; samples?: { audio?: string }[] }[] };
    return (data.items ?? []).map((m) => ({ id: m._id, name: m.title?.trim() || m._id, description: m.description || undefined, preview: m.samples?.[0]?.audio || undefined }));
  },

  async synthesize(env, { conn, text, voice, signal }) {
    const base = { text, format: 'pcm', sample_rate: RATE, latency: 'balanced' } as Record<string, unknown>;
    if (voice?.kind === 'voice') base.reference_id = voice.id;
    const body = mergeBody(conn, base);
    const headers: Record<string, string> = { Authorization: `Bearer ${conn.apiKey}`, model: conn.model || this.defaults.model };
    let payload: BodyInit;
    if (voice?.kind === 'clone') {
      const audio = await env.blob(voice.audio);
      if (!audio) throw new SpeechError('Reference audio is missing.');
      const ref = { audio: new Uint8Array(await audio.arrayBuffer()), text: voice.text ?? '' };
      payload = encodeMsgpack({ ...(body as Record<string, never>), references: [ref] }) as Uint8Array<ArrayBuffer>;
      headers['Content-Type'] = 'application/msgpack';
    } else {
      payload = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'v1/tts'), { method: 'POST', headers: mergeHeaders(conn, headers), body: payload, signal }));
    return { sampleRate: Number(body.sample_rate) || RATE, chunks: bodyChunks(resp, signal) };
  },
};
