import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { APreset, Configuration } from '@advanced-preset/protocol';
import { CONNECTION_DEFAULTS, configurationShape, pruneDiff } from '@advanced-preset/protocol';

const gen = vi.hoisted(() => ({ available: true }));
vi.mock('@/st/host', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/st/host')>();
  /** Stand-in for ST's createGenerationParameters: source-specific fields like ST's. */
  const generationParameters = vi.fn(async (s: Record<string, any>, model: string, type: string) => {
    if (!gen.available) return null;
    const src = s.chat_completion_source;
    return {
      type, messages: [], model, stream: true, tools: [{ st: true }],
      chat_completion_source: src,
      temperature: s.temp_openai,
      custom_prompt_post_processing: s.custom_prompt_post_processing,
      reasoning_effort: model.includes('mini') ? undefined : 'high',
      ...(src === 'claude' ? { top_k: s.top_k_openai, use_sysprompt: s.use_sysprompt } : {}),
      ...(src === 'custom' ? { custom_url: s.custom_url, custom_include_body: s.custom_include_body } : {}),
      ...(s.reverse_proxy ? { reverse_proxy: s.reverse_proxy, proxy_password: s.proxy_password } : {}),
    };
  });
  return { ...real, generationParameters, proxyPreset: (name: string) => (name === 'Mine' ? { name, url: 'https://proxy.example/v1', password: 'pw' } : undefined) };
});

const { applyTarget, bindingById, bindingCapabilityError, bindingForActor, listBindings, multiModelOn, selectedBinding, withBinding, BindingError } = await import('@/core/bindings');

const live = {
  chat_completion_source: 'custom', custom_url: 'http://local/v1', custom_include_body: 'x: 1', custom_model: 'local-model', claude_model: 'claude-x',
  temp_openai: 0.7, top_k_openai: 40, use_sysprompt: true, custom_prompt_post_processing: '', reverse_proxy: '', proxy_password: '', function_calling: true,
};
const profiles = [
  { id: 'p-claude', name: 'Claude', mode: 'cc', api: 'claude', model: 'claude-big', proxy: 'Mine', 'secret-id': 'sec-1', 'prompt-post-processing': 'merge' },
  { id: 'p-nomodel', name: 'Bare', mode: 'cc', api: 'claude' },
  { id: 'p-text', name: 'Kobold', mode: 'tc', api: 'koboldcpp' },
  { id: 'p-snap', name: 'Snap', mode: 'cc', api: 'custom', 'custom-connection': { version: 1 } },
];
const CONNECT_API_MAP: Record<string, { selected: string; source?: string; type?: string }> = {
  claude: { selected: 'openai', source: 'claude' }, custom: { selected: 'openai', source: 'custom' }, koboldcpp: { selected: 'textgenerationwebui', type: 'koboldcpp' },
};
const isToolCallingSupported = vi.fn((s: Record<string, any>, model?: string | null) => !String(model ?? s.custom_model).includes('notools'));

beforeEach(() => {
  gen.available = true;
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  (globalThis as any).SillyTavern = { getContext: () => ({
    mainApi: 'openai', chatCompletionSettings: live, isToolCallingSupported, CONNECT_API_MAP,
    extensionSettings: { disabledExtensions: [], connectionManager: { profiles } },
  }) };
});
afterEach(() => { delete (globalThis as any).SillyTavern; vi.unstubAllGlobals(); });

const conn = (extra: Record<string, unknown> = {}) => ({ ...CONNECTION_DEFAULTS, workflow: 'linear', syntheticTurn: null, ...extra });
const config = (c: Record<string, unknown> = {}, multiModel?: Configuration['multiModel']) => ({ connection: conn(c), ...(multiModel ? { multiModel } : {}) }) as unknown as Configuration;
const preset = (mm: boolean) => (mm ? { multiModel: {} } : {}) as unknown as APreset;
const BINDINGS = { fast: { name: 'Fast', target: { type: 'model', model: 'mini-1' }, transport: 'prefill' }, big: { name: 'Big', target: { type: 'profile', profile: 'p-claude' }, transport: 'tool-multi', maxSteps: 3 } };

