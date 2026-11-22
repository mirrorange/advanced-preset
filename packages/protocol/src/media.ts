/**
 * Image generation and speech synthesis (AP 1.12). Presets opt in with `image` / `speech` in the
 * manifest; requests are made by AP's front end. The preset only sees condition variables
 * (`image.*`, `speech.*`) and a few macros; connection settings, style prompts and voices stay in AP.
 *
 * - `kind: image`: a regular structure after the content, `{ images: ImagePrompt[] }`.
 * - `kind: speech`: an inline structure, `<speech character="Name">line</speech>` inside the story
 *   content. AP strips the markup (`mes` keeps the line) and stores the spans as text anchors, like
 *   annotations. Provider tags inside a line (`<whisper>`, `[laugh]`) are kept for synthesis
 *   (`SpeechSpan.text`) and removed from the displayed text.
 */
import { CONTEXT_CHARS, locateQuote } from './annotations';
import { unescapeXml } from './tags';

/** First Advanced Preset version with image generation and speech synthesis. */
export const MEDIA_SINCE = '1.12.0';

/** `image` in the manifest (reserved for options). */
export type ImageDecl = Record<string, never>;
/** `speech` in the manifest (reserved for options; the tag name is the speech structure's `tag`). */
export type SpeechDecl = Record<string, never>;

export type ImageApi = 'openai' | 'gemini' | 'novelai' | 'openrouter';
export const IMAGE_APIS: readonly ImageApi[] = ['openai', 'gemini', 'novelai', 'openrouter'];
/**
 * How image prompts are written, chosen per connection: comma-separated Danbooru-style `tags`
 * (NovelAI), a plain English `description` (SD / Midjourney-like models), or an `instruction` that
 * may state requirements directly, in any language (multimodal image models).
 */
export type ImagePromptType = 'tags' | 'description' | 'instruction';
export const IMAGE_PROMPT_TYPES: readonly ImagePromptType[] = ['tags', 'description', 'instruction'];
/** Prompt type of a new connection of an API (NovelAI: tags; OpenAI, Gemini, OpenRouter: instruction). */
export const defaultImagePromptType = (api: ImageApi): ImagePromptType => (api === 'novelai' ? 'tags' : 'instruction');
export type SpeechApi = 'fish' | 'elevenlabs' | 'minimax' | 'gemini' | 'openai' | 'deepseek' | 'openrouter';
export const SPEECH_APIS: readonly SpeechApi[] = ['fish', 'elevenlabs', 'minimax', 'gemini', 'openai', 'deepseek', 'openrouter'];

/** `image.*` condition variables. */
export interface ImageVars {
  /** The preset declares `image`, the user turned image generation on and a connection is selected. */
  on: boolean;
  /** Images are generated as soon as the reply arrives. */
  auto: boolean;
  /** API type of the selected connection (`''` when off). */
  api: '' | ImageApi;
  /** Prompt type of the selected connection (`''` when off): how prompts are to be written. */
  prompt: '' | ImagePromptType;
  /** The connection adds its own style prompt: prompts should not describe a style. */
  style: boolean;
  /** NSFW blocking is on: no prompts for NSFW scenes. */
  sfw: boolean;
  /** Reference images are offered ({{ap::image::refs}}: global ones and those of the chat's cards; openai / gemini / openrouter). */
  refs: boolean;
}

/** `speech.*` condition variables. */
export interface SpeechVars {
  on: boolean;
  auto: boolean;
  api: '' | SpeechApi;
  /** Narration (text outside speech tags) is voiced too. */
  narrator: boolean;
  /** Some characters have a bound voice ({{ap::speech::characters}} is not empty). */
  characters: boolean;
}

export const IMAGE_OFF: ImageVars = { on: false, auto: false, api: '', prompt: '', style: false, sfw: false, refs: false };
export const SPEECH_OFF: SpeechVars = { on: false, auto: false, api: '', narrator: false, characters: false };

/** Reference image offered to the model (`{{ap::image::refs}}`). */
export interface ImageRef { id: string; description: string }

/** `{{ap::image::refs}}`: one `- <id>: <description>` line per reference image. */
export const imageRefsText = (refs: readonly ImageRef[] | undefined): string =>
  (refs ?? []).map((r) => `- ${r.id}: ${r.description}`.trimEnd()).join('\n');

// ---- image structure ----------------------------------------------------------------------------

export const IMAGE_RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9'] as const;
export type ImageRatio = (typeof IMAGE_RATIOS)[number];

export interface ImagePrompt {
  /** Tags, a description or an instruction (as the preset asks for `image.prompt`). */
  prompt: string;
  /** Reference image ids (openai / gemini). */
  refs?: string[];
  ratio?: ImageRatio;
  /** Short title shown under the image. */
  caption?: string;
}
/** Value of an image structure. */
export interface ImagePromptValue { images: ImagePrompt[] }

