<script setup lang="ts">
/** Multimodal tab: CORS proxy, then image generation / speech synthesis for the features the preset declares (Panel.vue shows the tab only then). */
import { computed } from 'vue';
import { Network } from 'lucide-vue-next';
import { t } from '@/i18n';
import { isTauriTavern } from '@/st/host';
import { mediaSettings, saveMedia, type CorsMode, type CorsSettings } from '@/store/media';
import { declaresImage, declaresSpeech } from '@/media/decl';
import { usePreset } from '../use';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Segmented from '../../components/Segmented.vue';
import ImageSettings from '../media/ImageSettings.vue';
import SpeechSettings from '../media/SpeechSettings.vue';

const { preset } = usePreset();
const cors = computed(() => mediaSettings().cors);

const modeOptions = (['auto', 'on', 'off'] as CorsMode[]).map((value) => ({ value, label: t(`media.cors.${value}`), hint: t(`media.cors.${value}.hint`) }));
const proxyOptions = computed(() => [
  { value: 'host' as const, label: isTauriTavern() ? 'TauriTavern' : 'SillyTavern', hint: t(isTauriTavern() ? 'media.proxy.host.tt' : 'media.proxy.host.st') },
  { value: 'custom' as const, label: t('media.proxy.custom'), hint: t('media.proxy.custom.hint') },
]);
function set<K extends keyof CorsSettings>(k: K, v: CorsSettings[K]) { cors.value[k] = v; saveMedia(); }
</script>

<template>
  <NoPreset v-if="!preset" />
  <template v-else>
    <Section :title="t('media.cors')" :icon="Network" collapsible :open="cors.mode !== 'auto' || cors.proxy !== 'host'">
      <Segmented :model-value="cors.mode" :options="modeOptions" @update:model-value="set('mode', $event as CorsMode)" />
      <template v-if="cors.mode !== 'off'">
        <Field :label="t('media.proxy')">
          <Segmented :model-value="cors.proxy" :options="proxyOptions" @update:model-value="set('proxy', $event as CorsSettings['proxy'])" />
        </Field>
        <Field v-if="cors.proxy === 'custom'" :label="t('media.proxy.url')">
          <input class="input mono" :value="cors.customUrl" placeholder="https://proxy.example/?url={url}" spellcheck="false" @change="set('customUrl', ($event.target as HTMLInputElement).value.trim())" />
        </Field>
      </template>
    </Section>
    <ImageSettings v-if="declaresImage(preset)" />
    <SpeechSettings v-if="declaresSpeech(preset)" />
  </template>
</template>
