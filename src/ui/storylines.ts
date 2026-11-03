/**
 * Storyline view model (I-152): the storyline of each message for badges and the storylines tab,
 * jumping to a message (the hidden `#tag` of user messages: `storyline-tag.ts`).
 */
import { computed } from 'vue';
import type { Synopsis } from '@advanced-preset/protocol';
import { st, type STMessage } from '@/st/host';
import { activeConfiguration } from '@/store/config';
import { getSidecar } from '@/store/sidecar';
import { chatLineKeys, storylineMeta, storylinesOn } from '@/store/storylines';
import { isIfLine, isPendingLine, lineName, untagged } from '@/core/storylines';
import { activePreset, ui } from './state';

/** The active preset declares storylines and they are switched on. */
export const storylinesActive = computed(() => {
  void ui.chatRev;
  const p = activePreset.value;
  return Boolean(p && storylinesOn(p, activeConfiguration(p)));
});

let memo: { rev: number; chat: STMessage[]; len: number; keys: string[] } | null = null;

/** Storyline key of every chat message (recomputed when the chat changes). */
export function lineKeys(): string[] {
  const chat = st().chat ?? [];
  if (!memo || memo.rev !== ui.chatRev || memo.chat !== chat || memo.len !== chat.length) memo = { rev: ui.chatRev, chat, len: chat.length, keys: chatLineKeys(chat) };
  return memo.keys;
}
export const forgetLineKeys = () => { memo = null; };

export interface StorylineFloor { index: number; user: boolean; title: string }
/** `pending`: a `#?` input whose reply is missing (no name yet). */
export interface StorylineEntry { key: string; name: string; main: boolean; if: boolean; pending: boolean; current: boolean; floors: StorylineFloor[] }

const TITLE_MAX = 60;
const clip = (s: string) => {
  const one = s.replace(/\s+/g, ' ').trim();
  return one.length > TITLE_MAX ? `${one.slice(0, TITLE_MAX)}…` : one;
};

/** Storylines of the chat (main first, then by first appearance) with their messages. */
export function storylineEntries(synopsisId?: string): StorylineEntry[] {
  void ui.chatRev;
  const chat = st().chat ?? [];
  const keys = lineKeys();
  const meta = storylineMeta();
  const order = ['', ...keys.filter((k, i) => k && keys.indexOf(k) === i)];
  const current = keys.length ? keys[keys.length - 1]! : '';
  return order.map((key) => {
    const floors: StorylineFloor[] = [];
    keys.forEach((k, i) => {
      const m = chat[i]!;
      if (k !== key || (m.is_system && !m.is_user)) return;
      const syn = synopsisId && !m.is_user ? (getSidecar(m)?.structures?.[synopsisId] as Synopsis | undefined) : undefined;
      floors.push({ index: i, user: m.is_user, title: clip(syn?.event || untagged(m)) });
    });
    return { key, name: lineName(key, meta), main: key === '', if: isIfLine(key, meta), pending: isPendingLine(key), current: key === current, floors };
  }).filter((e) => e.main || e.floors.length);
}

/** Scrolls the chat to message `index` (ST's `/chat-jump`, else the rendered message). */
export async function jumpToMessage(index: number): Promise<void> {
  const ctx = st() as ReturnType<typeof st> & { executeSlashCommandsWithOptions?: (cmd: string, o?: object) => Promise<unknown> };
  const el = document.querySelector(`#chat > .mes[mesid="${index}"]`);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (ctx.executeSlashCommandsWithOptions) await ctx.executeSlashCommandsWithOptions(`/chat-jump ${index}`, { handleExecutionErrors: true });
}
