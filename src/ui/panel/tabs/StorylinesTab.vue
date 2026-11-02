<script setup lang="ts">
/** Storylines of the chat (I-152): their messages, the if-line switch and the main storyline. */
import { computed, ref, watch } from 'vue';
import { ChevronDown, Crown, GitBranch, PenLine } from 'lucide-vue-next';
import { escapeHtml, inputPopup, st, toast } from '@/st/host';
import { t } from '@/i18n';
import { nameMainStoryline, setIfLine, storylineMeta, validStorylineName } from '@/store/storylines';
import { switchMainInteractive } from '@/app/storylines';
import { bumpChat, ui } from '../../state';
import { usePreset } from '../use';
import { refreshMessages } from '../../mounts';
import { jumpToMessage, storylineEntries } from '../../storylines';
import NoPreset from '../NoPreset.vue';
import Section from '../../components/Section.vue';
import Switch from '../../components/Switch.vue';
import IconButton from '../../components/IconButton.vue';

const { preset, config, update } = usePreset();
const declared = computed(() => Boolean(preset.value?.storylines));
const enabled = computed({
  get: () => config.value?.storylines?.enabled !== false,
  set: (v: boolean) => update((c) => { c.storylines = { ...(c.storylines ?? { enabled: true }), enabled: v }; }),
});
const hasChat = computed(() => { void ui.chatRev; return Boolean(st().chatMetadata && (st().characterId !== undefined || st().groupId)); });
const synopsisId = computed(() => Object.values(preset.value?.structures ?? {}).find((s) => s.kind === 'synopsis')?.id);
const entries = computed(() => (hasChat.value && declared.value ? storylineEntries(synopsisId.value) : []));
const mainName = computed(() => { void ui.chatRev; return storylineMeta().main ?? ''; });

const open = ref(new Set<string>());
const toggle = (key: string) => { const s = new Set(open.value); if (s.has(key)) s.delete(key); else s.add(key); open.value = s; };
watch(() => ui.storylineFocus, (key) => { if (key !== null) { open.value = new Set([...open.value, key]); ui.storylineFocus = null; } }, { immediate: true });

const changed = () => { bumpChat(); refreshMessages(); };
async function setIf(key: string, v: boolean) { await setIfLine(key, v); changed(); }
async function makeMain(key: string) { if (await switchMainInteractive(key)) changed(); }
async function nameMain() {
  const html = `<h3>${escapeHtml(t('storylines.nameMain'))}</h3><p>${escapeHtml(t('storylines.nameMain.hint'))}</p>`;
  const answer = await inputPopup(html, mainName.value, t('common.save'), t('common.cancel'));
  if (answer === null) return;
  const name = answer.trim();
  if (!validStorylineName(name)) return toast('warning', t('storylines.invalidName'), t('app.name'));
  if (!(await nameMainStoryline(name))) return toast('warning', t('storylines.nameTaken', { name }), t('app.name'));
  changed();
}
</script>

<template>
  <NoPreset v-if="!preset || !config" />
  <template v-else>
    <Section :title="t('tab.storylines')" :icon="GitBranch" :help="t('storylines.hint')">
      <template v-if="declared" #actions><Switch v-model="enabled" :label="t('storylines.enabled')" /></template>
      <div v-if="!declared" class="faint small">{{ t('storylines.unsupported') }}</div>
      <div v-else-if="!enabled" class="faint small">{{ t('storylines.off') }}</div>
      <div v-else-if="!hasChat" class="faint small">{{ t('memory.noChat') }}</div>
      <div v-else class="col storyline-usage xs muted">
        <span>{{ t('storylines.usage.side') }}</span>
        <span>{{ t('storylines.usage.if') }}</span>
        <span>{{ t('storylines.usage.main') }}</span>
      </div>
    </Section>

    <template v-if="declared && enabled && hasChat">
      <section v-for="e in entries" :key="e.key" class="card storyline-card" :class="{ current: e.current }">
        <header class="card-head clickable" @click="toggle(e.key)">
          <component :is="e.main ? Crown : GitBranch" class="section-icon" aria-hidden="true" />
          <span class="card-title grow ellipsis">{{ e.main ? (e.name ? t('storylines.mainNamed', { name: e.name }) : t('storylines.main')) : e.name }}</span>
          <span v-if="e.current" class="badge">{{ t('storylines.current') }}</span>
          <span v-if="e.if" class="badge warn">{{ t('storylines.ifLine') }}</span>
          <span class="badge neutral">{{ t('storylines.floors', { n: e.floors.length }) }}</span>
          <ChevronDown class="chevron" :class="{ flipped: open.has(e.key) }" aria-hidden="true" />
        </header>
        <div v-if="open.has(e.key)" class="card-body col">
          <div class="row wrap storyline-actions">
            <template v-if="e.main">
              <button type="button" class="btn ghost" @click="nameMain"><PenLine aria-hidden="true" />{{ e.name ? t('common.rename') : t('storylines.nameMain') }}</button>
            </template>
            <template v-else>
              <label class="row tight small"><Switch :model-value="e.if" :label="t('storylines.ifLine')" @update:model-value="(v: boolean) => setIf(e.key, v)" />{{ t('storylines.ifLine.toggle') }}</label>
              <span class="grow" />
              <button type="button" class="btn ghost" @click="makeMain(e.key)"><Crown aria-hidden="true" />{{ t('storylines.makeMain') }}</button>
            </template>
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
</template>
