/**
 * Region assembly at CHAT_COMPLETION_PROMPT_READY (§9.2–9.4): detect Carrier anchors, build the
 * condition variables and macro data, render regions with the shared protocol assembler, apply ST
 * macros, and shape the message list for the transport (prefill merge).
 */
import {
  INSTALL_NOTICE_MARK,
  MAIN_STORYLINE_VARS, freezeMode, actorName, assemble, defaultVars, formatVar, replyToPlainText, statusText, storylineSeparator, withUserModules, activeUserModules,
  activeStages, layoutOf, phaseGroups, planPhases, resolverOf,
  type APreset, type Assembly, type Configuration, type MacroData, type Phase, type StatusBar, type Stage, type StorylineVars, type Vars, type Workflow,
} from '@advanced-preset/protocol';
import { bindingForActor, multiModelOn, selectedBinding, type ResolvedBinding } from './bindings';
import { st, toast, type ChatMessage, type STMessage } from '@/st/host';
import { t } from '@/i18n';
import { getPreset } from '@/store/presets';
import { activeConfiguration, presetState } from '@/store/config';
import { activeCarrierPresetId } from '@/store/carrier';
import { chatMemory, currentRecap, globalMemory } from '@/store/eventlog';
import { getSidecar } from '@/store/sidecar';
import { settings } from '@/store/settings';
import { keywordTexts, userModuleGroups, userModules } from '@/store/user-modules';
import { classify, metaEnabled, metaTrigger, pickWorkflow } from './classify';
import { newGenId, registry, type GenerationContext } from './context';
import { alignHistory, annotationHistory, historyEchoes, rewriteHistory, speechHistory, synopsisOptions, type HistoryItem } from './history';
import { debugLog } from './debug';
import { markerOf, messageKey, stickyRewrite } from './cache';
import { applySticky, stripMarkers, type CacheReport } from './sticky';
import { cacheState, currentChatKey, storylineCacheKey } from '@/store/cache-state';
import { storylineMeta, storylinesOn } from '@/store/storylines';
import { arrangeTurn, inBackground, placeLines, planTurn, takeLineMarks, type StorylineTurn } from './storylines';
import { INPUT_SLOT, applyInput, locateInput, markInput, stripInputMarks } from './input-shaping';
import { imageRuntime, speechRuntime } from './media-vars';

export const ANCHOR_RE = /⟦ap:region:([\w.-]+)⟧/g;

const textOf = (c: ChatMessage['content']): string =>
  typeof c === 'string' ? c : Array.isArray(c) ? c.map((p: any) => (typeof p === 'string' ? p : p?.text ?? '')).join('') : '';

/** Split messages so that every anchor is its own message (handles squashed system prompts). */
function isolateAnchors(chat: ChatMessage[]): (ChatMessage & { __anchor?: string })[] {
  const out: (ChatMessage & { __anchor?: string })[] = [];
  for (const m of chat) {
    const text = typeof m.content === 'string' ? m.content : '';
    if (!text.includes('⟦ap:region:')) { out.push(m); continue; }
    let at = 0;
    for (const hit of text.matchAll(ANCHOR_RE)) {
      const before = text.slice(at, hit.index).trim();
      if (before) out.push({ ...m, content: before });
      out.push({ role: m.role, content: '', __anchor: hit[1] });
      at = hit.index! + hit[0].length;
    }
    const after = text.slice(at).trim();
    if (after) out.push({ ...m, content: after });
  }
  return out;
}

function recentMeta(preset: APreset, ctxConfig: ReturnType<typeof activeConfiguration>, chat: readonly STMessage[]): string {
  if (!metaEnabled(ctxConfig)) return '';
  const replyId = Object.values(preset.structures).find((s) => s.kind === 'reply')?.id;
  const lines: string[] = [];
  const user = actorName(preset, ctxConfig, preset.user);
  const narrator = actorName(preset, ctxConfig, preset.narrator);
  for (let i = chat.length - 1; i >= 0 && lines.length < ctxConfig.meta.recentCount; i--) {
    const sc = getSidecar(chat[i]);
    if (!sc?.metaInput?.length) continue;
    const reply = replyId ? sc.structures?.[replyId] : undefined;
    const answer = typeof reply === 'string' ? replyToPlainText(reply) : '';
    lines.push(`${user}: ${sc.metaInput.join('\n')}${answer ? `\n${narrator}: ${answer}` : ''}`);
  }
  return st().substituteParams(lines.reverse().join('\n\n'));
}

