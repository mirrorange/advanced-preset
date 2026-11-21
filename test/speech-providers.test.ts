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

describe('fish', () => {
  const p = speechProvider('fish')!;

  it('sends JSON with reference_id and the model header', async () => {
    const e = env(() => chunked(pcm));
    const out = await p.synthesize(e, { conn: conn('fish', { model: 's2.1-pro-free' }), text: '[whispering] hi', voice: { kind: 'voice', id: 'abc' } });
    expect([...await drain(out.chunks)]).toEqual([...pcm]);
    expect(e.calls[0]!.url).toBe('https://api.fish.audio/v1/tts');
    expect(e.calls[0]!.body).toMatchObject({ text: '[whispering] hi', reference_id: 'abc', format: 'pcm', sample_rate: 24000 });
    expect((e.calls[0]!.init.headers as Record<string, string>).model).toBe('s2.1-pro-free');
  });

  it('sends clone references as MessagePack', async () => {
    const e = env(() => chunked(pcm), { k1: new Blob([new Uint8Array([9, 9, 9])]) });
    await p.synthesize(e, { conn: conn('fish'), text: 'hi', voice: { kind: 'clone', audio: 'k1', text: 'sample' } });
    const h = e.calls[0]!.init.headers as Record<string, string>;
    expect(h['Content-Type']).toBe('application/msgpack');
    const body = e.calls[0]!.init.body as Uint8Array;
    expect(body[0]! & 0xf0).toBe(0x80);
    // bin8 of the audio bytes is embedded as is
    expect(Buffer.from(body).includes(Buffer.from([0xc4, 3, 9, 9, 9]))).toBe(true);
  });

  it('strips its bracket cues for display', () => {
    expect('[whispering] Don\'t move. [break] Run!'.replace(p.tags!, '').trim()).toBe('Don\'t move.  Run!');
  });

  it('searches the model library', async () => {
    const e = env(() => Response.json({ items: [{ _id: 'm1', title: 'Girl', samples: [{ audio: 'https://x/a.mp3' }] }] }));
    expect(await p.search!(e, conn('fish'), 'girl')).toEqual([{ id: 'm1', name: 'Girl', description: undefined, preview: 'https://x/a.mp3' }]);
    expect(e.calls[0]!.url).toContain('/model?page_size=20&title=girl');
  });
});

describe('elevenlabs', () => {
  const p = speechProvider('elevenlabs')!;

  it('streams PCM from the voice endpoint', async () => {
    const e = env(() => chunked(pcm));
    await p.synthesize(e, { conn: conn('elevenlabs'), text: 'hi', voice: { kind: 'voice', id: 'v 1' } });
    expect(e.calls[0]!.url).toBe('https://api.elevenlabs.io/v1/text-to-speech/v%201/stream?output_format=pcm_24000');
    expect(e.calls[0]!.body).toEqual({ text: 'hi', model_id: 'eleven_v3' });
    expect((e.calls[0]!.init.headers as Record<string, string>)['xi-api-key']).toBe('KEY');
  });

  it('needs a created clone', async () => {
    const e = env(() => chunked(pcm));
    await expect(p.synthesize(e, { conn: conn('elevenlabs'), text: 'hi', voice: { kind: 'clone', audio: 'k' } })).rejects.toThrow();
    await p.synthesize(e, { conn: conn('elevenlabs'), text: 'hi', voice: { kind: 'clone', audio: 'k', id: 'ivc1' } });
    expect(e.calls[0]!.url).toContain('/text-to-speech/ivc1/stream');
  });

  it('creates an instant clone', async () => {
    const e = env(() => Response.json({ voice_id: 'new1' }), { k: new Blob([new Uint8Array([1])]) });
    expect(await p.createClone!(e, conn('elevenlabs'), { kind: 'clone', audio: 'k' })).toBe('new1');
    expect(e.calls[0]!.init.body).toBeInstanceOf(FormData);
  });

  it('lists account voices before library voices and adopts library voices', async () => {
    const e = env(({ url }) => Response.json({ voices: url.includes('shared') ? [{ voice_id: 'a', name: 'A' }, { voice_id: 'b', name: 'B', public_owner_id: 'o' }] : [{ voice_id: 'a', name: 'A' }] }));
    const found = await p.search!(e, conn('elevenlabs'), 'x');
    expect(found.map((v) => v.id)).toEqual(['a', 'b']);
    const e2 = env(() => Response.json({ voice_id: 'b2' }));
    expect(await p.adopt!(e2, conn('elevenlabs'), found[1]!)).toBe('b2');
    expect(e2.calls[0]!.url).toBe('https://api.elevenlabs.io/v1/voices/add/o/b');
  });
});
