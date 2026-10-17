/** Helpers for XML-ish tag blocks emitted by models in dialogue style. */

export function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function unescapeXml(s: string): string {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

export interface TagBlock {
  /** Raw inner text (not unescaped). */
  inner: string;
  attrs: Record<string, string>;
  /** True when the closing tag has not arrived yet (streaming). */
  open: boolean;
  start: number;
  end: number;
}

function parseAttrs(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of s.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) out[m[1]!] = unescapeXml(m[3] ?? m[4] ?? '');
  return out;
}

/** Find every `<tag …>…</tag>` block (case-sensitive). An unclosed trailing block is reported as `open`. */
export function findTags(text: string, tag: string): TagBlock[] {
  const out: TagBlock[] = [];
  const openRe = new RegExp(`<${escapeRe(tag)}(\\s[^<>]*)?>`, 'g');
  const close = `</${tag}>`;
  let m: RegExpExecArray | null;
  while ((m = openRe.exec(text))) {
    const innerStart = m.index + m[0].length;
    const closeAt = text.indexOf(close, innerStart);
    if (closeAt < 0) {
      out.push({ inner: text.slice(innerStart), attrs: parseAttrs(m[1] ?? ''), open: true, start: m.index, end: text.length });
      break;
    }
    out.push({ inner: text.slice(innerStart, closeAt), attrs: parseAttrs(m[1] ?? ''), open: false, start: m.index, end: closeAt + close.length });
    openRe.lastIndex = closeAt + close.length;
  }
  return out;
}

/** Remove the given blocks from a text. */
export function removeBlocks(text: string, blocks: { start: number; end: number }[]): string {
  if (!blocks.length) return text;
  const sorted = [...blocks].sort((a, b) => a.start - b.start);
  let out = '';
  let at = 0;
  for (const b of sorted) {
    if (b.start < at) continue;
    out += text.slice(at, b.start);
    at = b.end;
  }
  return out + text.slice(at);
}

/** Inner text of the first `<child>` element inside a block, unescaped and trimmed. */
export function childText(inner: string, child: string): string | undefined {
  const b = findTags(inner, child)[0];
  return b ? unescapeXml(b.inner).trim() : undefined;
}

/**
 * Length of a trailing fragment that might be the beginning of a tag (`<`, `<synop`, `<synopsis attr`).
 * Used to hold back streamed content until it is clear the text is not a structure tag.
 */
export function partialTagTail(text: string): number {
  const lt = text.lastIndexOf('<');
  if (lt < 0) return 0;
  const tail = text.slice(lt);
  if (tail.includes('>')) return 0;
  return tail === '<' || tail === '</' || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(tail) ? tail.length : 0;
}

/** Remove HTML comments (`<!-- … -->`), including an unterminated trailing one. */
export function stripComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, '').replace(/<!--[\s\S]*$/, '');
}
