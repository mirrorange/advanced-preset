/**
 * ResponseEncoder (§10.7): synthesise the response ST's frontend expects for the active
 * `chat_completion_source` — SSE chunks when streaming, a JSON body otherwise. The response only
 * carries story content (plus native reasoning and, for task calls, the caller's tool calls).
 */
export type Family = 'openai' | 'claude' | 'gemini' | 'cohere';

export function familyOf(source: string | undefined): Family {
  switch (source) {
    case 'claude': return 'claude';
    case 'makersuite':
    case 'vertexai': return 'gemini';
    case 'cohere': return 'cohere';
    default: return 'openai';
  }
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
      let next = 1;
      return {
        text: (t) => (t ? sse({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: t } }) : ''),
        reasoning: (t) => (t ? sse({ type: 'content_block_delta', index: 0, delta: { type: 'thinking_delta', thinking: t } }) : ''),
        toolCalls: (calls) => calls.map((c) => {
          const index = next++;
          return sse({ type: 'content_block_start', index, content_block: { type: 'tool_use', id: c.id, name: c.name, input: {} } })
            + sse({ type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json: c.arguments || '{}' } })
            + sse({ type: 'content_block_stop', index });
        }).join(''),
        error: (message) => sse({ type: 'error', error: { message } }),
        end: () => sse({ type: 'message_stop' }),
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
