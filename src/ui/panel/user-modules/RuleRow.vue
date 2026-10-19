<script setup lang="ts">
/** One trigger rule: subject picker on top, operator and value controls below. */
import { computed } from 'vue';
import { Regex, X } from 'lucide-vue-next';
import { DEFAULT_KEYWORD_DEPTH, ruleError, type APreset, type KeywordRule, type Literal, type TriggerRule, type VarOp, type VarRule } from '@advanced-preset/protocol';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';
import Segmented from '../../components/Segmented.vue';
import ChipsInput from '../../components/ChipsInput.vue';
import { OPS, newRule, opLabel, retarget, subjectGroups, subjectOf, targets, varInfo } from './subjects';

const props = defineProps<{ preset: APreset }>();
const rule = defineModel<TriggerRule>({ required: true });
defineEmits<{ remove: [] }>();

const groups = computed(() => subjectGroups(props.preset));
const subject = computed(() => subjectOf(rule.value));
const picks = computed(() => targets(props.preset, subject.value));
const target = computed(() => (rule.value.kind === 'var' ? rule.value.path.split('.').slice(1).join('.') : ''));
const info = computed(() => (rule.value.kind === 'var' ? varInfo(props.preset, rule.value.path) : null));
const error = computed(() => ruleError(rule.value));
const listId = `ap-um-${Math.random().toString(36).slice(2, 8)}`;

function setSubject(id: string) {
  if (id !== subject.value) rule.value = newRule(props.preset, id);
}
function setTarget(id: string) {
  const r = rule.value as VarRule;
  const head = r.path.split('.')[0];
  rule.value = retarget(props.preset, r, `${head}.${id}`);
}
const patchVar = (p: Partial<VarRule>) => { rule.value = { ...(rule.value as VarRule), ...p }; };
const patchKw = (p: Partial<KeywordRule>) => { rule.value = { ...(rule.value as KeywordRule), ...p }; };

const selected = computed(() => {
  const v = (rule.value as VarRule).value;
  return (Array.isArray(v) ? v : []).map(String);
});
function toggleOption(value: string | number) {
  const v = (rule.value as VarRule).value;
  const list: Literal[] = Array.isArray(v) ? [...v] : [];
  const i = list.findIndex((x) => String(x) === String(value));
  if (i >= 0) list.splice(i, 1);
  else list.push(value);
  patchVar({ value: list });
}
const boolOptions = computed(() => OPS.bool.map((op) => ({ value: op, label: opLabel('bool', op, (rule.value as VarRule).path) })));
const opOptions = computed(() => (info.value ? OPS[info.value.kind] : []).map((op) => ({ value: op, label: opLabel(info.value!.kind, op) })));
const scope = computed({
  get: () => (rule.value as KeywordRule).target,
  set: (v: KeywordRule['target']) => patchKw(v === 'recent' ? { target: v, depth: (rule.value as KeywordRule).depth ?? DEFAULT_KEYWORD_DEPTH } : { target: v, depth: undefined }),
});
const scopeOptions = computed(() => [
  { value: 'input' as const, label: t('um.kw.input') },
  { value: 'recent' as const, label: t('um.kw.recent') },
]);
</script>

<template>
  <div class="rule">
    <div class="rule-head">
      <select class="input bare rule-subject" :value="subject" :aria-label="t('um.subject')" @change="setSubject(($event.target as HTMLSelectElement).value)">
        <optgroup v-for="g in groups" :key="g.label" :label="g.label">
          <option v-for="s in g.subjects" :key="s.id" :value="s.id">{{ s.label }}</option>
        </optgroup>
        <option v-if="rule.kind === 'var' && !groups.some((g) => g.subjects.some((s) => s.id === subject))" :value="subject">{{ rule.path }}</option>
      </select>
      <select v-if="picks.length" class="input bare rule-target grow" :value="target" @change="setTarget(($event.target as HTMLSelectElement).value)">
        <option v-for="o in picks" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
        <option v-if="!picks.some((o) => String(o.value) === target)" :value="target" disabled>{{ target }}</option>
      </select>
      <span v-else class="grow" />
      <IconButton :icon="X" :label="t('um.removeRule')" small align="end" @click="$emit('remove')" />
    </div>

    <!-- keyword -->
    <div v-if="rule.kind === 'keyword'" class="rule-body">
      <div class="row wrap">
        <Segmented v-model="scope" class="rule-scope" :options="scopeOptions" />
        <label v-if="rule.target === 'recent'" class="unit small muted">
          <input class="input depth" type="number" min="1" max="50" :value="rule.depth ?? DEFAULT_KEYWORD_DEPTH" @change="patchKw({ depth: Math.max(1, Math.min(50, Number(($event.target as HTMLInputElement).value) || 1)) })" />
          {{ t('um.kw.messages') }}
        </label>
        <select class="input bare rule-op" :value="rule.op" @change="patchKw({ op: ($event.target as HTMLSelectElement).value as KeywordRule['op'] })">
          <option value="any">{{ t('um.kw.any') }}</option>
          <option value="none">{{ t('um.kw.none') }}</option>
        </select>
      </div>
      <div class="row kw-words">
        <ChipsInput
          class="grow" :model-value="rule.words" :literal="rule.regex" :mono="rule.regex" :remove-label="t('common.delete')"
          :placeholder="rule.regex ? t('um.kw.regexPlaceholder') : t('um.kw.placeholder')" @update:model-value="patchKw({ words: $event })"
        />
        <IconButton :icon="Regex" :label="t('um.kw.regex')" :active="rule.regex" align="end" @click="patchKw({ regex: rule.regex ? undefined : true })" />
      </div>
    </div>

    <!-- expression -->
    <div v-else-if="rule.kind === 'expr'" class="rule-body">
      <input class="input mono" :value="rule.source" spellcheck="false" placeholder='params.language == "English"' @input="rule = { kind: 'expr', source: ($event.target as HTMLInputElement).value }" />
    </div>

    <!-- variable -->
    <div v-else-if="info" class="rule-body">
      <Segmented v-if="info.kind === 'bool'" :model-value="rule.op" :options="boolOptions" @update:model-value="patchVar({ op: $event as VarOp })" />
      <template v-else-if="info.kind === 'enum'">
        <select class="input bare rule-op" :value="rule.op" @change="patchVar({ op: ($event.target as HTMLSelectElement).value as VarOp })">
          <option v-for="o in opOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <div class="row wrap option-chips">
          <button
            v-for="o in info.options" :key="String(o.value)" type="button" class="chip" :class="{ on: selected.includes(String(o.value)) }"
            :aria-pressed="selected.includes(String(o.value))" @click="toggleOption(o.value)"
          >{{ o.label }}</button>
        </div>
      </template>
      <div v-else class="row">
        <select class="input rule-cmp" :value="rule.op" @change="patchVar({ op: ($event.target as HTMLSelectElement).value as VarOp })">
          <option v-for="o in opOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <input
          v-if="info.kind === 'number'" class="input grow" type="number" :value="rule.value as number"
          @change="patchVar({ value: Number(($event.target as HTMLInputElement).value) })"
        />
        <template v-else>
          <input class="input grow" :list="info.suggestions?.length ? listId : undefined" :value="rule.value as string" @input="patchVar({ value: ($event.target as HTMLInputElement).value })" />
          <datalist v-if="info.suggestions?.length" :id="listId">
            <option v-for="s in info.suggestions" :key="s" :value="s" />
          </datalist>
        </template>
      </div>
    </div>
    <div v-if="error" class="rule-error xs">{{ error }}</div>
  </div>
</template>
