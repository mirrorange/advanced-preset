/**
 * Painting layers (I-82, I-83): a layer draws located items (annotations, speech lines) into
 * documents — ST's page and each same-origin frontend iframe — as a named highlight in that
 * document's own `CSS.highlights`, with a small style sheet and pointer listeners. Without the
 * Custom Highlight API the main document falls back to `<name>` wrappers. Layers are independent:
 * annotations and speech lines can cover the same text.
 */
import type { Anchor } from './match';
import { toRange, unwrap, wrap, type Surface } from './surface';

export interface Rect { left: number; top: number; width: number; height: number }

/** A painted item under the pointer, with its rect in the parent document's viewport. */
export interface Hit<T> { key: string; mesId: number; item: T; rect: Rect; doc: Document }

export interface LayerSpec<T extends Anchor> {
  /** Highlight name and fallback element tag (`ap-…`). */
  name: string;
  /** Style sheet text for a document (`::highlight(name)`, `::highlight(name-on)`, the fallback tag). */
  css(): string;
  /** Stable id of an item within its message. */
  id(item: T): string;
  /** Highlight priority (higher wins where layers overlap). */
  priority?: number;
  /** Mouse moved (only mouse pointers; `null`: over nothing of this layer). */
  move?(hit: Hit<T> | null, doc: Document): void;
  /** Click / tap; `pointer` is the pointer type of the press. */
  click?(hit: Hit<T> | null, pointer: string, e: MouseEvent): void;
  scroll?(): void;
  leave?(): void;
  /** Events from AP's own overlays (the annotation bubble) are ignored. */
  ignore?(e: Event): boolean;
  /** Painted items disappeared (keys). */
  forget?(keys: Set<string>): void;
}

interface Entry<T> { key: string; mesId: number; item: T; range?: Range; wraps?: HTMLElement[] }

type HighlightLike = { add(r: Range): void; delete(r: Range): boolean; clear?(): void; priority?: number };

interface DocState<T> {
  doc: Document;
  serial: number;
  highlight: HighlightLike | null;
  /** Emphasised entries (`mark`), e.g. the line being played. */
  on: HighlightLike | null;
  owners: Map<object, Entry<T>[]>;
  byWrap: WeakMap<Element, Entry<T>>;
  detach: () => void;
}

let serial = 0;

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

export function canHighlight(doc: Document): boolean {
  const view = doc.defaultView as unknown as { CSS?: { highlights?: unknown }; Highlight?: unknown } | null;
  return Boolean(view?.CSS?.highlights && view.Highlight);
}

export class Layer<T extends Anchor> {
  private readonly states = new Map<Document, DocState<T>>();
  private marked: ((mesId: number, item: T) => boolean) | null = null;

  constructor(private readonly spec: LayerSpec<T>) {}

  private get styleId() { return `${this.spec.name}-style`; }

  private injectStyle(doc: Document): void {
    let el = doc.getElementById(this.styleId);
    if (!el) {
      el = doc.createElement('style');
      el.id = this.styleId;
      (doc.head ?? doc.documentElement).append(el);
    }
    const css = this.spec.css();
    if (el.textContent !== css) el.textContent = css;
  }

  /** Re-apply the style sheet everywhere (colour changed). */
  restyle(): void {
    for (const s of this.live()) this.injectStyle(s.doc);
  }

  private hitTest(s: DocState<T>, e: MouseEvent): Hit<T> | null {
    const target = e.target instanceof s.doc.defaultView!.Node ? (e.target as Node) : null;
    if (!target) return null;
    const el = target.nodeType === Node.ELEMENT_NODE ? (target as Element) : target.parentElement;
    const wrapped = el?.closest(this.spec.name);
    if (wrapped) {
      const entry = s.byWrap.get(wrapped);
      if (entry) {
        const rect = [...wrapped.getClientRects()].find((r) => inside(r, e.clientX, e.clientY)) ?? wrapped.getBoundingClientRect();
        return { key: entry.key, mesId: entry.mesId, item: entry.item, rect: toTop(rect, s.doc), doc: s.doc };
      }
    }
    for (const list of s.owners.values()) {
      for (const entry of list) {
        const r = entry.range;
        if (!r || r.collapsed || !r.intersectsNode(target)) continue;
        for (const rect of r.getClientRects()) {
          if (inside(rect, e.clientX, e.clientY)) return { key: entry.key, mesId: entry.mesId, item: entry.item, rect: toTop(rect, s.doc), doc: s.doc };
        }
      }
    }
    return null;
  }

