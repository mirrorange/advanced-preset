/** Gemini TTS through the Interactions API (streaming L16), Voice Library and voice replication. */
import type { SpeechConnection, SpeechProvider, VoiceOption, VoiceRef } from '../types';
import { SpeechError, base64Bytes, baseOf, blobBase64, ensureOk, joinUrl, mergeBody, mergeHeaders, sseData, stripWavHeader } from '../util';

const VOICES: [string, string][] = [
  ['Kore', 'Firm'], ['Puck', 'Upbeat'], ['Zephyr', 'Bright'], ['Charon', 'Informative'], ['Fenrir', 'Excitable'],
  ['Leda', 'Youthful'], ['Orus', 'Firm'], ['Aoede', 'Breezy'], ['Callirrhoe', 'Easy-going'], ['Autonoe', 'Bright'],
  ['Enceladus', 'Breathy'], ['Iapetus', 'Clear'], ['Umbriel', 'Easy-going'], ['Algieba', 'Smooth'], ['Despina', 'Smooth'],
  ['Erinome', 'Clear'], ['Algenib', 'Gravelly'], ['Rasalgethi', 'Informative'], ['Laomedeia', 'Upbeat'], ['Achernar', 'Soft'],
  ['Alnilam', 'Firm'], ['Schedar', 'Even'], ['Gacrux', 'Mature'], ['Pulcherrima', 'Forward'], ['Achird', 'Friendly'],
  ['Zubenelgenubi', 'Casual'], ['Vindemiatrix', 'Gentle'], ['Sadachbia', 'Lively'], ['Sadaltager', 'Knowledgeable'], ['Sulafat', 'Warm'],
];

/** Inline vocal tags from the Gemini TTS prompting guide. */
const TAGS = [
  'argh', 'breath', 'heavy breath', 'exhales', 'cackle', 'cheer', 'chuckle', 'chuckles', 'cough', 'cry', 'gasp', 'giggle',
  'groan', 'growl', 'grunt', 'grr', 'hiss', 'laugh', 'laughter', 'moan', 'pant', 'pff', 'phew', 'scream', 'shout', 'shriek',
  'sigh', 'sighs', 'sneeze', 'snicker', 'snort', 'sob', 'throat-clearing', 'tsk', 'whimper', 'whispers', 'whispering', 'yawn',
  'short pause', 'long pause',
];

const headers = (conn: SpeechConnection) => mergeHeaders(conn, { 'Content-Type': 'application/json', 'x-goog-api-key': conn.apiKey });

function voiceId(voice: VoiceRef | null): string {
  if (!voice) return VOICES[0]![0];
  if (voice.kind === 'voice') return voice.id;
  if (voice.id) return voice.id;
  throw new SpeechError('The replicated voice has not been created yet.');
}

interface Content { type?: string; data?: string; mime_type?: string }
interface StreamEvent { event_type?: string; delta?: Content; error?: { message?: string; code?: number | string } }

