<script setup lang="ts">
/**
 * Shell of the media dialog: a fixed layer under ST's top bar (`--topBarBlockSize`, like the AP
 * panel in its drawer) with a title bar and the content; full screen below the bar on narrow
 * screens, centred on wide ones. Not a modal `<dialog>`: its top layer and backdrop would cover the
 * top bar, and a click on the top bar closes the dialog. Esc, the close button and a click on the
 * backdrop close it too. Focus moves into the dialog and Tab stays inside; keys do not reach ST's
 * hotkeys, also when the focus fell back to the page.
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../components/IconButton.vue';
import { closeMediaDialog, mediaDialog } from './dialog';

const box = ref<HTMLElement>();

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Tab and Shift+Tab wrap around inside the dialog. */
function trapTab(e: KeyboardEvent) {
  const el = box.value;
  if (!el) return;
  const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((x) => x.getClientRects().length > 0);
  if (!items.length) { e.preventDefault(); el.focus(); return; }
  const active = (el.getRootNode() as ShadowRoot | Document).activeElement;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (e.shiftKey && (active === first || active === el)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
}

/** Keys inside the dialog: the content handles them first (an edit takes its own Esc). */
function onKey(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.isComposing) return;
  if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); closeMediaDialog(); }
  else if (e.key === 'Tab') trapTab(e);
}

/** Keys while the focus fell back to the page (its element went away): Esc closes, Tab comes back, the rest stops. */
function onWindowKey(e: KeyboardEvent) {
  if ((e.target !== document.body && e.target !== document.documentElement) || e.isComposing) return;
  e.stopPropagation();
  if (e.key === 'Escape') { e.preventDefault(); closeMediaDialog(); }
  else if (e.key === 'Tab') { e.preventDefault(); box.value?.focus(); }
}

/**
 * A click outside the layer is on ST's top bar (the layer covers the rest): a drawer button or not, it
 * closes the dialog, and the focus stays where the click put it. Other dialogs (on top) do not count.
 */
function onWindowClick(e: MouseEvent) {
  const path = e.composedPath();
  if (!path.some((x) => x instanceof Element && (x.localName === 'ap-media-dialog' || x.localName === 'dialog' || x.id === 'toast-container'))) closeMediaDialog(false);
}

function listen(on: boolean) {
  const fn = on ? addEventListener : removeEventListener;
  fn('keydown', onWindowKey as EventListener, true);
  fn('click', onWindowClick as EventListener, true);
}

watch(() => mediaDialog.current?.id, async (id) => {
  listen(id !== undefined);
  if (id === undefined) return;
  await nextTick();
  box.value?.focus({ preventScroll: true });
}, { immediate: true });
onBeforeUnmount(() => listen(false));

/** Only a press that starts and ends on the backdrop closes (not a text selection dragged out). */
let downOnBackdrop = false;
const onDown = (e: PointerEvent) => { downOnBackdrop = e.target === e.currentTarget; };
const onClick = (e: MouseEvent) => { if (downOnBackdrop && e.target === e.currentTarget) closeMediaDialog(); downOnBackdrop = false; };
</script>

<template>
  <div v-if="mediaDialog.current" class="media-dialog-layer" @pointerdown="onDown" @click="onClick">
    <div
      ref="box" class="media-dialog" role="dialog" aria-modal="true" :aria-label="mediaDialog.current.title" tabindex="-1"
      @keydown="onKey" @keyup.stop
    >
      <header class="media-dialog-head">
        <strong class="grow ellipsis">{{ mediaDialog.current.title }}</strong>
        <IconButton :icon="X" :label="t('common.close')" align="end" @click="closeMediaDialog()" />
      </header>
      <div class="media-dialog-body">
        <component :is="mediaDialog.current.component" :key="mediaDialog.current.id" v-bind="mediaDialog.current.props ?? {}" @close="closeMediaDialog()" />
      </div>
    </div>
  </div>
</template>
