import { describe, expect, it } from 'vitest';
import { CACHE_DEFAULTS, type CacheConfig } from '@advanced-preset/protocol';
import {
  hashText, markerOf, resolveSticky, stickyRewrite, swapInside, takeMarkers,
  type CacheFingerprint, type CacheState, type Candidate,
} from '@/core/cache';
import { decodeMode, encodeMode, rewriteHistory, type HistoryItem, type RewriteOptions } from '@/core/history';

const syn = (n: number) => ({ time: `T${n}`, location: `L${n}`, event: `E${n}`, summary: `S${n}` });
const ai = (n: number): HistoryItem => ({
  is_user: false, mes: `story ${n}`, send_date: `a${n}`,
  extra: { advanced_preset: { v: 1, turn: 'story', structures: { synopsis: syn(n) } } },
});
const user = (n: number): HistoryItem => ({ is_user: true, mes: `input ${n}`, send_date: `u${n}` });
/** u1 a1 … u(n-1) a(n-1) un (current input) */
const chat = (n: number): HistoryItem[] => {
  const out: HistoryItem[] = [];
  for (let i = 1; i < n; i++) out.push(user(i), ai(i));
  out.push(user(n));
  return out;
};

const opts = (items: HistoryItem[], o: Partial<RewriteOptions> = {}): RewriteOptions => ({
  trigger: '', wrap: true,
  tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 0, userInput: 'keep' },
  synopsisTemplate: '[{{time}}] {{event}}', synopsisId: 'synopsis',
  synopsisHistory: { depth: 2, template: '{{content}} <{{time}}>' },
  recap: null, realIndex: (i) => i, currentInput: items.length - 1,
  ...o,
});

const cfg = (o: Partial<CacheConfig> = {}): CacheConfig => ({ ...CACHE_DEFAULTS, enabled: true, maxDeferredTurns: 3, ...o });
const fp = (o: Partial<CacheFingerprint> = {}): CacheFingerprint => ({ model: 'm', tools: 't', prompt: 'p', ...o });

/** One request: sticky rewrite → candidates (no ST processing) → resolution → sent texts and next state. */
function request(items: HistoryItem[], prev: CacheState | undefined, o: { now?: number; fp?: CacheFingerprint; cfg?: CacheConfig; rewrite?: Partial<RewriteOptions> } = {}) {
  const ro = opts(items, o.rewrite);
  const rw = stickyRewrite(items, ro, prev?.modes, (i) => items[i]!.send_date!);
  const cands: Candidate[] = rw.entries.map((e) => ({ key: e.key, sticky: e.sticky, fresh: e.fresh, stickyMode: e.stickyMode, freshMode: e.freshMode }));
  const res = resolveSticky(cands, prev, o.fp ?? fp(), o.cfg ?? cfg(), o.now ?? 0, rw.omitted);
  const sent = cands.map((c, i) => (i < res.from ? c.sticky : c.fresh)).filter((x): x is string => x !== null);
  return { sent, res, state: { ...res.next, at: o.now ?? 0 } as CacheState, fresh: rewriteHistory(items, ro).map((m) => m.mes) };
}

const isPrefix = (a: string[], b: string[]) => a.every((x, i) => b[i] === x);

describe('cache: render modes', () => {
  it('round-trips the compact form', () => {
    for (const m of [{ body: 'full' }, { body: 'full', synopsis: true }, { body: 'full', synopsis: true, annotations: true }, { body: 'full', annotations: true }, { body: 'synopsis' }, { body: 'drop' }, { body: 'truncate', max: 120 }] as const) {
      expect(decodeMode(encodeMode(m))).toEqual(m);
    }
    expect(decodeMode('nope')).toBeUndefined();
    expect(decodeMode(undefined)).toBeUndefined();
  });
});

describe('cache: markers and swapping', () => {
  it('marks with private-use characters and strips them', () => {
    const { text, marks } = takeMarkers(`Alice: hi${markerOf(3)}`);
    expect(text).toBe('Alice: hi');
    expect(marks).toEqual([3]);
    expect(/\w/.test(markerOf(0).replace(/[⟦⟧]/g, ''))).toBe(false);
  });

  it('swaps the rendering inside a name prefix and ignores \\r', () => {
    expect(swapInside('Bob: story 1', 'story 1', 'syn 1')).toBe('Bob: syn 1');
    expect(swapInside('a\nb', 'a\r\nb', 'c')).toBe('c');
    expect(swapInside('x', 'y', 'z')).toBeUndefined();
    expect(swapInside('x', 'x', null)).toBeNull();
  });
});

