/**
 * Keeps memory in step with the message lifecycle.
 * - Chat memory (I-97): a swipe that is being regenerated loses the previous swipe's sidecar mirror,
 *   so its chat memory (and recap, structures) roll back with it.
 * - Global memory (I-98): log events referenced by the selected version of a message are active;
 *   events referenced only by other swipes, or by messages that disappeared since the last sync
 *   (deleted, regenerated), are switched off. Selecting a version again switches them back on.
 *   References to events that are no longer in the log are ignored.
 */
import { st, type STMessage } from '@/st/host';
import { settings, save } from '@/store/settings';
import { detachRegeneratingSidecar, SIDECAR_KEY, type Sidecar } from '@/store/sidecar';
import { ensureEventIds, refId, setGlobalActive } from '@/store/eventlog';

/** `presetId \0 eventId` */
type RefKey = string;
const SEP = '\u0000';

function refsOf(sidecar: unknown, out: Set<RefKey>): void {
  const sc = sidecar as Sidecar | undefined;
  if (!sc || typeof sc !== 'object' || sc.v !== 1 || !Array.isArray(sc.events)) return;
  for (const e of sc.events) {
    const id = refId(e);
    if (id) out.add(`${sc.presetId}${SEP}${id}`);
  }
}

/** Global refs of the selected message versions (`active`) and of every other swipe (`inactive`). */
export function scanGlobalRefs(chat: STMessage[]): { active: Set<RefKey>; inactive: Set<RefKey> } {
  const active = new Set<RefKey>();
  const inactive = new Set<RefKey>();
  for (const m of chat) {
    if (!m || m.is_user) continue;
    const swipes = Array.isArray(m.swipes) ? m.swipes.length : 0;
    const sw = m.swipe_id ?? 0;
    // A swipe being generated (sw === swipes) has no selected version yet.
    if (!swipes || sw < swipes) refsOf(m.extra?.[SIDECAR_KEY], active);
    m.swipe_info?.forEach((info, i) => { if (i !== sw) refsOf(info?.extra?.[SIDECAR_KEY], inactive); });
  }
  for (const k of active) inactive.delete(k);
  return { active, inactive };
}

let last: { chatId: string; active: Set<RefKey> } | null = null;

/** Forget the last scan (tests). */
export function resetMemorySync(): void { last = null; }

/**
 * Bring global events in line with the current chat. Within the same chat, refs that were active at
 * the last sync and are now gone (deleted messages) are switched off too; after a chat switch only the
 * loaded chat's own refs are applied. Returns whether any event changed.
 */
export function syncGlobalRefs(opts: { reload?: boolean } = {}): boolean {
  const ctx = st();
  const chatId = String(ctx.getCurrentChatId?.() ?? '');
  const { active, inactive } = scanGlobalRefs(ctx.chat ?? []);
  const off = new Set(inactive);
  if (last && !opts.reload && last.chatId === chatId) for (const k of last.active) if (!active.has(k)) off.add(k);
  last = { chatId, active };

  const byPreset = new Map<string, { on: string[]; off: string[] }>();
  const add = (k: RefKey, on: boolean) => {
    const [presetId, id] = k.split(SEP) as [string, string];
    let b = byPreset.get(presetId);
    if (!b) byPreset.set(presetId, (b = { on: [], off: [] }));
    (on ? b.on : b.off).push(id);
  };
  for (const k of off) add(k, false);
  for (const k of active) add(k, true);

  let changed = false;
  const presets = settings().presets;
  for (const [presetId, b] of byPreset) {
    const state = presets[presetId];
    if (!state?.globalMemory) continue;
    if (ensureEventIds(state.globalMemory.log)) changed = true;
    if (setGlobalActive(state, b.off, false)) changed = true;
    if (setGlobalActive(state, b.on, true)) changed = true;
  }
  if (changed) save();
  return changed;
}

export function onMessageSwiped(mesId: number): void {
  detachRegeneratingSidecar(mesId);
  syncGlobalRefs();
}

export function installMemorySync(): void {
  const { eventSource, eventTypes: E } = st();
  // First, so prompt building, the UI and other listeners already see the rolled-back state.
  const first = (e: string, f: (...a: any[]) => unknown) => (eventSource.makeFirst ? eventSource.makeFirst(e, f) : eventSource.on(e, f));
  if (E.MESSAGE_SWIPED) first(E.MESSAGE_SWIPED, (id: unknown) => onMessageSwiped(Number(id)));
  for (const e of [E.MESSAGE_DELETED, E.MESSAGE_SWIPE_DELETED]) if (e) first(e, () => syncGlobalRefs());
  if (E.CHAT_CHANGED) first(E.CHAT_CHANGED, () => syncGlobalRefs({ reload: true }));
}
