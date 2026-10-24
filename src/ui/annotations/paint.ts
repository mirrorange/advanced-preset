/**
 * Painting annotations into documents (I-82, I-83): every document (ST's page and each same-origin
 * frontend iframe) gets its own `ap-anno` highlight in its own `CSS.highlights`, a small style sheet
 * and pointer listeners; the bubble always lives in the parent document. Without the Custom Highlight
 * API the main document falls back to `<ap-anno>` wrappers inside `.mes_text`.
 */
import type { Annotation } from '@advanced-preset/protocol';
import { forget, hideBubble, hover, tap, type Rect, type Target } from './bubble';
import { toRange, unwrap, wrap, type Surface } from './surface';

const NAME = 'ap-anno';
const STYLE_ID = 'ap-anno-style';

interface Entry { key: string; mesId: number; ann: Annotation; range?: Range; wraps?: HTMLElement[] }

interface DocState {
  doc: Document;
  serial: number;
  highlight: { add(r: Range): void; delete(r: Range): boolean } | null;
  owners: Map<object, Entry[]>;
  byWrap: WeakMap<Element, Entry>;
  detach: () => void;
}

const states = new Map<Document, DocState>();
let serial = 0;
let color = '#a855f7';
let bubbleHost: () => Element | null = () => null;

export function setBubbleHost(f: () => Element | null): void { bubbleHost = f; }

function css(): string {
  const deco = 'text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;';
  return `:root { --ap-anno-color: ${color}; }
::highlight(${NAME}) { ${deco} }
ap-anno { ${deco} text-decoration-skip-ink: none; cursor: help; }`;
}

function injectStyle(doc: Document): void {
  let el = doc.getElementById(STYLE_ID);
  if (!el) {
    el = doc.createElement('style');
    el.id = STYLE_ID;
    (doc.head ?? doc.documentElement).append(el);
  }
  if (el.textContent !== css()) el.textContent = css();
}

/** Underline colour (a concrete colour: iframes cannot see AP's custom properties). */
export function setAnnotationColor(c: string): void {
  if (c === color) return;
  color = c;
  for (const s of live()) injectStyle(s.doc);
}

/** Convert a rect in `doc`'s viewport to the parent document's viewport. */
function toTop(r: DOMRect, doc: Document): Rect {
  let left = r.left;
  let top = r.top;
  let win: Window | null = doc.defaultView;
  while (win && win !== window) {
    const frame = win.frameElement as HTMLElement | null;
    if (!frame) break;
    const f = frame.getBoundingClientRect();
    left += f.left + frame.clientLeft;
    top += f.top + frame.clientTop;
    win = frame.ownerDocument.defaultView;
  }
  return { left, top, width: r.width, height: r.height };
}

const inside = (r: DOMRect, x: number, y: number) => x >= r.left - 1 && x <= r.right + 1 && y >= r.top - 1 && y <= r.bottom + 1;

function hitTest(s: DocState, e: MouseEvent): Target | null {
  const target = e.target instanceof s.doc.defaultView!.Node ? (e.target as Node) : null;
  if (!target) return null;
  const el = target.nodeType === Node.ELEMENT_NODE ? (target as Element) : target.parentElement;
  const wrapped = el?.closest('ap-anno');
  if (wrapped) {
    const entry = s.byWrap.get(wrapped);
    if (entry) {
      const rect = [...wrapped.getClientRects()].find((r) => inside(r, e.clientX, e.clientY)) ?? wrapped.getBoundingClientRect();
      return { key: entry.key, mesId: entry.mesId, ann: entry.ann, rect: toTop(rect, s.doc) };
    }
  }
  for (const list of s.owners.values()) {
    for (const entry of list) {
      const r = entry.range;
      if (!r || r.collapsed || !r.intersectsNode(target)) continue;
      for (const rect of r.getClientRects()) {
        if (inside(rect, e.clientX, e.clientY)) return { key: entry.key, mesId: entry.mesId, ann: entry.ann, rect: toTop(rect, s.doc) };
      }
    }
  }
  return null;
}

function fromBubble(e: Event): boolean {
  const host = bubbleHost();
  return Boolean(host && e.composedPath().includes(host));
}

