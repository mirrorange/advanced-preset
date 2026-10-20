<script setup lang="ts">
/** Settings panel (§16.5): header with preset + enable switch and six tabs, overlaid on ST's AI Response Configuration drawer. */
import { computed, onBeforeUnmount, onMounted, type Component } from 'vue';
import { Blocks, Brain, Bug, Layers, Package, PenLine, SlidersHorizontal, X } from 'lucide-vue-next';
import { settings, save } from '@/store/settings';
import { presetName, t } from '@/i18n';
import { activePreset, presetSummary, ui, type PanelTab } from '../state';
import IconButton from '../components/IconButton.vue';
import Switch from '../components/Switch.vue';
import PresetsTab from './tabs/PresetsTab.vue';
import ConfigTab from './tabs/ConfigTab.vue';
import ModulesTab from './tabs/ModulesTab.vue';
import WritingTab from './tabs/WritingTab.vue';
import MemoryTab from './tabs/MemoryTab.vue';
import DebugTab from './tabs/DebugTab.vue';

const tabs: { id: PanelTab; icon: Component; view: Component }[] = [
  { id: 'presets', icon: Package, view: PresetsTab },
  { id: 'config', icon: SlidersHorizontal, view: ConfigTab },
  { id: 'modules', icon: Blocks, view: ModulesTab },
  { id: 'writing', icon: PenLine, view: WritingTab },
  { id: 'memory', icon: Brain, view: MemoryTab },
  { id: 'debug', icon: Bug, view: DebugTab },
];
const current = computed(() => tabs.find((x) => x.id === ui.tab) ?? tabs[0]!);

const enabled = computed({ get: () => settings().enabled, set: (v: boolean) => { settings().enabled = v; save(); } });
const subtitle = computed(() => {
  const p = activePreset.value;
  return p ? `v${p.version} · ${presetSummary.value.config}` : t('panel.noPreset');
});

const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && ui.panelOpen) ui.panelOpen = false; };
onMounted(() => document.addEventListener('keydown', onKey));
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <Transition name="panel">
    <aside v-if="ui.panelOpen" class="panel" role="dialog" :aria-label="t('app.name')">
      <header class="panel-head">
        <div class="panel-logo"><Layers /></div>
        <div class="grow">
          <div class="panel-title ellipsis">{{ activePreset ? presetName(activePreset) : t('app.name') }}</div>
          <div class="panel-sub ellipsis">{{ subtitle }}</div>
        </div>
        <Switch v-model="enabled" :label="t('panel.enabled')" />
        <IconButton :icon="X" :label="t('common.close')" align="end" below @click="ui.panelOpen = false" />
      </header>
      <nav class="tabs" role="tablist">
        <button v-for="x in tabs" :key="x.id" type="button" role="tab" class="tab" :class="{ on: x.id === ui.tab }" :title="t(`tab.${x.id}`)" :aria-selected="x.id === ui.tab" @click="ui.tab = x.id">
          <component :is="x.icon" />
          <span>{{ t(`tab.${x.id}`) }}</span>
        </button>
      </nav>
      <main class="panel-body scroll">
        <KeepAlive><component :is="current.view" :key="current.id" /></KeepAlive>
      </main>
    </aside>
  </Transition>
</template>
