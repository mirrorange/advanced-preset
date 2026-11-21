/** Request overrides shared by image and speech providers: headers and a JSON body merged over the built-in request. */
import type { ConnectionBase } from '@/store/media';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/** `over` merged into `base` (objects recursively; arrays and scalars replace; `null` deletes). */
export function deepMerge<T extends Obj>(base: T, over: Obj): T {
  const out: Obj = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === null) delete out[k];
    else if (isObj(v) && isObj(out[k])) out[k] = deepMerge(out[k] as Obj, v);
    else out[k] = v;
  }
  return out as T;
}

/** The connection's body override as an object; throws on invalid JSON / non-objects. */
export function bodyOverride(c: Pick<ConnectionBase, 'body'>): Obj {
  const text = c.body.trim();
  if (!text) return {};
  const v = JSON.parse(text) as unknown;
  if (!isObj(v)) throw new SyntaxError('Request body override must be a JSON object');
  return v;
}

/** Why a body override is invalid ('' when fine), for the editor. */
export function bodyOverrideError(text: string): string {
  try { bodyOverride({ body: text }); return ''; } catch (e) { return e instanceof Error ? e.message : String(e); }
}

/** Built-in headers with the connection's headers on top (case-insensitive; an empty value removes the header). */
export function mergeHeaders(base: Record<string, string>, c: Pick<ConnectionBase, 'headers'>): Headers {
  const h = new Headers(base);
  for (const [k, v] of Object.entries(c.headers ?? {})) {
    if (!k.trim()) continue;
    if (v === '') h.delete(k);
    else h.set(k, v);
  }
  return h;
}

/** `baseUrl` + `path` with exactly one slash between them. */
export const joinUrl = (baseUrl: string, path: string): string => `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
