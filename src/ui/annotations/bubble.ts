/**
 * Annotation bubble state (I-86): one bubble in the parent document for every surface. Hover shows
 * after 150 ms and hides 200 ms after leaving (the bubble itself keeps it open); a tap toggles and
 * pins it until an outside tap or scroll.
 */
import { reactive } from 'vue';
import { actorName, type Annotation } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import { getSidecar } from '@/store/sidecar';
import { getPreset } from '@/store/presets';
import { activeConfiguration } from '@/store/config';
import { richText } from '../rich';
import { colorOf } from '../message/model';

export interface Rect { left: number; top: number; width: number; height: number }
export interface Target { key: string; mesId: number; ann: Annotation; rect: Rect }

export const bubble = reactive({
  open: false,
  pinned: false,
  rev: 0,
  key: null as string | null,
  author: '',
  color: '',
  html: '',
  rect: { left: 0, top: 0, width: 0, height: 0 } as Rect,
});

let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let pendingKey: string | null = null;

function authorOf(mesId: number): { author: string; color: string } {
  const preset = getPreset(getSidecar(st().chat[mesId])?.presetId ?? '');
  if (!preset) return { author: '', color: '' };
  let author = actorName(preset, activeConfiguration(preset), preset.narrator);
  try { author = st().substituteParams(author); } catch { /* keep the raw name */ }
  return { author, color: colorOf(preset, preset.narrator) };
}

function open(t: Target, pinned: boolean): void {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  hideTimer = undefined;
  pendingKey = null;
  if (bubble.key !== t.key) Object.assign(bubble, authorOf(t.mesId), { html: richText(t.ann.comment) });
  Object.assign(bubble, { open: true, pinned, key: t.key, rect: t.rect });
  bubble.rev++;
}

export function hideBubble(): void {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  hideTimer = undefined;
  pendingKey = null;
  if (!bubble.open) return;
  bubble.open = false;
  bubble.pinned = false;
  bubble.key = null;
}

/** Pointer over an annotation (`t`) or over nothing (`null`). */
export function hover(t: Target | null): void {
  if (bubble.pinned) return;
  if (t) {
    if (bubble.open && bubble.key === t.key) { clearTimeout(hideTimer); hideTimer = undefined; return; }
    if (pendingKey === t.key) return;
    clearTimeout(showTimer);
    pendingKey = t.key;
    showTimer = setTimeout(() => open(t, false), 150);
    return;
  }
  clearTimeout(showTimer);
  pendingKey = null;
  leave();
}

/** Tap on an annotation toggles its bubble; a tap elsewhere closes it. */
export function tap(t: Target | null): void {
  if (t && !(bubble.open && bubble.key === t.key)) open(t, true);
  else hideBubble();
}

/** Pointer on the bubble itself. */
export function keep(): void { clearTimeout(hideTimer); hideTimer = undefined; }
export function leave(): void {
  if (!bubble.open || bubble.pinned || hideTimer) return;
  hideTimer = setTimeout(hideBubble, 200);
}

/** Close when the annotation disappeared (re-render, setting off). */
export function forget(keys: Set<string>): void {
  if (bubble.key && keys.has(bubble.key)) hideBubble();
  if (pendingKey && keys.has(pendingKey)) { clearTimeout(showTimer); pendingKey = null; }
}
