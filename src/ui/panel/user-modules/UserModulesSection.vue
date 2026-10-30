<script setup lang="ts">
/**
 * "My modules" list: open, toggle, reorder (drag the grip), import / export, create. When the preset
 * ships user module templates, "new" first asks (inline) whether to start blank or from a template.
 */
import { computed, nextTick, ref } from 'vue';
import { Download, FilePlus, GripVertical, LayoutTemplate, Plus, Upload, TriangleAlert, X, Zap } from 'lucide-vue-next';
import { lostRefs, parseUserModuleFile, presetUserModuleTemplates, ruleComplete, type APreset, type UserModule, type UserModuleTemplate } from '@advanced-preset/protocol';
import { confirmUserModuleTemplates, isTrustDeclined } from '@/app/trust';
import { localSource, t, pt } from '@/i18n';
import { toast } from '@/st/host';
import { save } from '@/store/settings';
import { createUserModule, createUserModuleFromTemplate, exportUserModules, importUserModules, moveUserModule, userModules } from '@/store/user-modules';
import { downloadJson } from '../../download';
import IconButton from '../../components/IconButton.vue';
import Section from '../../components/Section.vue';
import Switch from '../../components/Switch.vue';
import Tip from '../../components/Tip.vue';
import { describeTrigger } from './subjects';

const props = defineProps<{ preset: APreset }>();
const emit = defineEmits<{ open: [id: string] }>();

const list = computed(() => userModules(props.preset));
const hasPoints = computed(() => props.preset.insertionPoints.length > 0 || props.preset.vars.length > 0);

const pointLabel = (id: string) => {
  const p = props.preset.insertionPoints.find((x) => x.id === id);
  return p ? pt(props.preset, 'insertionPoints', id, 'label', p.label) : id;
};
const varLabel = (id: string) => {
  const v = props.preset.vars.find((x) => x.id === id);
  return v ? pt(props.preset, 'vars', id, 'label', v.label ?? id) : id;
};
const pointsOf = (m: UserModule) => [...new Set(m.entries.map((e) => e.point))].map(pointLabel).concat(m.vars.map((u) => varLabel(u.var))).join(' · ');
const lost = (m: UserModule) => lostRefs(props.preset, m);
const lostText = (m: UserModule) => t('um.lostHint', { points: lost(m).join(', ') });
const hasTrigger = (m: UserModule) => m.trigger.rules.some(ruleComplete);

function setEnabled(m: UserModule, v: boolean) { m.enabled = v; save(); }

const templates = computed(() => presetUserModuleTemplates(props.preset).map((tpl) => ({ tpl, body: localSource(props.preset, tpl, 'userModuleTemplates') })));
const picking = ref(false);
const pickerEl = ref<HTMLElement | null>(null);

function createBlank() {
  picking.value = false;
  const m = createUserModule(props.preset, t('um.newName', { n: list.value.length + 1 }));
  emit('open', m.id);
}
function createFrom(tpl: UserModuleTemplate) {
  picking.value = false;
  const m = createUserModuleFromTemplate(props.preset, localSource(props.preset, tpl, 'userModuleTemplates'));
  emit('open', m.id);
}
/** "New": straight to a blank module, or the inline picker when there are templates. */
async function create() {
  if (!templates.value.length) return createBlank();
  picking.value = !picking.value;
  if (!picking.value) return;
  await nextTick();
  pickerEl.value?.querySelector<HTMLButtonElement>('.um-choice')?.focus();
}

const fileInput = ref<HTMLInputElement | null>(null);
async function importFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  try {
    const raw: unknown = JSON.parse(await file.text());
    // Templates in someone else's modules run code: ask first (I-110).
    await confirmUserModuleTemplates(parseUserModuleFile(raw).modules);
    const { added, missing } = importUserModules(props.preset, raw);
    toast(missing ? 'warning' : 'success', missing ? t('um.importedMissing', { n: added.length, missing }) : t('um.imported', { n: added.length }));
  } catch (e) {
    if (isTrustDeclined(e)) toast('info', e.message);
    else toast('error', t('um.importFailed', { error: e instanceof Error ? e.message : String(e) }));
  }
}
const exportAll = () => downloadJson(`${props.preset.id}.ap-modules.json`, exportUserModules(props.preset));

