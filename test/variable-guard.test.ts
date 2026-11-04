import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_STORYLINES, cloneData, resolveConfiguration, type APreset, type Configuration } from '@advanced-preset/protocol';
import { STORYLINE_KEY } from '@/core/storylines';
import type { STMessage } from '@/st/host';
import { petals } from './helpers';

const preset: APreset = { ...cloneData(petals), storylines: { ...DEFAULT_STORYLINES } };
const state: { config: Configuration } = { config: resolveConfiguration(preset, 'other', {}) };
vi.mock('@/store/carrier', () => ({ activeCarrierPresetId: () => 'petals' }));
vi.mock('@/store/presets', () => ({ getPreset: () => preset }));
vi.mock('@/store/config', async (orig) => ({ ...(await orig<object>()), activeConfiguration: () => state.config }));

const { beginTurn, lineOfText, onMvuCommandsParsed, onMvuUpdateEnded, settleTurn, dropTurn } = await import('@/app/variable-guard');

type Msg = STMessage & { variables?: Record<string, unknown>[] };
let chat: Msg[];
let metadata: Record<string, any>;
const saved = { chat: 0, meta: 0 };
beforeEach(() => {
  chat = [];
  metadata = {};
  saved.chat = saved.meta = 0;
  state.config = resolveConfiguration(preset, 'other', {});
  const ctx = {
    get chat() { return chat; }, get chatMetadata() { return metadata; }, getCurrentChatId: () => 'c1',
    saveChat: async () => { saved.chat++; }, saveMetadata: async () => { saved.meta++; },
  };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
});
afterEach(() => { dropTurn(); delete (globalThis as any).SillyTavern; });

const stat = (hp: number, extra: Record<string, unknown> = {}) => ({ stat_data: { hp }, ...extra });
const user = (mes: string, vars?: object): Msg => ({ is_user: true, name: 'Me', mes, ...(vars ? { variables: [vars], swipe_id: 0 } : {}) } as Msg);
const ai = (mes: string, line: string, vars?: object): Msg => ({ is_user: false, name: 'Bot', mes, extra: { [STORYLINE_KEY]: line }, ...(vars ? { variables: [vars], swipe_id: 0 } : {}) } as Msg);

describe('MVU on other storylines', () => {
  const mvuUpdate = (content: string, variables: Record<string, any>, commands: unknown[]) => {
    const before = cloneData(variables);
    onMvuCommandsParsed(variables, commands, content);
    for (const c of commands as { hp: number }[]) variables.stat_data.hp = c.hp; // what MVU would do
    onMvuUpdateEnded(variables, before);
    return variables;
  };

  it('finds the storyline of the text MVU parses', () => {
    chat = [user('m1'), ai('M1 <UpdateVariable>', ''), user('c1 #cellar'), ai('C1 <UpdateVariable>', 'cellar')];
    expect(lineOfText('C1 <UpdateVariable>')).toBe('cellar');
    expect(lineOfText('c1 #cellar')).toBe('cellar');
    expect(lineOfText('M1 <UpdateVariable>')).toBe('');
    expect(lineOfText('something else')).toBeNull();
  });

  it('messages of the running turn belong to its storyline before their data is written (I-159)', () => {
    // `#!?`: the reply has no storyline yet (it follows the input), but the turn makes it the main storyline
    chat = [user('m1'), ai('M1 x', ''), user('new #!?'), { is_user: false, name: 'Bot', mes: 'N1 hp=5', extra: {} } as Msg];
    expect(lineOfText('N1 hp=5')).toBe('?');
    beginTurn({ line: '', frozen: false, from: 2 });
    expect(lineOfText('N1 hp=5')).toBe('');
    expect(mvuUpdate('N1 hp=5', stat(10), [{ hp: 5 }]).stat_data).toEqual({ hp: 5 });
    beginTurn({ line: '?new', frozen: true, from: 2 });
    expect(mvuUpdate('N1 hp=5', stat(10), [{ hp: 5 }]).stat_data).toEqual({ hp: 10 });
  });

  it('drops the commands of a side story message and keeps the state', () => {
    chat = [user('m1'), ai('M1', ''), user('c1 #cellar'), ai('C1 hp=5', 'cellar')];
    const v = mvuUpdate('C1 hp=5', stat(10), [{ hp: 5 }]);
    expect(v.stat_data).toEqual({ hp: 10 });
    expect(v.delta_data).toEqual({});
  });

  it('a listener changing the state afterwards is undone too', () => {
    chat = [user('c1 #cellar'), ai('C1', 'cellar')];
    const v = stat(10) as Record<string, any>;
    const before = cloneData(v);
    onMvuCommandsParsed(v, [], 'C1');
    v.stat_data.hp = 0; // e.g. a clamp listener
    onMvuUpdateEnded(v, before);
    expect(v.stat_data).toEqual({ hp: 10 });
  });

  it('main storyline messages, and the switch off, update as usual', () => {
    chat = [user('m1'), ai('M1 hp=5', ''), user('c1 #cellar'), ai('C1 hp=7', 'cellar')];
    expect(mvuUpdate('M1 hp=5', stat(10), [{ hp: 5 }]).stat_data).toEqual({ hp: 5 });
    state.config = { ...state.config, storylines: { enabled: true, freezeVariables: 'off' } };
    expect(mvuUpdate('C1 hp=7', stat(10), [{ hp: 7 }]).stat_data).toEqual({ hp: 7 });
    state.config = { ...state.config, storylines: { enabled: false, freezeVariables: 'all' } };
    expect(mvuUpdate('C1 hp=7', stat(10), [{ hp: 7 }]).stat_data).toEqual({ hp: 7 });
  });

  it('`if` mode freezes if-lines only (I-163)', () => {
    chat = [user('m1'), ai('M1', ''), user('c1 #cellar'), ai('C1 hp=7', 'cellar'), user('d #ifRain'), ai('R1 hp=8', 'ifRain')];
    state.config = { ...state.config, storylines: { enabled: true, freezeVariables: 'if' } };
    expect(mvuUpdate('C1 hp=7', stat(10), [{ hp: 7 }]).stat_data).toEqual({ hp: 7 });
    expect(mvuUpdate('R1 hp=8', stat(10), [{ hp: 8 }]).stat_data).toEqual({ hp: 10 });
    // the running turn decides for its own messages (a `#if?` reply before it has a name)
    chat.push(user('x #if?'), { is_user: false, name: 'Bot', mes: 'N hp=1', extra: {} } as Msg);
    beginTurn({ line: '?new', frozen: true, from: 6 });
    expect(mvuUpdate('N hp=1', stat(10), [{ hp: 1 }]).stat_data).toEqual({ hp: 10 });
  });

  it('text that is no chat message is frozen only while a side turn generates', () => {
    chat = [user('c1 #cellar')];
    expect(mvuUpdate('repair block', stat(1), [{ hp: 2 }]).stat_data).toEqual({ hp: 2 });
    beginTurn({ line: 'cellar', frozen: true, from: 0 });
    expect(mvuUpdate('repair block', stat(1), [{ hp: 2 }]).stat_data).toEqual({ hp: 1 });
  });
});

