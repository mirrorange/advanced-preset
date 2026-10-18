import { describe, expect, it } from 'vitest';
import { DEFAULT_TOOLS, type APreset, type ToolsDecl, type Transport } from '@advanced-preset/protocol';
import { createDriver } from '@/core/transports';
import { artifactsOf, presetToolNames } from '@/core/transports/base';
import type { ReadState } from '@/core/reader';
import { ctxFor, petals } from './helpers';

const base = { chat_completion_source: 'openai', stream: true, messages: [{ role: 'user', content: 'Hi' }], tools: [{ type: 'function', function: { name: 'st_tool' } }] };
const read = (over: Partial<ReadState>): ReadState => ({ text: '', reasoning: '', toolCalls: [], ...over });

/** Preset with custom tool texts, to prove nothing is hard-coded in the extension. */
const custom: APreset = {
  ...petals,
  tools: {
    ...DEFAULT_TOOLS,
    turn: { name: 'demo_turn', description: 'Turn of {{ap::name::narrator}}', field: '{{stage}}_{{n}}', fieldDescription: '{{label}}!' },
    submit: { name: 'hand_in', description: 'Hand in' },
    stage: { name: 'do_{{stage}}', description: 'Do {{label}}', param: { name: 'text', description: 'Text' }, patchParam: { name: 'fixes' } },
    envelope: { thinking: { name: 'musings' }, result: { name: 'answer' } },
    results: { next: 'NEXT {{next}}', done: 'DONE', unknown: 'WHO {{name}}', nudge: 'NUDGE {{next}}' },
    jsonStringHint: '(json)',
    callerSchemaHint: 'SCHEMA {{schema}}',
  } satisfies ToolsDecl,
};

function driverFor(transport: Transport, workflow = 'linear', preset: APreset = petals, caller: { tools: any[]; schema?: any } = { tools: [] }) {
  const ctx = ctxFor(transport, workflow, {}, preset);
  return { ctx, driver: createDriver({ ctx, base, messages: base.messages as never, caller, family: 'openai' }) };
}

/** A full turn object for the context's stages, keyed like the JSON schema. */
function turnObject(ctx: ReturnType<typeof ctxFor>) {
  const art = artifactsOf(ctx);
  const obj: Record<string, unknown> = {};
  for (const s of ctx.stages) obj[art.fieldOf(s)] = s.kind === 'content' ? 'The rain fell.' : s.kind === 'patch' ? [] : `${s.id} notes`;
  return obj;
}

describe('transport drivers', () => {
  it('story requests never carry ST-registered tools', () => {
    for (const t of ['prefill', 'plaintext', 'structured'] as Transport[]) {
      const { driver } = driverFor(t);
      expect(driver.body(0).tools).toBeUndefined();
    }
  });

  it('structured: json_schema request, content from the JSON reply', () => {
    const { ctx, driver } = driverFor('structured');
    const body = driver.body(0) as { json_schema?: { name: string; value: { properties: Record<string, unknown> } } };
    expect(body.json_schema?.name).toBe(ctx.preset.tools.turn.name);
    for (const s of ctx.stages) expect(body.json_schema!.value.properties).toHaveProperty(artifactsOf(ctx).fieldOf(s));
    const r = read({ text: JSON.stringify(turnObject(ctx)) });
    driver.progress(r, true);
    expect(driver.complete(r, 0).done).toBe(true);
    expect(driver.result().content).toBe('The rain fell.');
  });

  it('structured: partial JSON streams the content field', () => {
    const { ctx, driver } = driverFor('structured');
    const content = ctx.stages.find((s) => s.kind === 'content')!;
    const full = JSON.stringify(turnObject(ctx));
    const cut = full.indexOf('The rain') + 'The ra'.length;
    const turn = driver.progress(read({ text: full.slice(0, cut) }), false);
    expect(turn.stages[content.id]?.text).toBe('The ra');
  });

  it('tool-single: forced submit tool, arguments become the turn', () => {
    const { ctx, driver } = driverFor('tool-single');
    const body = driver.body(0) as { tools: { function: { name: string } }[]; tool_choice: unknown };
    const submit = ctx.preset.tools.submit.name;
    expect(body.tools.map((x) => x.function.name)).toContain(submit);
    expect(body.tools.map((x) => x.function.name)).not.toContain('st_tool');
    const r = read({ toolCalls: [{ id: 'c1', name: submit, arguments: JSON.stringify(turnObject(ctx)) }] });
    driver.progress(r, true);
    expect(driver.complete(r, 0).done).toBe(true);
    expect(driver.result().content).toBe('The rain fell.');
  });

  it('tool-multi: one tool per stage, continues until the content stage', () => {
    const { ctx, driver } = driverFor('tool-multi');
    const art = artifactsOf(ctx);
    const names = (driver.body(0) as { tools: { function: { name: string } }[] }).tools.map((x) => x.function.name);
    for (const s of ctx.stages) expect(names).toContain(art.toolOf(s));
    const [first, ...rest] = ctx.stages;
    const r0 = read({ toolCalls: [{ id: 'c0', name: art.toolOf(first!), arguments: JSON.stringify({ [art.paramOf(first!)]: 'step one' }) }] });
    driver.progress(r0, true);
    expect(driver.complete(r0, 0).done).toBe(false);
    // The next segment replays the call and its tool result.
    const msgs = (driver.body(1) as { messages: { role: string }[] }).messages;
    expect(msgs.some((m) => m.role === 'tool')).toBe(true);
    const calls = rest.map((s, i) => ({ id: `c${i + 1}`, name: art.toolOf(s), arguments: JSON.stringify({ [art.paramOf(s)]: s.kind === 'patch' ? [] : s.kind === 'content' ? 'The rain fell.' : 'more' }) }));
    const r1 = read({ toolCalls: calls });
    driver.progress(r1, true);
    expect(driver.complete(r1, 1).done).toBe(true);
    expect(driver.result().content).toBe('The rain fell.');
  });

  it('prefill: stop strings and dialogue parsing', () => {
    const { ctx, driver } = driverFor('prefill');
    const body = driver.body(0) as { stop?: string[] };
    for (const s of ctx.preset.stop) expect(body.stop).toContain(s);
    const text = `Petals: Plan it.\n\nFreesia: ${ctx.preset.contentMarker}\nThe rain fell.`;
    driver.progress(read({ text }), true);
    expect(driver.result().content).toBe('The rain fell.');
  });
});

