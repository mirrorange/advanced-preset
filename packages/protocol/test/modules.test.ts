import { describe, expect, it } from 'vitest';
import { exclusiveAllowsNone, moduleSwitches, type APreset, type Configuration, type Module } from '../src';

const mod = (id: string, over: Partial<Module> = {}): Module => ({
  id, name: id, toggle: 'user', default: false, structures: [], questions: { mandatory: [], optional: [] }, ...over,
});
const preset = {
  groups: { mode: { label: 'Mode', order: 1 }, style: { label: 'Style', order: 2, allowNone: true } },
  modules: [
    mod('core', { toggle: 'always', default: true }),
    mod('mode-a', { exclusive: 'mode' }),
    mod('mode-b', { exclusive: 'mode', default: true }),
    mod('style-a', { exclusive: 'style', default: true }),
    mod('style-b', { exclusive: 'style' }),
    mod('extra'),
  ],
} as unknown as APreset;
const cfg = (modules: Record<string, boolean>) => ({ modules }) as unknown as Configuration;
const on = (modules: Record<string, boolean>) => Object.entries(moduleSwitches(preset, cfg(modules))).filter(([, v]) => v).map(([k]) => k);

describe('exclusive sets', () => {
  it('keeps the first enabled module of a set', () => {
    expect(on({ 'mode-a': true, 'mode-b': true, 'style-b': true })).toEqual(['core', 'mode-a', 'style-b']);
  });

  it('falls back to the default module when a required set has nothing enabled', () => {
    expect(on({ extra: true })).toEqual(['core', 'mode-b', 'extra']);
    expect(exclusiveAllowsNone(preset, 'mode')).toBe(false);
  });

  it('leaves an optional set empty', () => {
    expect(on({ 'style-a': false })).toEqual(['core', 'mode-b']);
    expect(exclusiveAllowsNone(preset, 'style')).toBe(true);
  });
});
