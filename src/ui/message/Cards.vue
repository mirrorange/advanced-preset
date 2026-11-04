<script setup lang="ts">
/**
 * Card areas of a message (§16.3, I-137): `bottom` below the message text, `top` between the stages
 * and the text. One card per structure; built-in kinds have a default area and sort key, presets
 * may move them (`ui.position` / `ui.order`). The top area also shows live values while streaming.
 */
import { computed } from 'vue';
import { actorName, cloneData, structureComponent, type CardPosition, type StructureComponent, type StatusBar, type StructureDecl, type Synopsis, type UserOption } from '@advanced-preset/protocol';
import { activeConfiguration } from '@/store/config';
import { live } from '@/core/live';
import type { ChatEvent } from '@/store/eventlog';
import { locale, presetName, pt } from '@/i18n';
import { customUiEnabled } from '@/store/custom-ui';
import { fillInput } from '@/app/impersonate';
import type { ComponentContext } from '../structure-component';
import { useMessageView, colorOf } from './model';
import { cardSlots } from './placement';
import { setStructure } from '../actions';
import ReplyCard from './cards/ReplyCard.vue';
import ImpersonateCard from './cards/ImpersonateCard.vue';
import OptionsCard from './cards/OptionsCard.vue';
import MemoryCard from './cards/MemoryCard.vue';
import RecapCard from './cards/RecapCard.vue';
import SynopsisCard from './cards/SynopsisCard.vue';
import StatusCard from './cards/StatusCard.vue';
import CustomCard from './cards/CustomCard.vue';
import ComponentCard from './cards/ComponentCard.vue';

const props = withDefaults(defineProps<{ mesid: number; position?: CardPosition }>(), { position: 'bottom' });
const view = useMessageView(() => props.mesid);

type Item =
  | { type: 'reply'; id: string; text: string }
  | { type: 'impersonate'; id: string; text: string }
  | { type: 'options'; id: string; options: UserOption[] }
  | { type: 'synopsis'; id: string; synopsis: Synopsis }
  | { type: 'status'; id: string; status: StatusBar }
  | { type: 'memory'; id: string; events: ChatEvent[] }
  | { type: 'recap'; id: string; text: string; coversUpTo: number }
  | { type: 'custom'; id: string; title: string; value: string | Record<string, string> }
  | { type: 'component'; id: string; component: StructureComponent; context: ComponentContext };

const data = computed(() => {
  const v = view.value;
  const preset = v?.preset;
  if (!v || !preset) return null;
  const sc = v.sidecar;
  // Live values (streaming / not yet stored) only reach the top area; the bottom waits for the stored turn.
  const liveValues = v.live && live.current?.genId === v.genId ? live.current.structures : undefined;
  const values = sc && !v.live ? sc.structures : props.position === 'top' ? liveValues : undefined;
  if (!values) return null;
  const decls: StructureDecl[] = Object.values(preset.structures);
  // Memory / recap cards come from events: shown even when the preset declares no such structure.
  for (const kind of ['memory', 'recap'] as const)
    if (!decls.some((d) => d.kind === kind)) decls.push({ id: `__${kind}`, kind, tag: kind, field: kind, formatPrompt: { tag: '', field: '' } });
  const items: Item[] = [];
  const uiOn = customUiEnabled(preset);
  const editable = Boolean(sc && !v.live);
  const snapshot = cloneData(values) as Record<string, unknown>;
  for (const { decl: d } of cardSlots(decls, props.position)) {
    const value = values[d.id];
    switch (d.kind) {
      case 'reply':
      case 'impersonate':
        if (typeof value === 'string' && value) items.push({ type: d.kind, id: d.id, text: value });
        break;
      case 'options':
        if (Array.isArray(value) && value.length) items.push({ type: 'options', id: d.id, options: value as UserOption[] });
        break;
      case 'synopsis':
        if (value && typeof value === 'object') items.push({ type: 'synopsis', id: d.id, synopsis: value as Synopsis });
        break;
      case 'status':
        if (value && typeof value === 'object' && Object.values(value).some((x) => typeof x === 'string' && x.trim())) items.push({ type: 'status', id: d.id, status: value as StatusBar });
        break;
      case 'memory': {
        const events = sc && !v.live ? sc.events.filter((e) => e.type === 'memory.replace' || e.type === 'memory.delete' || e.type === 'global.ref') : [];
        if (events.length) items.push({ type: 'memory', id: d.id, events });
        break;
      }
      case 'recap': {
        const recap = sc && !v.live ? sc.events.find((e) => e.type === 'recap.set') : undefined;
        if (recap?.type === 'recap.set') items.push({ type: 'recap', id: d.id, text: recap.text, coversUpTo: recap.coversUpTo });
        break;
      }
      case 'custom': {
        if (d.display === 'hidden' || value === undefined) break;
        const title = pt(preset, 'structures', d.id, 'title', d.title || d.id);
        const component = structureComponent(d);
        // A preset component replaces the generic card, and stays hidden until the user enables custom UI.
        if (!component) { items.push({ type: 'custom', id: d.id, title, value: value as string | Record<string, string> }); break; }
        if (!uiOn) break;
        const id = d.id;
        const mesId = props.mesid;
        items.push({
          type: 'component', id, component,
          context: {
            value: snapshot[id], structure: { id, kind: d.kind, title }, structures: snapshot,
            message: { id: mesId, streaming: v.running, editable },
            preset: { id: preset.id, name: presetName(preset), version: preset.version }, lang: locale(),
            setValue: async (next) => (editable ? setStructure(mesId, id, next) : false),
            fillInput: (text, send) => fillInput(String(text ?? ''), Boolean(send), mesId),
          },
        });
        break;
      }
    }
  }
  return {
    preset,
    editable,
    narrator: actorName(preset, activeConfiguration(preset), preset.narrator),
    color: colorOf(preset, preset.narrator),
    items,
  };
});
</script>

<template>
  <div v-if="data?.items.length" class="cards" :class="`cards-${position}`">
    <template v-for="c in data.items" :key="c.id">
      <ReplyCard v-if="c.type === 'reply'" :text="c.text" :name="data.narrator" :color="data.color" />
      <ImpersonateCard v-else-if="c.type === 'impersonate'" :text="c.text" :mesid="mesid" />
      <OptionsCard v-else-if="c.type === 'options'" :options="c.options" :mesid="mesid" />
      <SynopsisCard v-else-if="c.type === 'synopsis'" :synopsis="c.synopsis" :editable="data.editable" @save="(v) => setStructure(mesid, c.id, v)" />
      <StatusCard v-else-if="c.type === 'status'" :status="c.status" :editable="data.editable" @save="(v) => setStructure(mesid, c.id, v)" />
      <MemoryCard v-else-if="c.type === 'memory'" :events="c.events" :preset="data.preset" />
      <RecapCard v-else-if="c.type === 'recap'" :text="c.text" :covers-up-to="c.coversUpTo" />
      <CustomCard v-else-if="c.type === 'custom'" :title="c.title" :value="c.value" />
      <ComponentCard v-else-if="c.type === 'component'" :component="c.component" :context="c.context" />
    </template>
  </div>
</template>
