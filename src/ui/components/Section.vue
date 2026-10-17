<script setup lang="ts">
/** Collapsible card used by panel sections and message cards. */
import { ref, type Component } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import Help from './Help.vue';

const props = defineProps<{ title: string; icon?: Component; help?: string; collapsible?: boolean; open?: boolean; tone?: 'plain' | 'tint' }>();
const isOpen = ref(props.open ?? true);
</script>

<template>
  <section class="card section" :class="[tone, { closed: collapsible && !isOpen }]">
    <header class="card-head" :class="{ clickable: collapsible }" @click="collapsible && (isOpen = !isOpen)">
      <component :is="icon" v-if="icon" class="section-icon" />
      <span class="card-title">{{ title }}</span>
      <Help :text="help" align="end" />
      <span class="row" @click.stop><slot name="actions" /></span>
      <ChevronDown v-if="collapsible" class="chevron" :class="{ flipped: isOpen }" />
    </header>
    <div v-if="!collapsible || isOpen" class="card-body"><slot /></div>
  </section>
</template>
