import { afterEach, describe, expect, it } from 'vitest';
import type { ToolArgStreaming, Transport } from '@advanced-preset/protocol';
import { createDriver } from '@/core/transports';
import { artifactsOf } from '@/core/transports/base';
import { readResponse } from '@/core/reader';
import type { Family } from '@/core/encoder';
import { ctxFor, sseResponse } from './helpers';

const messages = [{ role: 'user', content: 'Hi' }];

function bodyFor(opts: { source?: string; family?: Family; transport?: Transport; mode?: ToolArgStreaming; stream?: boolean; extra?: Record<string, unknown> } = {}) {
  const { source = 'vertexai', family = 'gemini', transport = 'tool-single', mode = 'auto', stream = true, extra = {} } = opts;
  const ctx = ctxFor(transport, 'linear');
  ctx.config.connection.streamToolArguments = mode;
  const base = { chat_completion_source: source, model: 'gemini-3-pro', stream, messages, ...extra };
  const driver = createDriver({ ctx, base, messages: messages as never, caller: { tools: [] }, family });
  return { ctx, driver, body: driver.body(0) as Record<string, any> };
}

const include = (body: Record<string, any>) => JSON.parse(body.custom_include_body);

afterEach(() => { delete (globalThis as any).__TAURITAVERN__; });

describe('asking Gemini to stream tool-call arguments', () => {
  it('auto: Vertex AI tool requests only', () => {
    expect(bodyFor().body.stream_function_call_arguments).toBe(true);
    expect(bodyFor({ transport: 'tool-multi' }).body.stream_function_call_arguments).toBe(true);
    expect(bodyFor({ source: 'makersuite' }).body.stream_function_call_arguments).toBeUndefined();
    expect(bodyFor({ source: 'vertexai', family: 'claude' }).body.stream_function_call_arguments).toBeUndefined();
    expect(bodyFor({ stream: false }).body.stream_function_call_arguments).toBeUndefined();
    expect(bodyFor({ transport: 'structured' }).body.stream_function_call_arguments).toBeUndefined();
  });

  it('on: every Gemini-shaped connection; off: never', () => {
    expect(bodyFor({ source: 'makersuite', mode: 'on' }).body.stream_function_call_arguments).toBe(true);
    expect(bodyFor({ source: 'custom', mode: 'on', extra: { custom_api_format: 'gemini_generate_content' } }).body.stream_function_call_arguments).toBe(true);
    expect(bodyFor({ source: 'openai', family: 'openai', mode: 'on' }).body.stream_function_call_arguments).toBeUndefined();
    expect(bodyFor({ mode: 'off' }).body.stream_function_call_arguments).toBeUndefined();
  });

  it('SillyTavern: only the request field, Additional Parameters untouched', () => {
    expect(bodyFor().body.custom_include_body).toBeUndefined();
  });

  it('TauriTavern: toolConfig override carries the tool choice', () => {
    (globalThis as any).__TAURITAVERN__ = { abiVersion: 1 };
    const { ctx, body } = bodyFor();
    const submit = artifactsOf(ctx).submitTool().function.name;
    expect(body.tool_choice).toEqual({ type: 'function', function: { name: submit } });
    expect(include(body)).toEqual({ toolConfig: { functionCallingConfig: { mode: 'ANY', allowedFunctionNames: [submit], streamFunctionCallArguments: true } } });
    ctx.config.connection.forceTool = false;
    expect(include(createDriver({ ctx, base: { chat_completion_source: 'vertexai', stream: true, messages }, messages: messages as never, caller: { tools: [] }, family: 'gemini' }).body(0) as never))
      .toEqual({ toolConfig: { functionCallingConfig: { mode: 'AUTO', streamFunctionCallArguments: true } } });
  });

  it('TauriTavern: user Additional Parameters win', () => {
    (globalThis as any).__TAURITAVERN__ = { abiVersion: 1 };
    expect(include(bodyFor({ extra: { custom_include_body: '{"labels":{"a":"b"}}' } }).body)).toMatchObject({ labels: { a: 'b' }, toolConfig: {} });
    expect(bodyFor({ extra: { custom_include_body: '{"toolConfig":{"x":1}}' } }).body.custom_include_body).toBe('{"toolConfig":{"x":1}}');
    expect(bodyFor({ extra: { custom_include_body: 'labels:\n  a: b' } }).body.custom_include_body).toBe('labels:\n  a: b');
  });

  it('tool-single: the story streams out of partial arguments', async () => {
    const { ctx, driver } = bodyFor();
    const art = artifactsOf(ctx);
    const submit = art.submitTool().function.name;
    const contentStage = ctx.stages.find((s) => s.kind === 'content')!;
    const field = art.fieldOf(contentStage);
    const chunk = (fc: unknown) => `data: ${JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ functionCall: fc }] } }] })}\n\n`;
    const frag = (text: string) => chunk({ partialArgs: [{ jsonPath: `$.${field}`, stringValue: text, willContinue: true }], willContinue: true });
    const sse = chunk({ name: submit, willContinue: true }) + frag('The rain') + frag(' fell.') + chunk({});
    const seen: string[] = [];
    for await (const r of readResponse(sseResponse(sse), 'vertexai', true)) seen.push(driver.progress(r, false).stages[contentStage.id]?.text ?? '');
    expect(seen.filter(Boolean)).toEqual(['The rain', 'The rain fell.', 'The rain fell.']);
  });
});
