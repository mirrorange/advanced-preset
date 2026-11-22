<script setup lang="ts">
/**
 * Speech panel of one message (in the media dialog): every segment with who speaks, the voice, the
 * state of its audio and the text sent to the speech service, which the user can edit (provider
 * inline tags included) or revert; per segment play, generate / regenerate and delete; for the
 * whole message play, generate, regenerate, delete and download.
 */
import { computed, reactive, watch } from 'vue';
import { Download, LoaderCircle, Pause, Play, RotateCcw, Sparkles, Square, Trash2, Undo2 } from 'lucide-vue-next';
import { t } from '@/i18n';
import { chatCards } from '@/st/cards';
import {
  deleteAudio, generateLine, generateMessage, messageAudio, messageSegments, playLine, playMessage, probeCache, regenerate, segmentState,
  setSegmentText, speech, speechConnection, stopSpeech, togglePause,
} from '@/media/speech/service';
import { providerFor } from '@/media/speech/providers';
import { voiceFor, type Segment } from '@/media/speech/segments';
import type { VoiceRef } from '@/media/speech/types';
import { ui } from '../state';
import { saveBlob } from '../download';
import Help from '../components/Help.vue';
import IconButton from '../components/IconButton.vue';

const props = defineProps<{ mesid: number }>();

const conn = computed(() => speechConnection());
const segments = computed<Segment[]>(() => { void ui.chatRev; return messageSegments(props.mesid); });
const provider = computed(() => (conn.value ? providerFor(conn.value) : undefined));
const format = computed(() => provider.value?.format ?? '');

watch(() => segments.value.map((s) => s.id + s.text).join('\n'), () => { void probeCache(segments.value); }, { immediate: true });

const states = computed(() => segments.value.map((s) => segmentState(s)));
const generating = computed(() => Boolean(speech.generating[props.mesid]));
const allReady = computed(() => states.value.length > 0 && states.value.every((s) => s === 'ready'));
const anyMade = computed(() => states.value.some((s) => s === 'ready' || s === 'error'));
const here = computed(() => (speech.playing?.mesId === props.mesid ? speech.playing : null));
const playingAll = computed(() => Boolean(here.value?.all));
const playingSeg = (s: Segment) => here.value?.segId === s.id;

type Status = 'none' | 'loading' | 'ready' | 'error' | 'playing';
const statusOf = (s: Segment, i: number): Status => (playingSeg(s) ? 'playing' : states.value[i] ?? 'none');

function voiceName(v: VoiceRef | null | undefined): string {
  if (v === undefined) return t('media.speech.panel.noVoice');
  if (v === null) return provider.value?.voices[0]?.name ?? t('media.speech.providerDefault');
  if (v.kind === 'voice') return v.name || provider.value?.voices.find((x) => x.id === v.id)?.name || v.id;
  return v.name || t('media.speech.clone');
}
const voiceOf = (s: Segment) => (conn.value ? voiceName(voiceFor(conn.value, s, chatCards().map((c) => c.key))) : '');
const who = (s: Segment) => s.character || t('media.speech.narration');

// Drafts of the text being edited, by segment id (dropped when the segment goes away).
const drafts = reactive<Record<string, string>>({});
watch(() => segments.value.map((s) => s.id), (ids) => { for (const id of Object.keys(drafts)) if (!ids.includes(id)) delete drafts[id]; });
const draft = (s: Segment) => drafts[s.id] ?? s.text;
const dirty = (s: Segment) => s.id in drafts && drafts[s.id]!.trim() !== s.text;
function edit(s: Segment, ev: Event) { drafts[s.id] = (ev.target as HTMLTextAreaElement).value; }
async function save(s: Segment) {
  const text = drafts[s.id];
  delete drafts[s.id];
  if (text !== undefined) await setSegmentText(props.mesid, s.id, text);
}
const cancel = (s: Segment) => { delete drafts[s.id]; };
async function revert(s: Segment) {
  delete drafts[s.id];
  await setSegmentText(props.mesid, s.id, '');
}
async function regenerateLine(s: Segment) {
  await deleteAudio(props.mesid, [s.id]);
  await generateLine(props.mesid, s.id);
}
function onKey(s: Segment, e: KeyboardEvent) {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); void save(s); }
  else if (e.key === 'Escape' && dirty(s)) { e.preventDefault(); e.stopPropagation(); cancel(s); }
}

function playAll() {
  if (playingAll.value) void togglePause();
  else playMessage(props.mesid);
}
async function download() {
  const blob = await messageAudio(props.mesid);
  if (blob) saveBlob(blob, `speech-${props.mesid}.wav`);
}
</script>

