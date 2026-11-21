/** MiniMax T2A v2 (streaming SSE, hex PCM), Voice Clone and account voice list. */
import type { SpeechConnection, SpeechProvider, VoiceOption, VoiceRef } from '../types';
import { SpeechError, baseOf, ensureOk, hexBytes, joinUrl, mergeBody, mergeHeaders, sseData } from '../util';

const INTERJECTIONS = [
  'laughs', 'chuckle', 'coughs', 'clear-throat', 'groans', 'breath', 'pant', 'inhale', 'exhale', 'gasps',
  'sniffs', 'sighs', 'snorts', 'burps', 'lip-smacking', 'humming', 'hissing', 'emm', 'sneezes',
];

const VOICES: VoiceOption[] = [
  { id: 'English_expressive_narrator', name: 'Expressive Narrator' },
  { id: 'English_Graceful_Lady', name: 'Graceful Lady' },
  { id: 'English_Insightful_Speaker', name: 'Insightful Speaker' },
  { id: 'English_radiant_girl', name: 'Radiant Girl' },
  { id: 'English_Persuasive_Man', name: 'Persuasive Man' },
  { id: 'English_Lucky_Robot', name: 'Lucky Robot' },
  { id: 'Chinese (Mandarin)_Lyrical_Voice', name: 'Lyrical Voice (Mandarin)' },
  { id: 'Chinese (Mandarin)_Reliable_Executive', name: 'Reliable Executive (Mandarin)' },
  { id: 'Chinese (Mandarin)_News_Anchor', name: 'News Anchor (Mandarin)' },
  { id: 'Chinese (Mandarin)_HK_Flight_Attendant', name: 'HK Flight Attendant (Mandarin)' },
  { id: 'Japanese_Whisper_Belle', name: 'Whisper Belle (Japanese)' },
  { id: 'Cantonese_GentleLady', name: 'Gentle Lady (Cantonese)' },
];

interface BaseResp { base_resp?: { status_code?: number; status_msg?: string } }

/** MiniMax reports most failures as HTTP 200 with a non-zero `base_resp.status_code`. */
function check<T extends BaseResp>(j: T): T {
  const code = j?.base_resp?.status_code;
  if (code) throw new SpeechError(`MiniMax ${code}: ${j.base_resp?.status_msg || 'error'}`);
  return j;
}

const auth = (conn: SpeechConnection, json = true) =>
  mergeHeaders(conn, { ...(json ? { 'Content-Type': 'application/json' } : {}), Authorization: `Bearer ${conn.apiKey}` });

function voiceId(voice: VoiceRef | null): string {
  if (!voice) return VOICES[0]!.id;
  if (voice.kind === 'voice') return voice.id;
  if (voice.id) return voice.id;
  throw new SpeechError('The cloned voice has not been created yet.');
}

