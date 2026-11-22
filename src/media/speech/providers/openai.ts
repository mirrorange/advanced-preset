/** OpenAI `/v1/audio/speech` (and compatible endpoints): chunked PCM, 24 kHz. */
import type { SpeechProvider } from '../types';
import { baseOf, bodyChunks, ensureOk, joinUrl, mergeBody, mergeHeaders } from '../util';

const VOICES = ['marin', 'cedar', 'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer', 'verse'];

export const openai: SpeechProvider = {
  api: 'openai',
  defaults: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini-tts' },
  models: ['gpt-4o-mini-tts', 'tts-1-hd', 'tts-1'],
  voices: VOICES.map((id) => ({ id, name: id[0]!.toUpperCase() + id.slice(1) })),
  format: '',
  tags: null,

  async synthesize(env, { conn, text, voice, signal }) {
    const id = voice?.kind === 'voice' ? voice.id : VOICES[0]!;
    const body = mergeBody(conn, {
      model: conn.model || this.defaults.model,
      input: text,
      // Custom voices are objects; built-in ones plain names.
      voice: id.startsWith('voice_') ? { id } : id,
      response_format: 'pcm',
    });
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'audio/speech'), {
      method: 'POST',
      headers: mergeHeaders(conn, { 'Content-Type': 'application/json', Authorization: `Bearer ${conn.apiKey}` }),
      body: JSON.stringify(body),
      signal,
    }));
    return { sampleRate: 24000, chunks: bodyChunks(resp, signal) };
  },
};