<template>
  <div class="speech-panel">
    <div v-if="!conn" class="muted small">{{ t('media.speech.panel.off') }}</div>
    <div v-else-if="!segments.length" class="muted small">{{ t('media.speech.panel.empty') }}</div>
    <template v-else>
      <div class="speech-panel-bar">
        <button type="button" class="btn" :class="{ primary: !playingAll }" @click="playAll">
          <component :is="playingAll && !speech.paused ? Pause : Play" />
          <span>{{ playingAll && !speech.paused ? t('media.speech.pause') : t('media.speech.panel.playAll') }}</span>
        </button>
        <IconButton v-if="here" :icon="Square" :label="t('media.speech.stop')" small @click="stopSpeech()" />
        <span class="grow xs muted ellipsis">{{ conn.name }} · {{ t('media.speech.panel.count', { n: segments.length }) }}</span>
        <IconButton v-if="!allReady" :icon="generating ? LoaderCircle : Sparkles" :class="{ spin: generating }" :label="t('media.speech.generateAll')" :disabled="generating" small @click="generateMessage(mesid)" />
        <IconButton v-if="anyMade" :icon="RotateCcw" :label="t('media.speech.regenerateAll')" :disabled="generating" small @click="regenerate(mesid)" />
        <IconButton v-if="anyMade" :icon="Trash2" :label="t('media.speech.deleteAll')" :disabled="generating" danger small @click="deleteAudio(mesid)" />
        <IconButton :icon="Download" :label="t('media.speech.download')" :disabled="generating" small align="end" @click="download" />
      </div>
      <p v-if="format" class="speech-panel-format xs muted">
        <span>{{ t('media.speech.panel.tags') }}</span><Help :text="format" align="start" />
      </p>
      <ol class="speech-panel-list">
        <li v-for="(s, i) in segments" :key="s.id" class="speech-panel-seg" :class="[s.kind, statusOf(s, i), { edited: s.original !== undefined }]" :data-seg="s.id">
          <div class="speech-panel-head">
            <IconButton
              :icon="playingSeg(s) && !speech.paused ? Pause : statusOf(s, i) === 'loading' ? LoaderCircle : Play" :class="{ spin: statusOf(s, i) === 'loading' && !playingSeg(s) }"
              :label="playingSeg(s) && !speech.paused ? t('media.speech.pause') : t('media.speech.play')" :active="playingSeg(s)" small align="start" class="speech-panel-play" @click="playLine(mesid, s.id)"
            />
            <strong class="speech-panel-who ellipsis">{{ who(s) }}</strong>
            <span class="xs muted ellipsis grow" :title="t('media.speech.panel.voice')">{{ voiceOf(s) }}</span>
            <span class="badge speech-panel-state" :class="{ neutral: statusOf(s, i) === 'none' || statusOf(s, i) === 'loading', warn: statusOf(s, i) === 'error' }">{{ t(`media.speech.state.${statusOf(s, i)}`) }}</span>
          </div>
          <p v-if="s.kind === 'speech' && s.display !== draft(s)" class="speech-panel-display small muted">{{ s.display }}</p>
          <textarea
            class="input small speech-panel-text" rows="2" :value="draft(s)" :aria-label="t('media.speech.panel.text', { who: who(s) })" spellcheck="false"
            @input="edit(s, $event)" @keydown="onKey(s, $event)"
          />
          <div class="speech-panel-actions">
            <span v-if="s.original !== undefined && !dirty(s)" class="xs muted grow">{{ t('media.speech.panel.edited') }}</span>
            <span v-else class="grow" />
            <template v-if="dirty(s)">
              <button type="button" class="btn ghost" @click="cancel(s)">{{ t('common.cancel') }}</button>
              <button type="button" class="btn primary speech-panel-save" @click="save(s)">{{ t('media.speech.panel.save') }}</button>
            </template>
            <template v-else>
              <IconButton v-if="s.original !== undefined" :icon="Undo2" :label="t('media.speech.panel.revert')" small class="speech-panel-revert" @click="revert(s)" />
              <IconButton
                :icon="states[i] ? RotateCcw : Sparkles" :label="states[i] ? t('media.speech.regenerateLine') : t('media.speech.panel.generate')"
                :disabled="statusOf(s, i) === 'loading'" small class="speech-panel-regen" @click="states[i] ? regenerateLine(s) : generateLine(mesid, s.id)"
              />
              <IconButton v-if="states[i] === 'ready' || states[i] === 'error'" :icon="Trash2" :label="t('media.speech.deleteLine')" danger small align="end" class="speech-panel-delete" @click="deleteAudio(mesid, [s.id])" />
            </template>
          </div>
        </li>
      </ol>
    </template>
  </div>
</template>
