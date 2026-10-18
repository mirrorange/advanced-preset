import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TOOLS, FORMAT_VERSION, parseTurnObject, toGeminiSchema, turnArtifacts, upgradeArtifact,
  type Stage, type StructureDecl, type ToolsDecl, type Workflow,
} from '../src';

const stages: Stage[] = [
  { id: 'questions', actor: 'narrator', kind: 'text', label: 'Asking Questions', tool: { name: 'ask_questions', param: { name: 'questions', description: 'Questions for {{ap::name::editor}}' } } },
  { id: 'final', actor: 'narrator', kind: 'content', label: 'Drafting', field: { name: 'story', description: 'The story ({{label}})' } },
  { id: 'edit', actor: 'narrator', kind: 'patch', label: 'Editing', optional: true },
];
const wf: Workflow = { id: 'edit', name: 'Edit', kind: 'story', stages, sections: { intro: {}, outro: {}, stages: {} } };
const structures: StructureDecl[] = [
  { id: 'synopsis', kind: 'synopsis', tag: 'synopsis', field: 'synopsis', description: 'Event synopsis', properties: { time: 'In-story time' }, formatPrompt: { tag: '', field: '' } },
  { id: 'notes', kind: 'custom', shape: 'kv', tag: 'notes', field: 'notes', formatPrompt: { tag: '', field: '' } },
];
const tools: ToolsDecl = {
  turn: { name: 'petals_turn', description: 'One turn', field: '{{n}}_{{stage}}', fieldDescription: '{{label}} by {{actor}}' },
  submit: { name: 'submit_turn', description: 'Submit as {{ap::name::narrator}}' },
  stage: { name: 'stage_{{stage}}', description: 'Stage {{n}}: {{label}}', param: { name: 'text' }, patchParam: { name: 'edits', description: 'Edits' } },
  patch: { old: 'Exact old text', new: 'Replacement' },
  envelope: { thinking: { name: 'reasoning', description: 'Think first' }, result: { name: 'answer' } },
  results: { next: 'ok {{next}}', done: 'done', unknown: '? {{name}}', nudge: 'go {{next}}' },
  jsonStringHint: '(JSON string)',
};
const expand = (s: string) => s.replaceAll('{{ap::name::editor}}', 'Petals').replaceAll('{{ap::name::narrator}}', 'Freesia');

describe('preset-defined tool texts', () => {
  const a = turnArtifacts(tools, wf, stages, structures, expand);

  it('names stage fields from the template unless the stage overrides them', () => {
    expect(stages.map(a.fieldOf)).toEqual(['1_questions', 'story', '3_edit']);
    const schema = a.schema();
    expect(schema.name).toBe('petals_turn');
    expect(schema.description).toBe('One turn');
    const props = schema.value.properties as Record<string, any>;
    expect(Object.keys(props)).toEqual(['1_questions', 'story', 'synopsis', 'notes', '3_edit']);
    expect(props['1_questions'].description).toBe('Asking Questions by narrator');
    expect(props.story.description).toBe('The story (Drafting)');
    expect(props.synopsis.description).toBe('Event synopsis');
    expect(props.synopsis.properties.time.description).toBe('In-story time');
    expect(props.synopsis.properties.location.description).toBeUndefined();
    expect(props['3_edit'].items.properties.old_string.description).toBe('Exact old text');
    expect(schema.value.required).toEqual(['1_questions', 'story', 'synopsis', 'notes']);
  });

  it('builds submit and stage tools with preset names, params and descriptions', () => {
    const submit = a.submitTool();
    expect(submit.function.name).toBe('submit_turn');
    expect(submit.function.description).toBe('Submit as Freesia');
    const st = a.stageTools();
    expect(st.map((t) => t.function.name)).toEqual(['ask_questions', 'stage_final', 'stage_edit']);
    expect(st[0]!.function.description).toBe('Stage 1: Asking Questions');
    expect(Object.keys((st[0]!.function.parameters as any).properties)).toEqual(['questions']);
    expect((st[0]!.function.parameters as any).properties.questions.description).toBe('Questions for Petals');
    expect(Object.keys((st[1]!.function.parameters as any).properties)).toEqual(['text', 'synopsis', 'notes']);
    expect((st[2]!.function.parameters as any).properties.edits.description).toBe('Edits');
    expect(a.stageOfTool('stage_edit')?.id).toBe('edit');
    expect(a.paramOf(stages[0]!)).toBe('questions');
    expect(a.toolNames()).toEqual(['submit_turn', 'ask_questions', 'stage_final', 'stage_edit']);
  });

  it('wraps caller schemas with preset envelope keys', () => {
    const env = a.envelope({ type: 'object', properties: { x: { type: 'string' } } }) as any;
    expect(Object.keys(env.properties)).toEqual(['reasoning', 'answer']);
    expect(env.properties.reasoning.description).toBe('Think first');
  });

  it('parses turn objects with custom field names', () => {
    const r = parseTurnObject({ '1_questions': 'q', story: 'Rain.' }, { stages, structures, final: true, fieldOf: a.fieldOf });
    expect(r.stages.questions!.text).toBe('q');
    expect(r.content).toBe('Rain.');
  });

  it('only appends the preset hint for JSON-string maps', () => {
    expect(toGeminiSchema({ type: 'object', additionalProperties: { type: 'string' } })).toEqual({ type: 'string' });
    expect(toGeminiSchema({ type: 'object', description: 'm', additionalProperties: {} }, { jsonStringHint: tools.jsonStringHint })).toEqual({ type: 'string', description: 'm (JSON string)' });
  });
});

describe('artifact upgrade', () => {
  it('keeps format-1 tool names and texts', () => {
    const v1 = { formatVersion: 1, id: 'x', entries: [], tools: { submit: 'S', stagePrefix: 'ap_stage_', structures: 'x', stageResult: 'R {{next}}', nudge: 'N' } };
    const up = upgradeArtifact(v1)!;
    expect(up.formatVersion).toBe(FORMAT_VERSION);
    expect(up.tools.submit).toEqual({ name: 'ap_submit_turn', description: 'S' });
    expect(up.tools.results.next).toBe('R {{next}}');
    const a = turnArtifacts(up.tools, wf, stages.map(({ tool: _t, field: _f, ...s }) => s), []);
    expect(a.stageTools().map((t) => t.function.name)).toEqual(['ap_stage_questions', 'ap_stage_final', 'ap_stage_edit']);
    expect(Object.keys(a.turnSchema().properties as object)).toEqual(['step1_narrator_questions', 'step2_narrator_final', 'step3_narrator_edit']);
    expect(a.schema().name).toBe('ap_turn');
    expect(upgradeArtifact({ formatVersion: 9, id: 'x', entries: [] })).toBeNull();
    expect(DEFAULT_TOOLS.stage.param.name).toBe('content');
  });
});
