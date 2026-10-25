import { describe, expect, it } from 'vitest';
import { cloneData, resolveConfiguration, upgradeArtifact } from '@advanced-preset/protocol';
import { classify, metaEnabled, metaTrigger } from '@/core/classify';
import { rewriteHistory, type RewriteOptions } from '@/core/history';
import { petals } from './helpers';

const configWith = (enabled: boolean | undefined) => {
  const c = cloneData(resolveConfiguration(petals, petals.defaultConfiguration, {}));
  if (enabled === undefined) delete (c.meta as { enabled?: boolean }).enabled;
  else c.meta.enabled = enabled;
  return c;
};

describe('meta switch', () => {
  it('defaults to on, also for artifacts built before the switch', () => {
    expect(petals.configurationDefaults.meta.enabled).toBe(true);
    const raw = cloneData(petals) as unknown as { configurationDefaults: { meta: Record<string, unknown> } };
    delete raw.configurationDefaults.meta.enabled;
    expect(upgradeArtifact(raw)!.configurationDefaults.meta).toEqual({ enabled: true, recentCount: petals.configurationDefaults.meta.recentCount });
    raw.configurationDefaults.meta.enabled = false;
    expect(upgradeArtifact(raw)!.configurationDefaults.meta.enabled).toBe(false);
    expect(metaEnabled(configWith(undefined))).toBe(true);
  });

  it('parses meta instructions when on', () => {
    const config = configWith(true);
    const input = `${metaTrigger(petals, config)} 换个场景`;
    const r = classify(petals, config, input, 'normal', true, [], false);
    expect(r.meta.present).toBe(true);
    expect(r.meta.pure).toBe(true);
    expect(r.origin).toBe('task');
  });

  it('treats the input as plain story text when off', () => {
    const on = configWith(true);
    const off = configWith(false);
    const input = `${metaTrigger(petals, on)} 换个场景`;
    expect(metaTrigger(petals, off)).toBe('');
    const r = classify(petals, off, input, 'normal', true, [], false);
    expect(r.meta).toMatchObject({ present: false, pure: false, mixed: false, segments: [], task: null });
    expect(r.origin).toBe('story');
  });

  it('leaves meta text in earlier user messages when off', () => {
    const trigger = metaTrigger(petals, configWith(true));
    const chat = [
      { is_user: true, mes: `走进森林\n\n${trigger} 多写点环境`, name: 'u', send_date: '1' },
      { is_user: false, mes: '森林很安静。', name: 'n', send_date: '2' },
      { is_user: true, mes: '继续', name: 'u', send_date: '3' },
    ];
    const base: RewriteOptions = {
      trigger, wrap: petals.meta.wrap, recap: null, synopsisTemplate: '', synopsisId: undefined, realIndex: (i) => i, currentInput: 2,
      tokenSaving: { enabled: false, keepFullTurns: 6, truncateUserAfter: 0, userInput: 'keep' },
    };
    expect(rewriteHistory(chat, base)[0]!.mes).toBe('走进森林');
    expect(rewriteHistory(chat, { ...base, trigger: '' })[0]!.mes).toBe(chat[0]!.mes);
  });
});
