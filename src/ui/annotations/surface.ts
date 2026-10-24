/**
 * Display surfaces (I-84): the visible text of one document region (`.mes_text`, or the body of a
 * same-origin frontend iframe) as a list of text nodes, and the annotations located in it.
 */
import type { Annotation } from '@advanced-preset/protocol';
import { locate, matchAnnotation, normalize } from './match';

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'TEXTAREA', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'AP-STAGES', 'AP-CARDS', 'AP-ANNO-BUBBLE']);

/** A located annotation: text-node indices and offsets of its start and end. */
export interface Located {
  ann: Annotation;
  start: [number, number];
  end: [number, number];
}

export interface Surface {
  nodes: Text[];
  located: Located[];
}

function visible(el: Element, cache: Map<Element, boolean>): boolean {
  let v = cache.get(el);
  if (v !== undefined) return v;
  if (SKIP.has(el.tagName.toUpperCase())) v = false;
  else if (typeof (el as HTMLElement).checkVisibility === 'function') v = (el as HTMLElement).checkVisibility();
  else {
    const view = el.ownerDocument.defaultView;
    v = !(el as HTMLElement).hidden && (!view || view.getComputedStyle(el).display !== 'none');
    if (v && el.parentElement) v = visible(el.parentElement, cache);
  }
  cache.set(el, v);
  return v;
}

/** Visible, non-empty text nodes under `root`, in document order. */
export function textNodes(root: Element): Text[] {
  const doc = root.ownerDocument;
  const cache = new Map<Element, boolean>();
  const out: Text[] = [];
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (n.nodeType === Node.ELEMENT_NODE) return SKIP.has((n as Element).tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
      return (n as Text).data && n.parentElement && visible(n.parentElement, cache) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n as Text);
  return out;
}

/** Locate `anns` in the visible text under `root`; each annotation at most once. */
export function locateIn(root: Element, mes: string, anns: Annotation[]): Surface {
  const nodes = textNodes(root);
  const chunks = nodes.map((n) => n.data);
  const text = chunks.join('');
  const norm = normalize(text);
  const located: Located[] = [];
  for (const ann of anns) {
    const m = matchAnnotation(text, mes, ann, norm);
    if (!m) continue;
    located.push({ ann, start: locate(chunks, m[0]), end: locate(chunks, m[1], true) });
  }
  return { nodes, located };
}

export function toRange(s: Surface, l: Located): Range {
  const r = s.nodes[0]!.ownerDocument.createRange();
  r.setStart(s.nodes[l.start[0]]!, l.start[1]);
  r.setEnd(s.nodes[l.end[0]]!, l.end[1]);
  return r;
}

const before = (a: [number, number], b: [number, number]) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);

/**
 * Fallback without the Custom Highlight API: wrap the located text in `<ap-anno>` elements
 * (main document only). Processed from the end so earlier positions stay valid; overlaps skipped.
 */
export function wrap(s: Surface, onWrap: (el: HTMLElement, l: Located) => void): void {
  const order = [...s.located].sort((a, b) => (before(a.start, b.start) ? 1 : before(b.start, a.start) ? -1 : 0));
  let limit: [number, number] | null = null;
  for (const l of order) {
    if (limit && before(limit, l.end)) continue;
    limit = l.start;
    for (let j = l.end[0]; j >= l.start[0]; j--) {
      const node = s.nodes[j]!;
      const from = j === l.start[0] ? l.start[1] : 0;
      const to = j === l.end[0] ? l.end[1] : node.length;
      if (from >= to || !node.parentNode || node.parentElement?.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
      if (to < node.length) node.splitText(to);
      const target = from > 0 ? node.splitText(from) : node;
      const el = node.ownerDocument.createElement('ap-anno');
      target.parentNode!.insertBefore(el, target);
      el.append(target);
      onWrap(el, l);
    }
  }
}

export function unwrap(els: Iterable<HTMLElement>): void {
  const parents = new Set<Node>();
  for (const el of els) {
    if (!el.parentNode) continue;
    parents.add(el.parentNode);
    el.replaceWith(...el.childNodes);
  }
  for (const p of parents) p.normalize();
}
