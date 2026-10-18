<script setup lang="ts">
/**
 * AP's block in ST's extension settings. Rendered in the light DOM with ST's own inline-drawer,
 * checkbox and menu-button classes so it looks like every other extension: collapsed by default,
 * expanding to a short status, the enable switch and an "open panel" button.
 */
import { computed } from 'vue';
import { settings, save } from '@/store/settings';
import { t } from '@/i18n';
import { activePreset, openPanel, presetSummary } from './state';

const enabled = computed({ get: () => settings().enabled, set: (v: boolean) => { settings().enabled = v; save(); } });
const version = __AP_VERSION__;
</script>

<template>
  <div class="inline-drawer">
    <div class="inline-drawer-toggle inline-drawer-header">
      <b>{{ t('app.name') }}</b>
      <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down" />
    </div>
    <div class="inline-drawer-content">
      <div class="flex-container flexFlowColumn flexNoGap">
        <small v-if="activePreset">{{ t('settings.active', { name: activePreset.name, version: activePreset.version }) }}</small>
        <small v-if="activePreset" class="opacity50p">{{ t('settings.config', { name: presetSummary.config }) }}</small>
        <small v-else class="opacity50p">{{ t('settings.inactive') }}</small>
      </div>
      <div class="flex-container alignItemsCenter justifySpaceBetween marginTop5">
        <label class="checkbox_label" for="ap_settings_enabled">
          <input id="ap_settings_enabled" v-model="enabled" type="checkbox" />
          <small>{{ t('panel.enabled') }}</small>
        </label>
        <div class="menu_button menu_button_icon margin0" role="button" tabindex="0" @click="openPanel()" @keydown.enter="openPanel()">
          <i class="fa-solid fa-layer-group" />
          <small>{{ t('panel.open') }}</small>
        </div>
      </div>
      <small class="opacity50p">v{{ version }}</small>
    </div>
  </div>
</template>
