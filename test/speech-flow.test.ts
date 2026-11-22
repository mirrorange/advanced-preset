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

const { deleteAudio, generateLine, generateMessage, messageAudio, messageSegments, regenerate, setSegmentText, setVoiceAsker, speech } = await import('@/media/speech/service');
const { mediaRuntime, resetMedia } = await import('@/core/media-vars');
const { installSpeechRuntime } = await import('@/media/speech/service');
const { mediaSettings } = await import('@/store/media');
const { newSpeechConnection } = await import('@/media/speech/connections');
const { wavToPcm } = await import('@/media/speech/wav');

const PCM = new Uint8Array([1, 0, 2, 0, 3, 0, 4, 0]);
const mes = 'She leans in. Don\'t move, she whispers. Run!';
let requests: { url: string; body: any }[];
let asked: string[];
let answer: { voice: { kind: 'voice'; id: string }; card?: string } | null;
let ctx: Record<string, any>;
// Clips stay in memory across tests: a new model per test gives new clip keys.
let run = 0;

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
  asked = [];
  answer = { voice: { kind: 'voice', id: 'ash' }, card: 'bob.png' };
  setVoiceAsker(async (_c, name, cards) => {
    asked.push(`${name}:${cards.map((x) => x.key).join(',')}`);
    await new Promise((r) => setTimeout(r, 5));
    return answer;
  });
  preset = { id: 'p', speech: {} };
  for (const k of Object.keys(speech.clips)) delete speech.clips[k];
  ctx = { chat: [message()], characters: [{ name: 'Bob', avatar: 'bob.png' }, { name: 'Eve', avatar: 'eve.png' }], characterId: 0, extensionSettings: {}, saveChat: async () => {}, saveSettingsDebounced: () => {}, getRequestHeaders: () => ({}), eventSource: { on: () => {} }, eventTypes: {} };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
  const m = mediaSettings();
  const c = { ...newSpeechConnection('openai', 'c'), model: `m${run++}`, apiKey: 'k', bindings: [{ character: 'mia', voice: { kind: 'voice' as const, id: 'coral' } }, { character: 'Ann', voice: null }] };
  m.speech = { enabled: true, auto: false, narrator: false, active: c.id, connections: [c] };
  m.cors.mode = 'off';
  setNativeFetch(async (url, init) => {
    requests.push({ url: String(url), body: typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body });
    return new Response(PCM.slice());
  });
});

