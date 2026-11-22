<script setup lang="ts">
/**
 * "My modules": ungrouped modules first, then the user's groups as cards. Open, toggle (a single
 * group's modules are radios: at most one on), drag the grip to reorder or move between groups,
 * drag a group's grip to reorder groups; import / export, create modules and groups. A group's
 * switch turns the whole group on / off; a folded group shows only its grip, name, count and switch.
 * When the preset ships user module templates, "new" first asks (inline) whether to start blank or
 * from one.
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { ChevronRight, CircleDot, Download, FolderPlus, GripVertical, Plus, Trash2, Upload } from 'lucide-vue-next';
import { groupMembers, parseUserModuleFile, partEnabled, presetUserModuleTemplates, type APreset, type UserModuleGroup, type UserModuleTemplate } from '@advanced-preset/protocol';
import { confirmUserModuleTemplates, isTrustDeclined } from '@/app/trust';
import { localSource, t } from '@/i18n';
import { toast } from '@/st/host';
import {
  createUserModule, createUserModuleFromTemplate, createUserModuleGroup, exportUserModuleGroup, exportUserModules, importUserModules,
  moveUserModule, moveUserModuleGroup, removeUserModuleGroup, renameUserModuleGroup, setUserModuleEnabled, setUserModuleGroupCollapsed,
  setUserModuleGroupEnabled, setUserModuleGroupMode, userModuleGroups, userModules,
} from '@/store/user-modules';
import { downloadJson, fileSlug } from '../../download';
import IconButton from '../../components/IconButton.vue';
import Section from '../../components/Section.vue';
import Switch from '../../components/Switch.vue';
import UserModulePicker from './UserModulePicker.vue';
import UserModuleRow from './UserModuleRow.vue';

const props = defineProps<{ preset: APreset }>();
const emit = defineEmits<{ open: [id: string] }>();

const list = computed(() => userModules(props.preset));
const groups = computed(() => userModuleGroups(props.preset).map((g) => ({ g, members: groupMembers(list.value, g.id) })));
const ungrouped = computed(() => groupMembers(list.value, null));
const hasPoints = computed(() => props.preset.insertionPoints.length > 0 || props.preset.vars.length > 0);
const empty = computed(() => !list.value.length && !groups.value.length);
/** Something to drag a module to: another module, or a group. */
const movable = computed(() => list.value.length > 1 || groups.value.length > 0);

const toggle = (id: string, on: boolean) => setUserModuleEnabled(props.preset, id, on);

// New modules: `pickFor` is the group the template picker is open for (null: ungrouped; undefined: closed).
const templates = computed(() => presetUserModuleTemplates(props.preset).map((tpl) => ({ tpl, body: localSource(props.preset, tpl, 'userModuleTemplates') })));
const pickFor = ref<string | null | undefined>(undefined);
const group = (id: string | null) => id ?? undefined;

function createBlank(g: string | null) {
  pickFor.value = undefined;
  emit('open', createUserModule(props.preset, t('um.newName', { n: list.value.length + 1 }), group(g)).id);
}
function createFrom(g: string | null, tpl: UserModuleTemplate) {
  pickFor.value = undefined;
  emit('open', createUserModuleFromTemplate(props.preset, localSource(props.preset, tpl, 'userModuleTemplates'), group(g) ?? tpl.group).id);
}
/** "New": straight to a blank module, or the inline picker when there are templates. */
function create(g: string | null) {
  if (g) setUserModuleGroupCollapsed(props.preset, g, false);
  if (!templates.value.length) return createBlank(g);
  pickFor.value = pickFor.value === g ? undefined : g;
}

// Groups.
const root = ref<HTMLElement | null>(null);
const nameInput = (id: string) => root.value?.querySelector<HTMLInputElement>(`.um-group[data-group="${CSS.escape(id)}"] .um-group-name`);
async function createGroup() {
  const g = createUserModuleGroup(props.preset, t('um.grp.newName', { n: groups.value.length + 1 }));
  await nextTick();
  nameInput(g.id)?.select();
}
const rename = (g: UserModuleGroup, ev: Event) => renameUserModuleGroup(props.preset, g.id, (ev.target as HTMLInputElement).value);
const setMode = (g: UserModuleGroup) => setUserModuleGroupMode(props.preset, g.id, g.mode === 'single' ? 'multi' : 'single');
const setCollapsed = (g: UserModuleGroup) => {
  if (!g.collapsed) {
    if (deleting.value === g.id) deleting.value = null;
    if (pickFor.value === g.id) pickFor.value = undefined;
  }
  setUserModuleGroupCollapsed(props.preset, g.id, !g.collapsed);
};
const setEnabled = (g: UserModuleGroup, on: boolean) => setUserModuleGroupEnabled(props.preset, g.id, on);
const exportGroup = (g: UserModuleGroup) => downloadJson(`${props.preset.id}.${fileSlug(g.name)}.ap-modules.json`, exportUserModuleGroup(props.preset, g.id));

