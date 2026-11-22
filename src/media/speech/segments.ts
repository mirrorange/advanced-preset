/**
 * What to speak for one message: its speech spans in text order and, with narration on, the text
 * between them. Each segment is one synthesis request (and one cache entry).
 */
import type { SpeechConnection, VoiceBinding, VoiceRef } from './types';

/** The parts of a speech span (protocol `SpeechSpan`) used here. */
export interface SpanLike {
  id: string;
  start: number;
  end: number;
  character: string;
  quote: string;
  /** Text with provider inline tags (defaults to `quote`). */
  text?: string;
  orphan?: true;
}

export interface Segment {
  /** Span id, or `n<start>` for narration. */
  id: string;
  kind: 'speech' | 'narration';
  character: string;
  /** Text sent to the provider. */
  text: string;
  /** Text as shown (speech lines without provider tags). */
  display: string;
  /** `[start, end)` in `mes`. */
  start: number;
  end: number;
}

/** Narration as spoken: no HTML / Markdown marks, collapsed whitespace; '' when nothing is speakable. */
export function spokenText(raw: string): string {
  const s = raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`#>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return /[\p{L}\p{N}]/u.test(s) ? s : '';
}

/** `speak(text, quote)`: the line as the current provider should get it (default: as written). */
export function segmentsOf(mes: string, spans: SpanLike[], narration: boolean, speak: (text: string, quote: string) => string = (t) => t): Segment[] {
  const sorted = spans.filter((s) => !s.orphan && s.end > s.start).sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let at = 0;
  const narrate = (from: number, to: number) => {
    if (!narration || to <= from) return;
    // One segment per paragraph keeps requests short and lets playback start sooner.
    let p = from;
    for (const part of mes.slice(from, to).split(/(\n\s*\n)/)) {
      const text = spokenText(part);
      if (text) out.push({ id: `n${p}`, kind: 'narration', character: '', text, display: text, start: p, end: p + part.length });
      p += part.length;
    }
  };
  for (const s of sorted) {
    if (s.start < at) continue;
    narrate(at, s.start);
    const text = speak(s.text ?? s.quote, s.quote).trim();
    if (text) out.push({ id: s.id, kind: 'speech', character: s.character, text, display: s.quote, start: s.start, end: s.end });
    at = s.end;
  }
  narrate(at, mes.length);
  return out;
}

export const norm = (s: string) => s.normalize('NFKC').trim().toLowerCase();

/** Bindings that apply in a chat with these cards (avatar keys): the global ones and those of its cards. */
export function scopedBindings(conn: SpeechConnection, cards: readonly string[]): VoiceBinding[] {
  return conn.bindings.filter((b) => !b.card || cards.includes(b.card));
}

/** The voiced binding of a character: a card's binding wins over a global one. */
export function bindingOf(bindings: readonly VoiceBinding[], character: string): VoiceBinding | undefined {
  const name = norm(character);
  const hits = bindings.filter((b) => b.voice && norm(b.character) === name);
  return hits.find((b) => b.card) ?? hits[0];
}

/**
 * Voice of a segment in a chat with these cards: narration uses the narrator voice (`null`: the
 * provider's default), and so do lines without a character; a line its character's bound voice,
 * `undefined` when the character has none.
 */
export function voiceFor(conn: SpeechConnection, seg: Pick<Segment, 'kind' | 'character'>, cards: readonly string[]): VoiceRef | null | undefined {
  if (seg.kind === 'narration' || !seg.character.trim()) return conn.narrator;
  return bindingOf(scopedBindings(conn, cards), seg.character)?.voice ?? undefined;
}

/** Stable identity of a voice for cache keys (a clone is its audio, whatever its provider id). */
export function voiceKey(v: VoiceRef | null): string {
  if (!v) return '-';
  return v.kind === 'voice' ? `v:${v.id}` : `c:${v.audio}:${v.text ?? ''}`;
}

/** FNV-1a 64-bit (hex) of a string. */
export function hash(s: string): string {
  let h = 0xcbf29ce484222325n;
  const bytes = new TextEncoder().encode(s);
  for (const b of bytes) h = BigInt.asUintN(64, (h ^ BigInt(b)) * 0x100000001b3n);
  return h.toString(16).padStart(16, '0');
}

/** Cache key of one synthesized segment: everything that changes the audio. */
export function clipKey(conn: SpeechConnection, voice: VoiceRef | null, text: string): string {
  return `tts:${hash(JSON.stringify([conn.api, conn.baseUrl.trim(), conn.model, conn.body.trim(), voiceKey(voice), text]))}`;
}
