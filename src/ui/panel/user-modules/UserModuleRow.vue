<script setup lang="ts">
/** One row of "My modules": grip, name and points, flags, and its switch (a radio in a single group). */
import { GripVertical, TriangleAlert, Zap } from 'lucide-vue-next';
import { lostRefs, partEnabled, ruleComplete, type APreset, type UserModule } from '@advanced-preset/protocol';
import { t, pt } from '@/i18n';
import Switch from '../../components/Switch.vue';
import Tip from '../../components/Tip.vue';
import { describeTrigger } from './subjects';

const props = defineProps<{ preset: APreset; module: UserModule; single?: boolean; grip?: boolean; dragging?: boolean }>();
const emit = defineEmits<{ open: []; toggle: [on: boolean]; grab: [e: PointerEvent] }>();

const pointLabel = (id: string) => {
  const p = props.preset.insertionPoints.find((x) => x.id === id);
  return p ? pt(props.preset, 'insertionPoints', id, 'label', p.label) : id;
};
const varLabel = (id: string) => {
  const v = props.preset.vars.find((x) => x.id === id);
  return v ? pt(props.preset, 'vars', id, 'label', v.label ?? id) : id;
};
const pointsOf = (m: UserModule) => [...new Set(m.entries.filter(partEnabled).map((e) => e.point))].map(pointLabel).concat(m.vars.filter(partEnabled).map((u) => varLabel(u.var))).join(' · ');
const lost = (m: UserModule) => lostRefs(props.preset, m);
const hasTrigger = (m: UserModule) => m.trigger.rules.some(ruleComplete);
</script>

<template>
  <div class="um-row" :class="{ off: !module.enabled, dragging }" :data-id="module.id">
    <span v-if="grip" class="um-grip" :aria-label="t('um.reorder')" @pointerdown="emit('grab', $event)"><GripVertical /></span>
    <button type="button" class="um-open" @click="emit('open')">
      <span class="um-row-name ellipsis">{{ module.name || t('um.untitled') }}</span>
      <span class="um-row-meta xs muted ellipsis">{{ pointsOf(module) || t('um.noEntries') }}</span>
    </button>
    <Tip v-if="lost(module).length" :text="t('um.lostHint', { points: lost(module).join(', ') })" align="end"><TriangleAlert class="text-warning um-flag" tabindex="0" /></Tip>
    <Tip v-if="hasTrigger(module)" :text="describeTrigger(preset, module.trigger)" align="end"><Zap class="um-flag um-zap" tabindex="0" /></Tip>
    <button
      v-if="single" type="button" role="radio" class="um-radio" :class="{ on: module.enabled }" :aria-checked="module.enabled"
      :aria-label="module.name" :title="t(module.enabled ? 'um.grp.radioOff' : 'um.grp.radioOn')" @click="emit('toggle', !module.enabled)"
    ><span class="radio" /></button>
    <Switch v-else :model-value="module.enabled" :label="module.name" @update:model-value="emit('toggle', $event)" />
  </div>
</template>
