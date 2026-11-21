<script setup lang="ts">
/**
 * One voice of a speech connection: a built-in voice or an id (typed, or picked from the provider's
 * library search), or reference audio for cloning (with transcript / consent recording when the
 * provider asks for them). The speaker button plays a sample.
 */
import { computed, ref } from 'vue';
import { AudioLines, FileAudio, LoaderCircle, Search, Volume2, X } from 'lucide-vue-next';
import { t } from '@/i18n';
import { putBlob } from '@/store/media-db';
import { speechProvider } from '@/media/speech/providers';
import { env, gcVoices, previewVoice } from '@/media/speech/service';
import type { SpeechConnection, VoiceOption, VoiceRef } from '@/media/speech/types';
import { mediaErrorText } from '../../media/errors';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ connection: SpeechConnection; modelValue: VoiceRef | null; placeholder?: string; label: string }>();
const emit = defineEmits<{ 'update:modelValue': [v: VoiceRef | null] }>();

const provider = computed(() => speechProvider(props.connection.api));
const v = computed(() => props.modelValue);
const listId = computed(() => `ap-voices-${props.connection.api}`);
const shown = computed(() => (v.value?.kind === 'voice' ? v.value.name || provider.value?.voices.find((x) => x.id === v.value!.id)?.name || v.value.id : ''));

function setId(text: string) {
  const s = text.trim();
  if (!s) return emit('update:modelValue', null);
  const known = provider.value?.voices.find((x) => x.id === s || x.name.toLowerCase() === s.toLowerCase());
  if (v.value?.kind === 'voice' && s === shown.value) return;
  emit('update:modelValue', { kind: 'voice', id: known?.id ?? s });
}

// Library search.
const searching = ref(false);
const query = ref('');
const busy = ref(false);
const results = ref<VoiceOption[] | null>(null);
const error = ref('');
let ctrl: AbortController | null = null;
async function search() {
  const p = provider.value;
  if (!p?.search) return;
  ctrl?.abort();
  ctrl = new AbortController();
  busy.value = true;
  error.value = '';
  try { results.value = await p.search(env, props.connection, query.value, ctrl.signal); }
  catch (e) { if (!(e instanceof DOMException && e.name === 'AbortError')) error.value = mediaErrorText(e); }
  finally { busy.value = false; }
}
function toggleSearch() {
  searching.value = !searching.value;
  if (searching.value && !results.value) void search();
}
async function pick(o: VoiceOption) {
  let id = o.id;
  const p = provider.value;
  if (o.owner && p?.adopt) {
    busy.value = true;
    try { id = await p.adopt(env, props.connection, o); }
    catch (e) { error.value = mediaErrorText(e); return; }
    finally { busy.value = false; }
  }
  emit('update:modelValue', { kind: 'voice', id, name: o.name });
  searching.value = false;
}
let sample: HTMLAudioElement | null = null;
function listen(o: VoiceOption) {
  sample?.pause();
  if (!o.preview) return;
  sample = new Audio(o.preview);
  void sample.play().catch(() => undefined);
}

// Reference audio.
const audioInput = ref<HTMLInputElement | null>(null);
const consentInput = ref<HTMLInputElement | null>(null);
async function upload(e: Event, field: 'audio' | 'consent') {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  const key = await putBlob(file, { prefix: 'voice:' });
  const cur = v.value?.kind === 'clone' ? v.value : null;
  // New audio: a new clone (the provider-side id belongs to the old audio).
  if (field === 'consent' && !cur) return;
  const next: VoiceRef = field === 'audio' || !cur
    ? { kind: 'clone', audio: key, name: file.name, ...(cur?.text ? { text: cur.text } : {}), ...(cur?.consent ? { consent: cur.consent } : {}) }
    : { ...cur, consent: key, id: undefined };
  emit('update:modelValue', next);
  void gcVoices();
}
function setText(text: string) {
  if (v.value?.kind !== 'clone') return;
  const { id: _id, ...rest } = v.value;
  void _id;
  emit('update:modelValue', { ...rest, text: text.trim() || undefined });
}
function clearClone() {
  emit('update:modelValue', null);
  void gcVoices();
}
</script>

<template>
  <div class="col tight">
    <div class="speech-voice">
      <template v-if="v?.kind === 'clone'">
        <span class="chip grow" :title="v.audio"><FileAudio class="faint" /><span class="ellipsis">{{ v.name || t('media.speech.clone') }}</span></span>
        <IconButton :icon="X" :label="t('common.delete')" small @click="clearClone" />
      </template>
      <template v-else>
        <input class="input" :list="listId" :value="shown" :placeholder="placeholder ?? (provider?.voices[0]?.name || t('media.speech.voiceId'))" :aria-label="label" spellcheck="false" @change="setId(($event.target as HTMLInputElement).value)" />
        <datalist :id="listId"><option v-for="o in provider?.voices ?? []" :key="o.id" :value="o.id">{{ o.name }}</option></datalist>
        <IconButton v-if="provider?.search" :icon="Search" :label="t('media.speech.search')" small :pressed="searching" @click="toggleSearch" />
      </template>
      <IconButton v-if="provider?.clone && v?.kind !== 'clone'" :icon="AudioLines" :label="t('media.speech.clone')" small @click="audioInput?.click()" />
      <IconButton :icon="Volume2" :label="t('media.speech.test')" small align="end" @click="previewVoice(connection, modelValue)" />
      <input ref="audioInput" type="file" accept="audio/*" hidden @change="upload($event, 'audio')" />
    </div>
    <template v-if="v?.kind === 'clone'">
      <input v-if="provider?.clone?.text !== 'none'" class="input" :value="v.text ?? ''" :placeholder="t('media.speech.clone.text')" @change="setText(($event.target as HTMLInputElement).value)" />
      <div v-if="provider?.clone?.consent" class="speech-voice">
        <button type="button" class="btn ghost sm-btn" @click="consentInput?.click()"><FileAudio />{{ v.consent ? t('media.speech.clone.consentSet') : t('media.speech.clone.consent') }}</button>
        <input ref="consentInput" type="file" accept="audio/*" hidden @change="upload($event, 'consent')" />
      </div>
    </template>
    <div v-if="searching" class="col tight">
      <input v-model="query" class="input" :placeholder="t('media.speech.search.placeholder')" @keydown.enter.prevent="search" />
      <span v-if="error" class="xs text-danger">{{ error }}</span>
      <div v-if="busy && !results" class="row tight faint small"><LoaderCircle class="spin" /></div>
      <div v-else-if="results" class="speech-results">
        <span v-if="!results.length" class="faint small speech-result">{{ t('media.speech.search.none') }}</span>
        <div v-for="o in results" :key="o.id" class="speech-result">
          <button type="button" class="speech-result grow" @click="pick(o)">
            <span class="col grow">
              <span class="ellipsis">{{ o.name }}</span>
              <span v-if="o.description" class="xs faint ellipsis">{{ o.description }}</span>
            </span>
          </button>
          <IconButton v-if="o.preview" :icon="Volume2" :label="t('media.speech.test')" small align="end" @click="listen(o)" />
        </div>
      </div>
    </div>
  </div>
</template>
