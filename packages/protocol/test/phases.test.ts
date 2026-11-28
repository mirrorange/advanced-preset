import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TOOLS, dialogueReplay, emptyTurn, mergeTurns, objectReplay, parseDialogue, parseTurnObject, phaseGroups, planPhases, replayItems,
  structureTagText, toolReplay, turnArtifacts, extractStructureTags,
  type Stage, type StructureDecl, type Workflow,
} from '../src';

const stage = (id: string, actor: string, kind: Stage['kind'] = 'text', extra: Partial<Stage> = {}): Stage => ({ id, actor, kind, label: id, ...extra });
const stages = [stage('questions', 'narrator'), stage('planning', 'editor'), stage('draft', 'narrator'), stage('final', 'narrator', 'content'), stage('review', 'editor')];
const workflow = { id: 'w', name: 'w', kind: 'story', stages, sections: { intro: {}, outro: {}, stages: {} } } as Workflow;
const synopsis = { id: 'synopsis', kind: 'synopsis', tag: 'synopsis', field: 'synopsis', formatPrompt: { tag: '', field: '' } } as StructureDecl;
const reply = { id: 'reply', kind: 'reply', tag: 'reply', field: 'reply', formatPrompt: { tag: '', field: '' }, order: { after: 'planning' } } as StructureDecl;
const annotations = { id: 'notes', kind: 'annotations', tag: 'note', field: 'notes', formatPrompt: { tag: '', field: '' } } as StructureDecl;

describe('phases', () => {
  it('consecutive stages of one actor are one phase; off: a single phase', () => {
    expect(phaseGroups(stages, true).map((g) => [g.actor, g.stages.map((s) => s.id)])).toEqual([
      ['narrator', ['questions']], ['editor', ['planning']], ['narrator', ['draft', 'final']], ['editor', ['review']],
    ]);
    expect(phaseGroups(stages, false)).toEqual([{ actor: '', stages }]);
  });

  it('structures go with the stage that carries them; inline ones with the content stage', () => {
    const art = turnArtifacts(DEFAULT_TOOLS, workflow, stages, [synopsis, reply, annotations]);
    const phases = planPhases(stages, [synopsis, reply, annotations], art.layout, true);
    expect(phases.map((p) => p.structures.map((s) => s.id))).toEqual([[], ['reply'], ['synopsis', 'notes'], []]);
    expect(planPhases(stages, [synopsis], art.layout, false)[0]!.structures).toEqual([synopsis]);
  });

  it('a phase keeps the turn-wide names but only asks for its own stages and structures', () => {
    const full = turnArtifacts(DEFAULT_TOOLS, workflow, stages, [synopsis, reply]);
    const phase = turnArtifacts(DEFAULT_TOOLS, workflow, stages, [synopsis, reply], undefined, [stages[2]!, stages[3]!]);
    expect(Object.keys(phase.turnSchema().properties as object)).toEqual(['step3_narrator_draft', 'step4_narrator_final', 'synopsis']);
    expect(phase.stageTools().map((t) => t.function.name)).toEqual(['ap_stage_draft', 'ap_stage_final']);
    expect(phase.fieldOf(stages[4]!)).toBe(full.fieldOf(stages[4]!));
    expect(Object.keys(full.turnSchema().properties as object)).toHaveLength(7);
  });

  it('merges phase results into one turn', () => {
    const a = emptyTurn([stages[0]!]);
    a.stages.questions = { text: 'Q', status: 'done' };
    const b = emptyTurn([stages[2]!, stages[3]!]);
    b.stages.draft = { text: 'D', status: 'done' };
    b.stages.final = { text: ' The end. ', status: 'done' };
    b.structures.synopsis = { time: 't' };
    b.contentStarted = true;
    const m = mergeTurns(stages, [{ stages: [stages[0]!], turn: a }, { stages: [stages[2]!, stages[3]!], turn: b }], true);
    expect(m.stages.questions!.text).toBe('Q');
    expect(m.stages.planning!.status).toBe('pending');
    expect(m.content).toBe('The end.');
    expect(m.structures).toEqual({ synopsis: { time: 't' } });
    expect(m.contentStarted).toBe(true);
  });
});

