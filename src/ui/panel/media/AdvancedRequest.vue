<script setup lang="ts">
/** Collapsed "Advanced" part of a connection: extra request headers and a JSON body merged over the built-in request. */
import { computed, ref, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { t } from '@/i18n';
import { bodyOverrideError } from '@/media/request';
import type { ConnectionBase } from '@/store/media';
import Field from '../../components/Field.vue';
import KvEditor from '../../components/KvEditor.vue';

const props = defineProps<{ connection: ConnectionBase; bodyPlaceholder?: string }>();
const emit = defineEmits<{ changed: [] }>();

const open = ref(false);
const body = ref(props.connection.body);
watch(() => props.connection.id, () => { body.value = props.connection.body; });
const error = computed(() => bodyOverrideError(body.value));

function setHeader(key: string, value: string) { props.connection.headers = { ...props.connection.headers, [key]: value }; emit('changed'); }
function removeHeader(key: string) { const h = { ...props.connection.headers }; delete h[key]; props.connection.headers = h; emit('changed'); }
function commitBody() { if (error.value) return; props.connection.body = body.value; emit('changed'); }
</script>

<template>
  <div class="media-advanced">
    <button type="button" class="btn ghost sm-btn media-advanced-toggle" :aria-expanded="open" @click="open = !open">
      <span>{{ t('media.advanced') }}</span>
      <ChevronDown class="chevron" :class="{ flipped: open }" />
    </button>
    <div v-if="open" class="col">
      <slot />
      <Field :label="t('media.headers')" :help="t('media.headers.hint')">
        <KvEditor :entries="connection.headers" :key-placeholder="t('media.headers.name')" :value-placeholder="t('media.headers.value')" @set="setHeader" @remove="removeHeader" />
      </Field>
      <Field :label="t('media.body')" :help="t('media.body.hint')">
        <textarea v-model="body" class="input mono" rows="4" spellcheck="false" :placeholder="bodyPlaceholder ?? '{ }'" @change="commitBody" />
        <span v-if="error" class="xs text-danger">{{ error }}</span>
      </Field>
    </div>
  </div>
</template>
