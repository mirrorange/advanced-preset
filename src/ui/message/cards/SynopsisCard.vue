<script setup lang="ts">
import { ref } from 'vue';
import type { Synopsis } from '@advanced-preset/protocol';
import { Clock, MapPin } from 'lucide-vue-next';

defineProps<{ synopsis: Synopsis }>();
const open = ref(false);
</script>

<template>
  <div class="synopsis" :class="{ open }" @click="open = !open">
    <div class="synopsis-line small">
      <span v-if="synopsis.time" class="row tight"><Clock class="faint" />{{ synopsis.time }}</span>
      <span v-if="synopsis.location" class="row tight"><MapPin class="faint" />{{ synopsis.location }}</span>
      <span class="synopsis-event ellipsis">{{ synopsis.event }}</span>
    </div>
    <div v-if="open && synopsis.summary" class="small muted pre synopsis-summary">{{ synopsis.summary }}</div>
  </div>
</template>
