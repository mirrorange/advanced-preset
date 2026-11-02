<script setup lang="ts">
/** Status bar (I-136) above the story: date · weekday · time, location, weather in one quiet line; the pencil edits it. */
import { computed, nextTick, reactive, ref, type Component } from 'vue';
import { STATUS_FIELDS, type StatusBar } from '@advanced-preset/protocol';
import { CalendarDays, Check, Clock, Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, MapPin, Moon, Pencil, Snowflake, Sun, Wind } from 'lucide-vue-next';
import { t } from '@/i18n';
import IconButton from '../../components/IconButton.vue';

const props = defineProps<{ status: StatusBar; editable?: boolean }>();
const emit = defineEmits<{ save: [value: StatusBar] }>();

const editing = ref(false);
const draft = reactive<StatusBar>({ date: '', weekday: '', time: '', location: '', weather: '' });
const form = ref<HTMLFormElement>();

const value = (k: keyof StatusBar) => (props.status[k] ?? '').trim();
const when = computed(() => [value('date'), value('weekday')].filter(Boolean).join(' '));

/** Weather icon from keywords (zh / en); a neutral cloud-sun otherwise. */
const WEATHER: [RegExp, Component][] = [
  [/雷|thunder|storm|lightning/i, CloudLightning],
  [/雪|snow|sleet|blizzard/i, Snowflake],
  [/雨|rain|drizzle|shower/i, CloudRain],
  [/雾|霾|fog|mist|haze|smog/i, CloudFog],
  [/风|wind|gale|breez/i, Wind],
  [/阴|云|cloud|overcast/i, Cloud],
  [/夜|月|night|moon/i, Moon],
  [/晴|sun|clear|fair/i, Sun],
];
const weatherIcon = computed(() => WEATHER.find(([re]) => re.test(value('weather')))?.[1] ?? CloudSun);

const trimmed = (): StatusBar => Object.fromEntries(STATUS_FIELDS.map((k) => [k, draft[k].trim()])) as unknown as StatusBar;
const changed = computed(() => STATUS_FIELDS.some((k) => trimmed()[k] !== value(k)));

async function startEdit() {
  for (const k of STATUS_FIELDS) draft[k] = props.status[k] ?? '';
  editing.value = true;
  await nextTick();
  form.value?.querySelector('input')?.focus();
}
function cancel() { editing.value = false; }
function save() {
  if (changed.value) emit('save', trimmed());
  editing.value = false;
}
/** Keys stay inside the editor so ST's hotkeys don't fire. */
function onKey(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.isComposing) return;
  if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  else if (e.key === 'Enter') { e.preventDefault(); save(); }
}
const ICONS: Record<keyof StatusBar, Component> = { date: CalendarDays, weekday: CalendarDays, time: Clock, location: MapPin, weather: CloudSun };
</script>

<template>
  <form v-if="editing" ref="form" class="status-editor" @submit.prevent="save" @keydown="onKey" @click.stop @touchstart.stop.passive @touchmove.stop.passive @touchend.stop.passive>
    <div class="status-fields">
      <label v-for="k in STATUS_FIELDS" :key="k" class="synopsis-field">
        <component :is="ICONS[k]" class="faint" />
        <input v-model="draft[k]" class="input" :placeholder="t(`cards.status.${k}`)" :aria-label="t(`cards.status.${k}`)" />
      </label>
    </div>
    <div class="synopsis-actions">
      <span class="xs faint grow synopsis-keys">{{ t('cards.status.keys') }}</span>
      <button type="button" class="btn ghost sm-btn" @click="cancel">{{ t('common.cancel') }}</button>
      <button type="submit" class="btn primary sm-btn"><Check />{{ t('common.save') }}</button>
    </div>
  </form>
  <div v-else class="status-bar small" role="status">
    <span v-if="when" class="row tight"><CalendarDays class="faint" />{{ when }}</span>
    <span v-if="value('time')" class="row tight"><Clock class="faint" />{{ value('time') }}</span>
    <span v-if="value('location')" class="row tight status-location"><MapPin class="faint" /><span class="ellipsis">{{ value('location') }}</span></span>
    <span v-if="value('weather')" class="row tight"><component :is="weatherIcon" class="faint" />{{ value('weather') }}</span>
    <span v-if="editable" class="synopsis-edit status-edit" @click.stop>
      <IconButton :icon="Pencil" :label="t('cards.status.edit')" small align="end" @click="startEdit" />
    </span>
  </div>
</template>
