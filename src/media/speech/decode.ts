/** Compressed audio (mp3, wav, …) → PCM16LE mono, with the browser's decoder. */

/** Decode `bytes`, resampled to `sampleRate` and mixed down to mono. */
export async function decodeAudio(bytes: Uint8Array, sampleRate: number): Promise<{ sampleRate: number; pcm: Uint8Array }> {
  const ctx = new OfflineAudioContext(1, 1, sampleRate);
  const buf = await ctx.decodeAudioData(bytes.slice().buffer);
  const n = buf.length;
  const mono = new Float32Array(n);
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < n; i++) mono[i]! += data[i]! / buf.numberOfChannels;
  }
  const out = new DataView(new ArrayBuffer(n * 2));
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, mono[i]!));
    out.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return { sampleRate: buf.sampleRate, pcm: new Uint8Array(out.buffer) };
}
