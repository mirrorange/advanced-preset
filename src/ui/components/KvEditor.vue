<script setup lang="ts">
/** Key–value editor for memory maps. Edits are emitted, never applied locally (event-sourced stores). */
import { ref } from 'vue';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-vue-next';
import IconButton from './IconButton.vue';
import { t } from '@/i18n';

const props = defineProps<{ entries: Record<string, string>; readonly?: boolean }>();
const emit = defineEmits<{ set: [key: string, value: string]; remove: [key: string] }>();

const editing = ref<string | null>(null);
const draftKey = ref('');
const draftValue = ref('');

function edit(key: string | null) {
  editing.value = key ?? '';
  draftKey.value = key ?? '';
  draftValue.value = key ? props.entries[key] ?? '' : '';
}
function commit() {
  const key = draftKey.value.trim();
  if (!key) return;
  if (editing.value && editing.value !== key) emit('remove', editing.value);
  emit('set', key, draftValue.value);
  editing.value = null;
}
</script>

<template>
  <div class="kv">
    <template v-for="(value, key) in entries" :key="key">
      <div v-if="editing !== key" class="kv-row">
        <div class="kv-key ellipsis">{{ key }}</div>
        <div class="kv-value pre small">{{ value }}</div>
        <div v-if="!readonly" class="kv-actions">
          <IconButton :icon="Pencil" :label="t('common.edit')" small align="end" @click="edit(String(key))" />
          <IconButton :icon="Trash2" :label="t('common.delete')" small danger align="end" @click="emit('remove', String(key))" />
        </div>
      </div>
      <div v-else class="kv-edit col">
        <input v-model="draftKey" class="input" :placeholder="t('memory.key')" />
        <textarea v-model="draftValue" class="input" rows="3" :placeholder="t('memory.content')" />
        <div class="row end">
          <IconButton :icon="X" :label="t('common.cancel')" @click="editing = null" />
          <IconButton :icon="Check" :label="t('common.save')" active @click="commit" />
        </div>
      </div>
    </template>
    <div v-if="editing === ''" class="kv-edit col">
      <input v-model="draftKey" class="input" :placeholder="t('memory.key')" />
      <textarea v-model="draftValue" class="input" rows="3" :placeholder="t('memory.content')" />
      <div class="row end">
        <IconButton :icon="X" :label="t('common.cancel')" @click="editing = null" />
        <IconButton :icon="Check" :label="t('common.save')" active @click="commit" />
      </div>
    </div>
    <div v-if="!Object.keys(entries).length && editing === null" class="faint small kv-empty">{{ t('memory.empty') }}</div>
    <button v-if="!readonly && editing === null" type="button" class="btn ghost add" @click="edit(null)"><Plus />{{ t('common.add') }}</button>
  </div>
</template>
