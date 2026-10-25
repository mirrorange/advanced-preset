<script setup lang="ts">
/** Preset parameters. */
import { computed } from 'vue';
import { SlidersVertical } from 'lucide-vue-next';
import type { Param } from '@advanced-preset/protocol';
import { t, pt, presetLocale } from '@/i18n';
import { usePreset } from '../use';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';

const { preset, config, update } = usePreset();

const paramGroups = computed(() => {
  const p = preset.value;
  if (!p) return [];
  const ids = [...new Set(p.params.map((x) => x.group ?? ''))];
  return ids
    .map((g) => ({
      id: g,
      order: p.groups[g]?.order ?? 999,
      label: g ? pt(p, 'groups', g, 'label', p.groups[g]?.label ?? g) : t('writing.params'),
      help: g ? pt(p, 'groups', g, 'description', p.groups[g]?.description ?? '') || undefined : undefined,
      params: p.params.filter((x) => (x.group ?? '') === g),
    }))
    .sort((a, b) => a.order - b.order);
});

const label = (x: Param) => pt(preset.value!, 'params', x.id, 'label', x.label);
const help = (x: Param) => pt(preset.value!, 'params', x.id, 'description', x.description ?? '') || undefined;
const optionLabel = (x: Param, value: string | number, fallback?: string) => {
  return presetLocale(preset.value!)?.params?.[x.id]?.options?.[String(value)] ?? fallback ?? String(value);
};
const value = (x: Param) => config.value?.params[x.id] ?? x.default;
const setParam = (x: Param, raw: string) => update((c) => { c.params[x.id] = x.type === 'number' ? Number(raw) || 0 : raw; });

const listId = (x: Param) => `ap-param-${x.id}`;
</script>

<template>
  <NoPreset v-if="!preset || !config" />
  <template v-else>
    <Section v-for="g in paramGroups" :key="g.id" :title="g.label" :help="g.help" :icon="SlidersVertical">
      <Field v-for="x in g.params" :key="x.id" :label="label(x)" :help="help(x)">
        <select v-if="x.type === 'select'" class="input" :value="value(x)" @change="setParam(x, ($event.target as HTMLSelectElement).value)">
          <option v-for="o in x.options" :key="String(o.value)" :value="o.value">{{ optionLabel(x, o.value, o.label) }}</option>
        </select>
        <div v-else-if="x.type === 'number'" class="unit">
          <input class="input" type="number" :min="x.min" :max="x.max" :value="value(x)" :placeholder="x.unset" @change="setParam(x, ($event.target as HTMLInputElement).value)" />
          <span v-if="x.unit" class="small muted">{{ x.unit }}</span>
        </div>
        <template v-else>
          <input class="input" :list="x.options?.length ? listId(x) : undefined" :value="value(x)" :placeholder="x.unset" @change="setParam(x, ($event.target as HTMLInputElement).value)" />
          <datalist v-if="x.options?.length" :id="listId(x)">
            <option v-for="o in x.options" :key="String(o.value)" :value="o.value">{{ optionLabel(x, o.value, o.label) }}</option>
          </datalist>
        </template>
      </Field>
    </Section>
  </template>
</template>
