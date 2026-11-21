import { describe, expect, it } from 'vitest';
import { speechProvider } from '@/media/speech/providers';
import { mergeHeaders, stripWavHeader } from '@/media/speech/util';
import { chunked, conn, drain, env } from './speech-helpers';

const pcm = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

describe('speech util', () => {
  it('merges headers case-insensitively; empty values remove', () => {
    const c = conn('openai', { headers: { authorization: 'Bearer X', 'X-Extra': '1', 'Content-Type': '' } });
    expect(mergeHeaders(c, { 'Content-Type': 'application/json', Authorization: 'Bearer KEY' })).toEqual({ authorization: 'Bearer X', 'X-Extra': '1' });
  });

  it('strips a WAV header split across chunks', async () => {
    const header = new Uint8Array(44);
    header.set([...'RIFF'].map((c) => c.charCodeAt(0)), 0);
    header.set([...'WAVE'].map((c) => c.charCodeAt(0)), 8);
    header.set([...'fmt '].map((c) => c.charCodeAt(0)), 12);
    header[16] = 16;
    header.set([...'data'].map((c) => c.charCodeAt(0)), 36);
    const all = new Uint8Array([...header, ...pcm]);
    async function* parts() { for (let i = 0; i < all.length; i += 3) yield all.slice(i, i + 3); }
    expect([...await drain(stripWavHeader(parts()))]).toEqual([...pcm]);
  });
});

describe('openai', () => {
  const p = speechProvider('openai')!;

  it('requests PCM with the connection model, voice and overrides', async () => {
    const e = env(() => chunked(pcm));
    const c = conn('openai', { model: 'tts-1', baseUrl: 'https://proxy.example/v1/', body: '{"speed":1.2,"response_format":"pcm"}' });
    const out = await p.synthesize(e, { conn: c, text: 'Hello', voice: { kind: 'voice', id: 'coral' } });
    expect(out.sampleRate).toBe(24000);
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect(e.calls[0]!.url).toBe('https://proxy.example/v1/audio/speech');
    expect(e.calls[0]!.body).toEqual({ model: 'tts-1', input: 'Hello', voice: 'coral', response_format: 'pcm', speed: 1.2 });
    expect((e.calls[0]!.init.headers as Record<string, string>).Authorization).toBe('Bearer KEY');
  });

  it('uses the default voice and passes custom voice ids as objects', async () => {
    const e = env(() => chunked(pcm));
    await p.synthesize(e, { conn: conn('openai'), text: 'a', voice: null });
    await p.synthesize(e, { conn: conn('openai'), text: 'a', voice: { kind: 'voice', id: 'voice_123' } });
    expect((e.calls[0]!.body as { voice: unknown }).voice).toBe('marin');
    expect((e.calls[1]!.body as { voice: unknown }).voice).toEqual({ id: 'voice_123' });
  });

  it('reports API errors', async () => {
    const e = env(() => new Response(JSON.stringify({ error: { message: 'bad key' } }), { status: 401 }));
    await expect(p.synthesize(e, { conn: conn('openai'), text: 'a', voice: null })).rejects.toThrow('HTTP 401: bad key');
  });
});
