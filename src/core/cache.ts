/**
 * Cache optimization: sticky rendering of the history (I-100 – I-104).
 *
 * Token saving, recent synopses and annotation re-injection are sliding windows: every request
 * renders some older message differently, so the provider's prompt cache breaks there. With sticky
 * rendering each history message keeps the rendering of the previous request while the cache may
 * still hit; only messages after the first unavoidable difference (new messages, edits, depth
 * injections …) follow the current rules. Everything is applied at once when the cache is lost
 * anyway (TTL, model / source, tools / schema, the prompt before the history) or after too many
 * postponed requests.
 *
 * Flow: the interceptor (or the script-path backfill) renders every message both ways and hands
 * ST the sticky text with an invisible marker; at PROMPT_READY the markers identify the messages,
 * {@link resolveSticky} decides from where on the fresh rendering is used, and the state is stored
 * once the request succeeded.
 */
import type { CacheConfig } from '@advanced-preset/protocol';
import { decodeMode, encodeMode, planHistory, renderItem, type HistoryItem, type RewriteOptions } from './history';

// ---- hashing ---------------------------------------------------------------------------------

/** cyrb53: fast 53-bit string hash (base36). Only used to compare prompts between requests. */
export function hashText(text: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** Stable identity of a chat message across requests (send date, side and speaker). */
export function messageKey(m: Pick<HistoryItem, 'is_user' | 'name' | 'send_date'>, fallback: number): string {
  return m.send_date ? hashText(`${m.send_date}|${m.is_user ? 'u' : 'a'}|${m.name ?? ''}`) : `#${fallback}`;
}

// ---- markers ---------------------------------------------------------------------------------

/** One private-use character per message: no word characters, so world info keys never match. */
const MARK_BASE = 0xe000;
export const MAX_MARKED = 0xf8ff - MARK_BASE + 1;
export const MARK_RE = /⟦([\uE000-\uF8FF])⟧/g;
export const markerOf = (k: number) => `⟦${String.fromCharCode(MARK_BASE + k)}⟧`;

/** Marker indices found in `text` and the text without them. */
export function takeMarkers(text: string): { text: string; marks: number[] } {
  const marks: number[] = [];
  const out = text.replace(MARK_RE, (_, c: string) => { marks.push(c.charCodeAt(0) - MARK_BASE); return ''; });
  return { text: out, marks };
}

// ---- sticky rewrite (interceptor / backfill) ---------------------------------------------------

/** One history message rendered both ways. `null` = left out. */
export interface StickyEntry {
  key: string;
  /** Text handed to ST: the sticky rendering, or the fresh one when the sticky rendering leaves it out. */
  given: string;
  sticky: string | null;
  fresh: string | null;
  stickyMode: string;
  freshMode: string;
}

export interface StickyRewrite {
  /** Items to hand over, in order; `entry` is set for marked messages. */
  out: { item: HistoryItem; index: number; entry?: number }[];
  entries: StickyEntry[];
  /** Modes of messages left out both ways (kept for the next request). */
  omitted: Record<string, string>;
}

/**
 * Renders every planned message with its previous mode (`prev`, by message key) and with the
 * current rules. Messages without a previous mode, and those fixed by recap coverage, render fresh.
 */
export function stickyRewrite(items: HistoryItem[], o: RewriteOptions, prev: Record<string, string> | undefined, keyOf: (index: number) => string): StickyRewrite {
  const out: StickyRewrite['out'] = [];
  const entries: StickyEntry[] = [];
  const omitted: Record<string, string> = {};
  for (const p of planHistory(items, o)) {
    if (!p.fresh) { out.push({ item: p.item, index: p.index }); continue; }
    const key = keyOf(p.index);
    const kept = p.forced ? undefined : decodeMode(prev?.[key]);
    const stickyMode = kept ?? p.fresh;
    const fresh = renderItem(p, p.fresh, o);
    const sticky = kept ? renderItem(p, stickyMode, o) : fresh;
    const given = sticky ?? fresh;
    if (given === null) { omitted[key] = encodeMode(stickyMode); continue; }
    if (entries.length >= MAX_MARKED) { if (fresh !== null) out.push({ item: { ...p.item, mes: fresh }, index: p.index }); continue; }
    out.push({ item: { ...p.item, mes: given }, index: p.index, entry: entries.length });
    entries.push({ key, given, sticky, fresh, stickyMode: encodeMode(stickyMode), freshMode: encodeMode(p.fresh) });
  }
  return { out, entries, omitted };
}

// ---- resolution (PROMPT_READY) ---------------------------------------------------------------

/** Everything before the history that invalidates the whole cache when it changes. */
export interface CacheFingerprint {
  /** Chat Completion source, model and endpoint. */
  model: string;
  /** Tools / schema of the request (hash). */
  tools: string;
  /** Prompt messages before the history (hash). */
  prompt: string;
}

export type FlushReason = 'first' | 'ttl' | 'model' | 'tools' | 'prompt' | 'turns';

export interface CacheState extends CacheFingerprint {
  v: 1;
  /** Time of the last successful request. */
  at: number;
  /** Hash of every history message sent, in order (including messages AP does not render). */
  seq: string[];
  /** Render mode of each AP-rendered message by message key. */
  modes: Record<string, string>;
  /** Consecutive requests that postponed at least one rendering change. */
  deferred: number;
}

/** A history message of the final prompt. Foreign messages (depth injections …) have no key. */
export interface Candidate {
  sticky: string | null;
  fresh: string | null;
  key?: string;
  stickyMode?: string;
  freshMode?: string;
}

export interface Resolution {
  /** Candidates before this index use the sticky rendering, the rest the fresh one. */
  from: number;
  reason: FlushReason | null;
  deferred: number;
  /** State to store once the request succeeded (`at` is set then). */
  next: Omit<CacheState, 'at'>;
  /** Messages kept sticky although their rendering would change now. */
  postponed: number;
}

export function flushReason(prev: CacheState | undefined, fp: CacheFingerprint, cfg: CacheConfig, now: number): FlushReason | null {
  if (!prev || prev.v !== 1) return 'first';
  if (cfg.ttlMinutes > 0 && now - prev.at > cfg.ttlMinutes * 60_000) return 'ttl';
  if (prev.model !== fp.model) return 'model';
  if (prev.tools !== fp.tools) return 'tools';
  if (prev.prompt !== fp.prompt) return 'prompt';
  return null;
}

/**
 * Decides from which history message on the fresh rendering is used:
 * - a flush reason (or too many postponed requests) applies everything at once;
 * - otherwise the sticky rendering is kept up to the first message whose sticky text differs from
 *   what the previous request sent — the cache misses from there anyway.
 */
export function resolveSticky(cands: Candidate[], prev: CacheState | undefined, fp: CacheFingerprint, cfg: CacheConfig, now: number, omitted: Record<string, string> = {}): Resolution {
  let reason = flushReason(prev, fp, cfg, now);
  let from = 0;
  /** The same history as the previous request (regenerate, swipe, retry): not a new round. */
  let repeat = false;
  if (!reason) {
    const seq = prev!.seq;
    let j = 0;
    from = cands.length;
    for (let i = 0; i < cands.length; i++) {
      const s = cands[i]!.sticky;
      if (s === null) continue;
      if (j < seq.length && hashText(s) === seq[j]) { j++; continue; }
      from = i;
      break;
    }
    repeat = from === cands.length && j === seq.length;
  }
  const postponedBefore = (n: number) => cands.slice(0, n).filter((c) => c.key !== undefined && c.sticky !== c.fresh).length;
  let postponed = postponedBefore(from);
  const before = prev?.deferred ?? 0;
  let deferred = postponed ? (repeat ? Math.max(before, 1) : before + 1) : 0;
  if (!reason && postponed && deferred > cfg.maxDeferredTurns) { reason = 'turns'; from = 0; postponed = 0; deferred = 0; }
  if (reason) deferred = 0;

  const seq: string[] = [];
  const modes: Record<string, string> = { ...omitted };
  cands.forEach((c, i) => {
    const sticky = i < from;
    const text = sticky ? c.sticky : c.fresh;
    if (text !== null) seq.push(hashText(text));
    const mode = sticky ? c.stickyMode : c.freshMode;
    if (c.key !== undefined && mode) modes[c.key] = mode;
  });
  return { from, reason, deferred, postponed, next: { v: 1, ...fp, seq, modes, deferred } };
}

// ---- applying a choice to ST's message content -----------------------------------------------

/**
 * ST may prefix the name and drops `\r` after the interceptor; the rendering is swapped inside
 * whatever surrounds the given text. Returns `undefined` when the given text cannot be found.
 */
export function swapInside(content: string, given: string, replacement: string | null): string | null | undefined {
  if (replacement === null) return null;
  const g = given.replace(/\r/g, '');
  const r = replacement.replace(/\r/g, '');
  if (content === g) return r;
  const at = content.endsWith(g) ? content.length - g.length : content.lastIndexOf(g);
  if (at < 0) return undefined;
  return content.slice(0, at) + r + content.slice(at + g.length);
}
