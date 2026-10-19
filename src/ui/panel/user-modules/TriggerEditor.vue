<script setup lang="ts">
/** Trigger rules of a user module: match mode, rule rows and an "add condition" picker. */
import { computed, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { APreset, Trigger, TriggerRule } from '@advanced-preset/protocol';
import { t } from '@/i18n';
import Segmented from '../../components/Segmented.vue';
import RuleRow from './RuleRow.vue';
import { newRule, subjectGroups } from './subjects';

const props = defineProps<{ preset: APreset }>();
const trigger = defineModel<Trigger>({ required: true });

const groups = computed(() => subjectGroups(props.preset));
const picker = ref<HTMLSelectElement | null>(null);
const matchOptions = computed(() => [
  { value: 'all' as const, label: t('um.match.all') },
  { value: 'any' as const, label: t('um.match.any') },
]);

function add(subject: string) {
  if (!subject) return;
  trigger.value.rules.push(newRule(props.preset, subject));
  if (picker.value) picker.value.value = '';
}
const setRule = (i: number, r: TriggerRule) => { trigger.value.rules.splice(i, 1, r); };
const removeRule = (i: number) => { trigger.value.rules.splice(i, 1); };
</script>

<template>
  <div class="trigger">
    <Segmented v-if="trigger.rules.length > 1" v-model="trigger.match" :options="matchOptions" />
    <div v-if="!trigger.rules.length" class="always faint small">{{ t('um.always') }}</div>
    <template v-for="(r, i) in trigger.rules" :key="i">
      <div v-if="i > 0" class="rule-join xs faint">{{ trigger.match === 'any' ? t('um.match.anyJoin') : t('um.match.allJoin') }}</div>
      <RuleRow :model-value="r" :preset="preset" @update:model-value="setRule(i, $event)" @remove="removeRule(i)" />
    </template>
    <label class="btn ghost add picker">
      <Plus />{{ t('um.addRule') }}
      <select ref="picker" :aria-label="t('um.addRule')" @change="add(($event.target as HTMLSelectElement).value)">
        <option value="" disabled selected hidden />
        <optgroup v-for="g in groups" :key="g.label" :label="g.label">
          <option v-for="s in g.subjects" :key="s.id" :value="s.id">{{ s.label }}</option>
        </optgroup>
      </select>
    </label>
  </div>
</template>
