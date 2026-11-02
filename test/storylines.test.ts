import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_DEFAULTS, DEFAULT_STORYLINES, cloneData, resolveConfiguration, type APreset, type Configuration } from '@advanced-preset/protocol';
import { STORYLINE_KEY, arrangeLines, arrangeTurn, lineMark, messageLines, placeLines, takeLineMark, takeLineMarks, type PromptMessage } from '@/core/storylines';
import type { ChatMessage, STMessage } from '@/st/host';
import { petals } from './helpers';

// ---- pure parts --------------------------------------------------------------------------------

const u = (mes: string, extra?: Record<string, unknown>) => ({ is_user: true, mes, ...(extra ? { extra } : {}) });
const a = (line?: string) => ({ is_user: false, mes: 'story', ...(line !== undefined ? { extra: { [STORYLINE_KEY]: line } } : {}) });

describe('message storylines', () => {
  it('user tags, stored assistant lines and inheritance', () => {
    expect(messageLines([a(), u('hi #cellar'), a(), u('back'), a('cellar'), { is_user: false, is_system: true, mes: 'note' }, u('x #!B')]))
      .toEqual(['', 'cellar', 'cellar', '', 'cellar', 'cellar', 'B']);
  });

  it('arranges others first, then main, then the current storyline; if-lines only see themselves', () => {
    const keys = ['', 'A', 'A', '', 'ifX', 'ifX', '', 'B', 'B', ''];
    const onMain = arrangeLines(keys, '', {});
    expect(onMain.groups.map((g) => g.key)).toEqual(['A', 'B', '']);
    expect(onMain.order).toEqual([1, 2, 7, 8, 0, 3, 6, 9]);
    expect(onMain.hidden).toBe(2);
    expect(onMain.grouped).toBe(true);
    const onA = arrangeLines(keys, 'A', {});
    expect(onA.groups.map((g) => g.key)).toEqual(['B', '', 'A']);
    expect(onA.order).toEqual([7, 8, 0, 3, 6, 9, 1, 2]);
    const onIf = arrangeLines(keys, 'ifX', {});
    expect(onIf.groups.map((g) => g.key)).toEqual(['A', 'B', '', 'ifX']);
    expect(onIf.hidden).toBe(0);
    // switched off as if-line: visible to everyone
    expect(arrangeLines(keys, '', { if: { ifX: false } }).groups.map((g) => g.key)).toEqual(['A', 'ifX', 'B', '']);
    expect(arrangeLines(['', ''], '', {}).grouped).toBe(false);
    expect(arrangeLines(['', 'N'], 'N', {}, 1).isNew).toBe(true);
    expect(arrangeLines(['N', 'N'], 'N', {}, 1).isNew).toBe(false);
  });

  it('arranges a generation from the real chat and strips the tags', () => {
    const items = [u('one'), a(), u('two #A'), a(), u('three #A')];
    const r = arrangeTurn(items, [0, 1, 2, 3, 4], ['', '', 'A', 'A', 'A'], 4, { main: 'Road' });
    expect(r.items.map((x) => x.mes)).toEqual(['one', 'story', 'two', 'story', 'three']);
    expect(r.turn).toMatchObject({ current: 'A', mainName: 'Road', grouped: true, currentGroup: 1, mainGroup: 0, vars: { name: 'A', main: false, if: false, new: false } });
    expect(r.currentInput).toBe(4);
    const tagMain = arrangeTurn([u('x #Road')], [0], ['', ''], 0, { main: 'Road' });
    expect(tagMain.turn.vars).toEqual({ name: 'Road', main: true, if: false, new: true });
  });

  it('group marks are distinct from cache and input marks', () => {
    expect(takeLineMark(`${lineMark(3)}hello⟦\uE000⟧`)).toEqual({ text: 'hello⟦\uE000⟧', group: 3 });
    expect(takeLineMark('⟦\uDB80\uDC00⟧x').group).toBe(-1);
    const list: PromptMessage[] = [{ role: 'user', content: [{ type: 'text', text: `${lineMark(1)}hi` }] }];
    const marks = takeLineMarks(list);
    expect(marks.get(list[0]!)).toBe(1);
    expect((list[0]!.content as any)[0].text).toBe('hi');
  });
});

