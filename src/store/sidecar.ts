/**
 * Sidecar data (§13, D2): per-swipe `extra.advanced_preset`. `mes` only ever holds story content;
 * stages, structures, events and diagnostics live here.
 */
import type { PatchResult, StageKind, Transport } from '@advanced-preset/protocol';
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
    info.extra[SIDECAR_KEY] = structuredClone(sidecar);
  }
}

/** Index of a message in the chat (identity first, then by send date). */
export function messageIndex(msg: STMessage): number {
  const chat = st().chat;
  const i = chat.indexOf(msg);
  if (i >= 0) return i;
  return chat.findIndex((m) => m.send_date === msg.send_date && m.name === msg.name && m.is_user === msg.is_user);
}
