<script setup lang="ts" generic="T extends string | number | null">
import type { Component } from 'vue';

export interface SegmentOption<V> { value: V; label: string; icon?: Component; hint?: string }
const model = defineModel<T>();
defineProps<{ options: SegmentOption<T>[] }>();
</script>

<template>
  <div class="segmented" :class="{ dense: options.length > 4 }" role="radiogroup">
    <button
      v-for="o in options" :key="String(o.value)" type="button" role="radio" :aria-checked="model === o.value"
      :class="{ on: model === o.value }" :title="o.hint" @click="model = o.value"
    >
      <component :is="o.icon" v-if="o.icon" /><span class="ellipsis">{{ o.label }}</span>
    </button>
  </div>
</template>
