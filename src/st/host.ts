/**
 * SillyTavern host adapter. Everything the extension needs from ST goes through this module so the
 * rest of the code stays testable and the integration surface is explicit (§3).
 */

export interface STMessage {
  name: string;
  is_user: boolean;
  is_system?: boolean;
  mes: string;
  send_date?: string;
  swipe_id?: number;
  swipes?: string[];
  swipe_info?: { extra?: Record<string, unknown> }[];
  extra?: Record<string, any>;
  [key: string]: unknown;
}

/** Chat Completion message as produced by `prepareOpenAIMessages`. */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | unknown[];
  name?: string;
  tool_calls?: unknown[];
  tool_call_id?: string;
  [key: string]: unknown;
}

export interface PresetManager {
  getAllPresets(): string[];
  getSelectedPresetName(): string;
  getCompletionPresetByName(name: string): Record<string, any> | undefined;
  findPreset(name: string): string | undefined;
  selectPreset(value: string): Promise<void>;
  savePreset(name: string, settings?: Record<string, unknown> | null, options?: { skipUpdate?: boolean }): Promise<void>;
  deletePreset(name: string): Promise<boolean>;
}

export interface STContext {
  chat: STMessage[];
  chatMetadata: Record<string, any>;
  characterId: string | number | undefined;
  groupId: string | null;
  name1: string;
  name2: string;
  mainApi: string;
  extensionSettings: Record<string, any>;
  chatCompletionSettings: Record<string, any>;
  eventSource: { on(e: string, f: (...a: any[]) => unknown): void; makeFirst?(e: string, f: (...a: any[]) => unknown): void; emit(e: string, ...a: unknown[]): Promise<void>; removeListener(e: string, f: (...a: any[]) => unknown): void };
  eventTypes: Record<string, string>;
  saveSettingsDebounced(): void;
  saveChat(): Promise<void>;
  saveMetadata(): Promise<void>;
  substituteParams(text: string, ...rest: unknown[]): string;
  getRequestHeaders(): Record<string, string>;
  getPresetManager(apiId?: string): PresetManager | undefined;
  isToolCallingSupported(): boolean;
  updateMessageBlock(id: number, message: STMessage, options?: { rerenderMessage?: boolean }): void;
  getTokenCountAsync(text: string): Promise<number>;
  stopGeneration(): boolean;
  getCurrentLocale?(): string;
  /** ST's popup (`popup.js`); resolves to a `POPUP_RESULT` value. */
  callGenericPopup?(content: string | HTMLElement, type: number, inputValue?: string, options?: { okButton?: string; cancelButton?: string; wide?: boolean; allowVerticalScrolling?: boolean }): Promise<unknown>;
  POPUP_TYPE?: { CONFIRM: number };
  POPUP_RESULT?: { AFFIRMATIVE: number };
  getCurrentChatId?(): string | undefined;
  streamingProcessor: { messageId: number; type: string } | null;
}

export const st = (): STContext => (globalThis as any).SillyTavern.getContext();

/** Running inside TauriTavern (its stable host ABI object). */
export const isTauriTavern = (): boolean => typeof (globalThis as any).__TAURITAVERN__ === 'object' && (globalThis as any).__TAURITAVERN__ !== null;

/** Request context ST forks use to pick a stream shape (custom / OpenCode API formats, Vertex AI Claude). */
export interface StreamContext { chatCompletionSource: string; model?: string | null; customApiFormat?: string | null; opencodeApiFormat?: string | null }
type StreamingReply = (data: unknown, state: StreamState, options: Partial<StreamContext> & { overrideShowThoughts?: boolean }) => string;
export interface StreamState { reasoning: string; images: string[]; signature: string; toolSignatures: Record<string, string> }

let openaiModule: { getStreamingReply?: StreamingReply; getChatCompletionModel?: (settings?: unknown) => string } = {};

/** URL of a ST module relative to this bundle (`/scripts/extensions/third-party/<name>/dist/index.js`). */
const hostUrl = (path: string) => new URL(path, import.meta.url).href;

export async function loadHostModules(): Promise<void> {
  try {
    openaiModule = await import(/* @vite-ignore */ hostUrl('../../../../openai.js'));
  } catch (e) {
    console.warn('[AP] openai.js not importable, using built-in stream extraction', e);
  }
}

/**
 * Source, model and endpoint of the current Chat Completion connection (cache optimization: a
 * change means the provider cache is gone). Uses ST's own model lookup when available.
 */
export function connectionKey(): string {
  const s = st().chatCompletionSettings ?? {};
  const source = String(s.chat_completion_source ?? '');
  let model = '';
  try { model = String(openaiModule.getChatCompletionModel?.() ?? ''); } catch { model = ''; }
  if (!model) {
    const key = ({ makersuite: 'google_model', mistralai: 'mistralai_model' } as Record<string, string>)[source] ?? `${source}_model`;
    model = String(s[key] ?? '');
  }
  const endpoint = source === 'custom' ? String(s.custom_url ?? '') : String(s.reverse_proxy ?? '');
  return [source, model, endpoint].join('|');
}

/** Extension folder id as ST knows it, e.g. `third-party/advanced-preset`. */
export function extensionId(): string {
  const m = /\/scripts\/extensions\/(.+?)\/dist\//.exec(new URL(import.meta.url).pathname);
  return m ? decodeURIComponent(m[1]!) : 'third-party/advanced-preset';
}
export const extensionBaseUrl = () => hostUrl('../');

