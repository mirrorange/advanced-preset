<script setup lang="ts">
import { computed } from 'vue';
import { Shapes } from 'lucide-vue-next';
import Section from '../../components/Section.vue';
import { richText } from '../../rich';

const props = defineProps<{ title: string; value: string | Record<string, string> }>();
const html = computed(() => (typeof props.value === 'string' ? richText(props.value) : ''));
</script>

<template>
  <Section :title="title" :icon="Shapes" collapsible :open="false">
    <!-- eslint-disable-next-line vue/no-v-html -- sanitised by richText -->
    <div v-if="typeof value === 'string'" class="rich small" v-html="html" />
    <dl v-else class="kv-list small">
      <template v-for="(v, k) in value" :key="k"><dt>{{ k }}</dt><dd class="pre">{{ v }}</dd></template>
    </dl>
  </Section>
</template>