describe('Tavern Helper variables on other storylines', () => {
  it('restores the chat variables and gives the turn\'s messages the state before them', async () => {
    chat = [user('m1'), ai('M1', '', stat(10, { delta_data: { hp: '9->10' } })), user('c1 #cellar', stat(10))];
    metadata.variables = { stat_data: { hp: 10 }, ui: 'a' };
    beginTurn({ line: 'cellar', frozen: true, from: 2 });
    // what scripts wrote during the turn
    metadata.variables = { stat_data: { hp: 3 }, ui: 'b' };
    chat[2]!.variables = [stat(4)];
    chat.push(ai('C1', 'cellar', stat(3)));
    expect(await settleTurn()).toBe(true);
    expect(metadata.variables).toEqual({ stat_data: { hp: 10 }, ui: 'a' });
    expect(chat[2]!.variables![0]).toEqual(stat(10, { delta_data: { hp: '9->10' } }));
    expect(chat[3]!.variables![0]).toEqual(stat(10, { delta_data: { hp: '9->10' } }));
    expect(saved).toEqual({ chat: 1, meta: 1 });
    // idempotent
    expect(await settleTurn()).toBe(false);
  });

  it('keeps what MVU stored unchanged (only its display data differs) and leaves main turns alone', async () => {
    chat = [user('m1'), ai('M1', '', stat(10, { delta_data: { hp: '9->10' } })), user('c1 #cellar')];
    beginTurn({ line: 'cellar', frozen: true, from: 2 });
    chat.push(ai('C1', 'cellar', stat(10, { delta_data: {} })));
    expect(await settleTurn()).toBe(false);
    expect(chat[3]!.variables![0]).toEqual(stat(10, { delta_data: {} }));
    // main storyline: nothing remembered
    beginTurn({ line: '', frozen: false, from: 3 });
    metadata.variables = { x: 1 };
    expect(await settleTurn()).toBe(false);
    expect(metadata.variables).toEqual({ x: 1 });
  });

  it('another chat: the turn is dropped', async () => {
    chat = [user('c1 #cellar')];
    beginTurn({ line: 'cellar', frozen: true, from: 0 });
    metadata.variables = { x: 1 };
    (globalThis as any).SillyTavern.getContext().getCurrentChatId = () => 'c2';
    const ctx = (globalThis as any).SillyTavern.getContext();
    (globalThis as any).SillyTavern = { getContext: () => ({ ...ctx, getCurrentChatId: () => 'c2', chatMetadata: metadata, chat }) };
    expect(await settleTurn()).toBe(false);
    expect(metadata.variables).toEqual({ x: 1 });
  });
});
