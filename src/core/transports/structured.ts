/** Structured output transport (§10.4): one JSON object, fields in stage order, via `json_schema`. */
import { buildTurnSchema, emptyTurn, parseTurnObject, type TurnResult } from '@advanced-preset/protocol';
import type { ReadState } from '../reader';
import { parsePartialObject } from '../partial-json';
import { baseBody, callerEnvelope, type Driver, type DriverInput } from './base';
import type { GenerationContext } from '../context';

/** Caller-schema task turns: `thinking` goes to the first text stage. */
export function envelopeTurn(ctx: GenerationContext, obj: Record<string, unknown> | null, final: boolean): TurnResult {
  const r = emptyTurn(ctx.stages);
  const first = ctx.stages.find((s) => s.kind === 'text');
  if (first && typeof obj?.thinking === 'string') r.stages[first.id] = { text: obj.thinking, status: final ? 'done' : 'streaming' };
  for (const s of ctx.stages) if (final && r.stages[s.id]!.status !== 'done') r.stages[s.id]!.status = s.optional ? 'pending' : 'missing';
  r.current = final ? null : first?.id ?? null;
  return r;
}

export function turnSchema(ctx: GenerationContext) {
  return buildTurnSchema(ctx.workflow!, ctx.stages, ctx.structures, { stageDescriptions: Object.fromEntries(ctx.stages.map((s) => [s.id, s.label])) });
}

export function structuredDriver(input: DriverInput): Driver {
  const { ctx, caller } = input;
  const schema = caller.schema ? callerEnvelope(caller.schema.value) : turnSchema(ctx);
  let last: ReadState = { text: '', reasoning: '', toolCalls: [] };
  let value: Record<string, unknown> | null = null;
  const source = (r: ReadState) => r.text.trim() || r.toolCalls[0]?.arguments || '';
  const parse = (r: ReadState, final: boolean): TurnResult => {
    const po = parsePartialObject(source(r), final);
    value = po.value;
    if (caller.schema) return envelopeTurn(ctx, po.value, final);
    return parseTurnObject(po.value, { stages: ctx.stages, structures: ctx.structures, final, openKey: po.openKey });
  };
  return {
    body: () => baseBody(input, { json_schema: { name: caller.schema?.name ?? 'ap_turn', value: schema, strict: false } }),
    progress: (read, final) => { last = read; return parse(read, final); },
    complete: () => ({ done: true }),
    result: () => parse(last, true),
    rawText: () => last.text,
    callerResult: () => value?.result,
  };
}
