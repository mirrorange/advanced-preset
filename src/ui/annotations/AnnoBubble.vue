<script setup lang="ts">
/** The annotation bubble (I-86): author + rich comment, placed against the annotated line. */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { place } from '../components/bubble';
import { bubble, keep, leave } from './bubble';

const el = ref<HTMLElement | null>(null);
const MARGIN = 8;

function position() {
  const b = el.value;
  if (!b) return;
  const view = { width: document.documentElement.clientWidth || innerWidth, height: innerHeight };
  b.style.maxWidth = `${Math.min(320, view.width - MARGIN * 2)}px`;
  b.style.left = '0px';
  b.style.top = '0px';
  const origin = b.getBoundingClientRect();
  const r = bubble.rect;
  const p = place(DOMRect.fromRect({ x: r.left, y: r.top, width: r.width, height: r.height }), origin, view, 'center');
  b.style.left = `${p.left - origin.left}px`;
  b.style.top = `${p.top - origin.top}px`;
  b.dataset.side = p.side;
}

watch(() => bubble.open && bubble.rev, async (v) => {
  if (!v) return;
  await nextTick();
  const b = el.value;
  if (!b) return;
  try { if (!b.matches(':popover-open')) b.showPopover?.(); } catch { /* unsupported: stays position: fixed */ }
  position();
});
onBeforeUnmount(() => { bubble.open = false; });
</script>

<template>
  <div v-if="bubble.open" ref="el" class="anno-bubble" popover="manual" role="tooltip" :style="{ '--actor': bubble.color || 'var(--ap-primary)' }" @mouseenter="keep" @mouseleave="leave">
    <div v-if="bubble.author" class="anno-author">{{ bubble.author }}</div>
    <div class="rich anno-text" v-html="bubble.html" />
  </div>
</template>
