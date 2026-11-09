/** Live view of the running generation, consumed by the stage panel / generation dock. */
import { reactive } from 'vue';
import type { PatchResult, StageKind, StageStatus, TurnResult } from '@advanced-preset/protocol';
import type { GenerationContext } from './context';
import { st, type STMessage } from '@/st/host';

export interface StageView {
  id: string;
  actor: string;
  kind: StageKind;
  label: string;
  optional: boolean;
  text: string;
  patches?: PatchResult[] | { old_string: string; new_string: string }[];
  status: StageStatus;
}

export interface LiveGeneration {
  genId: string;
  presetId: string;
  transport: string;
  workflow: string;
  stages: StageView[];
  structures: Record<string, unknown>;
  reasoning: string;
  status: 'running' | 'done' | 'error' | 'aborted';
  streaming: boolean;
  step: number;
  error?: string;
  startedAt: number;
  /** ST message the output lands in (streaming placeholder), when known. */
  mesId: number | null;
  /** Swipe of that message the output lands in (an interrupted swipe can be swiped away from). */
  swipeId: number | null;
}

export const live = reactive({ current: null as LiveGeneration | null });

export function startLive(ctx: GenerationContext, streaming: boolean): LiveGeneration {
  live.current = {
    genId: ctx.id,
    presetId: ctx.preset.id,
    transport: ctx.transport,
    workflow: ctx.workflow?.id ?? '',
    stages: ctx.stages.map((s) => ({ id: s.id, actor: s.actor, kind: s.kind, label: s.label, optional: Boolean(s.optional), text: '', status: 'pending' })),
    structures: {},
    reasoning: '',
    status: 'running',
    streaming,
    step: 0,
    startedAt: Date.now(),
    mesId: null,
    swipeId: null,
  };
  return live.current;
}

export function updateLive(g: LiveGeneration, turn: TurnResult, reasoning: string): void {
  for (const v of g.stages) {
    const r = turn.stages[v.id];
    if (!r) continue;
    v.text = r.text ?? '';
    if (r.patches) v.patches = r.patches;
    v.status = r.status;
  }
  g.structures = turn.structures;
  g.reasoning = reasoning;
}

/** Bind the generation to the message (and its current swipe) its output lands in. */
export function bindLive(g: LiveGeneration, mesId: number): void {
  g.mesId = mesId;
  g.swipeId = st().chat[mesId]?.swipe_id ?? 0;
}

/**
 * The generation shown on a message: bound to it and to the swipe still selected there. After an
 * interrupted swipe ST returns to the previous swipe, whose stored sidecar is shown again.
 */
export function liveOn(mesId: number, msg: STMessage | undefined = st().chat[mesId]): LiveGeneration | null {
  const g = live.current;
  if (!g || g.mesId !== mesId) return null;
  if (g.swipeId !== null && (msg?.swipe_id ?? 0) !== g.swipeId) return null;
  return g;
}
