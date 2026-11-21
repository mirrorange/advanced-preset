/**
 * PCM playback through Web Audio: chunks are scheduled back to back as they arrive, so streaming
 * clips start after the first ~100 ms of audio. One shared AudioContext (created on first use, which
 * is always a user gesture); pause / resume suspend it.
 */
import type { Clip } from './clip';

let ctx: AudioContext | null = null;
function audio(): AudioContext {
  if (!ctx || ctx.state === 'closed') ctx = new AudioContext();
  return ctx;
}

/** Bytes → float samples; an odd trailing byte is carried to the next chunk. */
export class PcmDecoder {
  private carry: number | null = null;
  push(bytes: Uint8Array): Float32Array {
    const extra = this.carry === null ? 0 : 1;
    const n = (bytes.length + extra) >> 1;
    const out = new Float32Array(n);
    let i = 0;
    let k = 0;
    if (this.carry !== null && bytes.length) {
      out[k++] = toFloat(this.carry | (bytes[0]! << 8));
      i = 1;
      this.carry = null;
    }
    for (; i + 1 < bytes.length; i += 2) out[k++] = toFloat(bytes[i]! | (bytes[i + 1]! << 8));
    if (i < bytes.length) this.carry = bytes[i]!;
    return k === n ? out : out.subarray(0, k);
  }
}

const toFloat = (u: number) => ((u & 0x8000 ? u - 0x10000 : u) / 0x8000);

const MIN_BLOCK = 0.1;

export class Playback {
  private sources = new Set<AudioBufferSourceNode>();
  private stopped = false;
  /** Seconds of audio scheduled so far. */
  scheduled = 0;

  constructor(private readonly clip: Clip) {}

  /** Play the clip to its end. Resolves when playback finished or was stopped; rejects on a clip error. */
  async run(): Promise<void> {
    const ac = audio();
    if (ac.state === 'suspended') await ac.resume().catch(() => undefined);
    const rate = this.clip.sampleRate;
    const dec = new PcmDecoder();
    let pending: Float32Array[] = [];
    let pendingLen = 0;
    let next = 0;
    let last = null as AudioBufferSourceNode | null;
    const flush = () => {
      if (!pendingLen || this.stopped) return;
      const buf = ac.createBuffer(1, pendingLen, rate);
      const data = buf.getChannelData(0);
      let at = 0;
      for (const p of pending) { data.set(p, at); at += p.length; }
      pending = [];
      pendingLen = 0;
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.connect(ac.destination);
      next = Math.max(next, ac.currentTime + 0.05);
      src.start(next);
      next += buf.duration;
      this.scheduled += buf.duration;
      this.sources.add(src);
      src.onended = () => this.sources.delete(src);
      last = src;
    };
    for await (const chunk of this.clip.read()) {
      if (this.stopped) return;
      const f = dec.push(chunk);
      if (!f.length) continue;
      pending.push(f);
      pendingLen += f.length;
      if (pendingLen >= rate * MIN_BLOCK) flush();
    }
    flush();
    const tail = last as AudioBufferSourceNode | null;
    if (!tail || this.stopped) return;
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      if (!this.sources.has(tail)) return done();
      tail.addEventListener('ended', done, { once: true });
      this.onStop = done;
    });
  }

  private onStop: (() => void) | null = null;

  stop(): void {
    this.stopped = true;
    for (const s of this.sources) { try { s.stop(); } catch { /* not started */ } }
    this.sources.clear();
    this.onStop?.();
  }
}

export async function pausePlayback(): Promise<void> { if (ctx?.state === 'running') await ctx.suspend(); }
export async function resumePlayback(): Promise<void> { if (ctx?.state === 'suspended') await ctx.resume(); }
