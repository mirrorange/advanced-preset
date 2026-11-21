import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setNativeFetch } from '@/st/host';
import { ensureOk, errorText, forgetProxied, MediaHttpError, mediaFetch, ProxyError, proxyUrl } from '@/media/net';
import { bodyOverride, bodyOverrideError, deepMerge, joinUrl, mergeHeaders } from '@/media/request';
import type { CorsSettings } from '@/store/media';

const calls: { url: string; init: RequestInit }[] = [];
let respond: (url: string, init: RequestInit) => Response | Promise<Response>;

beforeEach(() => {
  calls.length = 0;
  forgetProxied();
  (globalThis as any).SillyTavern = { getContext: () => ({ getRequestHeaders: () => ({ 'Content-Type': 'application/json', 'X-CSRF-Token': 'csrf' }) }) };
  delete (globalThis as any).__TAURITAVERN__;
  setNativeFetch(async (input, init = {}) => { const url = String(input); calls.push({ url, init }); return respond(url, init); });
});
afterEach(() => { delete (globalThis as any).SillyTavern; });

const cors = (over: Partial<CorsSettings> = {}): CorsSettings => ({ mode: 'auto', proxy: 'host', customUrl: '', ...over });
const target = 'https://api.example.com/v1/images?x=1';

describe('proxyUrl', () => {
  it('host proxy encodes the target', () => {
    expect(proxyUrl(target, cors())).toBe(`/proxy/${encodeURIComponent(target)}`);
  });
  it('custom proxy: {url} placeholder or prefix', () => {
    expect(proxyUrl(target, cors({ proxy: 'custom', customUrl: 'https://p.dev/?u={url}' }))).toBe(`https://p.dev/?u=${encodeURIComponent(target)}`);
    expect(proxyUrl(target, cors({ proxy: 'custom', customUrl: 'https://p.dev/' }))).toBe(`https://p.dev/${target}`);
    expect(() => proxyUrl(target, cors({ proxy: 'custom' }))).toThrow(ProxyError);
  });
});

describe('mediaFetch', () => {
  it('off: direct only', async () => {
    respond = () => new Response('ok');
    await mediaFetch(target, { method: 'POST', body: '{}' }, cors({ mode: 'off' }));
    expect(calls.map((c) => c.url)).toEqual([target]);
  });

  it('on: always through the host proxy, with the CSRF token', async () => {
    respond = () => new Response('ok');
    await mediaFetch(target, { method: 'POST', body: '{}', headers: { Authorization: 'Bearer k' } }, cors({ mode: 'on' }));
    expect(calls[0]!.url).toBe(`/proxy/${encodeURIComponent(target)}`);
    const h = new Headers(calls[0]!.init.headers);
    expect(h.get('Authorization')).toBe('Bearer k');
    expect(h.get('X-CSRF-Token')).toBe('csrf');
  });

  it('auto: falls back to the proxy on a CORS error and remembers the origin', async () => {
    respond = (url) => { if (!url.startsWith('/proxy/')) throw new TypeError('Failed to fetch'); return new Response('ok'); };
    const r = await mediaFetch(target, { method: 'POST', body: '{}' }, cors());
    expect(await r.text()).toBe('ok');
    expect(calls.map((c) => c.url.startsWith('/proxy/'))).toEqual([false, true]);
    await mediaFetch('https://api.example.com/other', { method: 'GET' }, cors());
    expect(calls[2]!.url.startsWith('/proxy/')).toBe(true);
  });

  it('auto: aborts are not retried', async () => {
    respond = () => { throw new DOMException('aborted', 'AbortError'); };
    await expect(mediaFetch(target, {}, cors())).rejects.toThrow('aborted');
    expect(calls).toHaveLength(1);
  });

  it('reports a disabled SillyTavern proxy', async () => {
    respond = () => new Response('CORS proxy is disabled. Enable it in config.yaml or use the --corsProxy flag.', { status: 404 });
    await expect(mediaFetch(target, { body: '{}' }, cors({ mode: 'on' }))).rejects.toMatchObject({ issue: 'disabled' });
  });

  it('SillyTavern proxy refuses non-JSON bodies; TauriTavern carries them', async () => {
    respond = () => new Response('ok');
    const form = new FormData();
    await expect(mediaFetch(target, { method: 'POST', body: form }, cors({ mode: 'on' }))).rejects.toMatchObject({ issue: 'body' });
    (globalThis as any).__TAURITAVERN__ = {};
    await mediaFetch(target, { method: 'POST', body: form }, cors({ mode: 'on' }));
    expect(calls).toHaveLength(1);
  });

  it('auto: a proxy that cannot help clears the remembered origin', async () => {
    respond = (url) => { if (!url.startsWith('/proxy/')) throw new TypeError('Failed to fetch'); return new Response('CORS proxy is disabled.', { status: 404 }); };
    await expect(mediaFetch(target, { body: '{}' }, cors())).rejects.toBeInstanceOf(ProxyError);
    respond = () => new Response('ok');
    await mediaFetch(target, { body: '{}' }, cors());
    expect(calls.at(-1)!.url).toBe(target);
  });
});

describe('errors', () => {
  it('extracts provider messages', () => {
    expect(errorText(400, '{"error":{"message":"bad prompt"}}')).toBe('HTTP 400: bad prompt');
    expect(errorText(401, '{"message":"no key"}')).toBe('HTTP 401: no key');
    expect(errorText(500, '<html><body>Oops</body></html>')).toBe('HTTP 500: Oops');
    expect(errorText(502, '')).toBe('HTTP 502');
  });
  it('ensureOk throws on non-2xx', async () => {
    await expect(ensureOk(new Response('{"error":"x"}', { status: 429 }))).rejects.toBeInstanceOf(MediaHttpError);
  });
});

describe('request overrides', () => {
  it('deep-merges bodies; null deletes, arrays replace', () => {
    expect(deepMerge({ a: 1, p: { w: 1, h: 2, list: [1] } }, { p: { h: 3, list: [2, 3] }, a: null, b: true })).toEqual({ p: { w: 1, h: 3, list: [2, 3] }, b: true });
  });
  it('parses body overrides', () => {
    expect(bodyOverride({ body: '' })).toEqual({});
    expect(bodyOverride({ body: '{"quality":"high"}' })).toEqual({ quality: 'high' });
    expect(bodyOverrideError('[1]')).not.toBe('');
    expect(bodyOverrideError('{')).not.toBe('');
  });
  it('merges headers case-insensitively; empty removes', () => {
    const h = mergeHeaders({ Authorization: 'Bearer a', 'Content-Type': 'application/json' }, { headers: { authorization: 'Bearer b', 'content-type': '', 'X-Extra': '1' } });
    expect(h.get('Authorization')).toBe('Bearer b');
    expect(h.has('Content-Type')).toBe(false);
    expect(h.get('x-extra')).toBe('1');
  });
  it('joins urls', () => {
    expect(joinUrl('https://a.b/v1/', '/images/generations')).toBe('https://a.b/v1/images/generations');
  });
});
