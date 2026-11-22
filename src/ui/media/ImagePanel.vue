<script setup lang="ts">
/**
 * Image panel (in the media dialog) for one image prompt of a message: edit the prompt, reference
 * images, ratio and caption (saved as overrides of the model's values), and look through, show or
 * delete the generated versions. Other image prompts of the message can be picked at the top.
 */
import { computed, reactive, ref, watch } from 'vue';
import { Eye, LoaderCircle, RotateCcw, Trash2, WandSparkles, X } from 'lucide-vue-next';
import { IMAGE_RATIOS, type ImagePrompt, type ImageRatio } from '@advanced-preset/protocol';
import { t } from '@/i18n';
import { getPreset } from '@/store/presets';
import { supportsRefs } from '@/store/media';
import { chatRefs } from '@/media/image/refs';
import {
  cancelImage, deleteImage, effectiveImage, generateImage, imageConnection, imageEdited, imageJobs, imageStructures, jobKey, promptsOf, setImageEdit, showImage,
} from '@/app/images';
import { sidecarAt } from '../state';
import { mediaErrorText } from './errors';
import Field from '../components/Field.vue';
import IconButton from '../components/IconButton.vue';
import BlobImage from '../components/BlobImage.vue';
import ImageViewer from '../message/cards/ImageViewer.vue';

const props = defineProps<{ mesid: number; structure: string; index: number }>();
const emit = defineEmits<{ close: [] }>();

const sc = computed(() => sidecarAt(props.mesid));
/** The turn the panel was opened for: a swipe or regeneration replaces it. */
const genId = sc.value?.genId;
const here = computed(() => (sc.value && sc.value.genId === genId ? sc.value : undefined));

/** Every image prompt of the message, to switch between them. */
const targets = computed(() => {
  const s = here.value;
  if (!s) return [];
  return imageStructures(getPreset(s.presetId)).flatMap((d) => promptsOf(s, d.id).map((_, i) => ({ structure: d.id, index: i })));
});
const at = ref({ structure: props.structure, index: props.index });
const atKey = computed(() => `${at.value.structure}:${at.value.index}`);
const pick = (key: string) => { const x = targets.value.find((x) => `${x.structure}:${x.index}` === key); if (x) at.value = x; };

const model = computed((): ImagePrompt | undefined => promptsOf(here.value, at.value.structure)[at.value.index]);
const effective = computed(() => effectiveImage(here.value, at.value.structure, at.value.index));
const record = computed(() => here.value?.images?.[at.value.structure]?.[at.value.index]);
const edited = computed(() => imageEdited(here.value, at.value.structure, at.value.index));

// Draft of the editable fields; reset when switching prompts.
const draft = reactive({ prompt: '', refs: [] as string[], ratio: '' as ImageRatio | '', caption: '' });
const load = (p: ImagePrompt | undefined) => {
  draft.prompt = p?.prompt ?? '';
  draft.refs = [...(p?.refs ?? [])];
  draft.ratio = p?.ratio ?? '';
  draft.caption = p?.caption ?? '';
};
watch(atKey, () => load(effective.value), { immediate: true });
const dirty = computed(() => {
  const e = effective.value;
  if (!e) return false;
  const refs = e.refs ?? [];
  return draft.prompt.trim() !== e.prompt.trim() || draft.ratio !== (e.ratio ?? '') || draft.caption.trim() !== (e.caption ?? '').trim()
    || draft.refs.length !== refs.length || draft.refs.some((r) => !refs.includes(r));
});
const differsFromModel = computed(() => {
  const m = model.value;
  if (!m) return false;
  const refs = m.refs ?? [];
  return draft.prompt.trim() !== m.prompt.trim() || draft.ratio !== (m.ratio ?? '') || draft.caption.trim() !== (m.caption ?? '').trim()
    || draft.refs.length !== refs.length || draft.refs.some((r) => !refs.includes(r));
});
const restore = () => load(model.value);

// Reference images: those the connection offers in this chat; picked ids it does not offer stay listable.
const conn = computed(() => imageConnection());
const refsOn = computed(() => Boolean(conn.value && supportsRefs(conn.value.api)));
const offered = computed(() => (conn.value && refsOn.value ? chatRefs(conn.value) : []));
const unavailable = computed(() => draft.refs.filter((id) => !offered.value.some((r) => r.id === id)));
const toggleRef = (id: string, on: boolean) => { draft.refs = on ? [...draft.refs, id] : draft.refs.filter((x) => x !== id); };
const ratios = computed(() => (model.value?.ratio ? [...IMAGE_RATIOS] : ['', ...IMAGE_RATIOS]));

// Versions.
const missing = reactive(new Set<string>());
const keys = computed(() => (record.value?.keys ?? []).filter((k) => !missing.has(k)));
const shownKey = computed(() => {
  const all = record.value?.keys ?? [];
  const chosen = all[record.value?.shown ?? -1];
  return chosen && !missing.has(chosen) ? chosen : keys.value.at(-1);
});
const show = (key: string) => void showImage(props.mesid, at.value.structure, at.value.index, (record.value?.keys ?? []).indexOf(key));
const remove = (key: string) => void deleteImage(props.mesid, at.value.structure, at.value.index, key);
const viewing = ref<number | null>(null);

const job = computed(() => (genId ? imageJobs.get(jobKey(genId, at.value.structure, at.value.index)) : undefined));
const running = computed(() => job.value?.status === 'running');
const error = computed(() => (job.value?.status === 'error' ? mediaErrorText(job.value.error) : ''));

