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
  streamingProcessor: { messageId: number; type: string } | null;
}

export const st = (): STContext => (globalThis as any).SillyTavern.getContext();

type StreamingReply = (data: unknown, state: StreamState, options: { chatCompletionSource?: string; overrideShowThoughts?: boolean }) => string;
export interface StreamState { reasoning: string; images: string[]; signature: string; toolSignatures: Record<string, string> }

let openaiModule: { getStreamingReply?: StreamingReply } = {};

/** URL of a ST module relative to this bundle (`/scripts/extensions/third-party/<name>/dist/index.js`). */
const hostUrl = (path: string) => new URL(path, import.meta.url).href;

export async function loadHostModules(): Promise<void> {
  try {
    openaiModule = await import(/* @vite-ignore */ hostUrl('../../../../openai.js'));
  } catch (e) {
    console.warn('[AP] openai.js not importable, using built-in stream extraction', e);
  }
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
export function streamingReply(data: any, state: StreamState, source: string): string {
  if (openaiModule.getStreamingReply) return openaiModule.getStreamingReply(data, state, { chatCompletionSource: source, overrideShowThoughts: true });
  if (source === 'claude') { state.reasoning += data?.delta?.thinking ?? ''; return data?.delta?.text ?? ''; }
  if (source === 'makersuite' || source === 'vertexai') {
    const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
    state.reasoning += parts.filter((p) => p.thought).map((p) => p.text).join('');
    return parts.filter((p) => !p.thought).map((p) => p.text ?? '').join('');
  }
  if (source === 'cohere') return data?.delta?.message?.content?.text ?? '';
  const d = data?.choices?.[0]?.delta;
  state.reasoning += d?.reasoning_content ?? d?.reasoning ?? '';
  return d?.content ?? data?.choices?.[0]?.message?.content ?? '';
}

export function toast(kind: 'info' | 'success' | 'warning' | 'error', message: string, title?: string) {
  const t = (globalThis as any).toastr;
  if (t?.[kind]) t[kind](message, title);
  else console[kind === 'error' ? 'error' : 'log'](`[AP] ${title ?? ''} ${message}`);
}

/** The `fetch` that existed before FetchGate wrapped it (AP's internal requests bypass the gate). */
export let nativeFetch: typeof fetch = (...args) => globalThis.fetch(...args);
export const setNativeFetch = (f: typeof fetch) => { nativeFetch = f; };
