<script setup lang="ts">
/**
 * Message player (design §6), above the story text: play / pause the whole message, a track of its
 * lines (width by length; generated, generating, playing, failed), generate all, download, and
 * regenerate / delete the audio of the whole message, or (while playing) of the current line.
 * A click on the track plays from that line.
 */
import { computed, watch } from 'vue';
import { Download, LoaderCircle, Pause, Play, RotateCcw, Sparkles, Square, Trash2 } from 'lucide-vue-next';
import { t } from '@/i18n';
import { deleteAudio, generateMessage, messageAudio, playMessage, probeCache, regenerate, segmentState, speech, stopSpeech, togglePause } from '@/media/speech/service';
import type { Segment } from '@/media/speech/segments';
import { saveBlob } from '../../download';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ mesid: number; segments: Segment[] }>();

const here = computed(() => (speech.playing?.mesId === props.mesid && speech.playing.all ? speech.playing : null));
const playingId = computed(() => (speech.playing?.mesId === props.mesid ? speech.playing.segId : null));
const states = computed(() => props.segments.map((s) => segmentState(s)));
const allReady = computed(() => states.value.every((s) => s === 'ready'));
const generating = computed(() => Boolean(speech.generating[props.mesid]));
const anyMade = computed(() => states.value.some((s) => s === 'ready' || s === 'error'));
const current = computed(() => props.segments.find((s) => s.id === playingId.value));
const label = computed(() => (current.value ? current.value.character || t('media.speech.narration') : ''));

watch(() => props.segments.map((s) => s.id + s.text).join('\n'), () => { void probeCache(props.segments); }, { immediate: true });

function main() {
  if (here.value) void togglePause();
  else playMessage(props.mesid);
}
async function download() {
  const blob = await messageAudio(props.mesid);
  if (blob) saveBlob(blob, `speech-${props.mesid}.wav`);
}
</script>

<template>
  <div class="speech-card">
    <IconButton :icon="here && !speech.paused ? Pause : Play" :label="here && !speech.paused ? t('media.speech.pause') : t('media.speech.play')" :active="Boolean(here)" @click="main" />
    <div class="speech-track" role="group" :aria-label="t('media.speech.lines')">
      <button
        v-for="(s, i) in segments" :key="s.id" type="button" class="speech-seg"
        :class="[states[i], s.kind, { on: s.id === playingId }]" :style="{ flexGrow: Math.max(4, Math.min(s.display.length, 160)) }"
        :aria-label="`${s.character || t('media.speech.narration')}: ${s.display}`" :title="`${s.character || t('media.speech.narration')}: ${s.display}`"
        @click="playMessage(mesid, s.id)"
      />
    </div>
    <span v-if="label" class="speech-who xs muted ellipsis">{{ label }}</span>
    <template v-if="current && !generating">
      <IconButton :icon="RotateCcw" :label="t('media.speech.regenerateLine')" small @click="regenerate(mesid, current.id)" />
      <IconButton :icon="Trash2" :label="t('media.speech.deleteLine')" small danger @click="deleteAudio(mesid, [current.id])" />
    </template>
    <IconButton v-if="speech.playing?.mesId === mesid" :icon="Square" :label="t('media.speech.stop')" small @click="stopSpeech()" />
    <template v-else>
      <IconButton v-if="!allReady" :icon="generating ? LoaderCircle : Sparkles" :class="{ spin: generating }" :label="t('media.speech.generateAll')" :disabled="generating" small @click="generateMessage(mesid)" />
      <IconButton v-else :icon="Download" :label="t('media.speech.download')" small @click="download" />
      <template v-if="anyMade && !generating">
        <IconButton :icon="RotateCcw" :label="t('media.speech.regenerateAll')" small @click="regenerate(mesid)" />
        <IconButton :icon="Trash2" :label="t('media.speech.deleteAll')" small danger align="end" @click="deleteAudio(mesid)" />
      </template>
    </template>
  </div>
</template>
