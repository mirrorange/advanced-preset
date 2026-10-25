<script setup lang="ts">
/** Preset parameters, actor names / prefixes, token saving and meta settings. */
import { computed } from 'vue';
import { Coins, DatabaseZap, Drama, MessagesSquare, SlidersVertical } from 'lucide-vue-next';
import { USER_INPUT_MODES, type Param, type UserInputMode } from '@advanced-preset/protocol';
import { t, pt, presetLocale } from '@/i18n';
import { usePreset } from '../use';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';
import Segmented from '../../components/Segmented.vue';

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

const actors = computed(() => Object.entries(preset.value?.actors ?? {}));
const setIdentity = (kind: 'names' | 'prefixes', id: string, v: string) => update((c) => { c.identity[kind][id] = v; });

const tokenSaving = computed({
  get: () => config.value?.tokenSaving.enabled ?? false,
  set: (v: boolean) => update((c) => { c.tokenSaving.enabled = v; }),
});
const setTs = (k: 'keepFullTurns' | 'truncateUserAfter', v: string) => update((c) => { c.tokenSaving[k] = Math.max(0, Number(v) || 0); });
const userInputOptions = computed(() => USER_INPUT_MODES.map((x) => ({ value: x, label: t(`writing.userInput.${x}`), hint: t(`writing.userInput.${x}.hint`) })));
const userInput = computed({
  get: () => config.value?.tokenSaving.userInput ?? 'truncate',
  set: (v: UserInputMode) => update((c) => { c.tokenSaving.userInput = v; }),
});
const cache = computed({
  get: () => config.value?.cache?.enabled ?? false,
  set: (v: boolean) => update((c) => { c.cache.enabled = v; }),
});
const setCache = (k: 'ttlMinutes' | 'maxDeferredTurns', v: string) => update((c) => { c.cache[k] = Math.max(0, Math.round(Number(v) || 0)); });
const setRecent = (v: string) => update((c) => { c.meta.recentCount = Math.max(0, Number(v) || 0); });
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

    <Section :title="t('writing.actors')" :icon="Drama" collapsible :open="false">
      <div v-for="[id, a] in actors" :key="id" class="field-grid">
        <Field :label="t('writing.actorName', { actor: id })">
          <input class="input" :value="config.identity.names[id] ?? ''" :placeholder="a.name" @change="setIdentity('names', id, ($event.target as HTMLInputElement).value)" />
        </Field>
        <Field :label="t('writing.actorPrefix')">
          <input class="input" :value="config.identity.prefixes[id] ?? ''" :placeholder="a.prefix" @change="setIdentity('prefixes', id, ($event.target as HTMLInputElement).value)" />
        </Field>
      </div>
    </Section>

    <Section :title="t('writing.tokenSaving')" :icon="Coins" :help="t('writing.tokenSaving.hint')">
      <template #actions><Switch v-model="tokenSaving" :label="t('writing.tokenSaving')" /></template>
      <template v-if="tokenSaving">
        <Field :label="t('writing.keepFullTurns')" :help="t('writing.keepFullTurns.hint')" inline>
          <input class="input" type="number" min="0" :value="config.tokenSaving.keepFullTurns" @change="setTs('keepFullTurns', ($event.target as HTMLInputElement).value)" />
        </Field>
        <Field :label="t('writing.userInput')" :help="t('writing.userInput.hint')">
          <Segmented v-model="userInput" :options="userInputOptions" />
        </Field>
        <Field v-if="userInput === 'truncate'" :label="t('writing.truncateUserAfter')" :help="t('writing.truncateUserAfter.hint')" inline>
          <input class="input" type="number" min="0" :value="config.tokenSaving.truncateUserAfter" @change="setTs('truncateUserAfter', ($event.target as HTMLInputElement).value)" />
        </Field>
      </template>
    </Section>

    <Section :title="t('writing.cache')" :icon="DatabaseZap" :help="t('writing.cache.hint')">
      <template #actions><Switch v-model="cache" :label="t('writing.cache')" /></template>
      <template v-if="cache">
        <Field :label="t('writing.cacheTtl')" :help="t('writing.cacheTtl.hint')" inline>
          <input class="input" type="number" min="0" :value="config.cache.ttlMinutes" @change="setCache('ttlMinutes', ($event.target as HTMLInputElement).value)" />
        </Field>
        <Field :label="t('writing.cacheMaxDeferred')" :help="t('writing.cacheMaxDeferred.hint')" inline>
          <input class="input" type="number" min="0" :value="config.cache.maxDeferredTurns" @change="setCache('maxDeferredTurns', ($event.target as HTMLInputElement).value)" />
        </Field>
      </template>
    </Section>

    <Section :title="t('writing.meta')" :icon="MessagesSquare">
      <Field :label="t('writing.recentCount')" :help="t('writing.recentCount.hint')" inline>
        <input class="input" type="number" min="0" max="20" :value="config.meta.recentCount" @change="setRecent(($event.target as HTMLInputElement).value)" />
      </Field>
    </Section>
  </template>
</template>