function customLast(preset: APreset, chat: readonly STMessage[]): Record<string, string> {
  const out: Record<string, string> = {};
  // `{{ap::structure::<id>::last}}`: custom structures and the status bar (I-136).
  const custom = Object.values(preset.structures).filter((s) => s.kind === 'custom' || s.kind === 'status');
  if (!custom.length) return out;
  for (const m of chat) {
    const sc = getSidecar(m);
    for (const s of custom) {
      const v = sc?.structures?.[s.id];
      if (v === undefined || v === null || v === '') continue;
      if (s.kind === 'status') { const t = typeof v === 'string' ? v : statusText(v as StatusBar); if (t) out[s.id] = t; continue; }
      out[s.id] = typeof v === 'string' ? v : JSON.stringify(v, null, 2);
    }
  }
  return out;
}

/** What the condition variables of a request depend on (the interceptor has it before the context exists). */
export type VarsSource = Pick<GenerationContext, 'preset' | 'config' | 'transport' | 'origin' | 'stType' | 'meta' | 'flags' | 'inputShaped' | 'storylines' | 'multiModel'>;

/** Multi-model applies to story turns of presets that declare it, when the configuration switches it on. */
export const multiModelTurn = (preset: APreset, config: Configuration, origin: GenerationContext['origin']): boolean =>
  origin === 'story' && multiModelOn(preset, config);

/**
 * Binding of the turn's first request: the selected binding, or with multi-model the binding of the
 * actor of the first active stage (its transport decides the variables of the first assembly).
 */
export function firstBinding(src: Omit<VarsSource, 'transport' | 'multiModel'>, multiModel: boolean): ResolvedBinding {
  const selected = selectedBinding(src.config);
  if (!multiModel) return selected;
  const workflow = pickWorkflow(src.preset, src.config, src.origin);
  if (!workflow) return selected;
  const { vars } = buildVarsAndData({ ...src, transport: selected.transport, multiModel }, workflow);
  const actor = activeStages(workflow, resolverOf(vars))[0]?.actor;
  return actor ? bindingForActor(src.preset, src.config, actor) : selected;
}

/** Chat indices the current storyline sees, in its order (I-153); `undefined`: the whole chat. */
export const storylineViewOf = (turn: StorylineTurn | undefined): number[] | undefined => turn?.view;

export function buildVarsAndData(ctx: VarsSource, workflow: Workflow | undefined): { vars: Vars; data: MacroData } {
  const { preset, config } = ctx;
  // Structures, memory and recap as the current storyline sees the chat: arranged like its history.
  const view = storylineViewOf(ctx.storylines);
  const all = st().chat;
  const chat = view ? view.map((i) => all[i]!) : all;
  const last = customLast(preset, chat);
  const mem = chatMemory(Infinity, view);
  const gmem = globalMemory(presetState(preset));
  const recap = currentRecap(Infinity, view);
  const recent = recentMeta(preset, config, chat);
  // Without a storyline turn (preview, storylines off) the main storyline.
  const mainName = storylinesOn(preset, config) ? storylineMeta().main ?? '' : '';
  const transport = ctx.transport;
  // Media (I-170): only story turns of presets that declare the feature; values come from the settings layer.
  const story = ctx.origin === 'story';
  const image = story ? imageRuntime(preset) : imageRuntime({});
  const speech = story ? speechRuntime(preset) : speechRuntime({});
  const vars = defaultVars(preset, config, {
    transport,
    style: preset.styles[transport],
    workflow: workflow?.id ?? '',
    gen: { origin: ctx.origin, type: ctx.stType, callerTools: false, callerSchema: false },
    meta: { present: ctx.meta.present, pure: ctx.meta.pure, mixed: ctx.meta.mixed, task: ctx.meta.task, recent: Boolean(recent) },
    flags: { ...Object.fromEntries(preset.regex.map((r) => [r.id, false])), ...ctx.flags },
    chat: { group: Boolean(st().groupId) },
    memory: { hasChat: Object.keys(mem).length > 0, hasGlobal: Object.keys(gmem).length > 0 },
    recap: { present: Boolean(recap) },
    input: { shaped: Boolean(ctx.inputShaped) },
    last: Object.fromEntries(Object.values(preset.structures).filter((x) => x.kind === 'custom' || x.kind === 'status').map((x) => [x.id, x.id in last])),
    storyline: ctx.storylines?.vars ?? { ...MAIN_STORYLINE_VARS, name: mainName },
    image: image.vars,
    speech: speech.vars,
    multiModel: Boolean(ctx.multiModel),
  });
  const data: MacroData = {
    metaText: ctx.meta.segments.join('\n\n'),
    memory: { chat: mem, global: gmem },
    recap: recap?.text ?? '',
    recentMeta: recent,
    customLast: last,
    // The text is only known once the history is final: a slot, filled in after the cache step.
    inputText: ctx.inputShaped ? INPUT_SLOT : '',
    storyline: { name: ctx.storylines?.vars.name ?? mainName, main: ctx.storylines?.mainName ?? mainName },
    image: { refs: image.refs },
    speech: { format: speech.format, characters: speech.characters },
  };
  return { vars, data };
}

