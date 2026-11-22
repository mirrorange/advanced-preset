import { describe, expect, it } from 'vitest';
import { Clip } from '@/media/speech/clip';
import { PcmDecoder } from '@/media/speech/player';
import { pcmToWav, wavToPcm } from '@/media/speech/wav';
import { clipKey, segmentsOf, spokenText, voiceFor } from '@/media/speech/segments';
import { conn, drain } from './speech-helpers';

describe('wav', () => {
  it('round-trips PCM', async () => {
    const pcm = new Uint8Array([1, 0, 255, 127, 0, 128]);
    const wav = pcmToWav(pcm, 22050);
    expect(wav.size).toBe(44 + 6);
    const back = wavToPcm(await wav.arrayBuffer())!;
    expect(back.sampleRate).toBe(22050);
    expect([...back.pcm]).toEqual([...pcm]);
  });
  it('rejects other files', () => {
    expect(wavToPcm(new ArrayBuffer(60))).toBeNull();
  });
});

describe('PcmDecoder', () => {
  it('decodes samples split across chunks', () => {
    const d = new PcmDecoder();
    const a = d.push(new Uint8Array([0x00, 0x40, 0xff]));
    const b = d.push(new Uint8Array([0x7f, 0x00, 0x80]));
    expect([...a]).toEqual([0.5]);
    expect([...b].map((x) => Math.round(x * 1000) / 1000)).toEqual([1, -1]);
  });
});

describe('Clip', () => {
  it('lets readers follow while it fills, and settles ready', async () => {
    let push!: (b: Uint8Array | null) => void;
    const queue: (Uint8Array | null)[] = [];
    let wake: (() => void) | null = null;
    push = (b) => { queue.push(b); wake?.(); };
    const clip = new Clip(async () => ({
      sampleRate: 16000,
      chunks: (async function* () {
        while (true) {
          if (!queue.length) await new Promise<void>((r) => { wake = r; });
          const b = queue.shift()!;
          if (!b) return;
          yield b;
        }
      })(),
    }));
    const reading = drain(clip.read());
    push(new Uint8Array([1, 2]));
    push(new Uint8Array([3]));
    push(null);
    expect([...await reading]).toEqual([1, 2, 3]);
    await clip.done;
    expect(clip.state).toBe('ready');
    expect(clip.sampleRate).toBe(16000);
    expect([...await drain(clip.read())]).toEqual([1, 2, 3]);
  });

  it('reports errors and empty audio', async () => {
    const bad = new Clip(async () => { throw new Error('nope'); });
    await bad.done;
    expect(bad.state).toBe('error');
    await expect(drain(bad.read())).rejects.toThrow('nope');
    const empty = new Clip(async () => ({ sampleRate: 1, chunks: (async function* () {})() }));
    await empty.done;
    expect(empty.state).toBe('error');
  });
});

