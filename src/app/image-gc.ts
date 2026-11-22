/**
 * Cleanup of generated images (`img:` keys in the media store) that no chat refers to any more:
 * deleted messages / swipes / chats. Scans every character and group chat as stored by the host
 * (plus the chat in memory); if any chat cannot be read nothing is deleted. Recent images are kept
 * (their chat may not be saved yet).
 */
import { nativeFetch, st } from '@/st/host';
import { gc, listKeys } from '@/store/media-db';

const KEY_RE = /img:[A-Za-z0-9-]+/g;
const RECENT_MS = 10 * 60_000;

export interface ImageGcProgress { done: number; total: number }

async function post(path: string, body: unknown): Promise<string> {
  const res = await nativeFetch(path, { method: 'POST', headers: st().getRequestHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

const keysIn = (text: string, into: Set<string>) => { for (const m of text.matchAll(KEY_RE)) into.add(m[0]); };

/** A chat file's content; only an array counts (the host answers `{}` for errors). */
function chatText(raw: string, what: string): string {
  const v = JSON.parse(raw) as unknown;
  if (!Array.isArray(v)) throw new Error(`${what}: unreadable chat`);
  return raw;
}

/** Every `img:` key any stored chat (or the chat in memory) refers to. */
export async function referencedImageKeys(onProgress?: (p: ImageGcProgress) => void): Promise<Set<string>> {
  const keys = new Set<string>();
  keysIn(JSON.stringify(st().chat ?? []), keys);
  const jobs: (() => Promise<void>)[] = [];
  const characters = JSON.parse(await post('/api/characters/all', {})) as { avatar?: string; name?: string }[];
  for (const c of characters) {
    if (!c.avatar) continue;
    const list = JSON.parse(await post('/api/characters/chats', { avatar_url: c.avatar, simple: true })) as { file_name?: string }[] | { error: true };
    if (!Array.isArray(list)) continue; // no chat folder
    for (const f of list) {
      const file = String(f.file_name ?? '').replace(/\.jsonl$/, '');
      if (file) jobs.push(async () => keysIn(chatText(await post('/api/chats/get', { ch_name: c.name, file_name: file, avatar_url: c.avatar }), file), keys));
    }
  }
  const groups = JSON.parse(await post('/api/groups/all', {})) as { chats?: string[] }[];
  for (const g of groups) {
    for (const id of g.chats ?? []) jobs.push(async () => keysIn(chatText(await post('/api/chats/group/get', { id }), id), keys));
  }
  let done = 0;
  onProgress?.({ done, total: jobs.length });
  for (const job of jobs) {
    await job();
    onProgress?.({ done: ++done, total: jobs.length });
  }
  return keys;
}

/** Delete generated images no chat refers to. Returns how many were removed and kept. */
export async function cleanImages(onProgress?: (p: ImageGcProgress) => void): Promise<{ removed: number; kept: number }> {
  const keep = await referencedImageKeys(onProgress);
  const before = (await listKeys('img:')).length;
  const removed = await gc('img:', keep, RECENT_MS);
  return { removed, kept: before - removed };
}
