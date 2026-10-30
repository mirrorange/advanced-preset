/**
 * Panel placement: AP's entry is a banner below ST's Chat Completion preset select, shown while a
 * Carrier is selected (I-71); the panel itself (`<ap-panel>`) lives inside ST's AI Response
 * Configuration drawer (`#left-nav-panel`), covering it. The drawer already handles desktop / mobile sizing and the top bar, so AP inherits a
 * layout that never sits under ST's own UI.
 */
import { watch } from 'vue';
import { ui } from './state';

const DRAWER = 'left-nav-panel';
const BANNER = 'ap-preset-banner';

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

/** Banner right below the preset select row (the row is the select's parent). */
function mountBanner(): void {
  const row = document.getElementById('settings_preset_openai')?.parentElement;
  if (!row || row.nextElementSibling?.localName === BANNER) return;
  row.after(document.createElement(BANNER));
}

/** Carriers are rebuilt from their AP preset, so renaming or copying them only creates orphans (I-72). */
const CARRIER_HIDDEN = ['[data-preset-manager-rename="openai"]', '#new_oai_preset'];
function hideCarrierButtons(): void {
  watch(() => ui.presetId, (id) => {
    for (const el of document.querySelectorAll(CARRIER_HIDDEN.join(','))) el.classList.toggle('ap-carrier-hidden', Boolean(id));
  }, { immediate: true });
}

/**
 * While the panel is shown, the drawer's own children are hidden (global `.ap-panel-covering`) and the
 * panel itself stays transparent, so the drawer's theme tint and blur show exactly as ST draws them (I-122).
 * Set before the panel enters and cleared after it has left.
 */
export function coverDrawer(on: boolean): void {
  const el = drawer();
  if (el && el.querySelector(':scope > ap-panel')) el.classList.toggle('ap-panel-covering', on);
}

function mountPanel(): void {
  const el = drawer();
  if (!el) {
    if (!document.querySelector('ap-panel')) {
      const panel = document.createElement('ap-panel');
      panel.dataset.apStandalone = '';
      document.body.append(panel);
    }
    return;
  }
  const existing = document.querySelector('ap-panel');
  if (existing?.parentElement === el) return;
  existing?.remove();
  el.append(document.createElement('ap-panel'));
}

export function mountEntry(): void {
  mountBanner();
  hideCarrierButtons();
  mountPanel();
  // Whoever opens AP (banner, extension settings, cards) also needs the drawer visible, and
  // closing the drawer closes AP so it reopens on ST's own settings.
  watch(() => ui.panelOpen, (open) => { if (open) openDrawer(); });
  const el = drawer();
  if (el) new MutationObserver(() => { if (!el.classList.contains('openDrawer')) ui.panelOpen = false; }).observe(el, { attributes: true, attributeFilter: ['class'] });
}
