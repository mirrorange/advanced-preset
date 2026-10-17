<script setup lang="ts">
/** Body of one stage: streamed text, or the patch list for patch stages. */
import { nextTick, ref, watch } from 'vue';
import { ArrowDown, Ban } from 'lucide-vue-next';
import type { StageItem } from './model';
import { t } from '@/i18n';

const props = defineProps<{ stage: StageItem; follow?: boolean }>();
const box = ref<HTMLElement | null>(null);

watch(() => props.stage.text, async () => {
  if (!props.follow) return;
  await nextTick();
  const el = box.value;
  if (el) el.scrollTop = el.scrollHeight;
});

const failed = (s?: string) => s !== undefined && s !== 'applied';
</script>

<template>
  <div class="stage-body" :style="{ '--actor': stage.color }">
    <div v-if="stage.kind === 'patch' && stage.patches?.length" class="patches">
      <div v-for="(p, i) in stage.patches" :key="i" class="patch" :class="{ failed: failed(p.status) }">
        <div class="patch-old pre">{{ p.old_string }}</div>
        <ArrowDown class="patch-arrow" />
        <div class="patch-new pre">{{ p.new_string }}</div>
        <div v-if="failed(p.status)" class="patch-status xs"><Ban />{{ t(`patch.${p.status}`) }}</div>
      </div>
    </div>
    <div v-else-if="stage.text" ref="box" class="stage-text pre scroll">{{ stage.text }}</div>
    <div v-else class="faint small stage-empty">{{ t(`stage.${stage.status}`) }}</div>
  </div>
</template>
