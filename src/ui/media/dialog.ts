/**
 * The media dialog: one popup on `document.body` (outside the AP panel) for the speech and image
 * panels of a message. Opening another one replaces the content; focus returns to where it was when
 * the first one opened (not when a click elsewhere closed it: the focus went there).
 */
import { markRaw, reactive, type Component } from 'vue';
import { defineHost } from '../host';
import MediaDialog from './MediaDialog.vue';

export interface MediaDialogContent {
  /** Rendered in the body; gets `props` and may emit `close`. */
  component: Component;
  props?: Record<string, unknown>;
  /** Heading of the dialog (also its accessible name). */
  title: string;
}

interface Open extends MediaDialogContent { id: number }

export const mediaDialog = reactive({ current: null as Open | null });

let next = 0;
let returnFocus: HTMLElement | null = null;

/** The focused element, looking into shadow roots (AP mounts are custom elements). */
function deepActive(): HTMLElement | null {
  let el = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el instanceof HTMLElement ? el : null;
}

export function openMediaDialog(content: MediaDialogContent): void {
  if (!document.querySelector('ap-media-dialog')) document.body.append(document.createElement('ap-media-dialog'));
  if (!mediaDialog.current) returnFocus = deepActive();
  mediaDialog.current = { ...content, component: markRaw(content.component), id: ++next };
}

export function closeMediaDialog(restoreFocus = true): void {
  if (!mediaDialog.current) return;
  mediaDialog.current = null;
  const el = returnFocus;
  returnFocus = null;
  if (restoreFocus && el?.isConnected) el.focus({ preventScroll: true });
}

export function installMediaDialog(): void {
  defineHost('ap-media-dialog', MediaDialog);
}
