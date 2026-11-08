import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, type APreset } from '@advanced-preset/protocol';
import { petals, withoutTemplates } from './helpers';

const updateForPreset = vi.fn(async (_required: string, _name: string) => false);
vi.mock('@/app/updater', () => ({ updateForPreset: (r: string, n: string) => updateForPreset(r, n) }));
vi.mock('@/store/carrier', () => ({ ensureCarrier: async () => 'AP · x', findCarrier: () => undefined }));
vi.mock('@/app/bundled-modules', () => ({ syncBundledModules: async () => {} }));

const {
  ApUpdating, checkPresetUpdates, dropSupersededCopies, installArtifact, installFromUrl, resumePendingInstall, updateFromSource, updateSource,
} = await import('@/app/install');
const { getPresetEntry, loadBuiltins } = await import('@/store/presets');
const { settings } = await import('@/store/settings');

const AFFIRMATIVE = 1;
let answer = AFFIRMATIVE;
const popup = vi.fn(async (..._args: unknown[]) => answer);
/** URL → artifact served by the stubbed fetch. */
let served: Record<string, unknown> = {};
const fetched: string[] = [];
const session = new Map<string, string>();
const toasts: string[] = [];

const base = withoutTemplates(petals);
const preset = (o: Partial<APreset> = {}): APreset => ({ ...cloneData(base), id: 'mine', name: 'Mine', version: '1.0.0', hash: 'h1', ...o });

beforeEach(() => {
  answer = AFFIRMATIVE;
  served = {};
  fetched.length = 0;
  toasts.length = 0;
  session.clear();
  popup.mockClear();
  updateForPreset.mockReset();
  updateForPreset.mockResolvedValue(false);
  vi.stubGlobal('__AP_VERSION__', '1.11.1');
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  vi.stubGlobal('sessionStorage', { getItem: (k: string) => session.get(k) ?? null, setItem: (k: string, v: string) => void session.set(k, v), removeItem: (k: string) => void session.delete(k) });
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    fetched.push(url);
    return url in served ? new Response(JSON.stringify(served[url])) : new Response('not found', { status: 404, statusText: 'Not Found' });
  }));
  (globalThis as any).toastr = Object.fromEntries(['info', 'success', 'warning', 'error'].map((k) => [k, (m: string) => toasts.push(`${k}: ${m}`)]));
  const s = settings();
  s.installed = {};
  s.sources = {};
  delete s.declinedUpdates;
});
afterEach(() => { vi.unstubAllGlobals(); delete (globalThis as any).toastr; });

(globalThis as any).SillyTavern = {
  getContext: () => ({
    extensionSettings: {}, saveSettingsDebounced: () => {}, chat: [], chatMetadata: {},
    callGenericPopup: popup, POPUP_TYPE: { CONFIRM: 2 }, POPUP_RESULT: { AFFIRMATIVE },
  }),
};

describe('update sources', () => {
  it('uses the link a preset was installed from, else the updateUrl it declares', async () => {
    await installArtifact(preset({ updateUrl: 'https://example.com/mine.apreset.json' }));
    expect(updateSource('mine')).toEqual({ url: 'https://example.com/mine.apreset.json', remembered: false });
    served['https://example.com/pinned.json'] = preset({ version: '1.0.1', hash: 'h2', updateUrl: 'https://example.com/mine.apreset.json' });
    await installFromUrl('https://example.com/pinned.json');
    expect(updateSource('mine')).toEqual({ url: 'https://example.com/pinned.json', remembered: true });
  });

  it('ignores an updateUrl that is not an http(s) URL', async () => {
    await installArtifact(preset({ updateUrl: 'javascript:alert(1)' }));
    expect(updateSource('mine')).toBeUndefined();
  });

  it('updates from the declared URL without remembering it (a later updateUrl is followed)', async () => {
    await installArtifact(preset({ updateUrl: 'https://a.example/mine.json' }));
    served['https://a.example/mine.json'] = preset({ version: '1.1.0', hash: 'h2', updateUrl: 'https://b.example/mine.json' });
    await updateFromSource('mine');
    expect(settings().sources.mine).toBeUndefined();
    expect(updateSource('mine')?.url).toBe('https://b.example/mine.json');
  });
});

