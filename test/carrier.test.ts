import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, resolveConfiguration } from '@advanced-preset/protocol';
import { petals } from './helpers';

const state: Record<string, unknown> = {};
vi.mock('@/store/config', () => ({ presetState: () => state, activeConfiguration: (p: any) => resolveConfiguration(p, 'other', {}), updateConfiguration: () => {} }));
vi.mock('@/store/settings', () => ({ save: () => {} }));
const { ensureCarrier, buildCarrier, carrierName } = await import('@/store/carrier');

/** A minimal ST preset manager: `savePreset` without `skipUpdate` applies the preset like ST's `updateList`. */
function manager(selected: string) {
  const presets: Record<string, any>[] = [];
  const preset_names: Record<string, number> = {};
  const saves: { name: string; applied: boolean }[] = [];
  let applied: Record<string, any> | null = null;
  const m = {
    getPresetList: () => ({ presets, preset_names }),
    getCompletionPresetByName: (n: string) => presets[preset_names[n]!],
    getSelectedPresetName: () => selected,
    findPreset: (n: string) => preset_names[n],
    selectPreset: async () => {},
    savePreset: async (name: string, body: any, o: { skipUpdate?: boolean } = {}) => {
      saves.push({ name, applied: !o.skipUpdate });
      if (preset_names[name] === undefined) { presets.push(body); preset_names[name] = presets.length - 1; } else presets[preset_names[name]!] = body;
      if (!o.skipUpdate) { applied = body; selected = name; }
    },
  };
  return { m, saves, applied: () => applied };
}

let pm: ReturnType<typeof manager>;
beforeEach(() => { for (const k of Object.keys(state)) delete state[k]; (globalThis as any).SillyTavern = { getContext: () => ({ getPresetManager: () => pm.m, chatCompletionSettings: {} }) }; });
afterEach(() => { delete (globalThis as any).SillyTavern; });

describe('Carrier rebuild', () => {
  const old = () => {
    const p = cloneData(petals);
    p.hash = 'old';
    p.carrier.prompts = p.carrier.prompts.filter((x) => x.identifier !== 'ap_input');
    p.carrier.prompt_order = p.carrier.prompt_order.filter((x) => x.identifier !== 'ap_input');
    return buildCarrier(p, resolveConfiguration(p, 'other', {}));
  };

  it('re-applies a Carrier that is in use, so new region anchors reach ST', async () => {
    pm = manager(carrierName(petals));
    await pm.m.savePreset(carrierName(petals), old(), { skipUpdate: true });
    await ensureCarrier(petals);
    expect(pm.saves.at(-1)).toEqual({ name: carrierName(petals), applied: true });
    expect((pm.applied()!.prompts as any[]).some((x) => x.identifier === 'ap_input')).toBe(true);
  });

  it('only saves a Carrier that is not in use', async () => {
    pm = manager('Default');
    await pm.m.savePreset(carrierName(petals), old(), { skipUpdate: true });
    await ensureCarrier(petals);
    expect(pm.saves.at(-1)).toEqual({ name: carrierName(petals), applied: false });
    expect(pm.applied()).toBeNull();
  });

  it('leaves an up-to-date Carrier alone', async () => {
    pm = manager(carrierName(petals));
    await pm.m.savePreset(carrierName(petals), buildCarrier(petals, resolveConfiguration(petals, 'other', {})), { skipUpdate: true });
    await ensureCarrier(petals);
    expect(pm.saves).toHaveLength(1);
  });
});

describe('Carrier regex scripts', () => {
  const script = { id: '00000000-0000-4000-8000-000000000000', scriptName: 'Hide', findRegex: '/x/g', replaceString: '', trimStrings: [], placement: [2], disabled: false, markdownOnly: true, promptOnly: false, runOnEdit: true, substituteRegex: 0, minDepth: null, maxDepth: null };

  it('writes the preset regex scripts as ST preset-scoped scripts', () => {
    const p = { ...cloneData(petals), regexScripts: [script] };
    const body = buildCarrier(p, resolveConfiguration(p, 'other', {}));
    expect((body.extensions as any).regex_scripts).toEqual([script]);
    (body.extensions as any).regex_scripts[0].disabled = true;
    expect(p.regexScripts[0]!.disabled).toBe(false);
  });

  it('adds no regex_scripts field without scripts', () => {
    const p = { ...cloneData(petals), regexScripts: undefined };
    expect('regex_scripts' in (buildCarrier(p, resolveConfiguration(p, 'other', {})).extensions as object)).toBe(false);
  });
});

