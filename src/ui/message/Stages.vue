<script setup lang="ts">
/**
 * Stage panel (§16.3): above the message text. Expanded and following the active stage while
 * generating; afterwards a row of capsules that open one stage at a time.
 */
import { computed, ref, watch } from 'vue';
import {
  CircleDashed, CircleSlash, Feather, GitCompareArrows, Info, LoaderCircle, NotebookPen, Redo2, TriangleAlert, Undo2,
} from 'lucide-vue-next';
import { settings } from '@/store/settings';
import { t } from '@/i18n';
import IconButton from '../components/IconButton.vue';
import Tip from '../components/Tip.vue';
import StageBody from './StageBody.vue';
import { useMessageView, type StageItem } from './model';
import { togglePatches } from '../actions';

const props = defineProps<{ mesid: number }>();
const view = useMessageView(() => props.mesid);

const picked = ref<string | null>(null);
const manual = ref(false);

const active = computed(() => {
  const v = view.value;
  if (!v?.running) return null;
  const streaming = v.stages.find((s) => s.status === 'streaming');
  if (streaming) return streaming.id;
  return [...v.stages].reverse().find((s) => s.status === 'done')?.id ?? null;
});
// Content stages land in the message itself; only show them when they carry something else.
const visible = computed(() => (view.value?.stages ?? []).filter((s) => s.kind !== 'content' || s.status === 'interrupted' || view.value?.running));
const openId = computed(() => (manual.value ? picked.value : view.value?.running ? active.value : picked.value));
const openStage = computed(() => visible.value.find((s) => s.id === openId.value) ?? null);

watch(() => view.value?.running, (running, was) => {
  if (was && !running) { manual.value = false; picked.value = settings().ui.collapseStages ? null : picked.value; }
});

function pick(s: StageItem) {
  manual.value = true;
  picked.value = openId.value === s.id ? null : s.id;
}

const kindIcon = { text: NotebookPen, content: Feather, patch: GitCompareArrows } as const;
const statusIcon = (s: StageItem) => (s.status === 'streaming' ? LoaderCircle : s.status === 'interrupted' ? CircleSlash : s.status === 'missing' ? CircleDashed : kindIcon[s.kind]);

const warnings = computed(() => view.value?.sidecar?.diagnostics?.warnings ?? []);
const draft = computed(() => (view.value?.sidecar?.draft !== undefined ? view.value.sidecar : null));
const info = computed(() => {
  const v = view.value;
  if (!v) return '';
  const d = v.sidecar?.diagnostics;
  const parts = [`${t(`transport.${v.transport}`)} · ${v.workflow}`];
  if (d) parts.push(t('stages.requests', { n: d.requests }) + (d.durationMs ? ` · ${(d.durationMs / 1000).toFixed(1)}s` : ''));
  return parts.join('\n');
});
</script>

<template>
  <div v-if="view && (visible.length || view.error)" class="stages" :class="{ live: view.running }">
    <div class="stage-bar">
      <button
        v-for="s in visible" :key="s.id" type="button" class="chip stage-chip"
        :class="[s.status, { open: openId === s.id }]" :style="{ '--actor': s.color }" @click="pick(s)"
      >
        <component :is="statusIcon(s)" :class="{ spin: s.status === 'streaming' }" />
        <span class="ellipsis">{{ s.label }}</span>
      </button>
      <span v-if="view.error" class="chip stage-chip error"><TriangleAlert /><span class="ellipsis">{{ view.error }}</span></span>
      <span class="grow" />
      <Tip v-if="warnings.length" :text="warnings.join('\n')" align="end">
        <span class="badge warn"><TriangleAlert />{{ warnings.length }}</span>
      </Tip>
      <IconButton
        v-if="draft" small align="end" :icon="draft.patchesApplied ? Undo2 : Redo2"
        :label="draft.patchesApplied ? t('stages.revertDraft') : t('stages.reapplyPatches')" @click="togglePatches(mesid)"
      />
      <Tip v-if="!view.running" :text="info" align="end">
        <span class="icon-btn sm faint" tabindex="0"><Info /></span>
      </Tip>
    </div>
    <StageBody v-if="openStage" :key="openStage.id" :stage="openStage" :follow="view.running && !manual" />
  </div>
</template>
