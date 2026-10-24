/**
 * Inline annotations (I-76 – I-81): a CriticMarkup subset `{==quote==}{>>comment<<}` written by the
 * model inside the story content. AP strips the markup so `mes` stays clean and keeps the
 * annotations as text anchors (offset + quote + context) next to the message.
 *
 * Rules (I-78): only the highlight + comment pair is an annotation; optional spaces/tabs between the
 * two parts; neither part may span a paragraph break; no nesting. A lone `{==x==}` keeps `x`, a lone
 * `{>>c<<}` is removed; unterminated markers are dropped (`{==`) or kept literally (`{>>`). Other
 * CriticMarkup is left untouched.
 */

export interface Annotation {
  id: string;
  /** UTF-16 offsets into the clean text. */
  start: number;
  end: number;
  quote: string;
  /** Context before / after the quote in the clean text (up to {@link CONTEXT_CHARS}). */
  prefix: string;
  suffix: string;
  comment: string;
  /** The quote could not be found in the current text (kept, not shown). */
  orphan?: true;
}

export interface AnnotationParse {
  /** Clean text. With `final: false` only the part that can no longer change (safe to stream). */
  text: string;
  annotations: Annotation[];
  warnings: string[];
}

export const CONTEXT_CHARS = 32;

const OPEN_HL = '{==';
const CLOSE_HL = '==}';
const OPEN_CM = '{>>';
const CLOSE_CM = '<<}';
const PARA = /\n[ \t]*\n/g;

/** Index of the next paragraph break at or after `from` (or `Infinity`). */
function paraBreak(s: string, from: number): number {
  PARA.lastIndex = from;
  const m = PARA.exec(s);
  return m ? m.index : Infinity;
}

/** Length of the longest suffix of `s` that is a proper prefix of one of `tokens`. */
function partialTail(s: string, tokens: string[]): number {
  let best = 0;
  for (const t of tokens) {
    for (let n = Math.min(t.length - 1, s.length); n > best; n--) {
      if (s.endsWith(t.slice(0, n))) { best = n; break; }
    }
  }
  return best;
}

/**
 * Find `close` after `from` within the current paragraph. Returns its index, `-1` when the paragraph
 * (or, in final mode, the text) ends first, or `null` when more input is needed (streaming).
 */
function findClose(s: string, from: number, close: string, final: boolean): number | null {
  const limit = paraBreak(s, from);
  const at = s.indexOf(close, from);
  if (at >= 0 && at < limit) return at;
  if (limit !== Infinity || final) return -1;
  return null;
}

export function parseAnnotations(raw: string, opts: { final?: boolean } = {}): AnnotationParse {
  const final = opts.final ?? true;
  const warnings: string[] = [];
  const found: { start: number; end: number; quote: string; comment: string }[] = [];
  let out = '';
  let i = 0;
  let held = false;

  scan: while (i < raw.length) {
    if (raw.startsWith(OPEN_HL, i)) {
      const qs = i + OPEN_HL.length;
      const qe = findClose(raw, qs, CLOSE_HL, final);
      if (qe === null) {
        // Unterminated highlight while streaming: its text is emitted either way, the marker never.
        const rest = raw.slice(qs);
        out += rest.slice(0, rest.length - partialTail(rest, [CLOSE_HL]));
        held = true;
        break;
      }
      if (qe < 0) {
        // No `==}` in this paragraph: drop the marker, keep the text up to the break literally.
        const limit = Math.min(paraBreak(raw, qs), raw.length);
        out += raw.slice(qs, limit);
        warnings.push('annotations: unterminated `{==` dropped');
        i = limit;
        continue;
      }
      const quote = raw.slice(qs, qe);
      let k = qe + CLOSE_HL.length;
      while (k < raw.length && (raw[k] === ' ' || raw[k] === '\t')) k++;
      const start = out.length;
      out += quote;
      if (!final && (k >= raw.length || OPEN_CM.startsWith(raw.slice(k, k + OPEN_CM.length)) && k + OPEN_CM.length > raw.length)) { held = true; break; }
      if (raw.startsWith(OPEN_CM, k)) {
        const cs = k + OPEN_CM.length;
        const ce = findClose(raw, cs, CLOSE_CM, final);
        if (ce === null) { held = true; break; }
        if (ce >= 0) {
          const comment = raw.slice(cs, ce).trim();
          if (quote.trim() && comment) found.push({ start, end: out.length, quote, comment });
          else warnings.push('annotations: empty quote or comment ignored');
          i = ce + CLOSE_CM.length;
          continue;
        }
      }
      // Lone highlight (or a comment that never closes): keep the text, drop the markers.
      warnings.push('annotations: highlight without comment');
      i = qe + CLOSE_HL.length;
      continue;
    }
    if (raw.startsWith(OPEN_CM, i)) {
      const cs = i + OPEN_CM.length;
      const ce = findClose(raw, cs, CLOSE_CM, final);
      if (ce === null) { held = true; break; }
      if (ce >= 0) {
        warnings.push('annotations: comment without highlight removed');
        i = ce + CLOSE_CM.length;
        continue;
      }
      out += OPEN_CM;
      i = cs;
      continue;
    }
    if (!final && raw[i] === '{') {
      const rest = raw.slice(i);
      if (rest.length < OPEN_HL.length && (OPEN_HL.startsWith(rest) || OPEN_CM.startsWith(rest))) { held = true; break scan; }
    }
    out += raw[i];
    i++;
  }
  void held;

  const annotations = found.map((a, n): Annotation => ({
    id: `a${n + 1}`,
    start: a.start,
    end: a.end,
    quote: a.quote,
    prefix: out.slice(Math.max(0, a.start - CONTEXT_CHARS), a.start),
    suffix: out.slice(a.end, a.end + CONTEXT_CHARS),
    comment: a.comment,
  }));
  return { text: out, annotations, warnings };
}

