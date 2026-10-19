/**
 * Streaming of tool-call arguments on Gemini's generateContent API. Other wire formats carry argument
 * deltas by default; generateContent returns every function call whole unless
 * `toolConfig.functionCallingConfig.streamFunctionCallArguments` is set, which only Vertex AI accepts
 * (Gemini 3+). The Gemini API offers argument streaming through its Interactions API instead, which
 * SillyTavern does not use. The reader rebuilds the resulting `partialArgs` fragments (see `partial-args.ts`).
 *
 * The backend builds the Gemini request, so the flag has to travel through it:
 * - `stream_function_call_arguments: true` — the request field SillyTavern / TauriTavern read once
 *   they support it. Backends that do not know it ignore unknown fields.
 * - TauriTavern applies Additional Parameters (`custom_include_body`) to every source after building
 *   the provider payload, so a top-level `toolConfig` override works on releases without the field.
 *   It replaces the whole `toolConfig`, hence the `tool_choice` mapping below (same as the backend's).
 */
import type { ToolArgStreaming } from '@advanced-preset/protocol';
import { isTauriTavern, type WireFamily } from '@/st/host';

export const STREAM_ARGS_FIELD = 'stream_function_call_arguments';

/**
 * Whether to ask for streamed arguments: `on` for every Gemini-shaped connection (e.g. a custom
 * endpoint backed by Vertex AI), `auto` only where Google documents support — the Vertex AI source.
 */
export function wantsToolArgStreaming(mode: ToolArgStreaming, family: WireFamily, source: string): boolean {
  if (mode === 'off' || family !== 'gemini') return false;
  return mode === 'on' || source === 'vertexai';
}

/** OpenAI `tool_choice` → Gemini `functionCallingConfig`. */
export function functionCallingConfig(choice: unknown): Record<string, unknown> {
  if (choice === 'none') return { mode: 'NONE' };
  if (choice === 'required') return { mode: 'ANY' };
  const name = (choice as { function?: { name?: unknown } } | null)?.function?.name;
  if (typeof name === 'string' && name) return { mode: 'ANY', allowedFunctionNames: [name] };
  return { mode: 'AUTO' };
}

/** Mark a streaming request with tools as wanting streamed arguments. Mutates `body`. */
export function requestToolArgStreaming(body: Record<string, any>): void {
  if (!body.stream || !Array.isArray(body.tools) || !body.tools.length) return;
  body[STREAM_ARGS_FIELD] = true;
  if (isTauriTavern()) includeToolConfig(body);
}

/**
 * Add `toolConfig` to TauriTavern's Additional Parameters. The user's own parameters win: a
 * `toolConfig` of theirs is kept as is, and a YAML (non-JSON) body is left untouched since it
 * cannot be merged here — the request then simply falls back to whole function calls.
 */
function includeToolConfig(body: Record<string, any>): void {
  const include = jsonObject(body.custom_include_body);
  if (!include) {
    console.info('[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream');
    return;
  }
  if ('toolConfig' in include) return;
  include.toolConfig = { functionCallingConfig: { ...functionCallingConfig(body.tool_choice), streamFunctionCallArguments: true } };
  body.custom_include_body = JSON.stringify(include);
}

/** Additional Parameters as an object (`{}` when empty), or `null` when they are not a JSON object. */
function jsonObject(raw: unknown): Record<string, unknown> | null {
  let value = raw;
  if (typeof raw === 'string') {
    if (!raw.trim()) return {};
    try { value = JSON.parse(raw); } catch { return null; }
  }
  if (value === undefined || value === null) return {};
  return typeof value === 'object' && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : null;
}
