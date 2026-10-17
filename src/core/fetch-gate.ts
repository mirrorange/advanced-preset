/**
 * FetchGate (§5.3): wraps `window.fetch` and only takes over POSTs to the chat-completions generate
 * endpoint whose body carries `__ap_gen_id` (set at CHAT_COMPLETION_SETTINGS_READY). Everything
 * else — including AP's own internal requests, which use the saved original — passes through.
 */
import { registry } from './context';
import { GENERATE_URL, orchestrate } from './orchestrator';
import { setNativeFetch } from '@/st/host';

export const MARKER = '__ap_gen_id';

function urlOf(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

export function installFetchGate(): void {
  const original = globalThis.fetch;
  if ((original as { __apGate?: boolean }).__apGate) return;
  setNativeFetch(original.bind(globalThis));
  const gated = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (init?.method === 'POST' && typeof init.body === 'string' && init.body.includes(MARKER) && new URL(urlOf(input), location.href).pathname === GENERATE_URL) {
      let body: Record<string, any> | null = null;
      try { body = JSON.parse(init.body); } catch { body = null; }
      const id = body?.[MARKER];
      const ctx = typeof id === 'string' ? registry.get(id) : undefined;
      if (body && ctx && !ctx.claimed) {
        delete body[MARKER];
        ctx.claimed = true;
        try {
          return await orchestrate(ctx, body, init.signal);
        } finally {
          registry.release(id);
        }
      }
      if (body) { delete body[MARKER]; init = { ...init, body: JSON.stringify(body) }; }
    }
    return original.call(globalThis, input, init);
  };
  (gated as { __apGate?: boolean }).__apGate = true;
  globalThis.fetch = gated as typeof fetch;
}

/** CHAT_COMPLETION_SETTINGS_READY: tag the request of the armed context. */
export function onSettingsReady(generateData: Record<string, unknown>): void {
  const ctx = registry.takeArmed();
  if (!ctx) return;
  generateData[MARKER] = ctx.id;
}
