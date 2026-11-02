/**
 * Message mounts (§16.2): the storyline badge `<ap-storyline>` (I-152), `<ap-stages>` and the top card
 * area `<ap-top-cards>` (I-137) before, and `<ap-cards>` after `.mes_text`, never inside it (only a
 * user message's storyline tag is hidden there).
 * Hosts are (re)attached on ST events and by a MutationObserver when other code rebuilds messages;
 * the streaming placeholder is located through `streamingProcessor.messageId`.
 */
import { watch } from 'vue';
import { st } from '@/st/host';
import { getSidecar, type TurnKind } from '@/store/sidecar';
import { live } from '@/core/live';
import { bumpChat } from './state';
import { pruneViews, syncAnnotationView } from './annotations';
import { forgetLineKeys, lineKeys, storylinesActive } from './storylines';
import { syncTagView } from './storyline-tag';

const HIDDEN = 'ap-hidden';
const REPLACED_TURNS: TurnKind[] = ['meta-pure', 'impersonate', 'summary'];

function host(tag: string, mesId: number): HTMLElement {
  const el = document.createElement(tag);
  el.setAttribute('mesid', String(mesId));
  return el;
}

function sync(mes: Element): void {
  const id = Number(mes.getAttribute('mesid'));
  const block = mes.querySelector(':scope > .mes_block');
  const text = block?.querySelector(':scope > .mes_text');
  if (!block || !text || Number.isNaN(id)) return;
  const msg = st().chat[id];
  const sc = getSidecar(msg);
  const isLive = live.current?.mesId === id;
  if (msg && !msg.is_user) syncAnnotationView(text as HTMLElement, Boolean(sc?.annotations?.length || isLive));
  const lines = storylinesActive.value;
  syncTagView(text as HTMLElement, msg, lines);
  const want = Boolean(msg && !msg.is_user && (sc || isLive));
  let stages = block.querySelector<HTMLElement>(':scope > ap-stages');
  let top = block.querySelector<HTMLElement>(':scope > ap-top-cards');
  let cards = block.querySelector<HTMLElement>(':scope > ap-cards');
  if (!want) {
    stages?.remove();
    top?.remove();
    cards?.remove();
    text.classList.remove(HIDDEN);
    syncBadge(block, text, id, lines);
    return;
  }
  if (!top || top.nextElementSibling !== text) { top?.remove(); top = host('ap-top-cards', id); top.setAttribute('position', 'top'); text.before(top); }
  if (!stages || stages.nextElementSibling !== top) { stages?.remove(); stages = host('ap-stages', id); top.before(stages); }
  if (!cards || cards.previousElementSibling !== text) { cards?.remove(); cards = host('ap-cards', id); text.after(cards); }
  if (stages.getAttribute('mesid') !== String(id)) stages.setAttribute('mesid', String(id));
  if (top.getAttribute('mesid') !== String(id)) top.setAttribute('mesid', String(id));
  if (cards.getAttribute('mesid') !== String(id)) cards.setAttribute('mesid', String(id));
  text.classList.toggle(HIDDEN, Boolean(!isLive && sc && REPLACED_TURNS.includes(sc.turn)));
  syncBadge(block, text, id, lines);
}

/** Storyline badge (I-152) before AP's other mounts, for messages outside the main storyline. */
function syncBadge(block: Element, text: Element, id: number, active: boolean): void {
  let badge = block.querySelector<HTMLElement>(':scope > ap-storyline');
  if (!active || !lineKeys()[id]) { badge?.remove(); return; }
  const anchor = block.querySelector(':scope > ap-stages') ?? block.querySelector(':scope > ap-top-cards') ?? text;
  if (!badge) badge = host('ap-storyline', id);
  if (badge.nextElementSibling !== anchor) anchor.before(badge);
  if (badge.getAttribute('mesid') !== String(id)) badge.setAttribute('mesid', String(id));
}

export function scanMessages(root: ParentNode = document): void {
  for (const mes of root.querySelectorAll('#chat > .mes[mesid]')) sync(mes);
}

function ensureDock(): void {
  const chat = document.getElementById('chat');
  if (!chat) return;
  let dock = chat.querySelector(':scope > ap-dock');
  if (!dock) { dock = document.createElement('ap-dock'); chat.append(dock); }
  else if (dock.nextElementSibling) chat.append(dock);
}

let frame = 0;
const pending = new Set<Element>();
let full = false;
function schedule(mes?: Element | null): void {
  if (mes) pending.add(mes);
  else full = true;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    forgetLineKeys();
    if (full) scanMessages();
    else for (const m of pending) if (m.isConnected) sync(m);
    pending.clear();
    full = false;
    ensureDock();
    pruneViews();
  });
}

/** Re-render everything: chat changed, messages loaded / edited / swiped. */
export function refreshMessages(): void {
  bumpChat();
  schedule();
}

export function installMounts(): void {
  const { eventSource, eventTypes: E } = st();
  for (const e of [E.CHAT_CHANGED, E.MORE_MESSAGES_LOADED, E.MESSAGE_UPDATED, E.MESSAGE_EDITED, E.MESSAGE_SWIPED, E.MESSAGE_DELETED, E.CHARACTER_MESSAGE_RENDERED, E.USER_MESSAGE_RENDERED, 'advanced_preset_message_updated']) {
    if (e) eventSource.on(e, refreshMessages);
  }

  const observe = () => {
    const chat = document.getElementById('chat');
    if (!chat) return void setTimeout(observe, 500);
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.target === chat) {
          for (const n of r.addedNodes) if (n instanceof Element && n.matches('.mes[mesid]')) schedule(n);
          continue;
        }
        // Something rebuilt a message block: re-check that message only.
        const mes = (r.target as Element).closest?.('#chat > .mes[mesid]');
        if (mes && r.target === mes.querySelector(':scope > .mes_block')) schedule(mes);
      }
    }).observe(chat, { childList: true, subtree: true });
    schedule();
  };
  observe();

  // Streaming placeholder: bind the live generation to its message as soon as ST creates it.
  let timer: ReturnType<typeof setInterval> | undefined;
  watch(() => live.current && live.current.status === 'running' && live.current.streaming && live.current.mesId === null, (waiting) => {
    clearInterval(timer);
    if (!waiting) return;
    timer = setInterval(() => {
      const g = live.current;
      const id = st().streamingProcessor?.messageId;
      if (!g || g.status !== 'running') return clearInterval(timer);
      if (typeof id === 'number' && id >= 0) { g.mesId = id; clearInterval(timer); refreshMessages(); }
    }, 100);
  });
  watch(() => live.current?.status, () => schedule());
}
