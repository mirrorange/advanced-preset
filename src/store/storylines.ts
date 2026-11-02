/**
 * Storyline data of the open chat: the main storyline's name and the if-line switches in the chat
 * metadata, the storyline of each assistant swipe in its `extra`, and switching the main storyline
 * (I-147): messages of the old main storyline get its name (user `#tag`, assistant swipe data).
 */
import { MAX_STORYLINE_NAME, withStorylineTag, type APreset, type Configuration } from '@advanced-preset/protocol';
import { st, type STMessage } from '@/st/host';
import { STORYLINE_KEY, arrangeLines, isIfLine, lineKey, messageLines, type StorylineMeta } from '@/core/storylines';

const META_KEY = 'advanced_preset';

/** The preset declares storylines and the user did not switch them off. */
export const storylinesOn = (preset: APreset | undefined, config: Configuration | undefined): boolean =>
  Boolean(preset?.storylines) && config?.storylines?.enabled !== false;

export function storylineMeta(): StorylineMeta {
  const s = st().chatMetadata?.[META_KEY]?.storylines;
  return s && typeof s === 'object' ? (s as StorylineMeta) : {};
}

function writeMeta(next: StorylineMeta): void {
  const md = st().chatMetadata;
  if (!md) return;
  const ap = (md[META_KEY] ??= {});
  ap.storylines = next;
}

/** A name usable in a `#tag`: no whitespace or `#`, at most {@link MAX_STORYLINE_NAME} characters. */
export const validStorylineName = (name: string): boolean => /^[^\s#]+$/u.test(name) && [...name].length <= MAX_STORYLINE_NAME && !name.startsWith('!');

/** Storyline key of every chat message under the current metadata. */
export function chatLineKeys(chat: readonly STMessage[] = st().chat, meta = storylineMeta()): string[] {
  return messageLines(chat).map((l) => lineKey(l, meta));
}

/**
 * Chat indices as the storyline `current` sees them: other storylines first, then the main storyline,
 * then `current`; invisible if-lines left out. What it reads from the chat (structures, memory,
 * recap) follows this order (I-153). `current` defaults to the storyline of the last message.
 */
export function storylineView(current?: string, chat: readonly STMessage[] = st().chat, meta = storylineMeta()): number[] {
  const keys = chatLineKeys(chat, meta);
  return arrangeLines(keys, current ?? keys.at(-1) ?? '', meta).order;
}

/** Records the storyline of an assistant message's current swipe (`''`: main). */
export function writeMessageLine(mesId: number, key: string): void {
  const msg = st().chat[mesId];
  if (!msg || msg.is_user) return;
  msg.extra ??= {};
  msg.extra[STORYLINE_KEY] = key;
  const info = msg.swipe_info?.[msg.swipe_id ?? 0];
  if (info) { info.extra ??= {}; info.extra[STORYLINE_KEY] = key; }
}

export async function setIfLine(key: string, value: boolean): Promise<void> {
  if (!key) return;
  const meta = storylineMeta();
  writeMeta({ ...meta, if: { ...(meta.if ?? {}), [key]: value } });
  await st().saveMetadata();
}

/** Names the (unnamed) main storyline; `false` when the name is taken by another storyline. */
export async function nameMainStoryline(name: string): Promise<boolean> {
  const meta = storylineMeta();
  if (!validStorylineName(name)) return false;
  if (chatLineKeys(st().chat, meta).includes(name)) return false;
  writeMeta({ ...meta, main: name });
  await st().saveMetadata();
  return true;
}

export type SwitchResult = 'switched' | 'unchanged' | 'needs-name' | 'invalid' | 'taken';

/**
 * Makes `target` the main storyline. The old main storyline keeps its messages under `oldName`
 * (default: its name; required when it is unnamed and has messages). Saves the chat.
 */
export async function switchMainStoryline(target: string, oldName?: string): Promise<SwitchResult> {
  const meta = storylineMeta();
  if (!validStorylineName(target)) return 'invalid';
  if (lineKey(target, meta) === '') return 'unchanged';
  const chat = st().chat;
  const raw = messageLines(chat);
  const keys = raw.map((l) => lineKey(l, meta));
  const old = oldName ?? meta.main ?? '';
  const mainUsed = keys.some((k, i) => k === '' && !chat[i]!.is_system);
  if (mainUsed && !old) return 'needs-name';
  if (old && (!validStorylineName(old) || old === target)) return 'invalid';
  if (old && old !== meta.main && keys.includes(old)) return 'taken';

  const changed: number[] = [];
  if (old) chat.forEach((m, i) => {
    if (m.is_user) {
      if (keys[i] !== '') return;
      m.mes = withStorylineTag(m.mes, old);
      changed.push(i);
      return;
    }
    // Narrator / system messages without data follow the message before them.
    if (m.is_system && !(m.extra && STORYLINE_KEY in m.extra)) return;
    // Every swipe that belongs to the main storyline (stored, or inherited from the message before).
    const inherited = i > 0 ? keys[i - 1]! : '';
    const isMain = (v: unknown) => (typeof v === 'string' ? lineKey(v, meta) : inherited) === '';
    let touched = false;
    m.swipe_info?.forEach((info) => {
      if (!info || !isMain(info.extra?.[STORYLINE_KEY])) return;
      info.extra ??= {};
      info.extra[STORYLINE_KEY] = old;
      touched = true;
    });
    if (isMain(m.extra?.[STORYLINE_KEY])) {
      m.extra ??= {};
      m.extra[STORYLINE_KEY] = old;
      touched = true;
    }
    if (touched) changed.push(i);
  });
  const ifs = { ...(meta.if ?? {}) };
  // The old main storyline stays visible to the others, whatever its name.
  if (old && isIfLine(old, { ...meta, if: ifs })) ifs[old] = false;
  delete ifs[target];
  writeMeta({ ...meta, main: target, if: ifs });
  for (const i of changed) if (chat[i]!.is_user) st().updateMessageBlock(i, chat[i]!);
  await st().saveChat();
  return 'switched';
}
