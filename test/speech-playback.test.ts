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

  it('skips orphans, overlaps and unspeakable narration', () => {
    expect(segmentsOf('— …', [], true)).toEqual([]);
    expect(segmentsOf(mes, [{ ...spans[1]!, orphan: true }], false)).toEqual([]);
    expect(spokenText('<b>Hi</b> [link](http://x) **there**')).toBe('Hi link there');
  });

  it('picks bound voices, the default and the narrator', () => {
    const c = conn('fish', { voice: { kind: 'voice', id: 'def' }, bindings: [{ character: ' mia ', voice: { kind: 'voice', id: 'mia' } }] });
    expect(voiceFor(c, { kind: 'speech', character: 'Mia' })).toEqual({ kind: 'voice', id: 'mia' });
    expect(voiceFor(c, { kind: 'speech', character: 'Bob' })).toEqual({ kind: 'voice', id: 'def' });
    expect(voiceFor(c, { kind: 'narration', character: '' })).toEqual({ kind: 'voice', id: 'def' });
    expect(voiceFor({ ...c, narrator: { kind: 'voice', id: 'n' } }, { kind: 'narration', character: '' })).toEqual({ kind: 'voice', id: 'n' });
  });

  it('keys clips by what changes the audio', () => {
    const c = conn('fish');
    const v = { kind: 'voice', id: 'a' } as const;
    expect(clipKey(c, v, 'hi')).toBe(clipKey({ ...c, name: 'other', apiKey: 'x' }, v, 'hi'));
    expect(clipKey(c, v, 'hi')).not.toBe(clipKey({ ...c, model: 'm' }, v, 'hi'));
    expect(clipKey(c, { kind: 'clone', audio: 'k', id: 'x' }, 'hi')).toBe(clipKey(c, { kind: 'clone', audio: 'k' }, 'hi'));
  });
});