/** The group asking how to delete (keep its modules, or delete them too). An empty group goes at once. */
const deleting = ref<string | null>(null);
function askDelete(g: UserModuleGroup, n: number) {
  if (n) deleting.value = deleting.value === g.id ? null : g.id;
  else removeUserModuleGroup(props.preset, g.id, { withModules: false });
}
function remove(g: UserModuleGroup, withModules: boolean) {
  deleting.value = null;
  removeUserModuleGroup(props.preset, g.id, { withModules });
}

// Files.
const fileInput = ref<HTMLInputElement | null>(null);
async function importFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  try {
    const raw: unknown = JSON.parse(await file.text());
    // Templates in someone else's modules run code: ask first (I-110).
    await confirmUserModuleTemplates(parseUserModuleFile(raw).modules);
    const { added, groups: newGroups, missing } = importUserModules(props.preset, raw);
    const done = newGroups.length ? t('um.importedGroups', { n: added.length, groups: newGroups.length }) : t('um.imported', { n: added.length });
    toast(missing ? 'warning' : 'success', missing ? `${done} ${t('um.importedMissing', { missing })}` : done);
  } catch (e) {
    if (isTrustDeclined(e)) toast('info', e.message);
    else toast('error', t('um.importFailed', { error: e instanceof Error ? e.message : String(e) }));
  }
}
const exportAll = () => downloadJson(`${props.preset.id}.ap-modules.json`, exportUserModules(props.preset));

// Pointer-based dragging (works with touch): the list reorders live under the pointer. Moves and
// ups are followed on the window, since a row moved to another group is a new element.
const drag = ref<{ kind: 'module' | 'group'; id: string } | null>(null);

function grab(e: PointerEvent, kind: 'module' | 'group', id: string) {
  if (e.button !== 0) return;
  e.preventDefault();
  drag.value = { kind, id };
  window.addEventListener('pointermove', follow);
  window.addEventListener('pointerup', drop);
  window.addEventListener('pointercancel', drop);
}

/** The drop zone (ungrouped list or a group card) under `y`, else the nearest one. */
function zoneAt(y: number): HTMLElement | undefined {
  let best: HTMLElement | undefined;
  let dist = Infinity;
  for (const z of root.value?.querySelectorAll<HTMLElement>('[data-zone]') ?? []) {
    const b = z.getBoundingClientRect();
    const d = y < b.top ? b.top - y : y > b.bottom ? y - b.bottom : 0;
    if (d < dist) { best = z; dist = d; }
  }
  return best;
}
/** How many of `els` (other than the dragged one) sit above `y`. */
const above = (els: HTMLElement[], y: number) => els.filter((r) => { const b = r.getBoundingClientRect(); return b.top + b.height / 2 < y; }).length;

function follow(e: PointerEvent) {
  const d = drag.value;
  if (!d) return;
  if (d.kind === 'group') {
    const cards = [...(root.value?.querySelectorAll<HTMLElement>('.um-group') ?? [])].filter((c) => c.dataset.group !== d.id);
    moveUserModuleGroup(props.preset, d.id, above(cards, e.clientY));
    return;
  }
  const zone = zoneAt(e.clientY);
  if (!zone) return;
  const target = zone.dataset.zone || null;
  const rows = [...zone.querySelectorAll<HTMLElement>('.um-row')].filter((r) => r.dataset.id !== d.id);
  moveUserModule(props.preset, d.id, target, zone.dataset.collapsed !== undefined ? Infinity : above(rows, e.clientY));
}
function drop() {
  drag.value = null;
  window.removeEventListener('pointermove', follow);
  window.removeEventListener('pointerup', drop);
  window.removeEventListener('pointercancel', drop);
}
onBeforeUnmount(drop);

const draggingModule = (id: string) => drag.value?.kind === 'module' && drag.value.id === id;
</script>

