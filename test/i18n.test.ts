import { afterEach, describe, expect, it, vi } from 'vitest';
import type { APreset } from '@advanced-preset/protocol';
import { presetDescription, presetName } from '@/i18n';

const preset = {
  name: 'Petals Preset',
  description: 'Write stories with Freesia.',
  locales: { 'zh-cn': { name: '花瓣预设', description: '与小苍兰一起写故事吧！' }, ja: { name: '' } },
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
