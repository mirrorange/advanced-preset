<script setup lang="ts">
/**
 * Storylines of the chat (I-152, I-164): one card per storyline with its messages; an expanded card
 * has a toolbar (if-line and visibility toggles, rename, make main). Usage of the tags is in the help.
 * The tab only exists while storylines are declared and switched on (Panel.vue).
 */
import { computed, ref, watch } from 'vue';
import { ChevronDown, Crown, Eye, EyeOff, GitBranch, PenLine, Split } from 'lucide-vue-next';
import { escapeHtml, inputPopup, st, toast } from '@/st/host';
import { t } from '@/i18n';
import { renameStoryline, setHiddenLine, setIfLine, validStorylineName } from '@/store/storylines';
import { switchMainInteractive } from '@/app/storylines';
import { bumpChat, ui } from '../../state';
import { usePreset } from '../use';
import { refreshMessages } from '../../mounts';
import { jumpToMessage, storylineEntries, type StorylineEntry } from '../../storylines';
import NoPreset from '../NoPreset.vue';
import Help from '../../components/Help.vue';
import IconButton from '../../components/IconButton.vue';

const { preset } = usePreset();
const hasChat = computed(() => { void ui.chatRev; return Boolean(st().chatMetadata && (st().characterId !== undefined || st().groupId)); });
const synopsisId = computed(() => Object.values(preset.value?.structures ?? {}).find((s) => s.kind === 'synopsis')?.id);
const entries = computed(() => (hasChat.value && preset.value?.storylines ? storylineEntries(synopsisId.value) : []));

const open = ref(new Set<string>());
const toggle = (key: string) => { const s = new Set(open.value); if (s.has(key)) s.delete(key); else s.add(key); open.value = s; };
watch(() => ui.storylineFocus, (key) => { if (key !== null) { open.value = new Set([...open.value, key]); ui.storylineFocus = null; } }, { immediate: true });

const title = (e: StorylineEntry) => (e.main ? (e.name ? t('storylines.mainNamed', { name: e.name }) : t('storylines.main')) : e.name || t('storylines.unnamed'));

const changed = () => { bumpChat(); refreshMessages(); };
async function setIf(e: StorylineEntry) { await setIfLine(e.key, !e.if); changed(); }
async function setVisible(e: StorylineEntry) { await setHiddenLine(e.key, !e.hidden); changed(); }
async function makeMain(e: StorylineEntry) { if (await switchMainInteractive(e.key)) changed(); }
async function rename(e: StorylineEntry) {
  const head = e.main && !e.name ? t('storylines.nameMain') : t('storylines.renameTitle', { name: title(e) });
  const html = `<h3>${escapeHtml(head)}</h3>${e.main ? `<p>${escapeHtml(t('storylines.nameMain.hint'))}</p>` : ''}`;
  const answer = await inputPopup(html, e.name, t('common.save'), t('common.cancel'));
  if (answer === null) return;
  const name = answer.trim();
  if (!validStorylineName(name)) return toast('warning', t('storylines.invalidName'), t('app.name'));
  const res = await renameStoryline(e.key, name);
  if (res === 'taken') return toast('warning', t('storylines.nameTaken', { name }), t('app.name'));
  if (res === 'invalid') return toast('warning', t('storylines.invalidName'), t('app.name'));
  if (res === 'unchanged') return;
  if (!e.main && open.value.has(e.key)) open.value = new Set([...open.value].map((k) => (k === e.key ? name : k)));
  changed();
}
</script>

<template>
  <NoPreset v-if="!preset" />
  <div v-else-if="!hasChat" class="empty"><GitBranch aria-hidden="true" /><span>{{ t('memory.noChat') }}</span></div>
  <template v-else>
    <div class="row storylines-head">
      <span class="xs muted grow">{{ t('storylines.count', { n: entries.length }) }}</span>
      <Help :text="t('storylines.help')" align="end" />
    </div>

    <section v-for="e in entries" :key="e.key" class="card storyline-card" :class="{ current: e.current, hidden: e.hidden }">
      <header class="card-head clickable" :aria-expanded="open.has(e.key)" @click="toggle(e.key)">
        <component :is="e.main ? Crown : e.if ? Split : GitBranch" class="section-icon" aria-hidden="true" />
        <span class="card-title grow ellipsis">{{ title(e) }}</span>
        <span v-if="e.current" class="storyline-dot" :title="t('storylines.current')" :aria-label="t('storylines.current')" />
        <span v-if="e.if" class="badge warn">if</span>
        <EyeOff v-if="e.hidden" class="storyline-flag" :aria-label="t('storylines.hidden')" />
        <span class="xs faint">{{ t('storylines.floors', { n: e.floors.length }) }}</span>
        <ChevronDown class="chevron" :class="{ flipped: open.has(e.key) }" aria-hidden="true" />
      </header>
      <div v-if="open.has(e.key)" class="card-body col">
        <div v-if="!e.pending" class="storyline-toolbar" :class="{ solo: e.main }" role="toolbar" :aria-label="title(e)">
          <template v-if="!e.main">
            <IconButton :icon="Split" :label="t('storylines.ifLine.toggle')" :pressed="e.if" small @click="setIf(e)" />
            <IconButton :icon="e.hidden ? EyeOff : Eye" :label="t('storylines.visible.toggle')" :pressed="!e.hidden" small @click="setVisible(e)" />
            <span class="storyline-toolbar-sep" aria-hidden="true" />
          </template>
          <IconButton :icon="PenLine" :label="e.main && !e.name ? t('storylines.nameMain') : t('common.rename')" small @click="rename(e)" />
          <IconButton v-if="!e.main" :icon="Crown" :label="t('storylines.makeMain')" small @click="makeMain(e)" />
        </div>
        <div v-if="!e.floors.length" class="faint small">{{ t('storylines.empty') }}</div>
        <ul v-else class="storyline-floors">
          <li v-for="f in e.floors" :key="f.index" class="row tight small clickable" :title="t('storylines.jump')" @click="jumpToMessage(f.index)">
            <span class="badge neutral mono">#{{ f.index }}</span>
            <span class="xs muted">{{ f.user ? t('storylines.user') : t('storylines.narrator') }}</span>
            <span class="grow ellipsis">{{ f.title || '…' }}</span>
          </li>
        </ul>
      </div>
    </section>
  </template>
</template>
