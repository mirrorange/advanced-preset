import { describe, expect, it } from 'vitest';
import { encodeJson, streamEncoder, type Family } from '@/core/encoder';
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
