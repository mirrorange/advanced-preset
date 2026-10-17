<script setup lang="ts">
/** Question-mark icon that reveals help text on hover / focus / tap (§16.3 Tooltip). */
import { ref } from 'vue';
import { CircleHelp } from 'lucide-vue-next';

defineProps<{ text?: string; align?: 'center' | 'start' | 'end'; below?: boolean }>();
const open = ref(false);
</script>

<template>
  <span v-if="text" class="tip help" @mouseenter="open = true" @mouseleave="open = false">
    <button type="button" class="icon-btn sm" :aria-label="text" @click.stop="open = !open" @blur="open = false">
      <CircleHelp />
    </button>
    <span v-if="open" class="tip-bubble" :class="[align !== 'center' && align, { below }]" role="tooltip">{{ text }}</span>
  </span>
</template>