/** Script path (§9.2): rewrite history messages found between the semantic anchors. */
function backfill(ctx: GenerationContext, list: (ChatMessage & { __anchor?: string })[], marks: WeakMap<object, number>): void {
  const { preset, config } = ctx;
  const start = list.findIndex((m) => m.__anchor === preset.anchors.historyStart);
  const end = list.findIndex((m) => m.__anchor === preset.anchors.historyEnd);
  if (start < 0 || end < 0 || end <= start) { ctx.warnings.push('backfill: semantic anchors missing'); return; }
  const H = list.slice(start + 1, end).map((m, i) => ({ m, i: start + 1 + i })).filter(({ m }) => m.role === 'user' || m.role === 'assistant');
  const chat = st().chat;
  const C = chat.map((m, index) => ({ m, index })).filter(({ m }) => !m.is_system);
  const { map, rate } = alignHistory(H.map(({ m }) => ({ role: m.role, text: textOf(m.content) })), C.map(({ m }) => ({ role: m.is_user ? 'user' : 'assistant', text: m.mes })));
  if (rate < 0.9) { ctx.warnings.push(`backfill: alignment ${Math.round(rate * 100)}% < 90%, history left as is`); return; }
  let items: (HistoryItem & { __h: number })[] = [];
  map.forEach((ci, hi) => {
    if (ci < 0) return;
    const real = C[ci]!;
    items.push({ is_user: real.m.is_user, mes: textOf(H[hi]!.m.content), extra: real.m.extra, name: real.m.name, send_date: real.m.send_date, __h: hi });
  });
  let real = items.map((it) => C[map[it.__h]!]!.index);
  // Storylines: arranged for the storyline of the last message, like the interceptor does (I-151).
  let groupOf: number[] = [];
  if (storylinesOn(preset, config)) {
    const a = arrangeTurn(items, real, planTurn(chat, -1, storylineMeta()), -1, freezeMode(config.storylines));
    items = a.items;
    real = a.realIndex;
    groupOf = a.groups;
    ctx.storylines = a.turn;
  }
  const turn = ctx.storylines;
  const early = buildVarsAndData(ctx, pickWorkflow(preset, config, ctx.origin)).vars;
  const options = {
    trigger: metaTrigger(preset, config),
    wrap: preset.meta.wrap,
    tokenSaving: config.tokenSaving,
    ...synopsisOptions(preset),
    echoes: historyEchoes(preset, config, early, pickWorkflow(preset, config, 'story')),
    recap: currentRecap(Infinity, storylineViewOf(turn)),
    realIndex: (i: number) => real[i] ?? -1,
    currentInput: -1,
    annotations: annotationHistory(preset, config),
    speech: speechHistory(preset, config, early),
    ...(turn ? { background: (i: number) => inBackground(turn, groupOf[i]) } : {}),
  };
  const keep = new Map<number, string>();
  /** Renderings of each kept history item (input shaping looks for one of them). */
  const renderings = new Map<number, string[]>();
  if (config.cache?.enabled) {
    // Cache optimization: the marked sticky text, resolved below like the interceptor's.
    const chatKey = storylineCacheKey(currentChatKey(), turn?.current);
    const rw = stickyRewrite(items, options, cacheState(chatKey)?.modes, (i) => messageKey(items[i]!, real[i] ?? i));
    for (const r of rw.out) {
      const h = items[r.index]!.__h;
      keep.set(h, r.entry === undefined ? r.item.mes : r.item.mes + markerOf(r.entry));
      const e = r.entry === undefined ? undefined : rw.entries[r.entry];
      renderings.set(h, e ? [e.given, e.sticky, e.fresh].filter((x): x is string => typeof x === 'string') : [r.item.mes]);
    }
    ctx.sticky = { chat: chatKey, entries: rw.entries, omitted: rw.omitted };
  } else {
    for (const r of rewriteHistory(items, options) as (HistoryItem & { __h: number })[]) { keep.set(r.__h, r.mes); renderings.set(r.__h, [r.mes]); }
  }
  // Input shaping (I-129): the chat ends with a user message that is the last user message handed over.
  if (preset.inputShaping && C.length && C[C.length - 1]!.m.is_user) {
    const hi = map.indexOf(C.length - 1);
    const texts = renderings.get(hi);
    if (hi >= 0 && keep.has(hi) && texts?.some((x) => x.trim()) && !H.slice(hi + 1).some(({ m }) => m.role === 'user')) {
      keep.set(hi, markInput(keep.get(hi)!));
      ctx.input = { texts };
    }
  }
  const removed = new Set<number>();
  // Messages of if-lines this storyline does not see are not among the arranged items.
  const arranged = new Set(items.map((it) => it.__h));
  map.forEach((ci, hi) => { if (ci >= 0 && !arranged.has(hi)) removed.add(H[hi]!.i); });
  items.forEach((it, k) => {
    const target = H[it.__h]!;
    if (!keep.has(it.__h)) removed.add(target.i);
    else {
      target.m.content = keep.get(it.__h)!;
      if (turn?.grouped && groupOf[k] !== undefined) marks.set(target.m, groupOf[k]!);
    }
  });
  for (const i of [...removed].sort((a, b) => b - a)) list.splice(i, 1);
}

