<script setup lang="ts">
/** One build-variable update of a user module: append text, add list items or set dict keys. */
import { computed } from 'vue';
import { Braces, Plus, TriangleAlert, X } from 'lucide-vue-next';
import { findVar, type APreset, type BuildVarUpdate, type DictItem } from '@advanced-preset/protocol';
import { t, pt } from '@/i18n';
import IconButton from '../../components/IconButton.vue';
import Help from '../../components/Help.vue';

const props = defineProps<{ preset: APreset; update: BuildVarUpdate }>();
const emit = defineEmits<{ remove: [] }>();

const decl = computed(() => findVar(props.preset, props.update.var));
const lost = computed(() => decl.value?.type !== props.update.type);
const label = computed(() => (decl.value ? pt(props.preset, 'vars', decl.value.id, 'label', decl.value.label ?? decl.value.id) : props.update.var));
const help = computed(() => (decl.value ? pt(props.preset, 'vars', decl.value.id, 'description', decl.value.description ?? '') || undefined : undefined));

/** Keys the preset's own modules set on this dict, with the first value each (suggestions and prefill). */
const builtin = computed(() => {
  const out = new Map<string, string>();
  for (const m of props.preset.modules)
    for (const u of m.vars ?? [])
      if (u.var === props.update.var && u.type === 'dict')
        for (const it of u.items) if (it.value !== null && !out.has(it.key)) out.set(it.key, it.value);
  return out;
});
const listId = computed(() => `ap-bv-${props.update.var}`);

function keyChanged(it: DictItem) {
  it.key = it.key.trim();
  const v = builtin.value.get(it.key);
  if (v !== undefined && !it.value) it.value = v;
}
function add() {
  const u = props.update;
  if (u.type === 'list') u.items.push('');
  else if (u.type === 'dict') u.items.push({ key: '', value: '' });
}
</script>

<template>
  <div class="um-entry" :class="{ lost }">
    <div class="um-entry-head">
      <Braces class="faint" />
      <span class="um-var-label grow ellipsis">{{ label }}</span>
      <Help :text="help" align="end" />
      <IconButton :icon="X" :label="t('um.removeEntry')" small align="end" @click="emit('remove')" />
    </div>
    <div v-if="lost" class="um-warn xs"><TriangleAlert />{{ t('um.bv.lost') }}</div>
    <textarea v-if="update.type === 'string'" v-model="update.text" class="input um-text" rows="3" spellcheck="false" :placeholder="t('um.bv.append')" />
    <template v-else-if="update.type === 'list'">
      <div v-for="(_, i) in update.items" :key="i" class="um-var-row list">
        <textarea v-model="update.items[i]" class="input um-var-value" rows="1" spellcheck="false" :placeholder="t('um.bv.item')" />
        <IconButton :icon="X" :label="t('um.removeEntry')" small align="end" @click="update.items.splice(i, 1)" />
      </div>
    </template>
    <template v-else>
      <div v-for="(it, i) in update.items" :key="i" class="um-var-row">
        <input v-model="it.key" class="input um-var-key" :list="listId" spellcheck="false" :placeholder="t('um.bv.key')" @change="keyChanged(it)" />
        <textarea
          :value="it.value ?? ''" class="input um-var-value" rows="1" spellcheck="false"
          :placeholder="builtin.has(it.key.trim()) ? t('um.bv.removes') : t('um.bv.value')"
          @input="it.value = ($event.target as HTMLTextAreaElement).value"
        />
        <IconButton :icon="X" :label="t('um.removeEntry')" small align="end" @click="update.items.splice(i, 1)" />
      </div>
      <datalist :id="listId"><option v-for="[k] in builtin" :key="k" :value="k" /></datalist>
    </template>
    <button v-if="update.type !== 'string'" type="button" class="btn ghost add um-var-add" @click="add"><Plus />{{ update.type === 'dict' ? t('um.bv.addKey') : t('um.bv.addItem') }}</button>
  </div>
</template>
