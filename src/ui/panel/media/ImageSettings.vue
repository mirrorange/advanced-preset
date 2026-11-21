<script setup lang="ts">
/** Image generation settings: switches, connections (API, endpoint, key, model, style, NSFW block, reference images) and request overrides. */
import { computed, ref } from 'vue';
import { ImagePlus, Images, Trash2 } from 'lucide-vue-next';
import { t } from '@/i18n';
import {
  activeConnection, changeImageApi, copyConnection, IMAGE_APIS, IMAGE_DEFAULTS, mediaSettings, newImageConnection, saveMedia, supportsRefs,
  type ImageApi, type ImageConnection,
} from '@/store/media';
import { deleteBlob, putBlob } from '@/store/media-db';
import { gcRefs, nextRefId } from '@/media/image/refs';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';
import Segmented from '../../components/Segmented.vue';
import IconButton from '../../components/IconButton.vue';
import BlobImage from '../../components/BlobImage.vue';
import ConnectionBar from './ConnectionBar.vue';
import AdvancedRequest from './AdvancedRequest.vue';

const image = computed(() => mediaSettings().image);
const conn = computed(() => activeConnection(image.value));

const MODELS: Record<ImageApi, string[]> = {
  openai: ['gpt-image-2.6-flare', 'gpt-image-2.6-sunburst', 'gpt-image-2.5-flare', 'gpt-image-2.5-sunburst', 'gpt-image-1'],
  gemini: ['gemini-nano-banana-2.1', 'gemini-3.1-flash-image', 'gemini-3-pro-image', 'gemini-2.5-flash-image'],
  novelai: ['nai-diffusion-4-5-full', 'nai-diffusion-4-5-curated', 'nai-diffusion-4-full'],
};
const apiLabel = (api: string) => t(`media.api.${api}`);
const apiOptions = IMAGE_APIS.map((value) => ({ value, label: apiLabel(value) }));

const setSwitch = (k: 'enabled' | 'auto', v: boolean) => { image.value[k] = v; saveMedia(); };
function edit<K extends keyof ImageConnection>(k: K, v: ImageConnection[K]) {
  const c = conn.value;
  if (!c) return;
  c[k] = v;
  saveMedia();
}

function add() {
  const c = newImageConnection('openai', t('media.connection.default', { n: image.value.connections.length + 1 }));
  image.value.connections.push(c);
  image.value.active = c.id;
  saveMedia();
}
function copy(c: ImageConnection) {
  const n = copyConnection(c, t('media.connection.copyName', { name: c.name }));
  image.value.connections.push(n);
  image.value.active = n.id;
  saveMedia();
}
function remove(c: ImageConnection) {
  image.value.connections = image.value.connections.filter((x) => x.id !== c.id);
  if (image.value.active === c.id) image.value.active = image.value.connections[0]?.id ?? null;
  saveMedia();
  void gcRefs();
}
const select = (id: string) => { image.value.active = id; saveMedia(); };
const rename = (c: ImageConnection, name: string) => { c.name = name; saveMedia(); };
const setApi = (api: ImageApi) => { if (conn.value) { changeImageApi(conn.value, api); saveMedia(); } };

const fileInput = ref<HTMLInputElement | null>(null);
async function addRefs(e: Event) {
  const c = conn.value;
  const files = [...((e.target as HTMLInputElement).files ?? [])];
  (e.target as HTMLInputElement).value = '';
  if (!c) return;
  for (const f of files) {
    if (!f.type.startsWith('image/')) continue;
    const blob = await putBlob(f, { prefix: 'ref:' });
    c.refs.push({ id: nextRefId(c.refs), description: f.name.replace(/\.[^.]+$/, ''), blob });
  }
  saveMedia();
}
function removeRef(i: number) {
  const c = conn.value;
  if (!c) return;
  const [r] = c.refs.splice(i, 1);
  saveMedia();
  // Copies of the connection may still use the same blob.
  if (r && !image.value.connections.some((x) => x.refs.some((y) => y.blob === r.blob))) void deleteBlob(r.blob);
}
</script>

