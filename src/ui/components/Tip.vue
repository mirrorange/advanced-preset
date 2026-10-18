<script setup lang="ts">
/** Hover bubble for any trigger (icon buttons, chips). */
import { ref } from 'vue';
import { useBubble, type Align } from './bubble';

const props = defineProps<{ text?: string; align?: Align; below?: boolean }>();
const anchor = ref<HTMLElement | null>(null);
const { open, bubble } = useBubble(anchor, () => props);
</script>

<template>
  <span ref="anchor" class="tip" @mouseenter="open = true" @mouseleave="open = false" @focusin="open = true" @focusout="open = false">
    <slot />
    <span v-if="open && text" ref="bubble" class="tip-bubble" popover="manual" role="tooltip">{{ text }}</span>
  </span>
</template>
