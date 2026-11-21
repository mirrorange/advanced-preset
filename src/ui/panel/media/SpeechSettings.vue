<script setup lang="ts">
/** Speech synthesis settings (connections and speaker bindings follow). */
import { computed } from 'vue';
import { AudioLines } from 'lucide-vue-next';
import { t } from '@/i18n';
import { mediaSettings, saveMedia } from '@/store/media';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';

const speech = computed(() => mediaSettings().speech);
const set = (k: 'enabled' | 'auto' | 'narrator', v: boolean) => { speech.value[k] = v; saveMedia(); };
</script>

<template>
  <Section :title="t('media.speech')" :icon="AudioLines">
    <template #actions><Switch :model-value="speech.enabled" :label="t('media.speech')" @update:model-value="set('enabled', $event)" /></template>
    <template v-if="speech.enabled">
      <Field :label="t('media.auto')" inline><Switch :model-value="speech.auto" @update:model-value="set('auto', $event)" /></Field>
      <Field :label="t('media.speech.narrator')" inline><Switch :model-value="speech.narrator" @update:model-value="set('narrator', $event)" /></Field>
    </template>
  </Section>
</template>
