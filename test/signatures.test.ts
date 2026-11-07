import { afterEach, describe, expect, it, vi } from 'vitest';
import { builtInSignature, signatureChannel, type APreset, type ThoughtSignatureChannel, type Transport } from '@advanced-preset/protocol';
import { createDriver } from '@/core/transports';
import { artifactsOf } from '@/core/transports/base';
import { SKIP_SIGNATURE, isSignatureError, placeSignatures } from '@/core/transports/signatures';
import type { Family } from '@/core/encoder';
import { encodeJson, streamEncoder } from '@/core/encoder';
import { readResponse, BackendError } from '@/core/reader';
import { orchestrate } from '@/core/orchestrator';
import { setNativeFetch } from '@/st/host';
import { collect, ctxFor, petals, sseResponse } from './helpers';

const VERTEX = 'vertex-sig';
const AISTUDIO = 'aistudio-sig';
/** Petals with both built-in signatures on its synthetic turns. */
const preset: APreset = { ...petals, syntheticTurns: petals.syntheticTurns.map((t) => ({ ...t, thoughtSignature: { vertex: VERTEX, aistudio: AISTUDIO } })) };

const history = [
  { role: 'user', content: 'Hi' },
  { role: 'assistant', content: '', tool_calls: [{ id: 'st_call', type: 'function', function: { name: 'st_tool', arguments: '{}' } }] },
  { role: 'tool', tool_call_id: 'st_call', content: 'ok' },
];

function bodyFor(opts: { channel?: ThoughtSignatureChannel | boolean; family?: Family; source?: string; transport?: Transport; fallback?: boolean; openAi?: boolean; p?: APreset } = {}) {
  const { channel = 'off', family = 'gemini', source = family === 'gemini' ? 'makersuite' : 'openrouter', transport = 'tool-single', fallback, openAi = true, p = preset } = opts;
  const ctx = ctxFor(transport, 'linear', {}, p);
  ctx.config.connection.sendThoughtSignature = channel;
  ctx.config.connection.openAiSignatures = openAi;
  if (fallback) ctx.signatureFallback = true;
  const base = { chat_completion_source: source, model: 'gemini-4-pro', stream: true, messages: history };
  const body = createDriver({ ctx, base, messages: history as never, caller: { tools: [] }, family }).body(0) as Record<string, any>;
  const messages = body.messages as Record<string, any>[];
  const init = messages.find((m) => m.tool_calls?.[0]?.id?.endsWith('_init'))!;
  return { ctx, body, messages, init, call: init.tool_calls[0] };
}

describe('thought signature channel', () => {
  it('older switch: true is Vertex AI', () => {
    expect(signatureChannel({ sendThoughtSignature: true })).toBe('vertex');
    expect(signatureChannel({ sendThoughtSignature: false })).toBe('off');
    expect(signatureChannel({ sendThoughtSignature: 'aistudio' })).toBe('aistudio');
    expect(signatureChannel({ sendThoughtSignature: 'nope' as never })).toBe('off');
  });

  it('a plain string signature is the Vertex AI one', () => {
    expect(builtInSignature({ thoughtSignature: 'x' }, 'vertex')).toBe('x');
    expect(builtInSignature({ thoughtSignature: 'x' }, 'aistudio')).toBeUndefined();
    expect(builtInSignature({ thoughtSignature: { aistudio: 'y' } }, 'aistudio')).toBe('y');
    expect(builtInSignature({ thoughtSignature: { aistudio: 'y' } }, 'off')).toBeUndefined();
  });
});

