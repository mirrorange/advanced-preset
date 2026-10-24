<script setup lang="ts">
/** Event synopsis below the story: one quiet line, click to expand; the pencil edits it in place. */
import { computed, nextTick, reactive, ref } from 'vue';
import type { Synopsis } from '@advanced-preset/protocol';
import { Check, Clock, MapPin, Pencil } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ synopsis: Synopsis; editable?: boolean }>();
const emit = defineEmits<{ save: [value: Synopsis] }>();

const open = ref(false);
const editing = ref(false);
const draft = reactive<Synopsis>({ time: '', location: '', event: '', summary: '' });
const eventInput = ref<HTMLInputElement>();
const summaryInput = ref<HTMLTextAreaElement>();

const FIELDS = ['time', 'location', 'event', 'summary'] as const;
const trimmed = (): Synopsis => ({ time: draft.time.trim(), location: draft.location.trim(), event: draft.event.trim(), summary: draft.summary.trim() });
const changed = computed(() => FIELDS.some((k) => trimmed()[k] !== (props.synopsis[k] ?? '')));

function fit() {
  const el = summaryInput.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight + 2}px`;
}

async function startEdit() {
  for (const k of FIELDS) draft[k] = props.synopsis[k] ?? '';
  editing.value = true;
  await nextTick();
  fit();
  eventInput.value?.focus();
}

function cancel() { editing.value = false; }

function save() {
  if (changed.value) emit('save', trimmed());
  editing.value = false;
}

/** Keys stay inside the editor so ST's hotkeys (swipe arrows, Ctrl+Enter regenerate) and panel Esc don't fire. */
function onKey(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.isComposing) return;
  if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || (e.target as HTMLElement).tagName === 'INPUT')) { e.preventDefault(); save(); }
}
</script>

<template>
  <form v-if="editing" class="synopsis-editor" @submit.prevent="save" @keydown="onKey" @click.stop @touchstart.stop.passive @touchmove.stop.passive @touchend.stop.passive>
    <div class="synopsis-fields">
      <label class="synopsis-field">
        <Clock class="faint" />
        <input v-model="draft.time" class="input" :placeholder="t('cards.synopsis.time')" :aria-label="t('cards.synopsis.time')" />
      </label>
      <label class="synopsis-field">
        <MapPin class="faint" />
        <input v-model="draft.location" class="input" :placeholder="t('cards.synopsis.location')" :aria-label="t('cards.synopsis.location')" />
      </label>
    </div>
    <input ref="eventInput" v-model="draft.event" class="input synopsis-event-input" :placeholder="t('cards.synopsis.event')" :aria-label="t('cards.synopsis.event')" />
    <textarea ref="summaryInput" v-model="draft.summary" class="input" rows="2" :placeholder="t('cards.synopsis.summary')" :aria-label="t('cards.synopsis.summary')" @input="fit" />
    <div class="synopsis-actions">
      <span class="xs faint grow synopsis-keys">{{ t('cards.synopsis.keys') }}</span>
      <button type="button" class="btn ghost sm-btn" @click="cancel">{{ t('common.cancel') }}</button>
      <button type="submit" class="btn primary sm-btn"><Check />{{ t('common.save') }}</button>
    </div>
  </form>
  <div v-else class="synopsis" :class="{ open }" @click="open = !open">
    <div class="synopsis-line small">
      <span v-if="synopsis.time" class="row tight"><Clock class="faint" />{{ synopsis.time }}</span>
      <span v-if="synopsis.location" class="row tight"><MapPin class="faint" />{{ synopsis.location }}</span>
      <span class="synopsis-event ellipsis">{{ synopsis.event }}</span>
      <span v-if="editable" class="synopsis-edit" @click.stop>
        <IconButton :icon="Pencil" :label="t('cards.synopsis.edit')" small align="end" @click="startEdit" />
      </span>
    </div>
    <div v-if="open && synopsis.summary" class="small muted pre synopsis-summary">{{ synopsis.summary }}</div>
  </div>
</template>