/**
 * Extract text (and reasoning into `state`) from one parsed stream event, exactly as ST's frontend
 * would for `source`. Falls back to a local implementation of the common shapes.
 */
export function streamContextOf(base: Record<string, any>): StreamContext {
  return {
    chatCompletionSource: String(base.chat_completion_source ?? ''),
    model: base.model ?? null,
    customApiFormat: base.custom_api_format ?? null,
    opencodeApiFormat: base.opencode_api_format ?? null,
  };
}

export function streamingReply(data: any, state: StreamState, source: string | StreamContext): string {
  const ctx: StreamContext = typeof source === 'string' ? { chatCompletionSource: source } : source;
  if (openaiModule.getStreamingReply) return openaiModule.getStreamingReply(data, state, { ...ctx, overrideShowThoughts: true });
  // Local fallback: shape follows the response family of the connection.
  switch (wireFamily(ctx)) {
    case 'claude': state.reasoning += data?.delta?.thinking ?? ''; return data?.delta?.text ?? '';
    case 'gemini': {
      const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
      state.reasoning += parts.filter((p) => p.thought).map((p) => p.text).join('');
      return parts.filter((p) => !p.thought).map((p) => p.text ?? '').join('');
    }
    case 'cohere': return data?.delta?.message?.content?.text ?? '';
    default: {
      const d = data?.choices?.[0]?.delta;
      state.reasoning += d?.reasoning_content ?? d?.reasoning ?? '';
      return d?.content ?? data?.choices?.[0]?.message?.content ?? '';
    }
  }
}

export type WireFamily = 'openai' | 'claude' | 'gemini' | 'cohere';

/**
 * Stream shape ST's frontend parses for a connection. Mirrors ST / TauriTavern `getStreamingReply`:
 * a `custom` or `opencode` source with a native API format, or a Claude model on Vertex AI, is read
 * in that native shape rather than the OpenAI one.
 */
export function wireFamily(ctx: StreamContext): WireFamily {
  const { chatCompletionSource: source, customApiFormat: custom, opencodeApiFormat: opencode } = ctx;
  switch (source) {
    case 'claude':
    case 'aws_bedrock': return 'claude';
    case 'makersuite': return 'gemini';
    case 'vertexai': return String(ctx.model ?? '').trim().toLowerCase().startsWith('claude-') ? 'claude' : 'gemini';
    case 'cohere': return 'cohere';
    case 'custom':
      if (custom === 'claude_messages') return 'claude';
      if (custom === 'gemini_generate_content') return 'gemini';
      return 'openai';
    case 'opencode':
      if (opencode === 'claude_messages') return 'claude';
      if (opencode === 'gemini') return 'gemini';
      return 'openai';
    default: return 'openai';
  }
}

/** Probe samples: the text `"\u0001"` in each family's stream shape. */
const PROBES: [WireFamily, unknown][] = [
  ['claude', { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: '\u0001' } }],
  ['gemini', { candidates: [{ index: 0, content: { role: 'model', parts: [{ text: '\u0001' }] } }] }],
  ['cohere', { type: 'content-delta', index: 0, delta: { message: { content: { text: '\u0001' } } } }],
  ['openai', { choices: [{ index: 0, delta: { content: '\u0001' } }] }],
];

/**
 * Family whose stream ST's frontend actually reads for this connection. Asks the host parser when it
 * is available (so unknown forks / formats still match) and falls back to {@link wireFamily}.
 */
export function responseFamily(ctx: StreamContext): WireFamily {
  const guess = wireFamily(ctx);
  const parse = openaiModule.getStreamingReply;
  if (!parse) return guess;
  const reads = (sample: unknown) => {
    try { return parse(sample, { reasoning: '', images: [], signature: '', toolSignatures: {} }, { ...ctx, overrideShowThoughts: false }) === '\u0001'; } catch { return false; }
  };
  const ordered = [guess, ...PROBES.map(([f]) => f).filter((f) => f !== guess)];
  return ordered.find((f) => reads(PROBES.find(([x]) => x === f)![1])) ?? guess;
}

/** Escape text for HTML popups. */
export const escapeHtml = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Ask for confirmation with ST's popup (`html` is trusted markup); falls back to `window.confirm`. */
export async function confirmPopup(html: string, okButton: string, cancelButton: string): Promise<boolean> {
  const ctx = st();
  if (ctx.callGenericPopup && ctx.POPUP_TYPE && ctx.POPUP_RESULT) {
    const r = await ctx.callGenericPopup(html, ctx.POPUP_TYPE.CONFIRM, '', { okButton, cancelButton, allowVerticalScrolling: true });
    return r === ctx.POPUP_RESULT.AFFIRMATIVE;
  }
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return window.confirm(tmp.innerText);
}

export function toast(kind: 'info' | 'success' | 'warning' | 'error', message: string, title?: string) {
  const t = (globalThis as any).toastr;
  if (t?.[kind]) t[kind](message, title);
  else console[kind === 'error' ? 'error' : 'log'](`[AP] ${title ?? ''} ${message}`);
}

/** The `fetch` that existed before FetchGate wrapped it (AP's internal requests bypass the gate). */
export let nativeFetch: typeof fetch = (...args) => globalThis.fetch(...args);
export const setNativeFetch = (f: typeof fetch) => { nativeFetch = f; };