describe('cache: sticky rendering', () => {
  it('first request renders by the rules', () => {
    const r = request(chat(4), undefined);
    expect(r.res.reason).toBe('first');
    expect(r.sent).toEqual(r.fresh);
  });

  it('keeps the previous rendering so the previous request stays a prefix', () => {
    const t1 = request(chat(4), undefined);
    // the recent-synopsis window slides: a1 would lose its synopsis now
    const t2 = request(chat(5), t1.state, { now: 1000 });
    expect(t2.res.reason).toBeNull();
    expect(isPrefix(t1.sent, t2.sent)).toBe(true);
    expect(t2.sent).not.toEqual(t2.fresh);
    expect(t2.sent[3]).toBe('story 2 <T2>');
    expect(t2.fresh[3]).toBe('story 2');
    expect(t2.res.postponed).toBeGreaterThan(0);
    expect(t2.res.deferred).toBe(1);
    // the new message follows the current rules
    expect(t2.sent.at(-2)).toBe('story 4 <T4>');
  });

  it('applies everything once the postponed requests exceed the limit', () => {
    let prev = request(chat(3), undefined).state;
    const deferred: number[] = [];
    let flushedAt = -1;
    for (let n = 4; n < 10; n++) {
      const r = request(chat(n), prev, { now: n * 1000, cfg: cfg({ maxDeferredTurns: 2 }) });
      deferred.push(r.res.deferred);
      if (r.res.reason === 'turns') { flushedAt = n; expect(r.sent).toEqual(r.fresh); break; }
      prev = r.state;
    }
    expect(deferred).toEqual([1, 2, 0]);
    expect(flushedAt).toBe(6);
  });

  it.each([
    ['ttl', { now: 6 * 60_000 }],
    ['model', { fp: fp({ model: 'other' }) }],
    ['tools', { fp: fp({ tools: 'other' }) }],
    ['prompt', { fp: fp({ prompt: 'other' }) }],
  ] as const)('flushes on %s', (reason, o) => {
    const t1 = request(chat(4), undefined);
    const t2 = request(chat(5), t1.state, { cfg: cfg({ ttlMinutes: 5 }), ...o });
    expect(t2.res.reason).toBe(reason);
    expect(t2.sent).toEqual(t2.fresh);
  });

  it('TTL 0 never expires', () => {
    const t1 = request(chat(4), undefined);
    expect(request(chat(5), t1.state, { now: 1e9, cfg: cfg({ ttlMinutes: 0 }) }).res.reason).toBeNull();
  });

  it('renders fresh from the first message that changed anyway', () => {
    const t1 = request(chat(6), undefined);
    const items = chat(7);
    items[2] = { ...items[2]!, mes: 'input 2 (edited)' };
    const t2 = request(items, t1.state, { now: 1 });
    expect(t2.res.reason).toBeNull();
    expect(t2.res.from).toBe(2);
    expect(t2.sent.slice(0, 2)).toEqual(t1.sent.slice(0, 2));
    expect(t2.sent.slice(2)).toEqual(t2.fresh.slice(2));
  });

  it('keeps synopsis replacement and user removal postponed (token saving)', () => {
    const rewrite: Partial<RewriteOptions> = { tokenSaving: { enabled: true, keepFullTurns: 2, truncateUserAfter: 0, userInput: 'remove' }, synopsisHistory: undefined };
    const t1 = request(chat(4), undefined, { rewrite });
    const t2 = request(chat(5), t1.state, { now: 1, rewrite });
    expect(isPrefix(t1.sent, t2.sent)).toBe(true);
    expect(t2.fresh.slice(0, 2)).toEqual(['[T1] E1', '[T2] E2']);
    expect(t2.sent.slice(0, 3)).toEqual(['[T1] E1', 'input 2', 'story 2']);
  });

  it('a message left out by the sticky rendering stays out until the flush', () => {
    const remove: Partial<RewriteOptions> = { tokenSaving: { enabled: true, keepFullTurns: 1, truncateUserAfter: 0, userInput: 'remove' }, synopsisHistory: undefined };
    const t1 = request(chat(4), undefined, { rewrite: remove });
    expect(t1.sent).not.toContain('input 1');
    const keep: Partial<RewriteOptions> = { tokenSaving: { ...remove.tokenSaving!, userInput: 'keep' } };
    const t2 = request(chat(4), t1.state, { now: 1, rewrite: keep });
    expect(t2.sent).not.toContain('input 1');
    expect(t2.fresh).toContain('input 1');
    const t3 = request(chat(4), t1.state, { now: 1, rewrite: keep, fp: fp({ prompt: 'changed' }) });
    expect(t3.sent).toContain('input 1');
  });

  it('recap coverage is never sticky', () => {
    const t1 = request(chat(5), undefined);
    const t2 = request(chat(6), t1.state, { now: 1, rewrite: { tokenSaving: { enabled: true, keepFullTurns: 1, truncateUserAfter: 0, userInput: 'keep' }, recap: { coversUpTo: 1 } } });
    expect(t2.sent).not.toContain('input 1');
    expect(t2.sent).not.toContain('story 1 <T1>');
    expect(t2.sent).not.toContain('story 1');
    expect(t2.res.from).toBe(0);
  });

  it('stores hashes of what was sent and the modes by message key', () => {
    const t1 = request(chat(3), undefined);
    expect(t1.state.seq).toEqual(t1.sent.map((s) => hashText(s)));
    expect(t1.state.modes).toMatchObject({ u1: 'f', a1: 'fy', a2: 'fy', u3: 'f' });
  });
});
