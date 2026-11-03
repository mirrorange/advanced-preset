<script setup lang="ts">
import type { UserOption } from '@advanced-preset/protocol';
import { fillInput } from '@/app/impersonate';
import { t } from '@/i18n';

const props = defineProps<{ options: UserOption[]; mesid?: number }>();
// On a side storyline the option gets the message's #tag (I-160).
const choose = (o: UserOption, e: MouseEvent) => fillInput(o.content, e.ctrlKey || e.metaKey || e.shiftKey || e.altKey, props.mesid);
</script>

<template>
  <div class="options-grid" role="list" :aria-label="t('cards.options')">
    <button v-for="(o, i) in options" :key="i" type="button" role="listitem" class="option" :title="t('cards.optionHint')" @click="choose(o, $event)">
      <span class="option-label">{{ o.label }}</span>
      <span class="option-content small muted">{{ o.content }}</span>
    </button>
  </div>
</template>
