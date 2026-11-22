<script setup lang="ts">
/** Inline "start from" choice for a new user module: blank, or one of the preset's templates. */
import { nextTick, onMounted, ref } from 'vue';
import { FilePlus, LayoutTemplate, X } from 'lucide-vue-next';
import type { UserModuleSourceBody, UserModuleTemplate } from '@advanced-preset/protocol';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';

defineProps<{ templates: { tpl: UserModuleTemplate; body: UserModuleSourceBody }[] }>();
const emit = defineEmits<{ blank: []; template: [tpl: UserModuleTemplate]; cancel: [] }>();

const el = ref<HTMLElement | null>(null);
onMounted(() => void nextTick(() => el.value?.querySelector<HTMLButtonElement>('.um-choice')?.focus()));
</script>

<template>
  <div ref="el" class="um-picker" role="group" :aria-label="t('um.startFrom')" @keydown.esc.stop="emit('cancel')">
    <div class="um-picker-head">
      <span class="small muted">{{ t('um.startFrom') }}</span>
      <IconButton :icon="X" :label="t('common.cancel')" small align="end" @click="emit('cancel')" />
    </div>
    <button type="button" class="um-choice" @click="emit('blank')">
      <FilePlus />
      <span class="um-choice-text"><span>{{ t('um.blank') }}</span><span class="xs muted">{{ t('um.blank.desc') }}</span></span>
    </button>
    <button v-for="x in templates" :key="x.tpl.id" type="button" class="um-choice" :data-template="x.tpl.id" @click="emit('template', x.tpl)">
      <LayoutTemplate />
      <span class="um-choice-text"><span>{{ x.body.name }}</span><span v-if="x.body.description" class="xs muted um-choice-desc">{{ x.body.description }}</span></span>
    </button>
  </div>
</template>