// Pointer-based reordering (works with touch): the list reorders live under the pointer.
const listEl = ref<HTMLElement | null>(null);
const dragging = ref<string | null>(null);
function startDrag(e: PointerEvent, id: string) {
  e.preventDefault();
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  dragging.value = id;
}
function moveDrag(e: PointerEvent) {
  const id = dragging.value;
  if (!id || !listEl.value) return;
  const rows = [...listEl.value.querySelectorAll<HTMLElement>('.um-row')];
  const others = rows.filter((r) => r.dataset.id !== id);
  const to = others.filter((r) => { const b = r.getBoundingClientRect(); return b.top + b.height / 2 < e.clientY; }).length;
  if (list.value[to]?.id !== id) moveUserModule(props.preset, id, to);
}
const endDrag = () => { dragging.value = null; };
</script>

<template>
  <Section :title="t('um.title')" :help="t('um.help')">
    <template #actions>
      <IconButton v-if="hasPoints" :icon="Upload" :label="t('um.import')" small align="end" @click="fileInput?.click()" />
      <IconButton v-if="list.length" :icon="Download" :label="t('um.exportAll')" small align="end" @click="exportAll" />
      <IconButton v-if="hasPoints && list.length" :icon="Plus" :label="t('um.new')" :active="picking" small align="end" @click="create" />
    </template>
    <div v-if="picking" ref="pickerEl" class="um-picker" role="group" :aria-label="t('um.startFrom')" @keydown.esc.stop="picking = false">
      <div class="um-picker-head">
        <span class="small muted">{{ t('um.startFrom') }}</span>
        <IconButton :icon="X" :label="t('common.cancel')" small align="end" @click="picking = false" />
      </div>
      <button type="button" class="um-choice" @click="createBlank">
        <FilePlus />
        <span class="um-choice-text"><span>{{ t('um.blank') }}</span><span class="xs muted">{{ t('um.blank.desc') }}</span></span>
      </button>
      <button v-for="x in templates" :key="x.tpl.id" type="button" class="um-choice" :data-template="x.tpl.id" @click="createFrom(x.tpl)">
        <LayoutTemplate />
        <span class="um-choice-text"><span>{{ x.body.name }}</span><span v-if="x.body.description" class="xs muted um-choice-desc">{{ x.body.description }}</span></span>
      </button>
    </div>
    <div v-if="list.length" ref="listEl" class="um-list">
      <div v-for="m in list" :key="m.id" class="um-row" :class="{ off: !m.enabled, dragging: dragging === m.id }" :data-id="m.id">
        <span
          v-if="list.length > 1" class="um-grip" :aria-label="t('um.reorder')"
          @pointerdown="startDrag($event, m.id)" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag"
        ><GripVertical /></span>
        <button type="button" class="um-open" @click="emit('open', m.id)">
          <span class="um-row-name ellipsis">{{ m.name || t('um.untitled') }}</span>
          <span class="um-row-meta xs muted ellipsis">{{ pointsOf(m) || t('um.noEntries') }}</span>
        </button>
        <Tip v-if="lost(m).length" :text="lostText(m)" align="end"><TriangleAlert class="text-warning um-flag" tabindex="0" /></Tip>
        <Tip v-if="hasTrigger(m)" :text="describeTrigger(preset, m.trigger)" align="end"><Zap class="um-flag um-zap" tabindex="0" /></Tip>
        <Switch :model-value="m.enabled" :label="m.name" @update:model-value="setEnabled(m, $event)" />
      </div>
    </div>
    <button v-else-if="hasPoints && !picking" type="button" class="um-new" @click="create"><Plus />{{ t('um.new') }}</button>
    <div v-else class="faint small">{{ t('um.noPoints') }}</div>
    <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importFile" />
  </Section>
</template>
