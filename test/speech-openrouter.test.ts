import { afterEach, describe, expect, it, vi } from 'vitest';
import { providerFor, speakableLine, speechFormat, speechProvider, speechTags } from '@/media/speech/providers';
import { chunked, conn, drain, env } from './speech-helpers';

const pcm = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
const MP3 = new Uint8Array([0x49, 0x44, 0x33, 9, 9, 9]);
const p = speechProvider('openrouter')!;
const or = (model: string, over = {}) => conn('openrouter', { model, ...over });

/** A fake browser decoder: two channels of 0.5 and -0.5 at the requested rate. */
function stubDecoder() {
  const seen: { rate: number; bytes: number }[] = [];
  vi.stubGlobal('OfflineAudioContext', class {
    constructor(_ch: number, _len: number, readonly sampleRate: number) {}
    async decodeAudioData(buf: ArrayBuffer) {
      seen.push({ rate: this.sampleRate, bytes: buf.byteLength });
      const rate = this.sampleRate;
      return { length: 3, numberOfChannels: 2, sampleRate: rate, getChannelData: (ch: number) => new Float32Array(3).fill(ch ? -0.5 : 1) };
    }
  });
  return seen;
}
afterEach(() => vi.unstubAllGlobals());

describe('openrouter speech: capabilities by model provider', () => {
  it('takes inline tags and format notes from the provider in the model id', () => {
    expect(speechFormat(or('elevenlabs/eleven-v3'))).toBe(speechFormat({ api: 'elevenlabs', model: '' }));
    expect(speechTags(or('fish-audio/s2.1-pro'))).toBe(speechTags({ api: 'fish', model: '' }));
    expect(speechTags(or('google/gemini-3.8-flash-tts'))).toBe(speechTags({ api: 'gemini', model: '' }));
    expect(speechTags(or('minimax/speech-2.8-hd'))).toBe(speechTags({ api: 'minimax', model: '' }));
    expect(speechFormat(or('heygen/heygen-voice-1'))).toMatch(/HeyGen audio tags/);
    for (const m of ['openai/gpt-4o-mini-tts', 'mistralai/voxtral-mini-tts-2603', 'microsoft/mai-voice-2.1', 'bytedance-seed/seed-audio-1-0']) {
      expect(speechFormat(or(m))).toBe('');
      expect(speechTags(or(m))).toBeNull();
    }
    // No model: the default model (ElevenLabs v3).
    expect(speechFormat(or(''))).toBe(speechFormat({ api: 'elevenlabs', model: '' }));
  });

  it('keeps the model\'s own tags in spoken lines and drops the others', () => {
    expect(speakableLine(or('elevenlabs/eleven-v3'), '[whispers] Run. <sigh>', 'Run.')).toBe('[whispers] Run.');
    expect(speakableLine(or('google/gemini-3.8-flash-tts'), '[whispers] Run. <sigh>', 'Run.')).toBe('Run. <sigh>');
    expect(speakableLine(or('mistralai/voxtral-mini-tts-2603'), '[whispers] Run.', 'Run.')).toBe('Run.');
  });

  it('cloning only for models that take reference audio; default voices per provider', () => {
    expect(providerFor(or('fish-audio/s2.1-pro'))!.clone).toEqual({ text: 'optional' });
    expect(providerFor(or('heygen/heygen-voice-1'))!.clone).toEqual({ text: 'none' });
    expect(providerFor(or('bytedance-seed/seed-audio-1-0'))!.clone).toEqual({ text: 'none' });
    expect(providerFor(or('elevenlabs/eleven-v3'))!.clone).toBeUndefined();
    expect(providerFor(or('elevenlabs/eleven-v3'))!.voices[0]!.id).toBe('george');
    expect(providerFor(or('google/gemini-3.8-flash-tts'))!.voices[0]!.id).toBe('Kore');
    expect(providerFor(or('qwen/qwen3-tts-1.7b'))!.voices).toEqual([]);
    expect(providerFor(conn('fish'))).toBe(speechProvider('fish'));
  });
});

