/**
 * Cache optimization at PROMPT_READY: finds the marked history messages in the final prompt,
 * resolves sticky vs. fresh rendering against the stored state (see `cache.ts`) and prepares the
 * state that is stored once the request succeeded.
 */
import type { ChatMessage } from '@/st/host';
import { connectionKey } from '@/st/host';
import { cacheState, saveCacheState, touchCacheState } from '@/store/cache-state';
import { MARK_RE, hashText, resolveSticky, swapInside, takeMarkers, type CacheFingerprint, type Candidate, type FlushReason } from './cache';
import type { GenerationContext } from './context';
import { artifactsOf } from './transports/base';

export interface CacheReport {
  at: number;
  reason: FlushReason | null;
  /** Consecutive requests with postponed changes, including this one. */
  deferred: number;
  maxDeferredTurns: number;
  /** Messages kept in their previous rendering although the rules changed it. */
  postponed: number;
  /** History messages sent with the sticky / fresh rendering. */
  sticky: number;
  fresh: number;
  /** Marked messages whose text could not be located (sent as given). */
  unmatched: number;
  /** Stored state when this request succeeds (only story turns write it; others refresh its time on a hit). */
  stores: 'state' | 'time' | 'nothing';
}

const textOfContent = (c: ChatMessage['content']): string =>
  typeof c === 'string' ? c : Array.isArray(c) ? c.map((p: any) => (typeof p === 'string' ? p : p?.text ?? '')).join('') : '';
const reprOf = (c: ChatMessage['content'] | null): string | null => (c === null ? null : typeof c === 'string' ? c : JSON.stringify(c));

const hasMarker = (s: unknown) => typeof s === 'string' && s.includes('⟦') && new RegExp(MARK_RE.source).test(s);

/** Removes every marker (nothing marked may reach the model, whatever path the prompt took). */
export function stripMarkers(list: ChatMessage[]): void {
  for (const m of list) {
    if (typeof m.content === 'string') { if (hasMarker(m.content)) m.content = takeMarkers(m.content).text; continue; }
    if (Array.isArray(m.content)) {
      for (const p of m.content as any[]) if (p && typeof p === 'object' && hasMarker(p.text)) p.text = takeMarkers(p.text).text;
    }
  }
}

/** Marker index of a message and its content without markers, with a function to swap the marked text. */
function readMarked(m: ChatMessage): { mark: number; clean: ChatMessage['content']; swap: (given: string, text: string | null) => ChatMessage['content'] | null | undefined } | null {
  if (typeof m.content === 'string') {
    if (!hasMarker(m.content)) return null;
    const { text, marks } = takeMarkers(m.content);
    return { mark: marks[0]!, clean: text, swap: (given, r) => swapInside(text, given, r) };
  }
  if (!Array.isArray(m.content)) return null;
  const parts = (m.content as any[]).map((p) => (p && typeof p === 'object' ? { ...p } : p));
  let mark = -1;
  let at = -1;
  parts.forEach((p, i) => {
    if (!p || typeof p !== 'object' || !hasMarker(p.text)) return;
    const r = takeMarkers(p.text);
    p.text = r.text;
    if (mark < 0) { mark = r.marks[0]!; at = i; }
  });
  if (mark < 0) return null;
  return {
    mark,
    clean: parts,
    swap: (given, r) => {
      const text = swapInside(parts[at].text, given, r);
      if (text === undefined || text === null) return text;
      return parts.map((p, i) => (i === at ? { ...p, text } : p));
    },
  };
}

/** Hash of the tools / schema shape this turn sends (descriptions included). */
export function toolsFingerprint(ctx: GenerationContext): string {
  if (!ctx.workflow) return '';
  const c = ctx.config.connection;
  let shape: unknown = null;
  try {
    const art = artifactsOf(ctx);
    shape = ctx.transport === 'structured' ? art.schema() : ctx.transport === 'tool-single' ? art.submitTool() : ctx.transport === 'tool-multi' ? art.stageTools() : null;
  } catch { shape = null; }
  const tools = ctx.transport === 'tool-single' || ctx.transport === 'tool-multi';
  return hashText(JSON.stringify({ transport: ctx.transport, shape, ...(tools ? { force: c.forceTool, parallel: c.parallelTools, synthetic: c.syntheticTurn } : {}) }));
}

