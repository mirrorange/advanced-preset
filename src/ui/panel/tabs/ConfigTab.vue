<script setup lang="ts">
import { computed, ref } from 'vue';
import { Cable, Check, Coins, DatabaseZap, Drama, Gauge, GitBranch, MessagesSquare, Pencil, Plus, Puzzle, RotateCcw, Save, Trash2, Workflow as WorkflowIcon, X } from 'lucide-vue-next';
import { STORYLINE_CONFIG_DEFAULTS, STORYLINE_FREEZE_MODES, freezeMode, type StorylineFreeze, THOUGHT_SIGNATURE_CHANNELS, TOOL_ARG_STREAMING, TRANSPORTS, USER_INPUT_MODES, signatureChannel, type ThoughtSignatureChannel, structureComponents, structureUiHash, type Transport, type UserInputMode } from '@advanced-preset/protocol';
import {
  deleteSaved, isModified, overwriteSaved, presetState, renameSaved, resetConfiguration, saveConfigurationAs, selectConfiguration,
} from '@/store/config';
import { pushSampling } from '@/store/carrier';
import { customUiEnabled, setCustomUi } from '@/store/custom-ui';
import { getPresetEntry } from '@/store/presets';
import { askCustomUi } from '@/app/trust';
import { t, pt } from '@/i18n';
import { usePreset } from '../use';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';
import Segmented from '../../components/Segmented.vue';
import IconButton from '../../components/IconButton.vue';

const { preset, config, update } = usePreset();
const state = computed(() => (preset.value ? presetState(preset.value) : null));
const refKey = computed({
  get: () => (state.value ? `${state.value.active.ref.kind}:${state.value.active.ref.id}` : ''),
  set: (v: string) => {
    const p = preset.value;
    if (!p) return;
    const [kind, ...rest] = v.split(':');
    selectConfiguration(p, { kind: kind as 'recommended' | 'saved', id: rest.join(':') });
    void pushSampling(p);
  },
});
// Custom structure components (I-137): enable / disable; enabling an installed preset asks for trust.
const components = computed(() => {
  const p = preset.value;
  if (!p) return [];
  return structureComponents(p).map((c) => ({
    id: c.id,
    title: pt(p, 'structures', c.id, 'title', p.structures[c.id]?.title || c.id),
    mode: c.mode,
    position: p.structures[c.id]?.ui?.position ?? 'bottom',
  }));
});
const customUi = computed({
  get: () => (preset.value ? customUiEnabled(preset.value) : false),
  set: (on: boolean) => {
    const p = preset.value;
    if (!p) return;
    const source = getPresetEntry(p.id)?.source;
    if (!on || source === 'builtin' || source === 'dev') setCustomUi(p, on);
    else void askCustomUi(p);
  },
});
const customUiChanged = computed(() => {
  const s = state.value?.customUi;
  return Boolean(preset.value && s?.enabled && s.hash !== structureUiHash(preset.value));
});
const modified = computed(() => (preset.value ? isModified(preset.value) : false));
const savedRef = computed(() => (state.value?.active.ref.kind === 'saved' ? state.value.active.ref.id : null));

const naming = ref<null | 'new' | 'rename'>(null);
const name = ref('');
function startNaming(mode: 'new' | 'rename') {
  naming.value = mode;
  name.value = mode === 'rename' ? state.value?.saved.find((c) => c.id === savedRef.value)?.name ?? '' : '';
}
function commitName() {
  const p = preset.value;
  const n = name.value.trim();
  if (!p || !n) return;
  if (naming.value === 'new') saveConfigurationAs(p, n);
  else if (savedRef.value) renameSaved(p, savedRef.value, n);
  naming.value = null;
}
const reset = () => { if (preset.value) { resetConfiguration(preset.value); void pushSampling(preset.value); } };
const remove = () => { if (preset.value && savedRef.value) { deleteSaved(preset.value, savedRef.value); void pushSampling(preset.value); } };
const overwrite = () => { if (preset.value && savedRef.value) overwriteSaved(preset.value, savedRef.value); };

