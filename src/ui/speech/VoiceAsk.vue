<script setup lang="ts">
/** Pick a voice for a character that has none: the voice, and the card it belongs to (or global). */
import { nextTick, onBeforeUnmount, ref, toRaw, watch } from 'vue';
import { t } from '@/i18n';
import { holdVoices } from '@/media/speech/service';
import { norm } from '@/media/speech/segments';
import type { VoiceRef } from '@/media/speech/types';
import VoicePicker from '../panel/media/VoicePicker.vue';
import { voiceAsk } from './ask';

const dialog = ref<HTMLDialogElement>();
const voice = ref<VoiceRef | null>(null);
const card = ref('');

watch(() => voiceAsk.request, async (r) => {
  voice.value = null;
  // The card of the same name (a group member speaking), else the first card of the chat.
  card.value = (r?.cards.find((c) => norm(c.name) === norm(r.character)) ?? r?.cards[0])?.key ?? '';
  if (!r) return;
  await nextTick();
  if (!dialog.value?.open) dialog.value?.showModal();
}, { immediate: true });

// Reference audio uploaded here is not in the settings until saved.
onBeforeUnmount(holdVoices(() => [voice.value]));

function finish(ok: boolean) {
  const r = voiceAsk.request;
  if (!r) return;
  dialog.value?.close();
  const v = voice.value ? toRaw(voice.value) : null;
  r.done(ok && v ? { voice: v, ...(card.value ? { card: card.value } : {}) } : null);
}
</script>

<template>
  <dialog v-if="voiceAsk.request" ref="dialog" class="voice-ask" :aria-label="t('media.speech.ask', { name: voiceAsk.request.character })" @cancel.prevent="finish(false)" @keydown.stop>
    <div class="col">
      <strong>{{ t('media.speech.ask', { name: voiceAsk.request.character }) }}</strong>
      <VoicePicker :connection="voiceAsk.request.conn" :model-value="voice" :label="voiceAsk.request.character" @update:model-value="voice = $event" />
      <select v-if="voiceAsk.request.cards.length" v-model="card" class="input" :aria-label="t('media.speech.scope')">
        <option v-for="c in voiceAsk.request.cards" :key="c.key" :value="c.key">{{ c.name }}</option>
        <option value="">{{ t('media.speech.global') }}</option>
      </select>
      <div class="row end">
        <button type="button" class="btn" @click="finish(false)">{{ t('common.cancel') }}</button>
        <button type="button" class="btn primary" :disabled="!voice" @click="finish(true)">{{ t('common.save') }}</button>
      </div>
    </div>
  </dialog>
</template>
