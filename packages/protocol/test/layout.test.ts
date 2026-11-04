import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TOOLS, extractStructureTags, normalizeStructure, orderPrefixed, parseTurnObject, structureFieldSchema, turnArtifacts, turnLayout,
  type Stage, type StructureDecl, type ToolsDecl, type Workflow,
} from '../src';

const stages: Stage[] = [
  { id: 'think', actor: 'narrator', kind: 'text', label: 'Thinking', tool: { name: 'think', param: { name: 'thought' } } },
  { id: 'story', actor: 'narrator', kind: 'content', label: 'Writing', tool: { name: 'write_story', param: { name: 'story' } } },
  { id: 'review', actor: 'narrator', kind: 'text', label: 'Review', optional: true },
];
const wf = (over: Partial<Workflow> = {}): Workflow => ({ id: 'w', name: 'W', kind: 'story', stages, sections: { intro: {}, outro: {}, stages: {} }, ...over });
const decl = (id: string, kind: StructureDecl['kind'], over: Partial<StructureDecl> = {}): StructureDecl =>
  ({ id, kind, tag: id, field: id, formatPrompt: { tag: '', field: 'Fill `{{field}}`.' }, ...over });
const status = decl('status', 'status', { order: { before: '@content' }, description: 'Status in `{{field}}`', properties: { weather: 'Weather ({{field}})' } });
const synopsis = decl('synopsis', 'synopsis');
const options = decl('options', 'options');
const prefixed: ToolsDecl = { ...DEFAULT_TOOLS, turn: { ...DEFAULT_TOOLS.turn, field: '{{stage}}' }, orderPrefix: '{{n}}_' };
const legacy: ToolsDecl = { ...DEFAULT_TOOLS, turn: { ...DEFAULT_TOOLS.turn, field: 'step{{n}}_{{stage}}' } };

describe('turn layout (I-134)', () => {
  it('keeps the legacy placement: structures after the terminal content stage, in declaration order', () => {
    const a = turnArtifacts(legacy, wf(), stages, [synopsis, options]);
    expect(Object.keys(a.turnSchema().properties as object)).toEqual(['step1_think', 'step2_story', 'synopsis', 'options', 'step3_review']);
    const tools = a.stageTools();
    expect(Object.keys(tools[1]!.function.parameters.properties as object)).toEqual(['story', 'synopsis', 'options']);
    expect(Object.keys(tools[0]!.function.parameters.properties as object)).toEqual(['thought']);
  });

  it('honours structures.after, falling back to the content stage when that stage is inactive', () => {
    const w = wf({ structuresAfter: 'review' });
    expect(Object.keys(turnArtifacts(legacy, w, stages, [synopsis]).turnSchema().properties as object)).toEqual(['step1_think', 'step2_story', 'step3_review', 'synopsis']);
    const active = stages.slice(0, 2);
    expect(Object.keys(turnArtifacts(legacy, w, active, [synopsis]).turnSchema().properties as object)).toEqual(['step1_think', 'step2_story', 'synopsis']);
  });

  it('mixes structures with stages by order (before / after a stage, absolute keys)', () => {
    const late = decl('late', 'custom', { order: 250 });
    const first = decl('first', 'custom', { order: { before: 'think' } });
    const layout = turnLayout(wf(), stages, [synopsis, status, late, first], legacy, (s) => s.id);
    expect(layout.items.map((x) => (x.type === 'stage' ? x.stage.id : x.structure.id))).toEqual(['first', 'think', 'status', 'story', 'synopsis', 'late', 'review']);
  });

  it('lets a workflow override a structure position and stages set their own keys', () => {
    const w = wf({ structureOrder: { status: { after: 'review' } }, stages: stages.map((s, i) => ({ ...s, order: (i + 1) * 10 })) });
    const layout = turnLayout(w, w.stages, [status, decl('mid', 'custom', { order: 15 })], legacy, (s) => s.id);
    expect(layout.items.map((x) => (x.type === 'stage' ? x.stage.id : x.structure.id))).toEqual(['think', 'mid', 'story', 'review', 'status']);
  });

  it('finds a structure by id: a turn may request a copy of its declaration', () => {
    const naming = decl('storyline', 'storyline');
    const layout = turnLayout(wf(), stages, [{ ...naming, requested: ['name'] }], prefixed, (s) => s.id);
    expect(layout.structureField(naming)).toBe('3_storyline');
    expect(layout.hostOf(naming)?.id).toBe('story');
  });

  it('skips inline structures', () => {
    const layout = turnLayout(wf(), stages, [decl('annotations', 'annotations')], legacy, (s) => s.id);
    expect(layout.items).toHaveLength(3);
  });
});

