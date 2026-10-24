<script setup lang="ts">
/** Assembly preview, request segments, log and the `ap dev` source (§16.5, §18.3). */
import { computed, reactive, ref, watch } from 'vue';
import { ChevronRight, Code, Copy, FileStack, MessageSquareDashed, ScrollText, Server, Trash2 } from 'lucide-vue-next';
import { debugState } from '@/core/debug';
import type { AssemblySnapshot } from '@/core/assembler';
import { settings, save } from '@/store/settings';
import { st } from '@/st/host';
import { t } from '@/i18n';
import { devSource } from '@/app/dev-source';
import { annotationsOf } from '@/app/annotations';
import { ui } from '../../state';
import Section from '../../components/Section.vue';
import Field from '../../components/Field.vue';
import Switch from '../../components/Switch.vue';
import IconButton from '../../components/IconButton.vue';

const snapshot = computed(() => debugState.log.find((e) => e.kind === 'assembly')?.data as AssemblySnapshot | undefined);
const openRegions = reactive(new Set<string>());
const toggleRegion = (id: string) => (openRegions.has(id) ? openRegions.delete(id) : openRegions.add(id));

const tokens = reactive<Record<string, number>>({});
watch(snapshot, async (s) => {
  if (!s) return;
  for (const r of s.regions) {
    const text = r.messages.map((m) => m.content).join('\n');
    const key = `${s.genId}:${r.id}`;
    if (tokens[key] === undefined && text) {
      try { tokens[key] = await st().getTokenCountAsync(text); } catch { /* tokenizer unavailable */ }
    }
  }
}, { immediate: true });

const openReq = ref<number | null>(null);
const pretty = (v: unknown) => (typeof v === 'string' ? tryJson(v) : JSON.stringify(v, null, 2));
function tryJson(s: string) { try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; } }
const time = (at: number) => new Date(at).toLocaleTimeString();
const copy = (v: unknown) => navigator.clipboard?.writeText(pretty(v));
const usageText = (u: unknown) => {
  const x = u as Record<string, number> | undefined;
  if (!x) return '';
  const inp = x.prompt_tokens ?? x.input_tokens ?? x.promptTokenCount;
  const out = x.completion_tokens ?? x.output_tokens ?? x.candidatesTokenCount;
  return inp !== undefined || out !== undefined ? `${inp ?? '?'} → ${out ?? '?'}` : '';
};

const devEnabled = computed({ get: () => settings().dev.enabled, set: (v: boolean) => { settings().dev.enabled = v; save(); } });
const devUrl = computed({ get: () => settings().dev.url, set: (v: string) => { settings().dev.url = v.trim(); save(); } });
const version = __AP_VERSION__;
const build = __AP_BUILD_ID__;
const logEntries = computed(() => debugState.log.filter((e) => e.kind !== 'assembly'));
/** Orphaned inline annotations of the current chat (I-86: shown only here). */
const orphans = computed(() => {
  void ui.chatRev;
  const out: { mesId: number; quote: string; comment: string }[] = [];
  const chat = st().chat ?? [];
  for (let i = 0; i < chat.length; i++) {
    for (const a of annotationsOf(i)) if (a.orphan) out.push({ mesId: i, quote: a.quote, comment: a.comment });
  }
  return out;
});
</script>

