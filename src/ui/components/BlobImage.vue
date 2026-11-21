<script setup lang="ts">
/** An image stored in AP's media store (IndexedDB key). */
import { ref, watch } from 'vue';
import { blobUrl } from '@/store/media-db';

const props = defineProps<{ blobKey: string; alt?: string }>();
const emit = defineEmits<{ missing: [] }>();
const src = ref<string | undefined>();
watch(() => props.blobKey, async (key) => {
  src.value = undefined;
  const url = await blobUrl(key).catch(() => undefined);
  if (key !== props.blobKey) return;
  src.value = url;
  if (!url) emit('missing');
}, { immediate: true });
</script>

<template>
  <img v-if="src" :src="src" :alt="alt ?? ''" draggable="false" />
  <span v-else class="blob-placeholder" aria-hidden="true" />
</template>
