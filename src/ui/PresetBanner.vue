<script setup lang="ts">
/** Below ST's Chat Completion preset select: shown while the selected preset is an AP Carrier. */
import { Layers } from 'lucide-vue-next';
import { t } from '@/i18n';
import { activePreset, openPanel } from './state';
</script>

<template>
  <div v-if="activePreset" class="preset-banner">
    <Layers class="preset-banner-icon" />
    <span class="preset-banner-text">{{ t('banner.usesAp') }}</span>
    <button type="button" class="btn primary" @click="openPanel()">{{ t('panel.open') }}</button>
  </div>
</template>