describe('binding resolution', () => {
  it('has the connection itself as the default binding, first', () => {
    const all = listBindings(config({ transport: 'tool-single', bindings: BINDINGS }));
    expect(all.map((b) => b.id)).toEqual(['default', 'fast', 'big']);
    expect(all[0]).toMatchObject({ id: 'default', target: { type: 'current' }, transport: 'tool-single' });
    // missing transport fields come from the default binding
    expect(all[1]).toMatchObject({ name: 'Fast', transport: 'prefill', forceTool: true, maxSteps: 6 });
    expect(all[2]).toMatchObject({ transport: 'tool-multi', maxSteps: 3 });
  });

  it('configurations from before 1.13 are the default binding on the current connection', () => {
    const c = config({ transport: 'structured' });
    expect(selectedBinding(c)).toMatchObject({ id: 'default', target: { type: 'current' }, transport: 'structured' });
    expect(withBinding(c, selectedBinding(c))).toBe(c);
  });

  it('falls back to the default binding for unknown ids, with a warning', () => {
    const warnings: string[] = [];
    expect(bindingById(config({ bindings: BINDINGS }), 'gone', warnings).id).toBe('default');
    expect(warnings[0]).toMatch(/gone/);
    expect(bindingById(config(), undefined).id).toBe('default');
  });

  it('runs every actor on the selected binding unless multi-model is on', () => {
    const c = config({ bindings: BINDINGS, binding: 'fast' }, { enabled: true, actors: { critic: 'big' } });
    expect(multiModelOn(preset(false), c)).toBe(false);
    expect(bindingForActor(preset(false), c, 'critic').id).toBe('fast');
    expect(multiModelOn(preset(true), c)).toBe(true);
    expect(bindingForActor(preset(true), c, 'critic').id).toBe('big');
    expect(bindingForActor(preset(true), c, 'narrator').id).toBe('default');
    const off = config({ bindings: BINDINGS, binding: 'fast' }, { enabled: false, actors: { critic: 'big' } });
    expect(bindingForActor(preset(true), off, 'critic').id).toBe('fast');
  });

  it('puts a binding\'s transport settings into the connection', () => {
    const c = config({ bindings: BINDINGS, binding: 'big' });
    const w = withBinding(c, selectedBinding(c));
    expect(w.connection).toMatchObject({ transport: 'tool-multi', maxSteps: 3, workflow: 'linear', bindings: BINDINGS });
    expect(c.connection.transport).toBe('structured');
  });
});

