<script setup lang="ts">
/** Drill-in editor of one user module: name, switch, insertion entries, trigger and file actions. */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ArrowLeft, CopyPlus, Download, MapPin, Plus, Trash2, TriangleAlert, X } from 'lucide-vue-next';
import { compileText, findPoint, type APreset, type Role, type UserEntry, type UserModule } from '@advanced-preset/protocol';
import { t, pt } from '@/i18n';
import { save } from '@/store/settings';
import { duplicateUserModule, exportUserModules, newEntry, removeUserModule } from '@/store/user-modules';
import { downloadJson, fileSlug } from '../../download';
import IconButton from '../../components/IconButton.vue';
import Section from '../../components/Section.vue';
import Switch from '../../components/Switch.vue';
import Help from '../../components/Help.vue';
import TriggerEditor from './TriggerEditor.vue';

const props = defineProps<{ preset: APreset; module: UserModule }>();
const emit = defineEmits<{ close: []; open: [id: string] }>();

watch(() => props.module, save, { deep: true });

const nameInput = ref<HTMLInputElement | null>(null);
onMounted(() => {
  if (!props.module.entries.some((e) => e.text)) void nextTick(() => nameInput.value?.select());
});

const points = computed(() => props.preset.insertionPoints.map((p) => ({
  id: p.id,
  label: pt(props.preset, 'insertionPoints', p.id, 'label', p.label),
  description: pt(props.preset, 'insertionPoints', p.id, 'description', p.description ?? '') || undefined,
})));
const pointOf = (e: UserEntry) => points.value.find((p) => p.id === e.point);
const missing = (e: UserEntry) => !findPoint(props.preset, e.point);
const ROLES: ('' | Role)[] = ['', 'system', 'user', 'assistant'];

function setRole(e: UserEntry, role: string) {
  if (role) e.role = role as Role;
  else delete e.role;
}
const errors = (e: UserEntry) => compileText(e.text).errors;
const errorText = (e: UserEntry) => errors(e).map((x) => (x.line ? t('um.lineError', { line: x.line, message: x.message }) : x.message)).join('\n');

function addEntry() {
  const used = new Set(props.module.entries.map((e) => e.point));
  const entry = newEntry(props.preset, props.module);
  entry.point = props.preset.insertionPoints.find((p) => !used.has(p.id))?.id ?? entry.point;
  props.module.entries.push(entry);
}
const removeEntry = (i: number) => props.module.entries.splice(i, 1);

const confirmDelete = ref(false);
function remove() {
  if (!confirmDelete.value) { confirmDelete.value = true; setTimeout(() => (confirmDelete.value = false), 3000); return; }
  removeUserModule(props.preset, props.module.id);
  emit('close');
}
function duplicate() {
  const copy = duplicateUserModule(props.preset, props.module.id, (name) => t('um.copyName', { name }));
  if (copy) emit('open', copy.id);
}
const exportOne = () => downloadJson(`${props.preset.id}.${fileSlug(props.module.name)}.ap-modules.json`, exportUserModules(props.preset, [props.module.id]));
</script>

<template>
  <div class="um-editor">
    <header class="um-head">
      <IconButton :icon="ArrowLeft" :label="t('um.back')" align="start" @click="emit('close')" />
      <input ref="nameInput" v-model="module.name" class="input bare um-name grow" :placeholder="t('um.untitled')" :aria-label="t('um.name')" />
      <Switch v-model="module.enabled" :label="t('panel.enabled')" />
    </header>

    <Section :title="t('um.content')" :help="t('um.content.help')">
      <div v-for="(e, i) in module.entries" :key="e.id" class="um-entry" :class="{ lost: missing(e) }">
        <div class="um-entry-head">
          <MapPin class="faint" />
          <select v-model="e.point" class="input bare grow" :aria-label="t('um.point')">
            <option v-for="p in points" :key="p.id" :value="p.id">{{ p.label }}</option>
            <option v-if="missing(e)" :value="e.point" disabled>{{ t('um.pointMissing', { id: e.point }) }}</option>
          </select>
          <Help :text="pointOf(e)?.description" align="end" />
          <select class="input bare um-role" :value="e.role ?? ''" :aria-label="t('um.role')" @change="setRole(e, ($event.target as HTMLSelectElement).value)">
            <option v-for="r in ROLES" :key="r" :value="r">{{ t(`um.role.${r || 'merge'}`) }}</option>
          </select>
          <IconButton v-if="module.entries.length > 1" :icon="X" :label="t('um.removeEntry')" small align="end" @click="removeEntry(i)" />
        </div>
        <div v-if="missing(e)" class="um-warn xs"><TriangleAlert />{{ t('um.pointLost') }}</div>
        <textarea v-model="e.text" class="input um-text" rows="4" spellcheck="false" :placeholder="t('um.text.placeholder')" />
        <div v-if="errors(e).length" class="rule-error xs pre">{{ errorText(e) }}</div>
      </div>
      <button v-if="points.length" type="button" class="btn ghost add" @click="addEntry"><Plus />{{ t('um.addEntry') }}</button>
    </Section>

    <Section :title="t('um.trigger')" :help="t('um.trigger.help')">
      <TriggerEditor v-model="module.trigger" :preset="preset" />
    </Section>

    <footer class="um-foot">
      <button type="button" class="btn ghost" :title="t('um.export')" @click="exportOne"><Download /><span>{{ t('um.export') }}</span></button>
      <button type="button" class="btn ghost" :title="t('um.duplicate')" @click="duplicate"><CopyPlus /><span>{{ t('um.duplicate') }}</span></button>
      <span class="grow" />
      <button type="button" class="btn ghost danger" :class="{ armed: confirmDelete }" :title="t('common.delete')" @click="remove"><Trash2 /><span>{{ confirmDelete ? t('um.confirmDelete') : t('common.delete') }}</span></button>
    </footer>
  </div>
</template>
