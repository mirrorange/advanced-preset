<script setup lang="ts">
/**
 * One image prompt of a message: the image (with its earlier versions), or the prompt and a Generate
 * button. Toolbar: previous / next version, regenerate, edit prompt, download, delete; click the image
 * to view it full size.
 */
import { computed, nextTick, ref } from 'vue';
import { ChevronLeft, ChevronRight, Download, ImageOff, LoaderCircle, Pencil, RefreshCw, Trash2, WandSparkles, X } from 'lucide-vue-next';
import type { ImagePrompt } from '@advanced-preset/protocol';
import { t } from '@/i18n';
import type { SidecarImage } from '@/store/sidecar';
import { getBlob } from '@/store/media-db';
import { cancelImage, deleteImage, generateImage, imageJobs, jobKey, setImagePrompt, showImage } from '@/app/images';
import { downloadBlob } from '../../download';
import { mediaErrorText } from '../../media/errors';
import IconButton from '../../components/IconButton.vue';
import BlobImage from '../../components/BlobImage.vue';
import ImageViewer from './ImageViewer.vue';

const props = defineProps<{ mesid: number; genId: string; structure: string; index: number; prompt: ImagePrompt; record?: SidecarImage; editable: boolean }>();

const keys = computed(() => props.record?.keys ?? []);
const shown = computed(() => Math.min(props.record?.shown ?? keys.value.length - 1, keys.value.length - 1));
const current = computed(() => keys.value[shown.value]);
const promptText = computed(() => props.record?.prompt ?? props.prompt.prompt);
const job = computed(() => imageJobs.get(jobKey(props.genId, props.structure, props.index)));
const running = computed(() => job.value?.status === 'running');
const error = computed(() => (job.value?.status === 'error' ? mediaErrorText(job.value.error) : ''));
const ratio = computed(() => (props.prompt.ratio ?? '3:4').replace(':', ' / '));

const generate = () => generateImage(props.mesid, props.structure, props.index);
const cancel = () => cancelImage(props.genId, props.structure, props.index);
const step = (d: number) => { const n = keys.value.length; if (n > 1) void showImage(props.mesid, props.structure, props.index, (shown.value + d + n) % n); };
const remove = () => { if (current.value) void deleteImage(props.mesid, props.structure, props.index, current.value); };

async function download() {
  const key = current.value;
  const blob = key ? await getBlob(key) : undefined;
  if (!blob) return;
  const ext = (blob.type.split('/')[1] ?? 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
  downloadBlob(`image-${props.mesid}-${props.index + 1}-${shown.value + 1}.${ext}`, blob);
}

const editing = ref(false);
const draft = ref('');
const input = ref<HTMLTextAreaElement>();
async function edit() {
  draft.value = promptText.value;
  editing.value = true;
  await nextTick();
  input.value?.focus();
}
async function save(regenerate: boolean) {
  editing.value = false;
  if (draft.value.trim() !== promptText.value.trim()) await setImagePrompt(props.mesid, props.structure, props.index, draft.value.trim());
  if (regenerate) void generate();
}
/** Keep keys inside the editor (ST's hotkeys). */
function onKey(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.isComposing) return;
  if (e.key === 'Escape') { e.preventDefault(); editing.value = false; }
  else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); void save(true); }
}

const viewing = ref(false);
</script>

<template>
  <figure class="image-figure">
    <div class="image-frame" :class="{ empty: !current }" :style="current ? undefined : { aspectRatio: ratio }">
      <button v-if="current" type="button" class="image-open" :aria-label="t('media.image.view')" @click="viewing = true">
        <BlobImage :blob-key="current" :alt="prompt.caption ?? promptText" />
      </button>
      <div v-else class="image-empty">
        <ImageOff v-if="!running && !error" class="faint" aria-hidden="true" />
        <p v-if="!editing" class="image-prompt small muted">{{ promptText }}</p>
      </div>
      <div v-if="running" class="image-busy" role="status">
        <LoaderCircle class="spin" aria-hidden="true" />
        <span class="small">{{ t('media.image.generating') }}</span>
        <IconButton :icon="X" :label="t('common.cancel')" small @click="cancel" />
      </div>
      <div v-if="current && keys.length > 1 && !running" class="image-pager">
        <IconButton :icon="ChevronLeft" :label="t('media.image.previous')" small @click="step(-1)" />
        <span class="xs">{{ shown + 1 }} / {{ keys.length }}</span>
        <IconButton :icon="ChevronRight" :label="t('media.image.next')" small @click="step(1)" />
      </div>
    </div>

    <form v-if="editing" class="image-edit col" @submit.prevent="save(false)" @keydown="onKey" @click.stop>
      <textarea ref="input" v-model="draft" class="input small" rows="4" :aria-label="t('media.image.prompt')" />
      <div class="row end tight">
        <button type="button" class="btn ghost sm-btn" @click="editing = false">{{ t('common.cancel') }}</button>
        <button type="submit" class="btn sm-btn">{{ t('common.save') }}</button>
        <button type="button" class="btn primary sm-btn" @click="save(true)"><WandSparkles />{{ t('media.image.generate') }}</button>
      </div>
    </form>

    <figcaption v-else class="image-foot">
      <span v-if="error" class="xs text-danger grow image-error" :title="error">{{ error }}</span>
      <span v-else class="xs muted grow ellipsis">{{ prompt.caption ?? '' }}</span>
      <div class="row tight image-tools">
        <button v-if="!current && !running" type="button" class="btn sm-btn" @click="generate"><WandSparkles />{{ t(error ? 'media.image.retry' : 'media.image.generate') }}</button>
        <IconButton v-if="current && !running" :icon="RefreshCw" :label="t('media.image.regenerate')" small @click="generate" />
        <IconButton v-if="editable && !running" :icon="Pencil" :label="t('media.image.editPrompt')" small @click="edit" />
        <IconButton v-if="current" :icon="Download" :label="t('media.image.download')" small @click="download" />
        <IconButton v-if="current && editable && !running" :icon="Trash2" :label="t('common.delete')" small danger align="end" @click="remove" />
      </div>
    </figcaption>

    <ImageViewer v-if="viewing && current" :keys="keys" :start="shown" :caption="prompt.caption ?? promptText" @close="viewing = false" />
  </figure>
</template>
