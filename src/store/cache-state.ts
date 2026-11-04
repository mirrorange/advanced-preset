/**
 * Sticky-rendering state per chat (cache optimization). Kept in localStorage rather than in the
 * chat file: it is only useful while the provider cache lives, and survives a page reload.
 */
import type { CacheState } from '@/core/cache';
import { st } from '@/st/host';

const STORAGE_KEY = 'advanced-preset.cache.v1';
/** States older than this are dropped regardless of the configured TTL. */
const MAX_AGE_MS = 24 * 60 * 60_000;
const MAX_CHATS = 30;

type Store = Record<string, CacheState>;

let memory: Store | null = null;

function storage(): Storage | null {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

function load(): Store {
  if (memory) return memory;
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    memory = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    memory = {};
  }
  return memory!;
}

function persist(store: Store, now: number): void {
  const live = Object.entries(store).filter(([, s]) => s && now - s.at <= MAX_AGE_MS).sort((a, b) => b[1].at - a[1].at).slice(0, MAX_CHATS);
  memory = Object.fromEntries(live);
  try { storage()?.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* quota / private mode: memory only */ }
}

/** Key of the open chat. */
export function currentChatKey(): string {
  const c = st();
  return String(c.getCurrentChatId?.() || `${c.characterId ?? ''}|${c.groupId ?? ''}`);
}

/** Key of a storyline's state (storylines keep separate states; the main storyline uses the chat's key). */
export const storylineCacheKey = (chat: string, storyline: string | undefined): string => (storyline ? `${chat}\u0001${storyline}` : chat);

export function cacheState(chat: string): CacheState | undefined {
  return load()[chat];
}

export function saveCacheState(chat: string, state: CacheState): void {
  const store = { ...load(), [chat]: state };
  persist(store, state.at);
}

/** A request that hit the stored state refreshes its time only. */
export function touchCacheState(chat: string, at: number): void {
  const s = load()[chat];
  if (s) saveCacheState(chat, { ...s, at });
}

/**
 * Storylines renamed or swapped (rename, switching the main storyline): their states follow them.
 * `moves` maps old storyline keys to new ones (`''`: the main storyline); applied at once, so a swap works.
 */
export function moveStorylineCacheStates(chat: string, moves: ReadonlyArray<readonly [string, string]>): void {
  const store = load();
  const key = (line: string) => storylineCacheKey(chat, line);
  if (!moves.some(([from, to]) => key(from) in store || key(to) in store)) return;
  const next: Store = { ...store };
  // Targets lose whatever they had (a stale state of an earlier storyline with that name), sources move.
  for (const [from, to] of moves) { delete next[key(from)]; delete next[key(to)]; }
  for (const [from, to] of moves) if (store[key(from)]) next[key(to)] = store[key(from)]!;
  persist(next, Date.now());
}

export function clearCacheState(chat?: string): void {
  const store = { ...load() };
  if (chat) delete store[chat]; else for (const k of Object.keys(store)) delete store[k];
  persist(store, Date.now());
}

/** Tests: forget the in-memory copy. */
export function resetCacheStateMemory(): void { memory = null; }
