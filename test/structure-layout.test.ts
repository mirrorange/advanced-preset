import { describe, expect, it } from 'vitest';
import { DEFAULT_TOOLS, type APreset, type StructureDecl } from '@advanced-preset/protocol';
import { createDriver } from '@/core/transports';
import { artifactsOf } from '@/core/transports/base';
import type { ReadState } from '@/core/reader';
import { ctxFor, petals } from './helpers';

// Unified turn order (I-134 / I-135): structures between stages, ordering-prefixed field names.
const status: StructureDecl = { id: 'status', kind: 'status', tag: 'status', field: 'status', order: { before: '@content' }, formatPrompt: { tag: '', field: 'Fill `{{field}}`.' } };
const reply: StructureDecl = { id: 'reply', kind: 'reply', tag: 'reply', field: 'reply', formatPrompt: { tag: '', field: 'Reply in `{{field}}`.' } };
const ordered: APreset = {
  ...petals,
  workflows: petals.workflows.map((w) => ({ ...w, stages: w.stages.map(({ field: _f, tool: _t, ...s }) => s) })),
  tools: { ...DEFAULT_TOOLS, orderPrefix: '{{n}}_', structurePrefix: '', turn: { ...DEFAULT_TOOLS.turn, field: '{{stage}}' } },
  structures: { status, reply },
};
const base = { chat_completion_source: 'openai', stream: true, messages: [{ role: 'user', content: 'Hi' }] };
const read = (over: Partial<ReadState>): ReadState => ({ text: '', reasoning: '', toolCalls: [], ...over });
const value = { date: 'Day 3', weekday: 'Mon', time: '20:00', location: 'Harbor', weather: 'Rain' };

function setup(transport: 'structured' | 'tool-single' | 'tool-multi') {
  const ctx = ctxFor(transport, 'linear', {}, ordered);
  ctx.structures = [status, reply];
  const driver = createDriver({ ctx, base, messages: base.messages as never, caller: { tools: [] }, family: 'openai' });
  return { ctx, driver, art: artifactsOf(ctx) };
}

describe('turn layout in the transports', () => {
  it('structured: prefixed fields sort in turn order; status sits before the content', () => {
    const { ctx, driver, art } = setup('structured');
    const keys = Object.keys(art.turnSchema().properties as object);
    expect([...keys].sort()).toEqual(keys);
    const content = ctx.stages.find((s) => s.kind === 'content')!;
    expect(keys.indexOf(art.structureFieldOf(status))).toBe(keys.indexOf(art.fieldOf(content)) - 1);
    expect(keys.at(-1)).toBe(art.structureFieldOf(reply));
    expect(art.structureFieldOf(status)).toMatch(/^\d+_status$/);
    const props = art.turnSchema().properties as Record<string, { description?: string }>;
    expect(props[art.structureFieldOf(status)]!.description ?? JSON.stringify(props[art.structureFieldOf(status)])).not.toContain('{{field}}');
    const obj: Record<string, unknown> = {};
    for (const s of ctx.stages) obj[art.fieldOf(s)] = s.kind === 'content' ? 'The rain fell.' : s.kind === 'patch' ? [] : 'notes';
    obj[art.structureFieldOf(status)] = value;
    obj[art.structureFieldOf(reply)] = 'Hello';
    const r = read({ text: JSON.stringify(obj) });
    driver.progress(r, true);
    expect(driver.result().structures.status).toEqual(value);
    expect(driver.result().structures.reply).toBe('Hello');
  });

  it('tool-multi: the stage before the content carries the status, the content stage the rest', () => {
    const { ctx, driver, art } = setup('tool-multi');
    const content = ctx.stages.find((s) => s.kind === 'content')!;
    const before = ctx.stages[ctx.stages.indexOf(content) - 1]!;
    expect(art.layout.carriedBy(before)).toEqual([status]);
    expect(art.layout.carriedBy(content)).toEqual([reply]);
    const tools = art.stageTools();
    const params = (s: typeof content) => Object.keys(tools[ctx.stages.indexOf(s)]!.function.parameters.properties as object);
    expect(params(before)).toEqual([art.paramOf(before), art.structureFieldOf(status)]);
    expect(params(before)[0]).toMatch(/^\d+_/);
    expect([...params(content)].sort()).toEqual(params(content));
    const calls = ctx.stages.map((s, i) => {
      const args: Record<string, unknown> = { [art.paramOf(s)]: s.kind === 'content' ? 'The rain fell.' : s.kind === 'patch' ? [] : 'notes' };
      if (s === before) args[art.structureFieldOf(status)] = value;
      if (s === content) args[art.structureFieldOf(reply)] = 'Hello';
      return { id: `c${i}`, name: art.toolOf(s), arguments: JSON.stringify(args) };
    });
    const r = read({ toolCalls: calls });
    driver.progress(r, true);
    expect(driver.complete(r, 0).done).toBe(true);
    expect(driver.result().content).toBe('The rain fell.');
    expect(driver.result().structures.status).toEqual(value);
    expect(driver.result().structures.reply).toBe('Hello');
  });

  it('accepts unprefixed structure keys from a model that dropped the prefix', () => {
    const { ctx, driver, art } = setup('tool-single');
    const obj: Record<string, unknown> = {};
    for (const s of ctx.stages) obj[art.fieldOf(s)] = s.kind === 'content' ? 'Text.' : s.kind === 'patch' ? [] : 'notes';
    obj.status = value;
    const r = read({ toolCalls: [{ id: 'c', name: ordered.tools.submit.name, arguments: JSON.stringify(obj) }] });
    driver.progress(r, true);
    expect(driver.result().structures.status).toEqual(value);
  });
});
