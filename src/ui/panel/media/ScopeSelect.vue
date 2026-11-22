<script setup lang="ts">
/** Where an item applies (global or a card of the chat): an icon button over a native select, to fit narrow rows. */
import { FolderInput } from 'lucide-vue-next';
import Tip from '../../components/Tip.vue';

defineProps<{ modelValue: string; options: { value: string; label: string }[]; label: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <Tip :text="label" align="end">
    <span class="icon-btn sm scope-select">
      <FolderInput />
      <select :value="modelValue" :aria-label="label" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </span>
  </Tip>
</template>
