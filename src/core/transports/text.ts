/** Prefill and plaintext transports (§10.2–10.3): dialogue-style output parsed by prefixes / tags. */
import { parseDialogue, type TurnResult } from '@advanced-preset/protocol';
import type { ReadState } from '../reader';
import { baseBody, callerCalls, prefixesOf, type Driver, type DriverInput } from './base';

const CALLER_SCHEMA_HINT = (schema: unknown) =>
  `After your thinking, output the result as one JSON code block (\`\`\`json … \`\`\`) that matches this JSON Schema:\n\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\``;

export function textDriver(input: DriverInput): Driver {
  const { ctx } = input;
  const prefill = ctx.transport === 'prefill';
  const prefixes = prefixesOf(ctx);
  let last: ReadState = { text: '', reasoning: '', toolCalls: [] };
  let turn: TurnResult | null = null;
  const parse = (text: string, final: boolean) => parseDialogue(text, {
    stages: ctx.stages,
    prefixes,
    user: ctx.preset.user,
    contentMarker: ctx.preset.contentMarker,
    structures: ctx.structures,
    format: prefill ? 'prefix' : ctx.preset.plaintextFormat,
    final,
  });
  const messages = [...input.messages];
  if (input.caller.schema) {
    const hint = { role: 'system' as const, content: CALLER_SCHEMA_HINT(input.caller.schema.value) };
    // Keep a trailing assistant prefill last.
    if (messages[messages.length - 1]?.role === 'assistant') messages.splice(messages.length - 1, 0, hint);
    else messages.push(hint);
  }
  return {
    body: () => {
      const extra: Record<string, unknown> = {};
      if (prefill && ctx.preset.stop.length) extra.stop = [...new Set([...(input.base.stop ?? []), ...ctx.preset.stop])];
      return baseBody({ ...input, messages }, extra);
    },
    progress: (read, final) => {
      last = read;
      let text = read.text;
      // client-side stop fallback
      for (const s of prefill ? ctx.preset.stop : []) { const i = text.indexOf(s); if (i >= 0) text = text.slice(0, i); }
      turn = parse(text, final);
      return turn;
    },
    complete: (read) => {
      const calls = callerCalls(read, input.caller);
      return { done: true, callerToolCalls: calls.length ? calls : undefined };
    },
    result: () => turn ?? parse(last.text, true),
    rawText: () => last.text,
    callerResult: () => {
      const m = /```(?:json)?\s*([\s\S]*?)```/i.exec(last.text);
      if (!m) return undefined;
      try { return JSON.parse(m[1]!); } catch { return undefined; }
    },
  };
}
