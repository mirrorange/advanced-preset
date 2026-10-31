import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_DEFAULTS, cloneData, resolveConfiguration, type APreset, type Configuration } from '@advanced-preset/protocol';
import { INPUT_MARK, INPUT_SLOT, applyInput, inputText, locateInput, markInput, stripInputMarks } from '@/core/input-shaping';
import { markerOf } from '@/core/cache';
import { stripMarkers } from '@/core/sticky';
import type { ChatMessage, STMessage } from '@/st/host';
import { petals } from './helpers';

// ---- stores the interceptor / PROMPT_READY read ------------------------------------------------
const state: { preset: APreset; config: Configuration } = { preset: petals, config: resolveConfiguration(petals, 'other', {}) };
vi.mock('@/store/settings', async (orig) => ({ ...(await orig<object>()), settings: () => ({ enabled: true }) }));
vi.mock('@/store/carrier', () => ({ activeCarrierPresetId: () => state.preset.id }));
vi.mock('@/store/presets', () => ({ getPreset: () => state.preset }));
vi.mock('@/store/config', async (orig) => ({ ...(await orig<object>()), activeConfiguration: () => state.config, presetState: () => ({ userModules: [], globalMemory: { log: [], cursor: 0 } }) }));
vi.mock('@/store/eventlog', async (orig) => ({ ...(await orig<object>()), chatMemory: () => ({}), globalMemory: () => ({}), currentRecap: () => null }));
vi.mock('@/store/user-modules', async (orig) => ({ ...(await orig<object>()), userModules: () => [] }));

const { advancedPresetInterceptor } = await import('@/core/interceptor');
const assembler = await import('@/core/assembler');
const { onPromptReady } = assembler;
const { registry } = await import('@/core/context');

let realChat: STMessage[];
beforeEach(() => {
  realChat = [];
  (globalThis as any).SillyTavern = {
    getContext: () => ({
      chat: realChat, name1: 'Me', name2: 'Bot', groupId: null, substituteParams: (s: string) => s,
      chatCompletionSettings: { chat_completion_source: 'claude', claude_model: 'claude-x' }, getCurrentChatId: () => 'chat-1',
      saveSettingsDebounced: () => {}, extensionSettings: {},
    }),
  };
});
afterEach(() => { delete (globalThis as any).SillyTavern; registry.setPending(null); registry.takeArmed(); });

const withShaping = (mode: 'wrap' | 'extract', template = '<input>\n{{content}}\n</input>'): APreset => ({ ...cloneData(petals), inputShaping: { mode, template } });

describe('input marks', () => {
  it('goes before trailing cache markers and is removed again', () => {
    const marked = markInput(`hello${markerOf(3)}`);
    expect(marked).toBe(`hello${INPUT_MARK}${markerOf(3)}`);
    expect(inputText(marked)).toBe('hello');
    const list: ChatMessage[] = [{ role: 'user', content: marked }, { role: 'user', content: [{ type: 'text', text: `x${INPUT_MARK}` }] as any }];
    stripInputMarks(list);
    stripMarkers(list);
    expect(list[0]!.content).toBe('hello');
    expect((list[1]!.content as any)[0].text).toBe('x');
  });

  it('cache markers stay distinct from the input mark', () => {
    const list: ChatMessage[] = [{ role: 'user', content: markInput(`a${markerOf(0)}`) }];
    stripMarkers(list);
    expect(list[0]!.content).toBe(`a${INPUT_MARK}`);
  });
});

