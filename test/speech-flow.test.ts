import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setNativeFetch } from '@/st/host';

const stored = new Map<string, Blob>();
vi.mock('@/store/media-db', () => ({
  putBlob: vi.fn(async (b: Blob, o: { key?: string; prefix?: string } = {}) => { const k = o.key ?? `${o.prefix ?? ''}${stored.size + 1}`; stored.set(k, b); return k; }),
  getBlob: vi.fn(async (k: string) => stored.get(k)),
  hasBlob: vi.fn(async (k: string) => stored.has(k)),
  deleteBlob: vi.fn(async (k: string) => { stored.delete(k); }),
  blobBase64: async (b: Blob) => Buffer.from(await b.arrayBuffer()).toString('base64'),
  gc: vi.fn(async () => 0),
}));
let preset: Record<string, unknown> = { id: 'p', speech: {} };
vi.mock('@/store/presets', () => ({ getPreset: () => preset }));

const { generateMessage, messageSegments, speech } = await import('@/media/speech/service');
const { mediaRuntime, resetMedia } = await import('@/core/media-vars');
const { installSpeechRuntime } = await import('@/media/speech/service');
const { mediaSettings } = await import('@/store/media');
const { newSpeechConnection } = await import('@/media/speech/connections');
const { wavToPcm } = await import('@/media/speech/wav');

const PCM = new Uint8Array([1, 0, 2, 0, 3, 0, 4, 0]);
const mes = 'She leans in. Don\'t move, she whispers. Run!';
let requests: { url: string; body: any }[];

function message() {
  const at = (q: string) => mes.indexOf(q);
  const speechSpans = [
    { id: 's1', start: at('Don'), end: at(', she'), quote: 'Don\'t move', prefix: '', suffix: '', character: 'Mia', text: '[whispers] Don\'t move' },
    { id: 's2', start: at('Run!'), end: mes.length, quote: 'Run!', prefix: '', suffix: '', character: 'Bob' },
  ];
  const sc = { v: 1, presetId: 'p', genId: 'g', origin: 'story', structures: {}, stages: [], events: [], speech: speechSpans };
  return { is_user: false, mes, swipe_id: 0, swipes: [mes], extra: { advanced_preset: sc } };
}

beforeEach(() => {
  stored.clear();
  requests = [];
  preset = { id: 'p', speech: {} };
  for (const k of Object.keys(speech.clips)) delete speech.clips[k];
  const ctx = { chat: [message()], extensionSettings: {}, saveChat: async () => {}, saveSettingsDebounced: () => {}, getRequestHeaders: () => ({}), eventSource: { on: () => {} }, eventTypes: {} };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
  const m = mediaSettings();
  const c = { ...newSpeechConnection('openai', 'c'), apiKey: 'k', bindings: [{ character: 'mia', voice: { kind: 'voice' as const, id: 'coral' } }, { character: 'Ann', voice: null }] };
  m.speech = { enabled: true, auto: false, narrator: false, active: c.id, connections: [c] };
  m.cors.mode = 'off';
  setNativeFetch(async (url, init) => {
    requests.push({ url: String(url), body: typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body });
    return new Response(PCM.slice());
  });
});

describe('speech runtime', () => {
  it('provides speech variables, format and bound characters', () => {
    resetMedia();
    installSpeechRuntime();
    const r = mediaRuntime().speech();
    expect(r.vars).toMatchObject({ on: true, auto: false, api: 'openai', narrator: false });
    expect(r.characters).toEqual(['mia']);
    expect(r.cleaner).toBeUndefined();
    mediaSettings().speech.connections[0]!.api = 'fish';
    expect(mediaRuntime().speech().cleaner).toBeInstanceOf(RegExp);
    mediaSettings().speech.enabled = false;
    expect(mediaRuntime().speech().vars.on).toBe(false);
  });

  it('segments only when synthesis is on and the preset declares speech', () => {
    expect(messageSegments(0).map((s) => s.text)).toEqual(['[whispers] Don\'t move', 'Run!']);
    mediaSettings().speech.narrator = true;
    expect(messageSegments(0).map((s) => s.kind)).toEqual(['narration', 'speech', 'narration', 'speech']);
    preset = { id: 'p' };
    expect(messageSegments(0)).toEqual([]);
  });

  it('generates each line once with its bound voice and caches WAV', async () => {
    await generateMessage(0);
    expect(requests.map((r) => [r.body.input, r.body.voice])).toEqual([['[whispers] Don\'t move', 'coral'], ['Run!', 'marin']]);
    const wavs = [...stored.entries()].filter(([k]) => k.startsWith('tts:'));
    expect(wavs).toHaveLength(2);
    const pcm = wavToPcm(await wavs[0]![1].arrayBuffer())!;
    expect(pcm.sampleRate).toBe(24000);
    expect([...pcm.pcm]).toEqual([...PCM]);
    expect(Object.values(speech.clips)).toEqual(['ready', 'ready']);
    await generateMessage(0);
    expect(requests).toHaveLength(2);
  });

  it('creates a clone once and keeps its id on the connection', async () => {
    const c = mediaSettings().speech.connections[0]!;
    c.api = 'elevenlabs';
    stored.set('voice:1', new Blob([new Uint8Array([7])]));
    c.voice = { kind: 'clone', audio: 'voice:1' };
    setNativeFetch(async (url, init) => {
      requests.push({ url: String(url), body: init?.body });
      return String(url).endsWith('/v1/voices/add') ? Response.json({ voice_id: 'ivc9' }) : new Response(PCM.slice());
    });
    await generateMessage(0);
    expect(requests.filter((r) => r.url.endsWith('/v1/voices/add'))).toHaveLength(1);
    expect(requests.at(-1)!.url).toContain('/text-to-speech/ivc9/stream');
    expect(c.voice).toMatchObject({ kind: 'clone', id: 'ivc9' });
  });
});