/** Created per PROMPT_READY: the native context (interceptor) or a task context (script path). */
function contextFor(preset: APreset, dryRun: boolean): GenerationContext {
  const pending = dryRun ? null : registry.takePending();
  if (pending && pending.preset.id === preset.id) return pending;
  const config = activeConfiguration(preset);
  // No interceptor: script / extension call (TH generate, …) ⇒ task (D17). dryRun previews a story turn.
  const chat = st().chat;
  const lastUserIndex = chat.findLastIndex((m) => m.is_user && !m.is_system);
  const lastUser = chat[lastUserIndex];
  const { meta, flags, origin } = classify(preset, config, dryRun ? lastUser?.mes ?? '' : '', dryRun ? 'normal' : 'script', dryRun, [], !dryRun);
  const stType = dryRun ? 'normal' : 'script';
  const multiModel = multiModelTurn(preset, config, origin);
  const binding = firstBinding({ preset, config, origin, stType, meta, flags }, multiModel);
  return {
    id: newGenId(), preset, config, origin, stType, interceptorRan: false, dryRun,
    meta, flags, transport: binding.transport, stages: [], structures: [], inputIndex: -1, createdAt: Date.now(), warnings: [],
    keywords: keywordTexts(chat, dryRun ? lastUserIndex : -1),
    ...(multiModel ? { multiModel } : {}),
    ...(binding.target.type !== 'current' ? { firstTarget: binding.target } : {}),
  };
}

const AP_MESSAGE = Symbol('ap-region');
/** Region id of a message rendered from a region (re-rendered for later phases). */
export const AP_REGION = Symbol('ap-region-id');

/** Rendered messages of a region (empty ones left out), marked as AP's. */
function regionMessages(assembly: Assembly, id: string, sub: (s: string) => string): ChatMessage[] {
  return (assembly.regions[id] ?? []).map((r) => {
    const msg: ChatMessage = { role: r.role, content: sub(r.content) };
    Object.defineProperty(msg, AP_MESSAGE, { value: true });
    Object.defineProperty(msg, AP_REGION, { value: id });
    return msg;
  }).filter((x) => textOf(x.content).trim());
}

/** Stage regions (`beforeStage`) of the given stages, in stage order. */
export function stageRegionMessages(ctx: GenerationContext, assembly: Assembly, stages: Stage[], sub: (s: string) => string): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const s of stages) for (const r of ctx.preset.regions) if (r.beforeStage === s.id) out.push(...regionMessages(assembly, r.id, sub));
  return out;
}

