import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, withUserModules, type APreset, type ModuleTemplate } from '@advanced-preset/protocol';
import { confirmPresetTemplates } from '@/app/trust';
import { localTemplate } from '@/i18n';
import { createUserModuleFromTemplate, userModules } from '@/store/user-modules';
import { petals, withoutTemplates } from './helpers';

let lang = 'en';
const popup = vi.fn(async (..._args: unknown[]) => 1);

beforeEach(() => {
  lang = 'en';
  vi.stubGlobal('localStorage', { getItem: () => lang });
  vi.stubGlobal('__AP_VERSION__', '1.9.0');
  popup.mockClear();
  (globalThis as any).SillyTavern = {
    getContext: () => ({
      extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {},
      callGenericPopup: popup, POPUP_TYPE: { CONFIRM: 2 }, POPUP_RESULT: { AFFIRMATIVE: 1 },
    }),
  };
});
afterEach(() => { delete (globalThis as any).SillyTavern; vi.unstubAllGlobals(); });

const tpl: ModuleTemplate = {
  id: 'my-style',
  name: 'Custom style',
  entries: [{ point: 'writing-style', text: '<!--# Write your style below. -->\n## Writing Style: Mine\n\nShort sentences.' }],
  vars: [{ var: 'optionalQuestions', type: 'dict', items: [{ key: 'my-style', value: 'How does the scene keep my style?' }] }],
  trigger: { match: 'all', rules: [{ kind: 'expr', source: '!meta.pure' }] },
  locales: { 'zh-cn': { name: '自定义文风', entries: [{ point: 'writing-style', text: '<!--# 在下面写文风 -->\n## 文风' }], vars: [], trigger: { match: 'all', rules: [] } } },
};

function preset(id = 'tpl-test'): APreset {
  const p = withoutTemplates(petals);
  p.id = id;
  p.moduleTemplates = [cloneData(tpl)];
  return p;
}

describe('module templates in the panel', () => {
  it('localizes templates for the panel language', () => {
    const p = preset();
    expect(localTemplate(p, tpl).name).toBe('Custom style');
    lang = 'zh-CN';
    expect(localTemplate(p, tpl).name).toBe('自定义文风');
    lang = 'ja';
    p.locales.ja = { moduleTemplates: { 'my-style': { name: 'カスタム文体' } } };
    expect(localTemplate(p, tpl).name).toBe('カスタム文体');
  });

  it('creates an editable copy with a unique name', () => {
    const p = preset('copy-test');
    const a = createUserModuleFromTemplate(p, localTemplate(p, tpl));
    const b = createUserModuleFromTemplate(p, localTemplate(p, tpl));
    expect(userModules(p).map((m) => m.name)).toEqual(['Custom style', 'Custom style 2']);
    expect(a.id).not.toBe(b.id);
    expect(a.entries[0]).toMatchObject({ id: 'e1', point: 'writing-style' });
    a.entries[0]!.text = 'changed';
    expect(tpl.entries[0]!.text).toContain('Short sentences.');
  });

  it('a module from the Petals-like template inserts the style and its question, without the comments', () => {
    const p = preset('assemble-test');
    const m = createUserModuleFromTemplate(p, localTemplate(p, tpl));
    const { preset: merged, skipped } = withUserModules(p, [m]);
    expect(skipped).toEqual([]);
    const entry = merged.entries.find((e) => e.module === `user-${m.id}`)!;
    expect(entry.region).toBe('writing_style');
    expect(entry.content[0]!.pieces.map((x) => x.text).join('')).toBe('## Writing Style: Mine\n\nShort sentences.');
    expect(merged.modules.at(-1)!.vars).toEqual(tpl.vars);
  });

  it('asks for trust when a module template contains code', async () => {
    const p = preset('trust-test');
    await confirmPresetTemplates(p);
    expect(popup).not.toHaveBeenCalled();
    p.moduleTemplates[0]!.locales!['zh-cn']!.entries[0]!.text = '<!-- @template --><%- vars.x %><!-- @end -->';
    await confirmPresetTemplates(p);
    expect(popup).toHaveBeenCalledOnce();
    expect(String(popup.mock.calls[0]![0])).toContain('vars.x');
  });
});
