/**
 * Trusting executable content (I-110). Templates (`@template`) are JavaScript that runs in the page,
 * so a preset or user-module file containing them is only installed after the user confirms.
 * Built-in presets and the `ap dev` source (the author's own build) are trusted as they are.
 */
import { presetTemplates, userModulesCode, type APreset, type UserModule } from '@advanced-preset/protocol';
import { confirmPopup, escapeHtml } from '@/st/host';
import { presetName, t } from '@/i18n';

/** Thrown when the user declines; callers stop quietly (no error toast). */
export class TrustDeclined extends Error {
  constructor() {
    super(t('trust.declined'));
    this.name = 'TrustDeclined';
  }
}

export const isTrustDeclined = (e: unknown): e is TrustDeclined => e instanceof TrustDeclined;

const sameCode = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

function dialog(title: string, what: string, count: number, sample: string): string {
  return [
    `<h3>${escapeHtml(title)}</h3>`,
    `<p>${escapeHtml(t('trust.body', { what, n: count }))}</p>`,
    `<p>${escapeHtml(t('trust.risk'))}</p>`,
    `<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${escapeHtml(sample)}</pre>`,
  ].join('');
}

const sampleOf = (sources: string[]) => {
  const all = sources.join('\n\n────────\n\n');
  return all.length > 1200 ? `${all.slice(0, 1200)}\n…` : all;
};

/**
 * Ask before installing a preset with templates. Skipped when it has none, or when its template
 * code is identical to the copy being replaced (`previous`, e.g. an update that only changed text).
 */
export async function confirmPresetTemplates(preset: APreset, previous?: APreset): Promise<void> {
  const code = presetTemplates(preset);
  if (!code.length || (previous && sameCode(code, presetTemplates(previous)))) return;
  const name = presetName(preset);
  const ok = await confirmPopup(dialog(t('trust.presetTitle'), t('trust.preset', { name }), code.length, sampleOf(code)), t('trust.install'), t('common.cancel'));
  if (!ok) throw new TrustDeclined();
}

/** Ask before importing user modules with templates. */
export async function confirmUserModuleTemplates(modules: UserModule[]): Promise<void> {
  const code = userModulesCode(modules);
  if (!code.length) return;
  const ok = await confirmPopup(dialog(t('trust.modulesTitle'), t('trust.modules', { n: modules.length }), code.length, sampleOf(code)), t('trust.import'), t('common.cancel'));
  if (!ok) throw new TrustDeclined();
}
