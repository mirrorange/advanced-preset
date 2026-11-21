<script setup lang="ts" generic="C extends { id: string; name: string; api: string }">
/** Connection picker of a media section: select, add, copy, rename, delete. Shared by image and speech settings. */
import { ref } from 'vue';
import { Check, Copy, Pencil, Plus, Trash2, X } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ connections: C[]; active: C | undefined; apiLabel: (api: string) => string }>();
const emit = defineEmits<{ select: [id: string]; add: []; copy: [c: C]; remove: [c: C]; rename: [c: C, name: string] }>();

const naming = ref(false);
const name = ref('');
function startRename() { if (!props.active) return; name.value = props.active.name; naming.value = true; }
function commit() {
  const n = name.value.trim();
  if (n && props.active) emit('rename', props.active, n);
  naming.value = false;
}
</script>

<template>
  <div v-if="naming" class="row tight">
    <input v-model="name" class="input grow" :aria-label="t('common.rename')" @keydown.enter="commit" @keydown.esc="naming = false" />
    <IconButton :icon="X" :label="t('common.cancel')" @click="naming = false" />
    <IconButton :icon="Check" :label="t('common.save')" active @click="commit" />
  </div>
  <div v-else class="row tight">
    <select v-if="connections.length" class="input grow" :value="active?.id" :aria-label="t('media.connection')" @change="emit('select', ($event.target as HTMLSelectElement).value)">
      <option v-for="c in connections" :key="c.id" :value="c.id">{{ c.name }} · {{ apiLabel(c.api) }}</option>
    </select>
    <span v-else class="grow faint small">{{ t('media.noConnection') }}</span>
    <IconButton :icon="Plus" :label="t('media.addConnection')" @click="emit('add')" />
    <template v-if="active">
      <IconButton :icon="Copy" :label="t('common.copy')" @click="emit('copy', active)" />
      <IconButton :icon="Pencil" :label="t('common.rename')" @click="startRename" />
      <IconButton :icon="Trash2" :label="t('common.delete')" danger align="end" @click="emit('remove', active)" />
    </template>
  </div>
</template>
