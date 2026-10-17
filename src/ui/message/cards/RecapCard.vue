<script setup lang="ts">
import { ScrollText } from 'lucide-vue-next';
import { t } from '@/i18n';
import Section from '../../components/Section.vue';

defineProps<{ text: string; coversUpTo?: number }>();
</script>

<template>
  <Section :title="t('cards.recap')" :icon="ScrollText" collapsible :open="false">
    <template #actions><span v-if="coversUpTo !== undefined" class="badge neutral">#0–{{ coversUpTo }}</span></template>
    <div class="pre small">{{ text }}</div>
  </Section>
</template>
