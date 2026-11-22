/**
 * Binary store for multimodal data (IndexedDB `advanced-preset-media`): reference images and audio,
 * generated images, audio cache. Settings and chats only keep the keys.
 *
 * Key prefixes by convention: `ref:` reference images, `voice:` reference audio, `img:` generated
 * images, `tts:` audio cache.
 */
import { newId } from './media';

const DB_NAME = 'advanced-preset-media';
const STORE = 'blobs';

interface Row { blob: Blob; at: number }

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

function run<T>(mode: IDBTransactionMode, f: (store: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return db().then((d) => new Promise<T | undefined>((resolve, reject) => {
    const tx = d.transaction(STORE, mode);
    const req = f(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

/** Store a blob; returns its key (`prefix` + a new id unless `key` is given). */
export async function putBlob(blob: Blob, opts: { key?: string; prefix?: string } = {}): Promise<string> {
  const key = opts.key ?? `${opts.prefix ?? ''}${newId()}`;
  await run('readwrite', (s) => s.put({ blob, at: Date.now() } satisfies Row, key));
  return key;
}

export async function getBlob(key: string): Promise<Blob | undefined> {
  const row = await run<Row | undefined>('readonly', (s) => s.get(key));
  return row?.blob;
}

export async function hasBlob(key: string): Promise<boolean> {
  const n = await run<number>('readonly', (s) => s.count(key));
  return Boolean(n);
}

export async function deleteBlob(key: string): Promise<void> {
  revokeUrl(key);
  await run('readwrite', (s) => s.delete(key));
}

/** Keys starting with `prefix`. */
export async function listKeys(prefix = ''): Promise<string[]> {
  const range = prefix ? IDBKeyRange.bound(prefix, `${prefix}\uffff`) : undefined;
  const keys = await run<IDBValidKey[]>('readonly', (s) => s.getAllKeys(range));
  return (keys ?? []).map(String);
}

/**
 * Delete the blobs under `prefix` that `keep` does not list. `olderThanMs` spares recent entries
 * (e.g. a cache that is still being filled).
 */
export async function gc(prefix: string, keep: Set<string>, olderThanMs = 0): Promise<number> {
  const cutoff = Date.now() - olderThanMs;
  let removed = 0;
  for (const key of await listKeys(prefix)) {
    if (keep.has(key)) continue;
    if (olderThanMs) {
      const row = await run<Row | undefined>('readonly', (s) => s.get(key));
      if (row && row.at > cutoff) continue;
    }
    await deleteBlob(key);
    removed++;
  }
  return removed;
}

const urls = new Map<string, string>();

/** An object URL for a stored blob (cached until the blob is deleted); `undefined` when missing. */
export async function blobUrl(key: string): Promise<string | undefined> {
  const cached = urls.get(key);
  if (cached) return cached;
  const blob = await getBlob(key);
  if (!blob) return undefined;
  const url = URL.createObjectURL(blob);
  urls.set(key, url);
  return url;
}

function revokeUrl(key: string): void {
  const url = urls.get(key);
  if (url) { URL.revokeObjectURL(url); urls.delete(key); }
}

/** Base64 (no data: prefix) of a blob, for JSON request bodies. */
export async function blobBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export function base64Blob(data: string, type: string): Blob {
  const bin = atob(data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type });
}
