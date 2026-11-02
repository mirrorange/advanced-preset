import { describe, expect, it } from 'vitest';
import { defaultVars, resolveConfiguration } from '@advanced-preset/protocol';
import { formatSynopsis, historyEchoes, rewriteHistory, type HistoryItem, type RewriteOptions } from '@/core/history';
import { petals, synopsisEchoes } from './helpers';

const syn = (n: number) => ({ time: `Day1 0${n}:00`, location: `L${n}`, event: `E${n}`, summary: `S${n}` });
const ai = (n: number, withSyn = true): HistoryItem => ({
  is_user: false,
  mes: `story ${n}`,
  extra: withSyn ? { advanced_preset: { v: 1, turn: 'story', structures: { synopsis: syn(n) } } } : undefined,
});
const user = (n: number): HistoryItem => ({ is_user: true, mes: `input ${n} `.repeat(5).trim() });

/** u1 a1 u2 a2 … uN aN + current input */
const chat = (n: number, withSyn = true): HistoryItem[] => {
  const out: HistoryItem[] = [];
  for (let i = 1; i <= n; i++) out.push(user(i), ai(i, withSyn));
  out.push({ is_user: true, mes: 'now' });
  return out;
};

const base = (items: HistoryItem[], o: Partial<RewriteOptions> = {}): RewriteOptions => ({
  trigger: '',
  wrap: true,
  tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 5, userInput: 'truncate' },
  synopsisTemplate: '[{{time}}] {{event}}',
  synopsisId: 'synopsis',
  recap: null,
  realIndex: (i) => i,
  currentInput: items.length - 1,
  ...o,
});
const texts = (items: HistoryItem[]) => items.map((m) => m.mes);

describe('history: synopsis templates', () => {
  it('formats the replacement and history templates', () => {
    expect(formatSynopsis('[{{time}} · {{location}}] {{event}}: {{summary}}', syn(1))).toBe('[Day1 01:00 · L1] E1: S1');

  });

  it('appends synopses to the last N assistant messages without token saving', () => {
    const items = chat(4);
    const out = rewriteHistory(items, base(items, { echoes: synopsisEchoes(3, '{{content}} | {{time}}') }));
    expect(texts(out)).toEqual([
      items[0]!.mes, 'story 1',
      items[2]!.mes, 'story 2 | Day1 02:00',
      items[4]!.mes, 'story 3 | Day1 03:00',
      items[6]!.mes, 'story 4 | Day1 04:00',
      'now',
    ]);
  });

  it('counts messages without a synopsis towards the depth', () => {
    const items = chat(3);
    items[5] = ai(3, false);
    const out = rewriteHistory(items, base(items, { echoes: synopsisEchoes(2, '{{content}} | {{event}}') }));
    expect(texts(out).filter((t) => t.startsWith('story'))).toEqual(['story 1', 'story 2 | E2', 'story 3']);
  });

  it('does nothing without a depth', () => {
    const items = chat(2);
    expect(texts(rewriteHistory(items, base(items)))).toEqual(texts(items));
  });

  it('combines with token saving: older replaced, recent verbatim + synopsis', () => {
    const items = chat(4);
    const out = rewriteHistory(items, base(items, {
      tokenSaving: { enabled: true, keepFullTurns: 2, truncateUserAfter: 0, userInput: 'keep' },
      echoes: synopsisEchoes(1, '{{content}} | {{event}}'),
    }));
    expect(texts(out).filter((t) => !t.startsWith('input'))).toEqual(['[Day1 01:00] E1', '[Day1 02:00] E2', 'story 3', 'story 4 | E4', 'now']);
  });
});

describe('history: token saving user input', () => {
  const ts = (userInput: 'keep' | 'truncate' | 'remove') => ({ enabled: true, keepFullTurns: 1, truncateUserAfter: 5, userInput });

  it('keep leaves older user messages alone', () => {
    const items = chat(3);
    const out = rewriteHistory(items, base(items, { tokenSaving: ts('keep') }));
    expect(out.filter((m) => m.is_user).map((m) => m.mes)).toEqual([items[0]!.mes, items[2]!.mes, items[4]!.mes, 'now']);
  });

  it('truncate cuts older user messages', () => {
    const items = chat(3);
    const out = rewriteHistory(items, base(items, { tokenSaving: ts('truncate') }));
    expect(out.filter((m) => m.is_user).map((m) => m.mes)).toEqual(['input…', 'input…', items[4]!.mes, 'now']);
  });

  it('remove drops older user messages but keeps the full turns and the current input', () => {
    const items = chat(3);
    const out = rewriteHistory(items, base(items, { tokenSaving: ts('remove') }));
    expect(texts(out)).toEqual(['[Day1 01:00] E1', '[Day1 02:00] E2', items[4]!.mes, 'story 3', 'now']);
  });

  it('a missing mode behaves as truncate', () => {
    const items = chat(2);
    const { userInput: _, ...legacy } = ts('keep');
    const out = rewriteHistory(items, base(items, { tokenSaving: legacy }));
    expect(out[0]!.mes).toBe('input…');
  });
});

describe('history: Petals synopsis options', () => {
  it('keeps the last 3 synopses while event synopsis is on, and removes older input by default', () => {
    const config = resolveConfiguration(petals, petals.defaultConfiguration, {});
    expect(config.tokenSaving.userInput).toBe('remove');
    const rule = (c: typeof config) => historyEchoes(petals, c, defaultVars(petals, c), petals.workflows[0])?.rules.find((r) => r.id === 'synopsis');
    expect(rule(config)?.depth).toBe(3);
    expect(rule(config)?.active).toBe(true);
    const off = { ...config, modules: { ...config.modules, 'event-synopsis': false } };
    expect(rule(off)?.active).toBe(false);
  });
});