describe('speech runtime', () => {
  it('provides speech variables, format and the characters bound in this chat', () => {
    resetMedia();
    installSpeechRuntime();
    const r = mediaRuntime().speech();
    expect(r.vars).toMatchObject({ on: true, auto: false, api: 'openai', narrator: false });
    expect(r.characters).toEqual(['mia']);
    const c = mediaSettings().speech.connections[0]!;
    c.bindings.push({ character: 'Mia', voice: { kind: 'voice', id: 'x' }, card: 'bob.png' }, { character: 'Eve', voice: { kind: 'voice', id: 'y' }, card: 'eve.png' });
    expect(mediaRuntime().speech().characters).toEqual(['Mia']);
    ctx.characterId = undefined;
    expect(mediaRuntime().speech().characters).toEqual(['mia']);
    expect(r.cleaner).toBeUndefined();
    mediaSettings().speech.connections[0]!.api = 'fish';
    expect(mediaRuntime().speech().cleaner).toBeInstanceOf(RegExp);
    mediaSettings().speech.enabled = false;
    expect(mediaRuntime().speech().vars.on).toBe(false);
  });

  it('segments only when synthesis is on and the preset declares speech', () => {
    // OpenAI has no tag syntax: the clean line is spoken.
    expect(messageSegments(0).map((s) => s.text)).toEqual(['Don\'t move', 'Run!']);
    mediaSettings().speech.connections[0]!.api = 'elevenlabs';
    expect(messageSegments(0).map((s) => [s.text, s.display])).toEqual([['[whispers] Don\'t move', 'Don\'t move'], ['Run!', 'Run!']]);
    mediaSettings().speech.connections[0]!.api = 'openai';
    mediaSettings().speech.narrator = true;
    expect(messageSegments(0).map((s) => s.kind)).toEqual(['narration', 'speech', 'narration', 'speech']);
    preset = { id: 'p' };
    expect(messageSegments(0)).toEqual([]);
  });

  it('asks for the voice of an unbound character, then generates each line once and caches WAV', async () => {
    await generateMessage(0);
    expect(asked).toEqual(['Bob:bob.png']);
    expect(mediaSettings().speech.connections[0]!.bindings.at(-1)).toEqual({ character: 'Bob', voice: { kind: 'voice', id: 'ash' }, card: 'bob.png' });
    expect(requests.map((r) => [r.body.input, r.body.voice])).toEqual([['Don\'t move', 'coral'], ['Run!', 'ash']]);
    const wavs = [...stored.entries()].filter(([k]) => k.startsWith('tts:'));
    expect(wavs).toHaveLength(2);
    const pcm = wavToPcm(await wavs[0]![1].arrayBuffer())!;
    expect(pcm.sampleRate).toBe(24000);
    expect([...pcm.pcm]).toEqual([...PCM]);
    expect(Object.values(speech.clips)).toEqual(['ready', 'ready']);
    await generateMessage(0);
    expect(requests).toHaveLength(2);
    expect(asked).toHaveLength(1);
  });

  it('asks once for concurrent requests and skips the lines when cancelled', async () => {
    answer = null;
    const [, audio] = await Promise.all([generateMessage(0), messageAudio(0)]);
    expect(asked).toEqual(['Bob:bob.png']);
    expect(requests.map((r) => r.body.input)).toEqual(['Don\'t move']);
    expect(audio).not.toBeNull();
    // Cancelled this time only: asked again next time.
    answer = { voice: { kind: 'voice', id: 'ash' } };
    await generateMessage(0);
    expect(asked).toHaveLength(2);
    expect(mediaSettings().speech.connections[0]!.bindings.at(-1)).toEqual({ character: 'Bob', voice: { kind: 'voice', id: 'ash' } });
  });

  it('a binding without a voice is filled in, in its own scope', async () => {
    const c = mediaSettings().speech.connections[0]!;
    c.bindings.push({ character: 'bob', voice: null, card: 'bob.png' });
    await generateMessage(0);
    expect(c.bindings.filter((b) => b.character.toLowerCase() === 'bob')).toEqual([{ character: 'bob', voice: { kind: 'voice', id: 'ash' }, card: 'bob.png' }]);
  });

  it('deletes and regenerates audio', async () => {
    await generateMessage(0);
    const tts = () => [...stored.keys()].filter((k) => k.startsWith('tts:'));
    expect(tts()).toHaveLength(2);
    await deleteAudio(0, ['s2']);
    expect(tts()).toHaveLength(1);
    expect(Object.values(speech.clips)).toEqual(['ready']);
    await regenerate(0);
    expect(requests.map((r) => r.body.input)).toEqual(['Don\'t move', 'Run!', 'Don\'t move', 'Run!']);
    expect(tts()).toHaveLength(2);
    await deleteAudio(0);
    expect(tts()).toHaveLength(0);
    expect(Object.keys(speech.clips)).toHaveLength(0);
  });

  it('generates one line without playing it', async () => {
    await generateLine(0, 's1');
    expect(requests.map((r) => r.body.input)).toEqual(['Don\'t move']);
    expect(asked).toEqual([]);
    expect(Object.values(speech.clips)).toEqual(['ready']);
  });

  it('edits what a segment speaks: stored in the sidecar, old audio deleted, reverted with the model\'s text', async () => {
    await generateMessage(0);
    const tts = () => [...stored.keys()].filter((k) => k.startsWith('tts:'));
    await setSegmentText(0, 's2', ' Run, now! ');
    const sc = () => ctx.chat[0].extra.advanced_preset;
    expect(sc().speechText).toEqual({ s2: 'Run, now!' });
    expect(messageSegments(0).map((s) => [s.text, s.original])).toEqual([['Don\'t move', undefined], ['Run, now!', 'Run!']]);
    expect(tts()).toHaveLength(1);
    await generateMessage(0);
    expect(requests.map((r) => r.body.input)).toEqual(['Don\'t move', 'Run!', 'Run, now!']);
    // Same text again: nothing changes; the model's text (or '') removes the edit.
    await setSegmentText(0, 's2', 'Run, now!');
    expect(tts()).toHaveLength(2);
    await setSegmentText(0, 's2', 'Run!');
    expect(sc().speechText).toBeUndefined();
    expect(messageSegments(0)[1]).toMatchObject({ text: 'Run!' });
    expect(messageSegments(0)[1]!.original).toBeUndefined();
    await setSegmentText(0, 's1', 'Hold still.');
    await setSegmentText(0, 's1', '');
    expect(sc().speechText).toBeUndefined();
  });

  it('creates a clone once and keeps its id on the connection', async () => {
    const c = mediaSettings().speech.connections[0]!;
    c.api = 'elevenlabs';
    stored.set('voice:1', new Blob([new Uint8Array([7])]));
    c.bindings[0]!.voice = { kind: 'clone', audio: 'voice:1' };
    setNativeFetch(async (url, init) => {
      requests.push({ url: String(url), body: init?.body });
      return String(url).endsWith('/v1/voices/add') ? Response.json({ voice_id: 'ivc9' }) : new Response(PCM.slice());
    });
    await generateMessage(0);
    expect(requests.filter((r) => r.url.endsWith('/v1/voices/add'))).toHaveLength(1);
    expect(requests.filter((r) => r.url.includes('/text-to-speech/')).map((r) => r.url.split('/text-to-speech/')[1]!.split('/')[0])).toEqual(['ivc9', 'ash']);
    expect(c.bindings[0]!.voice).toMatchObject({ kind: 'clone', id: 'ivc9' });
  });
});
