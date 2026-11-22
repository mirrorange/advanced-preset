/** Reference images of image connections: ids the model picks from, scopes, and cleanup of unused blobs. */
import { mediaSettings, type ImageConnection, type StoredRef } from '@/store/media';
import { gc } from '@/store/media-db';
import { chatCards, inChatScope, type ChatCard } from '@/st/cards';

/** The next free id (`ref1`, `ref2`, …). */
export function nextRefId(refs: Pick<StoredRef, 'id'>[]): string {
  const used = new Set(refs.map((r) => r.id));
  let n = 1;
  while (used.has(`ref${n}`)) n++;
  return `ref${n}`;
}

/** Delete stored reference images no connection uses any more. */
export async function gcRefs(): Promise<void> {
  const keep = new Set(mediaSettings().image.connections.flatMap((c) => c.refs.map((r) => r.blob)));
  await gc('ref:', keep).catch((e) => console.warn('[AP] media gc failed', e));
}

/** Reference images offered in the current chat: the global ones and those of the chat's cards. */
export function chatRefs(c: Pick<ImageConnection, 'refs'>, cards: readonly ChatCard[] = chatCards()): StoredRef[] {
  return c.refs.filter((r) => inChatScope(r.card, cards));
}
