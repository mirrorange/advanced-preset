import { describe, expect, it } from 'vitest';
import { injectAnnotations, parseAnnotations, reanchorAnnotations } from '../src';

describe('parseAnnotations', () => {
  it('extracts highlight + comment pairs and keeps the text clean', () => {
    const r = parseAnnotations('她推开{==那扇旧门==}{>>第一章出现过的门。<<}，走了进去。');
    expect(r.text).toBe('她推开那扇旧门，走了进去。');
    expect(r.annotations).toEqual([
      { id: 'a1', start: 3, end: 7, quote: '那扇旧门', prefix: '她推开', suffix: '，走了进去。', comment: '第一章出现过的门。' },
    ]);
    expect(r.warnings).toEqual([]);
  });

  it('allows spaces between the parts and trims the comment', () => {
    const r = parseAnnotations('A {==b==}  {>>  note <<} c');
    expect(r.text).toBe('A b c');
    expect(r.annotations[0]).toMatchObject({ start: 2, end: 3, comment: 'note' });
  });

  it('handles lone and broken markers leniently', () => {
    expect(parseAnnotations('x {==y==} z').text).toBe('x y z');
    expect(parseAnnotations('x {>>gone<<} z').text).toBe('x  z');
    expect(parseAnnotations('x {==y and more\n\nnext').text).toBe('x y and more\n\nnext');
    expect(parseAnnotations('x {==y==}{>>open\n\nnext').text).toBe('x y{>>open\n\nnext');
    expect(parseAnnotations('x {>>never closed').text).toBe('x {>>never closed');
    expect(parseAnnotations('{++add++} {--del--}').text).toBe('{++add++} {--del--}');
  });

  it('does not span paragraphs', () => {
    const r = parseAnnotations('{==a\n\nb==}{>>c<<}');
    expect(r.annotations).toEqual([]);
    expect(r.text).toBe('a\n\nb==}');
  });

  it('streams a monotonic clean prefix that ends in the final text', () => {
    const raws = [
      '她推开{==那扇旧门==}{>>第一章出现过的门。<<}，走了 {==进去==} 。{>>x<<}{==a\n\nb',
      'x {==y==}{>>open\n\nnext {>>never',
      'p {==q==}   {>>r<<} s {',
    ];
    for (const raw of raws) {
      const final = parseAnnotations(raw).text;
      let prev = '';
      for (let n = 0; n <= raw.length; n++) {
        const t = parseAnnotations(raw.slice(0, n), { final: false }).text;
        expect(t.startsWith(prev), `${JSON.stringify(raw.slice(0, n))}: ${JSON.stringify(prev)} → ${JSON.stringify(t)}`).toBe(true);
        expect(final.startsWith(t)).toBe(true);
        prev = t;
      }
      expect(final.startsWith(prev)).toBe(true);
    }
  });

  it('never streams markers or comments', () => {
    const raw = 'A {==b==}{>>secret<<} c';
    for (let n = 0; n <= raw.length; n++) {
      const t = parseAnnotations(raw.slice(0, n), { final: false }).text;
      expect(t).not.toMatch(/[{}]|secret/);
    }
  });
});

describe('reanchor / inject', () => {
  const base = parseAnnotations('门开了。{==门==}{>>旧门<<}后是走廊。');

  it('keeps exact anchors and relocates by context after edits', () => {
    const same = reanchorAnnotations(base.text, base.annotations);
    expect(same.changed).toBe(false);
    const edited = `序章。${base.text}`;
    const r = reanchorAnnotations(edited, base.annotations);
    expect(r.changed).toBe(true);
    expect(r.annotations[0]!.start).toBe(base.annotations[0]!.start + 3);
    expect(edited.slice(r.annotations[0]!.start, r.annotations[0]!.end)).toBe('门');
  });

  it('marks orphans and recovers them', () => {
    const gone = reanchorAnnotations('全删了', base.annotations).annotations;
    expect(gone[0]!.orphan).toBe(true);
    const back = reanchorAnnotations(base.text, gone).annotations;
    expect(back[0]!.orphan).toBeUndefined();
    expect(back[0]!.start).toBe(base.annotations[0]!.start);
  });

  it('round-trips through CriticMarkup', () => {
    const raw = '门开了。{==门==}{>>旧门<<}后是走廊。';
    expect(injectAnnotations(base.text, base.annotations)).toBe(raw);
  });
});

import { buildTurnSchema, extractStructureTags, parseTurnObject, type StructureDecl, type Workflow } from '../src';

describe('annotations as an inline structure', () => {
  const ann: StructureDecl = { id: 'notes', kind: 'annotations', tag: 'notes', field: 'notes', formatPrompt: { tag: 'x', field: 'x' } };
  const stages = [{ id: 'final', actor: 'narrator', kind: 'content' as const, label: 'Story' }];
  const wf = { id: 'w', name: 'w', kind: 'story', stages, sections: {} } as unknown as Workflow;

  it('adds no schema field and is never extracted as a tag or field', () => {
    const schema = buildTurnSchema(wf, stages, [ann]) as { properties: Record<string, unknown> };
    expect(Object.keys(schema.properties)).not.toContain('notes');
    expect(extractStructureTags('a <notes>b</notes>', [ann]).text).toBe('a <notes>b</notes>');
    const r = parseTurnObject({ final: 'x', notes: 'y' }, { stages, structures: [ann], final: true, fieldOf: (s) => s.id });
    expect(r.structures).toEqual({});
  });
});
