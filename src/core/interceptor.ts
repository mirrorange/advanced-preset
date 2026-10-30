/**
 * `generate_interceptor` (manifest): runs for native `Generate` before prompt building. Classifies
 * the turn, rewrites the history copy (§9.1) and leaves a pending GenerationContext for PROMPT_READY.
 */
import { getPreset } from '@/store/presets';
import { activeConfiguration } from '@/store/config';
import { activeCarrierPresetId } from '@/store/carrier';
import { currentRecap } from '@/store/eventlog';
import { settings } from '@/store/settings';
import { st, type STMessage } from '@/st/host';
import { classify, metaTrigger } from './classify';
import { newGenId, registry, type GenerationContext } from './context';
import { annotationHistory, rewriteHistory, synopsisOptions } from './history';
import { keywordTexts } from '@/store/user-modules';
import { detachRegeneratingSidecar } from '@/store/sidecar';
import { cacheState, currentChatKey } from '@/store/cache-state';
import { markerOf, messageKey, stickyRewrite } from './cache';
import { markInput } from './input-shaping';

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

  const last = chat.length - 1;
  const currentInput = stType !== 'continue' && chat[last]?.is_user ? last : -1;
  const input = currentInput >= 0 ? chat[currentInput]!.mes : '';
  const recentTexts = chat.slice(-6).map((m) => m.mes);
  // Scanned before the history rewrite so keyword rules see what the user actually wrote.
  const keywords = keywordTexts(chat, currentInput);
  const { meta, flags, origin } = classify(preset, config, input, stType, true, recentTexts);

  // Map copy indices back to real chat indices (coreChat is the non-system part of the chat).
  const real = st().chat;
  const realIndexOf = chat.map((m) => {
    const i = real.findIndex((r) => r.send_date === m.send_date && r.is_user === m.is_user && r.name === m.name);
    return i;
  });
  const rewriteOptions = {
    trigger: metaTrigger(preset, config),
    wrap: preset.meta.wrap,
    tokenSaving: config.tokenSaving,
    ...synopsisOptions(preset, config),
    recap: currentRecap(),
    realIndex: (i: number) => realIndexOf[i] ?? -1,
    currentInput,
    annotations: annotationHistory(preset, config),
  };
  // Cache optimization: hand ST the sticky rendering with a marker; PROMPT_READY picks the final one.
  let sticky: GenerationContext['sticky'];
  let out: STMessage[];
  /** Position of the current input in `out` and the renderings it may carry (input shaping). */
  let inputAt = -1;
  let inputTexts: string[] = [];
  if (config.cache?.enabled) {
    const chatKey = currentChatKey();
    const rw = stickyRewrite(chat, rewriteOptions, cacheState(chatKey)?.modes, (i) => messageKey(chat[i]!, realIndexOf[i] ?? i));
    out = rw.out.map(({ item, entry }) => (entry === undefined ? item : { ...item, mes: item.mes + markerOf(entry) }) as STMessage);
    inputAt = currentInput >= 0 ? rw.out.findIndex((r) => r.index === currentInput) : -1;
    if (inputAt >= 0) {
      const r = rw.out[inputAt]!;
      const e = r.entry === undefined ? undefined : rw.entries[r.entry];
      inputTexts = e ? [e.given, e.sticky, e.fresh].filter((x): x is string => typeof x === 'string') : [r.item.mes];
    }
    sticky = { chat: chatKey, entries: rw.entries, omitted: rw.omitted };
  } else {
    out = rewriteHistory(chat, rewriteOptions) as STMessage[];
    const orig = currentInput >= 0 ? chat[currentInput]! : undefined;
    inputAt = orig ? out.findLastIndex((m) => m === orig || (m.is_user && m.send_date === orig.send_date && m.name === orig.name)) : -1;
    if (inputAt >= 0) inputTexts = [out[inputAt]!.mes];
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
    transport: config.connection.transport,
    stages: [],
    structures: [],
    inputIndex: currentInput >= 0 ? (realIndexOf[currentInput] ?? real.length - 1) : -1,
    continueFrom: stType === 'continue' ? chat[last]?.mes : undefined,
    keywords,
    sticky,
    input: shapingInput,
    createdAt: Date.now(),
    warnings: [],
  };
  registry.setPending(ctx);
}
