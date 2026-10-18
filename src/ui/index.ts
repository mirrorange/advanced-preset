/** UI bootstrap: custom elements, theme, message mounts, preset-panel entry, settings row and panel. */
import { st } from '@/st/host';
import { defineHost } from './host';
import { installTheme } from './theme';
import { installMounts, refreshMessages } from './mounts';
import { mountEntry } from './entry';
import { refreshActivePreset } from './state';
import Stages from './message/Stages.vue';
import Cards from './message/Cards.vue';
import Dock from './message/Dock.vue';
import Panel from './panel/Panel.vue';
import SettingsRow from './SettingsRow.vue';

export { refreshMessages };

function mountSettingsRow(): void {
  const target = document.getElementById('extensions_settings2') ?? document.getElementById('extensions_settings');
  if (!target || target.querySelector('ap-settings')) return;
  target.append(document.createElement('ap-settings'));
}

export function mountUi(): void {
  defineHost('ap-stages', Stages, ['mesid']);
  defineHost('ap-cards', Cards, ['mesid']);
  defineHost('ap-dock', Dock);
  defineHost('ap-panel', Panel);
  defineHost('ap-settings', SettingsRow);
  installTheme();
  refreshActivePreset();

  const { eventSource, eventTypes: E } = st();
  for (const e of [E.OAI_PRESET_CHANGED_AFTER, E.SETTINGS_UPDATED, E.APP_READY, E.SETTINGS_LOADED_AFTER]) if (e) eventSource.on(e, refreshActivePreset);

  mountEntry();
  mountSettingsRow();
  installMounts();
}