describe('replay of earlier phases', () => {
  const turn = emptyTurn(stages);
  turn.stages.questions = { text: 'What now?', status: 'done' };
  turn.stages.planning = { text: 'Go north.', status: 'done' };
  turn.structures.reply = '<p>Sure.</p>';
  const art = turnArtifacts(DEFAULT_TOOLS, workflow, stages, [reply]);
  const phases = planPhases(stages, [reply], art.layout, true);
  const items = replayItems(phases.slice(0, 2), turn, art.layout);

  it('stages with output, in order, with the structures they carry; nothing else', () => {
    expect(items.map((i) => [i.stage.id, i.text, i.structures.map((s) => s.decl.id)])).toEqual([['questions', 'What now?', []], ['planning', 'Go north.', ['reply']]]);
  });

  it('dialogue text reads back as the same stages', () => {
    const prefixes = { narrator: 'Freesia: ', editor: 'Petals: ', user: 'Me: ' };
    const text = dialogueReplay(items, { prefixes, format: 'prefix', contentMarker: '<START>', stages });
    expect(text).toBe('Freesia: What now?\n\nPetals: Go north.\n\n<reply><p>Sure.</p></reply>');
    const back = parseDialogue(text, { stages: stages.slice(0, 2), prefixes, user: 'user', contentMarker: '<START>', structures: [reply], format: 'prefix', final: true });
    expect(back.stages.questions!.text).toBe('What now?');
    expect(back.stages.planning!.text).toBe('Go north.');
    expect(back.structures.reply).toBe('<p>Sure.</p>');
    const tagged = dialogueReplay(items, { prefixes, format: 'tag', contentMarker: '', stages });
    expect(tagged).toContain('<questions>\nWhat now?\n</questions>');
  });

  it('terminal content gets the content marker; patches their tag blocks', () => {
    const t = emptyTurn(stages);
    t.stages.final = { text: 'Story.', status: 'done' };
    const edit = stage('edit', 'editor', 'patch');
    const withEdit = [...stages, edit];
    t.stages.edit = { patches: [{ old_string: 'a<b', new_string: 'c' }], status: 'done' };
    const text = dialogueReplay([{ stage: stages[3]!, text: 'Story.', structures: [] }, { stage: edit, patches: t.stages.edit.patches, structures: [] }], { prefixes: { narrator: 'F: ' }, format: 'prefix', contentMarker: '<START>', stages: withEdit });
    expect(text).toBe('F: <START>\nStory.\n\n<edit><old_string>a&lt;b</old_string><new_string>c</new_string></edit>');
  });

  it('structure values back as tag blocks', () => {
    expect(structureTagText(synopsis, { time: 'noon', location: 'x' })).toBe('<synopsis><time>noon</time><location>x</location></synopsis>');
    expect(extractStructureTags(structureTagText(synopsis, { time: 'noon', location: 'x', event: 'e', summary: 's' }), [synopsis]).values.synopsis).toMatchObject({ time: 'noon', summary: 's' });
  });

  it('object and tool replays use the turn-wide names', () => {
    const obj = objectReplay(items, art);
    expect(obj).toEqual({ step1_narrator_questions: 'What now?', step2_editor_planning: 'Go north.', reply: '<p>Sure.</p>' });
    const back = parseTurnObject(obj, { stages: stages.slice(0, 2), structures: [reply], final: true, fieldOf: art.fieldOf, structureFieldOf: art.structureFieldOf });
    expect(back.stages.planning!.text).toBe('Go north.');
    expect(toolReplay(items, art)).toEqual([
      { stage: stages[0], name: 'ap_stage_questions', arguments: { content: 'What now?' } },
      { stage: stages[1], name: 'ap_stage_planning', arguments: { content: 'Go north.', reply: '<p>Sure.</p>' } },
    ]);
  });
});
