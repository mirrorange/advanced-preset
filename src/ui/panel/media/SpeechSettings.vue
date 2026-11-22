<script setup lang="ts">
/**
 * Speech synthesis settings: switches, connections (API, endpoint, key, model, narrator voice,
 * character voices) and request overrides. Character voices are global or belong to a character
 * card; only the global ones and those of the current chat's cards are shown.
 */
import { computed } from 'vue';
import { AudioLines, Plus, Trash2 } from 'lucide-vue-next';
import { t } from '@/i18n';
import { activeConnection, copyConnection, mediaSettings, saveMedia, SPEECH_APIS, type SpeechApi, type SpeechConnection, type VoiceBinding, type VoiceRef } from '@/store/media';
import { chatCards } from '@/st/cards';
import { ui } from '@/ui/state';
import { changeSpeechApi, newSpeechConnection } from '@/media/speech/connections';
import { speechProvider } from '@/media/speech/providers';
import { gcVoices } from '@/media/speech/service';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';
import IconButton from '../../components/IconButton.vue';
import ConnectionBar from './ConnectionBar.vue';
import ScopeSelect from './ScopeSelect.vue';
import AdvancedRequest from './AdvancedRequest.vue';
import VoicePicker from './VoicePicker.vue';

const speech = computed(() => mediaSettings().speech);
const conn = computed(() => activeConnection(speech.value));
const provider = computed(() => (conn.value ? speechProvider(conn.value.api) : undefined));

const apiLabel = (api: string) => t(`media.api.${api}`);
const set = (k: 'enabled' | 'auto' | 'narrator', v: boolean) => { speech.value[k] = v; saveMedia(); };

function edit<K extends keyof SpeechConnection>(k: K, v: SpeechConnection[K]) {
  const c = conn.value;
  if (!c) return;
  c[k] = v;
  saveMedia();
}

function add() {
  const c = newSpeechConnection('fish', t('media.connection.default', { n: speech.value.connections.length + 1 }));
  speech.value.connections.push(c);
  speech.value.active = c.id;
  saveMedia();
}
function copy(c: SpeechConnection) {
  const n = copyConnection(c, t('media.connection.copyName', { name: c.name }));
  speech.value.connections.push(n);
  speech.value.active = n.id;
  saveMedia();
}
function remove(c: SpeechConnection) {
  speech.value.connections = speech.value.connections.filter((x) => x.id !== c.id);
  if (speech.value.active === c.id) speech.value.active = speech.value.connections[0]?.id ?? null;
  saveMedia();
  void gcVoices();
}
const select = (id: string) => { speech.value.active = id; saveMedia(); };
const rename = (c: SpeechConnection, name: string) => { c.name = name; saveMedia(); };
const setApi = (api: SpeechApi) => { if (conn.value) { changeSpeechApi(conn.value, api); saveMedia(); void gcVoices(); } };

// The current chat's cards (re-read when the chat or its group changes).
const cards = computed(() => { void ui.chatRev; return chatCards(); });

/** Binding groups: global, then one per card of the chat. */
const groups = computed(() => {
  const c = conn.value;
  if (!c) return [];
  const scopes: { card: string; name: string }[] = [{ card: '', name: t('media.speech.global') }, ...cards.value.map((x) => ({ card: x.key, name: x.name }))];
  return scopes.map((g) => ({ ...g, bindings: c.bindings.filter((b) => (b.card ?? '') === g.card) }));
});

const scopeOptions = computed(() => groups.value.map((g) => ({ value: g.card, label: g.name })));

function addBinding(card: string) {
  conn.value?.bindings.push({ character: '', voice: null, ...(card ? { card } : {}) });
  saveMedia();
}
function setBinding(b: VoiceBinding, patch: Partial<{ character: string; voice: VoiceRef | null }>) {
  Object.assign(b, patch);
  saveMedia();
}
function moveBinding(b: VoiceBinding, card: string) {
  if (card) b.card = card;
  else delete b.card;
  saveMedia();
}
function removeBinding(b: VoiceBinding) {
  const c = conn.value;
  if (!c) return;
  c.bindings = c.bindings.filter((x) => x !== b);
  saveMedia();
  void gcVoices();
}
</script>

