import { describe, expect, it } from 'vitest';
import { SUBMIT_TOOL, stageFieldName, type Transport } from '@advanced-preset/protocol';
import { createDriver } from '@/core/transports';
import { stageTool } from '@/core/transports/base';
import type { ReadState } from '@/core/reader';
import { ctxFor } from './helpers';

const base = { chat_completion_source: 'openai', stream: true, messages: [{ role: 'user', content: 'Hi' }], tools: [{ type: 'function', function: { name: 'st_tool' } }] };
const read = (over: Partial<ReadState>): ReadState => ({ text: '', reasoning: '', toolCalls: [], ...over });

function driverFor(transport: Transport, workflow = 'linear') {
  const ctx = ctxFor(transport, workflow);
  return { ctx, driver: createDriver({ ctx, base, messages: base.messages as never, caller: { tools: [] }, family: 'openai' }) };
}

/** A full turn object for the context's stages, keyed like the JSON schema. */
function turnObject(ctx: ReturnType<typeof ctxFor>) {
  const obj: Record<string, unknown> = {};
  for (const s of ctx.stages) obj[stageFieldName(ctx.stages, s)] = s.kind === 'content' ? 'The rain fell.' : s.kind === 'patch' ? [] : `${s.id} notes`;
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
    expect(body.json_schema?.name).toBe('ap_turn');
    for (const s of ctx.stages) expect(body.json_schema!.value.properties).toHaveProperty(stageFieldName(ctx.stages, s));
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
    expect(body.tools.map((x) => x.function.name)).toContain(SUBMIT_TOOL);
    expect(body.tools.map((x) => x.function.name)).not.toContain('st_tool');
    const r = read({ toolCalls: [{ id: 'c1', name: SUBMIT_TOOL, arguments: JSON.stringify(turnObject(ctx)) }] });
    driver.progress(r, true);
    expect(driver.complete(r, 0).done).toBe(true);
    expect(driver.result().content).toBe('The rain fell.');
  });

  it('tool-multi: one tool per stage, continues until the content stage', () => {
    const { ctx, driver } = driverFor('tool-multi');
    const names = (driver.body(0) as { tools: { function: { name: string } }[] }).tools.map((x) => x.function.name);
    for (const s of ctx.stages) expect(names).toContain(stageTool(ctx, s));
    const [first, ...rest] = ctx.stages;
    const r0 = read({ toolCalls: [{ id: 'c0', name: stageTool(ctx, first!), arguments: JSON.stringify({ content: 'step one' }) }] });
    driver.progress(r0, true);
    expect(driver.complete(r0, 0).done).toBe(false);
    // The next segment replays the call and its tool result.
    const msgs = (driver.body(1) as { messages: { role: string }[] }).messages;
    expect(msgs.some((m) => m.role === 'tool')).toBe(true);
    const calls = rest.map((s, i) => ({ id: `c${i + 1}`, name: stageTool(ctx, s), arguments: JSON.stringify(s.kind === 'patch' ? { edits: [] } : { content: s.kind === 'content' ? 'The rain fell.' : 'more' }) }));
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
