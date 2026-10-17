/**
 * Hands the sidecar of a finished generation to its message (§13): on MESSAGE_RECEIVED the final
 * story content replaces whatever was streamed (patched text, held-back tails), the sidecar is
 * written to the current swipe and the chat is saved.
 */
import { st } from '@/st/host';
import { writeSidecar } from '@/store/sidecar';
import { handoff } from '@/core/orchestrator';
import { live } from '@/core/live';

const MAX_AGE_MS = 10 * 60_000;
const NO_MESSAGE_TYPES = new Set(['impersonate', 'quiet']);

export async function onMessageReceived(mesId: number, type?: string): Promise<void> {
  const p = handoff.pending;
  if (!p || Date.now() - p.at > MAX_AGE_MS || NO_MESSAGE_TYPES.has(type ?? '')) return;
  const msg = st().chat[mesId];
  if (!msg || msg.is_user) return;
  handoff.pending = null;

  const { outcome } = p;
  if (outcome.content && msg.mes !== outcome.content) {
    msg.mes = outcome.content;
    if (Array.isArray(msg.swipes)) msg.swipes[msg.swipe_id ?? 0] = outcome.content;
  }
  writeSidecar(mesId, outcome.sidecar);
  if (live.current?.genId === p.ctx.id) live.current.mesId = mesId;
  st().updateMessageBlock(mesId, msg);
  await st().saveChat();
  await st().eventSource.emit('advanced_preset_message_updated', mesId);
}
