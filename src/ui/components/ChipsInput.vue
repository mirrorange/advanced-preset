<script setup lang="ts">
/** Words as removable chips. Enter (or a comma, unless `literal`) commits; Backspace on empty removes the last. */
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const model = defineModel<string[]>({ default: () => [] });
const props = defineProps<{ placeholder?: string; literal?: boolean; mono?: boolean; removeLabel?: string }>();
const draft = ref('');
const input = ref<HTMLInputElement | null>(null);

function commit(text = draft.value) {
  const parts = (props.literal ? [text] : text.split(/[,，、\n]/)).map((w) => w.trim()).filter(Boolean);
  draft.value = '';
  const next = [...model.value];
  for (const w of parts) if (!next.includes(w)) next.push(w);
  if (next.length !== model.value.length) model.value = next;
}
function onKey(e: KeyboardEvent) {
  if (e.isComposing) return;
  if (e.key === 'Enter' || (!props.literal && (e.key === ',' || e.key === '，'))) { e.preventDefault(); commit(); }
  else if (e.key === 'Backspace' && !draft.value && model.value.length) model.value = model.value.slice(0, -1);
}
function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? '';
  if (props.literal ? !text.includes('\n') : !/[,，、\n]/.test(text)) return;
  e.preventDefault();
  if (props.literal) for (const line of text.split('\n')) commit(line);
  else commit(draft.value + text);
}
const remove = (i: number) => { model.value = model.value.filter((_, j) => j !== i); };
</script>

<template>
  <div class="chips-input input" @click="input?.focus()">
    <span v-for="(w, i) in model" :key="w" class="chip" :class="{ mono }">
      <span class="ellipsis" :title="w">{{ w }}</span>
      <button type="button" class="chip-x" :aria-label="removeLabel" @click.stop="remove(i)"><X /></button>
    </span>
    <input
      ref="input" v-model="draft" class="chips-draft" :class="{ mono }" :placeholder="model.length ? '' : placeholder"
      @keydown="onKey" @blur="commit()" @paste="onPaste"
    />
  </div>
</template>
