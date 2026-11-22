/**
 * Character cards of the current chat, for media items bound to a card (reference images, voices).
 * A card is identified by its avatar file name, which ST keeps stable across renames. A group chat
 * has the cards of its members.
 */
import { st } from './host';

export interface ChatCard {
  /** Avatar file name (`characters[i].avatar`). */
  key: string;
  name: string;
}

interface Ctx {
  characters?: { name?: string; avatar?: string }[];
  characterId?: string | number;
  groupId?: string | null;
  groups?: { id: string; members?: string[] }[];
}

/** Cards of the current chat: the selected character, or every member of the group. */
export function chatCards(): ChatCard[] {
  const c = st() as unknown as Ctx;
  const chars = c.characters ?? [];
  const card = (avatar: string | undefined): ChatCard | null => {
    if (!avatar) return null;
    const ch = chars.find((x) => x.avatar === avatar);
    return { key: avatar, name: ch?.name || avatar.replace(/\.[^.]+$/, '') };
  };
  let out: (ChatCard | null)[] = [];
  if (c.groupId) out = (c.groups?.find((g) => g.id === c.groupId)?.members ?? []).map(card);
  else if (c.characterId !== undefined && c.characterId !== null && c.characterId !== '') out = [card(chars[Number(c.characterId)]?.avatar)];
  return out.filter((x): x is ChatCard => Boolean(x));
}

/** Whether an item bound to `card` (none: global) belongs to the current chat. */
export function inChatScope(card: string | undefined, cards: readonly ChatCard[] = chatCards()): boolean {
  return !card || cards.some((c) => c.key === card);
}
