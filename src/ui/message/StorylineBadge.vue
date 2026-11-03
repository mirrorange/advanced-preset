<script setup lang="ts">
/** Storyline badge (I-152): on messages outside the main storyline; opens the storylines tab. */
import { computed } from 'vue';
import { EyeOff, GitBranch } from 'lucide-vue-next';
import { t } from '@/i18n';
import { storylineMeta } from '@/store/storylines';
import { isHiddenLine, isIfLine, lineName } from '@/core/storylines';
import { openStorylines, ui } from '../state';
import { lineKeys, storylinesActive } from '../storylines';

const props = defineProps<{ mesid: number }>();
const info = computed(() => {
  void ui.chatRev;
  if (!storylinesActive.value) return null;
  const key = lineKeys()[props.mesid];
  if (!key) return null;
  const meta = storylineMeta();
  return { key, name: lineName(key, meta) || t('storylines.unnamed'), if: isIfLine(key, meta), hidden: isHiddenLine(key, meta) };
});
</script>

<template>
  <button v-if="info" type="button" class="storyline-badge" :class="{ 'if-line': info.if }" :title="t('storylines.openTab')" @click="openStorylines(info.key)">
    <GitBranch class="lucide" aria-hidden="true" />
    <span class="storyline-name">{{ info.name }}</span>
    <span v-if="info.if" class="storyline-if">{{ t('storylines.ifLine') }}</span>
    <EyeOff v-if="info.hidden" class="lucide storyline-hidden" :aria-label="t('storylines.hidden')" />
  </button>
</template>
