/**
 * Network layer of multimodal requests: direct, or through a CORS proxy.
 *
 * - `off`: always direct. `on`: always through the proxy. `auto`: direct first; when the browser
 *   blocks it (CORS / network error, a `TypeError`), the origin goes through the proxy for the rest
 *   of the session.
 * - Proxy `host`: `/proxy/<url>` of SillyTavern (`enableCorsProxy: true` in config.yaml; forwards
 *   JSON bodies only) or TauriTavern (dev builds; any body, asks the user once per origin).
 *   Proxy `custom`: a public proxy, `{url}` is replaced by the encoded target, otherwise the target
 *   is appended.
 * - The `Response` is returned as is (callers read streams themselves).
 */
import { isTauriTavern, nativeFetch, st } from '@/st/host';
import { mediaSettings, type CorsSettings } from '@/store/media';

export type { CorsMode } from '@/store/media';

export type ProxyIssue = 'disabled' | 'unsupported' | 'body' | 'noCustomUrl';

/** The proxy cannot carry this request. */
export class ProxyError extends Error {
  constructor(readonly issue: ProxyIssue, message = `CORS proxy: ${issue}`) { super(message); this.name = 'ProxyError'; }
}

/** A non-2xx response; `message` is the provider's error text when it has one. */
export class MediaHttpError extends Error {
  constructor(readonly status: number, message: string, readonly body = '') { super(message); this.name = 'MediaHttpError'; }
}

const proxiedOrigins = new Set<string>();

/** Origins `auto` mode switched to the proxy in this session. */
export const proxiedThisSession = (): string[] => [...proxiedOrigins];
export const forgetProxied = () => proxiedOrigins.clear();

const originOf = (url: string): string => { try { return new URL(url).origin; } catch { return url; } };

/** The proxied address of `url`. */
export function proxyUrl(url: string, cors: Pick<CorsSettings, 'proxy' | 'customUrl'>): string {
  if (cors.proxy === 'custom') {
    const base = cors.customUrl.trim();
    if (!base) throw new ProxyError('noCustomUrl');
    return base.includes('{url}') ? base.replace('{url}', encodeURIComponent(url)) : base + url;
  }
  return `/proxy/${encodeURIComponent(url)}`;
}

/**
 * What the configured proxy can carry. SillyTavern's `/proxy` only forwards JSON bodies;
 * TauriTavern and custom proxies are assumed to forward any body.
 */
export function proxyCaps(cors: Pick<CorsSettings, 'proxy'> = mediaSettings().cors): { multipart: boolean } {
  return { multipart: cors.proxy === 'custom' || isTauriTavern() };
}

const isJsonBody = (body: RequestInit['body']): boolean => body === undefined || body === null || typeof body === 'string';

async function viaProxy(url: string, init: RequestInit, cors: CorsSettings): Promise<Response> {
  const target = proxyUrl(url, cors);
  if (cors.proxy === 'custom') return nativeFetch(target, init);
  const tt = isTauriTavern();
  // Upstream SillyTavern re-serialises `req.body` as JSON: multipart / binary bodies would be lost.
  if (!proxyCaps(cors).multipart && !isJsonBody(init.body)) throw new ProxyError('body');
  const headers = new Headers(init.headers);
  const csrf = st().getRequestHeaders?.()['X-CSRF-Token'];
  if (csrf && !headers.has('X-CSRF-Token')) headers.set('X-CSRF-Token', csrf);
  const res = await nativeFetch(target, { ...init, headers });
  if (res.status === 404) {
    const type = res.headers.get('content-type') ?? '';
    const text = type.includes('json') ? '' : await res.clone().text().catch(() => '');
    if (/CORS proxy is disabled/i.test(text)) throw new ProxyError('disabled');
    if (tt && (type.includes('html') || !text)) throw new ProxyError('unsupported');
  }
  return res;
}

const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

/** `fetch` for multimodal APIs, honouring the CORS proxy setting. */
export async function mediaFetch(url: string, init: RequestInit & { signal?: AbortSignal } = {}, cors: CorsSettings = mediaSettings().cors): Promise<Response> {
  if (cors.mode === 'on') return viaProxy(url, init, cors);
  if (cors.mode === 'off') return nativeFetch(url, init);
  const origin = originOf(url);
  if (proxiedOrigins.has(origin)) return viaProxy(url, init, cors);
  try {
    return await nativeFetch(url, init);
  } catch (e) {
    if (isAbort(e) || !(e instanceof TypeError)) throw e;
    proxiedOrigins.add(origin);
    try {
      return await viaProxy(url, init, cors);
    } catch (pe) {
      // No usable proxy: try direct again next time (the setting may change).
      if (pe instanceof ProxyError) proxiedOrigins.delete(origin);
      throw pe;
    }
  }
}

/** Error text of a failed provider response (JSON `error.message` / `message` / `detail`, else the body). */
export function errorText(status: number, body: string): string {
  let msg = '';
  try {
    const j = JSON.parse(body) as any;
    const e = j?.error ?? j;
    msg = typeof e === 'string' ? e : String(e?.message ?? j?.message ?? j?.detail?.message ?? j?.detail ?? '');
  } catch { msg = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300); }
  return msg ? `HTTP ${status}: ${msg}` : `HTTP ${status}`;
}

/** Throws a {@link MediaHttpError} unless the response is 2xx. */
export async function ensureOk(res: Response): Promise<Response> {
  if (res.ok) return res;
  const body = await res.text().catch(() => '');
  throw new MediaHttpError(res.status, errorText(res.status, body), body);
}
