import { describe, expect, it } from 'vitest';
import {
  applyPatches, deepMerge, diffObjects, expandMacros, extractStructureTags, parseDialogue, parseMeta,
  parseTurnObject, partialTagTail, satisfies, applyMigrations, replyToPlainText, buildTurnSchema, workflowSummary,
  type Stage, type StructureDecl, type Workflow,
} from '../src';

const structures: StructureDecl[] = [
  { id: 'synopsis', kind: 'synopsis', tag: 'synopsis', field: 'synopsis', formatPrompt: { tag: '', field: '' } },
  { id: 'options', kind: 'options', tag: 'options', field: 'options', formatPrompt: { tag: '', field: '' } },
  { id: 'memory', kind: 'memory', tag: 'Freesia_Memory', field: 'memory_ops', formatPrompt: { tag: '', field: '' } },
  { id: 'reply', kind: 'reply', tag: 'Freesia_Reply', field: 'reply', formatPrompt: { tag: '', field: '' } },
];

const linear: Stage[] = [
  { id: 'questions', actor: 'narrator', kind: 'text', label: 'Asking Questions' },
  { id: 'planning', actor: 'editor', kind: 'text', label: 'Planning' },
  { id: 'final', actor: 'narrator', kind: 'content', label: 'Drafting' },
];
const prefixes = { narrator: 'Freesia: ', editor: 'Petals: ', user: 'User: ' };
const dialogue = (text: string, final = true, stages = linear) =>
  parseDialogue(text, { stages, prefixes, user: 'user', contentMarker: '<START_OF_CONTENT>', structures, format: 'prefix', final });

const sample = [
  ' Petals, how should the scene open?',
  '',
  'Petals: Open with the rain. Keep it under 600 words.',
  '',
  'Freesia: Thank you! <START_OF_CONTENT>',
  'The rain fell softly on the old roof.',
  '',
  '"You came," she said.',
  '<synopsis><time>Day1 20:00</time><location>Attic</location><event>Reunion</event><summary>They meet.</summary></synopsis>',
  '<options><option title="Stay">I stay.</option><option title="Leave">I leave &amp; run.</option></options>',
].join('\n');

describe('dialogue parsing', () => {
  it('splits stages by actor prefixes and finds the content marker', () => {
    const r = dialogue(sample);
    expect(r.stages.questions!.text).toBe('Petals, how should the scene open?');
    expect(r.stages.planning!.text).toContain('Open with the rain');
    expect(r.content).toBe('The rain fell softly on the old roof.\n\n"You came," she said.');
    expect(r.structures.synopsis).toEqual({ time: 'Day1 20:00', location: 'Attic', event: 'Reunion', summary: 'They meet.' });
    expect(r.structures.options).toEqual([{ label: 'Stay', content: 'I stay.' }, { label: 'Leave', content: 'I leave & run.' }]);
    expect(r.stages.final!.status).toBe('done');
  });

  it('is consistent for every streaming prefix and ends with the full result', () => {
    let lastContent = '';
    for (let i = 1; i <= sample.length; i++) {
      const r = dialogue(sample.slice(0, i), false);
      // the content seen by the UI never contains a structure tag
      expect(r.content.includes('<synopsis')).toBe(false);
      if (r.content) lastContent = r.content;
    }
    expect(lastContent).toBe(dialogue(sample).content);
  });

  it('stops at a hallucinated user prefix', () => {
    const r = dialogue(`${sample}\nUser: and then?`);
    expect(r.content.includes('and then')).toBe(false);
  });

  it('falls back to the last narrator segment without a marker', () => {
    const r = dialogue('Freesia: q?\nPetals: a.\nFreesia: The story.');
    expect(r.content).toBe('The story.');
    expect(r.warnings).toContain('content-marker-missing');
  });

  it('parses tagged stages (task / edit)', () => {
    const task: Stage[] = [
      { id: 'thinking', actor: 'narrator', kind: 'text', label: 'Thinking', tag: 'thinking' },
      { id: 'content', actor: 'narrator', kind: 'content', label: 'Output', optional: true },
    ];
    const r = dialogue('<thinking>hmm</thinking>\n<Freesia_Reply><p>Hi!</p></Freesia_Reply>', true, task);
    expect(r.stages.thinking!.text).toBe('hmm');
    expect(r.structures.reply).toBe('<p>Hi!</p>');
    expect(r.content).toBe('');
    const edit: Stage[] = [...linear, { id: 'review', actor: 'narrator', kind: 'text', label: 'Review', tag: 'Freesia_Review' }, { id: 'edit', actor: 'narrator', kind: 'patch', label: 'Edit', tag: 'Freesia_Edit', optional: true }];
    const e = dialogue(`${sample}\n<Freesia_Review>ok</Freesia_Review><Freesia_Edit><old_string>softly</old_string><new_string>gently</new_string></Freesia_Edit>`, true, edit);
    expect(e.stages.review!.text).toBe('ok');
    expect(e.stages.edit!.patches).toEqual([{ old_string: 'softly', new_string: 'gently' }]);
  });
});