describe('ordering prefix (I-135)', () => {
  it('numbers stages and structures together, zero-padded to the widest position', () => {
    expect(orderPrefixed('{{n}}_', 3, 9, 'x')).toBe('3_x');
    expect(orderPrefixed('{{n}}_', 3, 12, 'x')).toBe('03_x');
    expect(orderPrefixed('s{{n}}_', 12, 120, 'x')).toBe('s012_x');
    const a = turnArtifacts(prefixed, wf(), stages, [status, synopsis, options]);
    const props = a.turnSchema().properties as Record<string, any>;
    expect(Object.keys(props)).toEqual(['1_think', '2_status', '3_story', '4_synopsis', '5_options', '6_review']);
    expect(Object.keys(props)).toEqual(Object.keys(props).sort());
    expect(a.structureFieldOf(status)).toBe('2_status');
    // `{{field}}` is the name of this turn
    expect(props['2_status'].description).toBe('Status in `2_status`');
    expect(props['2_status'].properties.weather.description).toBe('Weather (2_status)');
    const ten = Array.from({ length: 8 }, (_, i) => decl(`c${i}`, 'custom'));
    const b = turnArtifacts(prefixed, wf(), stages, [status, ...ten]);
    expect(Object.keys(b.turnSchema().properties as object)[0]).toBe('01_think');
    expect(Object.keys(b.turnSchema().properties as object).at(-1)).toBe('12_review');
  });

  it('places structures on the neighbouring stage tool and prefixes its parameters', () => {
    const a = turnArtifacts(prefixed, wf(), stages, [status, synopsis]);
    const tools = a.stageTools();
    expect(Object.keys(tools[0]!.function.parameters.properties as object)).toEqual(['1_thought', '2_status']);
    expect(Object.keys(tools[1]!.function.parameters.properties as object)).toEqual(['3_story', '4_synopsis']);
    expect(Object.keys(tools[2]!.function.parameters.properties as object)).toEqual(['content']);
    expect(a.paramOf(stages[0]!)).toBe('1_thought');
    expect(a.paramOf(stages[2]!)).toBe('content');
    // a structure before every stage rides on the first stage tool, ahead of its own parameter
    const early = decl('early', 'custom', { order: 1 });
    const t2 = turnArtifacts(prefixed, wf(), stages, [early]).stageTools();
    expect(Object.keys(t2[0]!.function.parameters.properties as object)).toEqual(['1_early', '2_thought']);
  });

  it('renumbers when stages are inactive and parses the per-turn names', () => {
    const active = [stages[1]!];
    const a = turnArtifacts(prefixed, wf(), active, [status, synopsis]);
    expect(Object.keys(a.turnSchema().properties as object)).toEqual(['1_status', '2_story', '3_synopsis']);
    const r = parseTurnObject(
      { '1_status': { date: 'Day 3', weekday: 'Tue', time: '14:20', location: 'Library', weather: 'Rain' }, '2_story': 'Text', '3_synopsis': { time: 't', location: 'l', event: 'e', summary: 's' } },
      { stages: active, structures: [status, synopsis], final: true, fieldOf: a.fieldOf, structureFieldOf: a.structureFieldOf },
    );
    expect(r.content).toBe('Text');
    expect(r.structures.status).toEqual({ date: 'Day 3', weekday: 'Tue', time: '14:20', location: 'Library', weather: 'Rain' });
    expect((r.structures.synopsis as any).event).toBe('e');
    // models that renumber or drop the prefix are still understood
    const loose = parseTurnObject({ '2_story': 'Text', '9_status': { date: 'D' }, synopsis: { event: 'e' } }, { stages: active, structures: [status, synopsis], final: true, fieldOf: a.fieldOf, structureFieldOf: a.structureFieldOf });
    expect((loose.structures.status as any).date).toBe('D');
    expect((loose.structures.synopsis as any).event).toBe('e');
  });

  it('reports the open structure while streaming', () => {
    const a = turnArtifacts(prefixed, wf(), stages, [status]);
    const r = parseTurnObject({ '1_think': 'x', '2_status': { date: 'D' } }, { stages, structures: [status], final: false, openKey: '2_status', fieldOf: a.fieldOf, structureFieldOf: a.structureFieldOf });
    expect(r.openStructures).toEqual(['status']);
  });
});

describe('status structure (I-136)', () => {
  it('has a fixed object schema with described sub-fields', () => {
    const s = structureFieldSchema(decl('status', 'status', { properties: { date: 'Date or Day N' } }));
    expect(s.required).toEqual(['date', 'weekday', 'time', 'location', 'weather']);
    expect((s.properties as any).date.description).toBe('Date or Day N');
  });

  it('parses JSON leniently and tag blocks', () => {
    expect(normalizeStructure('status', { day: 'Day 2', week: 'Mon', time: ' 9:00 ', place: 'Inn' })).toEqual({ date: 'Day 2', weekday: 'Mon', time: '9:00', location: 'Inn', weather: '' });
    expect(normalizeStructure('status', '{"date":"03-14","weather":"Snow"}')).toMatchObject({ date: '03-14', weather: 'Snow' });
    expect(normalizeStructure('status', 'nope')).toBeUndefined();
    const text = 'Before\n<status><date>Day 1</date><weekday>Sunday</weekday><time>20:00</time><location>Harbor &amp; pier</location><weather>Fog</weather></status>\nAfter';
    const r = extractStructureTags(text, [decl('status', 'status')]);
    expect(r.values.status).toEqual({ date: 'Day 1', weekday: 'Sunday', time: '20:00', location: 'Harbor & pier', weather: 'Fog' });
    expect(r.text.replace(/\s+/g, ' ').trim()).toBe('Before After');
  });
});
