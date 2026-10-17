<script setup lang="ts">
import { Layers } from 'lucide-vue-next';
import { t } from '@/i18n';
import { ui } from './state';
</script>

<template>
  <div class="topbar-btn" :class="{ on: ui.panelOpen }" role="button" tabindex="0" :title="t('app.name')" :aria-label="t('app.name')"
    @click="ui.panelOpen = !ui.panelOpen" @keydown.enter="ui.panelOpen = !ui.panelOpen">
    <Layers />
  </div>
</template>