<template>
  <Section :title="t('debug.dev')" :icon="Server" :help="t('debug.dev.hint')">
    <template #actions><span class="row tight xs muted"><span class="dot status-dot" :class="devSource.status" />{{ t(`debug.dev.${devSource.status}`) }}</span></template>
    <Field :label="t('debug.dev.url')">
      <div class="row">
        <input v-model.lazy="devUrl" class="input grow" type="url" placeholder="http://localhost:4747" />
        <Switch v-model="devEnabled" :label="t('debug.dev')" />
      </div>
    </Field>
    <span v-if="devSource.error" class="xs text-danger">{{ devSource.error }}</span>
  </Section>

  <Section :title="t('debug.assembly')" :icon="FileStack" collapsible>
    <template v-if="snapshot">
      <div class="row wrap xs muted">
        <span class="badge neutral">{{ t(`transport.${snapshot.transport}`) }}</span>
        <span v-if="snapshot.workflow" class="badge neutral">{{ snapshot.workflow }}</span>
        <span class="badge neutral">{{ snapshot.origin }}</span>
        <span v-if="snapshot.dryRun" class="badge warn">dry run</span>
        <span class="grow" />{{ time(snapshot.at) }}
      </div>
      <div>
        <div v-for="r in snapshot.regions" :key="r.id" class="region">
          <div class="region-head" @click="toggleRegion(r.id)">
            <ChevronRight class="faint caret" :class="{ open: openRegions.has(r.id) }" />
            <span class="grow mono">{{ r.id }}</span>
            <span class="xs muted">{{ r.messages.length }} · {{ tokens[`${snapshot.genId}:${r.id}`] ?? r.messages.reduce((n, m) => n + m.chars, 0) }}{{ tokens[`${snapshot.genId}:${r.id}`] !== undefined ? ' tok' : ' ch' }}</span>
          </div>
          <template v-if="openRegions.has(r.id)">
            <div v-for="(m, i) in r.messages" :key="i" class="region-msg">
              <div class="row xs muted"><span class="badge neutral">{{ m.role }}</span>{{ m.chars }} ch</div>
              <div class="pre mono scroll">{{ m.content }}</div>
            </div>
            <div v-if="!r.messages.length" class="xs faint region-msg">{{ t('debug.emptyRegion') }}</div>
          </template>
        </div>
      </div>
      <div v-if="snapshot.vars?.length">
        <div v-for="v in snapshot.vars" :key="v.id" class="region">
          <div class="region-head" @click="toggleRegion(`var:${v.id}`)">
            <ChevronRight class="faint caret" :class="{ open: openRegions.has(`var:${v.id}`) }" />
            <span class="grow mono">{{ v.id }}</span>
            <span class="xs muted">{{ v.text.length }} ch</span>
          </div>
          <div v-if="openRegions.has(`var:${v.id}`)" class="region-msg">
            <div class="pre mono scroll">{{ v.text }}</div>
            <div v-if="!v.text" class="xs faint">{{ t('debug.emptyRegion') }}</div>
          </div>
        </div>
      </div>
      <div v-if="snapshot.warnings.length" class="xs text-warning">{{ snapshot.warnings.join(' · ') }}</div>
    </template>
    <div v-else class="faint small">{{ t('debug.noAssembly') }}</div>
  </Section>

  <Section :title="t('debug.requests')" :icon="Code" collapsible>
    <div v-for="(r, i) in debugState.requests" :key="`${r.genId}:${r.step}:${r.at}`" class="req">
      <div class="row small clickable" @click="openReq = openReq === i ? null : i">
        <span class="mono grow ellipsis">{{ r.genId }} · #{{ r.step }}</span>
        <span v-if="r.error" class="badge warn">{{ t('debug.error') }}</span>
        <span class="xs muted">{{ usageText(r.usage) }}</span>
        <span class="xs muted">{{ r.durationMs !== undefined ? `${(r.durationMs / 1000).toFixed(1)}s` : '…' }}</span>
      </div>
      <template v-if="openReq === i">
        <div class="row xs muted"><span class="grow">{{ t('debug.request') }}</span><IconButton :icon="Copy" :label="t('common.copy')" small align="end" @click="copy(r.request)" /></div>
        <pre class="mono scroll">{{ pretty(r.request) }}</pre>
        <div class="row xs muted"><span class="grow">{{ t('debug.response') }}</span><IconButton :icon="Copy" :label="t('common.copy')" small align="end" @click="copy(r.response ?? r.error ?? '')" /></div>
        <pre class="mono scroll">{{ r.error ?? pretty(r.response ?? '') }}</pre>
      </template>
    </div>
    <div v-if="!debugState.requests.length" class="faint small">{{ t('debug.noRequests') }}</div>
  </Section>

  <Section :title="t('debug.log')" :icon="ScrollText" collapsible :open="false">
    <template #actions><IconButton :icon="Trash2" :label="t('common.clear')" small align="end" @click="debugState.log.splice(0)" /></template>
    <div v-for="(e, i) in logEntries" :key="i" class="req">
      <div class="row xs"><span class="badge neutral">{{ e.kind }}</span><span class="grow" /><span class="muted">{{ time(e.at) }}</span></div>
      <pre class="mono scroll">{{ pretty(e.data) }}</pre>
    </div>
    <div v-if="!logEntries.length" class="faint small">{{ t('debug.noLog') }}</div>
  </Section>

  <Section :title="t('debug.annotations')" :icon="MessageSquareDashed" :help="t('debug.annotations.hint')" collapsible :open="false">
    <div v-for="(o, i) in orphans" :key="i" class="req">
      <div class="row xs"><span class="badge neutral">#{{ o.mesId }}</span><span class="grow muted">“{{ o.quote }}”</span></div>
      <div class="small">{{ o.comment }}</div>
    </div>
    <div v-if="!orphans.length" class="faint small">{{ t('debug.noOrphans') }}</div>
  </Section>

  <div class="xs faint mono build">Advanced Preset {{ version }} · {{ build }}</div>
</template>
