<script setup lang="ts">
/**
 * User modules first, then preset modules by group (§16.5): exclusive sets as a choice list, the rest as switches;
 * `always` modules are hidden. A set that allows none gets a switch and shows its choices only while on.
 */
import { computed, nextTick, ref, watch } from 'vue';
import type { Module } from '@advanced-preset/protocol';
import { exclusiveAllowsNone, moduleSwitches } from '@advanced-preset/protocol';
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

/** An exclusive set. `label` is set when it is shown as its own row (nested, or beside other modules); `optional` sets have an on/off switch. */
interface ChoiceSet { key: string; label?: string; help?: string; optional: boolean; modules: Module[] }
interface GroupView { id: string; label: string; help?: string; header?: ChoiceSet; sets: ChoiceSet[]; toggles: Module[] }

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
      const keys = [...new Set(mods.filter((m) => m.exclusive).map((m) => m.exclusive!))];
      const toggles = mods.filter((m) => !m.exclusive);
      // An optional set that is the group's only content is switched from the section header; with other
      // modules beside it, a header switch would read as controlling them too, so it gets its own row.
      const sole = keys.length === 1 && !toggles.length;
      const sets = keys.map((key): ChoiceSet => {
        const optional = exclusiveAllowsNone(p, key);
        const bare = key === g && (!optional || sole);
        return {
          key,
          label: bare ? undefined : pt(p, 'groups', key, 'label', p.groups[key]?.label ?? key),
          help: bare || key === g ? undefined : pt(p, 'groups', key, 'description', p.groups[key]?.description ?? '') || undefined,
          optional,
          modules: mods.filter((m) => m.exclusive === key),
        };
      });
      return {
        id: g,
        order: decl?.order ?? 999,
        label: g ? pt(p, 'groups', g, 'label', decl?.label ?? g) : t('modules.other'),
        help: g ? pt(p, 'groups', g, 'description', decl?.description ?? '') || undefined : undefined,
        header: sets.find((c) => !c.label && c.optional),
        sets,
        toggles,
      };
    });
  return views.sort((a, b) => a.order - b.order);
});

const name = (m: Module) => pt(preset.value!, 'modules', m.id, 'name', m.name);
const desc = (m: Module) => pt(preset.value!, 'modules', m.id, 'description', m.description ?? '') || undefined;
const chosen = (c: ChoiceSet) => c.modules.find((m) => on.value[m.id])?.id ?? null;

function choose(c: ChoiceSet, id: string | null) {
  update((cfg) => { for (const m of c.modules) cfg.modules[m.id] = m.id === id; });
}
function toggle(m: Module, v: boolean) {
  update((cfg) => { cfg.modules[m.id] = v; });
}

// Switching an optional set back on restores the last choice made in this session (else the default module).
const lastChoice = new Map<string, string>();
const memoKey = (c: ChoiceSet) => `${preset.value?.id}:${c.key}`;
function pick(c: ChoiceSet, id: string) {
  lastChoice.set(memoKey(c), id);
  choose(c, id);
}
function setOn(c: ChoiceSet, v: boolean) {
  const cur = chosen(c);
  if (!v) {
    if (cur) lastChoice.set(memoKey(c), cur);
    choose(c, null);
    return;
  }
  const last = lastChoice.get(memoKey(c));
  const id = c.modules.find((m) => m.id === last) ?? c.modules.find((m) => m.default) ?? c.modules[0];
  if (id) choose(c, id.id);
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
    <UserModulesSection :preset="preset" @open="openEditor" />
    <Section v-for="g in groups" :key="g.id" :title="g.label" :help="g.help">
      <template v-if="g.header" #actions>
        <Switch :model-value="chosen(g.header) !== null" :label="g.label" @update:model-value="setOn(g.header, $event)" />
      </template>
      <template v-for="c in g.sets" :key="c.key">
        <div v-if="c.label" class="module-row">
          <span class="grow"><span class="ellipsis">{{ c.label }}</span><Help :text="c.help" align="start" /></span>
          <Switch v-if="c.optional" :model-value="chosen(c) !== null" :label="c.label" @update:model-value="setOn(c, $event)" />
        </div>
        <div v-if="!c.optional || chosen(c)" class="choice-list" :class="{ nested: c.label }" role="radiogroup" :aria-label="c.label ?? g.label">
          <button
            v-for="m in c.modules" :key="m.id" type="button" role="radio" class="choice" :class="{ on: chosen(c) === m.id }"
            :aria-checked="chosen(c) === m.id" @click="pick(c, m.id)"
          >
            <span class="radio" />
            <span class="grow">{{ name(m) }}</span>
            <Help :text="desc(m)" align="end" />
          </button>
        </div>
      </template>
      <div v-for="m in g.toggles" :key="m.id" class="module-row">
        <span class="grow"><span class="ellipsis">{{ name(m) }}</span><Help :text="desc(m)" align="start" /></span>
        <Switch :model-value="on[m.id]" :label="name(m)" @update:model-value="toggle(m, $event)" />
      </div>
    </Section>
    <div v-if="!groups.length" class="empty">{{ t('modules.none') }}</div>
  </div>
</template>
