/**
 * Tool-call transports (§10.5). Single step: one `ap_submit_turn` call carrying the whole turn.
 * Multi step: one tool per stage, looped inside the Orchestrator (never written to chat).
 */
import {
  buildStageTools, parseTurnObject, stageFieldName, structuresAnchorIndex, SUBMIT_TOOL, tool,
  type TurnResult,
} from '@advanced-preset/protocol';
import type { ChatMessage } from '@/st/host';
import type { ReadState, ToolCallAcc } from '../reader';
import { parsePartialObject } from '../partial-json';
import {
  baseBody, callerCalls, callerEnvelope, fillToolText, stageTool, syntheticTurn, type Driver, type DriverInput,
} from './base';
import { envelopeTurn, turnSchema } from './structured';

const assistantToolMessage = (read: ReadState, calls: ToolCallAcc[]): ChatMessage => ({
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
  const schema = caller.schema ? callerEnvelope(caller.schema.value) : turnSchema(ctx);
  const syn = syntheticTurn(input, 'single', SUBMIT_TOOL);
  const tools = [...(syn ? [syn.tool] : []), tool(SUBMIT_TOOL, ctx.preset.tools.submit, schema), ...caller.tools];
  const messages = [...input.messages, ...(syn?.messages ?? [])];
  const force = ctx.config.connection.forceTool && !caller.tools.length;
  let last: ReadState = { text: '', reasoning: '', toolCalls: [] };
  let value: Record<string, unknown> | null = null;
  const parse = (r: ReadState, final: boolean): TurnResult => {
    const call = r.toolCalls.find((c) => c.name === SUBMIT_TOOL) ?? (r.toolCalls.length === 1 && !r.toolCalls[0]!.name ? r.toolCalls[0] : undefined);
    const po = parsePartialObject(call?.arguments ?? '', final);
    value = po.value;
    if (caller.schema) return envelopeTurn(ctx, po.value, final);
    return parseTurnObject(po.value, { stages: ctx.stages, structures: ctx.structures, final, openKey: po.openKey });
  };
  return {
    body: () => baseBody(input, { messages, tools, tool_choice: force ? { type: 'function', function: { name: SUBMIT_TOOL } } : 'auto' }),
    progress: (read, final) => { last = read; return parse(read, final); },
    complete: (read) => {
      const calls = callerCalls(read, caller);
      return { done: true, callerToolCalls: calls.length ? calls : undefined };
    },
    result: () => parse(last, true),
    rawText: () => last.text,
    callerResult: () => value?.result,
  };
}

export function toolMultiDriver(input: DriverInput): Driver {
  const { ctx, caller } = input;
  const { stages, structures, preset } = ctx;
  const parallel = ctx.config.connection.parallelTools;
  const stageTools = buildStageTools(ctx.workflow!, stages, structures, preset.tools.stagePrefix, Object.fromEntries(stages.map((s) => [s.id, s.label])));
  const first = stageTools[0]?.function.name ?? '';
  const syn = syntheticTurn(input, parallel ? 'parallel' : 'multi', first);
  const tools = [...(syn ? [syn.tool] : []), ...stageTools, ...caller.tools];
  const convo: ChatMessage[] = [...input.messages, ...(syn?.messages ?? [])];
  const anchor = structuresAnchorIndex(ctx.workflow!, stages);
  const byTool = new Map(stages.map((s) => [stageTool(ctx, s), s]));
  /** Turn object keyed like the structured schema, so the shared object parser does the rest. */
  const record: Record<string, unknown> = {};
  const texts: string[] = [];
  let nudged = false;
  let lastRead: ReadState = { text: '', reasoning: '', toolCalls: [] };

  const nextStage = () => stages.find((s) => !s.optional && record[stageFieldName(stages, s)] === undefined);
  const nextTool = () => { const s = nextStage(); return s ? stageTool(ctx, s) : ''; };

  const apply = (target: Record<string, unknown>, call: ToolCallAcc, final: boolean): string | undefined => {
    const stage = byTool.get(call.name);
    if (!stage) return undefined;
    const args = parsePartialObject(call.arguments, final).value ?? {};
    const field = stageFieldName(stages, stage);
    const v = stage.kind === 'patch' ? args.edits : args.content;
    if (v !== undefined) target[field] = v;
    if (stages.indexOf(stage) === anchor) for (const d of structures) if (args[d.field] !== undefined) target[d.field] = args[d.field];
    return field;
  };

  const turnOf = (obj: Record<string, unknown>, final: boolean, openKey?: string) =>
    caller.schema ? envelopeTurn(ctx, obj, final) : parseTurnObject(obj, { stages, structures, final, openKey });

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
          const text = known ? (next ? fillToolText(preset.tools.stageResult, { next }) : 'Recorded. The workflow is complete.') : `Unknown tool ${c.name}.`;
          convo.push({ role: 'tool', tool_call_id: c.id, content: text });
        }
      }
      if (!nextStage()) return { done: true };
      if (!ours.length) {
        if (nudged) return { done: true };
        nudged = true;
        if (read.text.trim()) convo.push({ role: 'assistant', content: read.text });
        convo.push({ role: 'user', content: fillToolText(preset.tools.nudge, { next: nextTool() }) });
      }
      return { done: false };
    },
    result: () => turnOf(record, true),
    rawText: () => texts.join('\n\n') || lastRead.text,
  };
}

