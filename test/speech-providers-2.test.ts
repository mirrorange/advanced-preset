import { describe, expect, it } from 'vitest';
import { speechFormat, speechProvider, speechTags } from '@/media/speech/providers';
import { chunked, conn, drain, env } from './speech-helpers';

const pcm = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
const b64 = (b: Uint8Array) => btoa(String.fromCharCode(...b));
const enc = new TextEncoder();
const sse = (events: unknown[], size = 7) => chunked(enc.encode(events.map((e) => `data: ${typeof e === 'string' ? e : JSON.stringify(e)}\n\n`).join('')), size, { 'Content-Type': 'text/event-stream' });
const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json' } });
const wav = (data: Uint8Array) => {
  const h = new Uint8Array(44);
  h.set(enc.encode('RIFF'), 0);
  h.set(enc.encode('WAVEfmt '), 8);
  h[16] = 16;
  h.set(enc.encode('data'), 36);
  return new Uint8Array([...h, ...data]);
};
const strip = (api: 'minimax' | 'gemini', s: string) => s.replace(speechTags(api)!, '');

describe('minimax', () => {
  const p = speechProvider('minimax')!;

  it('streams hex PCM from t2a_v2 and skips the aggregated final chunk', async () => {
    const e = env(() => sse([
      { data: { audio: hex(pcm.slice(0, 4)), status: 1 }, base_resp: { status_code: 0 } },
      { data: { audio: hex(pcm.slice(4)), status: 1 }, base_resp: { status_code: 0 } },
      { data: { audio: hex(pcm), status: 2 }, base_resp: { status_code: 0, status_msg: 'success' } },
    ]));
    const c = conn('minimax', { body: '{"voice_setting":{"speed":1.2},"audio_setting":{"sample_rate":32000}}' });
    const out = await p.synthesize(e, { conn: c, text: 'Hi (sighs)', voice: { kind: 'voice', id: 'English_Graceful_Lady' } });
    expect(out.sampleRate).toBe(32000);
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect(e.calls[0]!.url).toBe('https://api.minimax.io/v1/t2a_v2');
    expect(e.calls[0]!.body).toMatchObject({
      model: 'speech-2.8-hd',
      text: 'Hi (sighs)',
      stream: true,
      stream_options: { exclude_aggregated_audio: true },
      voice_setting: { voice_id: 'English_Graceful_Lady', speed: 1.2 },
      audio_setting: { format: 'pcm', sample_rate: 32000, channel: 1 },
    });
    expect((e.calls[0]!.init.headers as Record<string, string>).Authorization).toBe('Bearer KEY');
  });

  it('uses the cached clone id and the default voice', async () => {
    const e = env(() => sse([{ data: { audio: hex(pcm), status: 1 } }]));
    await drain((await p.synthesize(e, { conn: conn('minimax'), text: 'a', voice: { kind: 'clone', audio: 'k', id: 'APclone01' } })).chunks);
    await drain((await p.synthesize(e, { conn: conn('minimax'), text: 'a', voice: null })).chunks);
    expect((e.calls[0]!.body as any).voice_setting.voice_id).toBe('APclone01');
    expect((e.calls[1]!.body as any).voice_setting.voice_id).toBe(p.voices[0]!.id);
    await expect(p.synthesize(e, { conn: conn('minimax'), text: 'a', voice: { kind: 'clone', audio: 'k' } })).rejects.toThrow('not been created');
  });

  it('reports base_resp errors (JSON and in-stream)', async () => {
    const bad = { base_resp: { status_code: 1004, status_msg: 'authentication failed' } };
    const a = await p.synthesize(env(() => json(bad)), { conn: conn('minimax'), text: 'a', voice: null });
    await expect(drain(a.chunks)).rejects.toThrow('MiniMax 1004: authentication failed');
    const b = await p.synthesize(env(() => sse([{ data: { audio: hex(pcm), status: 1 } }, bad])), { conn: conn('minimax'), text: 'a', voice: null });
    await expect(drain(b.chunks)).rejects.toThrow('MiniMax 1004');
  });

  it('clones: uploads multipart, keeps the int64 file id exact, returns the custom voice id', async () => {
    const e = env((call) => call.url.endsWith('files/upload')
      ? new Response('{"file":{"file_id":123456789012345678,"purpose":"voice_clone"},"base_resp":{"status_code":0}}')
      : json({ base_resp: { status_code: 0, status_msg: 'success' } }), { ref: new Blob([pcm], { type: 'audio/mpeg' }) });
    const id = await p.createClone!(e, conn('minimax', { baseUrl: 'https://api.minimaxi.com/v1' }), { kind: 'clone', audio: 'ref' });
    expect(id).toMatch(/^[A-Za-z][A-Za-z0-9_-]{7,255}$/);
    expect(id).not.toMatch(/[-_]$/);
    const [up, clone] = e.calls;
    expect(up!.url).toBe('https://api.minimaxi.com/v1/files/upload');
    const form = up!.init.body as FormData;
    expect(form.get('purpose')).toBe('voice_clone');
    expect((form.get('file') as File).name).toBe('reference.mp3');
    expect((up!.init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
    expect(clone!.url).toBe('https://api.minimaxi.com/v1/voice_clone');
    expect(clone!.init.body).toBe(`{"file_id":123456789012345678,"voice_id":"${id}"}`);
  });

  it('explains failed uploads and clone errors', async () => {
    const blobs = { ref: new Blob([pcm]) };
    await expect(p.createClone!(env(() => { throw new TypeError('Failed to fetch'); }, blobs), conn('minimax'), { kind: 'clone', audio: 'ref' }))
      .rejects.toThrow(/upload failed \(Failed to fetch\).*file uploads/);
    const e = env((call) => call.url.endsWith('files/upload')
      ? json({ file: { file_id: 1 }, base_resp: { status_code: 0 } })
      : json({ base_resp: { status_code: 2038, status_msg: 'no cloning permission' } }), blobs);
    await expect(p.createClone!(e, conn('minimax'), { kind: 'clone', audio: 'ref' })).rejects.toThrow('MiniMax 2038: no cloning permission');
    await expect(p.createClone!(env(() => json({})), conn('minimax'), { kind: 'clone', audio: 'missing' })).rejects.toThrow('not found');
  });

  it('lists account voices first and filters by query', async () => {
    const e = env(() => json({
      system_voice: [{ voice_id: 'English_Graceful_Lady', voice_name: 'Graceful Lady', description: ['Elegant female voice'] }],
      voice_cloning: [{ voice_id: 'APmine001', description: [] }],
      base_resp: { status_code: 0 },
    }));
    const all = await p.search!(e, conn('minimax'), '');
    expect(all.map((v) => v.id)).toEqual(['APmine001', 'English_Graceful_Lady']);
    expect(all[1]).toEqual({ id: 'English_Graceful_Lady', name: 'Graceful Lady', description: 'Elegant female voice' });
    expect((await p.search!(e, conn('minimax'), 'elegant')).map((v) => v.id)).toEqual(['English_Graceful_Lady']);
    expect(e.calls[0]!.body).toEqual({ voice_type: 'all' });
  });

  it('strips only MiniMax tags for display', () => {
    expect(strip('minimax', '(sighs) Fine.<#0.5#> Let\'s go (now).')).toBe(' Fine. Let\'s go (now).');
    expect(speechFormat('minimax')).toMatch(/^Inside a speech tag/);
  });
});

describe('gemini', () => {
  const p = speechProvider('gemini')!;

  it('streams L16 audio deltas from the Interactions API', async () => {
    const e = env(() => sse([
      { event_type: 'interaction.created', interaction: { id: 'v1_x' } },
      { event_type: 'step.start', index: 0, step: { type: 'model_output' } },
      { event_type: 'step.delta', index: 0, delta: { type: 'audio', data: b64(pcm.slice(0, 6)) } },
      { event_type: 'step.delta', index: 0, delta: { type: 'audio', data: b64(pcm.slice(6)) } },
      { event_type: 'interaction.completed' },
      '[DONE]',
    ]));
    const c = conn('gemini', { model: 'gemini-3.8-flash-lite-tts', headers: { 'x-goog-api-key': 'OTHER' } });
    const out = await p.synthesize(e, { conn: c, text: 'Hi <sigh>', voice: { kind: 'voice', id: 'Puck' } });
    expect(out.sampleRate).toBe(24000);
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect(e.calls[0]!.url).toBe('https://generativelanguage.googleapis.com/v1beta/interactions');
    expect(e.calls[0]!.body).toEqual({
      model: 'gemini-3.8-flash-lite-tts',
      input: [{ type: 'user_input', content: [{ type: 'text', text: 'Hi <sigh>' }] }],
      response_format: { type: 'audio', mime_type: 'audio/l16', sample_rate: 24000 },
      generation_config: { speech_config: [{ voice: 'Puck' }] },
      stream: true,
    });
    expect((e.calls[0]!.init.headers as Record<string, string>)['x-goog-api-key']).toBe('OTHER');
  });

  it('unwraps a non-streaming WAV response', async () => {
    const e = env(() => json({ steps: [{ type: 'model_output', content: [{ type: 'audio', mime_type: 'audio/wav', data: b64(wav(pcm)) }] }] }));
    const out = await p.synthesize(e, { conn: conn('gemini', { body: '{"stream":false,"response_format":{"mime_type":"audio/wav"}}' }), text: 'a', voice: null });
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect((e.calls[0]!.body as any).generation_config.speech_config).toEqual([{ voice: 'Kore' }]);
  });

  it('reports HTTP and stream errors', async () => {
    await expect(p.synthesize(env(() => json({ error: { message: 'API key not valid' } }, 400)), { conn: conn('gemini'), text: 'a', voice: null }))
      .rejects.toThrow('HTTP 400: API key not valid');
    const out = await p.synthesize(env(() => sse([{ event_type: 'error', error: { message: 'quota' } }])), { conn: conn('gemini'), text: 'a', voice: null });
    await expect(drain(out.chunks)).rejects.toThrow('Gemini: quota');
  });

  it('replicates a voice from reference and consent audio', async () => {
    const e = env(() => json({ id: 'voice_abc', type: 'replicated' }), {
      ref: new Blob([pcm], { type: 'audio/wav' }),
      ok: new Blob([pcm.slice(0, 3)], { type: 'audio/webm;codecs=opus' }),
    });
    expect(await p.createClone!(e, conn('gemini'), { kind: 'clone', audio: 'ref', consent: 'ok' })).toBe('voice_abc');
    expect(e.calls[0]!.url).toBe('https://generativelanguage.googleapis.com/v1beta/voices');
    expect(e.calls[0]!.body).toMatchObject({
      store: true,
      voice: {
        model: 'gemini-3.8-flash-tts',
        type: 'replicated',
        replicated: {
          source_audio: { mime_type: 'audio/wav', data: b64(pcm) },
          consent_audio: { mime_type: 'audio/webm', data: b64(pcm.slice(0, 3)) },
        },
      },
    });
    await expect(p.createClone!(e, conn('gemini'), { kind: 'clone', audio: 'ref' })).rejects.toThrow('consent');
    expect(p.clone).toEqual({ text: 'none', consent: true });
  });

  it('searches the Voice Library', async () => {
    const e = env(() => json({ voices: [{ id: 'voice_1', display_name: 'Mine', type: 'replicated' }, { id: 'Ava', display_name: 'Ava', language_code: 'en-US', accent: 'American', description: 'Warm narrator' }] }));
    const r = await p.search!(e, conn('gemini'), ' warm ');
    expect(r).toEqual([{ id: 'voice_1', name: 'Mine', description: undefined }, { id: 'Ava', name: 'Ava', description: '(en-US, American) Warm narrator' }]);
    expect(e.calls[0]!.url).toBe('https://generativelanguage.googleapis.com/v1beta/voices?search=warm&page_size=100');
    expect(e.calls[0]!.init.method).toBe('GET');
  });

  it('strips Gemini vocal tags for display', () => {
    expect(strip('gemini', 'Wait... <short pause> look! <GASP> <b>x</b>')).toBe('Wait...  look!  <b>x</b>');
    expect(speechFormat('gemini')).toMatch(/^Inside a speech tag/);
  });
});

describe('deepseek', () => {
  const p = speechProvider('deepseek')!;

  it('requests PCM and streams the body', async () => {
    const e = env(() => chunked(pcm, 3));
    const c = conn('deepseek', { body: '{"filter_markdown":false}' });
    const out = await p.synthesize(e, { conn: c, text: '你好', voice: { kind: 'voice', id: 'tide' } });
    expect(out.sampleRate).toBe(24000);
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect(e.calls[0]!.url).toBe('https://api.deepseek.com/v1/tools/tts');
    expect(e.calls[0]!.body).toEqual({ text: '你好', voice_id: 'tide', format: 'pcm', filter_markdown: false });
    expect((e.calls[0]!.init.headers as Record<string, string>).Authorization).toBe('Bearer KEY');
  });

  it('defaults to stella, skips a WAV header, has no tags and no clones', async () => {
    const e = env(() => chunked(wav(pcm), 4));
    const out = await p.synthesize(e, { conn: conn('deepseek', { body: '{"format":"wav"}' }), text: 'a', voice: null });
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect((e.calls[0]!.body as any).voice_id).toBe('stella');
    expect(speechFormat('deepseek')).toBe('');
    expect(speechTags('deepseek')).toBeNull();
    await expect(p.synthesize(e, { conn: conn('deepseek'), text: 'a', voice: { kind: 'clone', audio: 'k' } })).rejects.toThrow('cloning');
  });

  it('reports HTTP errors', async () => {
    await expect(p.synthesize(env(() => json({ error: { message: 'Content Exists Risk' } }, 400)), { conn: conn('deepseek'), text: 'a', voice: null }))
      .rejects.toThrow('HTTP 400: Content Exists Risk');
  });
});
