/**
 * Inline annotation display (I-82 – I-86). Static mode attaches a view to every annotated
 * `.mes_text` from the message mount scan; under TauriTavern's managed ChatSurface the participant
 * `advanced-preset/annotations` creates one per committed content instead (I-85).
 */
import { watch, watchEffect } from 'vue';
import { st } from '@/st/host';
import { live } from '@/core/live';
import { settings } from '@/store/settings';
import { annotationsApi } from '@/app/annotations';
import { defineHost } from '../host';
import { activePreset } from '../state';
import { theme } from '../theme';
import AnnoBubble from './AnnoBubble.vue';
import { hideBubble } from './bubble';
import { setAnnotationColor, setBubbleHost, watchDocument } from './paint';
import { AnnotationView, annotationsShown, ensureView, pruneViews, refreshFrameViews, refreshViews } from './view';

interface ChatSurfaceApi {
  protocolVersion: number;
  isManagedOwnershipRequired?: () => boolean;
  registerParticipant: (definition: Record<string, unknown>) => unknown;
}

const surfaceApi = (): ChatSurfaceApi | undefined => (window as unknown as { __TAURITAVERN__?: { api?: { chatSurface?: ChatSurfaceApi } } }).__TAURITAVERN__?.api?.chatSurface;

/** TauriTavern decided (once per page) that message DOM is owned by ChatSurface participants. */
export const managedSurface = (() => {
  let v: boolean | undefined;
  return () => (v ??= (() => { try { return surfaceApi()?.isManagedOwnershipRequired?.() === true; } catch { return false; } })());
})();

let registered = false;
/** ST manifest hook `chatSurface` (TauriTavern): register before the first projection. */
export function registerChatSurface(): void {
  const api = surfaceApi();
  if (registered || !api || !managedSurface()) return;
  if (api.protocolVersion !== 1) { console.warn('[AP] unsupported ChatSurface protocol', api.protocolVersion); return; }
  registered = true;
  api.registerParticipant({
    id: 'advanced-preset/annotations',
    protocolVersion: 1,
    didCommitContent({ mesid, content }: { mesid: number | string; content: HTMLElement }) {
      const id = Number(mesid);
      if (st().chat[id]?.is_user) return undefined;
      const view = new AnnotationView(content, id);
      return () => view.dispose();
    },
  });
}

/** Static mode: called by the mount scan for every assistant message. */
export function syncAnnotationView(text: HTMLElement, annotated: boolean): void {
  if (annotated && !managedSurface()) ensureView(text);
}

export { pruneViews };

let host: HTMLElement | null = null;
function ensureBubbleHost(): HTMLElement {
  if (!host || !host.isConnected) {
    host = document.createElement('ap-anno-bubble');
    document.body.append(host);
  }
  return host;
}

export function installAnnotationUi(): void {
  defineHost('ap-anno-bubble', AnnoBubble);
  ensureBubbleHost();
  setBubbleHost(() => host);
  watchDocument(document);

  watchEffect(() => {
    const ui = settings().ui;
    const preset = activePreset.value?.theme?.[theme.mode]?.accent;
    setAnnotationColor(ui.annotations?.color || ui.accent || preset || (theme.mode === 'dark' ? '#c084fc' : '#9333ea'));
  });
  watch(annotationsShown, () => { hideBubble(); refreshViews(undefined, 0); });
  watch(() => live.current?.status, () => refreshViews());

  annotationsApi.on('change', (id) => refreshViews(id));
  const { eventSource, eventTypes: E } = st();
  for (const e of [E.CHAT_CHANGED, E.MORE_MESSAGES_LOADED]) if (e) eventSource.on(e, () => { hideBubble(); pruneViews(); });
  eventSource.on('message_iframe_render_ended', () => refreshFrameViews());
  addEventListener('resize', () => hideBubble());
}
