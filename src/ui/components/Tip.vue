<script setup lang="ts">
/** Hover bubble for any trigger (icon buttons, chips). */
import { ref } from 'vue';

defineProps<{ text?: string; align?: 'center' | 'start' | 'end'; below?: boolean }>();
const open = ref(false);
</script>

<template>
  <span class="tip" @mouseenter="open = true" @mouseleave="open = false" @focusin="open = true" @focusout="open = false">
    <slot />
    <span v-if="open && text" class="tip-bubble" :class="[align !== 'center' && align, { below }]" role="tooltip">{{ text }}</span>
  </span>
</template>