export const gemini: SpeechProvider = {
  api: 'gemini',
  defaults: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-3.8-flash-tts' },
  models: ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'],
  voices: VOICES.map(([id, description]) => ({ id, name: id, description })),
  format:
    'Inside a speech tag you may add vocal sounds and pauses in angle brackets exactly where they happen: '
    + '<sigh> <laugh> <chuckle> <giggle> <gasp> <cough> <breath> <sob> <yawn> <whispering> <short pause> <long pause>. '
    + 'Use these English tags in any language. Example: Wait... <short pause> did you hear that? <gasp>',
  tags: new RegExp(`<(?:${TAGS.join('|')})>`, 'gi'),
  clone: { text: 'none', consent: true },

  async synthesize(env, { conn, text, voice, signal }) {
    const body = mergeBody(conn, {
      model: conn.model || this.defaults.model,
      input: [{ type: 'user_input', content: [{ type: 'text', text }] }],
      response_format: { type: 'audio', mime_type: 'audio/l16', sample_rate: 24000 },
      generation_config: { speech_config: [{ voice: voiceId(voice) }] },
      stream: true,
    });
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'interactions'), {
      method: 'POST',
      headers: headers(conn),
      body: JSON.stringify(body),
      signal,
    }));
    // WAV (unary default, or a mime_type override) is unwrapped to its samples.
    return { sampleRate: Number(body.response_format?.sample_rate) || 24000, chunks: stripWavHeader(audioChunks(resp, signal)) };
  },

  async createClone(env, conn, ref, signal) {
    const [source, consent] = await Promise.all([env.blob(ref.audio), ref.consent ? env.blob(ref.consent) : undefined]);
    if (!source) throw new SpeechError('Reference audio not found.');
    if (!consent) throw new SpeechError('Gemini voice replication needs a consent recording.');
    const part = async (b: Blob) => ({ mime_type: b.type.split(';')[0]!.trim() || 'audio/wav', data: await blobBase64(b) });
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'voices'), {
      method: 'POST',
      headers: headers(conn),
      body: JSON.stringify({
        store: true,
        voice: {
          model: conn.model || this.defaults.model,
          type: 'replicated',
          display_name: `Advanced Preset ${new Date().toISOString().slice(0, 10)}`,
          replicated: { source_audio: await part(source), consent_audio: await part(consent) },
        },
      }),
      signal,
    }));
    const j = await resp.json() as { id?: string; key?: string; name?: string; voice?: { id?: string; key?: string } };
    const id = j.id ?? j.voice?.id ?? j.key ?? j.voice?.key ?? j.name?.replace(/^voices\//, '');
    if (!id) throw new SpeechError('Gemini did not return a voice id.');
    return id;
  },

  async search(env, conn, query, signal) {
    const url = new URL(joinUrl(baseOf(conn, this.defaults.baseUrl), 'voices'));
    if (query.trim()) url.searchParams.set('search', query.trim());
    url.searchParams.set('page_size', '100');
    const resp = await ensureOk(await env.fetch(url.toString(), { method: 'GET', headers: mergeHeaders(conn, { 'x-goog-api-key': conn.apiKey }), signal }));
    type V = { id?: string; name?: string; display_name?: string; description?: string; language_code?: string; accent?: string };
    const j = await resp.json() as { voices?: V[] };
    return (j.voices ?? []).flatMap((v) => {
      const id = v.id ?? v.name?.replace(/^voices\//, '');
      if (!id) return [];
      const meta = [v.language_code, v.accent].filter(Boolean).join(', ');
      return [{ id, name: v.display_name || id, description: [meta && `(${meta})`, v.description].filter(Boolean).join(' ') || undefined }];
    });
  },
};

async function* audioChunks(resp: Response, signal?: AbortSignal): AsyncGenerator<Uint8Array> {
  // `stream: false` overrides return one interaction object.
  if (/json/i.test(resp.headers.get('content-type') ?? '')) {
    const j = await resp.json() as { steps?: { type?: string; content?: Content[] }[] };
    const audio = (j.steps ?? []).flatMap((s) => s.content ?? []).filter((c) => c.type === 'audio' && c.data);
    if (!audio.length) throw new SpeechError('Gemini returned no audio.');
    yield base64Bytes(audio[audio.length - 1]!.data!);
    return;
  }
  let got = false;
  for await (const data of sseData(resp, signal)) {
    if (data === '[DONE]') break;
    const ev = JSON.parse(data) as StreamEvent;
    if (ev.event_type === 'error' || ev.error) throw new SpeechError(`Gemini: ${ev.error?.message ?? 'stream error'}`);
    if (ev.event_type === 'step.delta' && ev.delta?.type === 'audio' && ev.delta.data) {
      got = true;
      yield base64Bytes(ev.delta.data);
    }
  }
  if (!got) throw new SpeechError('Gemini returned no audio.');
}