/** Hash of every prompt message before the history. */
export function promptFingerprint(before: ChatMessage[]): string {
  return hashText(before.map((m) => `${m.role}\u0000${textOfContent(m.content)}`).join('\u0001'));
}

export let lastCacheReport: CacheReport | null = null;

/**
 * Resolves the marked history messages of `final` (history = `[historyAt, historyEnd)`) in place.
 * Without a sticky plan only strips markers.
 */
export function applySticky(ctx: GenerationContext, final: ChatMessage[], historyAt: number, historyEnd: number, now = Date.now()): CacheReport | null {
  const plan = ctx.sticky;
  ctx.sticky = undefined;
  if (!plan || historyAt < 0) { stripMarkers(final); return null; }
  const cfg = ctx.config.cache;
  type Slot = { index: number; sticky: ChatMessage['content'] | null; fresh: ChatMessage['content'] | null };
  const slots: Slot[] = [];
  const cands: Candidate[] = [];
  const used = new Set<number>();
  let unmatched = 0;
  for (let i = 0; i < final.length; i++) {
    const m = final[i]!;
    const marked = readMarked(m);
    if (marked) m.content = marked.clean;
    if (i < historyAt || i >= historyEnd) continue;
    const entry = marked && !used.has(marked.mark) ? plan.entries[marked.mark] : undefined;
    if (!marked || !entry) {
      if (m.role === 'user' || m.role === 'assistant' || m.role === 'system' || m.role === 'tool') {
        const r = reprOf(m.content)!;
        cands.push({ sticky: r, fresh: r });
        slots.push({ index: i, sticky: m.content, fresh: m.content });
      }
      continue;
    }
    used.add(marked.mark);
    const sticky = marked.swap(entry.given, entry.sticky);
    const fresh = marked.swap(entry.given, entry.fresh);
    if (sticky === undefined || fresh === undefined) {
      // The given text was changed after the interceptor: send it as is.
      unmatched++;
      const mode = entry.sticky === entry.given ? entry.stickyMode : entry.freshMode;
      const r = reprOf(m.content);
      cands.push({ key: entry.key, sticky: r, fresh: r, stickyMode: mode, freshMode: mode });
      slots.push({ index: i, sticky: m.content, fresh: m.content });
      continue;
    }
    cands.push({ key: entry.key, sticky: reprOf(sticky), fresh: reprOf(fresh), stickyMode: entry.stickyMode, freshMode: entry.freshMode });
    slots.push({ index: i, sticky, fresh });
  }

  const fp: CacheFingerprint = { model: connectionKey(), tools: toolsFingerprint(ctx), prompt: promptFingerprint(final.slice(0, historyAt)) };
  const prev = cacheState(plan.chat);
  const res = resolveSticky(cands, prev, fp, cfg, now, plan.omitted);
  let sticky = 0;
  let fresh = 0;
  for (let k = slots.length - 1; k >= 0; k--) {
    const s = slots[k]!;
    const useSticky = k < res.from;
    const content = useSticky ? s.sticky : s.fresh;
    if (cands[k]!.key !== undefined && content !== null) { if (useSticky) sticky++; else fresh++; }
    if (content === null) final.splice(s.index, 1);
    else final[s.index]!.content = content;
  }

  const story = ctx.origin === 'story' && !ctx.dryRun;
  const stores: CacheReport['stores'] = ctx.dryRun ? 'nothing' : story ? 'state' : res.reason === null ? 'time' : 'nothing';
  if (stores !== 'nothing') ctx.cacheCommit = { chat: plan.chat, next: res.next, touch: stores === 'time' };
  const report: CacheReport = {
    at: now, reason: res.reason, deferred: res.deferred, maxDeferredTurns: cfg.maxDeferredTurns, postponed: res.postponed,
    sticky, fresh, unmatched, stores,
  };
  lastCacheReport = report;
  return report;
}

/** The request succeeded: store the state (or refresh its time). Runs at most once per generation. */
export function commitCache(ctx: GenerationContext, now = Date.now()): void {
  const c = ctx.cacheCommit;
  if (!c) return;
  ctx.cacheCommit = undefined;
  if (c.touch) touchCacheState(c.chat, now);
  else saveCacheState(c.chat, { ...c.next, at: now });
}
