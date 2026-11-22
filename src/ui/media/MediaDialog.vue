<script setup lang="ts">
/**
 * Shell of the media dialog: a modal `<dialog>` (top layer) with a title bar and the content.
 * Esc, the close button and a click on the backdrop close it; keys stay inside (ST's hotkeys).
 */
import { nextTick, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../components/IconButton.vue';
import { closeMediaDialog, mediaDialog } from './dialog';

const dialog = ref<HTMLDialogElement>();

watch(() => mediaDialog.current?.id, async (id) => {
  if (id === undefined) { dialog.value?.close(); return; }
  await nextTick();
  if (!dialog.value?.open) dialog.value?.showModal();
}, { immediate: true });

/** Only a press that starts and ends on the backdrop closes (not a text selection dragged out). */
let downOnBackdrop = false;
const onDown = (e: PointerEvent) => { downOnBackdrop = e.target === dialog.value; };
const onClick = (e: MouseEvent) => { if (downOnBackdrop && e.target === dialog.value) closeMediaDialog(); downOnBackdrop = false; };
</script>

<template>
  <dialog
    v-if="mediaDialog.current" ref="dialog" class="media-dialog" :aria-label="mediaDialog.current.title"
    @cancel.prevent="closeMediaDialog" @keydown.stop @keyup.stop @pointerdown="onDown" @click="onClick"
  >
    <div class="media-dialog-box">
      <header class="media-dialog-head">
        <strong class="grow ellipsis">{{ mediaDialog.current.title }}</strong>
        <IconButton :icon="X" :label="t('common.close')" align="end" @click="closeMediaDialog" />
      </header>
      <div class="media-dialog-body">
        <component :is="mediaDialog.current.component" :key="mediaDialog.current.id" v-bind="mediaDialog.current.props ?? {}" @close="closeMediaDialog" />
      </div>
    </div>
  </dialog>
</template>
