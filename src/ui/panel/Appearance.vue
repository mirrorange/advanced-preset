<script setup lang="ts">
/** UI preferences (outside the configuration layer): theme colours, stage collapsing and inline annotations. */
import { computed } from 'vue';
import { Palette, RotateCcw } from 'lucide-vue-next';
import { settings, save } from '@/store/settings';
import { t } from '@/i18n';
import Section from '../components/Section.vue';
import Field from '../components/Field.vue';
import Switch from '../components/Switch.vue';
import IconButton from '../components/IconButton.vue';

const ui = settings().ui;
const color = (k: 'primary' | 'accent') => computed({
  get: () => ui[k] ?? '',
  set: (v: string) => { ui[k] = v || undefined; save(); },
});
const primary = color('primary');
const accent = color('accent');
const collapse = computed({ get: () => ui.collapseStages, set: (v: boolean) => { ui.collapseStages = v; save(); } });
const reset = () => { ui.primary = undefined; ui.accent = undefined; save(); };
const annotations = () => (ui.annotations ??= { show: true });
const showAnnotations = computed({ get: () => ui.annotations?.show !== false, set: (v: boolean) => { annotations().show = v; save(); } });
const annotationColor = computed({ get: () => ui.annotations?.color ?? '', set: (v: string) => { annotations().color = v || undefined; save(); } });
</script>

<template>
  <Section :title="t('appearance.title')" :icon="Palette" collapsible :open="false">
    <Field :label="t('appearance.colors')" :help="t('appearance.colors.hint')" inline>
      <div class="swatches">
        <label class="swatch" :style="{ background: primary || 'var(--ap-primary-500)' }" :title="t('appearance.primary')"><input v-model.lazy="primary" type="color" /></label>
        <label class="swatch" :style="{ background: accent || 'var(--ap-accent-500)' }" :title="t('appearance.accent')"><input v-model.lazy="accent" type="color" /></label>
        <IconButton :icon="RotateCcw" :label="t('common.reset')" small align="end" :disabled="!primary && !accent" @click="reset" />
      </div>
    </Field>
    <Field :label="t('appearance.collapseStages')" inline><Switch v-model="collapse" /></Field>
    <Field :label="t('appearance.annotations')" :help="t('appearance.annotations.hint')" inline><Switch v-model="showAnnotations" /></Field>
    <Field v-if="showAnnotations" :label="t('appearance.annotationColor')" inline>
      <div class="swatches">
        <label class="swatch" :style="{ background: annotationColor || 'var(--ap-accent)' }" :title="t('appearance.annotationColor')"><input v-model.lazy="annotationColor" type="color" /></label>
        <IconButton :icon="RotateCcw" :label="t('common.reset')" small align="end" :disabled="!annotationColor" @click="annotationColor = ''" />
      </div>
    </Field>
  </Section>
</template>
