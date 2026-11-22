<script setup lang="ts">
/** Question-mark icon that reveals help text on mouse hover, keyboard focus or a click / tap (§16.3 Tooltip). */
import { ref } from 'vue';
import { CircleHelp } from 'lucide-vue-next';
import { useBubble, useTipTriggers, type Align } from './bubble';

const props = defineProps<{ text?: string; align?: Align; below?: boolean }>();
const anchor = ref<HTMLElement | null>(null);
const { open, bubble } = useBubble(anchor, () => props);
const on = useTipTriggers(open);
</script>

<template>
  <span v-if="text" ref="anchor" class="tip help" @pointerenter="on.onPointerenter" @pointerleave="on.onPointerleave" @focusin="on.onFocusin" @focusout="on.onFocusout">
    <button type="button" class="icon-btn sm" :aria-label="text" @click.stop="on.toggle">
      <CircleHelp />
    </button>
    <span v-if="open" ref="bubble" class="tip-bubble" popover="manual" role="tooltip">{{ text }}</span>
  </span>
</template>
