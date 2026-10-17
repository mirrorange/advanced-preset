/** UI bootstrap: custom elements, theme, message mounts, top-bar entry, settings row and panel. */
import { st } from '@/st/host';
import { defineHost } from './host';
import { installTheme } from './theme';
import { installMounts, refreshMessages } from './mounts';
import { refreshActivePreset } from './state';
import Stages from './message/Stages.vue';
import Cards from './message/Cards.vue';
import Dock from './message/Dock.vue';
import Panel from './panel/Panel.vue';
import TopbarButton from './TopbarButton.vue';
import SettingsRow from './SettingsRow.vue';

export { refreshMessages };

function mountTopbar(): void {
  const holder = document.getElementById('top-settings-holder');
  if (!holder || holder.querySelector('#ap-topbar')) return;
  // Same shell as ST's drawers so spacing matches; the click is handled by AP, not ST's drawer logic.
  const drawer = document.createElement('div');
  drawer.id = 'ap-topbar';
  drawer.className = 'drawer';
  const toggle = document.createElement('div');
  toggle.className = 'drawer-toggle';
  const icon = document.createElement('ap-topbar');
  icon.className = 'drawer-icon closedIcon';
  toggle.append(icon);
  drawer.append(toggle);
  holder.append(drawer);
}

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
  defineHost('ap-topbar', TopbarButton);
  defineHost('ap-settings', SettingsRow);
  installTheme();
  refreshActivePreset();

  const { eventSource, eventTypes: E } = st();
  for (const e of [E.OAI_PRESET_CHANGED_AFTER, E.SETTINGS_UPDATED, E.APP_READY, E.SETTINGS_LOADED_AFTER]) if (e) eventSource.on(e, refreshActivePreset);

  mountTopbar();
  mountSettingsRow();
  if (!document.querySelector('ap-panel')) document.body.append(document.createElement('ap-panel'));
  installMounts();
}
