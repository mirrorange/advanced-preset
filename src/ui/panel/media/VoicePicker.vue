<script setup lang="ts">
/**
 * One voice of a speech connection: a built-in voice or an id, or reference audio for cloning (with
 * transcript / consent recording when the provider asks for them). The id input is a combobox: it
 * suggests the built-in voices and, when the provider has a voice library, searches it as you type.
 * The speaker button plays a sample; the default slot adds buttons to the end of the first row.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { AudioLines, FileAudio, LoaderCircle, Volume2, X } from 'lucide-vue-next';
import { t } from '@/i18n';
import { putBlob } from '@/store/media-db';
import { speechProvider } from '@/media/speech/providers';
import { env, gcVoices, previewVoice } from '@/media/speech/service';
import type { SpeechConnection, VoiceOption, VoiceRef } from '@/media/speech/types';
import { mediaErrorText } from '../../media/errors';
import { place } from '../../components/bubble';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ connection: SpeechConnection; modelValue: VoiceRef | null; placeholder?: string; label: string }>();
const emit = defineEmits<{ 'update:modelValue': [v: VoiceRef | null] }>();

const provider = computed(() => speechProvider(props.connection.api));
const v = computed(() => props.modelValue);
const shown = computed(() => (v.value?.kind === 'voice' ? v.value.name || provider.value?.voices.find((x) => x.id === v.value!.id)?.name || v.value.id : ''));

function setId(text: string) {
  const s = text.trim();
  if (!s) return emit('update:modelValue', null);
  const known = provider.value?.voices.find((x) => x.id === s || x.name.toLowerCase() === s.toLowerCase());
  if (v.value?.kind === 'voice' && s === shown.value) return;
  emit('update:modelValue', { kind: 'voice', id: known?.id ?? s });
}

// Combobox: `draft` is the typed text (null: not edited, the input shows the current voice).
const menuId = `ap-voice-menu-${++seq}`;
const input = ref<HTMLInputElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const open = ref(false);
const draft = ref<string | null>(null);
const active = ref(-1);
const query = computed(() => (draft.value ?? '').trim());

// Library search, debounced while typing; the last query's results stay until the next ones arrive.
const busy = ref(false);
const results = ref<VoiceOption[] | null>(null);
const error = ref('');
let searched: string | null = null;
let ctrl: AbortController | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
async function search(q: string) {
  const p = provider.value;
  if (!p?.search || q === searched) return;
  ctrl?.abort();
  const c = (ctrl = new AbortController());
  searched = q;
  busy.value = true;
  error.value = '';
  try { results.value = await p.search(env, props.connection, q, c.signal); }
  catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
    searched = null;
    error.value = mediaErrorText(e);
  }
  finally { if (ctrl === c) busy.value = false; }
}
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => void search(query.value), 300);
}
// Another API or account: earlier results no longer apply.
watch(() => [props.connection.api, props.connection.baseUrl, props.connection.apiKey], () => {
  ctrl?.abort();
  searched = null;
  results.value = null;
  error.value = '';
  busy.value = false;
});

const options = computed<VoiceOption[]>(() => {
  const q = query.value.toLowerCase();
  const own = (provider.value?.voices ?? []).filter((o) => !q || `${o.id} ${o.name} ${o.description ?? ''}`.toLowerCase().includes(q));
  const found = results.value ?? [];
  const seen = new Set(found.map((o) => o.id));
  return [...found, ...own.filter((o) => !seen.has(o.id))];
});
const searchable = computed(() => Boolean(provider.value?.search));
const showMenu = computed(() => open.value && (options.value.length > 0 || searchable.value));
watch(options, () => { active.value = -1; });

function onFocus() {
  open.value = true;
  void search(query.value);
}
function onInput(e: Event) {
  draft.value = (e.target as HTMLInputElement).value;
  open.value = true;
  schedule();
}
function commit() {
  if (draft.value === null) return;
  const text = draft.value;
  draft.value = null;
  setId(text);
}
function close() {
  open.value = false;
  clearTimeout(timer);
}
function onBlur() {
  close();
  commit();
}
function move(step: number) {
  const n = options.value.length;
  if (!n) return;
  open.value = true;
  // -1 (none) and the options, round and round.
  active.value = ((active.value + 1 + step + n + 1) % (n + 1)) - 1;
  void nextTick(() => menu.value?.querySelector('.voice-option.on')?.scrollIntoView({ block: 'nearest' }));
}
function onKey(e: KeyboardEvent) {
  if (e.isComposing) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  else if (e.key === 'Enter') {
    e.preventDefault();
    const o = showMenu.value ? options.value[active.value] : undefined;
    if (o) void pick(o);
    else { close(); commit(); }
  } else if (e.key === 'Escape' && (open.value || draft.value !== null)) {
    e.preventDefault();
    e.stopPropagation();
    if (open.value) close();
    else draft.value = null;
  }
}

async function pick(o: VoiceOption) {
  let id = o.id;
  const p = provider.value;
  draft.value = null;
  if (o.owner && p?.adopt) {
    busy.value = true;
    try { id = await p.adopt(env, props.connection, o); }
    catch (e) { error.value = mediaErrorText(e); return; }
    finally { busy.value = false; }
  }
  close();
  emit('update:modelValue', { kind: 'voice', id, name: o.name });
}
let sample: HTMLAudioElement | null = null;
function listen(o: VoiceOption) {
  sample?.pause();
  if (!o.preview) return;
  sample = new Audio(o.preview);
  void sample.play().catch(() => undefined);
}

// The menu sits in the top layer under the input (above it when there is no room below).
function position() {
  const a = input.value;
  const m = menu.value;
  if (!a || !m) return;
  const r = a.getBoundingClientRect();
  const view = { width: document.documentElement.clientWidth || innerWidth, height: innerHeight };
  m.style.width = `${Math.min(Math.max(r.width, 240), view.width - 16)}px`;
  m.style.left = '0px';
  m.style.top = '0px';
  const origin = m.getBoundingClientRect();
  const p = place(r, origin, view, 'start', true);
  m.style.left = `${p.left - origin.left}px`;
  m.style.top = `${p.top - origin.top}px`;
}
const onMove = (e: Event) => { if (!menu.value?.contains(e.target as Node)) position(); };
function unlisten() {
  removeEventListener('scroll', onMove, true);
  removeEventListener('resize', onMove);
}
watch(showMenu, async (on) => {
  if (!on) return unlisten();
  await nextTick();
  try { if (menu.value && !menu.value.matches(':popover-open')) menu.value.showPopover?.(); } catch { /* unsupported: stays position: fixed */ }
  position();
  addEventListener('scroll', onMove, true);
  addEventListener('resize', onMove);
});
watch([options, busy, error], () => { if (showMenu.value) void nextTick(position); });
onBeforeUnmount(() => { unlisten(); clearTimeout(timer); ctrl?.abort(); sample?.pause(); });

