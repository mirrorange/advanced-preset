/**
 * Speech lines in message text (design §6): the `ap-speech` layer, a thin solid underline (the
 * annotation colour, lighter) that plays the line on click; the line being played is tinted.
 */
import type { SpeechSpan } from '@advanced-preset/protocol';
import { Layer } from '../annotations/layer';
import { annotationColor } from '../annotations/paint';
import { playLine } from '@/media/speech/service';

const NAME = 'ap-speech';
const HOVER = 'data-ap-speech-hover';

export const speechLayer = new Layer<SpeechSpan>({
  name: NAME,
  priority: 0,
  css() {
    const c = annotationColor();
    const deco = `text-decoration-line: underline; text-decoration-style: solid; text-decoration-color: color-mix(in srgb, ${c} 60%, transparent); text-decoration-thickness: max(1px, 0.07em); text-underline-offset: 0.3em;`;
    const on = `background-color: color-mix(in srgb, ${c} 16%, transparent);`;
    return `::highlight(${NAME}) { ${deco} }
::highlight(${NAME}-on) { ${on} }
${NAME} { ${deco} text-decoration-skip-ink: none; cursor: pointer; }
${NAME}[data-on] { ${on} }
html[${HOVER}], html[${HOVER}] * { cursor: pointer !important; }`;
  },
  id: (s) => s.id,
  move(hit, doc) { doc.documentElement.toggleAttribute(HOVER, Boolean(hit)); },
  leave() { document.documentElement.removeAttribute(HOVER); },
  click(hit, _pointer, e) {
    if (!hit) return;
    // A selection drag that ends on a line is not a click.
    if (hit.doc.getSelection()?.toString()) return;
    e.preventDefault();
    playLine(hit.mesId, hit.item.id);
  },
});