/** True when the text contains anything that looks like annotation markup. */
export const hasAnnotationMarkup = (s: string): boolean => s.includes(OPEN_HL) || s.includes(OPEN_CM);

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

/** Best position of `a.quote` in `text` by surrounding context, tie-broken by distance to the old offset. */
export function locateQuote(text: string, a: Pick<Annotation, 'quote' | 'prefix' | 'suffix' | 'start'>): number {
  if (!a.quote) return -1;
  let best = -1;
  let bestScore = -1;
  let bestDist = Infinity;
  for (let at = text.indexOf(a.quote); at >= 0; at = text.indexOf(a.quote, at + 1)) {
    const score = commonSuffix(a.prefix, text.slice(Math.max(0, at - a.prefix.length), at))
      + commonPrefix(a.suffix, text.slice(at + a.quote.length, at + a.quote.length + a.suffix.length));
    const dist = Math.abs(at - a.start);
    if (score > bestScore || (score === bestScore && dist < bestDist)) { best = at; bestScore = score; bestDist = dist; }
  }
  return best;
}

/**
 * Re-anchor annotations to an edited text (I-79): keep exact matches, otherwise relocate the quote by
 * context; annotations whose quote is gone become orphans (and recover when it comes back).
 */
export function reanchorAnnotations(text: string, list: Annotation[]): { annotations: Annotation[]; changed: boolean } {
  let changed = false;
  const annotations = list.map((a) => {
    if (text.slice(a.start, a.end) === a.quote && !a.orphan) return a;
    const at = locateQuote(text, a);
    changed = true;
    if (at < 0) return a.orphan ? a : { ...a, orphan: true as const };
    const { orphan: _o, ...rest } = a;
    void _o;
    const end = at + a.quote.length;
    return {
      ...rest,
      start: at,
      end,
      prefix: text.slice(Math.max(0, at - CONTEXT_CHARS), at),
      suffix: text.slice(end, end + CONTEXT_CHARS),
    };
  });
  return { annotations, changed };
}

/** Write annotations back as CriticMarkup (history re-injection, I-80). Orphans and overlaps are skipped. */
export function injectAnnotations(text: string, list: Annotation[]): string {
  const live = reanchorAnnotations(text, list).annotations.filter((a) => !a.orphan).sort((x, y) => x.start - y.start);
  let out = '';
  let at = 0;
  for (const a of live) {
    if (a.start < at) continue;
    out += `${text.slice(at, a.start)}${OPEN_HL}${a.quote}${CLOSE_HL}${OPEN_CM}${a.comment}${CLOSE_CM}`;
    at = a.end;
  }
  return out + text.slice(at);
}