describe('preset-defined tool texts', () => {
  it('structured: schema name, description and field names come from the preset', () => {
    const { ctx, driver } = driverFor('structured', 'linear', custom);
    const js = (driver.body(0) as any).json_schema;
    expect(js.name).toBe('demo_turn');
    expect(js.description).toBe('Turn of Freesia');
    const keys = Object.keys(js.value.properties);
    expect(keys.slice(0, ctx.stages.length)).toEqual(ctx.stages.map((s, i) => `${s.id}_${i + 1}`));
    expect(js.value.properties[keys[0]!].description).toBe(`${ctx.stages[0]!.label}!`);
    const r = read({ text: JSON.stringify(turnObject(ctx)) });
    driver.progress(r, true);
    expect(driver.result().content).toBe('The rain fell.');
  });

  it('tool-single: submit name / description from the preset; caller envelope keys', () => {
    const { driver } = driverFor('tool-single', 'linear', custom);
    const submit = (driver.body(0) as any).tools.find((t: any) => t.function.name === 'hand_in');
    expect(submit.function.description).toBe('Hand in');
    const task = driverFor('tool-single', 'task', custom, { tools: [], schema: { name: 'caller', value: { type: 'object', properties: { x: { type: 'string' } } } } });
    const params = (task.driver.body(0) as any).tools.find((t: any) => t.function.name === 'hand_in').function.parameters;
    expect(Object.keys(params.properties)).toEqual(['musings', 'answer']);
    const r = read({ toolCalls: [{ id: 'c', name: 'hand_in', arguments: JSON.stringify({ musings: 'hm', answer: { x: 'y' } }) }] });
    task.driver.progress(r, true);
    expect(task.driver.callerResult!()).toEqual({ x: 'y' });
  });

  it('tool-multi: stage tools, params and loop texts from the preset', () => {
    const { ctx, driver } = driverFor('tool-multi', 'linear', custom);
    const tools = (driver.body(0) as any).tools.filter((t: any) => t.function.name.startsWith('do_'));
    expect(tools.map((t: any) => t.function.name)).toEqual(ctx.stages.map((s) => `do_${s.id}`));
    expect(tools[0].function.description).toBe(`Do ${ctx.stages[0]!.label}`);
    expect(Object.keys(tools[0].function.parameters.properties)).toEqual(['text']);
    const r0 = read({ toolCalls: [{ id: 'c0', name: `do_${ctx.stages[0]!.id}`, arguments: JSON.stringify({ text: 'one' }) }, { id: 'cx', name: 'mystery', arguments: '{}' }] });
    driver.progress(r0, true);
    expect(driver.complete(r0, 0).done).toBe(false);
    const msgs = (driver.body(1) as any).messages as { role: string; content: string }[];
    const results = msgs.filter((m) => m.role === 'tool').map((m) => m.content);
    expect(results).toContain(`NEXT do_${ctx.stages[1]!.id}`);
    expect(results).toContain('WHO mystery');
  });

  it('text: caller schema hint from the preset', () => {
    const { driver } = driverFor('plaintext', 'task', custom, { tools: [], schema: { value: { type: 'object' } } });
    const msgs = (driver.body(0) as any).messages as { content: string }[];
    expect(msgs.some((m) => m.content.startsWith('SCHEMA {'))).toBe(true);
  });

  it('collects every tool name of the preset for caller filtering', () => {
    const names = presetToolNames(custom);
    expect(names.has('hand_in')).toBe(true);
    expect(names.has('do_final')).toBe(true);
    for (const t of custom.syntheticTurns) expect(names.has(t.tool.name)).toBe(true);
  });
});