describe('openrouter speech: requests', () => {
  it('asks for mp3 and decodes it to 24 kHz mono PCM', async () => {
    const seen = stubDecoder();
    const e = env(() => new Response(MP3, { headers: { 'Content-Type': 'audio/mpeg' } }));
    const out = await p.synthesize(e, { conn: or('elevenlabs/eleven-v3', { body: '{"speed":1.1}' }), text: '[sad] Hi', voice: { kind: 'voice', id: 'sarah' } });
    expect(e.calls[0]!.url).toBe('https://openrouter.ai/api/v1/audio/speech');
    expect((e.calls[0]!.init.headers as Record<string, string>).Authorization).toBe('Bearer KEY');
    expect(e.calls[0]!.body).toEqual({ model: 'elevenlabs/eleven-v3', input: '[sad] Hi', response_format: 'mp3', voice: 'sarah', speed: 1.1 });
    expect(seen).toEqual([{ rate: 24000, bytes: MP3.length }]);
    expect(out.sampleRate).toBe(24000);
    // (1 + -0.5) / 2 = 0.25 → 8191 (0x1fff) per sample.
    expect([...await drain(out.chunks)]).toEqual([0xff, 0x1f, 0xff, 0x1f, 0xff, 0x1f]);
  });

  it('streams PCM for PCM-only models at their rate; default voice when none is set', async () => {
    const e = env(() => chunked(pcm, 3, { 'Content-Type': 'audio/pcm' }));
    const gem = await p.synthesize(e, { conn: or('google/gemini-3.8-flash-tts'), text: 'a', voice: null });
    expect(e.calls[0]!.body).toEqual({ model: 'google/gemini-3.8-flash-tts', input: 'a', response_format: 'pcm', voice: 'Kore' });
    expect(gem.sampleRate).toBe(24000);
    expect([...await drain(gem.chunks)]).toEqual([...pcm]);
    const hey = await p.synthesize(e, { conn: or('heygen/heygen-voice-1'), text: 'a', voice: null });
    expect(hey.sampleRate).toBe(44100);
    const rated = env(() => chunked(pcm, 3, { 'Content-Type': 'audio/pcm; rate=16000' }));
    expect((await p.synthesize(rated, { conn: or('google/gemini-2.5-pro-tts'), text: 'a', voice: null })).sampleRate).toBe(16000);
    // No published default voice: the field is left out.
    stubDecoder();
    const none = env(() => new Response(MP3, { headers: { 'Content-Type': 'audio/mpeg' } }));
    await p.synthesize(none, { conn: or('qwen/qwen3-tts-1.7b'), text: 'a', voice: null });
    expect(none.calls[0]!.body).not.toHaveProperty('voice');
  });

  it('clones with input_references (reference audio and transcript), without a voice id', async () => {
    stubDecoder();
    const audio = new Blob([new Uint8Array([7, 7])], { type: 'audio/wav' });
    const e = env(() => new Response(MP3, { headers: { 'Content-Type': 'audio/mpeg' } }), { 'voice:1': audio });
    await p.synthesize(e, { conn: or('fish-audio/s2.1-pro'), text: 'Hello', voice: { kind: 'clone', audio: 'voice:1', text: ' The transcript. ' } });
    expect(e.calls[0]!.body).toEqual({
      model: 'fish-audio/s2.1-pro', input: 'Hello', response_format: 'mp3',
      input_references: [{ type: 'input_audio', input_audio: { data: 'data:audio/wav;base64,Bwc=' } }, { type: 'text', text: 'The transcript.' }],
    });
    await expect(p.synthesize(e, { conn: or('fish-audio/s2.1-pro'), text: 'x', voice: { kind: 'clone', audio: 'gone' } })).rejects.toThrow('Reference audio is missing.');
  });

  it('lists the voices the model publishes (fetched once), filtered by the query', async () => {
    const model = { id: 'microsoft/mai-voice-2.1', output_modalities: [{ type: 'speech', supported_parameters: { voice: { type: 'enum', values: ['en-US-Harper:MAI-Voice-2.1', 'fr-FR-Soleil:MAI-Voice-2.1'] } } }] };
    const e = env(() => new Response(JSON.stringify(model)));
    const c = or('microsoft/mai-voice-2.1', { baseUrl: 'https://or.test/api/v1' });
    expect((await p.search!(e, c, '')).map((v) => v.id)).toEqual(['en-US-Harper:MAI-Voice-2.1', 'fr-FR-Soleil:MAI-Voice-2.1']);
    expect((await p.search!(e, c, 'fr-')).map((v) => v.id)).toEqual(['fr-FR-Soleil:MAI-Voice-2.1']);
    expect(e.calls.map((x) => x.url)).toEqual(['https://or.test/api/v1/audio/speech/models/microsoft/mai-voice-2.1']);
    // `unknown`: nothing listed (the id can be typed in).
    const unknown = env(() => new Response(JSON.stringify({ data: { output_modalities: [{ supported_parameters: { voice: { type: 'unknown' } } }] } })));
    expect(await p.search!(unknown, or('fish-audio/s2.1-pro', { baseUrl: 'https://or.test/api/v1' }), '')).toEqual([]);
  });
});
