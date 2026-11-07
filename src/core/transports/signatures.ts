/**
 * Gemini thought signatures on the tool calls AP sends (synthetic turns, multi-step loops).
 *
 * The channel (`connection.sendThoughtSignature`) is set in the configuration and never guessed from
 * SillyTavern's connection: users route through proxies and routers, so the source does not tell the
 * real upstream. Each wire carries the signature in its own field:
 * - Gemini (generateContent): `tool_calls[].signature`, which ST / TauriTavern turn into the part's
 *   `thoughtSignature`. A call without one gets `skip_thought_signature_validator`, which ST only
 *   adds by itself for model names it recognises (`gemini-3`).
 * - OpenAI-compatible: OpenRouter's `reasoning_details` (`reasoning.encrypted`, id = tool call id),
 *   which ST only builds from `signature` for the OpenRouter source and TauriTavern not at all, and
 *   Google's / CLIProxyAPI's `tool_calls[].extra_content.google.thought_signature`.
 */
import { builtInSignature, signatureChannel } from '@advanced-preset/protocol';
import type { ChatMessage } from '@/st/host';
import type { GenerationContext } from '../context';
import type { WireFamily } from '@/st/host';

export const SKIP_SIGNATURE = 'skip_thought_signature_validator';
const OPENROUTER_FORMAT = 'google-gemini-v1';

/** Assistant messages AP built (only these are rewritten on OpenAI-compatible wires). */
const own = new WeakSet<object>();
/** Tool calls carrying a preset's built-in signature (dropped after a signature error). */
const builtIn = new WeakSet<object>();

export function markOwn<T extends object>(message: T): T {
  own.add(message);
  return message;
}

/** Built-in signature for a synthetic turn's tool call, or `undefined` (channel off, wire without signatures). */
export function syntheticSignature(ctx: GenerationContext, family: WireFamily): string | undefined {
  if (family !== 'gemini' && family !== 'openai') return undefined;
  const id = ctx.config.connection.syntheticTurn;
  const turn = id ? ctx.preset.syntheticTurns.find((t) => t.id === id) : undefined;
  return turn ? builtInSignature(turn, signatureChannel(ctx.config.connection)) : undefined;
}

export function markBuiltIn<T extends object>(call: T): T {
  builtIn.add(call);
  return call;
}

/** Whether a request of this generation carries a built-in signature that a fallback could drop. */
export function sendsBuiltInSignature(ctx: GenerationContext, family: WireFamily): boolean {
  return !ctx.signatureFallback && (ctx.transport === 'tool-single' || ctx.transport === 'tool-multi') && Boolean(syntheticSignature(ctx, family));
}

/** A backend error about thought signatures (invalid, corrupted, from another backend…). */
export function isSignatureError(e: unknown): boolean {
  const { message = '', body = '' } = (e ?? {}) as { message?: string; body?: string };
  return /thought[\s_-]?signature/i.test(`${message}\n${body}`);
}

type Call = Record<string, any>;

/**
 * Messages of a request with the signatures placed for the wire. `fallback`: built-in signatures are
 * left out (signatures received from the backend stay).
 */
export function placeSignatures(messages: ChatMessage[], family: WireFamily, opts: { fallback?: boolean; source?: string } = {}): ChatMessage[] {
  if (family !== 'gemini' && family !== 'openai') return messages;
  return messages.map((m) => {
    if (m.role !== 'assistant' || !Array.isArray(m.tool_calls) || !m.tool_calls.length) return m;
    if (family === 'gemini') return geminiMessage(m, Boolean(opts.fallback));
    return own.has(m) ? openAiMessage(m, Boolean(opts.fallback), opts.source === 'openrouter') : m;
  });
}

const signatureOf = (c: Call, fallback: boolean): string | undefined =>
  (fallback && builtIn.has(c)) || typeof c.signature !== 'string' || !c.signature ? undefined : c.signature;

function geminiMessage(m: ChatMessage, fallback: boolean): ChatMessage {
  const calls = m.tool_calls as Call[];
  if (calls.every((c) => signatureOf(c, fallback))) return m;
  return { ...m, tool_calls: calls.map((c) => ({ ...c, signature: signatureOf(c, fallback) ?? SKIP_SIGNATURE })) };
}

function openAiMessage(m: ChatMessage, fallback: boolean, openRouter: boolean): ChatMessage {
  const details: Record<string, unknown>[] = Array.isArray(m.reasoning_details) ? [...m.reasoning_details] : [];
  const calls = (m.tool_calls as Call[]).map((c) => {
    const sig = signatureOf(c, fallback);
    const { signature: _drop, ...rest } = c;
    if (!sig) return rest;
    details.push({ type: 'reasoning.encrypted', data: sig, id: c.id, format: OPENROUTER_FORMAT, index: details.length });
    // OpenRouter reads `reasoning_details`; the field is only for Google's format (CLIProxyAPI, Google's OpenAI endpoint).
    return openRouter ? rest : { ...rest, extra_content: { ...rest.extra_content, google: { ...rest.extra_content?.google, thought_signature: sig } } };
  });
  return { ...m, tool_calls: calls, ...(details.length ? { reasoning_details: details } : {}) };
}
