<script setup lang="ts">
/** Full-size image viewer (modal dialog in the top layer): arrows / swipe between versions, Esc or backdrop click closes. */
import { onMounted, ref } from 'vue';
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';
import BlobImage from '../../components/BlobImage.vue';

const props = defineProps<{ keys: string[]; start: number; caption?: string }>();
const emit = defineEmits<{ close: [] }>();

const dialog = ref<HTMLDialogElement>();
const at = ref(props.start);
const step = (d: number) => { const n = props.keys.length; at.value = (at.value + d + n) % n; };

onMounted(() => dialog.value?.showModal());

function onKey(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'ArrowRight') step(1);
}
let touchX: number | null = null;
const onTouchEnd = (e: TouchEvent) => {
  const x = e.changedTouches[0]?.clientX;
  if (touchX !== null && x !== undefined && Math.abs(x - touchX) > 40 && props.keys.length > 1) step(x < touchX ? 1 : -1);
  touchX = null;
};
</script>

<template>
  <dialog ref="dialog" class="image-viewer" :aria-label="caption" @close="emit('close')" @click.self="dialog?.close()" @keydown="onKey"
    @touchstart.passive="touchX = $event.touches[0]?.clientX ?? null" @touchend="onTouchEnd">
    <BlobImage :blob-key="keys[at]!" :alt="caption" class="image-viewer-img" />
    <div class="image-viewer-bar">
      <template v-if="keys.length > 1">
        <IconButton :icon="ChevronLeft" :label="t('media.image.previous')" @click="step(-1)" />
        <span class="small">{{ at + 1 }} / {{ keys.length }}</span>
        <IconButton :icon="ChevronRight" :label="t('media.image.next')" @click="step(1)" />
      </template>
      <span v-if="caption" class="small grow ellipsis image-viewer-caption">{{ caption }}</span>
      <IconButton :icon="X" :label="t('common.close')" align="end" @click="dialog?.close()" />
    </div>
  </dialog>
</template>
