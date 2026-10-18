<script setup lang="ts">
/** Question-mark icon that reveals help text on hover / focus / tap (§16.3 Tooltip). */
import { ref } from 'vue';
import { CircleHelp } from 'lucide-vue-next';
import { useBubble, type Align } from './bubble';

const props = defineProps<{ text?: string; align?: Align; below?: boolean }>();
const anchor = ref<HTMLElement | null>(null);
const { open, bubble } = useBubble(anchor, () => props);
</script>

<template>
  <span v-if="text" ref="anchor" class="tip help" @mouseenter="open = true" @mouseleave="open = false">
    <button type="button" class="icon-btn sm" :aria-label="text" @click.stop="open = !open" @blur="open = false">
      <CircleHelp />
    </button>
    <span v-if="open" ref="bubble" class="tip-bubble" popover="manual" role="tooltip">{{ text }}</span>
  </span>
</template>
