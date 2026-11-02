<script setup lang="ts">
/** A preset-supplied structure component (I-137) in its own shadow root; errors show as a quiet line. */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { StructureComponent } from '@advanced-preset/protocol';
import { t } from '@/i18n';
import { mountComponent, type ComponentContext, type MountedComponent } from '../../structure-component';

const props = defineProps<{ component: StructureComponent; context: ComponentContext }>();
const host = ref<HTMLElement>();
const error = ref('');
let mounted: MountedComponent | null = null;
let queue: Promise<void> = Promise.resolve();
let alive = true;

const run = (task: () => Promise<void>) => {
  queue = queue.then(async () => {
    if (!alive) return;
    try {
      await task();
      error.value = '';
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      console.error('[Advanced Preset] structure component', props.component.id, e);
    }
  });
};

onMounted(() => {
  const el = host.value;
  if (!el) return;
  const root = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
  run(async () => { mounted = await mountComponent(props.component, root, props.context); });
});
watch(() => props.context, (ctx) => run(async () => { await mounted?.update(ctx); }));
watch(() => props.component, (c) => run(async () => {
  mounted?.unmount();
  mounted = null;
  const root = host.value?.shadowRoot;
  if (root) mounted = await mountComponent(c, root, props.context);
}));
onBeforeUnmount(() => {
  alive = false;
  try { mounted?.unmount(); } catch (e) { console.error('[Advanced Preset] structure component', props.component.id, e); }
  mounted = null;
});
</script>

<template>
  <div class="structure-component">
    <div ref="host" class="structure-component-host" :data-structure="component.id" />
    <div v-if="error" class="xs">{{ t('cards.custom.error', { error }) }}</div>
  </div>
</template>
