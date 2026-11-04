<script setup lang="ts">
/** Icon-only button; the label doubles as tooltip and accessible name. `pressed`: a toggle (aria-pressed, shown active). */
import type { Component } from 'vue';
import Tip from './Tip.vue';

defineProps<{ icon: Component; label: string; active?: boolean; pressed?: boolean; danger?: boolean; disabled?: boolean; small?: boolean; align?: 'center' | 'start' | 'end'; below?: boolean }>();
defineEmits<{ click: [e: MouseEvent] }>();
</script>

<template>
  <Tip :text="label" :align="align" :below="below">
    <button type="button" class="icon-btn" :class="{ active: active || pressed, danger, sm: small }" :disabled="disabled" :aria-label="label" :aria-pressed="pressed === undefined ? undefined : pressed" @click="$emit('click', $event)">
      <component :is="icon" />
    </button>
  </Tip>
</template>
