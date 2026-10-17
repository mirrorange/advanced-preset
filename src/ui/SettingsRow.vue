<script setup lang="ts">
/** The only row AP adds to ST's extension settings drawer: enable + open panel. */
import { computed } from 'vue';
import { PanelRightOpen } from 'lucide-vue-next';
import { settings, save } from '@/store/settings';
import { t } from '@/i18n';
import Switch from './components/Switch.vue';
import { openPanel } from './state';

const enabled = computed({ get: () => settings().enabled, set: (v: boolean) => { settings().enabled = v; save(); } });
</script>

<template>
  <div class="settings-row">
    <b class="grow">{{ t('app.name') }}</b>
    <Switch v-model="enabled" :label="t('panel.enabled')" />
    <button type="button" class="btn" @click="openPanel()"><PanelRightOpen />{{ t('panel.open') }}</button>
  </div>
</template>
