/** DeepSeek `/v1/tools/tts`: audio streams back while it is synthesized (24 kHz PCM). */
import type { SpeechProvider } from '../types';
import { SpeechError, baseOf, bodyChunks, ensureOk, joinUrl, mergeBody, mergeHeaders, stripWavHeader } from '../util';

export const deepseek: SpeechProvider = {
  api: 'deepseek',
  defaults: { baseUrl: 'https://api.deepseek.com/v1', model: '' },
  models: [],
  voices: [
    { id: 'stella', name: 'Stella', description: '海星' },
    { id: 'tide', name: 'Tide', description: '暗潮' },
  ],
  format: '',
  tags: null,

  async synthesize(env, { conn, text, voice, signal }) {
    if (voice?.kind === 'clone') throw new SpeechError('DeepSeek does not support voice cloning.');
    const body = mergeBody(conn, { text, voice_id: voice?.id ?? this.voices[0]!.id, format: 'pcm' });
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'tools/tts'), {
      method: 'POST',
      headers: mergeHeaders(conn, { 'Content-Type': 'application/json', Authorization: `Bearer ${conn.apiKey}` }),
      body: JSON.stringify(body),
      signal,
    }));
    // `format: "wav"` overrides still play: the header is skipped.
    return { sampleRate: 24000, chunks: stripWavHeader(bodyChunks(resp, signal)) };
  },
};
