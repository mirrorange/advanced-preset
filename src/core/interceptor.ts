/**
 * `generate_interceptor` (manifest): runs for native `Generate` before prompt building. Classifies
 * the turn, rewrites the history copy (§9.1) and leaves a pending GenerationContext for PROMPT_READY.
 */
import { getPreset } from '@/store/presets';
import { activeConfiguration } from '@/store/config';
import { activeCarrierPresetId } from '@/store/carrier';
import { currentRecap } from '@/store/eventlog';
import { settings } from '@/store/settings';
import { st, toast, type STMessage } from '@/st/host';
import { t } from '@/i18n';
import { classify, metaTrigger, pickWorkflow } from './classify';
import { newGenId, registry, type GenerationContext } from './context';
import { annotationHistory, historyEchoes, rewriteHistoryIndexed, synopsisOptions } from './history';
import { buildVarsAndData, storylineViewOf } from './assembler';
import { keywordTexts } from '@/store/user-modules';
import { detachRegeneratingSidecar } from '@/store/sidecar';
import { cacheState, currentChatKey, storylineCacheKey } from '@/store/cache-state';
import { rewriteInputTag, storylineMeta, storylinesOn } from '@/store/storylines';
import { arrangeTurn, inBackground, lineMark, planTurn, type StorylineTurn } from './storylines';
import { markerOf, messageKey, stickyRewrite } from './cache';
import { markInput } from './input-shaping';
import { beginTurn } from '@/app/variable-guard';

