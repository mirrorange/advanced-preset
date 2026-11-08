import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, INSTALL_NOTICE_MARK, INSTALLER_SCRIPT_ID, presetFile, resolveConfiguration, type APreset } from '@advanced-preset/protocol';
import { petals } from './helpers';

// ── adoption (I-171) ─────────────────────────────────────────────────────────

const installed = new Map<string, APreset>();
const settingsState: Record<string, any> = {};
let decline = false;
const installArtifact = vi.fn(async (a: APreset) => {
  if (decline) { const { TrustDeclined } = await import('@/app/trust'); throw new TrustDeclined(); }
  installed.set(a.id, a);
  return a;
});
const ensureCarrier = vi.fn(async (p: APreset, o: { select?: boolean } = {}) => {
  const name = `AP · ${p.name}`;
  if (pm.names[name] === undefined) { pm.presets.push({ carrier: p.hash }); pm.names[name] = pm.presets.length - 1; }
  if (o.select) pm.selected = name;
  return name;
});
vi.mock('@/app/install', () => ({ installArtifact: (a: APreset) => installArtifact(a) }));
vi.mock('@/store/presets', () => ({ getPreset: (id: string) => installed.get(id) }));
vi.mock('@/store/carrier', () => ({ ensureCarrier: (p: APreset, o?: { select?: boolean }) => ensureCarrier(p, o) }));
vi.mock('@/store/settings', () => ({ settings: () => settingsState, save: () => {} }));
vi.mock('@/ui/state', () => ({ refreshActivePreset: () => {} }));
const updateForPreset = vi.fn(async (_required: string, _name: string) => false);
vi.mock('@/app/updater', () => ({ updateForPreset: (r: string, n: string) => updateForPreset(r, n) }));

(globalThis as any).__AP_VERSION__ = '1.11.1';
(globalThis as any).localStorage ??= { getItem: () => 'en' };
const { adoptPresetFiles, onPresetChanged, presetFilesInList } = await import('@/app/preset-files');

const pm = { presets: [] as Record<string, any>[], names: {} as Record<string, number>, selected: '', deleted: [] as string[] };
const manager = {
  getPresetList: () => ({ presets: pm.presets, preset_names: pm.names }),
  getSelectedPresetName: () => pm.selected,
  deletePreset: async (n: string) => { pm.deleted.push(n); delete pm.names[n]; return true; },
};
const toasts: string[] = [];

const version = (v: string, hash: string): APreset => ({ ...cloneData(petals), version: v, hash });
const file = (a: APreset) => JSON.parse(JSON.stringify(presetFile(a, { sampling: resolveConfiguration(a, a.defaultConfiguration, undefined).sampling })));
function add(name: string, body: Record<string, any>, selected = false) {
  pm.presets.push(body);
  pm.names[name] = pm.presets.length - 1;
  if (selected) pm.selected = name;
}

beforeEach(() => {
  installed.clear();
  for (const k of Object.keys(settingsState)) delete settingsState[k];
  Object.assign(pm, { presets: [], names: {}, selected: 'Default', deleted: [] });
  add('Default', { temperature: 1 });
  decline = false;
  toasts.length = 0;
  installArtifact.mockClear();
  ensureCarrier.mockClear();
  (globalThis as any).SillyTavern = { getContext: () => ({ getPresetManager: () => manager }) };
  (globalThis as any).toastr = Object.fromEntries(['info', 'success', 'warning', 'error'].map((k) => [k, (m: string) => toasts.push(`${k}: ${m}`)]));
});
afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; });

