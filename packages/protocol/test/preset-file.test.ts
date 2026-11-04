import { describe, expect, it } from 'vitest';
import {
  AP_MIRRORS, INSTALL_NOTICE_ID, INSTALL_NOTICE_MARK, INSTALLER_SCRIPT_ID, PRESET_FILE_FIELD, PRESET_FILE_SINCE,
  FORMAT_VERSION, installerScript, isPresetFile, presetFile, presetFileData, requiredAdvancedPreset, unwrapPresetFile, upgradeArtifact,
  type APreset,
} from '../src';

const artifact = {
  formatVersion: FORMAT_VERSION, id: 'demo', name: 'Demo', version: '1.2.0', hash: 'h', entries: [],
  carrier: {
    prompts: [
      { identifier: 'ap_top', name: 'top', role: 'system', content: '⟦ap:region:top⟧' },
      { identifier: 'main', name: 'Main Prompt', system_prompt: true, content: '' },
      { identifier: 'chatHistory', name: 'Chat History', system_prompt: true, marker: true },
    ],
    prompt_order: [{ identifier: 'ap_top', enabled: true }, { identifier: 'main', enabled: true }, { identifier: 'chatHistory', enabled: true }],
  },
} as unknown as APreset;

describe('preset file', () => {
  const file = presetFile(artifact, { sampling: { temperature: 0.8 } }) as Record<string, any>;

  it('is an ST Chat Completion preset that carries the artifact', () => {
    expect(file.temperature).toBe(0.8);
    expect(file.id).toBeUndefined();
    expect(file.entries).toBeUndefined();
    expect(file.prompt_order.map((o: any) => o.character_id)).toEqual([100000, 100001]);
    expect(file.extensions[PRESET_FILE_FIELD]).toEqual({ format: 1, artifact });
    expect(isPresetFile(file)).toBe(true);
    expect(isPresetFile(artifact)).toBe(false);
    expect(presetFileData(artifact)).toBeUndefined();
  });

  it('switches the region anchors off and ends with the enabled install notice', () => {
    const order = file.prompt_order[0].order;
    expect(order).toEqual([
      { identifier: 'ap_top', enabled: false }, { identifier: 'main', enabled: true }, { identifier: 'chatHistory', enabled: true },
      { identifier: INSTALL_NOTICE_ID, enabled: true },
    ]);
    const notice = file.prompts.find((p: any) => p.identifier === INSTALL_NOTICE_ID);
    expect(notice.content.startsWith(INSTALL_NOTICE_MARK)).toBe(true);
    expect(notice.content).toContain('"Demo" 1.2.0');
    for (const url of AP_MIRRORS) expect(notice.content).toContain(url);
    // The artifact's own Carrier is not touched.
    expect(artifact.carrier.prompt_order[0]!.enabled).toBe(true);
    expect(artifact.carrier.prompts).toHaveLength(3);
  });

  it('adds the installer as a Tavern Helper preset script unless asked not to', () => {
    expect(file.extensions.tavern_helper.scripts.map((s: any) => s.id)).toEqual([INSTALLER_SCRIPT_ID]);
    expect(file.extensions.tavern_helper.variables).toEqual({});
    const bare = presetFile(artifact, { installer: false }) as Record<string, any>;
    expect(bare.extensions.tavern_helper).toBeUndefined();
    expect(bare.extensions[PRESET_FILE_FIELD].artifact).toBe(artifact);
  });

  it('is read back as the artifact; bare artifacts still load', () => {
    const json = JSON.parse(JSON.stringify(file));
    expect(unwrapPresetFile(json)).toEqual(artifact);
    expect(upgradeArtifact(json)?.id).toBe('demo');
    expect(upgradeArtifact(JSON.parse(JSON.stringify(artifact)))?.id).toBe('demo');
    expect(upgradeArtifact({ prompts: [], extensions: {} })).toBeNull();
    expect(unwrapPresetFile(null)).toBeNull();
  });

  it('requires the version that reads preset files, or the preset\'s own when newer', () => {
    expect(requiredAdvancedPreset({})).toBe(PRESET_FILE_SINCE);
    expect(requiredAdvancedPreset({ minAdvancedPreset: '1.4.0' })).toBe(PRESET_FILE_SINCE);
    expect(requiredAdvancedPreset({ minAdvancedPreset: '2.1.0' })).toBe('2.1.0');
  });
});

// ── the installer, run against a simulated SillyTavern page ──────────────────

type Reply = { status: number; body?: unknown };
interface Page {
  calls: { url: string; body?: any }[];
  popups: string[];
  toasts: string[];
  reloaded: boolean;
  session: Map<string, string>;
  host: Record<string, any>;
}

