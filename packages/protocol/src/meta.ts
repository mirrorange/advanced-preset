/**
 * Meta-instructions (D11): `@Freesia …` up to the end of its paragraph, or an explicit
 * `@Freesia{ … }` wrap (nested braces counted). Removing every segment leaves the story input.
 */
import { escapeRe } from './tags';

export interface MetaParse {
  present: boolean;
  /** Only meta segments (nothing else remains). */
  pure: boolean;
  mixed: boolean;
  segments: string[];
  /** Input with meta segments removed. */
  stripped: string;
}

export function parseMeta(input: string, trigger: string, wrap = true): MetaParse {
  const none: MetaParse = { present: false, pure: false, mixed: false, segments: [], stripped: input };
  if (!trigger || !input) return none;
  const re = new RegExp(escapeRe(trigger), 'gi');
  const cut: { start: number; end: number; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    const start = m.index;
    let after = start + m[0].length;
    // Do not treat `@Freesiax` as a trigger.
    if (/[\p{L}\p{N}_]/u.test(input[after] ?? '')) continue;
    let end: number;
    let text: string;
    if (wrap && input[after] === '{') {
      let depth = 0;
      let i = after;
      for (; i < input.length; i++) {
        if (input[i] === '{') depth++;
        else if (input[i] === '}' && --depth === 0) break;
      }
      end = Math.min(i + 1, input.length);
      text = input.slice(after + 1, i).trim();
    } else {
      const para = /\n\s*\n/g;
      para.lastIndex = after;
      const pm = para.exec(input);
      end = pm ? pm.index : input.length;
      text = input.slice(after, end).replace(/^[\s,，:：]+/, '').trim();
    }
    cut.push({ start, end, text });
    re.lastIndex = end;
  }
  if (!cut.length) return none;
  let stripped = '';
  let at = 0;
  for (const c of cut) { stripped += input.slice(at, c.start); at = c.end; }
  stripped += input.slice(at);
  stripped = stripped.replace(/\n{3,}/g, '\n\n').trim();
  const pure = stripped === '';
  return { present: true, pure, mixed: !pure, segments: cut.map((c) => c.text).filter(Boolean), stripped };
}
