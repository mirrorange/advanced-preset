<script setup lang="ts">
/** Label + optional help + control. `inline` puts the control on the right (switches, short inputs). */
import Help from './Help.vue';

defineProps<{ label: string; help?: string; inline?: boolean; modified?: boolean }>();
</script>

<template>
  <div class="field" :class="{ inline }">
    <div class="field-label">
      <span class="ellipsis">{{ label }}</span>
      <span v-if="modified" class="dot modified" />
      <Help :text="help" align="start" />
    </div>
    <div class="field-control"><slot /></div>
  </div>
</template>