<template>
  <Section :title="t('um.title')" :help="t('um.help')">
    <template #actions>
      <IconButton v-if="hasPoints" :icon="Upload" :label="t('um.import')" small align="end" @click="fileInput?.click()" />
      <IconButton v-if="!empty" :icon="Download" :label="t('um.exportAll')" small align="end" @click="exportAll" />
      <IconButton v-if="hasPoints" :icon="FolderPlus" :label="t('um.grp.new')" small align="end" @click="createGroup" />
      <IconButton v-if="hasPoints && !empty" :icon="Plus" :label="t('um.new')" :active="pickFor === null" small align="end" @click="create(null)" />
    </template>
    <UserModulePicker v-if="pickFor === null" :templates="templates" @blank="createBlank(null)" @template="createFrom(null, $event)" @cancel="pickFor = undefined" />
    <div v-if="!empty" ref="root" class="um-groups" :class="{ 'um-dragging': drag }">
      <div v-if="ungrouped.length || (groups.length && drag?.kind === 'module')" class="um-list" data-zone="">
        <UserModuleRow
          v-for="m in ungrouped" :key="m.id" :preset="preset" :module="m" :grip="movable" :dragging="draggingModule(m.id)"
          @open="emit('open', m.id)" @toggle="toggle(m.id, $event)" @grab="grab($event, 'module', m.id)"
        />
        <div v-if="!ungrouped.length" class="um-drop xs muted">{{ t('um.grp.dropOut') }}</div>
      </div>
      <section
        v-for="{ g, members } in groups" :key="g.id" class="um-group" :class="{ collapsed: g.collapsed, off: !partEnabled(g), dragging: drag?.kind === 'group' && drag.id === g.id }"
        :data-group="g.id" :data-zone="g.id" :data-collapsed="g.collapsed ? '' : undefined"
      >
        <header class="um-group-head">
          <span v-if="groups.length > 1" class="um-grip" :aria-label="t('um.grp.reorder')" @pointerdown="grab($event, 'group', g.id)"><GripVertical /></span>
          <IconButton :icon="ChevronRight" :label="t(g.collapsed ? 'um.grp.expand' : 'um.grp.collapse')" :class="['um-chevron', { open: !g.collapsed }]" small align="start" @click="setCollapsed(g)" />
          <input class="input bare um-group-name grow" :value="g.name" :placeholder="t('um.grp.untitled')" :aria-label="t('um.grp.name')" @input="rename(g, $event)" />
          <span class="um-group-count xs muted" :title="t('um.grp.count', { n: members.length })">{{ members.length }}</span>
          <template v-if="!g.collapsed">
            <IconButton :icon="CircleDot" :label="t(g.mode === 'single' ? 'um.grp.single' : 'um.grp.multi')" :pressed="g.mode === 'single'" small align="end" class="um-group-mode" @click="setMode(g)" />
            <IconButton v-if="hasPoints" :icon="Plus" :label="t('um.grp.addModule')" :active="pickFor === g.id" small align="end" class="um-group-add" @click="create(g.id)" />
            <IconButton :icon="Download" :label="t('um.grp.export')" small align="end" class="um-group-export" @click="exportGroup(g)" />
            <IconButton :icon="Trash2" :label="t('um.grp.delete')" :active="deleting === g.id" danger small align="end" class="um-group-delete" @click="askDelete(g, members.length)" />
          </template>
          <Switch :model-value="partEnabled(g)" :label="t('um.grp.switch', { name: g.name || t('um.grp.untitled') })" class="um-group-switch" @update:model-value="setEnabled(g, $event)" />
        </header>
        <div v-if="deleting === g.id" class="um-group-confirm" role="group" :aria-label="t('um.grp.delete')" @keydown.esc.stop="deleting = null">
          <span class="small grow">{{ t('um.grp.deleteAsk', { n: members.length }) }}</span>
          <button type="button" class="btn ghost um-keep" @click="remove(g, false)">{{ t('um.grp.keepModules') }}</button>
          <button type="button" class="btn ghost danger um-delete-all" @click="remove(g, true)">{{ t('um.grp.deleteModules') }}</button>
          <button type="button" class="btn ghost" @click="deleting = null">{{ t('common.cancel') }}</button>
        </div>
        <UserModulePicker v-if="pickFor === g.id" :templates="templates" @blank="createBlank(g.id)" @template="createFrom(g.id, $event)" @cancel="pickFor = undefined" />
        <div v-if="!g.collapsed" class="um-list" :role="g.mode === 'single' ? 'radiogroup' : undefined" :aria-label="g.name">
          <UserModuleRow
            v-for="m in members" :key="m.id" :preset="preset" :module="m" :single="g.mode === 'single'" :grip="movable" :dragging="draggingModule(m.id)"
            @open="emit('open', m.id)" @toggle="toggle(m.id, $event)" @grab="grab($event, 'module', m.id)"
          />
          <div v-if="!members.length" class="um-drop xs muted">{{ t('um.grp.empty') }}</div>
        </div>
      </section>
    </div>
    <button v-else-if="hasPoints && pickFor === undefined" type="button" class="um-new" @click="create(null)"><Plus />{{ t('um.new') }}</button>
    <div v-else-if="!hasPoints" class="faint small">{{ t('um.noPoints') }}</div>
    <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importFile" />
  </Section>
</template>
