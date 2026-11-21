/**
 * Inline speech lines on messages: keep anchors in step with edits of `mes` (like annotations) and
 * the read API for the speech UI and scripts (`window.AdvancedPreset.speech`).
 */
import { reanchorSpeech, type SpeechSpan } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import { getSidecar, writeSidecar } from '@/store/sidecar';

type Listener = (mesId: number) => void;
const listeners = new Set<Listener>();

export function notifySpeech(mesId: number): void {
  for (const f of listeners) {
    try { f(mesId); } catch (e) { console.error('[AP] speech listener failed', e); }
  }
}

/** Speech lines of a message, re-anchored to its current text (not persisted). */
export function speechOf(mesId: number): SpeechSpan[] {
  const msg = st().chat[mesId];
  const list = getSidecar(msg)?.speech;
  if (!msg || !list?.length) return [];
  return reanchorSpeech(msg.mes, list).spans;
}

/** Re-anchor and persist after `mes` changed. Returns true when the sidecar was updated. */
export function reanchorSpeechOf(mesId: number): boolean {
  const msg = st().chat[mesId];
  const sc = getSidecar(msg);
  if (!msg || !sc?.speech?.length) return false;
  const r = reanchorSpeech(msg.mes, sc.speech);
  if (!r.changed) return false;
  writeSidecar(mesId, { ...sc, speech: r.spans });
  return true;
}

export function installSpeech(): void {
  const { eventSource, eventTypes: E } = st();
  const onEdited = (id: unknown) => {
    const mesId = Number(id);
    if (Number.isNaN(mesId)) return;
    if (reanchorSpeechOf(mesId)) void st().saveChat();
    notifySpeech(mesId);
  };
  for (const e of [E.MESSAGE_EDITED, E.MESSAGE_UPDATED]) if (e) eventSource.on(e, onEdited);
  for (const e of [E.MESSAGE_SWIPED, 'advanced_preset_message_updated']) if (e) eventSource.on(e, (id: unknown) => notifySpeech(Number(id)));
}

/** Public API (`window.AdvancedPreset.speech`). */
export const speechApi = {
  /** Visible speech lines of a message (orphans excluded), offsets into its current `mes`. */
  get: (mesId: number): SpeechSpan[] => speechOf(mesId).filter((s) => !s.orphan).map((s) => ({ ...s })),
  /** Subscribe to speech line changes (`mesId` of the message). Returns an unsubscribe function. */
  on(event: 'change', f: Listener): () => void {
    if (event !== 'change') throw new Error(`unknown event ${String(event)}`);
    listeners.add(f);
    return () => listeners.delete(f);
  },
};