<template>
  <Section :title="t('media.speech')" :icon="AudioLines">
    <template #actions><Switch :model-value="speech.enabled" :label="t('media.speech')" @update:model-value="set('enabled', $event)" /></template>
    <template v-if="speech.enabled">
      <Field :label="t('media.auto')" :help="t('media.speech.auto.hint')" inline><Switch :model-value="speech.auto" @update:model-value="set('auto', $event)" /></Field>
      <Field :label="t('media.speech.narrator')" :help="t('media.speech.narrator.hint')" inline><Switch :model-value="speech.narrator" @update:model-value="set('narrator', $event)" /></Field>
      <ConnectionBar :connections="speech.connections" :active="conn" :api-label="apiLabel" @select="select" @add="add" @copy="copy" @remove="remove" @rename="rename" />
      <div v-if="conn" :key="conn.id" class="col media-conn">
        <Field :label="t('media.speech.api')">
          <select class="input" :value="conn.api" @change="setApi(($event.target as HTMLSelectElement).value as SpeechApi)">
            <option v-for="a in SPEECH_APIS" :key="a" :value="a">{{ apiLabel(a) }}</option>
          </select>
        </Field>
        <Field :label="t('media.baseUrl')">
          <input class="input" :value="conn.baseUrl" :placeholder="provider?.defaults.baseUrl" spellcheck="false" @change="edit('baseUrl', ($event.target as HTMLInputElement).value.trim())" />
        </Field>
        <Field :label="t('media.apiKey')">
          <input class="input" type="password" autocomplete="off" :value="conn.apiKey" @change="edit('apiKey', ($event.target as HTMLInputElement).value.trim())" />
        </Field>
        <Field :label="t('media.model')">
          <input class="input" :list="`ap-speech-models-${conn.api}`" :value="conn.model" :placeholder="provider?.defaults.model" spellcheck="false" @change="edit('model', ($event.target as HTMLInputElement).value.trim())" />
          <datalist :id="`ap-speech-models-${conn.api}`"><option v-for="m in provider?.models ?? []" :key="m" :value="m" /></datalist>
        </Field>
        <Field v-if="speech.narrator" :label="t('media.speech.narratorVoice')">
          <VoicePicker :connection="conn" :model-value="conn.narrator" :label="t('media.speech.narratorVoice')" :placeholder="t('media.speech.providerDefault')" @update:model-value="edit('narrator', $event)" />
        </Field>
        <Field :label="t('media.speech.bindings')" :help="t('media.speech.bindings.hint')">
          <div class="col">
            <div v-for="g in groups" :key="g.card" class="col tight">
              <div v-if="groups.length > 1" class="media-ref-group-title ellipsis">{{ g.name }}</div>
              <div v-for="(b, i) in g.bindings" :key="i" class="speech-binding">
                <input class="input" :value="b.character" :placeholder="t('media.speech.character')" @change="setBinding(b, { character: ($event.target as HTMLInputElement).value.trim() })" />
                <VoicePicker class="grow" :connection="conn" :model-value="b.voice" :label="b.character || t('media.speech.character')" @update:model-value="setBinding(b, { voice: $event })" />
                <ScopeSelect v-if="groups.length > 1" :model-value="g.card" :options="scopeOptions" :label="t('media.speech.scope')" @update:model-value="moveBinding(b, $event)" />
                <IconButton :icon="Trash2" :label="t('common.delete')" small danger align="end" @click="removeBinding(b)" />
              </div>
              <button type="button" class="btn ghost add" @click="addBinding(g.card)"><Plus />{{ t('media.speech.addBinding') }}</button>
            </div>
          </div>
        </Field>
        <AdvancedRequest :connection="conn" @changed="saveMedia()" />
      </div>
    </template>
  </Section>
</template>