describe('placing the storylines in the prompt', () => {
  type M = PromptMessage & { g?: number; id: string };
  const msg = (id: string, g?: number, role = 'user'): M => ({ id, role, content: id, ...(g !== undefined ? { g } : {}) });
  const opts = (current: number, main: number) => ({
    groupOf: (m: M) => m.g ?? -1,
    current, main,
    separator: (g: number) => ({ id: `sep${g}`, role: 'system', content: `sep${g}` }) as M,
    isNudge: (m: M) => m.id === 'nudge',
  });
  const ids = (l: M[]) => l.map((m) => m.id);

  it('on a side story: injections are placed relative to the main storyline', () => {
    // groups: 0 = other side story, 1 = main, 2 = current
    // `d3`: three chat messages before the end of the prompt's history → three before the end of the main storyline
    const list = [msg('top'), msg('start'), msg('o1', 0), msg('m1', 1), msg('m2', 1), msg('d3'), msg('m3', 1), msg('c1', 2), msg('c2', 2), msg('d0'), msg('nudge'), msg('end')];
    const end = placeLines(list, 1, 11, opts(2, 1));
    expect(ids(list)).toEqual(['top', 'start', 'sep0', 'o1', 'sep1', 'd3', 'm1', 'm2', 'm3', 'd0', 'sep2', 'c1', 'c2', 'nudge', 'end']);
    expect(end).toBe(14);
  });

  it('on the main storyline nothing but the separators changes', () => {
    const list = [msg('o1', 0), msg('m1', 1), msg('d1'), msg('m2', 1), msg('d0')];
    placeLines(list, 0, list.length, opts(1, 1));
    expect(ids(list)).toEqual(['sep0', 'o1', 'sep1', 'm1', 'd1', 'm2', 'd0']);
  });

  it('sorts chronological history (script path) and keeps tool calls with their message', () => {
    const tool = { ...msg('call', undefined, 'assistant'), tool_calls: [{}] };
    const list = [msg('m1', 1), msg('c1', 2), tool, msg('result', undefined, 'tool'), msg('o1', 0), msg('m2', 1)];
    placeLines(list, 0, list.length, opts(2, 1));
    expect(ids(list)).toEqual(['sep0', 'o1', 'sep1', 'm1', 'm2', 'sep2', 'c1', 'call', 'result']);
  });
});

// ---- interceptor → ST prompt building → PROMPT_READY ------------------------------------------

const state: { preset: APreset; config: Configuration } = { preset: petals, config: resolveConfiguration(petals, 'other', {}) };
vi.mock('@/store/settings', async (orig) => ({ ...(await orig<object>()), settings: () => ({ enabled: true }) }));
vi.mock('@/store/carrier', () => ({ activeCarrierPresetId: () => state.preset.id }));
vi.mock('@/store/presets', () => ({ getPreset: () => state.preset }));
vi.mock('@/store/config', async (orig) => ({ ...(await orig<object>()), activeConfiguration: () => state.config, presetState: () => ({ userModules: [], globalMemory: { log: [], cursor: 0 } }) }));
vi.mock('@/store/eventlog', async (orig) => ({ ...(await orig<object>()), globalMemory: () => ({}) }));
vi.mock('@/store/user-modules', async (orig) => ({ ...(await orig<object>()), userModules: () => [] }));
vi.mock('@/i18n', async (orig) => ({ ...(await orig<object>()), t: (k: string) => k }));

const { advancedPresetInterceptor } = await import('@/core/interceptor');
const assembler = await import('@/core/assembler');
const { registry } = await import('@/core/context');
const { switchMainStoryline, writeMessageLine } = await import('@/store/storylines');
const { settleTurn } = await import('@/app/variable-guard');

let realChat: STMessage[];
let metadata: Record<string, any>;
let popupAnswer: string | null;
beforeEach(() => {
  realChat = [];
  metadata = {};
  popupAnswer = 'Old';
  const ctx = {
    get chat() { return realChat; }, get chatMetadata() { return metadata; }, name1: 'Me', name2: 'Bot', groupId: null, substituteParams: (s: string) => s,
    chatCompletionSettings: { chat_completion_source: 'claude', claude_model: 'claude-x', send_if_empty: '' }, getCurrentChatId: () => 'chat-1',
    saveSettingsDebounced: () => {}, extensionSettings: {}, saveChat: async () => {}, saveMetadata: async () => {}, updateMessageBlock: () => {},
    POPUP_TYPE: { CONFIRM: 1, INPUT: 3 }, POPUP_RESULT: { AFFIRMATIVE: 1 }, callGenericPopup: async () => popupAnswer,
  };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
});
afterEach(() => { delete (globalThis as any).SillyTavern; registry.setPending(null); registry.takeArmed(); });

