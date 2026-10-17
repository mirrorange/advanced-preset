/**
 * UI state shared by mounts, cards and the panel. ST's chat array is not reactive, so message views
 * depend on `ui.chatRev`, bumped on every relevant ST event.
 */
import { computed, reactive } from 'vue';
import { st, type STMessage } from '@/st/host';
import { getPreset } from '@/store/presets';
import { activeCarrierPresetId } from '@/store/carrier';
import { getSidecar, type Sidecar } from '@/store/sidecar';

export type PanelTab = 'presets' | 'config' | 'modules' | 'writing' | 'memory' | 'debug';

export const ui = reactive({
  chatRev: 0,
  presetId: null as string | null,
  panelOpen: false,
  tab: 'presets' as PanelTab,
});

export const bumpChat = () => { ui.chatRev++; };
export const refreshActivePreset = () => { ui.presetId = activeCarrierPresetId(); };

export const activePreset = computed(() => (ui.presetId ? getPreset(ui.presetId) : undefined));

export function messageAt(mesId: number): STMessage | undefined {
  void ui.chatRev;
  return st().chat[mesId];
}

export function sidecarAt(mesId: number): Sidecar | undefined {
  return getSidecar(messageAt(mesId));
}

export function openPanel(tab?: PanelTab): void {
  if (tab) ui.tab = tab;
  ui.panelOpen = true;
}
