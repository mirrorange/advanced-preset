<script setup lang="ts">
/** Multi-model switch and the binding each actor runs on (presets that declare `multiModel`). */
import { computed } from 'vue';
import { Layers } from 'lucide-vue-next';
import { DEFAULT_BINDING, MULTI_MODEL_CONFIG_DEFAULTS } from '@advanced-preset/protocol';
import { listBindings } from '@/core/bindings';
import { t } from '@/i18n';
import { usePreset } from '../use';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';

const { preset, config, update } = usePreset();
const bindings = computed(() => (config.value ? listBindings(config.value) : []));
const actors = computed(() => Object.entries(preset.value?.actors ?? {}).filter(([id]) => id !== preset.value?.user));
const enabled = computed({
  get: () => config.value?.multiModel?.enabled === true,
  set: (v: boolean) => update((c) => { c.multiModel = { ...MULTI_MODEL_CONFIG_DEFAULTS, ...c.multiModel, actors: { ...c.multiModel?.actors }, enabled: v }; }),
});
const bindingOf = (actor: string) => {
  const id = config.value?.multiModel?.actors?.[actor];
  return id && bindings.value.some((b) => b.id === id) ? id : DEFAULT_BINDING;
};
const setBinding = (actor: string, id: string) => update((c) => {
  c.multiModel = { ...MULTI_MODEL_CONFIG_DEFAULTS, ...c.multiModel, actors: { ...c.multiModel?.actors, [actor]: id } };
});
</script>

<template>
  <Section v-if="preset?.multiModel && config" :title="t('multiModel.title')" :icon="Layers" :help="t('multiModel.hint')">
    <template #actions><Switch v-model="enabled" :label="t('multiModel.title')" /></template>
    <template v-if="enabled">
      <Field v-for="[id, a] in actors" :key="id" :label="config.identity.names[id] || a.name || id" :help="t('multiModel.actor.hint')" inline>
        <select class="input" :value="bindingOf(id)" @change="setBinding(id, ($event.target as HTMLSelectElement).value)">
          <option v-for="b in bindings" :key="b.id" :value="b.id">{{ b.id === 'default' ? t('config.binding.default') : b.name || b.id }}</option>
        </select>
      </Field>
      <p v-if="bindings.length < 2" class="xs muted">{{ t('multiModel.noBindings') }}</p>
    </template>
  </Section>
</template>