<template>
  <Section :title="t('media.image')" :icon="Images">
    <template #actions><Switch :model-value="image.enabled" :label="t('media.image')" @update:model-value="setSwitch('enabled', $event)" /></template>
    <template v-if="image.enabled">
      <Field :label="t('media.auto')" :help="t('media.image.auto.hint')" inline>
        <Switch :model-value="image.auto" @update:model-value="setSwitch('auto', $event)" />
      </Field>
      <ConnectionBar :connections="image.connections" :active="conn" :api-label="apiLabel" @select="select" @add="add" @copy="copy" @remove="remove" @rename="rename" />
      <div v-if="conn" :key="conn.id" class="col media-conn">
        <Segmented :model-value="conn.api" :options="apiOptions" @update:model-value="setApi($event as ImageApi)" />
        <Field :label="t('media.baseUrl')">
          <input class="input" :value="conn.baseUrl" :placeholder="IMAGE_DEFAULTS[conn.api].baseUrl" spellcheck="false" @change="edit('baseUrl', ($event.target as HTMLInputElement).value.trim())" />
        </Field>
        <Field :label="t('media.apiKey')">
          <input class="input" type="password" autocomplete="off" :value="conn.apiKey" @change="edit('apiKey', ($event.target as HTMLInputElement).value.trim())" />
        </Field>
        <Field :label="t('media.model')">
          <input class="input" :list="`ap-image-models-${conn.api}`" :value="conn.model" :placeholder="IMAGE_DEFAULTS[conn.api].model" spellcheck="false" @change="edit('model', ($event.target as HTMLInputElement).value.trim())" />
          <datalist :id="`ap-image-models-${conn.api}`"><option v-for="m in MODELS[conn.api]" :key="m" :value="m" /></datalist>
        </Field>
        <Field :label="t('media.image.style')" :help="t('media.image.style.hint')">
          <textarea class="input" rows="2" :value="conn.style" :placeholder="t(conn.api === 'novelai' ? 'media.image.style.tags' : 'media.image.style.nl')" @change="edit('style', ($event.target as HTMLTextAreaElement).value)" />
        </Field>
        <Field v-if="conn.api === 'novelai'" :label="t('media.image.negative')">
          <textarea class="input" rows="2" :value="conn.negative ?? ''" :placeholder="t('media.image.negative.placeholder')" @change="edit('negative', ($event.target as HTMLTextAreaElement).value)" />
        </Field>
        <Field :label="t('media.image.nsfwBlock')" :help="t('media.image.nsfwBlock.hint')" inline>
          <Switch :model-value="conn.nsfwBlock" @update:model-value="edit('nsfwBlock', $event)" />
        </Field>
        <Field v-if="supportsRefs(conn.api)" :label="t('media.image.refs')" :help="t('media.image.refs.hint')">
          <div class="col media-refs">
            <div v-for="(r, i) in conn.refs" :key="r.blob" class="media-ref">
              <BlobImage :blob-key="r.blob" class="media-ref-thumb" :alt="r.description" />
              <span class="badge neutral mono">{{ r.id }}</span>
              <input class="input grow" :value="r.description" :placeholder="t('media.image.refs.description')" @change="r.description = ($event.target as HTMLInputElement).value; saveMedia()" />
              <IconButton :icon="Trash2" :label="t('common.delete')" small danger align="end" @click="removeRef(i)" />
            </div>
            <button type="button" class="btn ghost add" @click="fileInput?.click()"><ImagePlus />{{ t('media.image.refs.add') }}</button>
            <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="addRefs" />
          </div>
        </Field>
        <AdvancedRequest :connection="conn" @changed="saveMedia()">
          <Field v-if="conn.api === 'gemini'" :label="t('media.image.geminiEndpoint')">
            <select class="input" :value="conn.endpoint ?? 'interactions'" @change="edit('endpoint', ($event.target as HTMLSelectElement).value as ImageConnection['endpoint'])">
              <option value="interactions">Interactions</option>
              <option value="generateContent">generateContent</option>
            </select>
          </Field>
        </AdvancedRequest>
      </div>
    </template>
  </Section>
</template>