async function save(): Promise<void> {
  if (!dirty.value) return;
  await setImageEdit(props.mesid, at.value.structure, at.value.index, { prompt: draft.prompt, refs: draft.refs, ratio: draft.ratio || undefined, caption: draft.caption });
  load(effective.value);
}
async function saveAndClose() { await save(); emit('close'); }
async function saveAndGenerate() {
  await save();
  void generateImage(props.mesid, at.value.structure, at.value.index);
}
const cancel = () => { if (genId) cancelImage(genId, at.value.structure, at.value.index); };

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !e.isComposing) { e.preventDefault(); void saveAndGenerate(); }
}
</script>

<template>
  <div v-if="!here || !model" class="image-panel muted small">{{ t('media.image.gone') }}</div>
  <form v-else class="image-panel col" @submit.prevent="saveAndClose" @keydown="onKey">
    <select v-if="targets.length > 1" class="input" :value="atKey" :aria-label="t('media.image.which')" :disabled="dirty" @change="pick(($event.target as HTMLSelectElement).value)">
      <option v-for="(x, i) in targets" :key="`${x.structure}:${x.index}`" :value="`${x.structure}:${x.index}`">
        {{ t('media.image.nth', { n: i + 1 }) }}{{ promptsOf(here, x.structure)[x.index]?.caption ? ` · ${promptsOf(here, x.structure)[x.index]!.caption}` : '' }}
      </option>
    </select>

    <Field :label="t('media.image.prompt')" :modified="edited">
      <textarea v-model="draft.prompt" class="input image-panel-prompt" rows="6" />
    </Field>

    <Field :label="t('media.image.refs')">
      <p v-if="!refsOn" class="xs muted">{{ t('media.image.refs.unsupported') }}</p>
      <div v-else class="col media-refs">
        <p v-if="!offered.length && !unavailable.length" class="xs muted">{{ t('media.image.refs.empty') }}</p>
        <label v-for="r in offered" :key="r.id" class="media-ref image-panel-ref" :data-ref="r.id">
          <input type="checkbox" :checked="draft.refs.includes(r.id)" @change="toggleRef(r.id, ($event.target as HTMLInputElement).checked)" />
          <BlobImage :blob-key="r.blob" class="media-ref-thumb" :alt="r.description" />
          <span class="badge neutral mono">{{ r.id }}</span>
          <span class="small grow ellipsis">{{ r.description }}</span>
        </label>
        <label v-for="id in unavailable" :key="id" class="media-ref image-panel-ref" :data-ref="id">
          <input type="checkbox" checked @change="toggleRef(id, false)" />
          <span class="badge neutral mono">{{ id }}</span>
          <span class="xs muted grow">{{ t('media.image.refs.unavailable') }}</span>
        </label>
      </div>
    </Field>

    <div class="row image-panel-row">
      <Field :label="t('media.image.ratio')">
        <select v-model="draft.ratio" class="input">
          <option v-for="r in ratios" :key="r" :value="r">{{ r || t('media.image.ratio.auto') }}</option>
        </select>
      </Field>
      <Field :label="t('media.image.caption')" class="grow">
        <input v-model="draft.caption" class="input" />
      </Field>
    </div>

    <Field :label="t('media.image.versions')">
      <p v-if="!keys.length" class="xs muted">{{ t('media.image.versions.empty') }}</p>
      <div v-else class="image-versions">
        <div v-for="(k, i) in keys" :key="k" class="image-version" :class="{ on: k === shownKey }">
          <button type="button" class="image-version-pick" :aria-label="t('media.image.show', { n: i + 1 })" :aria-pressed="k === shownKey" @click="show(k)">
            <BlobImage :blob-key="k" :alt="t('media.image.show', { n: i + 1 })" @missing="missing.add(k)" />
          </button>
          <div class="image-version-tools">
            <IconButton :icon="Eye" :label="t('media.image.view')" small @click="viewing = i" />
            <IconButton :icon="Trash2" :label="t('common.delete')" small danger align="end" @click="remove(k)" />
          </div>
        </div>
      </div>
    </Field>

    <div v-if="running" class="row tight image-panel-status" role="status">
      <LoaderCircle class="spin" aria-hidden="true" />
      <span class="small grow">{{ t('media.image.generating') }}</span>
      <IconButton :icon="X" :label="t('common.cancel')" small @click="cancel" />
    </div>
    <p v-else-if="error" class="xs text-danger image-panel-status">{{ error }}</p>

    <div class="row end tight image-panel-actions">
      <button type="button" class="btn ghost sm-btn image-panel-restore" :disabled="!differsFromModel" @click="restore"><RotateCcw />{{ t('media.image.restore') }}</button>
      <button type="submit" class="btn sm-btn image-panel-save" :disabled="!dirty">{{ t('common.save') }}</button>
      <button type="button" class="btn primary sm-btn image-panel-generate" :disabled="running || !draft.prompt.trim()" @click="saveAndGenerate"><WandSparkles />{{ t('media.image.saveGenerate') }}</button>
    </div>

    <ImageViewer v-if="viewing !== null && keys.length" :keys="keys" :start="Math.min(viewing, keys.length - 1)" :caption="effective?.caption ?? effective?.prompt" @close="viewing = null" />
  </form>
</template>
