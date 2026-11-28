<script setup lang="ts">
/**
 * Connection section of the Config tab: connection bindings (the default one is the connection
 * itself), what each sends to (ST's connection, a Connection Manager profile or a model name), the
 * transport options of the binding being edited, and the binding used when multi-model is off.
 */
import { computed, ref, watch } from 'vue';
import { Cable, Check, Copy, Pencil, Plus, Trash2, X } from 'lucide-vue-next';
import {
  BINDING_TARGET_TYPES, DEFAULT_BINDING, THOUGHT_SIGNATURE_CHANNELS, TOOL_ARG_STREAMING, TRANSPORTS, cloneData, signatureChannel,
  type BindingTarget, type BindingTransport, type ConnectionBinding, type ThoughtSignatureChannel,
} from '@advanced-preset/protocol';
import { listBindings, type ResolvedBinding } from '@/core/bindings';
import { chatCompletionModel, connectionProfiles, st, type ConnectionProfile } from '@/st/host';
import { baseConfiguration } from '@/store/config';
import { t } from '@/i18n';
import { usePreset } from '../use';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';
import Segmented from '../../components/Segmented.vue';
import IconButton from '../../components/IconButton.vue';

const { preset, config, update } = usePreset();

const bindings = computed(() => (config.value ? listBindings(config.value) : []));
const editingId = ref(DEFAULT_BINDING);
const editing = computed(() => bindings.value.find((b) => b.id === editingId.value) ?? bindings.value[0]);
watch(bindings, (all) => { if (!all.some((b) => b.id === editingId.value)) editingId.value = DEFAULT_BINDING; });
const bindingLabel = (b: ResolvedBinding) => (b.id === DEFAULT_BINDING ? t('config.binding.default') : b.name || b.id);

type Editable = Partial<ConnectionBinding>;
/** Change the binding being edited: the connection itself for the default binding. */
function edit(mutate: (b: Editable) => void) {
  const id = editing.value?.id ?? DEFAULT_BINDING;
  update((c) => {
    if (id === DEFAULT_BINDING) return mutate(c.connection as Editable);
    const b = c.connection.bindings?.[id];
    if (b) mutate(b);
  });
}
function field<K extends keyof BindingTransport>(key: K) {
  return computed({
    get: () => editing.value![key],
    set: (v: BindingTransport[K]) => edit((b) => { b[key] = v; }),
  });
}

// ── binding list ────────────────────────────────────────────────────────────
const currentModel = () => chatCompletionModel(st().chatCompletionSettings ?? {});
function transportOf(b: ResolvedBinding): BindingTransport {
  const { id: _id, name: _name, target: _target, ...transport } = cloneData(b);
  return transport;
}
function addBinding(from: ResolvedBinding, name: string, target: BindingTarget) {
  const taken = new Set(bindings.value.map((b) => b.id));
  let n = bindings.value.length;
  while (taken.has(`b${n}`)) n++;
  const id = `b${n}`;
  update((c) => { c.connection.bindings = { ...c.connection.bindings, [id]: { name, target, ...transportOf(from) } }; });
  editingId.value = id;
}
const add = () => addBinding(bindings.value[0]!, t('config.binding.newName', { n: bindings.value.length }), { type: 'model', model: currentModel() });
const copy = () => { const b = editing.value; if (b) addBinding(b, t('media.connection.copyName', { name: bindingLabel(b) }), cloneData(b.target)); };
function remove() {
  const p = preset.value;
  const id = editing.value?.id;
  if (!p || !id || id === DEFAULT_BINDING) return;
  // A binding of the recommended / saved layer is masked with null; one the user added is just dropped.
  const inBase = Boolean(baseConfiguration(p).connection.bindings?.[id]);
  update((c) => {
    const all = { ...c.connection.bindings } as Record<string, ConnectionBinding | null>;
    if (inBase) all[id] = null;
    else delete all[id];
    c.connection.bindings = all as Record<string, ConnectionBinding>;
    if (c.connection.binding === id) c.connection.binding = DEFAULT_BINDING;
    for (const [actor, b] of Object.entries(c.multiModel?.actors ?? {})) if (b === id) c.multiModel!.actors[actor] = DEFAULT_BINDING;
  });
  editingId.value = DEFAULT_BINDING;
}
const naming = ref(false);
const newName = ref('');
function startRename() { newName.value = editing.value?.name ?? ''; naming.value = true; }
function commitRename() {
  const n = newName.value.trim();
  if (n) edit((b) => { b.name = n; });
  naming.value = false;
}

const active = computed({
  get: () => (bindings.value.some((b) => b.id === config.value?.connection.binding) ? config.value!.connection.binding! : DEFAULT_BINDING),
  set: (v: string) => update((c) => { c.connection.binding = v; }),
});
const multiModelOn = computed(() => Boolean(preset.value?.multiModel) && config.value?.multiModel?.enabled === true);

