import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, type APreset, type UserModule } from '@advanced-preset/protocol';
import { confirmPresetTemplates, confirmUserModuleTemplates, isTrustDeclined, TrustDeclined } from '@/app/trust';
import { installArtifact } from '@/app/install';
import { settings } from '@/store/settings';
import { petals } from './helpers';

const AFFIRMATIVE = 1;
let answer = AFFIRMATIVE;
const popup = vi.fn(async (..._args: unknown[]) => answer);

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  vi.stubGlobal('__AP_VERSION__', '1.9.0');
  answer = AFFIRMATIVE;
  popup.mockClear();
  (globalThis as any).SillyTavern = {
    getContext: () => ({
      extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {},
      callGenericPopup: popup, POPUP_TYPE: { CONFIRM: 2 }, POPUP_RESULT: { AFFIRMATIVE },
    }),
  };
});
afterEach(() => { delete (globalThis as any).SillyTavern; vi.unstubAllGlobals(); });

/** Petals with a template appended to its first entry. */
function withTemplate(code = '<%- gen.type %>', id = 'templated'): APreset {
  const p = cloneData(petals);
  p.id = id;
  p.entries[0]!.content[0]!.pieces.push({ text: code, template: { file: 'modules/x.md', line: 3 } });
  return p;
}

describe('trusting templates (I-110)', () => {
  it('does not ask for presets without templates', async () => {
    await confirmPresetTemplates(petals);
    expect(popup).not.toHaveBeenCalled();
  });

  it('asks for presets with templates and shows the code escaped', async () => {
    await confirmPresetTemplates(withTemplate('<% if (x) { %><b><% } %>'));
    expect(popup).toHaveBeenCalledOnce();
    const html = popup.mock.calls[0]![0] as unknown as string;
    expect(html).toContain('&lt;% if (x) { %&gt;&lt;b&gt;');
    expect(html).not.toContain('<b>');
  });

  it('rejects with TrustDeclined when the user cancels', async () => {
    answer = 0;
    const err = await confirmPresetTemplates(withTemplate()).catch((e) => e);
    expect(err).toBeInstanceOf(TrustDeclined);
    expect(isTrustDeclined(err)).toBe(true);
  });

  it('does not ask again when an update keeps the same template code', async () => {
    const old = withTemplate();
    const next = withTemplate();
    next.version = '9.9.9';
    await confirmPresetTemplates(next, old);
    expect(popup).not.toHaveBeenCalled();
    await confirmPresetTemplates(withTemplate('<%- 2 %>'), old);
    expect(popup).toHaveBeenCalledOnce();
  });

  it('does not install a declined preset', async () => {
    answer = 0;
    await expect(installArtifact(withTemplate('<%- 1 %>', 'declined'))).rejects.toBeInstanceOf(TrustDeclined);
    expect(settings().installed.declined).toBeUndefined();
  });

  it('asks before importing user modules with templates', async () => {
    const plain = { id: 'a', name: 'A', enabled: true, trigger: { match: 'all', rules: [] }, entries: [{ id: 'e', point: 'p', text: 'hello' }], vars: [] } as unknown as UserModule;
    await confirmUserModuleTemplates([plain]);
    expect(popup).not.toHaveBeenCalled();
    const code = { ...plain, entries: [{ id: 'e', point: 'p', text: '<!-- @template --><%- params.x %><!-- @end -->' }] } as UserModule;
    answer = 0;
    await expect(confirmUserModuleTemplates([plain, code])).rejects.toBeInstanceOf(TrustDeclined);
    expect(popup).toHaveBeenCalledOnce();
  });
});
