import { describe, expect, it } from 'vitest';
import { parseAnnotations } from '@advanced-preset/protocol';
import { locate, matchAnnotation } from '@/ui/annotations/match';

const parsed = (raw: string) => parseAnnotations(raw);

describe('matchAnnotation (I-84)', () => {
  it('finds the quote despite Markdown, quotes and whitespace changes', () => {
    const { text, annotations } = parsed('她说：“{==别回头==}{>>呼应第一章<<}。”\n\n*风*很大。');
    const surface = '她说：「别回头。」 风很大。';
    const [s, e] = matchAnnotation(surface, text, annotations[0]!)!;
    expect(surface.slice(s, e)).toBe('别回头');
  });

  it('disambiguates repeated quotes by context, then by occurrence index', () => {
    const { text, annotations } = parsed('门开了。门后是{==门==}{>>第三扇门<<}，门外是夜。');
    const surface = `<前端>${text}`;
    const [s] = matchAnnotation(surface, text, annotations[0]!)!;
    expect(s).toBe(surface.indexOf('是门') + 1);
  });

  it('skips short ambiguous quotes without context', () => {
    const { text, annotations } = parsed('{==门==}{>>x<<}');
    expect(matchAnnotation('门 门', text, annotations[0]!)).toBeNull();
    expect(matchAnnotation('没有', text, annotations[0]!)).toBeNull();
  });

  it('maps offsets to text-node chunks', () => {
    const chunks = ['ab', 'cd', 'ef'];
    expect(locate(chunks, 0)).toEqual([0, 0]);
    expect(locate(chunks, 2)).toEqual([1, 0]);
    expect(locate(chunks, 2, true)).toEqual([0, 2]);
    expect(locate(chunks, 6, true)).toEqual([2, 2]);
  });
});
