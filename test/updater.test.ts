import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onExtensionFetch, updateForPreset } from '@/app/updater';

const switchInit = (extensionName: string): RequestInit => ({ method: 'POST', body: JSON.stringify({ extensionName, branch: 'dev', global: false }) });
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('reload after branch switch', () => {
  let diskFetch: ReturnType<typeof vi.fn>;
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    diskFetch = vi.fn(async () => new Response(JSON.stringify({ id: 'other-build' })));
    reload = vi.fn();
    const store = new Map<string, string>();
    vi.stubGlobal('__AP_BUILD_ID__', 'running-build');
    vi.stubGlobal('fetch', diskFetch);
    vi.stubGlobal('location', { href: 'http://st.local/', reload });
    vi.stubGlobal('localStorage', { getItem: () => 'en' });
    vi.stubGlobal('sessionStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('checks the bundle and reloads when AP itself switched branch', async () => {
    onExtensionFetch('/api/extensions/switch', switchInit('/advanced-preset'), new Response('ok'));
    await flush();
    expect(diskFetch).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(3000);
    expect(reload).toHaveBeenCalledOnce();
  });

  it('ignores other extensions, failed switches and other endpoints', async () => {
    onExtensionFetch('/api/extensions/switch', switchInit('/some-other-ext'), new Response('ok'));
    onExtensionFetch('/api/extensions/switch', switchInit('/advanced-preset'), new Response('nope', { status: 500 }));
    onExtensionFetch('/api/extensions/update', switchInit('/advanced-preset'), new Response('ok'));
    await flush();
    expect(diskFetch).not.toHaveBeenCalled();
  });
});

describe('updating AP for a preset that needs a newer version', () => {
  let calls: string[];
  let disk: string;
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    calls = [];
    disk = 'new-build';
    reload = vi.fn();
    const store = new Map<string, string>();
    vi.stubGlobal('__AP_BUILD_ID__', 'running-build');
    vi.stubGlobal('__AP_VERSION__', '1.11.2');
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      calls.push(String(url).split('?')[0]!);
      return String(url).includes('build.json') ? new Response(JSON.stringify({ id: disk })) : new Response(JSON.stringify({ isUpToDate: disk === 'running-build' }));
    }));
    vi.stubGlobal('location', { href: 'http://st.local/', reload });
    vi.stubGlobal('localStorage', { getItem: () => 'en' });
    vi.stubGlobal('sessionStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) });
    (globalThis as any).SillyTavern = { getContext: () => ({ getRequestHeaders: () => ({}) }) };
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete (globalThis as any).SillyTavern;
  });

  it('pulls the extension and reloads into the new bundle', async () => {
    expect(await updateForPreset('1.12.0', 'Mine')).toBe(true);
    expect(calls[0]).toBe('/api/extensions/update');
    vi.advanceTimersByTime(3000);
    expect(reload).toHaveBeenCalledOnce();
  });

  it('reports false when nothing newer was installed, and tries only once per session', async () => {
    disk = 'running-build';
    expect(await updateForPreset('1.12.0', 'Mine')).toBe(false);
    expect(await updateForPreset('1.12.0', 'Mine')).toBe(false);
    expect(calls.filter((c) => c === '/api/extensions/update')).toHaveLength(1);
    expect(reload).not.toHaveBeenCalled();
  });
});
