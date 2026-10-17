<script setup lang="ts">
/** Generation dock (§16.2): live stages for non-streaming generations, at the end of #chat. */
import { computed } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';
import { live } from '@/core/live';
import { getPreset } from '@/store/presets';
import { t } from '@/i18n';
import StageBody from './StageBody.vue';
import { colorOf, stageLabel } from './model';

const g = computed(() => (live.current && !live.current.streaming && live.current.status === 'running' ? live.current : null));
const stages = computed(() => {
  const cur = g.value;
  if (!cur) return [];
  const preset = getPreset(cur.presetId);
  return cur.stages.map((s) => ({ ...s, label: stageLabel(preset, cur.workflow, s.id, s.label), color: colorOf(preset, s.actor) }));
});
const current = computed(() => stages.value.find((s) => s.status === 'streaming') ?? [...stages.value].reverse().find((s) => s.text));
</script>

<template>
  <div v-if="g" class="dock stages live">
    <div class="stage-bar">
      <LoaderCircle class="spin faint" />
      <span v-for="s in stages" :key="s.id" class="chip stage-chip" :class="[s.status, { open: current?.id === s.id }]" :style="{ '--actor': s.color }">
        <span class="ellipsis">{{ s.label }}</span>
      </span>
      <span v-if="!stages.length" class="small muted">{{ t('stages.waiting') }}</span>
    </div>
    <StageBody v-if="current" :stage="current" follow />
  </div>
</template>