function page(o: { ap?: { version: string; update?: () => Promise<string> }; answers?: boolean[]; installed?: boolean; disabled?: boolean; replies?: Record<string, Reply[]>; locale?: string } = {}): Page {
  const p: Page = { calls: [], popups: [], toasts: [], reloaded: false, session: new Map(), host: {} };
  const answers = [...(o.answers ?? [])];
  const replies = o.replies ?? {};
  const disabledExtensions = o.disabled ? ['third-party/advanced-preset'] : [];
  const ctx = {
    getCurrentLocale: () => o.locale ?? 'en',
    getRequestHeaders: () => ({ 'X-CSRF-Token': 't' }),
    POPUP_TYPE: { TEXT: 1, CONFIRM: 2 },
    POPUP_RESULT: { AFFIRMATIVE: 1, NEGATIVE: 0 },
    callGenericPopup: async (html: string, type: number) => { p.popups.push(html); return type === 2 ? (answers.shift() ? 1 : 0) : 1; },
    extensionSettings: { disabledExtensions },
    saveSettingsDebounced: () => p.calls.push({ url: 'saveSettings' }),
  };
  const res = (r: Reply) => ({ ok: r.status >= 200 && r.status < 300, status: r.status, json: async () => r.body, text: async () => '' });
  p.host = {
    SillyTavern: { getContext: () => ctx },
    AdvancedPreset: o.ap,
    toastr: { info: (m: string) => p.toasts.push(m), success: (m: string) => p.toasts.push(m), warning: (m: string) => p.toasts.push(m), error: (m: string) => p.toasts.push(m) },
    localStorage: { getItem: () => null },
    sessionStorage: { getItem: (k: string) => p.session.get(k) ?? null, setItem: (k: string, v: string) => p.session.set(k, v) },
    navigator: { language: 'en' },
    location: { reload: () => { p.reloaded = true; } },
    setTimeout: (f: () => void) => { queueMicrotask(f); return 0; },
    fetch: async (url: string, init?: { body?: string }) => {
      const body = init?.body ? JSON.parse(init.body) : undefined;
      p.calls.push({ url, body });
      if (url === '/api/extensions/discover') return res({ status: 200, body: o.installed ? [{ type: 'local', name: 'third-party/advanced-preset' }] : [] });
      const queue = replies[url] ?? [];
      const r = queue.shift() ?? { status: 200, body: {} };
      if (r.status === 0) throw new TypeError('network');
      return res(r);
    },
  };
  return p;
}

async function run(p: Page, required = '1.10.0'): Promise<void> {
  const src = installerScript({ name: 'Demo <Preset>', minAdvancedPreset: required }).content;
  const errors: unknown[] = [];
  const console = { warn: () => {}, error: (...a: unknown[]) => errors.push(a) };
  new Function('window', 'console', src)({ parent: p.host }, console);
  for (let i = 0; i < 200; i++) await new Promise((r) => setTimeout(r, 0));
  expect(errors).toEqual([]);
}

const installs = (p: Page) => p.calls.filter((c) => c.url === '/api/extensions/install').map((c) => c.body.url);

describe('installer script', () => {
  it('is a plain script for Tavern Helper, with its id and the escaped preset name', () => {
    const s = installerScript({ name: 'A</script>B' });
    expect(s).toMatchObject({ type: 'script', id: INSTALLER_SCRIPT_ID, enabled: true });
    expect(s.content).not.toContain('</script');
    expect(() => new Function('window', s.content)).not.toThrow();
  });

  it('does nothing while a new enough Advanced Preset runs', async () => {
    const p = page({ ap: { version: '1.10.0' } });
    await run(p);
    expect(p.calls).toEqual([]);
    expect(p.popups).toEqual([]);
  });

  it('installs from the next mirror when one fails, then offers a reload', async () => {
    const p = page({ answers: [true, true], replies: { '/api/extensions/install': [{ status: 500 }, { status: 0 }, { status: 200 }] } });
    await run(p);
    expect(installs(p)).toEqual([...AP_MIRRORS]);
    expect(p.calls.find((c) => c.url === '/api/extensions/install')!.body.global).toBe(false);
    expect(p.popups).toHaveLength(2);
    expect(p.popups[0]).toContain('Demo &lt;Preset&gt;');
    expect(p.reloaded).toBe(true);
  });

  it('stops at the first mirror that works', async () => {
    const p = page({ answers: [true, false] });
    await run(p);
    expect(installs(p)).toEqual([AP_MIRRORS[0]]);
    expect(p.reloaded).toBe(false);
  });

  it('asks to check the network or install by hand when every mirror fails', async () => {
    const p = page({ answers: [true], locale: 'zh-cn', replies: { '/api/extensions/install': [{ status: 500 }, { status: 500 }, { status: 500 }] } });
    await run(p);
    expect(installs(p)).toHaveLength(3);
    expect(p.popups.at(-1)).toContain('请检查网络连接');
    expect(p.popups.at(-1)).toContain('手动安装');
    expect(p.reloaded).toBe(false);
  });

  it('remembers "later" for the session', async () => {
    const p = page({ answers: [false] });
    await run(p);
    expect(installs(p)).toEqual([]);
    const again = page({ answers: [true] });
    again.session = p.session;
    await run(again);
    expect(again.popups).toEqual([]);
  });

  it('updates an older running Advanced Preset through its own API', async () => {
    let updated = 0;
    const p = page({ ap: { version: '1.9.0', update: async () => { updated++; return 'updated'; } }, answers: [true] });
    await run(p);
    expect(updated).toBe(1);
    expect(p.popups[0]).toContain('1.9.0');
    expect(installs(p)).toEqual([]);
  });

  it('enables an installed but disabled Advanced Preset and reloads', async () => {
    const p = page({ installed: true, disabled: true, answers: [true] });
    await run(p);
    expect(p.calls.map((c) => c.url)).toContain('saveSettings');
    expect(p.host.SillyTavern.getContext().extensionSettings.disabledExtensions).toEqual([]);
    expect(p.reloaded).toBe(true);
  });

  it('updates an installed one that does not run', async () => {
    const p = page({ installed: true, answers: [true, true] });
    await run(p);
    expect(p.calls.find((c) => c.url === '/api/extensions/update')!.body).toEqual({ extensionName: 'advanced-preset', global: false });
    expect(installs(p)).toEqual([]);
    expect(p.reloaded).toBe(true);
  });
});