describe('locating and shaping the input', () => {
  const hist = (): ChatMessage[] => [
    { role: 'system', content: 'sys' },
    { role: 'assistant', content: 'Bot: story' },
    { role: 'user', content: `Me: hi there${INPUT_MARK}` },
    { role: 'system', content: '[depth 0 note]' },
    { role: 'system', content: 'after history' },
  ];

  it('finds the marked message behind depth injections, with a name prefix', () => {
    const loc = locateInput(hist(), 1, 4, ['hi there']);
    expect(loc).toEqual({ index: 2, part: -1, before: 'Me: ', text: 'hi there', after: '' });
    expect(locateInput(hist(), 1, 2, ['hi there'])).toBeNull();
    expect(locateInput(hist(), 1, 4, ['something else'])).toBeNull();
  });

  it('picks the longest matching rendering and ignores \\r', () => {
    const list: ChatMessage[] = [{ role: 'user', content: `a\nb c${INPUT_MARK}` }];
    expect(locateInput(list, 0, 1, ['c', 'b c', 'a\r\nb c'])!.text).toBe('a\nb c');
  });

  it('wrap replaces the text in place, expanding the template but not the input', () => {
    const list = hist();
    const loc = locateInput(list, 1, 4, ['hi there {{user}}'.replace(' {{user}}', '')])!;
    applyInput(list, loc, { mode: 'wrap', template: '<input from="{{user}}">\n{{content}}\n</input>' }, (s) => s.replaceAll('{{user}}', 'Me'));
    expect(list[2]!.content).toBe('Me: <input from="Me">\nhi there\n</input>');
    stripInputMarks(list);
    expect(JSON.stringify(list)).not.toContain(INPUT_MARK);
  });

  it('wrap keeps macros the user wrote literally', () => {
    const list: ChatMessage[] = [{ role: 'user', content: `say {{char}}${INPUT_MARK}` }];
    applyInput(list, locateInput(list, 0, 1, ['say {{char}}'])!, { mode: 'wrap', template: '[{{content}}]' }, (s) => s.replaceAll('{{char}}', 'Bot'));
    expect(list[0]!.content).toBe('[say {{char}}]');
  });

  it('extract drops the message when only the name prefix is left', () => {
    const list = hist();
    applyInput(list, locateInput(list, 1, 4, ['hi there'])!, { mode: 'extract', template: '' }, (s) => s);
    expect(list.map((m) => m.content)).toEqual(['sys', 'Bot: story', '[depth 0 note]', 'after history']);
  });

  it('extract keeps whatever else the message carries', () => {
    const list: ChatMessage[] = [{ role: 'user', content: `note\n\nhi${INPUT_MARK}` }];
    applyInput(list, locateInput(list, 0, 1, ['hi'])!, { mode: 'extract', template: '' }, (s) => s);
    expect(list[0]!.content).toBe('note');
  });

  it('array content: wraps / removes the text part, keeps images', () => {
    const img = { type: 'image_url', image_url: { url: 'data:x' } };
    const a: ChatMessage[] = [{ role: 'user', content: [{ type: 'text', text: `hi${INPUT_MARK}` }, img] as any }];
    applyInput(a, locateInput(a, 0, 1, ['hi'])!, { mode: 'wrap', template: '<i>{{content}}</i>' }, (s) => s);
    expect((a[0]!.content as any)[0].text).toBe('<i>hi</i>');
    const b: ChatMessage[] = [{ role: 'user', content: [{ type: 'text', text: `hi${INPUT_MARK}` }, img] as any }];
    applyInput(b, locateInput(b, 0, 1, ['hi'])!, { mode: 'extract', template: '' }, (s) => s);
    expect(b[0]!.content).toEqual([img]);
    const c: ChatMessage[] = [{ role: 'user', content: [{ type: 'text', text: `hi${INPUT_MARK}` }] as any }];
    applyInput(c, locateInput(c, 0, 1, ['hi'])!, { mode: 'extract', template: '' }, (s) => s);
    expect(c).toEqual([]);
  });
});

// ---- interceptor → ST prompt building → PROMPT_READY ------------------------------------------

const user = (n: number, mes = `input ${n}`): STMessage => ({ is_user: true, name: 'Me', mes, send_date: `u${n}` } as STMessage);
const ai = (n: number): STMessage => ({ is_user: false, name: 'Bot', mes: `story ${n}`, send_date: `a${n}` } as STMessage);

/** ST's side: the carrier's anchors in order, the (rewritten) history between them, a depth-0 injection. */
function stPrompt(preset: APreset, history: STMessage[], o: { depth0?: boolean; quiet?: string } = {}): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const r of preset.regions) {
    out.push({ role: 'system', content: `⟦ap:region:${r.id}⟧` });
    if (r.id !== preset.anchors.historyStart) continue;
    for (const m of history) out.push({ role: m.is_user ? 'user' : 'assistant', content: m.mes });
    // ST inserts depth-0 injections after the last chat message.
    if (o.depth0) out.push({ role: 'system', content: '[D0 lore after]' });
    if (o.quiet) out.push({ role: 'user', content: o.quiet });
  }
  return out;
}

async function generate(preset: APreset, chat: STMessage[], type = 'normal', o: { depth0?: boolean; quiet?: string; cache?: boolean } = {}) {
  state.preset = preset;
  state.config = resolveConfiguration(preset, 'other', { connection: { transport: 'structured', workflow: 'linear' } });
  if (o.cache) state.config.cache = { ...CACHE_DEFAULTS, enabled: true };
  realChat.splice(0, realChat.length, ...chat);
  const copy = chat.map((m) => ({ ...m }));
  if (type === 'swipe' || type === 'regenerate') copy.pop();
  await advancedPresetInterceptor(copy, 0, () => {}, type);
  const prompt = stPrompt(preset, copy, o);
  await onPromptReady({ chat: prompt, dryRun: false });
  return { prompt, snapshot: assembler.lastSnapshot!, text: JSON.stringify(prompt) };
}

