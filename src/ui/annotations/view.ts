/**
 * One message's annotation view (I-83 – I-85): watches its `.mes_text` and the same-origin iframes
 * inside it, re-locates the message's annotations in every display surface and paints them.
 * Created by the static mount scan, or by TauriTavern's ChatSurface `didCommitContent`.
 */
import { st } from '@/st/host';
import { live } from '@/core/live';
import { settings } from '@/store/settings';
import { annotationsOf } from '@/app/annotations';
import { canHighlight, clear, paint } from './paint';
import { locateIn } from './surface';

interface Frame { doc: Document | null; observer: MutationObserver | null; onLoad: () => void }

const views = new Set<AnnotationView>();

/** Frontend opt-out on the iframe's `<html>` / `<body>`: `off` (nothing) or `manual` (draws itself via the API). */
function optedOut(doc: Document): boolean {
  const v = doc.documentElement?.dataset.apAnnotations ?? doc.body?.dataset.apAnnotations;
  return v === 'off' || v === 'manual';
}

export const annotationsShown = () => settings().ui.annotations?.show !== false;

export class AnnotationView {
  private readonly observer: MutationObserver;
  private readonly frames = new Map<HTMLIFrameElement, Frame>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  disposed = false;

  constructor(readonly el: HTMLElement, private readonly fallbackId?: number) {
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(el, { childList: true, subtree: true, characterData: true });
    views.add(this);
    this.schedule(0);
  }

  get mesId(): number {
    const v = this.el.closest('.mes')?.getAttribute('mesid');
    const n = v === null || v === undefined ? NaN : Number(v);
    return Number.isNaN(n) ? (this.fallbackId ?? NaN) : n;
  }

  get hasFrames(): boolean { return this.frames.size > 0; }

  schedule(delay = 60): void {
    if (this.disposed) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.refresh(), delay);
  }

  private syncFrames(): void {
    const found = new Set(this.el.querySelectorAll('iframe'));
    for (const [f, s] of this.frames) {
      if (found.has(f)) continue;
      f.removeEventListener('load', s.onLoad);
      s.observer?.disconnect();
      if (s.doc) clear(this, s.doc);
      this.frames.delete(f);
    }
    for (const f of found) {
      let s = this.frames.get(f);
      if (!s) {
        s = { doc: null, observer: null, onLoad: () => this.schedule(0) };
        f.addEventListener('load', s.onLoad);
        this.frames.set(f, s);
      }
      let doc: Document | null = null;
      try { doc = f.contentDocument; } catch { /* cross-origin */ }
      if (doc === s.doc) continue;
      s.observer?.disconnect();
      if (s.doc) clear(this, s.doc);
      s.doc = doc;
      s.observer = null;
      if (doc?.documentElement) {
        s.observer = new MutationObserver(() => this.schedule(120));
        s.observer.observe(doc.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden', 'data-ap-annotations'] });
      }
    }
  }

  refresh(): void {
    if (this.disposed) return;
    if (!this.el.isConnected) { clear(this); return; }
    this.syncFrames();
    const id = this.mesId;
    const msg = st().chat[id];
    const g = live.current;
    const streaming = g?.status === 'running' && g.mesId === id;
    const anns = msg && !msg.is_user && !streaming && annotationsShown() ? annotationsOf(id).filter((a) => !a.orphan) : [];
    const mes = msg?.mes ?? '';
    paint(this, document, id, anns.length ? locateIn(this.el, mes, anns) : null, !canHighlight(document));
    for (const s of this.frames.values()) {
      const doc = s.doc;
      if (!doc?.body || !doc.defaultView) continue;
      paint(this, doc, id, anns.length && !optedOut(doc) ? locateIn(doc.body, mes, anns) : null, false);
      s.observer?.takeRecords();
    }
    // Our own `<ap-anno>` wrappers must not trigger another pass.
    this.observer.takeRecords();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    clearTimeout(this.timer);
    this.observer.disconnect();
    for (const [f, s] of this.frames) { f.removeEventListener('load', s.onLoad); s.observer?.disconnect(); }
    this.frames.clear();
    clear(this);
    views.delete(this);
  }
}

/** Schedule a refresh of the views of `mesId` (every view without an argument). */
export function refreshViews(mesId?: number, delay?: number): void {
  for (const v of views) if (mesId === undefined || v.mesId === mesId) v.schedule(delay);
}

export function refreshFrameViews(): void {
  for (const v of views) if (v.hasFrames) v.schedule(0);
}

/** Drop views whose element left the page (static mode: ST rebuilt or deleted the message). */
export function pruneViews(): void {
  for (const v of views) if (!v.el.isConnected) v.dispose();
}

const byElement = new WeakMap<Element, AnnotationView>();
export function ensureView(el: HTMLElement): void {
  const v = byElement.get(el);
  if (v && !v.disposed) return;
  byElement.set(el, new AnnotationView(el));
}
