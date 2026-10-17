<script setup lang="ts">
/** Card area below the message text (§16.3): one card per structure kind of the turn. */
import { computed } from 'vue';
import { actorName, type StructureDecl, type Synopsis, type UserOption } from '@advanced-preset/protocol';
import { activeConfiguration } from '@/store/config';
import { pt } from '@/i18n';
import { useMessageView, colorOf } from './model';
import ReplyCard from './cards/ReplyCard.vue';
import ImpersonateCard from './cards/ImpersonateCard.vue';
import OptionsCard from './cards/OptionsCard.vue';
import MemoryCard from './cards/MemoryCard.vue';
import RecapCard from './cards/RecapCard.vue';
import SynopsisCard from './cards/SynopsisCard.vue';
import CustomCard from './cards/CustomCard.vue';

const props = defineProps<{ mesid: number }>();
const view = useMessageView(() => props.mesid);

const data = computed(() => {
  const v = view.value;
  const sc = v?.sidecar;
  const preset = v?.preset;
  if (!sc || !preset || v.running) return null;
  const decls = Object.values(preset.structures);
  const valueOf = (kind: string) => {
    const d = decls.find((x) => x.kind === kind);
    return d ? sc.structures[d.id] : undefined;
  };
  const recap = sc.events.find((e) => e.type === 'recap.set');
  return {
    preset,
    narrator: actorName(preset, activeConfiguration(preset), preset.narrator),
    color: colorOf(preset, preset.narrator),
    reply: typeof valueOf('reply') === 'string' ? (valueOf('reply') as string) : '',
    impersonate: typeof valueOf('impersonate') === 'string' ? (valueOf('impersonate') as string) : '',
    options: Array.isArray(valueOf('options')) ? (valueOf('options') as UserOption[]) : [],
    memory: sc.events.filter((e) => e.type === 'memory.replace' || e.type === 'memory.delete' || e.type === 'global.ref'),
    recap: recap?.type === 'recap.set' ? recap : null,
    synopsis: valueOf('synopsis') && typeof valueOf('synopsis') === 'object' ? (valueOf('synopsis') as Synopsis) : null,
    custom: decls
      .filter((d): d is StructureDecl => d.kind === 'custom' && d.display !== 'hidden' && sc.structures[d.id] !== undefined)
      .map((d) => ({ id: d.id, title: pt(preset, 'structures', d.id, 'title', d.title || d.id), value: sc.structures[d.id] as string | Record<string, string> })),
  };
});
</script>

<template>
  <div v-if="data" class="cards">
    <ReplyCard v-if="data.reply" :text="data.reply" :name="data.narrator" :color="data.color" />
    <ImpersonateCard v-if="data.impersonate" :text="data.impersonate" />
    <OptionsCard v-if="data.options.length" :options="data.options" />
    <SynopsisCard v-if="data.synopsis" :synopsis="data.synopsis" />
    <MemoryCard v-if="data.memory.length" :events="data.memory" :preset="data.preset" />
    <RecapCard v-if="data.recap" :text="data.recap.text" :covers-up-to="data.recap.coversUpTo" />
    <CustomCard v-for="c in data.custom" :key="c.id" :title="c.title" :value="c.value" />
  </div>
</template>
