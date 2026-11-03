/**
 * Frozen variables (I-154, I-163): with `storylines.freezeVariables` (`all`: every storyline other
 * than the main one; `if`: only if-lines; `off`), turns on a frozen storyline leave the variables of
 * variable systems as they were, so the state of a side story never flows back into the main storyline.
 * The decision of a generation is `storyline.frozen` (presets tell the AI not to update state).
 *
 * - MVU (MagVarUpdate) — through its documented events on SillyTavern's event source: when it has
 *   parsed the update commands of a message on a frozen storyline (`mag_command_parsed`) they are
 *   dropped, and when the update ends (`mag_variable_update_ended`) the state is put back to the one
 *   before the update (listeners may have changed it). MVU then stores the unchanged state. This also
 *   covers its extra-model updates and re-processing an old floor.
 * - Tavern Helper variables written by other scripts — through their data in the chat: when a frozen
 *   turn ends, the chat variables (`chat_metadata.variables`) are restored and the messages of the
 *   turn get the variables of the message before them (`message.variables[swipe]`), i.e. the state
 *   the turn started from.
 *
 * Neither extension's code is called (licences): only SillyTavern's event source and chat data.
 */
import { cloneData, freezeMode, freezesStoryline, type APreset, type Configuration, type StorylineFreeze } from '@advanced-preset/protocol';
import { st, type STMessage } from '@/st/host';
import { activeCarrierPresetId } from '@/store/carrier';
import { activeConfiguration } from '@/store/config';
import { getPreset } from '@/store/presets';
import { chatLineKeys, storylineMeta, storylinesOn } from '@/store/storylines';
import { isIfLine } from '@/core/storylines';
import { debugLog } from '@/core/debug';

/** MVU's event names (`Mvu.events`). */
export const MVU_EVENTS = { commandParsed: 'mag_command_parsed', updateEnded: 'mag_variable_update_ended' } as const;

type Vars = Record<string, unknown>;
type VarMessage = STMessage & { variables?: Vars[] | Record<string, Vars> };

const isObj = (v: unknown): v is Vars => typeof v === 'object' && v !== null && !Array.isArray(v);

/** The freeze mode in effect (`off` when the preset has no storylines or they are switched off). */
export const activeFreezeMode = (preset: APreset | undefined, config: Configuration | undefined): StorylineFreeze =>
  storylinesOn(preset, config) ? freezeMode(config?.storylines) : 'off';

function currentMode(): StorylineFreeze {
  const id = activeCarrierPresetId();
  const preset = id ? getPreset(id) : undefined;
  return preset ? activeFreezeMode(preset, activeConfiguration(preset)) : 'off';
}

// ---- MVU -------------------------------------------------------------------------------------

/** Index of the chat message whose text is `content` (latest first; MVU hands over the message text it parses); -1: none. */
function messageOfText(content: unknown, chat: readonly STMessage[]): number {
  if (typeof content !== 'string' || !content) return -1;
  for (let i = chat.length - 1; i >= 0; i--) if (chat[i]!.mes === content) return i;
  // A part of a message (MVU's repair passes): only when long enough to be unambiguous.
  if (content.length >= 40) for (let i = chat.length - 1; i >= 0; i--) if (chat[i]!.mes.includes(content)) return i;
  return -1;
}

/** Messages of the running turn belong to its storyline, whatever their stored data says yet (a `#!` switch or a `#?` name is only written once AP received the reply, I-159). */
const inRunningTurn = (i: number) => Boolean(turn?.open && i >= turn.from);

/** Storyline key of the message whose text is `content`. `null`: not a message of the chat (e.g. a script's own text). */
export function lineOfText(content: unknown, chat: readonly STMessage[] = st().chat): string | null {
  const i = messageOfText(content, chat);
  if (i < 0) return null;
  return inRunningTurn(i) ? turn!.line : chatLineKeys(chat)[i]!;
}

/**
 * Whether MVU's update of `content` is frozen under `mode`: messages of the running turn as the turn
 * decided (`storyline.frozen`), older messages by their storyline; text that is no chat message only
 * while a frozen turn generates.
 */
export function freezesText(content: unknown, mode: StorylineFreeze, chat: readonly STMessage[] = st().chat): boolean {
  if (mode === 'off') return false;
  const i = messageOfText(content, chat);
  if (i < 0 || inRunningTurn(i)) return Boolean(turn?.open && turn.frozen);
  const key = chatLineKeys(chat)[i]!;
  return freezesStoryline(mode, { main: key === '', if: isIfLine(key, storylineMeta()) });
}

/** MVU variable objects whose update was frozen (identity: the object MVU updates in place). */
const frozen = new WeakSet<object>();

export function onMvuCommandsParsed(variables: unknown, commands: unknown, content: unknown): void {
  if (!isObj(variables) || !Array.isArray(commands)) return;
  if (!freezesText(content, currentMode())) return;
  if (commands.length) debugLog('variables', { frozen: 'mvu', storyline: lineOfText(content) ?? turn?.line, commands: commands.length });
  commands.splice(0, commands.length);
  frozen.add(variables);
}

export function onMvuUpdateEnded(variables: unknown, before: unknown): void {
  if (!isObj(variables) || !frozen.has(variables)) return;
  frozen.delete(variables);
  if (isObj(before) && 'stat_data' in before) variables.stat_data = cloneData(before.stat_data);
  variables.delta_data = {};
}

// ---- Tavern Helper data ------------------------------------------------------------------------

