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
import { annotationHistory, rewriteHistory } from './history';
import { keywordTexts } from '@/store/user-modules';

export async function advancedPresetInterceptor(chat: STMessage[], _contextSize: number, _abort: (immediately: boolean) => void, type?: string): Promise<void> {
  registry.setPending(null);
  if (!settings().enabled) return;
  const presetId = activeCarrierPresetId();
  const preset = presetId ? getPreset(presetId) : undefined;
  if (!preset) return;
  const config = activeConfiguration(preset);
  const stType = type || 'normal';

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
  const rewritten = rewriteHistory(chat, {
    trigger: metaTrigger(preset, config),
    wrap: preset.meta.wrap,
    tokenSaving: config.tokenSaving,
    synopsisTemplate: preset.tokenSaving.synopsisTemplate,
    synopsisId: Object.values(preset.structures).find((s) => s.kind === 'synopsis')?.id,
    recap: currentRecap(),
    realIndex: (i) => realIndexOf[i] ?? -1,
    currentInput,
    annotations: annotationHistory(preset, config),
  });
  chat.splice(0, chat.length, ...(rewritten as STMessage[]));

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
    createdAt: Date.now(),
    warnings: [],
  };
  registry.setPending(ctx);
}
