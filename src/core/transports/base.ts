/**
 * Transport driver contract (§10.1): a driver builds the request body of each request segment,
 * turns accumulated response state into a TurnResult, and decides whether another segment is needed.
 */
import {
  actorName, emptyTurn, fillTemplate, toGeminiSchema, toGeminiTools, turnArtifacts,
  type APreset, type JsonSchema, type TurnArtifacts, type TurnResult,
} from '@advanced-preset/protocol';
import { st, type ChatMessage } from '@/st/host';
import type { GenerationContext } from '../context';
import type { ReadState, ToolCallAcc } from '../reader';
import { requestToolArgStreaming, wantsToolArgStreaming } from './tool-args';

export interface CallerInfo {
  /** Caller tools (OpenAI format), task generations only. */
  tools: any[];
  toolChoice?: unknown;
  /** Caller JSON schema `{ name, value, strict }`, task generations only. */
  schema?: { name?: string; value: JsonSchema; strict?: boolean };
}

export interface StepVerdict {
  done: boolean;
  /** Caller tools were called: end and hand them back (D18). */
  callerToolCalls?: ToolCallAcc[];
}

export interface Driver {
  body(step: number): Record<string, unknown>;
  progress(read: ReadState, final: boolean): TurnResult;
  /** Called once per finished segment with its final read state. */
  complete(read: ReadState, step: number): StepVerdict;
  /** Merged result over all segments. */
  result(): TurnResult;
  /** Raw model text of every segment (fallback content). */
  rawText(): string;
  /** Caller schema result extracted by the driver, if any. */
  callerResult?(): unknown;
}

export interface DriverInput {
  ctx: GenerationContext;
  /** ST's generate_data (marker removed). */
  base: Record<string, any>;
  messages: ChatMessage[];
  caller: CallerInfo;
  family: 'openai' | 'claude' | 'gemini' | 'cohere';
}

/**
 * Every tool name the preset can expose (submit, stage tools of every workflow, synthetic turns).
 * Used to drop our own tools from a caller's tool list.
 */
export function presetToolNames(preset: APreset): Set<string> {
  const names = new Set<string>([preset.tools.submit.name, ...preset.syntheticTurns.map((t) => t.tool.name)]);
  for (const w of preset.workflows) {
    const variants = [w.stages, w.stages.filter((s) => !s.when)];
    for (const stages of variants) for (const n of turnArtifacts(preset.tools, w, stages, []).toolNames()) names.add(n);
  }
  return names;
}

/** Description text: `{{ap::…}}` macros, then ST macros (`{{user}}`, …) when SillyTavern is present. */
export function textExpander(ctx: GenerationContext): (text: string) => string {
  return (text) => {
    const ap = ctx.assembly ? ctx.assembly.expand(text) : text;
    try { return st().substituteParams(ap); } catch { return ap; }
  };
}

/** Schema / tool names and descriptions of this turn, all from the preset. */
export function artifactsOf(ctx: GenerationContext): TurnArtifacts {
  return turnArtifacts(ctx.preset.tools, ctx.workflow!, ctx.stages, ctx.structures, textExpander(ctx));
}

export function prefixesOf(ctx: GenerationContext): Record<string, string> {
  const { preset, config, assembly } = ctx;
  const out: Record<string, string> = {};
  for (const [id, a] of Object.entries(preset.actors)) {
    const raw = config.identity.prefixes[id] || a.prefix || `${actorName(preset, config, id)}: `;
    out[id] = assembly ? assembly.expand(raw) : raw;
  }
  return out;
}

/** `{{next}}` / `{{first}}` / `{{submit}}` / `{{name}}` placeholders of tool texts, then macros. */
export function fillToolText(ctx: GenerationContext, text: string, vars: { next?: string; first?: string; name?: string }): string {
  const filled = fillTemplate(text, { submit: ctx.preset.tools.submit.name, next: vars.next ?? '', first: vars.first ?? '', name: vars.name ?? '' });
  return textExpander(ctx)(filled);
}

/** Synthetic workflow-init turn (§10.5) placed after the assembled prompt. */
export function syntheticTurn(input: DriverInput, mode: 'single' | 'multi' | 'parallel', first: string): { messages: ChatMessage[]; tool: any } | null {
  const { ctx, family } = input;
  const id = ctx.config.connection.syntheticTurn;
  const turn = id ? ctx.preset.syntheticTurns.find((t) => t.id === id) : undefined;
  if (!turn) return null;
  const callId = `call_${turn.id}_init`;
  const signature = ctx.config.connection.sendThoughtSignature && family === 'gemini' ? turn.thoughtSignature : undefined;
  const expand = textExpander(ctx);
  const description = expand(turn.tool.description);
  return {
    tool: { type: 'function', function: { name: turn.tool.name, ...(description ? { description } : {}), parameters: { type: 'object', properties: {} } } },
    messages: [
      { role: 'user', content: expand(turn.user) },
      { role: 'assistant', content: '', tool_calls: [{ id: callId, type: 'function', function: { name: turn.tool.name, arguments: '{}' }, ...(signature ? { signature } : {}) }] },
      { role: 'tool', tool_call_id: callId, content: fillToolText(ctx, turn.response[mode], { first }) },
    ],
  };
}

export function baseBody(input: DriverInput, extra: Record<string, unknown> = {}): Record<string, unknown> {
  const body: Record<string, unknown> = { ...input.base, messages: input.messages };
  delete body.tools;
  delete body.tool_choice;
  delete body.json_schema;
  if (input.caller.tools.length) { body.tools = input.caller.tools; body.tool_choice = input.caller.toolChoice ?? 'auto'; }
  Object.assign(body, extra);
  if (input.family === 'gemini') forGemini(body, input.ctx.preset.tools.jsonStringHint);
  if (wantsToolArgStreaming(input.ctx.config.connection.streamToolArguments, input.family, String(body.chat_completion_source ?? ''))) requestToolArgStreaming(body);
  return body;
}

/** Gemini only takes an OpenAPI subset of JSON Schema (no `type: [..]`, `additionalProperties`, …). */
function forGemini(body: Record<string, any>, jsonStringHint?: string): void {
  const opts = { jsonStringHint };
  if (Array.isArray(body.tools)) body.tools = toGeminiTools(body.tools, opts);
  if (body.json_schema?.value) body.json_schema = { ...body.json_schema, value: toGeminiSchema(body.json_schema.value, opts) };
}

export function callerCalls(read: ReadState, caller: CallerInfo): ToolCallAcc[] {
  if (!caller.tools.length) return [];
  const names = new Set(caller.tools.map((t) => t?.function?.name));
  return read.toolCalls.filter((c) => c.name && names.has(c.name));
}

export const blankTurn = (ctx: GenerationContext): TurnResult => emptyTurn(ctx.stages);
