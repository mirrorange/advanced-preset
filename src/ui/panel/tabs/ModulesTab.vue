<script setup lang="ts">
/** Modules by group (§16.5): exclusive sets as a choice list, the rest as switches; `always` modules are hidden. */
import { computed, nextTick, ref, watch } from 'vue';
import type { Module } from '@advanced-preset/protocol';
import { moduleSwitches } from '@advanced-preset/protocol';
import { t, pt } from '@/i18n';
import { usePreset } from '../use';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import Switch from '../../components/Switch.vue';
import Help from '../../components/Help.vue';
import UserModulesSection from '../user-modules/UserModulesSection.vue';
import UserModuleEditor from '../user-modules/UserModuleEditor.vue';
import { userModules } from '@/store/user-modules';

const { preset, config, update } = usePreset();
const on = computed(() => (preset.value && config.value ? moduleSwitches(preset.value, config.value) : {}));

interface Choice { key: string; modules: Module[] }
interface GroupView { id: string; label: string; help?: string; allowNone: boolean; choices: Choice[]; toggles: Module[] }

const groups = computed<GroupView[]>(() => {
  const p = preset.value;
  if (!p) return [];
  const user = p.modules.filter((m) => m.toggle === 'user');
  const ids = [...new Set(user.map((m) => m.group ?? ''))];
  const views = ids
    .filter((g) => (p.groups[g]?.tab ?? 'modules') === 'modules')
    .map((g): GroupView & { order: number } => {
      const decl = p.groups[g];
      const mods = user.filter((m) => (m.group ?? '') === g);
      const sets = [...new Set(mods.filter((m) => m.exclusive).map((m) => m.exclusive!))];
      return {
        id: g,
        order: decl?.order ?? 999,
        label: g ? pt(p, 'groups', g, 'label', decl?.label ?? g) : t('modules.other'),
        help: g ? pt(p, 'groups', g, 'description', decl?.description ?? '') || undefined : undefined,
        allowNone: Boolean(decl?.allowNone),
        choices: sets.map((key) => ({ key, modules: mods.filter((m) => m.exclusive === key) })),
        toggles: mods.filter((m) => !m.exclusive),
      };
    });
  return views.sort((a, b) => a.order - b.order);
});

const name = (m: Module) => pt(preset.value!, 'modules', m.id, 'name', m.name);
const desc = (m: Module) => pt(preset.value!, 'modules', m.id, 'description', m.description ?? '') || undefined;
const chosen = (c: Choice) => c.modules.find((m) => on.value[m.id])?.id ?? null;

function choose(c: Choice, id: string | null) {
  update((cfg) => { for (const m of c.modules) cfg.modules[m.id] = m.id === id; });
}
function toggle(m: Module, v: boolean) {
  update((cfg) => { cfg.modules[m.id] = v; });
}

// User module editor: drill-in view that replaces the list; the list scroll position is restored on return.
const editing = ref<string | null>(null);
const root = ref<HTMLElement | null>(null);
const editingModule = computed(() => (preset.value && editing.value ? userModules(preset.value).find((m) => m.id === editing.value) : undefined));
let listScroll = 0;
const scroller = () => root.value?.closest('.panel-body') as HTMLElement | null;
function openEditor(id: string) {
  if (!editing.value) listScroll = scroller()?.scrollTop ?? 0;
  editing.value = id;
  void nextTick(() => scroller()?.scrollTo({ top: 0 }));
}
function closeEditor() {
  editing.value = null;
  void nextTick(() => scroller()?.scrollTo({ top: listScroll }));
}
watch(() => preset.value?.id, () => { editing.value = null; });
</script>

<template>
  <NoPreset v-if="!preset || !config" />
  <div v-else-if="editingModule" ref="root" class="col tab-col">
    <UserModuleEditor :key="editingModule.id" :preset="preset" :module="editingModule" @close="closeEditor" @open="openEditor" />
  </div>
  <div v-else ref="root" class="col tab-col">
    <Section v-for="g in groups" :key="g.id" :title="g.label" :help="g.help">
      <div v-for="c in g.choices" :key="c.key" class="choice-list" role="radiogroup">
        <button
          v-for="m in c.modules" :key="m.id" type="button" role="radio" class="choice" :class="{ on: chosen(c) === m.id }"
          :aria-checked="chosen(c) === m.id" @click="choose(c, m.id)"
        >
          <span class="radio" />
          <span class="grow">{{ name(m) }}</span>
          <Help :text="desc(m)" align="end" />
        </button>
        <button v-if="g.allowNone" type="button" role="radio" class="choice" :class="{ on: chosen(c) === null }" :aria-checked="chosen(c) === null" @click="choose(c, null)">
          <span class="radio" />
          <span class="grow muted">{{ t('common.none') }}</span>
        </button>
      </div>
      <div v-for="m in g.toggles" :key="m.id" class="module-row">
        <span class="grow"><span class="ellipsis">{{ name(m) }}</span><Help :text="desc(m)" align="start" /></span>
        <Switch :model-value="on[m.id]" :label="name(m)" @update:model-value="toggle(m, $event)" />
      </div>
    </Section>
    <div v-if="!groups.length" class="empty">{{ t('modules.none') }}</div>
    <UserModulesSection :preset="preset" @open="openEditor" />
  </div>
</template>
