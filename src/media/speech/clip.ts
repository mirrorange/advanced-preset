/**
 * A clip: synthesized PCM being received (or loaded from the cache). Several readers can follow it
 * while it fills, so a sentence can be played while its audio still streams in, and prefetched
 * clips start playing from what has already arrived.
 */
import type { PcmStream } from './types';

export type ClipState = 'loading' | 'ready' | 'error';

export class Clip {
  readonly chunks: Uint8Array[] = [];
  state: ClipState = 'loading';
  error: unknown = null;
  sampleRate = 24000;
  private waiters: (() => void)[] = [];
  private readonly ctrl = new AbortController();
  /** Settles when the clip is complete (resolves even on error; check `state`). */
  readonly done: Promise<void>;

  constructor(source: (signal: AbortSignal) => Promise<PcmStream>, onState?: (c: Clip) => void) {
    this.done = (async () => {
      try {
        const stream = await source(this.ctrl.signal);
        this.sampleRate = stream.sampleRate;
        for await (const c of stream.chunks) { this.chunks.push(c); this.wake(); }
        if (!this.bytes()) throw new Error('The provider returned no audio.');
        this.state = 'ready';
      } catch (e) {
        this.state = 'error';
        this.error = e;
      }
      this.wake();
      onState?.(this);
    })();
  }

  /** A complete clip (cache hit). */
  static of(pcm: Uint8Array, sampleRate: number): Clip {
    return new Clip(async () => ({ sampleRate, chunks: (async function* () { yield pcm; })() }));
  }

  private wake(): void {
    const w = this.waiters;
    this.waiters = [];
    for (const f of w) f();
  }

  bytes(): number { return this.chunks.reduce((n, c) => n + c.length, 0); }

  /** All PCM received so far as one array. */
  pcm(): Uint8Array {
    const out = new Uint8Array(this.bytes());
    let at = 0;
    for (const c of this.chunks) { out.set(c, at); at += c.length; }
    return out;
  }

  /** Chunks from the start, waiting for new ones until the clip completes. Throws the clip's error. */
  async *read(): AsyncGenerator<Uint8Array> {
    let i = 0;
    while (true) {
      while (i < this.chunks.length) yield this.chunks[i++]!;
      if (this.state === 'error') throw this.error;
      if (this.state === 'ready') return;
      await new Promise<void>((r) => this.waiters.push(r));
    }
  }

  abort(): void {
    if (this.state === 'loading') this.ctrl.abort();
  }
}