// Reference audio.
const audioInput = ref<HTMLInputElement | null>(null);
const consentInput = ref<HTMLInputElement | null>(null);
async function upload(e: Event, field: 'audio' | 'consent') {
  const el = e.target as HTMLInputElement;
  const file = el.files?.[0];
  el.value = '';
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

<script lang="ts">
let seq = 0;
</script>

<template>
  <div class="col tight">
    <div class="speech-voice">
      <template v-if="v?.kind === 'clone'">
        <span class="chip grow" :title="v.audio"><FileAudio class="faint" /><span class="ellipsis">{{ v.name || t('media.speech.clone') }}</span></span>
        <IconButton :icon="X" :label="t('common.delete')" small @click="clearClone" />
      </template>
      <template v-else>
        <input
          ref="input" class="input" role="combobox" autocomplete="off" spellcheck="false"
          :value="draft ?? shown" :aria-label="label" :aria-expanded="showMenu" :aria-controls="menuId"
          :aria-activedescendant="showMenu && active >= 0 ? `${menuId}-${active}` : undefined"
          :placeholder="placeholder ?? (provider?.voices[0]?.name || t(searchable ? 'media.speech.voiceSearch' : 'media.speech.voiceId'))"
          @focus="onFocus" @blur="onBlur" @input="onInput" @change="commit" @keydown="onKey"
        />
        <div v-if="showMenu" :id="menuId" ref="menu" class="voice-menu" popover="manual" role="listbox" :aria-label="label" @mousedown.prevent>
          <div v-for="(o, i) in options" :id="`${menuId}-${i}`" :key="o.id" class="voice-option" :class="{ on: i === active }" role="option" :aria-selected="i === active" @mouseenter="active = i" @click="pick(o)">
            <span class="col grow">
              <span class="ellipsis">{{ o.name }}</span>
              <span v-if="o.description" class="xs faint ellipsis">{{ o.description }}</span>
            </span>
            <IconButton v-if="o.preview" :icon="Volume2" :label="t('media.speech.test')" small align="end" @click.stop="listen(o)" />
          </div>
          <div v-if="busy" class="voice-menu-note faint"><LoaderCircle class="spin" /></div>
          <div v-else-if="error" class="voice-menu-note xs text-danger">{{ error }}</div>
          <div v-else-if="!options.length" class="voice-menu-note faint small">{{ t('media.speech.search.none') }}</div>
        </div>
      </template>
      <IconButton v-if="provider?.clone && v?.kind !== 'clone'" :icon="AudioLines" :label="t('media.speech.clone')" small @click="audioInput?.click()" />
      <IconButton :icon="Volume2" :label="t('media.speech.test')" small align="end" @click="previewVoice(connection, modelValue)" />
      <slot />
      <input ref="audioInput" type="file" accept="audio/*" hidden @change="upload($event, 'audio')" />
    </div>
    <template v-if="v?.kind === 'clone'">
      <input v-if="provider?.clone?.text !== 'none'" class="input" :value="v.text ?? ''" :placeholder="t('media.speech.clone.text')" @change="setText(($event.target as HTMLInputElement).value)" />
      <div v-if="provider?.clone?.consent" class="speech-voice">
        <button type="button" class="btn ghost sm-btn" @click="consentInput?.click()"><FileAudio />{{ v.consent ? t('media.speech.clone.consentSet') : t('media.speech.clone.consent') }}</button>
        <input ref="consentInput" type="file" accept="audio/*" hidden @change="upload($event, 'consent')" />
      </div>
    </template>
  </div>
</template>
