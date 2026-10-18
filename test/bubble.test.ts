import { describe, expect, it } from 'vitest';
import { place } from '@/ui/components/bubble';

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
