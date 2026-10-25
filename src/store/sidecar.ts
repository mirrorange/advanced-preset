/**
 * Sidecar data (§13, D2): per-swipe `extra.advanced_preset`. `mes` only ever holds story content;
 * stages, structures, events and diagnostics live here.
 */
import { cloneData } from '@advanced-preset/protocol';
import type { Annotation, PatchResult, StageKind, Transport } from '@advanced-preset/protocol';
import { st, type STMessage } from '@/st/host';
import type { ChatEvent } from './eventlog';

export type TurnKind = 'story' | 'meta-pure' | 'meta-mixed' | 'impersonate' | 'summary';

export interface SidecarStage {
  id: string;
  actor: string;
  kind: StageKind;
  label: string;
  text?: string;
  patches?: PatchResult[];
  status: 'done' | 'interrupted' | 'missing';
}

export interface Sidecar {
  v: 1;
  presetId: string;
  presetVersion: string;
  genId: string;
  origin: 'story' | 'task';
  transport: Transport;
  workflow: string;
  turn: TurnKind;
  stages: SidecarStage[];
  /** Patched workflows: the draft before patches. */
  draft?: string;
  /** Patched content (kept so it can be re-applied after reverting to the draft). */
  patched?: string;
  patchesApplied: boolean;
  /** Inline annotations anchored in `mes` (I-79). */
  annotations?: Annotation[];
  /** Patched workflows: annotations of the draft and of the patched text (swapped with `patchesApplied`). */
  annotationVersions?: { draft: Annotation[]; patched: Annotation[] };
  structures: Record<string, unknown>;
  events: ChatEvent[];
  /** Meta segments of the user input of this turn (for `recent_meta`). */
  metaInput?: string[];
  reasoning?: string;
  diagnostics?: { warnings: string[]; requests: number; usage?: unknown; durationMs?: number };
}

export const SIDECAR_KEY = 'advanced_preset';

export function getSidecar(msg: STMessage | undefined): Sidecar | undefined {
  const s = msg?.extra?.[SIDECAR_KEY];
  return s && typeof s === 'object' && (s as Sidecar).v === 1 ? (s as Sidecar) : undefined;
}

/** A copy of the sidecar with one structure value replaced (user edits overwrite the model's value). */
export function withStructure(sidecar: Sidecar, id: string, value: unknown): Sidecar {
  return { ...sidecar, structures: { ...sidecar.structures, [id]: cloneData(value) } };
}

/** Write the sidecar to the message and its current swipe slot. */
export function writeSidecar(mesId: number, sidecar: Sidecar): void {
  const msg = st().chat[mesId];
  if (!msg) return;
  msg.extra ??= {};
  msg.extra[SIDECAR_KEY] = sidecar;
  const sw = msg.swipe_id ?? 0;
  const info = msg.swipe_info?.[sw];
  if (info) {
    info.extra ??= {};
    info.extra[SIDECAR_KEY] = cloneData(sidecar);
  }
}

/**
 * A swipe being generated (ST overswipe: `swipe_id === swipes.length`) has no sidecar yet, but ST keeps
 * the previous swipe's `extra` on the message and even clones it into the new swipe slot while
 * streaming. Drop the mirror so the old turn's events, structures and cards stop counting; the old
 * swipe keeps its own copy in `swipe_info`. Returns whether anything was removed.
 */
export function detachRegeneratingSidecar(mesId: number): boolean {
  const msg = st().chat[mesId];
  if (!msg || msg.is_user || !Array.isArray(msg.swipes) || !msg.extra?.[SIDECAR_KEY]) return false;
  const sw = msg.swipe_id ?? 0;
  if (sw < msg.swipes.length && msg.swipe_info?.[sw]) return false;
  delete msg.extra[SIDECAR_KEY];
  return true;
}

/** Index of a message in the chat (identity first, then by send date). */
export function messageIndex(msg: STMessage): number {
  const chat = st().chat;
  const i = chat.indexOf(msg);
  if (i >= 0) return i;
  return chat.findIndex((m) => m.send_date === msg.send_date && m.name === msg.name && m.is_user === msg.is_user);
}
