import { describe, expect, it } from 'vitest';
import { readResponse } from '@/core/reader';
import { parseJsonPath, PartialArgs } from '@/core/partial-args';
import { collect, sseResponse } from './helpers';

const gemini = (...parts: unknown[]) => ({ candidates: [{ content: { role: 'model', parts } }] });
const sse = (events: unknown[]) => sseResponse(events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(''));
const read = (events: unknown[]) => collect(readResponse(sse(events), 'vertexai', true));
/** Arguments of the first call after every chunk (the reader yields one live, mutated state). */
async function argumentsPerChunk(events: unknown[]): Promise<(string | undefined)[]> {
  const out: (string | undefined)[] = [];
  for await (const s of readResponse(sse(events), 'vertexai', true)) out.push(s.toolCalls[0]?.arguments);
  return out;
}

describe('Gemini streamed function-call arguments', () => {
  it('parses JSONPaths', () => {
    expect(parseJsonPath('$.story')).toEqual(['story']);
    expect(parseJsonPath('$.questions[0].options[12].label')).toEqual(['questions', 0, 'options', 12, 'label']);
    expect(parseJsonPath(`$['a.b']["c\\"d"]`)).toEqual(['a.b', 'c"d']);
    expect(parseJsonPath('$')).toBeNull();
    expect(parseJsonPath('story')).toBeNull();
    expect(parseJsonPath('$.a[x]')).toBeNull();
  });

  it('rebuilds values: continued strings, scalars, nested arrays and objects', () => {
    const a = new PartialArgs();
    a.apply([{ jsonPath: '$.brightness', numberValue: 50 }]);
    a.apply([{ jsonPath: '$.story', stringValue: 'The rain', willContinue: true }]);
    a.apply([{ jsonPath: '$.story', stringValue: ' fell.', willContinue: true }]);
    a.apply([{ jsonPath: '$.story' }]);
    a.apply([{ jsonPath: '$.items[0].label', stringValue: 'A' }, { jsonPath: '$.items[1].on', boolValue: true }, { jsonPath: '$.note', nullValue: 'NULL_VALUE' }]);
    expect(a.value).toEqual({ brightness: 50, story: 'The rain fell.', items: [{ label: 'A' }, { on: true }], note: null });
    // a new value for a closed path replaces it instead of appending
    a.apply([{ jsonPath: '$.story', stringValue: 'Again' }]);
    expect(a.value.story).toBe('Again');
  });

  it('streams one call: arguments grow chunk by chunk, signature kept', async () => {
    const events = [
      gemini({ functionCall: { name: 'write_story', willContinue: true }, thoughtSignature: 'sig' }),
      gemini({ functionCall: { partialArgs: [{ jsonPath: '$.story', stringValue: 'The rain', willContinue: true }], willContinue: true } }),
      gemini({ functionCall: { partialArgs: [{ jsonPath: '$.story', stringValue: ' fell.', willContinue: true }], willContinue: true } }),
      gemini({ functionCall: { partialArgs: [{ jsonPath: '$.story' }], willContinue: true } }),
      gemini({ functionCall: {} }),
      { candidates: [{ content: { role: 'model', parts: [{ text: '' }] }, finishReason: 'STOP' }] },
    ];
    expect(await argumentsPerChunk(events)).toEqual([
      '{}', '{"story":"The rain"}', '{"story":"The rain fell."}', '{"story":"The rain fell."}', '{"story":"The rain fell."}', '{"story":"The rain fell."}',
    ]);
    const states = await read(events);
    const [call] = states.at(-1)!.toolCalls;
    expect(states.at(-1)!.toolCalls).toHaveLength(1);
    expect(call).toMatchObject({ name: 'write_story', signature: 'sig' });
  });

  it('streams parallel calls one after another', async () => {
    const head = (name: string) => gemini({ functionCall: { name, willContinue: true } });
    const arg = (v: string, more = true) => gemini({ functionCall: { partialArgs: [{ jsonPath: '$.location', stringValue: v, ...(more ? { willContinue: true } : {}) }], willContinue: true } });
    const states = await read([head('weather'), arg('New Delhi'), arg('', false), gemini({ functionCall: {} }), head('weather'), arg('San Francisco'), arg('', false), gemini({ functionCall: {} })]);
    expect(states.at(-1)!.toolCalls.map((c) => [c.name, JSON.parse(c.arguments)])).toEqual([
      ['weather', { location: 'New Delhi' }],
      ['weather', { location: 'San Francisco' }],
    ]);
  });

  it('whole calls (no streaming) still work, including several per chunk and Gemini ids', async () => {
    const states = await read([
      gemini({ text: 'Thinking done.' }),
      gemini({ functionCall: { id: 'fc_1', name: 'a', args: { x: 1 } }, thoughtSignature: 's1' }, { functionCall: { name: 'b', args: { y: 'z' } } }),
    ]);
    const calls = states.at(-1)!.toolCalls;
    expect(calls.map((c) => [c.id, c.name, c.arguments, c.signature])).toEqual([['fc_1', 'a', '{"x":1}', 's1'], [calls[1]!.id, 'b', '{"y":"z"}', undefined]]);
    expect(calls[1]!.id).toMatch(/^call_/);
    expect(states.at(-1)!.text).toBe('Thinking done.');
  });
});