describe('object parsing', () => {
  it('maps numbered fields to stages and structures', () => {
    const r = parseTurnObject({ step1_narrator_questions: 'q', step2_editor_planning: 'p', step3_narrator_final: 'Story', memory_ops: [{ scope: 'global_memory', operation: 'delete', key: 'k', content: 'x' }] }, { stages: linear, structures, final: true });
    expect(r.content).toBe('Story');
    expect(r.structures.memory).toEqual([{ scope: 'global_memory', operation: 'delete', key: 'k', content: null }]);
  });
  it('builds an ordered schema with structures after the content stage', () => {
    const wf: Workflow = { id: 'linear', name: 'Linear', kind: 'story', stages: linear, sections: { intro: {}, outro: {}, stages: {} } };
    const schema = buildTurnSchema(wf, linear, structures.slice(0, 2)) as { properties: object; required: string[] };
    expect(Object.keys(schema.properties)).toEqual(['step1_narrator_questions', 'step2_editor_planning', 'step3_narrator_final', 'synopsis', 'options']);
    expect(workflowSummary(linear, (a) => (a === 'narrator' ? 'Freesia' : 'Petals'))).toBe('Start -> Asking Questions (Freesia) -> Planning (Petals) -> Drafting (Freesia) -> (End)');
  });
});

describe('tags, patches, meta, macros, config', () => {
  it('holds back partial tags', () => {
    expect(partialTagTail('Hello <synop')).toBe(6);
    expect(partialTagTail('a < b')).toBe(0);
    expect(partialTagTail('done <b>x</b>')).toBe(0);
  });
  it('extracts memory blocks', () => {
    const x = extractStructureTags('a<Freesia_Memory><scope>memory</scope><operation>replace</operation><key>Tone</key><content>Soft &lt;3</content></Freesia_Memory>b', structures);
    expect(x.text).toBe('ab');
    expect(x.values.memory).toEqual([{ scope: 'memory', operation: 'replace', key: 'Tone', content: 'Soft <3' }]);
  });
  it('applies patches exactly, then whitespace-normalised, skipping ambiguity', () => {
    const { text, results } = applyPatches('one two  three. one', [
      { old_string: 'two three', new_string: '2 3' },
      { old_string: 'one', new_string: '1' },
      { old_string: 'zzz', new_string: '' },
    ]);
    expect(text).toBe('one 2 3. one');
    expect(results.map((r) => r.status)).toEqual(['applied', 'ambiguous', 'not-found']);
    expect(results[0]!.fuzzy).toBe(true);
  });
  it('parses meta segments', () => {
    expect(parseMeta('@Freesia 总结一下', '@Freesia')).toMatchObject({ pure: true, segments: ['总结一下'] });
    const mixed = parseMeta('I open the door.\n\n@Freesia make it scarier\n\nThen I wait.', '@Freesia');
    expect(mixed).toMatchObject({ mixed: true, segments: ['make it scarier'], stripped: 'I open the door.\n\nThen I wait.' });
    expect(parseMeta('Walk @Freesia{be {gentle}} home', '@Freesia')).toMatchObject({ segments: ['be {gentle}'], stripped: 'Walk  home' });
    expect(parseMeta('@Freesiax', '@Freesia').present).toBe(false);
  });
  it('expands nested macros', () => {
    const names: Record<string, string> = { narrator: 'Freesia' };
    const out = expandMacros('{{ap::prefix::narrator}}hi {{ap::unknown}}', ([h, a]) => (h === 'prefix' ? `{{ap::name::${a}}}: ` : h === 'name' ? names[a!] : undefined));
    expect(out).toBe('Freesia: hi {{ap::unknown}}');
  });
  it('merges, diffs and migrates configuration layers', () => {
    const base = { a: 1, b: { c: 2, d: [1] } };
    const full = deepMerge(base, { b: { c: 3 } });
    expect(full).toEqual({ a: 1, b: { c: 3, d: [1] } });
    expect(diffObjects(full, base)).toEqual({ b: { c: 3 } });
    expect(satisfies('6.0.0-alpha.9', '<7.0.0')).toBe(true);
    expect(applyMigrations({ modules: { old: true } }, [{ from: '<7.0.0', rename: { modules: { old: 'new' } } }], '6.1.0')).toEqual({ modules: { new: true } });
  });
  it('converts replies to plain text', () => {
    expect(replyToPlainText('<p>Hello</p><p special>Dear</p><blockquote>q &amp; a</blockquote>')).toBe('Hello\n\nDear\n\nq & a');
  });
});
