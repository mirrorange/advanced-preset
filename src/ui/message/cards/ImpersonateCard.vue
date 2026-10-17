<script setup lang="ts">
import { TextCursorInput, UserPen } from 'lucide-vue-next';
import { fillInput } from '@/app/impersonate';
import { t } from '@/i18n';

defineProps<{ text: string }>();
</script>

<template>
  <div class="card mini-card">
    <header class="card-head">
      <UserPen class="section-icon" />
      <span class="card-title">{{ t('cards.impersonate') }}</span>
      <button type="button" class="btn primary sm-btn" @click="fillInput(text)"><TextCursorInput />{{ t('cards.fillInput') }}</button>
    </header>
    <div class="card-body pre">{{ text }}</div>
  </div>
</template>
