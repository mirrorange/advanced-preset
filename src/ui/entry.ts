/**
 * Panel placement: AP's entry is an icon button beside ST's Chat Completion preset select, and the
 * panel itself (`<ap-panel>`) lives inside ST's AI Response Configuration drawer (`#left-nav-panel`),
 * covering it. The drawer already handles desktop / mobile sizing and the top bar, so AP inherits a
 * layout that never sits under ST's own UI.
 */
import { watch } from 'vue';
import { t } from '@/i18n';
import { ui } from './state';

const DRAWER = 'left-nav-panel';
const BUTTON = 'ap-preset-button';

function drawer(): HTMLElement | null {
  return document.getElementById(DRAWER);
}

/** Open ST's AI Response Configuration drawer through its own toggle (keeps icons / pins consistent). */
export function openDrawer(): void {
  const el = drawer();
  if (!el || el.classList.contains('openDrawer')) return;
  const toggle = el.parentElement?.querySelector<HTMLElement>(':scope > .drawer-toggle');
  toggle?.click();
}

function mountButton(): void {
  // Next to the preset select, before save / rename / save-as (the header row already wraps).
  const group = document.querySelector('#settings_preset_openai')?.nextElementSibling;
  if (!group || group.querySelector(`#${BUTTON}`)) return;
  const btn = document.createElement('div');
  btn.id = BUTTON;
  btn.className = 'margin0 menu_button menu_button_icon';
  btn.setAttribute('role', 'button');
  btn.tabIndex = 0;
  btn.title = t('panel.open.title');
  btn.setAttribute('aria-label', t('panel.open.title'));
  const icon = document.createElement('i');
  icon.className = 'fa-fw fa-solid fa-layer-group';
  btn.append(icon);
  const toggle = () => { ui.panelOpen = !ui.panelOpen; };
  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  group.prepend(btn);
  watch(() => ui.panelOpen, (open) => btn.classList.toggle('active', open), { immediate: true });
}

function mountPanel(): void {
  const el = drawer();
  if (!el) {
    if (!document.querySelector('ap-panel')) document.body.append(document.createElement('ap-panel'));
    return;
  }
  const existing = document.querySelector('ap-panel');
  if (existing?.parentElement === el) return;
  existing?.remove();
  el.append(document.createElement('ap-panel'));
}

export function mountEntry(): void {
  mountButton();
  mountPanel();
  // Whoever opens AP (entry button, extension settings, cards) also needs the drawer visible, and
  // closing the drawer closes AP so it reopens on ST's own settings.
  watch(() => ui.panelOpen, (open) => { if (open) openDrawer(); });
  const el = drawer();
  if (el) new MutationObserver(() => { if (!el.classList.contains('openDrawer')) ui.panelOpen = false; }).observe(el, { attributes: true, attributeFilter: ['class'] });
}