describe('Gemini wire', () => {
  it('sends the signature of the selected channel, whatever the source', () => {
    expect(bodyFor({ channel: 'vertex' }).call.signature).toBe(VERTEX);
    expect(bodyFor({ channel: 'aistudio' }).call.signature).toBe(AISTUDIO);
    expect(bodyFor({ channel: 'aistudio', source: 'vertexai' }).call.signature).toBe(AISTUDIO);
    expect(bodyFor({ channel: true, transport: 'tool-multi' }).call.signature).toBe(VERTEX);
  });

  it('off, no signature for the channel, or after a fallback: skip_thought_signature_validator', () => {
    expect(bodyFor().call.signature).toBe(SKIP_SIGNATURE);
    expect(bodyFor({ channel: 'aistudio', p: { ...preset, syntheticTurns: preset.syntheticTurns.map((t) => ({ ...t, thoughtSignature: VERTEX })) } }).call.signature).toBe(SKIP_SIGNATURE);
    expect(bodyFor({ channel: 'vertex', fallback: true }).call.signature).toBe(SKIP_SIGNATURE);
  });

  it('unsigned history calls get the bypass too (model names ST does not recognise)', () => {
    const { messages } = bodyFor({ channel: 'vertex' });
    expect(messages[1]!.tool_calls[0].signature).toBe(SKIP_SIGNATURE);
    expect(history[1]!.tool_calls![0]).not.toHaveProperty('signature');
  });

  it('received signatures stay after a fallback', () => {
    const msgs = [{ role: 'assistant', content: '', tool_calls: [{ id: 'a', type: 'function', function: { name: 'x', arguments: '{}' }, signature: 'real' }] }];
    expect((placeSignatures(msgs as never, 'gemini', { fallback: true })[0]!.tool_calls as any[])[0].signature).toBe('real');
  });
});

describe('OpenAI-compatible wire', () => {
  it('OpenRouter: reasoning_details only', () => {
    const { init, call } = bodyFor({ channel: 'aistudio', family: 'openai', source: 'openrouter' });
    expect(init.reasoning_details).toEqual([{ type: 'reasoning.encrypted', data: AISTUDIO, id: call.id, format: 'google-gemini-v1', index: 0 }]);
    expect(call).not.toHaveProperty('signature');
    expect(call).not.toHaveProperty('extra_content');
  });

  it('custom (OpenRouter-compatible / CLIProxyAPI): reasoning_details and extra_content', () => {
    const { init, call } = bodyFor({ channel: 'vertex', family: 'openai', source: 'custom' });
    expect(init.reasoning_details[0]).toMatchObject({ data: VERTEX, id: call.id });
    expect(call.extra_content).toEqual({ google: { thought_signature: VERTEX } });
  });

  it('off or after a fallback: nothing extra; history from ST untouched', () => {
    for (const opts of [{}, { channel: 'vertex' as const, fallback: true }]) {
      const { init, call, messages } = bodyFor({ ...opts, family: 'openai', source: 'custom' });
      expect(init).not.toHaveProperty('reasoning_details');
      expect(call).not.toHaveProperty('signature');
      expect(call).not.toHaveProperty('extra_content');
      expect(messages[1]).toBe(history[1]);
    }
  });

  it('switch off (the default): no built-in signature, no extra fields', () => {
    const { init, call } = bodyFor({ channel: 'vertex', family: 'openai', source: 'custom', openAi: false });
    expect(init).not.toHaveProperty('reasoning_details');
    expect(call).not.toHaveProperty('signature');
    expect(call).not.toHaveProperty('extra_content');
    const received = [{ role: 'assistant', content: '', tool_calls: [{ id: 'a', type: 'function', function: { name: 'x', arguments: '{}' }, signature: 'real' }] }];
    expect(placeSignatures(received as never, 'openai', { source: 'custom' })).toEqual(received);
  });

  it('Claude wire: no built-in signature', () => {
    expect(bodyFor({ channel: 'vertex', family: 'claude', source: 'claude' }).call).not.toHaveProperty('signature');
  });
});

describe('reading signatures', () => {
  const sse = (...events: unknown[]) => sseResponse(events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('') + 'data: [DONE]\n\n');

  it('OpenRouter reasoning_details, before or after the call', async () => {
    const states = await collect(readResponse(sse(
      { choices: [{ index: 0, delta: { reasoning_details: [{ type: 'reasoning.encrypted', data: 'sig-b', id: 'tool_b', format: 'google-gemini-v1' }] } }] },
      { choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: 'tool_a', function: { name: 'a', arguments: '{}' } }, { index: 1, id: 'tool_b', function: { name: 'b', arguments: '{}' } }] } }] },
      { choices: [{ index: 0, delta: { reasoning_details: [{ type: 'reasoning.encrypted', data: 'sig-a', id: 'tool_a' }, { type: 'reasoning.text', text: 'hm' }] } }] },
    ), 'custom', true));
    expect(states.at(-1)!.toolCalls.map((c) => c.signature)).toEqual(['sig-a', 'sig-b']);
  });

  it("Google's OpenAI format (extra_content) and non-streaming bodies", async () => {
    const [streamed] = (await collect(readResponse(sse(
      { choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: 'c', function: { name: 'a', arguments: '{}' }, extra_content: { google: { thought_signature: 'g' } } }] } }] },
    ), 'custom', true))).slice(-1);
    expect(streamed!.toolCalls[0]!.signature).toBe('g');
    const json = new Response(JSON.stringify({ choices: [{ message: { content: '', tool_calls: [{ id: 'c', function: { name: 'a', arguments: '{}' } }], reasoning_details: [{ type: 'reasoning.encrypted', data: 'r', id: 'c' }] } }] }), { headers: { 'Content-Type': 'application/json' } });
    expect((await collect(readResponse(json, 'openrouter', false)))[0]!.toolCalls[0]!.signature).toBe('r');
  });

  it('caller tool calls go back to ST with reasoning_details', () => {
    const calls = [{ id: 'c', name: 'a', arguments: '{}', signature: 's' }];
    expect(streamEncoder('openai').toolCalls(calls)).toContain('"reasoning_details":[{"type":"reasoning.encrypted","data":"s","id":"c"');
    expect((encodeJson('openai', { content: '', toolCalls: calls }).choices as any[])[0].message.reasoning_details[0]).toMatchObject({ data: 's', id: 'c' });
  });
});