/** Petals with storylines; without input shaping unless asked (the input then stays in the history). */
const withStorylines = (shaping = false): APreset => {
  const p: APreset = { ...cloneData(petals), storylines: { ...DEFAULT_STORYLINES } };
  if (!shaping) delete p.inputShaping;
  return p;
};
let n = 0;
const user = (mes: string): STMessage => ({ is_user: true, name: 'Me', mes, send_date: `u${++n}` } as STMessage);
const ai = (mes: string, line?: string, synopsis?: string): STMessage => ({
  is_user: false, name: 'Bot', mes, send_date: `a${++n}`,
  extra: { ...(line !== undefined ? { [STORYLINE_KEY]: line } : {}), ...(synopsis ? { advanced_preset: { v: 1, turn: 'story', structures: { synopsis: { time: 't', location: 'l', event: synopsis, summary: synopsis } } } } : {}) },
} as STMessage);

function stPrompt(preset: APreset, history: STMessage[], o: { depth0?: boolean } = {}): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const r of preset.regions) {
    out.push({ role: 'system', content: `⟦ap:region:${r.id}⟧` });
    if (r.id !== preset.anchors.historyStart) continue;
    for (const m of history) out.push({ role: m.is_user ? 'user' : 'assistant', content: m.mes });
    if (o.depth0) out.push({ role: 'system', content: '[D0 lore]' });
  }
  return out;
}

async function generate(chat: STMessage[], o: { depth0?: boolean; cache?: boolean; tokenSaving?: boolean; type?: string; shaping?: boolean; transport?: string } = {}) {
  const preset = withStorylines(o.shaping);
  state.preset = preset;
  state.config = resolveConfiguration(preset, 'other', { connection: { transport: (o.transport ?? 'structured') as any, workflow: 'linear' } });
  if (o.cache) state.config.cache = { ...CACHE_DEFAULTS, enabled: true };
  if (o.tokenSaving) state.config.tokenSaving = { ...state.config.tokenSaving, enabled: true, keepFullTurns: 99 };
  realChat.splice(0, realChat.length, ...chat);
  const copy = chat.map((m) => ({ ...m }));
  let aborted = false;
  await advancedPresetInterceptor(copy, 0, () => { aborted = true; }, o.type ?? 'normal');
  if (aborted) return { aborted, history: [] as string[], prompt: [] as ChatMessage[], snapshot: null, ctx: null };
  const prompt = stPrompt(preset, copy, o);
  await assembler.onPromptReady({ chat: prompt, dryRun: false });
  const ctx = registry.takeArmed();
  const contents = prompt.map((m) => String(m.content));
  // History: from the first separator / chat message to the D0 lore or the last chat message.
  return { aborted, prompt, contents, snapshot: assembler.lastSnapshot!, ctx, text: JSON.stringify(prompt) };
}

const SEP_MAIN = '<!-- Start of the main storyline -->';
const sep = (name: string) => `<!-- Start of Storyline ${name} -->`;
const pick = (contents: string[], wanted: string[]) => contents.filter((c) => wanted.includes(c));

