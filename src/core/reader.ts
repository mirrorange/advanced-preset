/**
 * Reads a backend response (`/api/backends/chat-completions/generate`) for any source: SSE or JSON,
 * accumulating text, native reasoning and tool calls (with partial argument strings for streaming UI).
 */
import { streamingReply, type StreamState } from '@/st/host';

export interface ToolCallAcc { id: string; name: string; arguments: string; signature?: string }

export interface ReadState {
  text: string;
  reasoning: string;
  toolCalls: ToolCallAcc[];
  finishReason?: string;
  usage?: unknown;
  signature?: string;
}

export class BackendError extends Error {
  constructor(message: string, readonly status = 502, readonly body?: string) { super(message); }
}

function errorMessage(data: any): string | null {
  const e = data?.error ?? data?.detail?.error;
  if (!e) return null;
  return typeof e === 'string' ? e : String(e.message || e.code || e.type || 'Unknown error');
}

/** Incremental tool-call accumulator mirroring ST's `ToolManager.parseToolCalls` shapes. */
export class ToolCallCollector {
  private calls: ToolCallAcc[] = [];
  private claudeIndex = new Map<number, number>();

  get list(): ToolCallAcc[] { return this.calls; }

  private at(i: number): ToolCallAcc {
    while (this.calls.length <= i) this.calls.push({ id: '', name: '', arguments: '' });
    return this.calls[i]!;
  }

  push(p: any): void {
    // OpenAI-compatible deltas
    for (const choice of Array.isArray(p?.choices) ? p.choices : []) {
      if ((choice?.index ?? 0) !== 0) continue;
      for (const [k, d] of (choice?.delta?.tool_calls ?? choice?.message?.tool_calls ?? []).entries()) {
        const c = this.at(typeof d?.index === 'number' ? d.index : k);
        if (d?.id && !c.id) c.id = d.id;
        if (d?.function?.name && !c.name) c.name = d.function.name;
        const args = d?.function?.arguments;
        if (typeof args === 'string') c.arguments += args;
        else if (args && typeof args === 'object') c.arguments = JSON.stringify(args);
      }
    }
    // Claude
    if (p?.type === 'content_block_start' && p?.content_block?.type === 'tool_use') {
      const i = this.calls.length;
      this.claudeIndex.set(p.index ?? i, i);
      const c = this.at(i);
      c.id = p.content_block.id ?? '';
      c.name = p.content_block.name ?? '';
      const input = p.content_block.input;
      if (input && Object.keys(input).length) c.arguments = JSON.stringify(input);
    }
    if (p?.type === 'content_block_delta' && p?.delta?.type === 'input_json_delta') {
      const i = this.claudeIndex.get(p.index ?? 0);
      if (i !== undefined) this.at(i).arguments += p.delta.partial_json ?? '';
    }
    // Gemini (whole function calls per chunk)
    for (const part of p?.candidates?.[0]?.content?.parts ?? []) {
      if (!part?.functionCall) continue;
      const c = this.at(this.calls.length);
      c.id = `call_${Math.random().toString(36).slice(2, 10)}`;
      c.name = part.functionCall.name ?? '';
      c.arguments = JSON.stringify(part.functionCall.args ?? {});
      if (part.thoughtSignature) c.signature = part.thoughtSignature;
    }
    // Cohere
    if (['tool-call-start', 'tool-call-delta'].includes(p?.type)) {
      const tc = p?.delta?.message?.tool_calls;
      const c = this.at(p.index ?? 0);
      if (tc?.id && !c.id) c.id = tc.id;
      if (tc?.function?.name && !c.name) c.name = tc.function.name;
      if (typeof tc?.function?.arguments === 'string') c.arguments += tc.function.arguments;
    }
  }

  /** Non-streaming bodies (ST normalises most sources to OpenAI shape, with mirrors). */
  fromBody(data: any): void {
    const parts = data?.responseContent?.parts;
    if (Array.isArray(parts)) { this.push({ candidates: [{ content: { parts } }] }); return; }
    const msg = data?.choices?.[0]?.message;
    if (Array.isArray(msg?.tool_calls)) {
      msg.tool_calls.forEach((d: any, i: number) => {
        const c = this.at(i);
        c.id = d.id ?? `call_${i}`;
        c.name = d.function?.name ?? '';
        const a = d.function?.arguments;
        c.arguments = typeof a === 'string' ? a : JSON.stringify(a ?? {});
        if (d.signature) c.signature = d.signature;
      });
      return;
    }
    if (Array.isArray(data?.content)) {
      for (const b of data.content) if (b?.type === 'tool_use') { const c = this.at(this.calls.length); c.id = b.id; c.name = b.name; c.arguments = JSON.stringify(b.input ?? {}); }
    }
  }
}

