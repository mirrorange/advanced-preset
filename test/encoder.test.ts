import { describe, expect, it } from 'vitest';
import { encodeJson, familyOf, streamEncoder, type Family } from '@/core/encoder';
import { streamContextOf } from '@/st/host';
import { readResponse } from '@/core/reader';
import { collect, sseResponse } from './helpers';

const sources: Record<Family, string> = { openai: 'openai', claude: 'claude', gemini: 'makersuite', cohere: 'cohere' };

describe('encoder ↔ reader round trip', () => {
  for (const [family, source] of Object.entries(sources) as [Family, string][]) {
    it(`streams text for ${family}`, async () => {
      const enc = streamEncoder(family);
      const body = enc.text('Hello, ') + enc.text('world.') + enc.end();
      const states = await collect(readResponse(sseResponse(body), source, true));
      expect(states.at(-1)!.text).toBe('Hello, world.');
    });

    it(`encodes a JSON body for ${family}`, async () => {
      const json = encodeJson(family, { content: 'Story text.', reasoning: '', toolCalls: [] });
      const resp = new Response(JSON.stringify(json), { headers: { 'Content-Type': 'application/json' } });
      const states = await collect(readResponse(resp, source, false));
      expect(states.at(-1)!.text).toBe('Story text.');
    });
  }

  for (const family of ['openai', 'claude', 'gemini'] as Family[]) {
    it(`streams caller tool calls for ${family}`, async () => {
      const enc = streamEncoder(family);
      const body = enc.toolCalls([{ id: 'call_1', name: 'lookup', arguments: '{"q":"rain"}' }]) + enc.end();
      const states = await collect(readResponse(sseResponse(body), sources[family], true));
      const calls = states.at(-1)!.toolCalls;
      expect(calls).toHaveLength(1);
      expect(calls[0]!.name).toBe('lookup');
      expect(JSON.parse(calls[0]!.arguments)).toEqual({ q: 'rain' });
    });
  }
});

describe('connection-aware response family', () => {
  const cases: [Record<string, unknown>, Family][] = [
    [{ chat_completion_source: 'custom', custom_api_format: 'claude_messages' }, 'claude'],
    [{ chat_completion_source: 'custom', custom_api_format: 'gemini_generate_content' }, 'gemini'],
    [{ chat_completion_source: 'custom', custom_api_format: 'openai_responses' }, 'openai'],
    [{ chat_completion_source: 'custom' }, 'openai'],
    [{ chat_completion_source: 'opencode', opencode_api_format: 'claude_messages' }, 'claude'],
    [{ chat_completion_source: 'opencode', opencode_api_format: 'gemini' }, 'gemini'],
    [{ chat_completion_source: 'vertexai', model: 'claude-opus-4-5' }, 'claude'],
    [{ chat_completion_source: 'vertexai', model: 'gemini-3-pro' }, 'gemini'],
    [{ chat_completion_source: 'aws_bedrock' }, 'claude'],
    [{ chat_completion_source: 'openrouter' }, 'openai'],
  ];
  for (const [base, family] of cases) {
    it(`${JSON.stringify(base)} → ${family}`, () => {
      expect(familyOf(String(base.chat_completion_source), base)).toBe(family);
    });
  }

  it('streams story text that a custom Claude Messages connection can read', async () => {
    const base = { chat_completion_source: 'custom', custom_api_format: 'claude_messages' };
    const enc = streamEncoder(familyOf('custom', base));
    const body = enc.text('外套落下来的时候，') + enc.text('墨笙的肩膀缩了一下。') + enc.reasoning('thinking') + enc.end();
    const states = await collect(readResponse(sseResponse(body), streamContextOf(base), true));
    expect(states.at(-1)!.text).toBe('外套落下来的时候，墨笙的肩膀缩了一下。');
  });
});

describe('Claude stream is well-formed for strict hosts (TauriTavern)', () => {
  const events = (body: string) => body.split('\n\n').filter(Boolean).map((b) => JSON.parse(b.replace(/^data: /, '')));
  const consumeAll = async (body: string) => {
    // @ts-expect-error plain JS fixture copied from TauriTavern
    const { ClaudeNativeStreamAccumulator } = await import('./fixtures/claude-native-stream.js');
    const acc = new ClaudeNativeStreamAccumulator();
    for (const e of events(body)) acc.consume(e);
    return acc.finish();
  };

  it('story text, then reasoning', async () => {
    const enc = streamEncoder('claude');
    const body = enc.text('外套') + enc.text('落下来') + enc.reasoning('想法') + enc.end();
    const native = await consumeAll(body);
    expect(native.claude.content.map((b: any) => b.type)).toEqual(['text', 'thinking']);
    expect(native.claude.content[0].text).toBe('外套落下来');
    expect(native.claude.stop_reason).toBe('end_turn');
  });

  it('caller tool calls after text', async () => {
    const enc = streamEncoder('claude');
    const body = enc.text('ok') + enc.toolCalls([{ id: 't1', name: 'a', arguments: '{"x":1}' }, { id: 't2', name: 'b', arguments: '' }]) + enc.end();
    const native = await consumeAll(body);
    expect(native.claude.content.map((b: any) => b.type)).toEqual(['text', 'tool_use', 'tool_use']);
    expect(native.claude.content[1].input).toEqual({ x: 1 });
    expect(native.claude.stop_reason).toBe('tool_use');
  });

  it('empty turn still closes the message', async () => {
    const enc = streamEncoder('claude');
    await expect(consumeAll(enc.end())).resolves.toBeTruthy();
  });
});