describe('segments', () => {
  const mes = '*She leans in.* Don\'t move, she says.\n\nThe wind rises. Run!';
  const spans = [
    { id: 's2', start: mes.indexOf('Run!'), end: mes.length, character: 'Mia', quote: 'Run!', text: '[shouting] Run!' },
    { id: 's1', start: mes.indexOf('Don'), end: mes.indexOf(', she'), character: 'Mia', quote: 'Don\'t move' },
  ];

  it('orders spans and keeps provider text', () => {
    expect(segmentsOf(mes, spans, false).map((s) => [s.id, s.text])).toEqual([['s1', 'Don\'t move'], ['s2', '[shouting] Run!']]);
  });

  it('adds narration per paragraph between spans', () => {
    const segs = segmentsOf(mes, spans, true);
    expect(segs.map((s) => [s.kind, s.text])).toEqual([
      ['narration', 'She leans in.'],
      ['speech', 'Don\'t move'],
      ['narration', ', she says.'],
      ['narration', 'The wind rises.'],
      ['speech', '[shouting] Run!'],
    ]);
    for (const s of segs) expect(mes.slice(s.start, s.end)).toContain(s.kind === 'speech' ? mes.slice(s.start, s.end) : s.text.slice(0, 3));
  });

  it('applies the user\'s edits by segment id and keeps the model\'s text', () => {
    const segs = segmentsOf(mes, spans, true, undefined, { s1: '[sighs] Don\'t move ', n0: ' She leans in. ', gone: 'x', s2: '' });
    expect(segs.map((s) => [s.id, s.text, s.original])).toEqual([
      ['n0', 'She leans in.', undefined],
      ['s1', '[sighs] Don\'t move', 'Don\'t move'],
      ['n26', ', she says.', undefined],
      ['n39', 'The wind rises.', undefined],
      ['s2', '[shouting] Run!', undefined],
    ]);
  });

  it('skips orphans, overlaps and unspeakable narration', () => {
    expect(segmentsOf('— …', [], true)).toEqual([]);
    expect(segmentsOf(mes, [{ ...spans[1]!, orphan: true }], false)).toEqual([]);
    expect(spokenText('<b>Hi</b> [link](http://x) **there**')).toBe('Hi link there');
  });

  it('picks bound voices (a card\'s over a global one), the narrator, and none for unbound characters', () => {
    const v = (id: string) => ({ kind: 'voice', id }) as const;
    const c = conn('fish', { narrator: v('n'), bindings: [
      { character: ' mia ', voice: v('mia') },
      { character: 'Mia', voice: v('mia-card'), card: 'a.png' },
      { character: 'Bob', voice: v('bob'), card: 'b.png' },
      { character: 'Ann', voice: null },
    ] });
    const line = (character: string) => ({ kind: 'speech', character }) as const;
    expect(voiceFor(c, line('Mia'), [])).toEqual(v('mia'));
    expect(voiceFor(c, line('Mia'), ['a.png'])).toEqual(v('mia-card'));
    expect(voiceFor(c, line('Bob'), ['a.png'])).toBeUndefined();
    expect(voiceFor(c, line('Bob'), ['a.png', 'b.png'])).toEqual(v('bob'));
    expect(voiceFor(c, line('Ann'), [])).toBeUndefined();
    expect(voiceFor(c, { kind: 'narration', character: '' }, [])).toEqual(v('n'));
    expect(voiceFor(c, line(' '), [])).toEqual(v('n'));
    expect(voiceFor({ ...c, narrator: null }, { kind: 'narration', character: '' }, [])).toBeNull();
  });

  it('keys clips by what changes the audio', () => {
    const c = conn('fish');
    const v = { kind: 'voice', id: 'a' } as const;
    expect(clipKey(c, v, 'hi')).toBe(clipKey({ ...c, name: 'other', apiKey: 'x' }, v, 'hi'));
    expect(clipKey(c, v, 'hi')).not.toBe(clipKey({ ...c, model: 'm' }, v, 'hi'));
    expect(clipKey(c, { kind: 'clone', audio: 'k', id: 'x' }, 'hi')).toBe(clipKey(c, { kind: 'clone', audio: 'k' }, 'hi'));
  });
});

describe('speakable lines', async () => {
  const { speakableLine } = await import('@/media/speech/providers');
  const { changeSpeechApi } = await import('@/media/speech/connections');

  it('uses the clean line when the provider has no tags', () => {
    expect(speakableLine('openai', '[whispering] "Anyone there?"', '"Anyone there?"')).toBe('"Anyone there?"');
    expect(speakableLine('deepseek', '<sigh> Fine.', 'Fine.')).toBe('Fine.');
  });

  it('keeps own tags and drops other providers\' tags', () => {
    expect(speakableLine('fish', '[whispering] Hi', 'Hi')).toBe('[whispering] Hi');
    expect(speakableLine('minimax', 'Oh(sighs) <#0.5#> no', 'Oh no')).toBe('Oh(sighs) <#0.5#> no');
    expect(speakableLine('minimax', '[whispering] Oh(sighs) no', 'Oh no')).toBe('Oh(sighs) no');
    expect(speakableLine('gemini', '[whispering] Wait <sigh> no', 'Wait no')).toBe('Wait <sigh> no');
  });

  it('switching API keeps the characters and their cards and clears voices', () => {
    const c = conn('fish', { narrator: { kind: 'voice', id: 'a' }, bindings: [{ character: 'Mia', voice: { kind: 'voice', id: 'b' } }, { character: 'Bob', voice: { kind: 'voice', id: 'c' }, card: 'bob.png' }] });
    changeSpeechApi(c, 'openai');
    expect(c.bindings).toEqual([{ character: 'Mia', voice: null }, { character: 'Bob', voice: null, card: 'bob.png' }]);
    expect(c.narrator).toBeNull();
    expect(c.baseUrl).toBe('https://api.openai.com/v1');
  });
});
