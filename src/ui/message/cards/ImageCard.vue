<script setup lang="ts">
/** Images of an image structure, below the story: one figure per prompt. */
import type { ImagePrompt } from '@advanced-preset/protocol';
import type { SidecarImage } from '@/store/sidecar';
import ImageFigure from './ImageFigure.vue';

defineProps<{ mesid: number; genId: string; structure: string; prompts: ImagePrompt[]; records: SidecarImage[]; editable: boolean }>();
</script>

<template>
  <div class="image-card" :class="{ multi: prompts.length > 1 }">
    <ImageFigure
      v-for="(p, i) in prompts" :key="i" :mesid="mesid" :gen-id="genId" :structure="structure" :index="i"
      :prompt="p" :record="records[i]" :editable="editable"
    />
  </div>
</template>
