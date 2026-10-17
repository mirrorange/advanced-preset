<script setup lang="ts">
/** One capsule per memory operation of the turn; global changes can be undone in place. */
import { computed } from 'vue';
import type { APreset } from '@advanced-preset/protocol';
import { Globe, MessageCircle, Pencil, Trash2, Undo2 } from 'lucide-vue-next';
import type { ChatEvent } from '@/store/eventlog';
import { revertGlobalEvent } from '@/store/eventlog';
import { presetState } from '@/store/config';
import { t } from '@/i18n';
import Tip from '../../components/Tip.vue';

const props = defineProps<{ events: ChatEvent[]; preset: APreset }>();

interface Op { scope: 'chat' | 'global'; op: 'replace' | 'delete'; key: string; content?: string; index?: number; undone?: boolean }
const ops = computed<Op[]>(() => {
  const state = presetState(props.preset);
  const log = state.globalMemory.log;
  return props.events.flatMap((e): Op[] => {
    if (e.type === 'memory.replace') return [{ scope: 'chat', op: 'replace', key: e.key, content: e.content }];
    if (e.type === 'memory.delete') return [{ scope: 'chat', op: 'delete', key: e.key }];
    if (e.type === 'global.ref') {
      const g = log[e.index];
      if (!g) return [];
      const undone = log.slice(e.index + 1, state.globalMemory.cursor).some((x) => x.key === g.key && x.source === 'undo');
      return [{ scope: 'global', op: g.op, key: g.key, content: g.content, index: e.index, undone }];
    }
    return [];
  });
});

function undo(o: Op) {
  if (o.index !== undefined) revertGlobalEvent(presetState(props.preset), o.index);
}
</script>

<template>
  <div v-if="ops.length" class="memory-ops">
    <Tip v-for="(o, i) in ops" :key="i" :text="o.op === 'delete' ? t('memory.deleted') : o.content" align="start">
      <span class="chip memory-chip" :class="[o.op, { undone: o.undone }]">
        <component :is="o.scope === 'global' ? Globe : MessageCircle" class="faint" />
        <span class="ellipsis">{{ o.key }}</span>
        <component :is="o.op === 'delete' ? Trash2 : Pencil" class="op-icon" />
        <button v-if="o.scope === 'global' && !o.undone" type="button" class="icon-btn sm" :aria-label="t('common.undo')" @click="undo(o)"><Undo2 /></button>
      </span>
    </Tip>
  </div>
</template>
