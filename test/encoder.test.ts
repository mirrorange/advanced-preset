import { describe, expect, it } from 'vitest';
import { encodeJson, familyOf, streamEncoder, type Family } from '@/core/encoder';
import { streamContextOf } from '@/st/host';
import { readResponse } from '@/core/reader';
import { collect } from './helpers';

const sources: Record<Family, string> = { openai: 'openai', claude: 'claude', gemini: 'makersuite', cohere: 'cohere' };

function sseResponse(body: string): Response {
  const bytes = new TextEncoder().encode(body);
  // Split into odd-sized chunks so the reader has to re-assemble events.
  const stream = new ReadableStream<Uint8Array>({
    start(c) { for (let i = 0; i < bytes.length; i += 7) c.enqueue(bytes.slice(i, i + 7)); c.close(); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
}

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