function attach(s: DocState): () => void {
  const { doc } = s;
  let frame = 0;
  let last: PointerEvent | null = null;
  let pointer = 'mouse';
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    last = e;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!last || fromBubble(last)) return;
      hover(hitTest(s, last));
    });
  };
  const down = (e: PointerEvent) => { pointer = e.pointerType || 'mouse'; };
  const click = (e: MouseEvent) => {
    if (fromBubble(e)) return;
    const t = hitTest(s, e);
    if (pointer !== 'mouse') tap(t);
    else if (!t) hideBubble();
  };
  const scroll = (e: Event) => { if (!fromBubble(e)) hideBubble(); };
  const leaveDoc = () => hover(null);
  doc.addEventListener('pointermove', move, { passive: true });
  doc.addEventListener('pointerdown', down, { passive: true, capture: true });
  doc.addEventListener('click', click, true);
  doc.addEventListener('scroll', scroll, { passive: true, capture: true });
  doc.documentElement.addEventListener('mouseleave', leaveDoc);
  return () => {
    cancelAnimationFrame(frame);
    doc.removeEventListener('pointermove', move);
    doc.removeEventListener('pointerdown', down, true);
    doc.removeEventListener('click', click, true);
    doc.removeEventListener('scroll', scroll, true);
    doc.documentElement?.removeEventListener('mouseleave', leaveDoc);
  };
}

function stateOf(doc: Document): DocState {
  let s = states.get(doc);
  if (s) return s;
  const view = doc.defaultView as (Window & typeof globalThis) | null;
  const registry = (view?.CSS as { highlights?: Map<string, unknown> } | undefined)?.highlights;
  const H = (view as unknown as { Highlight?: new () => DocState['highlight'] } | null)?.Highlight;
  let highlight: DocState['highlight'] = null;
  if (registry && H) {
    highlight = (registry.get(NAME) as DocState['highlight']) ?? new H();
    registry.set(NAME, highlight);
  }
  injectStyle(doc);
  s = { doc, serial: ++serial, highlight, owners: new Map(), byWrap: new WeakMap(), detach: () => {} };
  s.detach = attach(s);
  states.set(doc, s);
  return s;
}

/** Document states still alive (iframes may have navigated away or been removed). */
function live(): DocState[] {
  for (const [doc, s] of states) {
    if (!doc.defaultView) { s.detach(); states.delete(doc); }
  }
  return [...states.values()];
}

/** Listen in `doc` even before it has annotations (the parent document closes bubbles opened from iframes). */
export function watchDocument(doc: Document): void { stateOf(doc); }

export function canHighlight(doc: Document): boolean {
  const view = doc.defaultView as unknown as { CSS?: { highlights?: unknown }; Highlight?: unknown } | null;
  return Boolean(view?.CSS?.highlights && view.Highlight);
}

/** Replace what `owner` painted in `doc` with `surface`; `fallback` allows `<ap-anno>` wrappers. */
export function paint(owner: object, doc: Document, mesId: number, surface: Surface | null, fallback: boolean): void {
  const gone = drop(owner, doc, Boolean(surface?.located.length));
  if (surface?.located.length) {
    const s = stateOf(doc);
    const key = (a: Annotation) => `${s.serial}:${mesId}:${a.id}`;
    const entries: Entry[] = [];
    if (s.highlight) {
      for (const l of surface.located) {
        const range = toRange(surface, l);
        s.highlight.add(range);
        entries.push({ key: key(l.ann), mesId, ann: l.ann, range });
      }
    } else if (fallback) {
      const byLocated = new Map<object, Entry>();
      wrap(surface, (el, l) => {
        let entry = byLocated.get(l);
        if (!entry) { entry = { key: key(l.ann), mesId, ann: l.ann, wraps: [] }; byLocated.set(l, entry); entries.push(entry); }
        entry.wraps!.push(el);
        s.byWrap.set(el, entry);
      });
    }
    if (entries.length) s.owners.set(owner, entries);
    for (const e of entries) gone.delete(e.key);
  }
  if (gone.size) forget(gone);
}

function drop(owner: object, doc?: Document, keep = false): Set<string> {
  const gone = new Set<string>();
  for (const s of doc ? [states.get(doc)].filter((x): x is DocState => Boolean(x)) : live()) {
    const entries = s.owners.get(owner);
    if (!entries) continue;
    s.owners.delete(owner);
    for (const e of entries) {
      gone.add(e.key);
      if (e.range) s.highlight?.delete(e.range);
      if (e.wraps) unwrap(e.wraps);
    }
    if (!keep && !s.owners.size && s.doc !== document) { s.detach(); states.delete(s.doc); }
  }
  return gone;
}

/** Remove what `owner` painted (in one document, or everywhere). */
export function clear(owner: object, doc?: Document): void {
  const gone = drop(owner, doc);
  if (gone.size) forget(gone);
}
