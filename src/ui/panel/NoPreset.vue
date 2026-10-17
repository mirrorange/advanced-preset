<script setup lang="ts">
import { Package } from 'lucide-vue-next';
import { t } from '@/i18n';
import { ui } from '../state';
</script>

<template>
  <div class="empty">
    <Package />
    <span>{{ t('panel.noPreset') }}</span>
    <button type="button" class="btn" @click="ui.tab = 'presets'">{{ t('panel.choosePreset') }}</button>
  </div>
</template>
