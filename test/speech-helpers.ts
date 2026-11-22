/** Test doubles for speech providers: a recording `SpeechEnv` and a connection factory. */
import type { SpeechApi, SpeechConnection, SpeechEnv } from '@/media/speech/types';

export interface Call { url: string; init: RequestInit; body: unknown }

export function conn(api: SpeechApi, over: Partial<SpeechConnection> = {}): SpeechConnection {
  return { id: 'c1', name: 'Test', api, baseUrl: '', apiKey: 'KEY', model: '', headers: {}, body: '', narrator: null, bindings: [], ...over };
}

/** `respond` gets each request and returns the response; requests are recorded in `calls`. */
export function env(respond: (call: Call) => Response | Promise<Response>, blobs: Record<string, Blob> = {}): SpeechEnv & { calls: Call[] } {
  const calls: Call[] = [];
  return {
    calls,
    async fetch(url, init) {
      let body: unknown = init.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { /* raw */ } }
      const call = { url, init, body };
      calls.push(call);
      return respond(call);
    },
    async blob(key) { return blobs[key]; },
  };
}

/** A response whose body arrives in small pieces. */
export function chunked(bytes: Uint8Array, size = 5, headers: Record<string, string> = {}): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(c) { for (let i = 0; i < bytes.length; i += size) c.enqueue(bytes.slice(i, i + size)); c.close(); },
  });
  return new Response(stream, { headers });
}

export async function drain(chunks: AsyncIterable<Uint8Array>): Promise<Uint8Array> {
  const parts: Uint8Array[] = [];
  for await (const c of chunks) parts.push(c);
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}
