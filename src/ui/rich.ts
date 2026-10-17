/**
 * Restricted rich text for cards (§16.3): a small allow-list of inline / block tags, `<p special>`
 * highlight, and a Markdown-lite fallback for plain text. Everything else is reduced to text.
 */
const BLOCK = new Set(['P', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'BR', 'HR']);
const INLINE = new Set(['EM', 'STRONG', 'I', 'B', 'U', 'S', 'DEL', 'CODE', 'SPAN', 'SMALL', 'MARK']);

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function inlineMarkdown(s: string): string {
  return escape(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

function plainToHtml(text: string): string {
  return text.trim().split(/\n{2,}/).map((para) => {
    if (/^>\s?/.test(para)) return `<blockquote>${inlineMarkdown(para.replace(/^>\s?/gm, '')).replace(/\n/g, '<br>')}</blockquote>`;
    if (/^[-*]\s/.test(para)) return `<ul>${para.split(/\n/).map((l) => `<li>${inlineMarkdown(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    return `<p>${inlineMarkdown(para).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

function clean(node: Node, out: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) return out.createTextNode(node.textContent ?? '');
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const tag = el.tagName;
  const frag = out.createDocumentFragment();
  const kids = () => { for (const c of [...el.childNodes]) { const x = clean(c, out); if (x) frag.appendChild(x); } };
  if (!BLOCK.has(tag) && !INLINE.has(tag)) { kids(); return frag; }
  const copy = out.createElement(tag.toLowerCase());
  if (tag === 'P' && el.hasAttribute('special')) copy.className = 'special';
  for (const c of [...el.childNodes]) { const x = clean(c, out); if (x) copy.appendChild(x); }
  return copy;
}

export function richText(source: string): string {
  if (!source) return '';
  if (!/<\/?[a-z][^>]*>/i.test(source)) return plainToHtml(source);
  const doc = new DOMParser().parseFromString(`<body>${source}</body>`, 'text/html');
  const out = document.implementation.createHTMLDocument('');
  const root = out.createElement('div');
  for (const c of [...doc.body.childNodes]) {
    if (c.nodeType === Node.TEXT_NODE && c.textContent?.trim()) { root.insertAdjacentHTML('beforeend', plainToHtml(c.textContent)); continue; }
    const x = clean(c, out);
    if (x) root.appendChild(x);
  }
  return root.innerHTML;
}
