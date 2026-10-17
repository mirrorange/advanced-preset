<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
defineProps<{ label?: string; disabled?: boolean }>();
</script>

<template>
  <label class="switch" :aria-label="label">
    <input v-model="model" type="checkbox" role="switch" :disabled="disabled" />
    <span class="track" />
    <span class="thumb" />
  </label>
</template>
