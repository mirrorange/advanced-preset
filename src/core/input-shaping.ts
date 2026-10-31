/**
 * Input shaping (I-128 – I-131). The interceptor (or the script-path backfill) marks the user
 * message that ends the chat history; at PROMPT_READY the marked message is found again among the
 * history messages of the final prompt and, depending on the preset's `inputShaping`, wrapped in
 * place (`wrap`) or taken out (`extract`, placed by `{{ap::input::text}}`).
 *
 * Only the user message the history ends with is shaped: depth injections and other messages ST
 * inserts after it don't matter, generations whose history ends with an assistant message
 * (continue, /trigger, other extensions) are left alone.
 */
import { wrapInput, type InputShaping } from '@advanced-preset/protocol';
import type { ChatMessage } from '@/st/host';

/** Marks the input message (supplementary private use, distinct from the cache markers `⟦U+E000…U+F8FF⟧`). */
export const INPUT_MARK = '⟦\uDB80\uDC00⟧';
/** Stands for the input text in region output until the text is known (`{{ap::input::text}}`). */
export const INPUT_SLOT = '⟦\uDB80\uDC01⟧';

const TRAILING_CACHE_MARKS = /(?:⟦[\uE000-\uF8FF]⟧)+$/;

/** The message text with the input mark, placed before a trailing cache marker. */
export function markInput(mes: string): string {
  const tail = mes.match(TRAILING_CACHE_MARKS)?.[0] ?? '';
  return mes.slice(0, mes.length - tail.length) + INPUT_MARK + tail;
}

/** Text of a marked message as it was handed to ST (no markers, `\r` dropped like ST does). */
export const inputText = (mes: string): string => mes.replace(TRAILING_CACHE_MARKS, '').replaceAll(INPUT_MARK, '');

const strip = (s: string) => s.replaceAll(INPUT_MARK, '');

/** Removes every input mark (nothing marked may reach the model). */
export function stripInputMarks(list: ChatMessage[]): void {
  for (const m of list) {
    if (typeof m.content === 'string') { if (m.content.includes(INPUT_MARK)) m.content = strip(m.content); continue; }
    if (Array.isArray(m.content)) for (const p of m.content as any[]) if (p && typeof p === 'object' && typeof p.text === 'string' && p.text.includes(INPUT_MARK)) p.text = strip(p.text);
  }
}

/** Where the input sits: message `index`, text part `part` (array content) and its surroundings. */
export interface InputLocation {
  index: number;
  part: number;
  before: string;
  text: string;
  after: string;
}

/**
 * Finds the marked message in `list[from, to)` whose text before the mark ends with one of
 * `texts` (the renderings the message may carry). Does not change the list.
 */
export function locateInput(list: ChatMessage[], from: number, to: number, texts: string[]): InputLocation | null {
  const wanted = [...new Set(texts.map((t) => t.replace(/\r/g, '')))].filter((t) => t.trim()).sort((a, b) => b.length - a.length);
  for (let i = Math.min(to, list.length) - 1; i >= Math.max(0, from); i--) {
    const c = list[i]!.content;
    const parts: { part: number; text: string }[] = typeof c === 'string'
      ? [{ part: -1, text: c }]
      : Array.isArray(c) ? (c as any[]).map((p, part) => ({ part, text: p && typeof p === 'object' && typeof p.text === 'string' ? p.text : '' })) : [];
    for (const { part, text } of parts) {
      const at = text.lastIndexOf(INPUT_MARK);
      if (at < 0) continue;
      const head = strip(text.slice(0, at)).replace(TRAILING_CACHE_MARKS, '');
      const hit = wanted.find((t) => head.endsWith(t));
      if (hit === undefined) return null;
      return { index: i, part, before: head.slice(0, head.length - hit.length), text: hit, after: strip(text.slice(at + INPUT_MARK.length)) };
    }
  }
  return null;
}

/** Nothing left of the message but a name prefix (`Name:`) and whitespace. */
const leftover = (before: string, after: string) => {
  const b = before.trim();
  return !after.trim() && (!b || /^[^\n]*:$/.test(b));
};

/**
 * Shapes the located input in place. `wrap`: the text is replaced by the expanded template;
 * `extract`: the text is removed, and the message with it when nothing else is left.
 */
export function applyInput(list: ChatMessage[], loc: InputLocation, shaping: InputShaping, expand: (s: string) => string): void {
  const m = list[loc.index]!;
  const text = shaping.mode === 'wrap' ? wrapInput(shaping.template, loc.text, expand) : '';
  if (loc.part < 0) {
    if (shaping.mode === 'extract' && leftover(loc.before, loc.after)) { list.splice(loc.index, 1); return; }
    m.content = shaping.mode === 'extract' ? (loc.before.trimEnd() + loc.after).trim() : loc.before + text + loc.after;
    return;
  }
  const parts = (m.content as any[]).map((p) => (p && typeof p === 'object' ? { ...p } : p));
  if (shaping.mode === 'wrap') {
    parts[loc.part].text = loc.before + text + loc.after;
  } else if (leftover(loc.before, loc.after)) {
    parts.splice(loc.part, 1);
    const rest = parts.filter((p) => !(p && typeof p === 'object' && p.type === 'text' && !String(p.text ?? '').trim()));
    if (!rest.length) { list.splice(loc.index, 1); return; }
  } else {
    parts[loc.part].text = (loc.before.trimEnd() + loc.after).trim();
  }
  m.content = parts;
}
