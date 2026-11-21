/**
 * Painting annotations (I-82, I-83): the `ap-anno` layer. Hover shows the bubble (mouse), a tap
 * toggles it; the bubble always lives in the parent document.
 */
import type { Annotation } from '@advanced-preset/protocol';
import { forget, hideBubble, hover, tap } from './bubble';
import { Layer } from './layer';

export { canHighlight } from './layer';

let color = '#a855f7';
let bubbleHost: () => Element | null = () => null;

export function setBubbleHost(f: () => Element | null): void { bubbleHost = f; }

/** Events from inside the bubble (it is in the parent document, above every surface). */
export function fromBubble(e: Event): boolean {
  const host = bubbleHost();
  return Boolean(host && e.composedPath().includes(host));
}

const NAME = 'ap-anno';

export const annotationLayer = new Layer<Annotation>({
  name: NAME,
  // Above speech lines where both cover the same text.
  priority: 1,
  css() {
    const deco = 'text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;';
    return `:root { --ap-anno-color: ${color}; }
::highlight(${NAME}) { ${deco} }
${NAME} { ${deco} text-decoration-skip-ink: none; cursor: help; }`;
  },
  id: (a) => a.id,
  move: (hit) => hover(hit && { key: hit.key, mesId: hit.mesId, ann: hit.item, rect: hit.rect }),
  click(hit, pointer) {
    if (pointer !== 'mouse') tap(hit && { key: hit.key, mesId: hit.mesId, ann: hit.item, rect: hit.rect });
    else if (!hit) hideBubble();
  },
  scroll: hideBubble,
  leave: () => hover(null),
  ignore: fromBubble,
  forget,
});

/** Underline colour (a concrete colour: iframes cannot see AP's custom properties). */
export function setAnnotationColor(c: string): void {
  if (c === color) return;
  color = c;
  annotationLayer.restyle();
}

/** Current underline colour (speech lines use it too). */
export const annotationColor = () => color;

/** Listen in `doc` even before it has annotations (the parent document closes bubbles opened from iframes). */
export const watchDocument = (doc: Document) => annotationLayer.watch(doc);
