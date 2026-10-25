import { describe, expect, it } from 'vitest';
import { encodeJson, streamEncoder, type Family } from '@/core/encoder';
import { readResponse } from '@/core/reader';
import { addUsage, mergeUsage } from '@/core/usage';
import { collect, sseResponse } from './helpers';

/** How third-party monitors (e.g. worldbook-manager's cache inspector) read usage: the last SSE line carrying one. */
function monitorUsage(text: string): Record<string, unknown> | null {
  const pick = (v: any) => v?.usage ?? v?.usageMetadata ?? v?.usage_metadata ?? null;
  try { return pick(JSON.parse(text)); } catch { /* SSE */ }
  let usage = null;
  for (const line of text.split(/\r?\n/)) {
    const data = line.trim().replace(/^data:\s*/, '');
    if (!data || data === '[DONE]') continue;
    try { usage = pick(JSON.parse(data)) ?? usage; } catch { /* skip */ }
  }
  return usage;
}

const deepseek = { prompt_tokens: 1200, completion_tokens: 80, total_tokens: 1280, prompt_cache_hit_tokens: 1024, prompt_cache_miss_tokens: 176, prompt_tokens_details: { cached_tokens: 1024 } };

describe('provider usage', () => {
  it('reads DeepSeek usage from the final chunk', async () => {
    const body = `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: 'Hi' } }] })}\n\n`
      + `data: ${JSON.stringify({ choices: [], usage: deepseek })}\n\ndata: [DONE]\n\n`;
    const states = await collect(readResponse(sseResponse(body), 'deepseek', true));
    expect(states.at(-1)!.usage).toEqual(deepseek);
  });

  it('merges Claude usage from message_start and message_delta', async () => {
    const body = `data: ${JSON.stringify({ type: 'message_start', message: { usage: { input_tokens: 10, cache_read_input_tokens: 900, output_tokens: 1 } } })}\n\n`
      + `data: ${JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })}\n\n`
      + `data: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Hi' } })}\n\n`
      + `data: ${JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 42 } })}\n\n`;
    const states = await collect(readResponse(sseResponse(body), 'claude', true));
    expect(states.at(-1)!.usage).toEqual({ input_tokens: 10, cache_read_input_tokens: 900, output_tokens: 42 });
  });

  it('sums the requests of a multi-step turn', () => {
    expect(addUsage(addUsage(undefined, deepseek), deepseek)).toMatchObject({ prompt_tokens: 2400, prompt_cache_hit_tokens: 2048, prompt_tokens_details: { cached_tokens: 2048 } });
    expect(mergeUsage({ a: 1, d: { x: 1 } }, { b: 2, d: { y: 2 } })).toEqual({ a: 1, b: 2, d: { x: 1, y: 2 } });
  });

  const shapes: [Family, string, Record<string, unknown>][] = [
    ['openai', 'deepseek', deepseek],
    ['claude', 'claude', { input_tokens: 10, cache_read_input_tokens: 900, output_tokens: 42 }],
    ['gemini', 'makersuite', { promptTokenCount: 1000, cachedContentTokenCount: 800, candidatesTokenCount: 50, totalTokenCount: 1050 }],
  ];
  for (const [family, source, usage] of shapes) {
    it(`re-emits usage in the synthesised ${family} stream`, async () => {
      const enc = streamEncoder(family);
      const body = enc.text('Story.') + enc.end(usage);
      expect(monitorUsage(body)).toMatchObject(usage);
      const states = await collect(readResponse(sseResponse(body), source, true));
      expect(states.at(-1)!.text).toBe('Story.');
      expect(states.at(-1)!.usage).toMatchObject(usage);
    });

    it(`re-emits usage in the synthesised ${family} JSON body`, async () => {
      const json = encodeJson(family, { content: 'Story.', usage });
      expect(monitorUsage(JSON.stringify(json))).toEqual(usage);
    });
  }

  it('omits the usage chunk when the provider sent none', () => {
    expect(streamEncoder('openai').end()).toBe('data: [DONE]\n\n');
  });
});
