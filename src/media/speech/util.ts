/** Shared request / response helpers of the speech providers. */
import { deepMerge } from '@advanced-preset/protocol';
import { sseEvents } from '@/core/reader';
import type { SpeechConnection } from './types';

export class SpeechError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'SpeechError';
  }
}

/** `base` + `path` without doubled or missing slashes. */
export function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/** The connection's Base URL, or the provider default. */
export const baseOf = (conn: SpeechConnection, fallback: string) => conn.baseUrl.trim() || fallback;

/** The user's advanced body override (`conn.body`, JSON object); invalid JSON is an error, not ignored. */
export function bodyOverride(conn: SpeechConnection): Record<string, unknown> | undefined {
  const raw = conn.body.trim();
  if (!raw) return undefined;
  let v: unknown;
  try { v = JSON.parse(raw); } catch { throw new SpeechError('Request body override is not valid JSON.'); }
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new SpeechError('Request body override must be a JSON object.');
  return v as Record<string, unknown>;
}

/** Built-in body ⊕ connection body. */
export const mergeBody = <T extends Record<string, unknown>>(conn: SpeechConnection, body: T): T => deepMerge(body, bodyOverride(conn));

/** Built-in headers ⊕ connection headers (case-insensitive override; an empty value removes the header). */
export function mergeHeaders(conn: SpeechConnection, headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  const set = (k: string, v: string) => {
    for (const key of Object.keys(out)) if (key.toLowerCase() === k.toLowerCase()) delete out[key];
    if (v !== '') out[k] = v;
  };
  for (const [k, v] of Object.entries(headers)) set(k, v);
  for (const [k, v] of Object.entries(conn.headers ?? {})) if (k.trim()) set(k.trim(), v);
  return out;
}

/** Throw a readable error for a failed response (provider JSON error shapes vary). */
export async function ensureOk(resp: Response): Promise<Response> {
  if (resp.ok) return resp;
  const text = await resp.text().catch(() => '');
  let msg = '';
  try {
    const j = JSON.parse(text);
    const d = j?.error ?? j?.detail ?? j?.base_resp ?? j;
    msg = typeof d === 'string' ? d : d?.message ?? d?.status_msg ?? d?.msg ?? (Array.isArray(d) ? d.map((x) => x?.msg ?? '').join('; ') : '') ?? '';
    if (!msg && typeof j?.message === 'string') msg = j.message;
  } catch { msg = text.slice(0, 300); }
  throw new SpeechError(`HTTP ${resp.status}${msg ? `: ${msg}` : ''}`, resp.status);
}

/** Body bytes as they arrive. */
export async function* bodyChunks(resp: Response, signal?: AbortSignal): AsyncGenerator<Uint8Array> {
  if (!resp.body) {
    yield new Uint8Array(await resp.arrayBuffer());
    return;
  }
  const reader = resp.body.getReader();
  const onAbort = () => reader.cancel().catch(() => undefined);
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      if (done) break;
      if (value?.length) yield value;
    }
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
}

/** `data:` payloads of an SSE response. */
export function sseData(resp: Response, signal?: AbortSignal): AsyncGenerator<string> {
  if (!resp.body) throw new SpeechError('Empty response.');
  return sseEvents(resp.body, signal);
}

export function base64Bytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function hexBytes(hex: string): Uint8Array {
  const n = hex.length >> 1;
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

export async function blobBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** Skip a RIFF/WAVE header if the stream starts with one (some providers send WAV even when streaming). */
export async function* stripWavHeader(chunks: AsyncIterable<Uint8Array>): AsyncGenerator<Uint8Array> {
  let head = new Uint8Array(0);
  let passed = false;
  for await (const c of chunks) {
    if (passed) { yield c; continue; }
    const joined = new Uint8Array(head.length + c.length);
    joined.set(head);
    joined.set(c, head.length);
    head = joined;
    if (head.length < 12) continue;
    const tag = String.fromCharCode(...head.subarray(0, 4)) + String.fromCharCode(...head.subarray(8, 12));
    const at = tag === 'RIFFWAVE' ? dataOffset(head) : 0;
    if (at < 0) continue;
    passed = true;
    if (head.length > at) yield head.subarray(at);
  }
  if (!passed && head.length) yield head;
}

/** Offset of the first sample after the `data` chunk header, -1 when not yet complete. */
function dataOffset(b: Uint8Array): number {
  let at = 12;
  while (at + 8 <= b.length) {
    const id = String.fromCharCode(...b.subarray(at, at + 4));
    const size = b[at + 4]! | (b[at + 5]! << 8) | (b[at + 6]! << 16) | (b[at + 7]! << 24);
    if (id === 'data') return at + 8;
    at += 8 + size + (size & 1);
  }
  return -1;
}