describe('preset files in ST\'s list', () => {
  it('finds them by their AP data only', () => {
    add('petals.apreset', file(petals));
    add('Other', { prompts: [], extensions: { tavern_helper: { scripts: [] } } });
    expect(presetFilesInList().map((f) => f.name)).toEqual(['petals.apreset']);
    expect((presetFilesInList()[0]!.artifact as APreset).hash).toBe(petals.hash);
  });

  it('installs the preset, selects its Carrier in place of the selected file and deletes the file', async () => {
    add('petals.apreset', file(petals), true);
    await adoptPresetFiles();
    expect(installArtifact).toHaveBeenCalledOnce();
    expect(ensureCarrier).toHaveBeenCalledWith(expect.objectContaining({ id: petals.id }), { select: true });
    expect(pm.selected).toBe(`AP · ${petals.name}`);
    expect(pm.deleted).toEqual(['petals.apreset']);
    expect(toasts.some((x) => x.startsWith('success:'))).toBe(true);
  });

  it('does not select the Carrier for a file that is not selected', async () => {
    add('petals.apreset', file(petals));
    await adoptPresetFiles();
    expect(ensureCarrier).toHaveBeenCalledWith(expect.anything(), { select: false });
    expect(pm.selected).toBe('Default');
  });

  it('keeps a file named like the Carrier (it was overwritten in place)', async () => {
    add(`AP · ${petals.name}`, file(petals), true);
    await adoptPresetFiles();
    expect(pm.deleted).toEqual([]);
  });

  it('never downgrades: an older file is only replaced by the Carrier', async () => {
    installed.set(petals.id, version('9.0.0', 'new'));
    add('old.apreset', file(version('7.0.0', 'old')));
    await adoptPresetFiles();
    expect(installArtifact).not.toHaveBeenCalled();
    expect(ensureCarrier.mock.calls[0]![0].hash).toBe('new');
    expect(pm.deleted).toEqual(['old.apreset']);
  });

  it('installs a newer build over the installed one, and skips the same build', async () => {
    installed.set(petals.id, version('7.0.0', 'old'));
    add('new.apreset', file(version('7.1.0', 'new')));
    await adoptPresetFiles();
    expect(installArtifact).toHaveBeenCalledOnce();
    installArtifact.mockClear();
    add('again.apreset', file(version('7.1.0', 'new')));
    await adoptPresetFiles();
    expect(installArtifact).not.toHaveBeenCalled();
  });

  it('leaves files it cannot read alone, updating AP for one that needs a newer version', async () => {
    updateForPreset.mockClear();
    add('future.apreset', file({ ...version('8.0.0', 'f'), minAdvancedPreset: '99.0.0' }));
    add('format.apreset', { prompts: [], extensions: { advanced_preset_file: { format: 9, artifact: { id: 'x', entries: [], formatVersion: 99 } } } });
    await adoptPresetFiles();
    expect(updateForPreset).toHaveBeenCalledExactlyOnceWith('99.0.0', petals.name);
    expect(installArtifact).not.toHaveBeenCalled();
    expect(pm.deleted).toEqual([]);
  });

  it('remembers a declined preset until the file carries another build', async () => {
    decline = true;
    add('petals.apreset', file(petals), true);
    await adoptPresetFiles();
    expect(pm.deleted).toEqual([]);
    expect(settingsState.declinedPresetFiles).toEqual({ 'petals.apreset': petals.hash });
    await adoptPresetFiles();
    expect(installArtifact).toHaveBeenCalledOnce();
    decline = false;
    pm.presets[pm.names['petals.apreset']!] = file(version('7.9.9', 'other'));
    await adoptPresetFiles();
    expect(installArtifact).toHaveBeenCalledTimes(2);
    expect(settingsState.declinedPresetFiles).toEqual({});
  });

  it('takes over a preset file when it gets selected', async () => {
    add('petals.apreset', file(petals));
    add('later.apreset', file(version('7.9.1', 'l')));
    pm.selected = 'later.apreset';
    onPresetChanged();
    await adoptPresetFiles(); // queued behind the run started by the event
    expect(installArtifact.mock.calls[0]![0].hash).toBe('l');
  });
});

// ── the notice and the installer never outlive the file ─────────────────────

describe('install notice and installer with AP running', () => {
  it('drops the notice from prompts', async () => {
    const { dropInstallNotice } = await import('@/core/assembler');
    const chat: any[] = [
      { role: 'system', content: 'Hi' },
      { role: 'system', content: `${INSTALL_NOTICE_MARK}\nInstall it.` },
      { role: 'user', content: [{ type: 'text', text: `x ${INSTALL_NOTICE_MARK}` }] },
      { role: 'user', content: 'story' },
    ];
    dropInstallNotice(chat);
    expect(chat.map((m) => m.content)).toEqual(['Hi', 'story']);
  });

  it('a Carrier built over a file does not keep the installer script', async () => {
    const { carrierTavernHelper } = await import('@/store/tavern-helper');
    const current = file(petals).extensions.tavern_helper;
    current.scripts.push({ type: 'script', id: 'mine', name: 'Mine', enabled: true, content: '', info: '', button: { enabled: false, buttons: [] }, data: {}, export_with: { data: true, button: true } });
    current.scripts.push({ type: 'folder', id: 'f', name: 'F', enabled: true, icon: '', scripts: [{ ...current.scripts[0] }] });
    const th = carrierTavernHelper(undefined, current, []) as { data?: Record<string, any> };
    expect(th.data!.scripts.map((s: any) => s.id)).toEqual(['mine', 'f']);
    expect(th.data!.scripts[1].scripts).toEqual([]);
    expect(JSON.stringify(th.data)).not.toContain(INSTALLER_SCRIPT_ID);
  });

  it('ST import hands preset files to AP', async () => {
    const { looksLikeArtifact } = await import('@/app/st-preset-io');
    expect(looksLikeArtifact(file(petals))).toBe(true);
    expect(looksLikeArtifact({ prompts: [], extensions: { tavern_helper: {} } })).toBe(false);
  });
});
