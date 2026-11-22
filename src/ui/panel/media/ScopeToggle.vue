<script setup lang="ts">
/**
 * Where an item applies: a button that switches between global and the open character card (in a
 * group chat it steps through global and each member's card). `''`: global.
 */
import { computed } from 'vue';
import { Globe, UserRound } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ modelValue: string; options: { value: string; label: string }[] }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const at = computed(() => Math.max(0, props.options.findIndex((o) => o.value === props.modelValue)));
const next = computed(() => props.options[(at.value + 1) % props.options.length]);
const label = computed(() => t('media.scope.toggle', { current: props.options[at.value]?.label ?? '', next: next.value?.label ?? '' }));
</script>

<template>
  <IconButton
    class="scope-toggle" :icon="modelValue ? UserRound : Globe" :active="Boolean(modelValue)" :label="label" small align="end"
    @click="next && $emit('update:modelValue', next.value)"
  />
</template>