describe('checking for updates at startup', () => {
  it('installs a newer version from the update source', async () => {
    await installArtifact(preset({ updateUrl: 'https://example.com/mine.json' }));
    served['https://example.com/mine.json'] = preset({ version: '1.2.0', hash: 'h2', updateUrl: 'https://example.com/mine.json' });
    await checkPresetUpdates();
    expect(getPresetEntry('mine')?.preset.version).toBe('1.2.0');
    expect(toasts.some((x) => x.startsWith('success:') && x.includes('1.2.0'))).toBe(true);
  });

  it('leaves the same or an older version, another preset and failed downloads alone', async () => {
    await installArtifact(preset({ version: '2.0.0', updateUrl: 'https://example.com/mine.json' }));
    served['https://example.com/mine.json'] = preset({ version: '2.0.0', hash: 'other' });
    await checkPresetUpdates();
    served['https://example.com/mine.json'] = preset({ version: '1.9.0', hash: 'older' });
    await checkPresetUpdates();
    served['https://example.com/mine.json'] = preset({ id: 'someone-else', version: '9.0.0', hash: 'x' });
    await checkPresetUpdates();
    delete served['https://example.com/mine.json'];
    await checkPresetUpdates();
    expect(getPresetEntry('mine')?.preset.hash).toBe('h1');
    expect(fetched).toHaveLength(4);
  });

  it('remembers an update the user declined to trust', async () => {
    await installArtifact(preset({ updateUrl: 'https://example.com/mine.json' }));
    const templated = preset({ version: '1.1.0', hash: 'h2' });
    templated.entries[0]!.content[0]!.pieces.push({ text: '<%- 1 %>', template: { file: 'modules/x.md', line: 1 } });
    served['https://example.com/mine.json'] = templated;
    answer = 0;
    await checkPresetUpdates();
    expect(settings().declinedUpdates).toEqual({ mine: 'h2' });
    expect(popup).toHaveBeenCalledOnce();
    await checkPresetUpdates();
    expect(popup).toHaveBeenCalledOnce();
    expect(getPresetEntry('mine')?.preset.version).toBe('1.0.0');
  });
});

describe('presets that need a newer Advanced Preset', () => {
  it('updates AP and installs the preset after the reload', async () => {
    updateForPreset.mockResolvedValue(true);
    await expect(installArtifact(preset({ minAdvancedPreset: '1.12.0' }), 'https://example.com/mine.json')).rejects.toBeInstanceOf(ApUpdating);
    expect(updateForPreset).toHaveBeenCalledWith('1.12.0', 'Mine');
    expect(settings().installed.mine).toBeUndefined();

    vi.stubGlobal('__AP_VERSION__', '1.12.0');
    await resumePendingInstall();
    expect(getPresetEntry('mine')?.source).toBe('installed');
    expect(settings().sources.mine).toBe('https://example.com/mine.json');
    expect(session.size).toBe(0);
  });

  it('refuses the install when AP could not update itself', async () => {
    await expect(installArtifact(preset({ minAdvancedPreset: '99.0.0' }))).rejects.toThrow(/99\.0\.0/);
    expect(session.size).toBe(0);
    expect(settings().installed.mine).toBeUndefined();
  });

  it('an update found at startup goes the same way', async () => {
    await installArtifact(preset({ updateUrl: 'https://example.com/mine.json' }));
    served['https://example.com/mine.json'] = preset({ version: '2.0.0', hash: 'h2', minAdvancedPreset: '1.12.0' });
    updateForPreset.mockResolvedValue(true);
    await checkPresetUpdates();
    expect(getPresetEntry('mine')?.preset.version).toBe('1.0.0');
    expect(session.size).toBe(1);
  });
});

describe('built-in presets installed by hand', () => {
  beforeEach(async () => {
    const shipped = { ...cloneData(base), version: '7.11.0', updateUrl: 'https://example.com/petals.json' };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      fetched.push(url);
      return new Response(JSON.stringify(url.endsWith('index.json') ? [{ file: 'p.json' }] : shipped));
    }));
    await loadBuiltins();
    fetched.length = 0;
  });

  it('drops the installed copy once the shipped built-in is newer', () => {
    settings().installed[base.id] = { ...cloneData(base), version: '7.10.0' };
    settings().sources[base.id] = 'https://example.com/petals.json';
    settings().installed.mine = preset();
    expect(dropSupersededCopies().map((p) => p.version)).toEqual(['7.11.0']);
    expect(settings().installed[base.id]).toBeUndefined();
    expect(settings().sources[base.id]).toBeUndefined();
    expect(getPresetEntry(base.id)?.source).toBe('builtin');
    expect(settings().installed.mine).toBeDefined();
  });

  it('keeps a copy of the same or a newer version', () => {
    settings().installed[base.id] = { ...cloneData(base), version: '7.11.0' };
    expect(dropSupersededCopies()).toEqual([]);
    settings().installed[base.id] = { ...cloneData(base), version: '8.0.0' };
    expect(dropSupersededCopies()).toEqual([]);
    expect(getPresetEntry(base.id)?.source).toBe('installed');
  });

  it('does not check built-in presets for updates (they update with the extension)', async () => {
    expect(updateSource(base.id)).toBeUndefined();
    await checkPresetUpdates();
    expect(fetched).toEqual([]);
  });
});
