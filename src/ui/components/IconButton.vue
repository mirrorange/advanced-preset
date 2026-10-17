<script setup lang="ts">
/** Icon-only button; the label doubles as tooltip and accessible name. */
import type { Component } from 'vue';
import Tip from './Tip.vue';

defineProps<{ icon: Component; label: string; active?: boolean; danger?: boolean; disabled?: boolean; small?: boolean; align?: 'center' | 'start' | 'end'; below?: boolean }>();
defineEmits<{ click: [e: MouseEvent] }>();
</script>

<template>
  <Tip :text="label" :align="align" :below="below">
    <button type="button" class="icon-btn" :class="{ active, danger, sm: small }" :disabled="disabled" :aria-label="label" @click="$emit('click', $event)">
      <component :is="icon" />
    </button>
  </Tip>
</template>
