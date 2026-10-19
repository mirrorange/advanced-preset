/**
 * Region assembly at CHAT_COMPLETION_PROMPT_READY (§9.2–9.4): detect Carrier anchors, build the
 * condition variables and macro data, render regions with the shared protocol assembler, apply ST
 * macros, and shape the message list for the transport (prefill merge).
 */
import {
  actorName, assemble, defaultVars, replyToPlainText, withUserModules, type APreset, type MacroData, type Vars, type Workflow,
} from '@advanced-preset/protocol';
import { st, type ChatMessage } from '@/st/host';
import { getPreset } from '@/store/presets';
import { activeConfiguration, presetState } from '@/store/config';
import { activeCarrierPresetId } from '@/store/carrier';
import { chatMemory, currentRecap, globalMemory } from '@/store/eventlog';
import { getSidecar } from '@/store/sidecar';
import { settings } from '@/store/settings';
import { keywordTexts, userModules } from '@/store/user-modules';
import { classify, metaTrigger, pickWorkflow } from './classify';
import { newGenId, registry, type GenerationContext } from './context';
import { alignHistory, rewriteHistory, type HistoryItem } from './history';
import { debugLog } from './debug';

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

function recentMeta(preset: APreset, ctxConfig: ReturnType<typeof activeConfiguration>): string {
  const replyId = Object.values(preset.structures).find((s) => s.kind === 'reply')?.id;
  const chat = st().chat;
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

function customLast(preset: APreset): Record<string, string> {
  const out: Record<string, string> = {};
  const custom = Object.values(preset.structures).filter((s) => s.kind === 'custom');
  if (!custom.length) return out;
  for (const m of st().chat) {
    const sc = getSidecar(m);
    for (const s of custom) {
      const v = sc?.structures?.[s.id];
      if (v !== undefined && v !== null && v !== '') out[s.id] = typeof v === 'string' ? v : JSON.stringify(v, null, 2);
    }
  }
  return out;
}

export function buildVarsAndData(ctx: GenerationContext, workflow: Workflow | undefined): { vars: Vars; data: MacroData } {
  const { preset, config } = ctx;
  const mem = chatMemory();
  const gmem = globalMemory(presetState(preset));
  const recap = currentRecap();
  const recent = recentMeta(preset, config);
  const transport = ctx.transport;
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
  });
  const data: MacroData = {
    metaText: ctx.meta.segments.join('\n\n'),
    memory: { chat: mem, global: gmem },
    recap: recap?.text ?? '',
    recentMeta: recent,
    customLast: customLast(preset),
  };
  return { vars, data };
}