const transportOptions = computed(() => TRANSPORTS.map((x) => ({ value: x, label: t(`transport.${x}`), hint: t(`transport.${x}.hint`) })));
const transport = computed({ get: () => config.value?.connection.transport ?? 'prefill', set: (v: Transport) => update((c) => { c.connection.transport = v; }) });
const isTool = computed(() => transport.value === 'tool-single' || transport.value === 'tool-multi');

const storyWorkflows = computed(() => (preset.value?.workflows ?? []).filter((w) => w.kind === 'story'));
const workflowOptions = computed(() => storyWorkflows.value.map((w) => ({
  value: w.id,
  label: pt(preset.value!, 'workflows', w.id, 'name', w.name),
  hint: pt(preset.value!, 'workflows', w.id, 'description', w.description ?? ''),
})));
const workflow = computed({ get: () => config.value?.connection.workflow ?? '', set: (v: string) => update((c) => { c.connection.workflow = v; }) });
const workflowHelp = computed(() => workflowOptions.value.find((w) => w.value === workflow.value)?.hint);

function conn<K extends keyof NonNullable<typeof config.value>['connection']>(key: K) {
  return computed({
    get: () => config.value!.connection[key],
    set: (v) => update((c) => { c.connection[key] = v; }),
  });
}
const forceTool = conn('forceTool');
const parallelTools = conn('parallelTools');
// Off is stored as `false`, which older versions also read as off.
const thoughtSignature = computed({
  get: () => (config.value ? signatureChannel(config.value.connection) : 'off'),
  set: (v: ThoughtSignatureChannel) => update((c) => { c.connection.sendThoughtSignature = v === 'off' ? false : v; }),
});
const openAiSignatures = conn('openAiSignatures');
const streamToolArguments = conn('streamToolArguments');
const finalFallback = conn('finalFallback');
const maxSteps = conn('maxSteps');
const syntheticTurn = computed({
  get: () => config.value?.connection.syntheticTurn ?? '',
  set: (v: string) => update((c) => { c.connection.syntheticTurn = v || null; }),
});

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
const metaOn = computed({
  get: () => config.value?.meta?.enabled !== false,
  set: (v: boolean) => update((c) => { c.meta.enabled = v; }),
});
const storylinesOn = computed({
  get: () => config.value?.storylines?.enabled !== false,
  set: (v: boolean) => update((c) => { c.storylines = { ...STORYLINE_CONFIG_DEFAULTS, ...c.storylines, enabled: v }; }),
});
const freezeOptions = computed(() => STORYLINE_FREEZE_MODES.map((x) => ({ value: x, label: t(`storylines.freeze.${x}`), hint: t(`storylines.freeze.${x}.hint`) })));
const freezeVariables = computed({
  get: () => freezeMode(config.value?.storylines),
  set: (v: StorylineFreeze) => update((c) => { c.storylines = { ...STORYLINE_CONFIG_DEFAULTS, ...c.storylines, freezeVariables: v }; }),
});
const setRecent = (v: string) => update((c) => { c.meta.recentCount = Math.max(0, Number(v) || 0); });
const cache = computed({
  get: () => config.value?.cache?.enabled ?? false,
  set: (v: boolean) => update((c) => { c.cache.enabled = v; }),
});
const setCache = (k: 'ttlMinutes' | 'maxDeferredTurns', v: string) => update((c) => { c.cache[k] = Math.max(0, Math.round(Number(v) || 0)); });
/** Sampling controls shown here; everything else stays editable in ST and syncs back. */
const SLIDERS: { key: string; min: number; max: number; step: number }[] = [
  { key: 'temperature', min: 0, max: 2, step: 0.01 },
  { key: 'top_p', min: 0, max: 1, step: 0.01 },
  { key: 'top_k', min: 0, max: 500, step: 1 },
  { key: 'min_p', min: 0, max: 1, step: 0.001 },
  { key: 'top_a', min: 0, max: 1, step: 0.001 },
  { key: 'frequency_penalty', min: -2, max: 2, step: 0.01 },
  { key: 'presence_penalty', min: -2, max: 2, step: 0.01 },
  { key: 'repetition_penalty', min: 1, max: 2, step: 0.01 },
];
const NUMBERS = ['openai_max_context', 'openai_max_tokens', 'seed'];
const SWITCHES = ['stream_openai', 'show_thoughts'];
const EFFORTS = ['auto', 'min', 'low', 'medium', 'high', 'max'];
const sampling = computed(() => config.value?.sampling ?? {});
const has = (k: string) => k in sampling.value;
const setSampling = (k: string, v: unknown) => update((c) => { c.sampling[k] = v; }, { sampling: true });
const num = (e: Event) => Number((e.target as HTMLInputElement).value);
</script>