/** Messages with the stage regions at the tail; a trailing assistant prefill stays last. */
export function withStageMessages(messages: ChatMessage[], tail: ChatMessage[], prefill: boolean): ChatMessage[] {
  if (!tail.length) return messages;
  const last = messages[messages.length - 1];
  if (prefill && last?.role === 'assistant') return [...messages.slice(0, -1), ...tail, last];
  return [...messages, ...tail];
}

/**
 * Re-renders the first request's prompt (after the cache step and input shaping) with another
 * assembly: every region is rendered again in place, everything else (history, ST prompts) is kept.
 * A region that rendered nothing goes after the message that preceded its anchor (or the closest
 * one still in the prompt).
 */
function rerenderer(ctx: GenerationContext, final: ChatMessage[], emptySlots: { id: string; before: ChatMessage[] }[], sub: (s: string) => string): NonNullable<GenerationContext['rerender']> {
  const base = final.slice();
  const present = new Set<ChatMessage>(base);
  const slotsAfter = new Map<ChatMessage | null, string[]>();
  for (const slot of emptySlots) {
    let at: ChatMessage | null = null;
    for (let i = slot.before.length - 1; i >= 0; i--) if (present.has(slot.before[i]!)) { at = slot.before[i]!; break; }
    slotsAfter.set(at, [...(slotsAfter.get(at) ?? []), slot.id]);
  }
  return (assembly) => {
    const fill = ctx.fillInput ?? ((s: string) => s);
    const messages: ChatMessage[] = [];
    const done = new Set<string>();
    let historyAt = -1;
    const render = (id: string) => {
      if (done.has(id)) return;
      done.add(id);
      messages.push(...regionMessages(assembly, id, (s) => fill(sub(s))));
      if (id === ctx.preset.anchors.historyStart) historyAt = messages.length;
    };
    for (const id of slotsAfter.get(null) ?? []) render(id);
    for (const m of base) {
      const id = (m as any)[AP_REGION] as string | undefined;
      if (id) render(id);
      else messages.push(m);
      for (const s of slotsAfter.get(m) ?? []) render(s);
    }
    return { messages, historyAt };
  };
}

/** History messages of the isolated list: between the semantic anchors (the whole list without them). */
function historyRange(preset: APreset, list: (ChatMessage & { __anchor?: string })[]): { from: number; to: number } {
  const start = list.findIndex((m) => m.__anchor === preset.anchors.historyStart);
  const end = list.findIndex((m) => m.__anchor === preset.anchors.historyEnd);
  return { from: start < 0 ? 0 : start + 1, to: end < 0 || end <= start ? list.length : end };
}

/**
 * Input shaping on the final list (after the cache step, which may swap the input's rendering):
 * wraps / takes out the input and fills the `{{ap::input::text}}` slots. Removes every input mark.
 */
function shapeInput(ctx: GenerationContext, final: ChatMessage[], from: number, to: number, snapshot: AssemblySnapshot): AssemblySnapshot['input'] {
  const shaping = ctx.preset.inputShaping;
  const loc = shaping && ctx.inputShaped && ctx.input ? locateInput(final, from < 0 ? 0 : from, to, ctx.input.texts) : null;
  stripInputMarks(final);
  if (!shaping) return undefined;
  const text = loc?.text ?? '';
  if (ctx.inputShaped && !loc) ctx.warnings.push('input shaping: the input message changed after the cache step, sent as is');
  const hasSlot = (m: ChatMessage) => (typeof m.content === 'string' ? m.content.includes(INPUT_SLOT) : Array.isArray(m.content) && (m.content as any[]).some((p) => typeof p?.text === 'string' && p.text.includes(INPUT_SLOT)));
  // extract: only take the input out when something puts it back, so it is never lost.
  const placed = shaping.mode !== 'extract' || final.some(hasSlot);
  if (loc && !placed) ctx.warnings.push('input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history');
  if (loc && placed) {
    const assembly = ctx.assembly;
    applyInput(final, loc, shaping, (s) => st().substituteParams(assembly ? assembly.expand(s) : s));
  }
  if (ctx.inputShaped) {
    const fill = (s: string) => (s.includes(INPUT_SLOT) ? s.replaceAll(INPUT_SLOT, () => text) : s);
    ctx.fillInput = fill;
    for (const m of final) {
      if (typeof m.content === 'string') m.content = fill(m.content);
      else if (Array.isArray(m.content)) for (const p of m.content as any[]) if (p && typeof p === 'object' && typeof p.text === 'string') p.text = fill(p.text);
    }
    for (const r of snapshot.regions) for (const m of r.messages) if (m.content.includes(INPUT_SLOT)) { m.content = fill(m.content); m.chars = m.content.length; }
    const assembly = ctx.assembly;
    if (assembly) { const expand = assembly.expand; assembly.expand = (s) => fill(expand(s)); }
  }
  return { mode: shaping.mode, shaped: Boolean(loc && placed), chars: text.length };
}

