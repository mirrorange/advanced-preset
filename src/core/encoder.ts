/**
 * ResponseEncoder (§10.7): synthesise the response ST's frontend expects for the active
 * `chat_completion_source` — SSE chunks when streaming, a JSON body otherwise. The response only
 * carries story content (plus native reasoning and, for task calls, the caller's tool calls).
 */
import { responseFamily, streamContextOf, wireFamily, type WireFamily } from '@/st/host';

export type Family = WireFamily;

/**
 * Response family of a request body. `base` carries the connection details (custom / OpenCode API
 * format, model) that decide the shape for sources such as `custom` + Claude Messages.
 */
export function familyOf(source: string | undefined, base?: Record<string, any>): Family {
  const ctx = base ? streamContextOf({ ...base, chat_completion_source: source ?? base.chat_completion_source }) : { chatCompletionSource: String(source ?? '') };
  return base ? responseFamily(ctx) : wireFamily(ctx);
}

export interface EncodedToolCall { id: string; name: string; arguments: string; signature?: string }

const sse = (data: unknown) => `data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`;

export interface StreamEncoder {
  text(delta: string): string;
  reasoning(delta: string): string;
  toolCalls(calls: EncodedToolCall[]): string;
  error(message: string): string;
  end(): string;
}

export function streamEncoder(family: Family): StreamEncoder {
  switch (family) {
    case 'claude': {
      // A well-formed Messages stream: hosts such as TauriTavern validate block order strictly
      // (start → deltas → stop per index, message_stop with no open block).
      let started = false;
      let index = -1;
      let open: 'text' | 'thinking' | null = null;
      let toolUse = false;
      const head = () => {
        if (started) return '';
        started = true;
        return sse({ type: 'message_start', message: { id: `msg_ap_${Date.now().toString(36)}`, type: 'message', role: 'assistant', content: [], model: '', stop_reason: null, stop_sequence: null, usage: { input_tokens: 0, output_tokens: 0 } } });
      };
      const close = () => {
        if (open === null) return '';
        open = null;
        return sse({ type: 'content_block_stop', index });
      };
      const block = (kind: 'text' | 'thinking') => {
        if (open === kind) return head();
        const out = head() + close();
        index++;
        open = kind;
        return out + sse({ type: 'content_block_start', index, content_block: kind === 'text' ? { type: 'text', text: '' } : { type: 'thinking', thinking: '', signature: '' } });
      };
      return {
        text: (t) => (t ? block('text') + sse({ type: 'content_block_delta', index, delta: { type: 'text_delta', text: t } }) : ''),
        reasoning: (t) => (t ? block('thinking') + sse({ type: 'content_block_delta', index, delta: { type: 'thinking_delta', thinking: t } }) : ''),
        toolCalls: (calls) => {
          if (!calls.length) return '';
          let out = head() + close();
          for (const c of calls) {
            index++;
            toolUse = true;
            out += sse({ type: 'content_block_start', index, content_block: { type: 'tool_use', id: c.id, name: c.name, input: {} } })
              + sse({ type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json: c.arguments || '{}' } })
              + sse({ type: 'content_block_stop', index });
          }
          return out;
        },
        error: (message) => sse({ type: 'error', error: { type: 'api_error', message } }),
        end: () => head() + close()
          + sse({ type: 'message_delta', delta: { stop_reason: toolUse ? 'tool_use' : 'end_turn', stop_sequence: null }, usage: { output_tokens: 0 } })
          + sse({ type: 'message_stop' }),
      };
    }
    case 'gemini':
      return {
        text: (t) => (t ? sse({ candidates: [{ index: 0, content: { role: 'model', parts: [{ text: t }] } }] }) : ''),
        reasoning: (t) => (t ? sse({ candidates: [{ index: 0, content: { role: 'model', parts: [{ text: t, thought: true }] } }] }) : ''),
        toolCalls: (calls) => (calls.length ? sse({
          candidates: [{ index: 0, content: { role: 'model', parts: calls.map((c) => ({ functionCall: { name: c.name, args: safeParse(c.arguments) }, ...(c.signature ? { thoughtSignature: c.signature } : {}) })) } }],
        }) : ''),
        error: (message) => sse({ error: { message } }),
        end: () => '',
      };
    case 'cohere':
      return {
        text: (t) => (t ? sse({ type: 'content-delta', index: 0, delta: { message: { content: { text: t } } } }) : ''),
        reasoning: () => '',
        toolCalls: (calls) => calls.map((c, index) => sse({
          type: 'tool-call-start', index, delta: { message: { tool_calls: { id: c.id, type: 'function', function: { name: c.name, arguments: c.arguments } } } },
        })).join(''),
        error: (message) => sse({ error: { message } }),
        end: () => sse({ type: 'message-end' }),
      };
    default:
      return {
        text: (t) => (t ? sse({ choices: [{ index: 0, delta: { content: t } }] }) : ''),
        reasoning: (t) => (t ? sse({ choices: [{ index: 0, delta: { reasoning_content: t, reasoning: t } }] }) : ''),
        toolCalls: (calls) => (calls.length ? sse({
          choices: [{ index: 0, delta: { tool_calls: calls.map((c, index) => ({ index, id: c.id, type: 'function', function: { name: c.name, arguments: c.arguments } })) } }],
        }) : ''),
        error: (message) => sse({ error: { message } }),
        end: () => sse('[DONE]'),
      };
  }
}

function safeParse(s: string): unknown {
  try { return JSON.parse(s || '{}'); } catch { return {}; }
}

export interface FinalMessage { content: string; reasoning?: string; toolCalls?: EncodedToolCall[] }

/** Non-streaming body: an OpenAI-shaped core every family reads, plus family-specific mirrors. */
export function encodeJson(family: Family, m: FinalMessage): Record<string, unknown> {
  const toolCalls = m.toolCalls?.length
    ? m.toolCalls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: c.arguments }, ...(c.signature ? { signature: c.signature } : {}) }))
    : undefined;
  const body: Record<string, unknown> = {
    choices: [{
      index: 0,
      message: { role: 'assistant', content: m.content, ...(m.reasoning ? { reasoning_content: m.reasoning, reasoning: m.reasoning } : {}), ...(toolCalls ? { tool_calls: toolCalls } : {}) },
      finish_reason: toolCalls ? 'tool_calls' : 'stop',
    }],
  };
  if (family === 'claude') {
    body.content = [
      ...(m.reasoning ? [{ type: 'thinking', thinking: m.reasoning }] : []),
      { type: 'text', text: m.content },
      ...(m.toolCalls ?? []).map((c) => ({ type: 'tool_use', id: c.id, name: c.name, input: safeParse(c.arguments) })),
    ];
  } else if (family === 'gemini') {
    body.responseContent = {
      role: 'model',
      parts: [
        ...(m.reasoning ? [{ text: m.reasoning, thought: true }] : []),
        { text: m.content },
        ...(m.toolCalls ?? []).map((c) => ({ functionCall: { name: c.name, args: safeParse(c.arguments) }, ...(c.signature ? { thoughtSignature: c.signature } : {}) })),
      ],
    };
  }
  return body;
}

export function errorResponse(message: string, status = 502): Response {
  return new Response(JSON.stringify({ error: { message } }), { status, statusText: message.slice(0, 100), headers: { 'Content-Type': 'application/json' } });
}
