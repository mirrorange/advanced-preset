/**
 * Locating annotations in rendered text (I-84). Pure functions over plain strings so they can be
 * tested without a DOM: a display surface is the concatenation of its visible text nodes.
 *
 * Both sides are normalised the same way (zero-width characters and Markdown emphasis marks dropped,
 * whitespace collapsed, curly / CJK quotes folded) so regex or Markdown rendering does not break the
 * match. Each surface marks an annotation at most once: the only candidate, else the best context
 * score, else the occurrence with the same index as in `mes` (quotes of 4+ characters only).
 */
import type { Annotation } from '@advanced-preset/protocol';

const SKIP = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/;
const SPACE = /\s/;
const DQ = /[“”„‟〝〞＂「」]/;
const SQ = /[‘’‚‛『』＇]/;

export interface Normalized {
  text: string;
  /** Raw index of every normalised character. */
  map: number[];
}

export function normalize(raw: string): Normalized {
  let text = '';
  const map: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    let c = raw[i]!;
    if (SKIP.test(c)) continue;
    if (SPACE.test(c)) {
      if (text.endsWith(' ')) continue;
      c = ' ';
    } else if (DQ.test(c)) c = '"';
    else if (SQ.test(c)) c = "'";
    text += c;
    map.push(i);
  }
  return { text, map };
}

const norm = (s: string) => normalize(s).text;

function occurrences(hay: string, needle: string): number[] {
  const out: number[] = [];
  if (!needle) return out;
  for (let at = hay.indexOf(needle); at >= 0; at = hay.indexOf(needle, at + 1)) out.push(at);
  return out;
}

function commonSuffix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
  return n;
}
function commonPrefix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/** Raw `[start, end)` of the annotation in the surface text, or null. */
export function matchAnnotation(surface: string, mes: string, a: Annotation, s: Normalized = normalize(surface)): [number, number] | null {
  const q = norm(a.quote).trim();
  if (!q) return null;
  const cands = occurrences(s.text, q);
  if (!cands.length) return null;
  let pick: number | undefined;
  if (cands.length === 1) pick = cands[0];
  else {
    const p = norm(a.prefix);
    const x = norm(a.suffix);
    let best = 0;
    const scored = cands.map((at) => {
      const score = commonSuffix(p, s.text.slice(Math.max(0, at - p.length), at)) + commonPrefix(x, s.text.slice(at + q.length, at + q.length + x.length));
      best = Math.max(best, score);
      return { at, score };
    });
    const index = occurrences(norm(mes.slice(0, a.start)), q).length;
    if (best > 0) {
      const top = scored.filter((c) => c.score === best);
      pick = (top.length > 1 ? top[Math.min(index, top.length - 1)] : top[0])!.at;
    } else if (q.length >= 4 && cands[index] !== undefined) pick = cands[index];
  }
  if (pick === undefined) return null;
  const start = s.map[pick]!;
  const end = s.map[pick + q.length - 1]! + 1;
  return [start, end];
}

/** Map a raw offset in the concatenation of `chunks` to `[chunk, offset]` (end offsets stay in the left chunk). */
export function locate(chunks: string[], offset: number, end = false): [number, number] {
  let at = 0;
  for (let i = 0; i < chunks.length; i++) {
    const len = chunks[i]!.length;
    if (offset < at + len || (end && offset === at + len)) return [i, offset - at];
    at += len;
  }
  return [chunks.length - 1, chunks[chunks.length - 1]?.length ?? 0];
}