  private attach(s: DocState<T>): () => void {
    const { doc } = s;
    const spec = this.spec;
    const ignored = (e: Event) => Boolean(spec.ignore?.(e));
    let frame = 0;
    let last: PointerEvent | null = null;
    let pointer = 'mouse';
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!last || ignored(last)) return;
        spec.move?.(this.hitTest(s, last), doc);
      });
    };
    const down = (e: PointerEvent) => { pointer = e.pointerType || 'mouse'; };
    const click = (e: MouseEvent) => {
      if (ignored(e)) return;
      spec.click?.(this.hitTest(s, e), pointer, e);
    };
    const scroll = (e: Event) => { if (!ignored(e)) spec.scroll?.(); };
    const leaveDoc = () => spec.leave?.();
    if (spec.move) doc.addEventListener('pointermove', move, { passive: true });
    doc.addEventListener('pointerdown', down, { passive: true, capture: true });
    if (spec.click) doc.addEventListener('click', click, true);
    if (spec.scroll) doc.addEventListener('scroll', scroll, { passive: true, capture: true });
    if (spec.leave) doc.documentElement.addEventListener('mouseleave', leaveDoc);
    return () => {
      cancelAnimationFrame(frame);
      doc.removeEventListener('pointermove', move);
      doc.removeEventListener('pointerdown', down, true);
      doc.removeEventListener('click', click, true);
      doc.removeEventListener('scroll', scroll, true);
      doc.documentElement?.removeEventListener('mouseleave', leaveDoc);
    };
  }

  private stateOf(doc: Document): DocState<T> {
    let s = this.states.get(doc);
    if (s) return s;
    const view = doc.defaultView as (Window & typeof globalThis) | null;
    const registry = (view?.CSS as { highlights?: Map<string, unknown> } | undefined)?.highlights;
    const H = (view as unknown as { Highlight?: new () => HighlightLike } | null)?.Highlight;
    let highlight: HighlightLike | null = null;
    let on: HighlightLike | null = null;
    if (registry && H) {
      const named = (name: string) => {
        const h = (registry.get(name) as HighlightLike | undefined) ?? new H();
        if (this.spec.priority !== undefined) h.priority = this.spec.priority;
        registry.set(name, h);
        return h;
      };
      highlight = named(this.spec.name);
      on = named(`${this.spec.name}-on`);
    }
    this.injectStyle(doc);
    s = { doc, serial: ++serial, highlight, on, owners: new Map(), byWrap: new WeakMap(), detach: () => {} };
    s.detach = this.attach(s);
    this.states.set(doc, s);
    return s;
  }

  /** Document states still alive (iframes may have navigated away or been removed). */
  private live(): DocState<T>[] {
    for (const [doc, s] of this.states) {
      if (!doc.defaultView) { s.detach(); this.states.delete(doc); }
    }
    return [...this.states.values()];
  }

  /** Listen in `doc` even before it has items (the parent document closes bubbles opened from iframes). */
  watch(doc: Document): void { this.stateOf(doc); }

  /** Replace what `owner` painted in `doc` with `surface`; `fallback` allows wrapper elements. */
  paint(owner: object, doc: Document, mesId: number, surface: Surface<T> | null, fallback: boolean): void {
    const gone = this.drop(owner, doc, Boolean(surface?.located.length));
    if (surface?.located.length) {
      const s = this.stateOf(doc);
      const key = (item: T) => `${s.serial}:${mesId}:${this.spec.id(item)}`;
      const entries: Entry<T>[] = [];
      if (s.highlight) {
        for (const l of surface.located) {
          const range = toRange(surface, l);
          s.highlight.add(range);
          entries.push({ key: key(l.item), mesId, item: l.item, range });
        }
      } else if (fallback) {
        const byLocated = new Map<object, Entry<T>>();
        wrap(surface, this.spec.name, (el, l) => {
          let entry = byLocated.get(l);
          if (!entry) { entry = { key: key(l.item), mesId, item: l.item, wraps: [] }; byLocated.set(l, entry); entries.push(entry); }
          entry.wraps!.push(el);
          s.byWrap.set(el, entry);
        });
      }
      if (entries.length) s.owners.set(owner, entries);
      for (const e of entries) gone.delete(e.key);
      if (this.marked) for (const e of entries) this.emphasise(s, e, this.marked(e.mesId, e.item));
    }
    if (gone.size) this.spec.forget?.(gone);
  }

  private emphasise(s: DocState<T>, e: Entry<T>, on: boolean): void {
    if (e.range && s.on) { if (on) s.on.add(e.range); else s.on.delete(e.range); }
    for (const w of e.wraps ?? []) w.toggleAttribute('data-on', on);
  }

  /** Emphasise the items `pred` selects (everywhere, including items painted later); `null` clears. */
  mark(pred: ((mesId: number, item: T) => boolean) | null): void {
    this.marked = pred;
    for (const s of this.live()) for (const list of s.owners.values()) for (const e of list) this.emphasise(s, e, Boolean(pred?.(e.mesId, e.item)));
  }

  private drop(owner: object, doc?: Document, keep = false): Set<string> {
    const gone = new Set<string>();
    for (const s of doc ? [this.states.get(doc)].filter((x): x is DocState<T> => Boolean(x)) : this.live()) {
      const entries = s.owners.get(owner);
      if (!entries) continue;
      s.owners.delete(owner);
      for (const e of entries) {
        gone.add(e.key);
        if (e.range) { s.highlight?.delete(e.range); s.on?.delete(e.range); }
        if (e.wraps) unwrap(e.wraps);
      }
      if (!keep && !s.owners.size && s.doc !== document) { s.detach(); this.states.delete(s.doc); }
    }
    return gone;
  }

  /** Remove what `owner` painted (in one document, or everywhere). */
  clear(owner: object, doc?: Document): void {
    const gone = this.drop(owner, doc);
    if (gone.size) this.spec.forget?.(gone);
  }
}
