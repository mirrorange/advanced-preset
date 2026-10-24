import { describe, expect, it } from 'vitest';
import { parseAnnotations } from '@advanced-preset/protocol';
import { rewriteHistory, type HistoryItem } from '@/core/history';

const ai = (raw: string): HistoryItem => {
  const r = parseAnnotations(raw);
  return { is_user: false, mes: r.text, extra: { advanced_preset: { v: 1, turn: 'story', structures: {}, annotations: r.annotations } } };
};
const user = (mes: string): HistoryItem => ({ is_user: true, mes });
const base = {
  trigger: '', wrap: false, tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 0 }, synopsisTemplate: '',
  realIndex: (i: number) => i, currentInput: -1,
};

describe('history annotations (I-80)', () => {
  const items = [user('u1'), ai('A {==b==}{>>one<<} c'), user('u2'), ai('D {==e==}{>>two<<} f'), user('u3')];

  it('sends clean text by default', () => {
    expect(rewriteHistory(items, base).map((m) => m.mes)).toEqual(['u1', 'A b c', 'u2', 'D e f', 'u3']);
  });

  it('re-injects markup into the last N assistant messages only', () => {
    const out = rewriteHistory(items, { ...base, annotations: { depth: 1 } }).map((m) => m.mes);
    expect(out).toEqual(['u1', 'A b c', 'u2', 'D {==e==}{>>two<<} f', 'u3']);
    expect(items[3]!.mes).toBe('D e f');
  });
});
