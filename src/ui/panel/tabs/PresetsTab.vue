<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, CodeXml, Link, LoaderCircle, RefreshCw, Trash2, Upload, Download } from 'lucide-vue-next';
import { presetTemplates } from '@advanced-preset/protocol';
import { listPresets, type PresetEntry } from '@/store/presets';
import { activatePreset } from '@/store/carrier';
import { settings } from '@/store/settings';
import { toast } from '@/st/host';
import { presetDescription, presetName, t } from '@/i18n';
import { installFromFile, installFromUrl, removePreset } from '@/app/install';
import { isTrustDeclined } from '@/app/trust';
import { updateExtension } from '@/app/updater';
import { activePreset, refreshActivePreset } from '../../state';
import IconButton from '../../components/IconButton.vue';
import Tip from '../../components/Tip.vue';
import Appearance from '../Appearance.vue';

const entries = computed(() => listPresets());
const hasTemplates = (e: PresetEntry) => presetTemplates(e.preset).length > 0;
const busy = ref<string | null>(null);
const urlOpen = ref(false);
const url = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

async function run(key: string, f: () => Promise<unknown>, ok?: string) {
  busy.value = key;
  try {
    await f();
    if (ok) toast('success', ok);
  } catch (e) {
    if (isTrustDeclined(e)) toast('info', e.message);
    else toast('error', e instanceof Error ? e.message : String(e), t('app.name'));
  } finally {
    busy.value = null;
  }
}

const select = (e: PresetEntry) => run(`select:${e.preset.id}`, async () => { await activatePreset(e.preset); refreshActivePreset(); });
const importUrl = () => run('url', async () => { const p = await installFromUrl(url.value); url.value = ''; urlOpen.value = false; return p; }, t('presets.installed'));
const importFile = (ev: Event) => {
  const file = (ev.target as HTMLInputElement).files?.[0];
  if (file) void run('file', () => installFromFile(file), t('presets.installed'));
  (ev.target as HTMLInputElement).value = '';
};
const updateFromSource = (e: PresetEntry) => run(`update:${e.preset.id}`, () => installFromUrl(settings().sources[e.preset.id]!), t('presets.updated'));
const remove = (e: PresetEntry) => run(`remove:${e.preset.id}`, () => removePreset(e.preset.id));
const checkUpdates = () => run('ext', async () => toast('info', (await updateExtension()) === 'current' ? t('update.none') : t('update.reloading')));
</script>

<template>
  <div class="toolbar">
    <button type="button" class="btn" :disabled="busy === 'file'" @click="fileInput?.click()"><Upload />{{ t('presets.importFile') }}</button>
    <button type="button" class="btn" :class="{ primary: urlOpen }" @click="urlOpen = !urlOpen"><Link />{{ t('presets.importUrl') }}</button>
    <span class="grow" />
    <IconButton :icon="busy === 'ext' ? LoaderCircle : RefreshCw" :label="t('presets.checkUpdates')" align="end" :disabled="busy === 'ext'" @click="checkUpdates" />
    <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importFile" />
  </div>
  <form v-if="urlOpen" class="row" @submit.prevent="importUrl">
    <input v-model="url" class="input grow" type="url" placeholder="https://…/preset.apreset.json" required />
    <button type="submit" class="btn primary" :disabled="busy === 'url'"><LoaderCircle v-if="busy === 'url'" class="spin" /><Download v-else />{{ t('common.install') }}</button>
  </form>

  <div class="preset-list">
    <div
      v-for="e in entries" :key="e.preset.id" class="preset-item" :class="{ on: activePreset?.id === e.preset.id }"
      role="button" tabindex="0" @click="select(e)" @keydown.enter="select(e)"
    >
      <span class="preset-mark"><LoaderCircle v-if="busy === `select:${e.preset.id}`" class="spin" /><Check v-else-if="activePreset?.id === e.preset.id" /></span>
      <div class="grow col preset-info">
        <div class="row wrap preset-head">
          <span class="preset-name">{{ presetName(e.preset) }}</span>
          <span class="badge neutral">v{{ e.preset.version }}</span>
          <span v-if="e.source !== 'builtin'" class="badge" :class="{ warn: e.source === 'dev' }">{{ t(`presets.source.${e.source}`) }}</span>
          <Tip v-if="hasTemplates(e)" :text="t('presets.templates.help')"><span class="badge neutral icon-badge"><CodeXml />{{ t('presets.templates') }}</span></Tip>
        </div>
        <span v-if="e.preset.author" class="xs muted">{{ e.preset.author }}</span>
        <span v-if="presetDescription(e.preset)" class="small muted preset-desc">{{ presetDescription(e.preset) }}</span>
      </div>
      <div class="row preset-actions" @click.stop>
        <IconButton v-if="e.source === 'installed' && settings().sources[e.preset.id]" :icon="RefreshCw" :label="t('presets.update')" align="end" small @click="updateFromSource(e)" />
        <IconButton v-if="e.source === 'installed'" :icon="Trash2" :label="t('common.delete')" align="end" small danger @click="remove(e)" />
      </div>
    </div>
    <div v-if="!entries.length" class="empty">{{ t('presets.none') }}</div>
  </div>
  <Appearance />
</template>
