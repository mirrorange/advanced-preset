/**
 * Tooltip placement. Bubbles are shown in the top layer (`popover="manual"`), so scroll containers,
 * the panel and ST's drawers can no longer clip or cover them, and are positioned against the
 * viewport: preferred side first, flipped when it does not fit, then clamped horizontally.
 */
import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';

export type Align = 'center' | 'start' | 'end';
const GAP = 6;
const MARGIN = 8;

export interface Placement { left: number; top: number; side: 'top' | 'bottom' }

/** Pure placement maths (exported for tests). */
export function place(anchor: DOMRect, size: { width: number; height: number }, view: { width: number; height: number }, align: Align = 'center', below = false): Placement {
  const fitsTop = anchor.top - GAP - size.height >= MARGIN;
  const fitsBottom = anchor.bottom + GAP + size.height <= view.height - MARGIN;
  let side: Placement['side'] = below ? 'bottom' : 'top';
  if (side === 'top' && !fitsTop && (fitsBottom || anchor.top < view.height - anchor.bottom)) side = 'bottom';
  else if (side === 'bottom' && !fitsBottom && (fitsTop || anchor.top > view.height - anchor.bottom)) side = 'top';
  let top = side === 'top' ? anchor.top - GAP - size.height : anchor.bottom + GAP;
  top = Math.max(MARGIN, Math.min(top, view.height - MARGIN - size.height));
  let left = align === 'start' ? anchor.left : align === 'end' ? anchor.right - size.width : anchor.left + anchor.width / 2 - size.width / 2;
  left = Math.max(MARGIN, Math.min(left, view.width - MARGIN - size.width));
  return { left: Math.round(left), top: Math.round(top), side };
}

export function useBubble(anchor: Ref<HTMLElement | null>, opts: () => { align?: Align; below?: boolean }) {
  const open = ref(false);
  const bubble = ref<HTMLElement | null>(null);

  function position() {
    const a = anchor.value;
    const b = bubble.value;
    if (!a || !b) return;
    const view = { width: document.documentElement.clientWidth || innerWidth, height: innerHeight };
    b.style.maxWidth = `${Math.min(280, view.width - MARGIN * 2)}px`;
    b.style.left = '0px';
    b.style.top = '0px';
    const origin = b.getBoundingClientRect();
    const p = place(a.getBoundingClientRect(), origin, view, opts().align, opts().below);
    // Without top-layer support an ancestor may still be the containing block; subtract its offset.
    b.style.left = `${p.left - origin.left}px`;
    b.style.top = `${p.top - origin.top}px`;
    b.dataset.side = p.side;
  }

  const onMove = () => { if (open.value) position(); };
  watch(open, async (v) => {
    if (!v) {
      removeEventListener('scroll', onMove, true);
      removeEventListener('resize', onMove);
      return;
    }
    await nextTick();
    const b = bubble.value;
    if (!b) return;
    try { if (!b.matches(':popover-open')) b.showPopover?.(); } catch { /* unsupported: stays position: fixed */ }
    position();
    addEventListener('scroll', onMove, true);
    addEventListener('resize', onMove);
  });
  onBeforeUnmount(() => { open.value = false; removeEventListener('scroll', onMove, true); removeEventListener('resize', onMove); });

  return { open, bubble };
}