describe('applyTarget', () => {
  const base = () => ({
    type: 'normal', messages: [{ role: 'user', content: 'hi' }], tools: [{ ap: true }], stream: true, model: 'local-model',
    chat_completion_source: 'custom', custom_url: 'http://local/v1', custom_include_body: 'x: 1', temperature: 0.7, reasoning_effort: 'high',
    custom_prompt_post_processing: '', ap_extra: 1,
  });

  it('leaves the body alone for the current connection (same object)', async () => {
    const b = base();
    expect(await applyTarget(b, { type: 'current' })).toBe(b);
  });

  it('replaces the model, with ST\'s model-dependent fields', async () => {
    const out = await applyTarget(base(), { type: 'model', model: 'mini-2' });
    expect(out.model).toBe('mini-2');
    expect('reasoning_effort' in out).toBe(false);
    expect(out).toMatchObject({ chat_completion_source: 'custom', custom_url: 'http://local/v1', messages: base().messages, tools: [{ ap: true }], ap_extra: 1 });
    await expect(applyTarget(base(), { type: 'model', model: ' ' })).rejects.toBeInstanceOf(BindingError);
  });

  it('switches source, model, endpoint, proxy, key and post-processing to a profile\'s', async () => {
    const out = await applyTarget(base(), { type: 'profile', profile: 'p-claude' });
    expect(out).toMatchObject({
      chat_completion_source: 'claude', model: 'claude-big', top_k: 40, use_sysprompt: true,
      reverse_proxy: 'https://proxy.example/v1', proxy_password: 'pw', secret_id: 'sec-1', custom_prompt_post_processing: 'merge',
      // AP's prompt, tools and streaming stay; sampling stays
      messages: base().messages, tools: [{ ap: true }], stream: true, temperature: 0.7, ap_extra: 1,
    });
    expect('custom_url' in out).toBe(false);
    expect('custom_include_body' in out).toBe(false);
  });

  it('uses the model ST stores for the profile\'s source when the profile has none', async () => {
    const out = await applyTarget(base(), { type: 'profile', profile: 'p-nomodel' });
    expect(out).toMatchObject({ chat_completion_source: 'claude', model: 'claude-x' });
  });

  it('rejects missing, Text Completion and stored Custom connection profiles', async () => {
    await expect(applyTarget(base(), { type: 'profile', profile: 'nope' })).rejects.toThrow(/no longer exists/);
    await expect(applyTarget(base(), { type: 'profile', profile: 'p-text' })).rejects.toThrow(/not a Chat Completion profile/);
    await expect(applyTarget(base(), { type: 'profile', profile: 'p-snap' })).rejects.toThrow(/Custom connection/);
  });

  it('sets the connection fields itself without ST\'s body builder', async () => {
    gen.available = false;
    const out = await applyTarget(base(), { type: 'profile', profile: 'p-claude' });
    expect(out).toMatchObject({ chat_completion_source: 'claude', model: 'claude-big', reverse_proxy: 'https://proxy.example/v1', secret_id: 'sec-1', custom_prompt_post_processing: 'merge', tools: [{ ap: true }] });
  });
});

describe('bindingCapabilityError', () => {
  it('checks the source / model / post-processing of the body the binding sends', () => {
    const [def, , big] = listBindings(config({ transport: 'tool-single', bindings: BINDINGS }));
    expect(bindingCapabilityError(def!, {})).toBeNull();
    expect(bindingCapabilityError(big!, { chat_completion_source: 'claude', model: 'claude-big', custom_prompt_post_processing: 'merge' })).toMatch(/removes tool calls/);
    expect(bindingCapabilityError(big!, { chat_completion_source: 'claude', model: 'notools-1', custom_prompt_post_processing: '' })).toMatch(/claude \/ notools-1/);
    expect(bindingCapabilityError({ ...big!, assumeToolSupport: true }, { chat_completion_source: 'claude', model: 'notools-1' })).toBeNull();
    expect(bindingCapabilityError(listBindings(config({ bindings: BINDINGS }))[1]!, {})).toBeNull(); // prefill
  });
});

describe('stored diffs', () => {
  it('keep bindings, the selected binding, the default target and actor mappings', () => {
    const p = { configurationDefaults: { connection: conn(), sampling: {}, multiModel: { enabled: false, actors: {} } } } as unknown as APreset;
    const diff = { connection: { target: { type: 'model', model: 'm' }, bindings: { fast: BINDINGS.fast }, binding: 'fast', bogus: 1 }, multiModel: { enabled: true, actors: { critic: 'fast' } } };
    expect(pruneDiff(diff, configurationShape(p))).toEqual(['connection.bogus']);
    expect(diff).toEqual({ connection: { target: { type: 'model', model: 'm' }, bindings: { fast: BINDINGS.fast }, binding: 'fast' }, multiModel: { enabled: true, actors: { critic: 'fast' } } });
    // without the declaration, multiModel is not a configuration key
    const plain = { configurationDefaults: { connection: conn() } } as unknown as APreset;
    expect(pruneDiff({ multiModel: { enabled: true } }, configurationShape(plain))).toEqual(['multiModel']);
  });
});