describe('Carrier Tavern Helper scripts', () => {
  const script = (id: string, over: Record<string, unknown> = {}) => ({
    type: 'script' as const, enabled: true, name: id, id, content: `run('${id}')`, info: '', button: { enabled: true, buttons: [] }, data: {}, export_with: { data: true, button: true }, ...over,
  });
  const withScripts = (trees: any[], hash = 'v2') => ({ ...cloneData(petals), hash, tavernHelperScripts: trees });
  const th = (body: Record<string, any>) => body.extensions.tavern_helper;
  const meta = (body: Record<string, any>) => body.extensions.advanced_preset;

  it('writes the preset scripts where Tavern Helper reads preset scripts', () => {
    const p = withScripts([script('a')]);
    const body = buildCarrier(p, resolveConfiguration(p, 'other', {}));
    expect(th(body)).toEqual({ scripts: [script('a')], variables: {} });
    expect(meta(body).tavernHelperScripts).toEqual(['a']);
    th(body).scripts[0].enabled = false;
    expect(p.tavernHelperScripts[0]!.enabled).toBe(true);
  });

  it('adds no tavern_helper field without scripts', () => {
    const body = buildCarrier(petals, resolveConfiguration(petals, 'other', {}));
    expect('tavern_helper' in (body.extensions as object)).toBe(false);
    expect('tavernHelperScripts' in meta(body)).toBe(false);
  });

  it('keeps switches, script data, variables and the user\'s own scripts on rebuild; drops what the preset dropped', () => {
    const v1 = withScripts([script('a', { data: { keep: 1, over: 'old' } }), script('gone'), { type: 'folder', enabled: true, name: 'F', id: 'f', icon: 'fa-solid fa-folder', scripts: [script('b')] }], 'v1');
    const installed = buildCarrier(v1, resolveConfiguration(v1, 'other', {})) as Record<string, any>;
    // What Tavern Helper and the user did meanwhile.
    const t = th(installed);
    t.scripts[0].enabled = false;
    t.scripts[0].data = { over: 'user', mine: true };
    t.scripts[2].scripts.push(script('user-in-folder'));
    t.scripts.push(script('user'));
    t.variables = { score: 3 };
    t.future = 'kept';

    const v2 = withScripts([script('a', { content: 'v2()', data: { over: 'new', fresh: 2 } }), { type: 'folder', enabled: true, name: 'F', id: 'f', icon: 'fa-solid fa-folder', scripts: [script('b', { enabled: false }), script('c')] }]);
    const rebuilt = th(buildCarrier(v2, resolveConfiguration(v2, 'other', {}), installed));
    expect(rebuilt.variables).toEqual({ score: 3 });
    expect(rebuilt.future).toBe('kept');
    expect(rebuilt.scripts.map((x: any) => x.id)).toEqual(['a', 'f', 'user']);
    expect(rebuilt.scripts[0]).toMatchObject({ enabled: false, content: 'v2()', data: { over: 'user', fresh: 2, mine: true } });
    expect(rebuilt.scripts[0].data.keep).toBeUndefined();
    expect(rebuilt.scripts[1].scripts.map((x: any) => [x.id, x.enabled])).toEqual([['b', true], ['c', true], ['user-in-folder', true]]);
  });

  it('keeps the user\'s Tavern Helper data in a Carrier when the preset has no scripts', () => {
    const current = { extensions: { tavern_helper: { scripts: [script('user')], variables: { x: 1 } } } };
    expect(th(buildCarrier(petals, resolveConfiguration(petals, 'other', {}), current))).toEqual({ scripts: [script('user')], variables: { x: 1 } });
  });

  describe('reload offer', () => {
    let asked: string[];
    const reload = vi.fn();
    beforeEach(() => {
      asked = [];
      (globalThis as any).TavernHelper = {};
      const ctx = { getPresetManager: () => pm.m, chatCompletionSettings: {}, POPUP_TYPE: { CONFIRM: 2 }, POPUP_RESULT: { AFFIRMATIVE: 1 }, callGenericPopup: async (html: string) => { asked.push(html); return 0; } };
      (globalThis as any).SillyTavern = { getContext: () => ctx };
      vi.stubGlobal('location', { reload });
      vi.stubGlobal('localStorage', { getItem: () => 'en' });
    });
    afterEach(() => { delete (globalThis as any).TavernHelper; vi.unstubAllGlobals(); });

    const install = async (selected: string, before: any[], after: any[]) => {
      pm = manager(selected);
      const v1 = withScripts(before, 'v1');
      await pm.m.savePreset(carrierName(petals), buildCarrier(v1, resolveConfiguration(v1, 'other', {})), { skipUpdate: true });
      await ensureCarrier(withScripts(after));
      await Promise.resolve();
    };

    it('asks to reload when the scripts of the Carrier in use change', async () => {
      await install(carrierName(petals), [script('a')], [script('a', { content: 'v2()' })]);
      expect(asked).toHaveLength(1);
      expect(asked[0]).toContain(carrierName(petals));
    });

    it('does not ask when the Carrier is not in use, or only the preset changed', async () => {
      await install('Default', [script('a')], [script('a', { content: 'v2()' })]);
      await install(carrierName(petals), [script('a')], [script('a')]);
      expect(asked).toEqual([]);
    });

    it('does not ask without Tavern Helper', async () => {
      delete (globalThis as any).TavernHelper;
      await install(carrierName(petals), [], [script('a')]);
      expect(asked).toEqual([]);
    });
  });
});