/** Sub-fields of an image prompt, in schema order. */
export const IMAGE_FIELDS = ['prompt', 'refs', 'ratio', 'caption'] as const;

const asText = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));

/** `'a, b'` / `['a', 'b']` → ids. */
export function refList(v: unknown): string[] {
  const items = Array.isArray(v) ? v.map(asText) : typeof v === 'string' ? v.split(/[,，、\n]/) : [];
  return [...new Set(items.map((s) => s.trim()).filter(Boolean))];
}

/** Lenient ratio: `16:9`, `16x9`, `16/9`, full-width colon; unknown ratios are dropped. */
export function normalizeRatio(v: unknown): ImageRatio | undefined {
  const s = asText(v).trim().replace(/[：xX×/]/g, ':').replace(/\s+/g, '');
  return (IMAGE_RATIOS as readonly string[]).includes(s) ? (s as ImageRatio) : undefined;
}

/** One image prompt from a loose object; `undefined` without a prompt. */
export function imagePromptOf(o: Record<string, unknown>): ImagePrompt | undefined {
  const prompt = asText(o.prompt ?? o.description ?? o.text).trim();
  if (!prompt) return undefined;
  const out: ImagePrompt = { prompt };
  const refs = refList(o.refs ?? o.references);
  if (refs.length) out.refs = refs;
  const ratio = normalizeRatio(o.ratio ?? o.aspect_ratio ?? o.aspectRatio);
  if (ratio) out.ratio = ratio;
  const caption = asText(o.caption ?? o.title).trim();
  if (caption) out.caption = caption;
  return out;
}

/** Image structure value from JSON (array, `{ images }`, one prompt object or a bare prompt); `undefined` when empty. */
export function normalizeImages(value: unknown, max?: number): ImagePromptValue | undefined {
  if (typeof value === 'string') {
    const t = value.trim();
    if (t.startsWith('[') || t.startsWith('{')) { try { value = JSON.parse(t); } catch { /* a prompt */ } }
    if (typeof value === 'string') value = t ? [{ prompt: t }] : [];
  }
  if (value && typeof value === 'object' && !Array.isArray(value) && Array.isArray((value as { images?: unknown }).images)) value = (value as { images: unknown[] }).images;
  const list = Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : [];
  const images = list
    .map((x) => (x && typeof x === 'object' ? imagePromptOf(x as Record<string, unknown>) : imagePromptOf({ prompt: x })))
    .filter((x): x is ImagePrompt => Boolean(x));
  const kept = max && max > 0 ? images.slice(0, max) : images;
  return kept.length ? { images: kept } : undefined;
}

// ---- inline speech ------------------------------------------------------------------------------

export const DEFAULT_SPEECH_TAG = 'speech';
/** The fixed attribute naming the speaking character. */
export const SPEECH_CHARACTER_ATTR = 'character';

export interface SpeechSpan {
  id: string;
  /** UTF-16 offsets into the clean text. */
  start: number;
  end: number;
  /** The displayed line (provider tags removed). */
  quote: string;
  prefix: string;
  suffix: string;
  /** Character name as written by the model. */
  character: string;
  /** The line with provider tags, for synthesis (absent: same as `quote`). */
  text?: string;
  /** The quote could not be found in the current text (kept, not shown). */
  orphan?: true;
}

/** Text a span is synthesised from. */
export const speechText = (s: Pick<SpeechSpan, 'quote' | 'text'>): string => s.text ?? s.quote;

/**
 * Removes provider tags from a line for display. A RegExp matches the tags to remove (global flag
 * implied); a function does the whole job.
 */
export type SpeechCleaner = RegExp | ((line: string) => string);

/** Default provider tags: `<tag>` `</tag>` `<tag/>` (attributes allowed) and short `[tag]`. */
export const DEFAULT_SPEECH_TAGS = /<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>|\[[^\[\]\n]{1,40}\]/g;

/** Remove provider tags from a line, without leaving doubled or edge spaces the line did not have. */
export function cleanSpeechLine(line: string, cleaner: SpeechCleaner = DEFAULT_SPEECH_TAGS): string {
  if (typeof cleaner === 'function') return cleaner(line);
  const re = cleaner.global ? cleaner : new RegExp(cleaner.source, `${cleaner.flags}g`);
  re.lastIndex = 0;
  const stripped = line.replace(re, '');
  if (stripped === line) return line;
  let out = stripped.replace(/([ \t])[ \t]+/g, '$1');
  if (!/^\s/.test(line)) out = out.replace(/^\s+/, '');
  if (!/\s$/.test(line)) out = out.replace(/\s+$/, '');
  return out;
}

