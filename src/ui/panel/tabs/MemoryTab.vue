<script setup lang="ts">
/** Chat memory, global memory (undo / redo) and the current recap (§12.2–12.3). Edits append user events. */
import { computed, ref, watch } from 'vue';
import { Check, Globe, MessageCircle, Redo2, ScrollText, Undo2 } from 'lucide-vue-next';
import { st } from '@/st/host';
import { presetState } from '@/store/config';
import {
  appendGlobal, appendUserChatEvent, canRedoGlobal, canUndoGlobal, chatMemory, currentRecap, globalMemory, redoGlobal, undoGlobal,
} from '@/store/eventlog';
import { t } from '@/i18n';
import { bumpChat, ui } from '../../state';
import { usePreset } from '../use';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import KvEditor from '../../components/KvEditor.vue';
import IconButton from '../../components/IconButton.vue';

const { preset } = usePreset();
const state = computed(() => (preset.value ? presetState(preset.value) : null));
const hasChat = computed(() => { void ui.chatRev; return Boolean(st().chatMetadata && (st().characterId !== undefined || st().groupId)); });

const chat = computed(() => { void ui.chatRev; return hasChat.value ? chatMemory() : {}; });
const global = computed(() => (state.value ? globalMemory(state.value) : {}));
const recap = computed(() => { void ui.chatRev; return hasChat.value ? currentRecap() : null; });

async function setChat(key: string, content: string) { await appendUserChatEvent({ type: 'memory.replace', key, content, source: 'user' }); bumpChat(); }
async function removeChat(key: string) { await appendUserChatEvent({ type: 'memory.delete', key, source: 'user' }); bumpChat(); }
const setGlobal = (key: string, content: string) => state.value && appendGlobal(state.value, 'replace', key, content, 'user');
const removeGlobal = (key: string) => state.value && appendGlobal(state.value, 'delete', key, undefined, 'user');

const recapDraft = ref('');
watch(recap, (r) => { recapDraft.value = r?.text ?? ''; }, { immediate: true });
const recapDirty = computed(() => recapDraft.value !== (recap.value?.text ?? ''));
async function saveRecap() {
  await appendUserChatEvent({ type: 'recap.set', text: recapDraft.value, coversUpTo: recap.value?.coversUpTo ?? st().chat.length - 1, source: 'user' });
  bumpChat();
}
</script>

<template>
  <NoPreset v-if="!preset || !state" />
  <template v-else>
    <Section :title="t('memory.chat')" :icon="MessageCircle" :help="t('memory.chat.hint')">
      <KvEditor v-if="hasChat" :entries="chat" @set="setChat" @remove="removeChat" />
      <div v-else class="faint small">{{ t('memory.noChat') }}</div>
    </Section>
    <Section :title="t('memory.global')" :icon="Globe" :help="t('memory.global.hint')">
      <template #actions>
        <IconButton :icon="Undo2" :label="t('common.undo')" small align="end" :disabled="!canUndoGlobal(state)" @click="undoGlobal(state)" />
        <IconButton :icon="Redo2" :label="t('common.redo')" small align="end" :disabled="!canRedoGlobal(state)" @click="redoGlobal(state)" />
      </template>
      <KvEditor :entries="global" @set="setGlobal" @remove="removeGlobal" />
    </Section>
    <Section :title="t('memory.recap')" :icon="ScrollText" :help="t('memory.recap.hint')">
      <template #actions>
        <span v-if="recap" class="badge neutral">#0–{{ recap.coversUpTo }}</span>
        <IconButton v-if="hasChat" :icon="Check" :label="t('common.save')" small align="end" :disabled="!recapDirty" active @click="saveRecap" />
      </template>
      <textarea v-if="hasChat" v-model="recapDraft" class="input" rows="6" :placeholder="t('memory.recap.empty')" />
      <div v-else class="faint small">{{ t('memory.noChat') }}</div>
    </Section>
  </template>
</template>