/**
 * Storylines (I-146): history grouped by storyline with a separator before each group; injections
 * placed relative to the main storyline. Returns the new end of the history.
 */
function arrangeHistory(ctx: GenerationContext, turn: StorylineTurn, final: ChatMessage[], from: number, to: number): number {
  const decl = ctx.preset.storylines;
  const assembly = ctx.assembly;
  const expand = (s: string) => st().substituteParams(assembly ? assembly.expand(s) : s);
  const sendIfEmpty = String(st().chatCompletionSettings?.send_if_empty ?? '').trim();
  const lastInRange = final[to - 1];
  const groupChat = Boolean(st().groupId);
  return placeLines(final, from, to, {
    groupOf: (m) => turn.marks?.get(m) ?? -1,
    current: turn.currentGroup,
    main: turn.mainGroup,
    separator: (g) => {
      const group = turn.groups[g];
      if (!decl || !group) return null;
      // A storyline the AI names this turn (or the unnamed previous main storyline of a switch): `?`.
      const content = storylineSeparator(group.main ? decl.mainSeparator : decl.separator, group.name || (group.main ? '' : '?'), expand);
      if (!content.trim()) return null;
      const msg: ChatMessage = { role: 'system', content };
      Object.defineProperty(msg, AP_MESSAGE, { value: true });
      return msg;
    },
    // ST's empty-message replacement and the group nudge come after the history.
    isNudge: (m) => (m.role === 'user' && sendIfEmpty !== '' && textOf(m.content).trim() === sendIfEmpty) || (groupChat && m.role === 'system' && m === lastInRange),
  });
}

export function renderPrefill(ctx: GenerationContext, list: ChatMessage[], historyAt: number): ChatMessage[] {
  const { preset, config } = ctx;
  const sub = (s: string) => st().substituteParams(s);
  const system = list.slice(0, historyAt).map((m) => textOf(m.content)).filter(Boolean).join('\n\n');
  const rawPrefix = config.identity.prefixes[preset.user] || preset.actors[preset.user]?.prefix || `${actorName(preset, config, preset.user)}: `;
  const userPrefix = sub(ctx.assembly ? ctx.assembly.expand(rawPrefix) : rawPrefix);
  const items = list.slice(historyAt).map((m) => {
    const content = textOf(m.content);
    if ((m as any)[AP_MESSAGE] || m.role === 'system') return content;
    const name = m.role === 'user' ? st().name1 : (typeof m.name === 'string' && m.name) || st().name2;
    const prefix = m.role === 'user' ? userPrefix : `${name}: `;
    return preset.historyItemTemplate.replaceAll('{{prefix}}', prefix).replaceAll('{{name}}', name).replaceAll('{{content}}', content);
  }).filter(Boolean);
  const out: ChatMessage[] = [];
  if (system) out.push({ role: 'system', content: system });
  out.push({ role: 'user', content: sub(preset.prefillGuide || '<START>') });
  out.push({ role: 'assistant', content: items.join('\n\n').trimEnd() });
  return out;
}

export interface AssemblySnapshot {
  genId: string;
  at: number;
  dryRun: boolean;
  origin: string;
  transport: string;
  workflow: string;
  modules: string[];
  /** Build variables as the prompts read them in full (before macro expansion). */
  vars: { id: string; text: string }[];
  regions: { id: string; messages: { role: string; chars: number; content: string }[] }[];
  /** Cache optimization (sticky rendering) of this request. */
  cache?: CacheReport | null;
  /** Input shaping of this request (presets that declare it). */
  input?: { mode: string; shaped: boolean; chars: number };
  /** Storylines of this request (presets that declare them): the current storyline and the history groups. */
  storyline?: StorylineVars & { groups: string[]; hidden: number };
  warnings: string[];
}
export let lastSnapshot: AssemblySnapshot | null = null;