export async function advancedPresetInterceptor(chat: STMessage[], _contextSize: number, _abort: (immediately: boolean) => void, type?: string): Promise<void> {
  registry.setPending(null);
  if (!settings().enabled) return;
  const presetId = activeCarrierPresetId();
  const preset = presetId ? getPreset(presetId) : undefined;
  if (!preset) return;
  const config = activeConfiguration(preset);
  const stType = type || 'normal';
  // Backup for swipes that did not go through MESSAGE_SWIPED: the regenerated turn's memory must not count.
  if (stType === 'swipe') detachRegeneratingSidecar(st().chat.length - 1);

  let last = chat.length - 1;
  let currentInput = stType !== 'continue' && chat[last]?.is_user ? last : -1;

  // Map copy indices back to real chat indices (coreChat is the non-system part of the chat).
  const real = st().chat;
  let realIndexOf = chat.map((m) => {
    const i = real.findIndex((r) => r.send_date === m.send_date && r.is_user === m.is_user && r.name === m.name);
    return i;
  });

  // Storylines (I-145 – I-150, I-159): the turn is planned on the real chat (a nameless `#` becomes the
  // most recent other storyline, `#?` a new one, `#!` sees the history as after the switch, which
  // happens when the reply is received); the copy is then arranged by storyline (invisible if-lines
  // left out) and loses its tags before anything reads it.
  let storylines: StorylineTurn | undefined;
  let groupOf: number[] = [];
  if (storylinesOn(preset, config)) {
    const meta = storylineMeta();
    const realInput = currentInput >= 0 ? realIndexOf[currentInput] ?? -1 : -1;
    // An input not found in the chat: planned on the copy.
    const onCopy = currentInput >= 0 && realInput < 0;
    const plan = planTurn(onCopy ? chat : real, onCopy ? currentInput : realInput, meta);
    if (plan.rewrite !== undefined && currentInput >= 0) {
      chat[currentInput] = { ...chat[currentInput]!, mes: plan.rewrite };
      if (!onCopy) rewriteInputTag(realInput, plan.rewrite);
      if (plan.noRecent) toast('info', t('storylines.noRecent'), t('app.name'));
    }
    const a = arrangeTurn(chat, onCopy ? chat.map((_, i) => i) : realIndexOf, plan, currentInput);
    chat.splice(0, chat.length, ...(a.items as STMessage[]));
    const before = realIndexOf;
    realIndexOf = onCopy ? a.realIndex.map((ci) => before[ci] ?? -1) : a.realIndex;
    if (onCopy) a.turn.input = -1;
    groupOf = a.groups;
    currentInput = a.currentInput;
    last = chat.length - 1;
    storylines = a.turn;
  }

  const input = currentInput >= 0 ? chat[currentInput]!.mes : '';
  const recentTexts = chat.slice(-6).map((m) => m.mes);
  // Scanned before the history rewrite so keyword rules see what the user actually wrote.
  const keywords = keywordTexts(chat, currentInput);
  const { meta, flags, origin } = classify(preset, config, input, stType, true, recentTexts);

  // Condition variables as far as they are known before assembly (structure history conditions, I-139).
  const transport = config.connection.transport;
  const { vars } = buildVarsAndData({ preset, config, transport, origin, stType, meta, flags, storylines }, pickWorkflow(preset, config, origin));
  const rewriteOptions = {
    trigger: metaTrigger(preset, config),
    wrap: preset.meta.wrap,
    tokenSaving: config.tokenSaving,
    ...synopsisOptions(preset),
    echoes: historyEchoes(preset, config, vars, pickWorkflow(preset, config, 'story')),
    recap: currentRecap(Infinity, storylineViewOf(storylines)),
    realIndex: (i: number) => realIndexOf[i] ?? -1,
    currentInput,
    annotations: annotationHistory(preset, config),
    continuing: stType === 'continue' && chat[last] && !chat[last]!.is_user ? last : undefined,
    ...(storylines ? { background: (i: number) => inBackground(storylines!, groupOf[i]) } : {}),
  };
  /** Storyline group mark at the start of a history message (only when the history is grouped). */
  const mark = (index: number, mes: string) => (storylines?.grouped && groupOf[index] !== undefined ? lineMark(groupOf[index]!) + mes : mes);
  // Cache optimization: hand ST the sticky rendering with a marker; PROMPT_READY picks the final one.
  let sticky: GenerationContext['sticky'];
  let out: STMessage[];
  /** Position of the current input in `out` and the renderings it may carry (input shaping). */
  let inputAt = -1;
  let inputTexts: string[] = [];
  if (config.cache?.enabled) {
    // Each storyline keeps its own state (I-150): switching storylines does not flush the other's.
    const chatKey = storylineCacheKey(currentChatKey(), storylines?.current);
    const rw = stickyRewrite(chat, rewriteOptions, cacheState(chatKey)?.modes, (i) => messageKey(chat[i]!, realIndexOf[i] ?? i));
    out = rw.out.map(({ item, entry, index }) => ({ ...item, mes: mark(index, entry === undefined ? item.mes : item.mes + markerOf(entry)) }) as STMessage);
    inputAt = currentInput >= 0 ? rw.out.findIndex((r) => r.index === currentInput) : -1;
    if (inputAt >= 0) {
      const r = rw.out[inputAt]!;
      const e = r.entry === undefined ? undefined : rw.entries[r.entry];
      inputTexts = e ? [e.given, e.sticky, e.fresh].filter((x): x is string => typeof x === 'string') : [r.item.mes];
    }
    sticky = { chat: chatKey, entries: rw.entries, omitted: rw.omitted };
  } else {
    const rw = rewriteHistoryIndexed(chat, rewriteOptions);
    out = rw.map(({ item, index }) => (storylines?.grouped ? { ...item, mes: mark(index, item.mes) } : item) as STMessage);
    inputAt = currentInput >= 0 ? rw.findIndex((r) => r.index === currentInput) : -1;
    if (inputAt >= 0) inputTexts = [rw[inputAt]!.item.mes];
  }
  // Input shaping (I-130): mark the user message the history ends with; PROMPT_READY finds it again.
  let shapingInput: GenerationContext['input'];
  if (preset.inputShaping && inputAt >= 0 && inputTexts.some((x) => x.trim())) {
    out[inputAt] = { ...out[inputAt]!, mes: markInput(out[inputAt]!.mes) };
    shapingInput = { texts: inputTexts };
  }
  chat.splice(0, chat.length, ...out);

  const ctx: GenerationContext = {
    id: newGenId(),
    preset,
    config,
    origin,
    stType,
    interceptorRan: true,
    dryRun: false,
    meta,
    flags,
    transport,
    stages: [],
    structures: [],
    inputIndex: currentInput >= 0 ? (realIndexOf[currentInput] ?? real.length - 1) : -1,
    continueFrom: stType === 'continue' ? chat[last]?.mes : undefined,
    keywords,
    sticky,
    input: shapingInput,
    storylines,
    createdAt: Date.now(),
    warnings: [],
  };
  // Variables stay as they were on other storylines (I-154).
  beginTurn({ preset, config, line: storylines?.current, from: ctx.inputIndex >= 0 ? ctx.inputIndex : real.length - 1 });
  registry.setPending(ctx);
}