interface FrozenTurn {
  chatId: string;
  /** Storyline key of the turn (`''`: the main storyline). */
  line: string;
  /** The turn's variable updates are blocked (`storyline.frozen`). */
  frozen: boolean;
  /** First message of the turn (its user input, or the message being continued / swiped). */
  from: number;
  /** Chat variables when the turn started (`undefined`: none). */
  chatVars: unknown;
  /** The generation is still running (until its message is rendered or it is stopped). */
  open: boolean;
}

let turn: FrozenTurn | null = null;

/** Variables of a message's current swipe. */
function messageVars(m: VarMessage | undefined): Vars | undefined {
  const v = m?.variables as unknown;
  if (!v || typeof v !== 'object') return undefined;
  const slot = (v as Record<number, unknown>)[m!.swipe_id ?? 0];
  return isObj(slot) ? slot : undefined;
}

/** What MVU writes for display only; a message keeping MVU's unchanged state is left alone. */
const DISPLAY_KEYS = new Set(['display_data', 'delta_data']);
const sameState = (a: Vars | undefined, b: Vars | undefined): boolean => {
  const strip = (v: Vars | undefined) => JSON.stringify(Object.fromEntries(Object.entries(v ?? {}).filter(([k]) => !DISPLAY_KEYS.has(k)).sort(([x], [y]) => (x < y ? -1 : 1))));
  return strip(a) === strip(b);
};

/**
 * Called by the interceptor for every generation with storylines (`line`: its storyline, `undefined`
 * without storylines; `frozen`: `storyline.frozen`): remembers it, and the chat variables of a frozen turn.
 */
export function beginTurn(o: { line: string | undefined; frozen: boolean; from: number }): void {
  turn = null;
  if (o.line === undefined) return;
  turn = { chatId: String(st().getCurrentChatId?.() ?? ''), line: o.line, frozen: o.frozen, from: Math.max(0, o.from), chatVars: o.frozen ? cloneData(st().chatMetadata?.variables) : undefined, open: true };
}

/**
 * Puts the variables of the frozen turn back (idempotent; runs after the turn's message arrived and
 * rendered, and when the generation ends). The turn is kept until the next generation starts, so
 * late writers of the same turn are undone as well. Returns whether anything changed.
 */
export async function settleTurn(): Promise<boolean> {
  const t = turn;
  if (!t?.frozen) return false;
  const ctx = st();
  if (String(ctx.getCurrentChatId?.() ?? '') !== t.chatId) { turn = null; return false; }
  let meta = false;
  let chat = false;
  const md = ctx.chatMetadata;
  if (md && JSON.stringify(md.variables) !== JSON.stringify(t.chatVars)) {
    if (t.chatVars === undefined) delete md.variables;
    else md.variables = cloneData(t.chatVars);
    meta = true;
  }
  const messages = ctx.chat as VarMessage[];
  const keys = chatLineKeys(messages);
  for (let i = t.from; i < messages.length; i++) {
    const m = messages[i]!;
    if (keys[i] === '') continue;
    const cur = messageVars(m);
    if (!cur) continue;
    let base: Vars | undefined;
    for (let j = i - 1; j >= 0 && !base; j--) base = messageVars(messages[j]);
    if (sameState(cur, base)) continue;
    (m.variables as Record<number, Vars>)[m.swipe_id ?? 0] = base ? cloneData(base) : {};
    chat = true;
  }
  if (meta || chat) debugLog('variables', { frozen: 'chat', storyline: t.line, chatVariables: meta, messages: chat });
  if (meta) await ctx.saveMetadata();
  if (chat) await ctx.saveChat();
  return meta || chat;
}

export const dropTurn = () => { turn = null; };

/** Event wiring (index.ts). */
export function installVariableGuard(): void {
  const { eventSource, eventTypes: E } = st();
  const last = (e: string, f: (...a: any[]) => unknown) => {
    const es = eventSource as typeof eventSource & { makeLast?: (e: string, f: (...a: any[]) => unknown) => void };
    if (es.makeLast) es.makeLast(e, f); else es.on(e, f);
  };
  eventSource.on(MVU_EVENTS.commandParsed, (variables: unknown, commands: unknown, content: unknown) => onMvuCommandsParsed(variables, commands, content));
  last(MVU_EVENTS.updateEnded, (variables: unknown, before: unknown) => onMvuUpdateEnded(variables, before));
  // After the listeners of the event that triggered it (ST awaits them in order): the next tick.
  // ST emits GENERATION_ENDED as soon as the UI unlocks (before MESSAGE_RECEIVED when streaming):
  // settle on every step, close once the message is rendered or the generation is stopped.
  const settleSoon = (close: boolean) => () => {
    if (!turn) return;
    if (close) turn.open = false;
    setTimeout(() => void settleTurn().catch((e) => console.error('[AP] variables', e)), 0);
  };
  for (const e of [E.MESSAGE_RECEIVED, E.GENERATION_ENDED]) if (e) last(e, settleSoon(false));
  for (const e of [E.CHARACTER_MESSAGE_RENDERED, E.GENERATION_STOPPED]) if (e) last(e, settleSoon(true));
  // A new (real) generation or another chat: the turn is over.
  if (E.GENERATION_STARTED) eventSource.on(E.GENERATION_STARTED, (_type: unknown, _o: unknown, dryRun?: boolean) => { if (!dryRun) dropTurn(); });
  if (E.CHAT_CHANGED) eventSource.on(E.CHAT_CHANGED, dropTurn);
}
