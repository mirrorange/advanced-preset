import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installFetchGate, MARKER } from '@/core/fetch-gate';
import { registry } from '@/core/context';
import { GENERATE_URL, handoff, orchestrate } from '@/core/orchestrator';
import { setNativeFetch } from '@/st/host';
import { ctxFor } from './helpers';

const reply = () => new Response(JSON.stringify({ choices: [{ message: { content: 'The rain fell.' } }] }), { headers: { 'Content-Type': 'application/json' } });

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  vi.stubGlobal('location', { href: 'http://localhost:8000/' });
  (globalThis as any).toastr = { warning: vi.fn(), error: vi.fn(), info: vi.fn() };
  (globalThis as any).SillyTavern = { getContext: () => ({ chat: [], getRequestHeaders: () => ({}), isToolCallingSupported: () => true, eventSource: { emit: async () => undefined } }) };
  handoff.pending = null;
});
afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; vi.unstubAllGlobals(); });

describe('stopped generations (Tavern Helper prompt viewer)', () => {
  it('a request stopped before it is sent rejects like a native fetch: nothing is generated', async () => {
    const backend = vi.fn(async () => reply());
    vi.stubGlobal('fetch', backend);
    installFetchGate();
    const ctx = ctxFor('plaintext');
    registry.arm(ctx);
    registry.takeArmed();
    const abort = new AbortController();
    // Tavern Helper calls stopGeneration() from its CHAT_COMPLETION_SETTINGS_READY listener.
    abort.abort('Clicked stop button');
    const body = JSON.stringify({ chat_completion_source: 'openai', model: 'x', stream: true, messages: [{ role: 'user', content: 'Hi' }], [MARKER]: ctx.id });
    await expect(globalThis.fetch(GENERATE_URL, { method: 'POST', body, signal: abort.signal })).rejects.toBe('Clicked stop button');
    expect(backend).not.toHaveBeenCalled();
    expect(handoff.pending).toBeNull();
    expect(registry.get(ctx.id)).toBeUndefined();
  });

  it('a non-streaming request stopped while running rejects instead of returning a reply', async () => {
    const abort = new AbortController();
    setNativeFetch((async (_url: string, init: RequestInit) => {
      abort.abort('Clicked stop button');
      init.signal?.throwIfAborted();
      return reply();
    }) as typeof fetch);
    const ctx = ctxFor('plaintext');
    await expect(orchestrate(ctx, { chat_completion_source: 'openai', model: 'x', stream: false, messages: [{ role: 'user', content: 'Hi' }] }, abort.signal)).rejects.toBe('Clicked stop button');
    expect(handoff.pending).toBeNull();
  });

  it('not stopped: the reply comes back', async () => {
    setNativeFetch((async () => reply()) as typeof fetch);
    const ctx = ctxFor('plaintext');
    const resp = await orchestrate(ctx, { chat_completion_source: 'openai', model: 'x', stream: false, messages: [{ role: 'user', content: 'Hi' }] }, new AbortController().signal);
    expect((await resp.json()).choices[0].message.content).toContain('The rain fell.');
    expect(handoff.pending?.ctx).toBe(ctx);
  });
});
