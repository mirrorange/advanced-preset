/** Hides the trailing storyline `#tag` of rendered user messages (I-152). */
import { parseStorylineTag } from '@advanced-preset/protocol';

/** The message fields the view needs. */
interface TaggedMessage { is_user: boolean; mes: string }

const TAG_ATTR = 'data-ap-storyline-tag';
const HIDDEN = 'ap-storyline-tag-hidden';

/**
 * Hides the trailing `#tag` of a rendered user message (it stays in the text and when editing).
 * ST's markdown renders a tag on its own line as a heading, otherwise it ends the last text node.
 */
export function syncTagView(text: HTMLElement, msg: TaggedMessage | undefined, active: boolean): void {
  const marked = text.querySelectorAll(`[${TAG_ATTR}]`);
  if (marked.length) { for (const el of marked) el.classList.toggle(HIDDEN, active); return; }
  if (!active || !msg?.is_user) return;
  const tag = parseStorylineTag(msg.mes);
  if (!tag) return;
  const written = msg.mes.slice(tag.at).trim(); // `#name` / `#!name`
  const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
  let last: Text | null = null;
  while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) last = walker.currentNode as Text;
  if (!last) return;
  const parent = last.parentElement;
  const value = last.textContent ?? '';
  const body = written.slice(1); // a heading drops the `#`
  if (parent && parent !== text && /^H[1-6]$/.test(parent.tagName) && parent.textContent?.trim() === body) {
    parent.setAttribute(TAG_ATTR, '');
    parent.classList.add(HIDDEN);
    return;
  }
  const trimmed = value.trimEnd();
  if (!trimmed.endsWith(written)) return;
  const at = trimmed.length - written.length;
  const tail = last.splitText(at);
  const span = document.createElement('span');
  span.setAttribute(TAG_ATTR, '');
  span.className = HIDDEN;
  tail.replaceWith(span);
  span.append(tail);
}
