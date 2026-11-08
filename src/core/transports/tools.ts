/**
 * Tool-call transports (§10.5). Single step: one submit call carrying the whole turn.
 * Tool names, parameters and descriptions all come from the preset (`turnArtifacts`).
 * Multi step: one tool per stage, looped inside the Orchestrator (never written to chat).
 */
import { parseTurnObject, type TurnResult } from '@advanced-preset/protocol';
import type { ChatMessage } from '@/st/host';
import type { ReadState, ToolCallAcc } from '../reader';
import { parsePartialObject } from '../partial-json';
import {
  artifactsOf, baseBody, callerCalls, fillToolText, syntheticTurn, usesEnvelope, type Driver, type DriverInput,
} from './base';
import { envelopeTurn } from './structured';
import { markOwn } from './signatures';

const assistantToolMessage = (read: ReadState, calls: ToolCallAcc[]): ChatMessage => markOwn({
  role: 'assistant',
  content: read.text || '',
  tool_calls: calls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: c.arguments || '{}' }, ...(c.signature ? { signature: c.signature } : {}) })),
});

function withIds(calls: ToolCallAcc[], step: number): ToolCallAcc[] {
  calls.forEach((c, i) => { if (!c.id) c.id = `call_${step}_${i}`; });
  return calls;
}

export function toolSingleDriver(input: DriverInput): Driver {
  const { ctx, caller } = input;
  const art = artifactsOf(ctx);
  const enveloped = usesEnvelope(ctx);
  const submit = art.submitTool(caller.schema ? (enveloped ? art.envelope(caller.schema.value) : caller.schema.value) : undefined);
  const submitName = submit.function.name;
  const syn = syntheticTurn(input, 'single', submitName);
  const tools = [...(syn ? [syn.tool] : []), submit, ...caller.tools];
  const messages = [...input.messages, ...(syn?.messages ?? [])];
  const force = ctx.config.connection.forceTool && !caller.tools.length;
  let last: ReadState = { text: '', reasoning: '', toolCalls: [] };
  let value: Record<string, unknown> | null = null;
  const parse = (r: ReadState, final: boolean): TurnResult => {
    const call = r.toolCalls.find((c) => c.name === submitName) ?? (r.toolCalls.length === 1 && !r.toolCalls[0]!.name ? r.toolCalls[0] : undefined);
    const po = parsePartialObject(call?.arguments ?? '', final);
    value = po.value;
    if (caller.schema) return envelopeTurn(ctx, art, po.value, final, enveloped);
    return parseTurnObject(po.value, { stages: ctx.stages, structures: ctx.structures, final, openKey: po.openKey, fieldOf: art.fieldOf, structureFieldOf: art.structureFieldOf });
  };
  return {
    body: () => baseBody(input, { messages, tools, tool_choice: force ? { type: 'function', function: { name: submitName } } : 'auto' }),
    progress: (read, final) => { last = read; return parse(read, final); },
    complete: (read) => {
      const calls = callerCalls(read, caller);
      return { done: true, callerToolCalls: calls.length ? calls : undefined };
    },
    result: () => parse(last, true),
    rawText: () => last.text,
    callerResult: () => (enveloped ? value?.[art.envelopeKeys.result] : value ?? undefined),
  };
}

export function toolMultiDriver(input: DriverInput): Driver {
  const { ctx, caller } = input;
  const { stages, structures, preset } = ctx;
  const parallel = ctx.config.connection.parallelTools;
  const art = artifactsOf(ctx);
  const stageTools = art.stageTools();
  const first = stageTools[0]?.function.name ?? '';
  const syn = syntheticTurn(input, parallel ? 'parallel' : 'multi', first);
  const tools = [...(syn ? [syn.tool] : []), ...stageTools, ...caller.tools];
  const convo: ChatMessage[] = [...input.messages, ...(syn?.messages ?? [])];
  const byTool = new Map(stages.map((s) => [art.toolOf(s), s]));
  /** Turn object keyed like the structured schema, so the shared object parser does the rest. */
  const record: Record<string, unknown> = {};
  const texts: string[] = [];
  let nudged = false;
  let lastRead: ReadState = { text: '', reasoning: '', toolCalls: [] };

  const nextStage = () => stages.find((s) => !s.optional && record[art.fieldOf(s)] === undefined);
  const nextTool = () => { const s = nextStage(); return s ? art.toolOf(s) : ''; };

  const apply = (target: Record<string, unknown>, call: ToolCallAcc, final: boolean): string | undefined => {
    const stage = byTool.get(call.name);
    if (!stage) return undefined;
    const args = parsePartialObject(call.arguments, final).value ?? {};
    const field = art.fieldOf(stage);
    const v = args[art.paramOf(stage)];
    if (v !== undefined) target[field] = v;
    // Structures ride on the stage tool the turn layout assigns them to (I-134), under their turn field name.
    for (const d of art.layout.carriedBy(stage)) {
      const name = art.structureFieldOf(d);
      if (args[name] !== undefined) target[name] = args[name];
    }
    return field;
  };

  const turnOf = (obj: Record<string, unknown>, final: boolean, openKey?: string) =>
    caller.schema ? envelopeTurn(ctx, art, obj, final) : parseTurnObject(obj, { stages, structures, final, openKey, fieldOf: art.fieldOf, structureFieldOf: art.structureFieldOf });

  return {
    body: () => {
      const choice = !ctx.config.connection.forceTool || caller.tools.length ? 'auto' : parallel ? 'required' : { type: 'function', function: { name: nextTool() || first } };
      return baseBody({ ...input, messages: convo }, { messages: [...convo], tools, tool_choice: choice });
    },
    progress: (read, final) => {
      lastRead = read;
      const live = { ...record };
      let openKey: string | undefined;
      for (const c of read.toolCalls) openKey = apply(live, c, final) ?? openKey;
      return turnOf(live, final, final ? undefined : openKey);
    },
    complete: (read, step) => {
      const calls = withIds(read.toolCalls.filter((c) => c.name), step);
      const callerHits = callerCalls(read, caller);
      if (callerHits.length) return { done: true, callerToolCalls: callerHits };
      if (read.text.trim()) texts.push(read.text.trim());
      const ours = calls.filter((c) => byTool.has(c.name));
      if (ours.length) {
        convo.push(assistantToolMessage(read, calls));
        for (const c of calls) {
          apply(record, c, true);
          const known = byTool.has(c.name);
          const next = nextTool();
          const text = fillToolText(ctx, known ? (next ? preset.tools.results.next : preset.tools.results.done) : preset.tools.results.unknown, { next, first, name: c.name });
          convo.push({ role: 'tool', tool_call_id: c.id, content: text });
        }
      }
      if (!nextStage()) return { done: true };
      if (!ours.length) {
        if (nudged) return { done: true };
        nudged = true;
        if (read.text.trim()) convo.push({ role: 'assistant', content: read.text });
        convo.push({ role: 'user', content: fillToolText(ctx, preset.tools.results.nudge, { next: nextTool(), first }) });
      }
      return { done: false };
    },
    result: () => turnOf(record, true),
    rawText: () => texts.join('\n\n') || lastRead.text,
  };
}