describe('storylines in a generation', () => {
  it('on a side story: others, main, then the side story last; D0 relative to the main storyline', async () => {
    const chat = [user('m1'), ai('M1'), user('c1 #cellar'), ai('C1', 'cellar'), user('m2'), ai('M2', ''), user('c2 #cellar')];
    const { contents, snapshot, text } = await generate(chat, { depth0: true });
    expect(pick(contents!, ['m1', 'M1', 'c1', 'C1', 'm2', 'M2', 'c2', SEP_MAIN, sep('cellar'), '[D0 lore]']))
      .toEqual([SEP_MAIN, 'm1', 'M1', 'm2', 'M2', '[D0 lore]', sep('cellar'), 'c1', 'C1', 'c2']);
    expect(text).not.toContain('#cellar');
    expect(text).not.toMatch(/\uDB80/);
    expect(snapshot!.storyline).toMatchObject({ name: 'cellar', main: false, if: false, new: false, grouped: true });
  });

  it('on the main storyline: side stories first; if-lines are left out', async () => {
    const chat = [user('m1'), ai('M1'), user('c1 #cellar'), ai('C1', 'cellar'), user('x1 #ifDream'), ai('X1', 'ifDream'), user('m2')];
    const { contents, snapshot } = await generate(chat, { depth0: true });
    expect(pick(contents!, ['m1', 'M1', 'c1', 'C1', 'x1', 'X1', 'm2', SEP_MAIN, sep('cellar'), '[D0 lore]']))
      .toEqual([sep('cellar'), 'c1', 'C1', SEP_MAIN, 'm1', 'M1', 'm2', '[D0 lore]']);
    expect(snapshot!.storyline).toMatchObject({ main: true, hidden: 2 });
  });

  it('an if-line sees the normal storylines and itself; a new storyline is `new`', async () => {
    const chat = [user('m1'), ai('M1'), user('c1 #cellar'), ai('C1', 'cellar'), user('x1 #ifDream')];
    const { contents, snapshot } = await generate(chat);
    expect(pick(contents!, ['m1', 'M1', 'c1', 'C1', 'x1', SEP_MAIN, sep('cellar'), sep('ifDream')]))
      .toEqual([sep('cellar'), 'c1', 'C1', SEP_MAIN, 'm1', 'M1', sep('ifDream'), 'x1']);
    expect(snapshot!.storyline).toMatchObject({ name: 'ifDream', if: true, new: true });
  });

  it('input shaping still finds the input at the end of the side story', async () => {
    const chat = [user('m1'), ai('M1'), user('c1 #cellar'), ai('C1', 'cellar'), user('c2 #cellar')];
    const { contents, snapshot, text } = await generate(chat, { shaping: true, depth0: true });
    expect(snapshot!.input).toMatchObject({ shaped: true });
    expect(text).toContain('c2');
    expect(text).not.toContain('#cellar');
    expect(pick(contents!, ['m1', 'M1', 'c1', 'C1', SEP_MAIN, sep('cellar'), '[D0 lore]'])).toEqual([SEP_MAIN, 'm1', 'M1', '[D0 lore]', sep('cellar'), 'c1', 'C1']);
  });

  it('without side stories nothing changes', async () => {
    const { contents, snapshot } = await generate([user('m1'), ai('M1'), user('m2')]);
    expect(contents).not.toContain(SEP_MAIN);
    expect(snapshot!.storyline).toMatchObject({ main: true, grouped: false });
  });

  it('token saving: other side stories use their synopsis whatever their depth, the main storyline keeps its text', async () => {
    const chat = [user('m1'), ai('M1', '', 'main event'), user('c1 #cellar'), ai('C1', 'cellar', 'cellar event'), user('m2')];
    const { text } = await generate(chat, { tokenSaving: true });
    expect(text).toContain('M1');
    expect(text).not.toContain('"C1"');
    expect(text).toContain('cellar event');
  });

  it('cache optimization keeps a state per storyline', async () => {
    const chat = [user('m1'), ai('M1'), user('c1 #cellar')];
    const side = await generate(chat, { cache: true });
    expect(side.ctx!.cacheCommit!.chat).toBe('chat-1\u0001cellar');
    expect(side.snapshot!.cache?.unmatched).toBe(0);
    const main = await generate([...chat, ai('C1', 'cellar'), user('m2')], { cache: true });
    expect(main.ctx!.cacheCommit!.chat).toBe('chat-1');
  });

  it('`#!name` switches the main storyline first, asking for the old one\'s name', async () => {
    const chat = [user('m1'), ai('M1'), user('c1 #cellar'), ai('C1', 'cellar'), user('go #!cellar')];
    const { contents } = await generate(chat);
    expect(metadata.advanced_preset.storylines.main).toBe('cellar');
    expect(realChat[0]!.mes).toBe('m1 #Old');
    expect(realChat[1]!.extra![STORYLINE_KEY]).toBe('Old');
    expect(pick(contents!, ['m1', 'M1', 'c1', 'C1', 'go', SEP_MAIN, sep('Old')])).toEqual([sep('Old'), 'm1', 'M1', SEP_MAIN, 'c1', 'C1', 'go']);
  });

  it('structures, memory and recap follow the storyline order (I-153)', async () => {
    const sc = (structures: Record<string, unknown>, events: unknown[] = []) => ({ v: 1, turn: 'story', structures, events });
    const st = (loc: string, line: string, events: unknown[] = []) => ({
      is_user: false, name: 'Bot', mes: `story ${loc}`, send_date: `s${++n}`,
      extra: { [STORYLINE_KEY]: line, advanced_preset: sc({ status: { date: 'D1', weekday: 'Mon', time: '9', location: loc, weather: 'sun' } }, events) },
    } as STMessage);
    const mem = (key: string, content: string) => ({ type: 'memory.replace', key, content, source: 'model' });
    const chat = [
      user('m1'), st('Home', '', [mem('where', 'home')]),
      user('c1 #cellar'), st('Cellar', 'cellar', [mem('cellar', 'dusty')]),
      user('x1 #ifDream'), st('Dream', 'ifDream', [mem('where', 'dream'), { type: 'recap.set', text: 'it was a dream', coversUpTo: 1, source: 'model' }]),
    ];
    const memory = (r: { contents?: string[] }) => JSON.parse(r.contents!.find((c) => c.startsWith('<memory>'))!.slice(8, -9));
    const prev = (text: string) => text.match(/<previous_status>\\n(.*?)\\n<\/previous_status>/)?.[1];
    // back on the main storyline: its own last status; the side story's memory, not the if-line's
    const main = await generate([...chat, user('m2')]);
    expect(prev(main.text!)).toBe('D1 Mon 9 | Home | sun');
    expect(memory(main)).toEqual({ where: 'home', cellar: 'dusty' });
    expect(main.text).not.toContain('it was a dream');
    // on the side story after the main storyline went on: the side story's last status
    const side = await generate([...chat, user('m2'), st('Road', ''), user('c2 #cellar')]);
    expect(prev(side.text!)).toBe('D1 Mon 9 | Cellar | sun');
    // plaintext: the status echoed in the history is the side story's
    const plain = await generate([...chat, user('m2'), st('Road', ''), user('c2 #cellar')], { transport: 'plaintext' });
    expect(plain.text).toContain('Cellar');
    expect(plain.text).not.toMatch(/\| Road \|/);
    // the if-line sees its own memory last
    const dream = await generate([...chat, user('x2 #ifDream')]);
    expect(memory(dream)).toEqual({ where: 'dream', cellar: 'dusty' });
    expect(dream.text).toContain('it was a dream');
    expect(prev(dream.text!)).toBe('D1 Mon 9 | Dream | sun');
  });

  it('a turn on a side story leaves the chat variables as they were (I-154)', async () => {
    metadata.variables = { stat_data: { hp: 10 } };
    await generate([user('m1'), ai('M1'), user('c1 #cellar')]);
    metadata.variables = { stat_data: { hp: 1 } };
    expect(await settleTurn()).toBe(true);
    expect(metadata.variables).toEqual({ stat_data: { hp: 10 } });
    await generate([user('m1'), ai('M1'), user('m2')]);
    metadata.variables = { stat_data: { hp: 1 } };
    expect(await settleTurn()).toBe(false);
  });

  it('cancelling the name aborts the generation and changes nothing', async () => {
    popupAnswer = null;
    const chat = [user('m1'), ai('M1'), user('go #!B')];
    const r = await generate(chat);
    expect(r.aborted).toBe(true);
    expect(realChat[0]!.mes).toBe('m1');
    expect(metadata.advanced_preset?.storylines?.main).toBeUndefined();
  });
});