/** Script path (§9.2): rewrite history messages found between the semantic anchors. */
function backfill(ctx: GenerationContext, list: (ChatMessage & { __anchor?: string })[]): void {
  const { preset, config } = ctx;
  const start = list.findIndex((m) => m.__anchor === preset.anchors.historyStart);
  const end = list.findIndex((m) => m.__anchor === preset.anchors.historyEnd);
  if (start < 0 || end < 0 || end <= start) { ctx.warnings.push('backfill: semantic anchors missing'); return; }
  const H = list.slice(start + 1, end).map((m, i) => ({ m, i: start + 1 + i })).filter(({ m }) => m.role === 'user' || m.role === 'assistant');
  const chat = st().chat;
  const C = chat.map((m, index) => ({ m, index })).filter(({ m }) => !m.is_system);
  const { map, rate } = alignHistory(H.map(({ m }) => ({ role: m.role, text: textOf(m.content) })), C.map(({ m }) => ({ role: m.is_user ? 'user' : 'assistant', text: m.mes })));
  if (rate < 0.9) { ctx.warnings.push(`backfill: alignment ${Math.round(rate * 100)}% < 90%, history left as is`); return; }
  const items: (HistoryItem & { __h: number })[] = [];
  map.forEach((ci, hi) => {
    if (ci < 0) return;
    const real = C[ci]!;
    items.push({ is_user: real.m.is_user, mes: textOf(H[hi]!.m.content), extra: real.m.extra, name: real.m.name, __h: hi });
  });
  const real = items.map((it) => C[map[it.__h]!]!.index);
  const rewritten = rewriteHistory(items, {
    trigger: metaTrigger(preset, config),
    wrap: preset.meta.wrap,
    tokenSaving: config.tokenSaving,
    synopsisTemplate: preset.tokenSaving.synopsisTemplate,
    synopsisId: Object.values(preset.structures).find((s) => s.kind === 'synopsis')?.id,
    recap: currentRecap(),
    realIndex: (i) => real[i] ?? -1,
    currentInput: -1,
  }) as (HistoryItem & { __h: number })[];
  const keep = new Map(rewritten.map((r) => [r.__h, r.mes]));
  const removed = new Set<number>();
  items.forEach((it) => {
    const target = H[it.__h]!;
    if (!keep.has(it.__h)) removed.add(target.i);
    else target.m.content = keep.get(it.__h)!;
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
  return {
    id: newGenId(), preset, config, origin, stType: dryRun ? 'normal' : 'script', interceptorRan: false, dryRun,
    meta, flags, transport: config.connection.transport, stages: [], structures: [], inputIndex: -1, createdAt: Date.now(), warnings: [],
    keywords: keywordTexts(chat, dryRun ? lastUserIndex : -1),
  };
}

const AP_MESSAGE = Symbol('ap-region');

function renderPrefill(ctx: GenerationContext, list: ChatMessage[], historyAt: number): ChatMessage[] {
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
  regions: { id: string; messages: { role: string; chars: number; content: string }[] }[];
  warnings: string[];
}
export let lastSnapshot: AssemblySnapshot | null = null;

export async function onPromptReady(event: { chat: ChatMessage[]; dryRun: boolean }): Promise<void> {
  const { chat, dryRun } = event;
  if (!settings().enabled || !chat.some((m) => typeof m.content === 'string' && m.content.includes('⟦ap:region:'))) {
    if (!dryRun) { registry.setPending(null); registry.takeArmed(); }
    return;
  }
  const presetId = activeCarrierPresetId();
  const preset = presetId ? getPreset(presetId) : undefined;
  if (!preset) {
    // Anchors without a known preset: strip them so they never reach the model.
    const cleaned = isolateAnchors(chat).filter((m) => !m.__anchor);
    chat.splice(0, chat.length, ...cleaned);
    return;
  }
  const ctx = contextFor(preset, dryRun);
  const list = isolateAnchors(chat);
  if (!ctx.interceptorRan && !dryRun) backfill(ctx, list);

  // continue / impersonate keep ST's native flow: regions are assembled, no workflow, no takeover.
  const passthrough = ctx.stType === 'continue' || ctx.stType === 'impersonate';
  const workflow = passthrough ? undefined : pickWorkflow(preset, ctx.config, ctx.origin);
  const { vars, data } = buildVarsAndData(ctx, workflow);
  const merged = withUserModules(preset, userModules(preset), ctx.keywords);
  for (const x of merged.skipped) ctx.warnings.push(`user module ${x.module}: insertion point \`${x.point}\` is missing, entry ${x.entry} skipped`);
  const assembly = assemble({ preset: merged.preset, config: ctx.config, vars, data }, workflow);
  ctx.workflow = workflow;
  ctx.assembly = assembly;
  ctx.stages = assembly.stages;
  ctx.structures = ctx.origin === 'task' && ctx.stType === 'script' ? [] : assembly.structures;

  const sub = (s: string) => st().substituteParams(s);
  const final: ChatMessage[] = [];
  let historyAt = -1;
  const snapshot: AssemblySnapshot = {
    genId: ctx.id, at: Date.now(), dryRun, origin: ctx.origin, transport: ctx.transport, workflow: workflow?.id ?? '',
    modules: assembly.modules.map((m) => m.id), regions: [], warnings: ctx.warnings,
  };
  for (const m of list) {
    if (!m.__anchor) { final.push(m); continue; }
    const id = m.__anchor;
    const msgs = (assembly.regions[id] ?? []).map((r) => {
      const msg: ChatMessage = { role: r.role, content: sub(r.content) };
      Object.defineProperty(msg, AP_MESSAGE, { value: true });
      return msg;
    }).filter((x) => textOf(x.content).trim());
    snapshot.regions.push({ id, messages: msgs.map((x) => ({ role: x.role, chars: textOf(x.content).length, content: textOf(x.content) })) });
    final.push(...msgs);
    if (id === preset.anchors.historyStart) historyAt = final.length;
  }

  const shaped = ctx.transport === 'prefill' && !passthrough && historyAt >= 0 ? renderPrefill(ctx, final, historyAt) : final;
  chat.splice(0, chat.length, ...shaped.map((m) => {
    const { __anchor, ...rest } = m as ChatMessage & { __anchor?: string };
    void __anchor;
    return rest as ChatMessage;
  }));

  lastSnapshot = snapshot;
  debugLog('assembly', snapshot);
  if (!dryRun && !passthrough && workflow) registry.arm(ctx);
}
