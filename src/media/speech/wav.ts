/** PCM16LE mono ⇄ WAV (cache entries and downloads are WAV files). */

export function pcmToWav(pcm: Uint8Array, sampleRate: number): Blob {
  const len = pcm.length & ~1;
  const head = new DataView(new ArrayBuffer(44));
  const str = (at: number, s: string) => { for (let i = 0; i < s.length; i++) head.setUint8(at + i, s.charCodeAt(i)); };
  str(0, 'RIFF');
  head.setUint32(4, 36 + len, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  head.setUint32(16, 16, true);
  head.setUint16(20, 1, true);
  head.setUint16(22, 1, true);
  head.setUint32(24, sampleRate, true);
  head.setUint32(28, sampleRate * 2, true);
  head.setUint16(32, 2, true);
  head.setUint16(34, 16, true);
  str(36, 'data');
  head.setUint32(40, len, true);
  return new Blob([head.buffer, pcm.slice(0, len)], { type: 'audio/wav' });
}

/** PCM of a WAV file written by {@link pcmToWav} (16-bit mono), or null for anything else. */
export function wavToPcm(buf: ArrayBuffer): { sampleRate: number; pcm: Uint8Array } | null {
  const v = new DataView(buf);
  if (buf.byteLength < 44) return null;
  const tag = (at: number) => String.fromCharCode(v.getUint8(at), v.getUint8(at + 1), v.getUint8(at + 2), v.getUint8(at + 3));
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return null;
  let at = 12;
  let sampleRate = 0;
  while (at + 8 <= buf.byteLength) {
    const id = tag(at);
    const size = v.getUint32(at + 4, true);
    if (id === 'fmt ') {
      if (v.getUint16(at + 8, true) !== 1 || v.getUint16(at + 10, true) !== 1 || v.getUint16(at + 22, true) !== 16) return null;
      sampleRate = v.getUint32(at + 12, true);
    } else if (id === 'data') {
      if (!sampleRate) return null;
      return { sampleRate, pcm: new Uint8Array(buf, at + 8, Math.min(size, buf.byteLength - at - 8)) };
    }
    at += 8 + size + (size & 1);
  }
  return null;
}
