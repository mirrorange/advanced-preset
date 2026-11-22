<script setup lang="ts">
/** Hover bubble for any trigger (icon buttons, chips): mouse hover or keyboard focus, not touch. */
import { ref } from 'vue';
import { useBubble, useTipTriggers, type Align } from './bubble';

const props = defineProps<{ text?: string; align?: Align; below?: boolean }>();
const anchor = ref<HTMLElement | null>(null);
const { open, bubble } = useBubble(anchor, () => props);
const on = useTipTriggers(open);
</script>

<template>
  <span ref="anchor" class="tip" @pointerenter="on.onPointerenter" @pointerleave="on.onPointerleave" @focusin="on.onFocusin" @focusout="on.onFocusout">
    <slot />
    <span v-if="open && text" ref="bubble" class="tip-bubble" popover="manual" role="tooltip">{{ text }}</span>
  </span>
</template>