describe('input shaping in a generation', () => {
  it('wrap: the last user message is wrapped in the history, input.shaped is set', async () => {
    const { prompt, snapshot, text } = await generate(withShaping('wrap'), [user(1), ai(1), user(2, 'go north')], 'normal', { depth0: true });
    expect(prompt.some((m) => m.content === '<input>\ngo north\n</input>')).toBe(true);
    expect(prompt.some((m) => m.content === 'input 1')).toBe(true);
    expect(prompt.some((m) => m.content === '[D0 lore after]')).toBe(true);
    expect(snapshot.input).toEqual({ mode: 'wrap', shaped: true, chars: 'go north'.length });
    expect(text).not.toContain(INPUT_MARK);
    expect(text).not.toContain(INPUT_SLOT);
  });

  it('extract: the input leaves the history', async () => {
    const { prompt, snapshot } = await generate(withShaping('extract'), [user(1), ai(1), user(2, 'go north')], 'normal', { depth0: true });
    expect(prompt.some((m) => m.role === 'user' && m.content === 'go north')).toBe(false);
    expect(prompt.some((m) => m.content === 'input 1')).toBe(true);
    expect(prompt.some((m) => m.content === '[D0 lore after]')).toBe(true);
    expect(snapshot.input?.shaped).toBe(true);
  });

  it('a history ending with the assistant (continue) is not shaped', async () => {
    const { snapshot, text } = await generate(withShaping('wrap'), [user(1), ai(1)], 'continue');
    expect(snapshot.input?.shaped).toBe(false);
    expect(text).not.toContain('<input>');
    expect(text).not.toContain(INPUT_MARK);
  });

  it('swipe / regenerate shape the user message the history ends with again', async () => {
    const { prompt } = await generate(withShaping('wrap'), [user(1), ai(1), user(2, 'go north'), ai(2)], 'swipe');
    expect(prompt.some((m) => m.content === '<input>\ngo north\n</input>')).toBe(true);
  });

  it('presets without inputShaping are untouched', async () => {
    const plain = cloneData(petals);
    delete plain.inputShaping;
    const { prompt, snapshot, text } = await generate(plain, [user(1), ai(1), user(2, 'go north')]);
    expect(prompt.some((m) => m.content === 'go north')).toBe(true);
    expect(snapshot.input).toBeUndefined();
    expect(text).not.toContain(INPUT_MARK);
  });

  it('works with the cache optimization (marker swap keeps the input mark)', async () => {
    const { prompt, snapshot, text } = await generate(withShaping('wrap'), [user(1), ai(1), user(2, 'go north')], 'normal', { cache: true, depth0: true });
    expect(prompt.some((m) => m.content === '<input>\ngo north\n</input>')).toBe(true);
    expect(snapshot.input?.shaped).toBe(true);
    expect(snapshot.cache?.unmatched).toBe(0);
    expect(text).not.toMatch(/⟦[\uE000-\uF8FF]⟧/);
    expect(text).not.toContain(INPUT_MARK);
  });

  it('a quiet prompt after the input does not prevent shaping', async () => {
    const { prompt } = await generate(withShaping('wrap'), [user(1), ai(1), user(2, 'go north')], 'quiet', { quiet: 'Summarize.' });
    expect(prompt.some((m) => m.content === '<input>\ngo north\n</input>')).toBe(true);
    expect(prompt.some((m) => m.content === 'Summarize.')).toBe(true);
  });

  it('script path (no interceptor): backfill marks the chat-ending user message', async () => {
    const preset = withShaping('wrap');
    state.preset = preset;
    state.config = resolveConfiguration(preset, 'other', { connection: { transport: 'structured', workflow: 'linear' } });
    realChat.splice(0, realChat.length, user(1), ai(1), user(2, 'go north'));
    const prompt = stPrompt(preset, realChat.map((m) => ({ ...m })), { depth0: true });
    await onPromptReady({ chat: prompt, dryRun: false });
    expect(prompt.some((m) => m.content === '<input>\ngo north\n</input>')).toBe(true);
    expect(assembler.lastSnapshot!.input?.shaped).toBe(true);
  });

  it('script path: a user prompt the script added after the chat blocks shaping', async () => {
    const preset = withShaping('wrap');
    state.preset = preset;
    state.config = resolveConfiguration(preset, 'other', { connection: { transport: 'structured', workflow: 'linear' } });
    realChat.splice(0, realChat.length, user(1), ai(1), user(2, 'go north'));
    const prompt = stPrompt(preset, realChat.map((m) => ({ ...m })), { quiet: 'Write a title.' });
    await onPromptReady({ chat: prompt, dryRun: false });
    expect(JSON.stringify(prompt)).not.toContain('<input>');
    expect(assembler.lastSnapshot!.input?.shaped).toBe(false);
  });

  it('dry runs (token counting) are not shaped', async () => {
    const preset = withShaping('wrap');
    state.preset = preset;
    realChat.splice(0, realChat.length, user(1), ai(1), user(2, 'go north'));
    const prompt = stPrompt(preset, realChat.map((m) => ({ ...m })));
    await onPromptReady({ chat: prompt, dryRun: true });
    expect(JSON.stringify(prompt)).not.toContain('<input>');
  });
});

