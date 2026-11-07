<script setup lang="ts">
/** One build-variable update of a user module: append text, add list items or set dict keys. */
import { computed } from 'vue';
import { Plus, TriangleAlert, X } from 'lucide-vue-next';
import { findVar, itemText, listItem, partEnabled, setPartEnabled, type APreset, type DictItem, type UserVarUpdate } from '@advanced-preset/protocol';
import { t, pt } from '@/i18n';
import IconButton from '../../components/IconButton.vue';
import Help from '../../components/Help.vue';
import Switch from '../../components/Switch.vue';

const props = defineProps<{ preset: APreset; update: UserVarUpdate }>();
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
function setItem(i: number, text: string, on: boolean) {
  if (props.update.type === 'list') props.update.items[i] = listItem(text, on);
}
function add() {
  const u = props.update;
  if (u.type === 'list') u.items.push('');
  else if (u.type === 'dict') u.items.push({ key: '', value: '' });
}
</script>

<template>
  <div class="um-entry" :class="{ lost, off: !partEnabled(update) }">
    <div class="um-entry-head">
      <Switch :model-value="partEnabled(update)" :label="t('panel.enabled')" @update:model-value="setPartEnabled(update, $event)" />
      <span class="um-var-label grow ellipsis">{{ label }}</span>
      <Help :text="help" align="end" />
      <IconButton :icon="X" :label="t('um.removeEntry')" small align="end" @click="emit('remove')" />
    </div>
    <div v-if="lost" class="um-warn xs"><TriangleAlert />{{ t('um.bv.lost') }}</div>
    <textarea v-if="update.type === 'string'" v-model="update.text" class="input um-text" rows="3" spellcheck="false" :placeholder="t('um.bv.append')" />
    <template v-else-if="update.type === 'list'">
      <div v-for="(it, i) in update.items" :key="i" class="um-var-row" :class="{ off: !partEnabled(it) }">
        <Switch :model-value="partEnabled(it)" :label="t('panel.enabled')" small @update:model-value="setItem(i, itemText(it), $event)" />
        <textarea
          :value="itemText(it)" class="input um-var-value" rows="1" spellcheck="false" :placeholder="t('um.bv.item')"
          @input="setItem(i, ($event.target as HTMLTextAreaElement).value, partEnabled(it))"
        />
        <IconButton :icon="X" :label="t('um.removeEntry')" small align="end" @click="update.items.splice(i, 1)" />
      </div>
    </template>
    <template v-else>
      <div v-for="(it, i) in update.items" :key="i" class="um-var-pair" :class="{ off: !partEnabled(it) }">
        <div class="um-var-pair-head">
          <Switch :model-value="partEnabled(it)" :label="t('panel.enabled')" small @update:model-value="setPartEnabled(it, $event)" />
          <input v-model="it.key" class="input bare um-var-key" :list="listId" spellcheck="false" :placeholder="t('um.bv.key')" @change="keyChanged(it)" />
          <IconButton :icon="X" :label="t('um.removeEntry')" small align="end" @click="update.items.splice(i, 1)" />
        </div>
        <textarea
          :value="it.value ?? ''" class="input um-var-value" rows="1" spellcheck="false"
          :placeholder="builtin.has(it.key.trim()) ? t('um.bv.removes') : t('um.bv.value')"
          @input="it.value = ($event.target as HTMLTextAreaElement).value"
        />
      </div>
      <datalist :id="listId"><option v-for="[k] in builtin" :key="k" :value="k" /></datalist>
    </template>
    <button v-if="update.type !== 'string'" type="button" class="btn ghost add um-var-add" @click="add"><Plus />{{ update.type === 'dict' ? t('um.bv.addKey') : t('um.bv.addItem') }}</button>
  </div>
</template>
