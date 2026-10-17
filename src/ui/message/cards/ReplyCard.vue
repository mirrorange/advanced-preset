<script setup lang="ts">
import { computed } from 'vue';
import { richText } from '../../rich';

const props = defineProps<{ text: string; name: string; color: string }>();
const html = computed(() => richText(props.text));
</script>

<template>
  <div class="reply-card" :style="{ '--actor': color }">
    <div class="reply-name xs">{{ name }}</div>
    <!-- eslint-disable-next-line vue/no-v-html -- sanitised by richText -->
    <div class="rich" v-html="html" />
  </div>
</template>