describe('signature fallback', () => {
  afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; vi.unstubAllGlobals(); });

  it('recognises signature errors', () => {
    expect(isSignatureError(new BackendError('Corrupted thought signature.', 400))).toBe(true);
    expect(isSignatureError(new BackendError('Provider returned error', 400, '{"raw":"Thought signature is not valid"}'))).toBe(true);
    expect(isSignatureError(new BackendError('Invalid value at thought_signature', 400))).toBe(true);
    expect(isSignatureError(new BackendError('Rate limit', 429))).toBe(false);
  });

  async function run(firstStatus: number, firstError: string, channel: ThoughtSignatureChannel = 'vertex', openAi = true) {
    vi.stubGlobal('localStorage', { getItem: () => 'en' });
    const warning = vi.fn();
    (globalThis as any).toastr = { warning, error: vi.fn() };
    (globalThis as any).SillyTavern = { getContext: () => ({ chat: [], getRequestHeaders: () => ({}), isToolCallingSupported: () => true, eventSource: { emit: async () => undefined } }) };
    const ctx = ctxFor('tool-single', 'linear', {}, preset);
    ctx.config.connection.sendThoughtSignature = channel;
    ctx.config.connection.openAiSignatures = openAi;
    const art = artifactsOf(ctx);
    const bodies: Record<string, any>[] = [];
    setNativeFetch((async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      bodies.push(body);
      if (bodies.length === 1) return new Response(JSON.stringify({ error: { message: firstError } }), { status: firstStatus, headers: { 'Content-Type': 'application/json' } });
      const args = JSON.stringify({ [art.fieldOf(ctx.stages.find((s) => s.kind === 'content')!)]: 'The rain fell.' });
      return new Response(JSON.stringify({ choices: [{ message: { content: '', tool_calls: [{ id: 'x', type: 'function', function: { name: art.submitTool().function.name, arguments: args } }] } }] }), { headers: { 'Content-Type': 'application/json' } });
    }) as typeof fetch);
    const resp = await orchestrate(ctx, { chat_completion_source: 'custom', model: 'gemini-4-pro', stream: false, messages: [{ role: 'user', content: 'Hi' }] });
    return { ctx, bodies, resp, warning };
  }

  const initCall = (body: Record<string, any>) => body.messages.find((m: any) => m.tool_calls?.[0]?.id?.endsWith('_init')).tool_calls[0];

  it('retries once without the built-in signature and tells the user', async () => {
    const { ctx, bodies, warning, resp } = await run(400, 'Corrupted thought signature.');
    expect(resp.status).toBe(200);
    expect(bodies).toHaveLength(2);
    expect(initCall(bodies[0]!).extra_content.google.thought_signature).toBe(VERTEX);
    expect(initCall(bodies[1]!)).not.toHaveProperty('extra_content');
    expect(ctx.signatureFallback).toBe(true);
    expect(warning).toHaveBeenCalledOnce();
  });

  it('other errors, or no built-in signature sent: no retry', async () => {
    expect((await run(429, 'Rate limit')).bodies).toHaveLength(1);
    expect((await run(400, 'Corrupted thought signature.', 'off')).bodies).toHaveLength(1);
    expect((await run(400, 'Corrupted thought signature.', 'vertex', false)).bodies).toHaveLength(1);
  });
});
