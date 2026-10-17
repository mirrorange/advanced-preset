/** View model of one assistant message: live generation first, otherwise the stored sidecar. */
import { computed } from 'vue';
import type { APreset, PatchResult, StageKind, StageStatus } from '@advanced-preset/protocol';
import { live } from '@/core/live';
import { getPreset } from '@/store/presets';
import type { Sidecar } from '@/store/sidecar';
import { presetLocale } from '@/i18n';
import { sidecarAt } from '../state';
import { actorColor } from '../theme';

export interface StageItem {
  id: string;
  actor: string;
  kind: StageKind;
  label: string;
  text: string;
  status: StageStatus;
  patches?: (PatchResult | { old_string: string; new_string: string; status?: undefined })[];
  color: string;
}

export interface MessageView {
  live: boolean;
  running: boolean;
  genId: string;
  preset?: APreset;
  workflow: string;
  transport: string;
  stages: StageItem[];
  error?: string;
  sidecar?: Sidecar;
}

export function stageLabel(preset: APreset | undefined, workflow: string, id: string, fallback: string): string {
  return (preset && presetLocale(preset)?.workflows?.[workflow]?.stages?.[id]) || fallback;
}

export function colorOf(preset: APreset | undefined, actor: string): string {
  const fallback = preset && actor === preset.narrator ? 'primary' : 'accent';
  return actorColor(preset?.actors[actor]?.color, fallback);
}

export function useMessageView(mesId: () => number) {
  return computed<MessageView | null>(() => {
    const id = mesId();
    const sc = sidecarAt(id);
    const g = live.current;
    if (g && g.mesId === id && (g.status === 'running' || !sc || sc.genId !== g.genId)) {
      const preset = getPreset(g.presetId);
      return {
        live: true, running: g.status === 'running', genId: g.genId, preset, workflow: g.workflow, transport: g.transport, error: g.error,
        stages: g.stages.map((s) => ({ ...s, label: stageLabel(preset, g.workflow, s.id, s.label), color: colorOf(preset, s.actor) })),
      };
    }
    if (!sc) return null;
    const preset = getPreset(sc.presetId);
    return {
      live: false, running: false, genId: sc.genId, preset, workflow: sc.workflow, transport: sc.transport, sidecar: sc,
      stages: sc.stages.map((s) => ({
        id: s.id, actor: s.actor, kind: s.kind, label: stageLabel(preset, sc.workflow, s.id, s.label), text: s.text ?? '',
        status: s.status, patches: s.patches, color: colorOf(preset, s.actor),
      })),
    };
  });
}
