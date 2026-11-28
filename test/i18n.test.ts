import { afterEach, describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';
import type { APreset } from '@advanced-preset/protocol';
import en from '../i18n/en.json';
import zhCN from '../i18n/zh-cn.json';
import zhTW from '../i18n/zh-tw.json';
import { locale, presetDescription, presetName, pt, setLanguage, t, UI_LANGUAGES } from '@/i18n';

const preset = {
  name: 'Petals Preset',
  description: 'Write stories with Freesia.',
  locales: {
    'zh-cn': { name: '花瓣预设', description: '与小苍兰一起写故事吧！', params: { length: { label: '正文长度' } } },
    'zh-tw': { name: '花瓣預設', params: { length: { label: '正文長度' } } },
    ja: { name: '' },
  },
} as unknown as APreset;

function lang(l: string) {
  vi.stubGlobal('localStorage', { getItem: () => l });
}

describe('preset name & description locales', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('uses the locale table when present', () => {
    lang('zh-cn');
    expect(presetName(preset)).toBe('花瓣预设');
    expect(presetDescription(preset)).toBe('与小苍兰一起写故事吧！');
  });

  it('falls back to the manifest text', () => {
    lang('ja');
    expect(presetName(preset)).toBe('Petals Preset');
    expect(presetDescription(preset)).toBe('Write stories with Freesia.');
    lang('en');
    expect(presetName(preset)).toBe('Petals Preset');
    expect(presetDescription({ ...preset, description: undefined } as APreset)).toBeUndefined();
  });
});

describe('extension UI tables', () => {
  it('have the same keys in every language', () => {
    expect(Object.keys(zhCN)).toEqual(Object.keys(en));
    expect(Object.keys(zhTW)).toEqual(Object.keys(en));
  });

  it('keep every {placeholder} of the English text', () => {
    const slots = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const [k, v] of Object.entries(en)) {
      expect(slots(zhCN[k as keyof typeof zhCN]), k).toEqual(slots(v));
      expect(slots(zhTW[k as keyof typeof zhTW]), k).toEqual(slots(v));
    }
  });
});

describe('interface language', () => {
  afterEach(() => { setLanguage(undefined); vi.unstubAllGlobals(); });

  it('follows SillyTavern by default (zh-hk counts as zh-tw)', () => {
    lang('zh-tw');
    expect(locale()).toBe('zh-tw');
    expect(t('common.save')).toBe('儲存');
    lang('zh-hk');
    expect(locale()).toBe('zh-tw');
    lang('zh-cn');
    expect(t('common.save')).toBe('保存');
  });

  it('overrides SillyTavern when set, for UI and preset strings', () => {
    lang('zh-cn');
    setLanguage('zh-tw');
    expect(locale()).toBe('zh-tw');
    expect(t('common.save')).toBe('儲存');
    expect(presetName(preset)).toBe('花瓣預設');
    expect(pt(preset, 'params', 'length', 'label', 'Length')).toBe('正文長度');
    // Missing in zh-tw: the manifest text, not the zh-cn one.
    expect(presetDescription(preset)).toBe('Write stories with Freesia.');
    setLanguage('en');
    expect(t('common.save')).toBe('Save');
    expect(presetName(preset)).toBe('Petals Preset');
  });

  it('goes back to SillyTavern when cleared', () => {
    lang('zh-cn');
    setLanguage('en');
    setLanguage('');
    expect(locale()).toBe('zh-cn');
  });

  it('is reactive', () => {
    lang('en');
    const label = computed(() => t('common.save'));
    expect(label.value).toBe('Save');
    setLanguage('zh-tw');
    expect(label.value).toBe('儲存');
  });

  it('offers every bundled table', () => {
    expect(UI_LANGUAGES.map((l) => l.value)).toEqual(['en', 'zh-cn', 'zh-tw']);
  });
});
