import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CACHE_DEFAULTS } from '@advanced-preset/protocol';
import { markerOf, messageKey, stickyRewrite } from '@/core/cache';
import type { HistoryItem, RewriteOptions } from '@/core/history';
import { applySticky, commitCache, stripMarkers } from '@/core/sticky';
import { cacheState, clearCacheState, resetCacheStateMemory } from '@/store/cache-state';
import type { ChatMessage } from '@/st/host';
import { ctxFor } from './helpers';

let settings: Record<string, unknown>;
beforeEach(() => {
  settings = { chat_completion_source: 'claude', claude_model: 'claude-x' };
  (globalThis as any).SillyTavern = { getContext: () => ({ chatCompletionSettings: settings, getCurrentChatId: () => 'chat-1', substituteParams: (s: string) => s }) };
  resetCacheStateMemory();
  clearCacheState();
});
afterEach(() => { delete (globalThis as any).SillyTavern; });

const syn = (n: number) => ({ time: `T${n}`, location: `L${n}`, event: `E${n}`, summary: `S${n}` });
const ai = (n: number): HistoryItem => ({ is_user: false, name: 'Bot', mes: `story ${n}`, send_date: `a${n}`, extra: { advanced_preset: { v: 1, turn: 'story', structures: { synopsis: syn(n) } } } });
const user = (n: number): HistoryItem => ({ is_user: true, name: 'Me', mes: `input ${n}`, send_date: `u${n}` });
const chat = (n: number) => { const out: HistoryItem[] = []; for (let i = 1; i < n; i++) out.push(user(i), ai(i)); out.push(user(n)); return out; };

const options = (items: HistoryItem[]): RewriteOptions => ({
  trigger: '', wrap: true,
  tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 0, userInput: 'keep' },
  synopsisTemplate: '[{{time}}] {{event}}', synopsisId: 'synopsis', synopsisHistory: { depth: 2, template: '{{content}} <{{time}}>' },
  recap: null, realIndex: (i) => i, currentInput: items.length - 1,
});

/** Interceptor + ST prompt building (name prefix for the bot, a depth injection) + PROMPT_READY. */
function turn(n: number, o: { pre?: string; maxDeferredTurns?: number; origin?: 'story' | 'task'; now?: number } = {}) {
  const items = chat(n);
  const ctx = ctxFor('structured');
  ctx.config.cache = { ...CACHE_DEFAULTS, enabled: true, ttlMinutes: 0, maxDeferredTurns: o.maxDeferredTurns ?? 3 };
  if (o.origin) ctx.origin = o.origin;
  const rw = stickyRewrite(items, options(items), cacheState('chat-1')?.modes, (i) => messageKey(items[i]!, i));
  ctx.sticky = { chat: 'chat-1', entries: rw.entries, omitted: rw.omitted };
  const history: ChatMessage[] = rw.out.map(({ item, entry }) => ({
    role: item.is_user ? 'user' : 'assistant',
    content: `${item.is_user ? '' : 'Bot: '}${item.mes}${entry === undefined ? '' : markerOf(entry)}`,
  }));
  history.splice(history.length - 1, 0, { role: 'system', content: '[depth note]' });
  const final: ChatMessage[] = [{ role: 'system', content: o.pre ?? 'system prompt' }, ...history, { role: 'system', content: 'memory' }];
  const report = applySticky(ctx, final, 1, final.length - 1, o.now ?? 0);
  return { ctx, report, texts: final.slice(1, -1).map((m) => m.content as string) };
}

describe('sticky rendering at PROMPT_READY', () => {
  it('strips markers and keeps the previous request as a prefix', () => {
    const t1 = turn(4);
    expect(t1.report?.reason).toBe('first');
    expect(t1.texts.join('\n')).not.toMatch(/⟦/);
    commitCache(t1.ctx, 1);
    const t2 = turn(5);
    expect(t2.report).toMatchObject({ reason: null, deferred: 1, stores: 'state' });
    expect(t2.report!.postponed).toBeGreaterThan(0);
    // everything up to the depth injection of turn 1 is unchanged
    expect(t2.texts.slice(0, t1.texts.length - 2)).toEqual(t1.texts.slice(0, -2));
    expect(t2.texts[3]).toBe('Bot: story 2 <T2>');
  });

  it('a changed prompt before the history applies the rules at once', () => {
    commitCache(turn(4).ctx, 1);
    const t2 = turn(5, { pre: 'system prompt + world info' });
    expect(t2.report?.reason).toBe('prompt');
    expect(t2.texts[3]).toBe('Bot: story 2');
  });

  it('a changed model applies the rules at once', () => {
    commitCache(turn(4).ctx, 1);
    settings.claude_model = 'claude-y';
    expect(turn(5).report?.reason).toBe('model');
  });

  it('stores the state only after success; task turns only refresh its time on a hit', () => {
    const t1 = turn(4);
    expect(cacheState('chat-1')).toBeUndefined();
    commitCache(t1.ctx, 10);
    const saved = cacheState('chat-1')!;
    expect(saved.at).toBe(10);
    const task = turn(4, { origin: 'task' });
    expect(task.report).toMatchObject({ reason: null, stores: 'time' });
    commitCache(task.ctx, 20);
    expect(cacheState('chat-1')).toEqual({ ...saved, at: 20 });
  });

  it('without a plan only strips markers', () => {
    const final: ChatMessage[] = [{ role: 'user', content: `hi${markerOf(0)}` }, { role: 'user', content: [{ type: 'text', text: `x${markerOf(1)}` }] }];
    stripMarkers(final);
    expect(final).toEqual([{ role: 'user', content: 'hi' }, { role: 'user', content: [{ type: 'text', text: 'x' }] }]);
  });
});
