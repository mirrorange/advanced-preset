import { describe, expect, it } from 'vitest';
import {
  localizeModuleTemplate, moduleTemplates, presetTemplates, upgradeArtifact, userModuleFromTemplate,
  type APreset, type ModuleTemplate,
} from '../src';

const tpl: ModuleTemplate = {
  id: 'style',
  name: 'Custom style',
  description: 'Your own style guide.',
  entries: [
    { point: 'writing-style', text: '<!--# Describe your style -->\n## My style' },
    { point: 'after-history', role: 'user', text: 'Remember the style.' },
  ],
  vars: [{ var: 'questions', type: 'dict', items: [{ key: 'style', value: 'How does the style show?' }] }],
  trigger: { match: 'all', rules: [{ kind: 'expr', source: '!meta.pure' }] },
  locales: {
    'zh-cn': {
      name: '自定义文风',
      entries: [{ point: 'writing-style', text: '<!--# 在这里描述文风 -->\n## 我的文风' }],
      vars: [],
      trigger: { match: 'all', rules: [] },
    },
  },
};

describe('module templates', () => {
  it('copies a template into an independent user module', () => {
    const m = userModuleFromTemplate(tpl, 'abc');
    expect(m).toEqual({
      id: 'abc',
      name: 'Custom style',
      enabled: true,
      entries: [
        { id: 'e1', point: 'writing-style', text: '<!--# Describe your style -->\n## My style' },
        { id: 'e2', point: 'after-history', role: 'user', text: 'Remember the style.' },
      ],
      vars: tpl.vars,
      trigger: tpl.trigger,
    });
    m.entries[0]!.text = 'changed';
    m.trigger.rules.length = 0;
    (m.vars[0] as { items: unknown[] }).items.length = 0;
    expect(tpl.entries[0]!.text).toContain('My style');
    expect(tpl.trigger.rules).toHaveLength(1);
    expect((tpl.vars[0] as { items: unknown[] }).items).toHaveLength(1);
    expect(userModuleFromTemplate(tpl, 'x', 'Renamed').name).toBe('Renamed');
  });

  it('picks the translated template, then locale labels, then the source', () => {
    expect(localizeModuleTemplate(tpl, 'zh-cn').name).toBe('自定义文风');
    expect(localizeModuleTemplate(tpl, 'ZH-CN').entries).toHaveLength(1);
    expect(localizeModuleTemplate({ ...tpl, locales: { zh: tpl.locales!['zh-cn']! } }, 'zh-tw').name).toBe('自定义文风');
    expect(localizeModuleTemplate(tpl, 'en').name).toBe('Custom style');
    const labelled = localizeModuleTemplate(tpl, 'ja', { name: 'カスタム', description: '' });
    expect(labelled).toMatchObject({ name: 'カスタム', description: 'Your own style guide.' });
    expect(labelled.entries).toBe(tpl.entries);
    // A translated file wins over locale labels.
    expect(localizeModuleTemplate(tpl, 'zh-cn', { name: 'ignored' }).name).toBe('自定义文风');
  });

  it('counts template code in module templates as preset code', () => {
    const code = { ...tpl, entries: [{ point: 'p', text: 'A <!-- @template --><%- vars.x %><!-- @end -->' }] };
    const preset = { entries: [], workflows: [], moduleTemplates: [code] } as unknown as APreset;
    expect(presetTemplates(preset)).toEqual(['<%- vars.x %>']);
    expect(presetTemplates({ entries: [], workflows: [] })).toEqual([]);
  });

  it('defaults to no templates for older artifacts', () => {
    const p = upgradeArtifact({ formatVersion: 3, id: 'x', entries: [], configurationDefaults: {} })!;
    expect(p.moduleTemplates).toEqual([]);
    expect(moduleTemplates({} as APreset)).toEqual([]);
  });
});
