/**
 * Keeps memory in step with the message lifecycle (I-97, I-98): a swipe that is being regenerated
 * loses the previous swipe's sidecar mirror, so its chat memory (and recap, structures) roll back.
 */
import { st } from '@/st/host';
import { detachRegeneratingSidecar } from '@/store/sidecar';

export function onMessageSwiped(mesId: number): void {
  detachRegeneratingSidecar(mesId);
}

export function installMemorySync(): void {
  const { eventSource, eventTypes: E } = st();
  // First, so UI and other listeners of the same event already see the rolled-back state.
  const first = (e: string, f: (...a: any[]) => unknown) => (eventSource.makeFirst ? eventSource.makeFirst(e, f) : eventSource.on(e, f));
  if (E.MESSAGE_SWIPED) first(E.MESSAGE_SWIPED, (id: unknown) => onMessageSwiped(Number(id)));
}
