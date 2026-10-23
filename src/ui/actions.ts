/** Message-level actions shared by stage panel and cards. */
import { st } from '@/st/host';
import { getSidecar, writeSidecar } from '@/store/sidecar';
import { bumpChat } from './state';

/** Patched workflows (D19): switch `mes` between the draft and the patched text. */
export async function togglePatches(mesId: number): Promise<void> {
  const msg = st().chat[mesId];
  const sc = getSidecar(msg);
  if (!msg || !sc || sc.draft === undefined || sc.patched === undefined) return;
  const applied = !sc.patchesApplied;
  msg.mes = applied ? sc.patched : sc.draft;
  if (Array.isArray(msg.swipes)) msg.swipes[msg.swipe_id ?? 0] = msg.mes;
  const next = { ...sc, patchesApplied: applied };
  if (sc.annotationVersions) next.annotations = applied ? sc.annotationVersions.patched : sc.annotationVersions.draft;
  writeSidecar(mesId, next);
  st().updateMessageBlock(mesId, msg);
  await st().saveChat();
  await st().eventSource.emit(st().eventTypes.MESSAGE_EDITED!, mesId);
  bumpChat();
}
