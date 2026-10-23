/**
 * Advanced Preset — SillyTavern extension entry. Wires the generation pipeline (§5) into ST events,
 * restores state, and mounts the UI.
 */
import { st, loadHostModules, type ChatMessage } from '@/st/host';
import { settings } from '@/store/settings';
import { listPresets, loadBuiltins } from '@/store/presets';
import { migratePresetState } from '@/store/config';
import { activeCarrierPresetId, ensureCarrier, pullSampling } from '@/store/carrier';
import { getPreset } from '@/store/presets';
import { advancedPresetInterceptor } from '@/core/interceptor';
import { onPromptReady } from '@/core/assembler';
import { installFetchGate, onSettingsReady } from '@/core/fetch-gate';
import { setNextGeneration } from '@/core/classify';
import { registry } from '@/core/context';
import { debugLog } from '@/core/debug';
import { onMessageReceived } from '@/app/receive';
import { annotationsApi, installAnnotations } from '@/app/annotations';
import { checkStaleBundle, onExtensionUpdated, updateExtension } from '@/app/updater';
import { startDevSource } from '@/app/dev-source';
import { installImpersonate } from '@/app/impersonate';
import { installPresetIo } from '@/app/st-preset-io';
import { mountUi } from '@/ui';
import { ui } from '@/ui/state';
import { registerChatSurface } from '@/ui/annotations';
import './global.css';

declare global {
  // eslint-disable-next-line no-var
  var advancedPresetInterceptor: typeof import('@/core/interceptor').advancedPresetInterceptor;
  interface Window { AdvancedPreset: typeof api }
}

const api = {
  version: __AP_VERSION__,
  buildId: __AP_BUILD_ID__,
  /** Force the origin of the next generation (`story` / `task`), e.g. from scripts. */
  nextGeneration: (o: { origin?: 'story' | 'task' } | null) => setNextGeneration(o),
  listPresets: () => listPresets().map(({ preset, source }) => ({ id: preset.id, name: preset.name, version: preset.version, source })),
  activePresetId: () => activeCarrierPresetId(),
  update: updateExtension,
  /** Open / close the AP panel (toggles without an argument). */
  togglePanel: (open?: boolean) => { ui.panelOpen = open ?? !ui.panelOpen; },
  /** Inline annotations of messages (I-83). */
  annotations: annotationsApi,
};

// Must exist synchronously: ST resolves the interceptor by name when generating.
globalThis.advancedPresetInterceptor = advancedPresetInterceptor;
window.AdvancedPreset = api;

function debounce<A extends unknown[]>(f: (...a: A) => void, ms: number) {
  let h: ReturnType<typeof setTimeout> | undefined;
  return (...a: A) => { clearTimeout(h); h = setTimeout(() => f(...a), ms); };
}

async function syncCarriers(): Promise<void> {
  for (const { preset } of listPresets()) {
    try { await ensureCarrier(preset); } catch (e) { console.error('[AP] carrier sync failed', preset.id, e); }
  }
}

async function init(): Promise<void> {
  const { eventSource, eventTypes: E } = st();
  settings();
  installFetchGate();
  installImpersonate();
  installPresetIo();
  installAnnotations();
  await loadHostModules();
  await loadBuiltins();
  for (const { preset } of listPresets()) {
    const notes = migratePresetState(preset);
    if (notes.length) debugLog('migrate', { id: preset.id, notes });
  }

  const first = (e: string, f: (...a: any[]) => unknown) => (eventSource.makeFirst ? eventSource.makeFirst(e, f) : eventSource.on(e, f));
  first(E.CHAT_COMPLETION_PROMPT_READY!, (data: { chat: ChatMessage[]; dryRun: boolean }) => onPromptReady(data));
  eventSource.on(E.CHAT_COMPLETION_SETTINGS_READY!, (data: Record<string, unknown>) => onSettingsReady(data));
  eventSource.on(E.MESSAGE_RECEIVED!, (mesId: number, type?: string) => onMessageReceived(Number(mesId), type));
  eventSource.on(E.GENERATION_STOPPED!, () => { registry.setPending(null); registry.takeArmed(); });
  eventSource.on(E.GENERATION_ENDED!, () => registry.sweep());

  const pull = debounce(() => {
    const id = activeCarrierPresetId();
    const preset = id ? getPreset(id) : undefined;
    if (preset) pullSampling(preset);
  }, 300);
  eventSource.on(E.SETTINGS_UPDATED!, pull);
  eventSource.on(E.OAI_PRESET_CHANGED_AFTER!, pull);

  const ready = async () => {
    await syncCarriers();
    startDevSource();
    void checkStaleBundle();
  };
  // APP_READY is sticky in ST's emitter (late listeners run immediately).
  eventSource.on(E.APP_READY!, () => void ready());

  mountUi();
  debugLog('init', { version: __AP_VERSION__, build: __AP_BUILD_ID__, enabled: settings().enabled });
}

/** ST manifest hook `update` (see manifest.json `hooks`). */
export const advancedPresetOnUpdate = onExtensionUpdated;

/** TauriTavern manifest hook `chatSurface` (I-85): registers the annotation participant in managed mode. */
export const advancedPresetRegisterChatSurface = registerChatSurface;

void init().catch((e) => console.error('[AP] init failed', e));
