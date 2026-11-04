/**
 * Impersonate (§12.5, D12): ST's Impersonate buttons send the preset's impersonate meta-instruction
 * instead; the result is shown as a card that can fill the input box.
 */
import { actorName, expandMacros } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import { settings } from '@/store/settings';
import { getPreset } from '@/store/presets';
import { activeConfiguration } from '@/store/config';
import { activeCarrierPresetId } from '@/store/carrier';
import { metaEnabled } from '@/core/classify';
import { withStorylineOf } from './storylines';

const BUTTONS = '#option_impersonate, #mes_impersonate';

const textarea = () => document.querySelector<HTMLTextAreaElement>('#send_textarea');

/**
 * Write text into ST's input box (sends with `send`). `mesId`: the message the text comes from (a user
 * option, an impersonated reply): on a side storyline the text gets its `#tag` (I-160).
 */
export function fillInput(text: string, send = false, mesId?: number): void {
  const el = textarea();
  if (!el) return;
  el.value = mesId === undefined ? text : withStorylineOf(text, mesId);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
  if (send) document.querySelector<HTMLElement>('#send_but')?.click();
}

function impersonatePrompt(): string | null {
  if (!settings().enabled) return null;
  const id = activeCarrierPresetId();
  const preset = id ? getPreset(id) : undefined;
  if (!preset?.meta.impersonatePrompt) return null;
  const config = activeConfiguration(preset);
  // With meta instructions off, ST's own impersonate runs.
  if (!metaEnabled(config)) return null;
  const text = expandMacros(preset.meta.impersonatePrompt, (args) => (args[0] === 'name' ? actorName(preset, config, args[1]!) : undefined));
  try { return st().substituteParams(text); } catch { return text; }
}

function onClick(e: MouseEvent): void {
  const target = e.target as Element | null;
  if (!target?.closest?.(BUTTONS)) return;
  const prompt = impersonatePrompt();
  if (!prompt) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  document.querySelector<HTMLElement>('#options')?.style.setProperty('display', 'none');
  // A draft in the input box becomes the hint of the instruction; on a side storyline the
  // instruction carries its tag (a tag in the draft wins).
  const draft = textarea()?.value.trim();
  fillInput(withStorylineOf(draft ? `${prompt}\n${draft}` : prompt), true);
}

export function installImpersonate(): void {
  window.addEventListener('click', onClick, true);
}