/** Template errors (I-109): kept in the assembly warnings (debug tab), logged, and toasted once per message. */
const toasted = new Set<string>();
function reportTemplateWarnings(found: string[], into: string[]): void {
  for (const w of found) {
    into.push(w);
    console.warn('[AP]', w);
    if (toasted.has(w)) continue;
    toasted.add(w);
    toast('warning', t('warn.template', { error: w }), t('app.name'));
  }
}

/**
 * The install notice of a preset file (I-170) asks the model to help install AP: with AP running it
 * is never sent, even while such a file is selected before AP has taken it over.
 */
export function dropInstallNotice(chat: ChatMessage[]): void {
  const notice = (m: ChatMessage) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content ?? '')).includes(INSTALL_NOTICE_MARK);
  for (let i = chat.length - 1; i >= 0; i--) if (notice(chat[i]!)) chat.splice(i, 1);
}

export async function onPromptReady(event: { chat: ChatMessage[]; dryRun: boolean }): Promise<void> {
  const { chat, dryRun } = event;
  dropInstallNotice(chat);
  if (!settings().enabled || !chat.some((m) => typeof m.content === 'string' && m.content.includes('⟦ap:region:'))) {
    stripMarkers(chat);
    stripInputMarks(chat);
    takeLineMarks(chat);
    if (!dryRun) { registry.setPending(null); registry.takeArmed(); }
    return;
  }
  const presetId = activeCarrierPresetId();
  const preset = presetId ? getPreset(presetId) : undefined;
  if (!preset) {
    // Anchors without a known preset: strip them so they never reach the model.
    const cleaned = isolateAnchors(chat).filter((m) => !m.__anchor);
    stripMarkers(cleaned);
    stripInputMarks(cleaned);
    takeLineMarks(cleaned);
    chat.splice(0, chat.length, ...cleaned);
    return;
  }
  const ctx = contextFor(preset, dryRun);
  const list = isolateAnchors(chat);
  // Storyline groups of the history messages (interceptor marks; the backfill records its own).
  const marks = takeLineMarks(list);
  if (!ctx.interceptorRan && !dryRun) backfill(ctx, list, marks);
  if (ctx.storylines) ctx.storylines.marks = marks;

  // continue / impersonate keep ST's native flow: regions are assembled, no workflow, no takeover.
  const passthrough = ctx.stType === 'continue' || ctx.stType === 'impersonate';
  const workflow = passthrough ? undefined : pickWorkflow(preset, ctx.config, ctx.origin);
  // Input shaping (I-130): is the marked input among the history messages? (decides `input.shaped`)
  const shaping = preset.inputShaping;
  const range = historyRange(preset, list);
  const located = shaping && ctx.input ? locateInput(list, range.from, range.to, ctx.input.texts) : null;
  if (shaping && ctx.input && !located) ctx.warnings.push('input shaping: the input message was not found in the history, sent as is');
  ctx.inputShaped = Boolean(located);
  const { vars, data } = buildVarsAndData(ctx, workflow);
  const merged = withUserModules(preset, activeUserModules(userModules(preset), userModuleGroups(preset)), ctx.keywords);
  for (const x of merged.skipped) ctx.warnings.push(`user module ${x.module}: insertion point \`${x.point}\` is missing, entry ${x.entry} skipped`);
  // Multi-model (story turns): the first request executes the first phase; its variables say so.
  const multi = Boolean(ctx.multiModel && workflow);
  const firstGroup = multi ? phaseGroups(activeStages(workflow!, resolverOf(vars)), true)[0] : undefined;
  const assemblyInput = { preset: merged.preset, config: ctx.config, vars, data };
  const assembly = assemble({ ...assemblyInput, ...(firstGroup ? { phase: { stages: firstGroup.stages.map((s) => s.id), index: 0, actor: firstGroup.actor } } : {}) }, workflow);
  if (assembly.warnings.length) reportTemplateWarnings(assembly.warnings, ctx.warnings);
  ctx.workflow = workflow;
  ctx.assembly = assembly;
  ctx.stages = assembly.stages;
  ctx.structures = ctx.origin === 'task' && ctx.stType === 'script' ? [] : assembly.structures;
  ctx.phases = planPhases(ctx.stages, ctx.structures, multi ? layoutOf(preset, workflow, ctx.stages, ctx.structures) : undefined, multi, workflow);
  if (multi) {
    ctx.phaseAssembly = (phase, transport) => {
      const a = assemble({ ...assemblyInput, vars: { ...vars, transport, style: preset.styles[transport] }, phase: { stages: phase.stages.map((s) => s.id), index: phase.index, actor: phase.actor } }, workflow);
      if (a.warnings.length) reportTemplateWarnings(a.warnings, ctx.warnings);
      const fill = ctx.fillInput;
      if (fill) { const expand = a.expand; a.expand = (s) => fill(expand(s)); }
      return a;
    };
  }

  const sub = (s: string) => st().substituteParams(s);
  const final: ChatMessage[] = [];
  let historyAt = -1;
  let historyEnd = -1;
  const snapshot: AssemblySnapshot = {
    genId: ctx.id, at: Date.now(), dryRun, origin: ctx.origin, transport: ctx.transport, workflow: workflow?.id ?? '',
    modules: assembly.modules.map((m) => m.id), regions: [], warnings: ctx.warnings,
    vars: Object.entries(assembly.buildVars).map(([id, v]) => ({ id, text: formatVar(v) })),
  };
  /** Anchors rendering nothing, with the messages before them (where a later phase puts its content). */
  const emptySlots: { id: string; before: ChatMessage[] }[] = [];
  for (const m of list) {
    if (!m.__anchor) { final.push(m); continue; }
    const id = m.__anchor;
    if (id === preset.anchors.historyEnd && historyEnd < 0) historyEnd = final.length;
    const msgs = regionMessages(assembly, id, sub);
    snapshot.regions.push({ id, messages: msgs.map((x) => ({ role: x.role, chars: textOf(x.content).length, content: textOf(x.content) })) });
    if (!msgs.length) emptySlots.push({ id, before: final.slice() });
    final.push(...msgs);
    if (id === preset.anchors.historyStart) historyAt = final.length;
  }

  // Regions with output whose anchor is not in ST's prompt (outdated Carrier, prompt switched off …).
  const anchored = new Set(list.map((m) => m.__anchor).filter(Boolean));
  const stageRegions = new Set(preset.regions.filter((r) => r.beforeStage).map((r) => r.id));
  for (const [id, msgs] of Object.entries(assembly.regions)) {
    if (!anchored.has(id) && !stageRegions.has(id) && msgs.some((r) => r.content.trim())) ctx.warnings.push(`region ${id}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
  }

  let end = historyEnd < 0 ? final.length : historyEnd;
  const turn = ctx.storylines;
  if (turn) {
    snapshot.storyline = { ...turn.vars, groups: turn.groups.map((g) => (g.main ? `(main) ${g.name}` : `${g.if ? '(if) ' : ''}${g.hidden ? '(hidden) ' : ''}${g.name || '?'}`)), hidden: turn.hidden, grouped: turn.grouped };
    if (turn.grouped && historyAt >= 0) end = arrangeHistory(ctx, turn, final, historyAt, end);
  }
  snapshot.cache = applySticky(ctx, final, historyAt, end);
  snapshot.input = shapeInput(ctx, final, historyAt, end, snapshot);
  if (multi) ctx.rerender = rerenderer(ctx, final, emptySlots, sub);

  const prefill = ctx.transport === 'prefill' && !passthrough && historyAt >= 0;
  let shaped = prefill ? renderPrefill(ctx, final, historyAt) : final;
  // Stage regions of the stages this request executes: at the tail (before a trailing prefill).
  if (!passthrough && workflow) {
    const phase = ctx.phases[0]!;
    const tail = stageRegionMessages(ctx, assembly, phase.stages, (s) => (ctx.fillInput ? ctx.fillInput(sub(s)) : sub(s)));
    for (const r of preset.regions) {
      if (!r.beforeStage || !phase.stages.some((s) => s.id === r.beforeStage)) continue;
      const msgs = tail.filter((m) => (m as any)[AP_REGION] === r.id);
      snapshot.regions.push({ id: r.id, messages: msgs.map((x) => ({ role: x.role, chars: textOf(x.content).length, content: textOf(x.content) })) });
    }
    shaped = withStageMessages(shaped, tail, prefill);
  }
  chat.splice(0, chat.length, ...shaped.map((m) => {
    const { __anchor, ...rest } = m as ChatMessage & { __anchor?: string };
    void __anchor;
    return rest as ChatMessage;
  }));

  lastSnapshot = snapshot;
  debugLog('assembly', snapshot);
  if (!dryRun && !passthrough && workflow) registry.arm(ctx);
}