describe('Petals: the input moves to the input region', () => {
  it('extracts the input from the history and places it in <input> between memory and questions', async () => {
    expect(petals.inputShaping?.mode).toBe('extract');
    const { prompt, snapshot } = await generate(petals, [user(1), ai(1), user(2, 'go north')], 'normal', { depth0: true });
    const region = snapshot.regions.find((r) => r.id === 'input')!;
    expect(region.messages).toEqual([{ role: 'user', chars: '<input>\ngo north\n</input>'.length, content: '<input>\ngo north\n</input>' }]);
    const at = (c: string) => prompt.findIndex((m) => m.content === c);
    expect(prompt.filter((m) => typeof m.content === 'string' && m.content.includes('go north'))).toHaveLength(1);
    expect(at('[D0 lore after]')).toBeLessThan(at('<input>\ngo north\n</input>'));
    const order = snapshot.regions.map((r) => r.id);
    expect(order.indexOf('memory')).toBeLessThan(order.indexOf('input'));
    expect(order.indexOf('input')).toBeLessThan(order.indexOf('questions'));
  });

  it('continue leaves the history alone and the input region empty', async () => {
    const { snapshot, prompt } = await generate(petals, [user(1), ai(1)], 'continue');
    expect(snapshot.regions.find((r) => r.id === 'input')!.messages).toEqual([]);
    expect(prompt.some((m) => m.content === 'input 1')).toBe(true);
  });

  it('prefill: the input appears once, in <input> after the history', async () => {
    state.preset = petals;
    const { text } = await (async () => {
      state.config = resolveConfiguration(petals, 'other', { connection: { transport: 'prefill', workflow: 'linear' } });
      realChat.splice(0, realChat.length, user(1), ai(1), user(2, 'go north'));
      const copy = realChat.map((m) => ({ ...m }));
      await advancedPresetInterceptor(copy, 0, () => {}, 'normal');
      const prompt = stPrompt(petals, copy);
      await onPromptReady({ chat: prompt, dryRun: false });
      return { text: JSON.stringify(prompt) };
    })();
    expect(text.split('go north')).toHaveLength(2);
    expect(text).toContain('<input>\\ngo north\\n</input>');
    expect(text).not.toContain(INPUT_SLOT);
  });

  it('a Carrier without the input anchor: the input stays in the history (never lost)', async () => {
    state.preset = petals;
    state.config = resolveConfiguration(petals, 'other', { connection: { transport: 'structured', workflow: 'linear' } });
    realChat.splice(0, realChat.length, user(1), ai(1), user(2, 'go north'));
    const copy = realChat.map((m) => ({ ...m }));
    await advancedPresetInterceptor(copy, 0, () => {}, 'normal');
    const prompt = stPrompt(petals, copy).filter((m) => m.content !== '⟦ap:region:input⟧');
    await onPromptReady({ chat: prompt, dryRun: false });
    const snap = assembler.lastSnapshot!;
    expect(prompt.some((m) => m.role === 'user' && m.content === 'go north')).toBe(true);
    expect(JSON.stringify(prompt)).not.toContain(INPUT_SLOT);
    expect(JSON.stringify(prompt)).not.toContain(INPUT_MARK);
    expect(snap.input?.shaped).toBe(false);
    expect(snap.warnings.some((w) => w.startsWith('region input: its anchor is not in the prompt'))).toBe(true);
    expect(snap.warnings.some((w) => w.includes('{{ap::input::text}} is not in the prompt'))).toBe(true);
  });
});