<template>
  <NoPreset v-if="!preset || !config || !state" />
  <template v-else>
    <div class="col">
      <div class="row">
        <select v-model="refKey" class="input grow" :aria-label="t('config.configuration')">
          <optgroup :label="t('config.recommended')">
            <option v-for="c in preset.configurations" :key="c.id" :value="`recommended:${c.id}`">{{ pt(preset, 'configurations', c.id, 'name', c.name) }}</option>
          </optgroup>
          <optgroup v-if="state.saved.length" :label="t('config.saved')">
            <option v-for="c in state.saved" :key="c.id" :value="`saved:${c.id}`">{{ c.name }}</option>
          </optgroup>
        </select>
        <IconButton v-if="savedRef && modified" :icon="Save" :label="t('config.overwrite')" align="end" @click="overwrite" />
        <IconButton :icon="Plus" :label="t('config.saveAs')" align="end" @click="startNaming('new')" />
        <IconButton v-if="savedRef" :icon="Pencil" :label="t('common.rename')" align="end" @click="startNaming('rename')" />
        <IconButton v-if="savedRef" :icon="Trash2" :label="t('common.delete')" align="end" danger @click="remove" />
        <IconButton :icon="RotateCcw" :label="t('config.reset')" align="end" :disabled="!modified" @click="reset" />
      </div>
      <form v-if="naming" class="row" @submit.prevent="commitName">
        <input v-model="name" class="input grow" :placeholder="t('config.name')" autofocus />
        <IconButton :icon="X" :label="t('common.cancel')" align="end" @click="naming = null" />
        <IconButton :icon="Check" :label="t('common.save')" align="end" active @click="commitName" />
      </form>
      <span v-if="modified" class="xs muted row tight"><span class="dot modified" />{{ t('config.modified') }}</span>
    </div>

    <Section :title="t('config.connection')" :icon="Cable">
      <Field :label="t('config.transport')" :help="t(`transport.${transport}.hint`)">
        <Segmented v-model="transport" :options="transportOptions" />
      </Field>
      <template v-if="isTool">
        <Field :label="t('config.forceTool')" :help="t('config.forceTool.hint')" inline><Switch v-model="forceTool" /></Field>
        <Field :label="t('config.parallelTools')" :help="t('config.parallelTools.hint')" inline><Switch v-model="parallelTools" /></Field>
        <Field :label="t('config.syntheticTurn')" :help="t('config.syntheticTurn.hint')" inline>
          <select v-model="syntheticTurn" class="input">
            <option value="">{{ t('common.none') }}</option>
            <option v-for="s in preset.syntheticTurns" :key="s.id" :value="s.id">{{ s.label }}</option>
          </select>
        </Field>
        <Field :label="t('config.thoughtSignature')" :help="t('config.thoughtSignature.hint')" inline>
          <select v-model="thoughtSignature" class="input">
            <option v-for="m in THOUGHT_SIGNATURE_CHANNELS" :key="m" :value="m">{{ t(`config.thoughtSignature.${m}`) }}</option>
          </select>
        </Field>
        <Field :label="t('config.openAiSignatures')" :help="t('config.openAiSignatures.hint')" inline><Switch v-model="openAiSignatures" /></Field>
        <Field :label="t('config.streamToolArguments')" :help="t('config.streamToolArguments.hint')" inline>
          <select v-model="streamToolArguments" class="input">
            <option v-for="m in TOOL_ARG_STREAMING" :key="m" :value="m">{{ t(`config.streamToolArguments.${m}`) }}</option>
          </select>
        </Field>
        <Field v-if="transport === 'tool-multi'" :label="t('config.maxSteps')" inline>
          <input class="input" type="number" min="1" max="20" :value="maxSteps" @change="maxSteps = num($event)" />
        </Field>
      </template>
      <Field :label="t('config.finalFallback')" :help="t('config.finalFallback.hint')" inline><Switch v-model="finalFallback" /></Field>
    </Section>

    <Section v-if="workflowOptions.length > 1" :title="t('config.workflow')" :icon="WorkflowIcon" :help="workflowHelp">
      <Segmented v-model="workflow" :options="workflowOptions" />
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

    <Section :title="t('writing.meta')" :icon="MessagesSquare" :help="t('writing.meta.hint')">
      <template #actions><Switch v-model="metaOn" :label="t('writing.meta')" /></template>
      <template v-if="metaOn">
        <Field :label="t('writing.recentCount')" :help="t('writing.recentCount.hint')" inline>
          <input class="input" type="number" min="0" max="20" :value="config.meta.recentCount" @change="setRecent(($event.target as HTMLInputElement).value)" />
        </Field>
      </template>
    </Section>

    <Section v-if="preset.storylines" :title="t('storylines.enabled')" :icon="GitBranch" :help="t('storylines.config.hint')">
      <template #actions><Switch v-model="storylinesOn" :label="t('storylines.enabled')" /></template>
      <template v-if="storylinesOn">
        <Field :label="t('storylines.freezeVariables')" :help="t('storylines.freezeVariables.hint')">
          <Segmented v-model="freezeVariables" :options="freezeOptions" />
        </Field>
      </template>
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

    <Section v-if="components.length" :title="t('config.customUi')" :icon="Puzzle" :help="t('config.customUi.hint')">
      <template #actions><Switch v-model="customUi" :label="t('config.customUi.enable')" /></template>
      <p v-if="customUiChanged && !customUi" class="xs muted">{{ t('config.customUi.changed') }}</p>
      <ul class="custom-ui-list small">
        <li v-for="c in components" :key="c.id" class="row tight">
          <span class="grow ellipsis">{{ c.title }}</span>
          <span class="xs faint">{{ t(`config.customUi.${c.mode}`) }} · {{ t(`config.customUi.${c.position}`) }}</span>
        </li>
      </ul>
    </Section>

    <Section :title="t('config.sampling')" :icon="Gauge" collapsible :open="false">
      <template v-for="s in SLIDERS" :key="s.key">
        <Field v-if="has(s.key)" :label="t(`sampling.${s.key}`)">
          <div class="slider">
            <input type="range" :min="s.min" :max="s.max" :step="s.step" :value="sampling[s.key]" @input="setSampling(s.key, num($event))" />
            <input class="input" type="number" :min="s.min" :max="s.max" :step="s.step" :value="sampling[s.key]" @change="setSampling(s.key, num($event))" />
          </div>
        </Field>
      </template>
      <div class="field-grid">
        <template v-for="k in NUMBERS" :key="k">
          <Field v-if="has(k)" :label="t(`sampling.${k}`)">
            <input class="input" type="number" :value="sampling[k]" @change="setSampling(k, num($event))" />
          </Field>
        </template>
        <Field v-if="has('reasoning_effort')" :label="t('sampling.reasoning_effort')">
          <select class="input" :value="sampling.reasoning_effort" @change="setSampling('reasoning_effort', ($event.target as HTMLSelectElement).value)">
            <option v-for="e in EFFORTS" :key="e" :value="e">{{ t(`effort.${e}`) }}</option>
          </select>
        </Field>
      </div>
      <template v-for="k in SWITCHES" :key="k">
        <Field v-if="has(k)" :label="t(`sampling.${k}`)" inline>
          <Switch :model-value="Boolean(sampling[k])" @update:model-value="setSampling(k, $event)" />
        </Field>
      </template>
    </Section>
  </template>
</template>
