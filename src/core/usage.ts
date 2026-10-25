/**
 * Provider usage (token counts) as reported by the backend. AP replaces the response ST sees, so
 * the usage of its own requests is merged here and re-emitted in the synthesised response, where
 * ST extensions (cost / cache monitors) read it the same way as from a native response.
 */
type Usage = Record<string, unknown>;

const isObj = (v: unknown): v is Usage => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Usage carried by one response chunk or body: OpenAI / DeepSeek `usage`, Gemini `usageMetadata`,
 * Claude `message_start.message.usage` (input and cache tokens) and `message_delta.usage`.
 */
export function usageOf(data: any): Usage | undefined {
  const u = data?.usage ?? data?.usageMetadata ?? data?.usage_metadata ?? data?.message?.usage;
  return isObj(u) ? u : undefined;
}

/**
 * Chunks of the same response: later values win, nested objects merge. Claude splits usage over
 * `message_start` and `message_delta`; Gemini and OpenAI repeat or finalise it.
 */
export function mergeUsage(a: unknown, b: unknown): Usage | undefined {
  if (!isObj(b)) return isObj(a) ? a : undefined;
  if (!isObj(a)) return { ...b };
  const out: Usage = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (v === null || v === undefined) continue;
    out[k] = isObj(v) && isObj(out[k]) ? mergeUsage(out[k], v) : v;
  }
  return out;
}

/** Separate requests of one turn (multi-step tools): numbers add up, other values keep the latest. */
export function addUsage(a: unknown, b: unknown): Usage | undefined {
  if (!isObj(b)) return isObj(a) ? a : undefined;
  if (!isObj(a)) return { ...b };
  const out: Usage = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const prev = out[k];
    if (typeof v === 'number' && typeof prev === 'number') out[k] = prev + v;
    else if (isObj(v) && isObj(prev)) out[k] = addUsage(prev, v);
    else if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}
