import { describe, expect, it } from 'vitest';
import {
  localizeUserModuleSource, presetTemplates, presetUserModules, presetUserModuleTemplates, upgradeArtifact, userModuleFingerprint,
  userModuleFromSource, userModuleSourceFingerprint, userModuleToSource,
  type APreset, type UserModuleSource,
} from '../src';

const tpl: UserModuleSource = {
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

describe('preset user modules', () => {
  it('copies a template into an independent user module', () => {
    const m = userModuleFromSource(tpl, 'abc');
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
    expect(userModuleFromSource(tpl, 'x', { name: 'Renamed' }).name).toBe('Renamed');
  });

  it('picks the translated template, then locale labels, then the source', () => {
    expect(localizeUserModuleSource(tpl, 'zh-cn').name).toBe('自定义文风');
    expect(localizeUserModuleSource(tpl, 'ZH-CN').entries).toHaveLength(1);
    expect(localizeUserModuleSource({ ...tpl, locales: { zh: tpl.locales!['zh-cn']! } }, 'zh-tw').name).toBe('自定义文风');
    expect(localizeUserModuleSource(tpl, 'en').name).toBe('Custom style');
    const labelled = localizeUserModuleSource(tpl, 'ja', { name: 'カスタム', description: '' });
    expect(labelled).toMatchObject({ name: 'カスタム', description: 'Your own style guide.' });
    expect(labelled.entries).toBe(tpl.entries);
    // A translated file wins over locale labels.
    expect(localizeUserModuleSource(tpl, 'zh-cn', { name: 'ignored' }).name).toBe('自定义文风');
  });

  it('counts template code in bundled modules and templates as preset code', () => {
    const code = { ...tpl, entries: [{ point: 'p', text: 'A <!-- @template --><%- vars.x %><!-- @end -->' }] };
    const other = { ...tpl, locales: undefined, entries: [{ point: 'p', text: '<!-- @template --><%- 1 %><!-- @end -->' }] };
    const preset = { entries: [], workflows: [], userModules: [other], userModuleTemplates: [code] } as unknown as APreset;
    expect(presetTemplates(preset)).toEqual(['<%- 1 %>', '<%- vars.x %>']);
    expect(presetTemplates({ entries: [], workflows: [] })).toEqual([]);
  });

  it('defaults to none for artifacts without them', () => {
    const p = upgradeArtifact({ formatVersion: 3, id: 'x', entries: [], configurationDefaults: {} })!;
    expect(p.userModules).toEqual([]);
    expect(p.userModuleTemplates).toEqual([]);
    expect(presetUserModules({} as APreset)).toEqual([]);
    expect(presetUserModuleTemplates({} as APreset)).toEqual([]);
  });

  it('starts bundled modules in their declared state', () => {
    expect(userModuleFromSource(tpl, 'a', { enabled: false }).enabled).toBe(false);
  });

  it('fingerprints what a module says, not ids, state or key order', () => {
    const m = userModuleFromSource(tpl, 'abc');
    const fp = userModuleFingerprint(m);
    expect(userModuleFingerprint(tpl)).toBe(fp);
    expect(userModuleFingerprint({ ...m, id: 'zzz', enabled: false, entries: m.entries.map((e, i) => ({ ...e, id: `x${i}` })) })).toBe(fp);
    const reordered = { ...m, trigger: { rules: m.trigger.rules.map((r) => ({ source: (r as { source: string }).source, kind: 'expr' as const })), match: 'all' as const } };
    expect(userModuleFingerprint(reordered)).toBe(fp);
    expect(userModuleFingerprint({ ...m, name: 'Other' })).not.toBe(fp);
    expect(userModuleFingerprint({ ...m, entries: [{ ...m.entries[0]!, role: 'user' }, m.entries[1]!] })).not.toBe(fp);
    // Translations and descriptions change the source fingerprint, not the module's.
    const src = userModuleSourceFingerprint(tpl);
    expect(userModuleSourceFingerprint({ ...tpl, locales: {} })).not.toBe(src);
    expect(userModuleSourceFingerprint({ ...tpl, description: 'x' })).not.toBe(src);
  });

  it('turns a user module back into a source', () => {
    const m = { ...userModuleFromSource(tpl, 'abc'), enabled: false };
    const src = userModuleToSource(m);
    expect(src).toMatchObject({ id: 'abc', name: 'Custom style', enabled: false, vars: tpl.vars, trigger: tpl.trigger });
    expect(src.entries).toEqual(tpl.entries);
    expect(userModuleToSource({ ...m, enabled: true })).not.toHaveProperty('enabled');
    expect(userModuleFingerprint(src)).toBe(userModuleFingerprint(m));
  });
});
