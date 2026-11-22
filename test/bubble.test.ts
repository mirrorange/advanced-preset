import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { place, useTipTriggers } from '@/ui/components/bubble';

const rect = (left: number, top: number, width = 20, height = 20) =>
  ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
const view = { width: 400, height: 800 };
const size = { width: 200, height: 60 };

describe('tooltip placement', () => {
  it('prefers above, centred on the anchor', () => {
    expect(place(rect(190, 400), size, view)).toEqual({ left: 100, top: 334, side: 'top' });
  });
  it('flips below when there is no room above (first section under the tab bar)', () => {
    const p = place(rect(350, 30), size, view, 'end');
    expect(p.side).toBe('bottom');
    expect(p.top).toBe(56);
  });
  it('flips above when "below" does not fit', () => {
    expect(place(rect(100, 760), size, view, 'center', true).side).toBe('top');
  });
  it('keeps the bubble inside the viewport horizontally', () => {
    expect(place(rect(385, 400, 10, 10), size, view).left).toBe(192);
    expect(place(rect(0, 400, 10, 10), size, view).left).toBe(8);
    expect(place(rect(0, 400, 10, 10), size, view, 'end').left).toBe(8);
  });
  it('clamps vertically when neither side fits', () => {
    const p = place(rect(100, 40, 20, 700), { width: 100, height: 120 }, view);
    expect(p.top).toBeGreaterThanOrEqual(8);
    expect(p.top + 120).toBeLessThanOrEqual(792);
  });
});

describe('tooltip triggers', () => {
  const pointer = (pointerType: string) => ({ pointerType }) as PointerEvent;
  const focus = (visible: boolean) => ({ target: { matches: (q: string) => q === ':focus-visible' && visible } }) as unknown as FocusEvent;

  it('shows on mouse hover, not on a touch or pen tap', () => {
    const open = ref(false);
    const on = useTipTriggers(open);
    on.onPointerenter(pointer('touch'));
    expect(open.value).toBe(false);
    on.onPointerenter(pointer('mouse'));
    expect(open.value).toBe(true);
    on.onPointerleave();
    expect(open.value).toBe(false);
  });
  it('shows on keyboard focus only, not on a focus moved by script or a tap', () => {
    const open = ref(false);
    const on = useTipTriggers(open);
    on.onFocusin(focus(false));
    expect(open.value).toBe(false);
    on.onFocusin(focus(true));
    expect(open.value).toBe(true);
    on.onFocusout();
    expect(open.value).toBe(false);
  });
  it('toggle pins it on a tap (Help) and the focus leaving unpins it', () => {
    const open = ref(false);
    const on = useTipTriggers(open);
    on.onFocusin(focus(false));
    on.onPointerleave(); // a touch pointer leaves before the click
    on.toggle();
    expect(open.value).toBe(true);
    on.onPointerleave();
    on.toggle();
    expect(open.value).toBe(false);
    on.toggle();
    on.onFocusout();
    expect(open.value).toBe(false);
  });
  it('a click while hovered keeps it shown', () => {
    const open = ref(false);
    const on = useTipTriggers(open);
    on.onPointerenter(pointer('mouse'));
    on.toggle();
    expect(open.value).toBe(true);
    on.onPointerleave();
    expect(open.value).toBe(false);
  });
});