function bodyText(data: any): string {
  if (typeof data === 'string') return data;
  const fromBlocks = Array.isArray(data?.content) ? data.content.filter((p: any) => p?.type === 'text').map((p: any) => p.text).join('\n\n') : undefined;
  const r = fromBlocks || data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.text || data?.message?.content?.[0]?.text || '';
  return Array.isArray(r) ? r.map((x: any) => x?.text ?? '').join('') : String(r ?? '');
}

function bodyReasoning(data: any): string {
  const m = data?.choices?.[0]?.message;
  if (m?.reasoning_content || m?.reasoning) return String(m.reasoning_content ?? m.reasoning);
  if (Array.isArray(data?.responseContent?.parts)) return data.responseContent.parts.filter((p: any) => p.thought).map((p: any) => p.text).join('\n\n');
  if (Array.isArray(data?.content)) return data.content.filter((p: any) => p.type === 'thinking').map((p: any) => p.thinking).join('\n\n');
  return '';
}

async function* sseEvents(body: ReadableStream<Uint8Array>, signal?: AbortSignal): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const onAbort = () => reader.cancel().catch(() => undefined);
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      // A cancelled reader just reports `done`; surface the abort so callers mark open stages.
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      if (done) break;
      buf += decoder.decode(value, { stream: true }).replace(/\r\n?/g, '\n');
      let cut: number;
      while ((cut = buf.indexOf('\n\n')) >= 0) {
        const block = buf.slice(0, cut);
        buf = buf.slice(cut + 2);
        const data = block.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).replace(/^ /, '')).join('\n');
        if (data) yield data;
      }
    }
    const tail = buf.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).join('\n');
    if (tail) yield tail;
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
}

/**
 * Yields the accumulated state after every chunk (once for non-streaming responses).
 * Throws {@link BackendError} for HTTP errors and error payloads.
 */
export async function* readResponse(resp: Response, source: string, stream: boolean, signal?: AbortSignal): AsyncGenerator<ReadState> {
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    let msg = `HTTP ${resp.status}`;
    try { msg = errorMessage(JSON.parse(text)) ?? msg; } catch { if (text) msg = text.slice(0, 500); }
    throw new BackendError(msg, resp.status, text);
  }
  const state: ReadState = { text: '', reasoning: '', toolCalls: [] };
  const tools = new ToolCallCollector();
  const isSse = stream && Boolean(resp.body) && !(resp.headers.get('content-type') ?? '').includes('application/json');
  if (!isSse || !resp.body) {
    const data = await resp.json();
    const err = errorMessage(data);
    if (err) throw new BackendError(err);
    state.text = bodyText(data);
    state.reasoning = bodyReasoning(data);
    tools.fromBody(data);
    state.toolCalls = tools.list;
    state.finishReason = data?.choices?.[0]?.finish_reason ?? data?.stop_reason;
    state.usage = data?.usage ?? data?.usageMetadata;
    yield state;
    return;
  }
  const st: StreamState = { reasoning: '', images: [], signature: '', toolSignatures: {} };
  for await (const raw of sseEvents(resp.body, signal)) {
    if (raw === '[DONE]') break;
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { continue; }
    const err = errorMessage(parsed);
    if (err) throw new BackendError(err);
    state.text += streamingReply(parsed, st, source);
    state.reasoning = st.reasoning;
    tools.push(parsed);
    state.toolCalls = tools.list;
    if (st.signature) state.signature = st.signature;
    const fr = parsed?.choices?.[0]?.finish_reason ?? parsed?.delta?.stop_reason ?? parsed?.candidates?.[0]?.finishReason;
    if (fr) state.finishReason = fr;
    if (parsed?.usage || parsed?.usageMetadata) state.usage = parsed.usage ?? parsed.usageMetadata;
    yield state;
  }
}
