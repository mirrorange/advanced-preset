import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, type APreset } from '@advanced-preset/protocol';
import { activeConfiguration, migratePresetState, presetState, updateConfiguration } from '@/store/config';
import { describeRule, newRule, retarget, varInfo } from '@/ui/panel/user-modules/subjects';
import { petals } from './helpers';

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  vi.stubGlobal('__AP_VERSION__', '1.9.0');
  (globalThis as any).SillyTavern = { getContext: () => ({ extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {} }) };
});
afterEach(() => { delete (globalThis as any).SillyTavern; vi.unstubAllGlobals(); });

function preset(): APreset {
  const p = cloneData(petals);
  p.id = 'list-test';
  p.params = [
    ...p.params.filter((x) => x.id !== 'testWords'),
    { id: 'testWords', type: 'list', label: 'Test words', default: [] },
    { id: 'testText', type: 'text', label: 'Test text', default: '' },
  ];
  p.configurationDefaults.params = { ...p.configurationDefaults.params, testWords: [], testText: '' };
  return p;
}

describe('list params in the extension', () => {
  it('stores lists in the configuration diff and reads them back', () => {
    const p = preset();
    migratePresetState(p);
    updateConfiguration(p, (c) => { c.params.testWords = ['a', 'b']; });
    expect(presetState(p).active.diff.params).toEqual({ testWords: ['a', 'b'] });
    expect(activeConfiguration(p).params.testWords).toEqual(['a', 'b']);
    updateConfiguration(p, (c) => { c.params.testWords = []; });
    expect(presetState(p).active.diff.params).toBeUndefined();
  });

  it('drops stored values whose type changed in a preset update', () => {
    const p = preset();
    migratePresetState(p);
    updateConfiguration(p, (c) => { c.params.testWords = ['a']; c.params.testText = 'old'; });
    const next = cloneData(p);
    next.version = '99.0.0';
    next.hash = 'next';
    // testText became a list, testWords became text
    next.params = next.params.map((x) => (x.id === 'testText' ? { ...x, type: 'list', default: [] } : x.id === 'testWords' ? { ...x, type: 'text', default: '' } : x));
    next.configurationDefaults.params = { ...next.configurationDefaults.params, testWords: '', testText: [] };
    const removed = migratePresetState(next);
    expect(removed).toEqual(expect.arrayContaining(['params.testWords', 'params.testText']));
    expect(activeConfiguration(next).params).toMatchObject({ testWords: '', testText: [] });
  });

  it('offers has-items / empty rules for list params', () => {
    const p = preset();
    expect(varInfo(p, 'params.testWords').kind).toBe('list');
    const rule = retarget(p, newRule(p, 'param') as never, 'params.testWords');
    expect(rule).toEqual({ kind: 'var', path: 'params.testWords', op: 'on' });
    expect(describeRule(p, rule)).toBe('Test words: Has items');
    expect(describeRule(p, { ...rule, op: 'off' })).toBe('Test words: Empty');
  });
});
