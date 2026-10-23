/**
 * Inline annotation data on messages (I-79): keep anchors in step with edits of `mes`, and the
 * read API exposed to scripts and frontends (`window.AdvancedPreset.annotations`, I-83).
 */
import { reanchorAnnotations, type Annotation } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import { getSidecar, writeSidecar } from '@/store/sidecar';

type Listener = (mesId: number) => void;
const listeners = new Set<Listener>();

export function notifyAnnotations(mesId: number): void {
  for (const f of listeners) {
    try { f(mesId); } catch (e) { console.error('[AP] annotations listener failed', e); }
  }
}

/** Annotations of a message, re-anchored to its current text (not persisted). */
export function annotationsOf(mesId: number): Annotation[] {
  const msg = st().chat[mesId];
  const list = getSidecar(msg)?.annotations;
  if (!msg || !list?.length) return [];
  return reanchorAnnotations(msg.mes, list).annotations;
}

/** Re-anchor and persist after `mes` changed. Returns true when the sidecar was updated. */
export function reanchorMessage(mesId: number): boolean {
  const msg = st().chat[mesId];
  const sc = getSidecar(msg);
  if (!msg || !sc?.annotations?.length) return false;
  const r = reanchorAnnotations(msg.mes, sc.annotations);
  if (!r.changed) return false;
  writeSidecar(mesId, { ...sc, annotations: r.annotations });
  return true;
}

export function installAnnotations(): void {
  const { eventSource, eventTypes: E } = st();
  const onEdited = (id: unknown) => {
    const mesId = Number(id);
    if (Number.isNaN(mesId)) return;
    if (reanchorMessage(mesId)) void st().saveChat();
    notifyAnnotations(mesId);
  };
  for (const e of [E.MESSAGE_EDITED, E.MESSAGE_UPDATED]) if (e) eventSource.on(e, onEdited);
  for (const e of [E.MESSAGE_SWIPED, 'advanced_preset_message_updated']) if (e) eventSource.on(e, (id: unknown) => notifyAnnotations(Number(id)));
}

/** Public API (`window.AdvancedPreset.annotations`). */
export const annotationsApi = {
  /** Visible annotations of a message (orphans excluded), offsets into its current `mes`. */
  get: (mesId: number): Annotation[] => annotationsOf(mesId).filter((a) => !a.orphan).map((a) => ({ ...a })),
  /** Subscribe to annotation changes (`mesId` of the message). Returns an unsubscribe function. */
  on(event: 'change', f: Listener): () => void {
    if (event !== 'change') throw new Error(`unknown event ${String(event)}`);
    listeners.add(f);
    return () => listeners.delete(f);
  },
};