// ── target ──────────────────────────────────────────────────────────────────
/** Chat Completion profiles of ST's Connection Manager, read again whenever the picker opens. */
const profiles = ref<ConnectionProfile[]>([]);
const loadProfiles = () => { profiles.value = connectionProfiles().filter((p) => !p.mode || p.mode === 'cc'); };
loadProfiles();
const targetOptions = computed(() => BINDING_TARGET_TYPES.map((x) => ({ value: x, label: t(`config.binding.target.${x}`), hint: t(`config.binding.target.${x}.hint`) })));
const targetType = computed({
  get: () => editing.value?.target.type ?? 'current',
  set: (v: BindingTarget['type']) => {
    loadProfiles();
    const target: BindingTarget = v === 'profile' ? { type: 'profile', profile: profiles.value[0]?.id ?? '' } : v === 'model' ? { type: 'model', model: currentModel() } : { type: 'current' };
    edit((b) => { b.target = target; });
  },
});
const profileId = computed({
  get: () => (editing.value?.target.type === 'profile' ? editing.value.target.profile : ''),
  set: (v: string) => edit((b) => { b.target = { type: 'profile', profile: v }; }),
});
const profileMissing = computed(() => Boolean(profileId.value) && !profiles.value.some((p) => p.id === profileId.value));
const model = computed(() => (editing.value?.target.type === 'model' ? editing.value.target.model : ''));
const setModel = (v: string) => edit((b) => { b.target = { type: 'model', model: v.trim() }; });

// ── transport options of the binding ────────────────────────────────────────
const transportOptions = computed(() => TRANSPORTS.map((x) => ({ value: x, label: t(`transport.${x}`), hint: t(`transport.${x}.hint`) })));
const transport = field('transport');
const isTool = computed(() => editing.value?.transport === 'tool-single' || editing.value?.transport === 'tool-multi');
const forceTool = field('forceTool');
const parallelTools = field('parallelTools');
// Off is stored as `false`, which older versions also read as off.
const thoughtSignature = computed({
  get: () => (editing.value ? signatureChannel(editing.value) : 'off'),
  set: (v: ThoughtSignatureChannel) => edit((b) => { b.sendThoughtSignature = v === 'off' ? false : v; }),
});
const openAiSignatures = field('openAiSignatures');
const streamToolArguments = field('streamToolArguments');
const maxSteps = field('maxSteps');
const assumeToolSupport = field('assumeToolSupport');
const syntheticTurn = computed({
  get: () => editing.value?.syntheticTurn ?? '',
  set: (v: string) => edit((b) => { b.syntheticTurn = v || null; }),
});
const finalFallback = computed({
  get: () => config.value?.connection.finalFallback ?? true,
  set: (v: boolean) => update((c) => { c.connection.finalFallback = v; }),
});
const num = (e: Event) => Number((e.target as HTMLInputElement).value);
</script>

<template>
  <Section v-if="preset && config && editing" :title="t('config.connection')" :icon="Cable">
    <Field :label="t('config.binding')" :help="t('config.binding.hint')">
      <div v-if="naming" class="row tight">
        <input v-model="newName" class="input grow" :aria-label="t('common.rename')" @keydown.enter="commitRename" @keydown.esc="naming = false" />
        <IconButton :icon="X" :label="t('common.cancel')" small @click="naming = false" />
        <IconButton :icon="Check" :label="t('common.save')" small active @click="commitRename" />
      </div>
      <div v-else class="row tight">
        <select v-model="editingId" class="input grow" :aria-label="t('config.binding')">
          <option v-for="b in bindings" :key="b.id" :value="b.id">{{ bindingLabel(b) }}</option>
        </select>
        <IconButton :icon="Plus" :label="t('config.binding.add')" small @click="add" />
        <IconButton :icon="Copy" :label="t('common.copy')" small @click="copy" />
        <template v-if="editing.id !== 'default'">
          <IconButton :icon="Pencil" :label="t('common.rename')" small @click="startRename" />
          <IconButton :icon="Trash2" :label="t('common.delete')" small danger align="end" @click="remove" />
        </template>
      </div>
    </Field>
    <Field :label="t('config.binding.target')" :help="t(`config.binding.target.${targetType}.hint`)">
      <Segmented v-model="targetType" :options="targetOptions" />
    </Field>
    <Field v-if="targetType === 'profile'" :label="t('config.binding.profile')" :help="t('config.binding.profile.hint')">
      <select v-if="profiles.length || profileMissing" v-model="profileId" class="input" @focus="loadProfiles">
        <option v-if="profileMissing" :value="profileId">{{ t('config.binding.profile.missing') }}</option>
        <option v-for="p in profiles" :key="p.id" :value="p.id">{{ p.name || p.id }}</option>
      </select>
      <span v-else class="xs muted">{{ t('config.binding.profile.none') }}</span>
    </Field>
    <Field v-if="targetType === 'model'" :label="t('config.binding.model')" :help="t('config.binding.model.hint')">
      <input class="input" :value="model" :placeholder="currentModel()" @change="setModel(($event.target as HTMLInputElement).value)" />
    </Field>

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
      <Field v-if="editing.transport === 'tool-multi'" :label="t('config.maxSteps')" inline>
        <input class="input" type="number" min="1" max="20" :value="maxSteps" @change="maxSteps = num($event)" />
      </Field>
      <Field :label="t('config.assumeToolSupport')" :help="t('config.assumeToolSupport.hint')" inline><Switch v-model="assumeToolSupport" /></Field>
    </template>

    <Field v-if="bindings.length > 1" :label="t('config.binding.active')" :help="t(multiModelOn ? 'config.binding.active.multiModel' : 'config.binding.active.hint')" inline>
      <select v-model="active" class="input">
        <option v-for="b in bindings" :key="b.id" :value="b.id">{{ bindingLabel(b) }}</option>
      </select>
    </Field>
    <Field :label="t('config.finalFallback')" :help="t('config.finalFallback.hint')" inline><Switch v-model="finalFallback" /></Field>
  </Section>
</template>
