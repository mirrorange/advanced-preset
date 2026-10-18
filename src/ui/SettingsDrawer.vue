<script setup lang="ts">
/**
 * AP's block in ST's extension settings. Rendered in the light DOM with the same markup as ST's
 * built-in extensions (inline-drawer, checkbox_label, <hr> + <h4> sections, text_muted,
 * menu_button), so it inherits ST's spacing and typography instead of AP's own.
 */
import { computed } from 'vue';
import { settings, save } from '@/store/settings';
import { t } from '@/i18n';
import { activePreset, openPanel, presetSummary } from './state';

const enabled = computed({ get: () => settings().enabled, set: (v: boolean) => { settings().enabled = v; save(); } });
</script>

<template>
  <div class="inline-drawer">
    <div class="inline-drawer-toggle inline-drawer-header">
      <b>{{ t('app.name') }}</b>
      <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down" />
    </div>
    <div class="inline-drawer-content">
      <label class="checkbox_label" for="ap_settings_enabled">
        <input id="ap_settings_enabled" v-model="enabled" type="checkbox" />
        <span>{{ t('settings.enable') }}</span>
      </label>
      <hr />
      <h4>{{ t('settings.preset') }}</h4>
      <div v-if="activePreset">
        {{ activePreset.name }}
        <span class="text_muted">v{{ activePreset.version }} · {{ presetSummary.config }}</span>
      </div>
      <i v-else class="text_muted">{{ t('settings.inactive') }}</i>
      <div class="menu_button menu_button_icon" role="button" tabindex="0" @click="openPanel()" @keydown.enter="openPanel()">
        <i class="fa-solid fa-layer-group" />
        <span>{{ t('panel.open') }}</span>
      </div>
    </div>
  </div>
</template>