describe('storyline data', () => {
  it('switching the main storyline tags the old main storyline, swipes included', async () => {
    realChat.splice(0, realChat.length,
      ai('greeting'),
      user('m1'),
      { ...ai('M1'), swipe_id: 1, swipes: ['M0', 'M1'], swipe_info: [{ extra: {} }, { extra: {} }] } as STMessage,
      user('c1 #B'),
      ai('C1', 'B'),
    );
    expect(await switchMainStoryline('B')).toBe('needs-name');
    expect(await switchMainStoryline('B', 'B')).toBe('invalid');
    expect(await switchMainStoryline('B', 'Road')).toBe('switched');
    expect(realChat.map((m) => m.mes)).toEqual(['greeting', 'm1 #Road', 'M1', 'c1 #B', 'C1']);
    expect(realChat[0]!.extra![STORYLINE_KEY]).toBe('Road');
    expect(realChat[2]!.swipe_info!.map((s) => s.extra![STORYLINE_KEY])).toEqual(['Road', 'Road']);
    expect(metadata.advanced_preset.storylines).toEqual({ main: 'B', if: {} });
    expect(await switchMainStoryline('B')).toBe('unchanged');
    // Back again: the named main storyline needs no question; `Road` messages become main.
    expect(await switchMainStoryline('Road')).toBe('switched');
    expect(realChat.map((m) => m.mes)).toEqual(['greeting', 'm1 #Road', 'M1', 'c1 #B', 'C1']);
    expect(metadata.advanced_preset.storylines.main).toBe('Road');
  });

  it('an old main storyline named like an if-line stays visible', async () => {
    realChat.splice(0, realChat.length, user('m1'));
    expect(await switchMainStoryline('B', 'ifOld')).toBe('switched');
    expect(metadata.advanced_preset.storylines.if).toEqual({ ifOld: false });
  });

  it('writes the storyline of the current swipe', () => {
    realChat.splice(0, realChat.length, { ...ai('x'), swipe_id: 0, swipes: ['x'], swipe_info: [{}] } as STMessage);
    writeMessageLine(0, 'cellar');
    expect(realChat[0]!.extra![STORYLINE_KEY]).toBe('cellar');
    expect(realChat[0]!.swipe_info![0]!.extra![STORYLINE_KEY]).toBe('cellar');
  });
});