/** A fresh custom voice id: 8–256 chars, starts with a letter, letters / digits / `-` / `_`. */
export function cloneVoiceId(): string {
  return `AP${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const EXT: Record<string, string> = { 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/m4a': 'm4a', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav' };

export const minimax: SpeechProvider = {
  api: 'minimax',
  defaults: { baseUrl: 'https://api.minimax.io/v1', model: 'speech-2.8-hd' },
  models: ['speech-2.8-hd', 'speech-2.8-turbo', 'speech-2.6-hd', 'speech-2.6-turbo', 'speech-02-hd', 'speech-02-turbo'],
  voices: VOICES,
  format:
    'Inside a speech tag you may add MiniMax voice tags: a pause as <#seconds#> between words (e.g. <#0.5#>), and '
    + `interjections in parentheses: ${INTERJECTIONS.map((t) => `(${t})`).join(' ')}. `
    + 'Example: (sighs) Fine.<#0.4#> Let\'s go.',
  tags: new RegExp(`<#\\d+(?:\\.\\d+)?#>|\\((?:${INTERJECTIONS.join('|')})\\)`, 'g'),
  clone: { text: 'none' },

  async synthesize(env, { conn, text, voice, signal }) {
    const body = mergeBody(conn, {
      model: conn.model || this.defaults.model,
      text,
      stream: true,
      stream_options: { exclude_aggregated_audio: true },
      language_boost: 'auto',
      voice_setting: { voice_id: voiceId(voice) },
      audio_setting: { format: 'pcm', sample_rate: 24000, channel: 1 },
    });
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 't2a_v2'), {
      method: 'POST',
      headers: auth(conn),
      body: JSON.stringify(body),
      signal,
    }));
    return { sampleRate: Number(body.audio_setting?.sample_rate) || 24000, chunks: t2aChunks(resp, signal) };
  },

  async createClone(env, conn, ref, signal) {
    const audio = await env.blob(ref.audio);
    if (!audio) throw new SpeechError('Reference audio not found.');
    const base = baseOf(conn, this.defaults.baseUrl);
    const form = new FormData();
    form.append('purpose', 'voice_clone');
    form.append('file', audio, `reference.${EXT[audio.type.split(';')[0]!.trim()] ?? 'wav'}`);
    let raw: string;
    try {
      raw = await (await ensureOk(await env.fetch(joinUrl(base, 'files/upload'), { method: 'POST', headers: auth(conn, false), body: form, signal }))).text();
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') throw e;
      throw new SpeechError(`Reference audio upload failed (${(e as Error)?.message ?? e}). Uploads need a direct connection or a CORS proxy that forwards file uploads.`);
    }
    check(JSON.parse(raw) as BaseResp);
    // `file_id` is an int64 that may exceed Number precision: keep its digits verbatim.
    const fileId = /"file_id"\s*:\s*"?(\d+)/.exec(raw)?.[1];
    if (!fileId) throw new SpeechError('MiniMax did not return a file id.');
    const id = cloneVoiceId();
    const body = JSON.stringify({ file_id: 0, voice_id: id }).replace('"file_id":0', `"file_id":${fileId}`);
    const resp = await ensureOk(await env.fetch(joinUrl(base, 'voice_clone'), { method: 'POST', headers: auth(conn), body, signal }));
    check(await resp.json() as BaseResp);
    return id;
  },

  async search(env, conn, query, signal) {
    const resp = await ensureOk(await env.fetch(joinUrl(baseOf(conn, this.defaults.baseUrl), 'get_voice'), {
      method: 'POST',
      headers: auth(conn),
      body: JSON.stringify({ voice_type: 'all' }),
      signal,
    }));
    type V = { voice_id?: string; voice_name?: string; description?: string[] };
    const j = check(await resp.json() as BaseResp & { system_voice?: V[]; voice_cloning?: V[]; voice_generation?: V[] });
    const q = query.trim().toLowerCase();
    // Account voices (clones, designed) first.
    return [...j.voice_cloning ?? [], ...j.voice_generation ?? [], ...j.system_voice ?? []]
      .filter((v): v is V & { voice_id: string } => !!v.voice_id)
      .map((v) => ({ id: v.voice_id, name: v.voice_name || v.voice_id, description: v.description?.filter(Boolean).join(' ') || undefined }))
      .filter((v) => !q || `${v.id} ${v.name} ${v.description ?? ''}`.toLowerCase().includes(q));
  },
};

async function* t2aChunks(resp: Response, signal?: AbortSignal): AsyncGenerator<Uint8Array> {
  type Chunk = BaseResp & { data?: { audio?: string; status?: number } | null };
  // Errors (and `stream: false` overrides) come back as a single JSON object.
  if (/json/i.test(resp.headers.get('content-type') ?? '')) {
    const j = check(await resp.json() as Chunk);
    if (j.data?.audio) yield hexBytes(j.data.audio);
    return;
  }
  let got = false;
  for await (const data of sseData(resp, signal)) {
    const j = check(JSON.parse(data) as Chunk);
    const audio = j.data?.audio;
    if (!audio) continue;
    // Without `exclude_aggregated_audio` the final chunk repeats the whole audio.
    if (j.data?.status === 2 && got) continue;
    got = true;
    yield hexBytes(audio);
  }
}