export interface SpeechParse {
  /** Clean text. With `final: false` only the part that can no longer change (safe to stream). */
  text: string;
  spans: SpeechSpan[];
  warnings: string[];
  /**
   * Position in the clean text of an offset into the input (exact outside speech lines, clamped to
   * the line inside one).
   */
  map: (offset: number) => number;
}

export interface SpeechParseOptions {
  /** Tag name (the speech structure's `tag`, default `speech`). */
  tag?: string;
  final?: boolean;
  cleaner?: SpeechCleaner;
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

/** Streaming: cut an unfinished provider tag (`<whis`, `[lau`) off the end of a line. */
function heldLine(line: string): string {
  const lt = line.lastIndexOf('<');
  const lb = line.lastIndexOf('[');
  let cut = line.length;
  if (lt >= 0 && !line.includes('>', lt)) cut = Math.min(cut, lt);
  if (lb >= 0 && !line.includes(']', lb) && line.length - lb <= 41) cut = Math.min(cut, lb);
  return line.slice(0, cut);
}

/**
 * Parse `<tag character="Name">line</tag>` spans. Rules: no nesting (an inner opening tag is
 * dropped); a closing tag without an opening one is removed; an unterminated opening tag keeps its
 * text and loses the marker (final) or holds back the line's markup (streaming).
 */
export function parseSpeech(raw: string, opts: SpeechParseOptions = {}): SpeechParse {
  const tag = opts.tag || DEFAULT_SPEECH_TAG;
  const final = opts.final ?? true;
  const cleaner = opts.cleaner ?? DEFAULT_SPEECH_TAGS;
  const warnings: string[] = [];
  const openRe = new RegExp(`<${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s[^<>]*)?>`, 'g');
  const close = `</${tag}>`;
  const openToken = `<${tag}`;
  /** Copied runs: input start, output start, length. Lines: input range → output range. */
  const runs: { in: number; out: number; len: number }[] = [];
  const lines: { inStart: number; inEnd: number; outStart: number; outEnd: number }[] = [];
  const found: { start: number; end: number; quote: string; text: string; character: string }[] = [];
  let out = '';
  let i = 0;
  const copy = (from: number, to: number) => {
    if (to <= from) return;
    runs.push({ in: from, out: out.length, len: to - from });
    out += raw.slice(from, to);
  };

  while (i < raw.length) {
    openRe.lastIndex = i;
    const m = openRe.exec(raw);
    const closeAt = raw.indexOf(close, i);
    // A stray closing tag before the next opening one: removed.
    if (closeAt >= 0 && (!m || closeAt < m.index)) {
      copy(i, closeAt);
      warnings.push(`speech: </${tag}> without <${tag}> removed`);
      i = closeAt + close.length;
      continue;
    }
    if (!m) {
      let end = raw.length;
      if (!final) {
        // Streaming: hold back a trailing fragment that may become a tag (`<spe`, `</sp`, `<speech charac`).
        end -= partialTail(raw.slice(i), [openToken, close]);
        const lt = raw.lastIndexOf(openToken);
        if (lt >= i && !raw.includes('>', lt)) {
          const next = raw[lt + openToken.length];
          if (next === undefined || /\s/.test(next)) end = Math.min(end, lt);
        }
      }
      copy(i, end);
      break;
    }
    copy(i, m.index);
    const attrs = m[1] ?? '';
    const character = unescapeXml(/\bcharacter\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(attrs)?.slice(1).find((x) => x !== undefined) ?? '').trim();
    const innerStart = m.index + m[0].length;
    const end = raw.indexOf(close, innerStart);
    // Nested opening tag before the close: dropped.
    openRe.lastIndex = innerStart;
    const nested = openRe.exec(raw);
    if (end < 0) {
      // Unterminated: keep the text without the marker.
      const rest = raw.slice(innerStart);
      if (!final) {
        const line = cleanSpeechLine(heldLine(rest.slice(0, rest.length - partialTail(rest, [close]))), cleaner);
        out += line;
        break;
      }
      warnings.push(`speech: unterminated <${tag}> dropped`);
      i = innerStart;
      continue;
    }
    let inner = raw.slice(innerStart, end);
    if (nested && nested.index < end) {
      warnings.push(`speech: nested <${tag}> dropped`);
      inner = inner.replace(new RegExp(openRe.source, 'g'), '');
    }
    const line = cleanSpeechLine(inner, cleaner);
    const start = out.length;
    out += line;
    lines.push({ inStart: m.index, inEnd: end + close.length, outStart: start, outEnd: out.length });
    if (line.trim()) found.push({ start, end: out.length, quote: line, text: inner, character });
    else warnings.push('speech: empty line ignored');
    if (!character) warnings.push('speech: line without a character');
    i = end + close.length;
  }

  const spans = found.map((s, n): SpeechSpan => ({
    id: `s${n + 1}`,
    start: s.start,
    end: s.end,
    quote: s.quote,
    prefix: out.slice(Math.max(0, s.start - CONTEXT_CHARS), s.start),
    suffix: out.slice(s.end, s.end + CONTEXT_CHARS),
    character: s.character,
    ...(s.text !== s.quote ? { text: s.text } : {}),
  }));
  const map = (offset: number): number => {
    for (const r of runs) if (offset >= r.in && offset <= r.in + r.len) return r.out + (offset - r.in);
    for (const l of lines) if (offset >= l.inStart && offset <= l.inEnd) return Math.min(l.outEnd, l.outStart + Math.max(0, offset - l.inStart));
    const before = runs.filter((r) => r.in + r.len <= offset).at(-1);
    return before ? before.out + before.len : 0;
  };
  return { text: out, spans, warnings, map };
}

/** True when the text contains an opening or closing speech tag. */
export const hasSpeechMarkup = (s: string, tag = DEFAULT_SPEECH_TAG): boolean => s.includes(`<${tag}`) || s.includes(`</${tag}>`);

/** Re-anchor speech spans to an edited text (same rules as annotations). */
export function reanchorSpeech(text: string, list: SpeechSpan[]): { spans: SpeechSpan[]; changed: boolean } {
  let changed = false;
  const spans = list.map((s) => {
    if (text.slice(s.start, s.end) === s.quote && !s.orphan) return s;
    const at = locateQuote(text, s);
    changed = true;
    if (at < 0) return s.orphan ? s : { ...s, orphan: true as const };
    const { orphan: _o, ...rest } = s;
    void _o;
    const end = at + s.quote.length;
    return { ...rest, start: at, end, prefix: text.slice(Math.max(0, at - CONTEXT_CHARS), at), suffix: text.slice(end, end + CONTEXT_CHARS) };
  });
  return { spans, changed };
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Write spans back as markup (history re-injection), with the provider tags of each line. Orphans and overlaps are skipped. */
export function injectSpeech(text: string, list: SpeechSpan[], tag = DEFAULT_SPEECH_TAG): string {
  const live = reanchorSpeech(text, list).spans.filter((s) => !s.orphan).sort((x, y) => x.start - y.start);
  let out = '';
  let at = 0;
  for (const s of live) {
    if (s.start < at) continue;
    out += `${text.slice(at, s.start)}<${tag} ${SPEECH_CHARACTER_ATTR}="${escapeAttr(s.character)}">${speechText(s)}</${tag}>`;
    at = s.end;
  }
  return out + text.slice(at);
}

/**
 * Move anchors (annotations parsed before the speech markup was removed) onto the speech-clean
 * text: their quote and context lose the markup, the old offset (mapped) breaks ties.
 */
export function realignAnchors<T extends { start: number; end: number; quote: string; prefix: string; suffix: string; orphan?: true }>(
  text: string, list: T[], parsed: Pick<SpeechParse, 'map'>, strips: ((s: string) => string)[],
): T[] {
  return list.map((a) => {
    const start = parsed.map(a.start);
    for (const strip of strips) {
      const quote = strip(a.quote);
      const at = quote ? locateQuote(text, { quote, prefix: strip(a.prefix), suffix: strip(a.suffix), start }) : -1;
      if (at < 0) continue;
      const end = at + quote.length;
      const { orphan: _o, ...rest } = a;
      void _o;
      return { ...rest, start: at, end, quote, prefix: text.slice(Math.max(0, at - CONTEXT_CHARS), at), suffix: text.slice(end, end + CONTEXT_CHARS) } as T;
    }
    return { ...a, orphan: true as const };
  });
}

/**
 * Speech lines of a text that may also carry anchors parsed from it before (annotations): the
 * clean text, the lines, and the anchors moved onto the clean text.
 */
export function parseSpeechWith<T extends { start: number; end: number; quote: string; prefix: string; suffix: string; orphan?: true }>(
  raw: string, anchors: T[] | undefined, opts: Omit<SpeechParseOptions, 'final'> = {},
): { text: string; spans: SpeechSpan[]; anchors: T[] | undefined; warnings: string[] } {
  const r = parseSpeech(raw, opts);
  if (!anchors?.length) return { text: r.text, spans: r.spans, anchors, warnings: r.warnings };
  const tagged = (s: string) => parseSpeech(s, opts).text;
  const cleaned = (s: string) => cleanSpeechLine(tagged(s), opts.cleaner);
  return { text: r.text, spans: r.spans, anchors: realignAnchors(r.text, anchors, r, [tagged, cleaned]), warnings: r.warnings };
}
