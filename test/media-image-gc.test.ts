import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setNativeFetch } from '@/st/host';

const store = new Map<string, number>();
vi.mock('@/store/media-db', () => ({
  listKeys: vi.fn(async (prefix: string) => [...store.keys()].filter((k) => k.startsWith(prefix))),
  gc: vi.fn(async (prefix: string, keep: Set<string>) => {
    let n = 0;
    for (const k of [...store.keys()]) if (k.startsWith(prefix) && !keep.has(k)) { store.delete(k); n++; }
    return n;
  }),
}));

const { cleanImages, referencedImageKeys } = await import('@/app/image-gc');

const side = (key: string) => ({ extra: { advanced_preset: { images: { pic: [{ keys: [key] }] } } } });
let routes: Record<string, (body: any) => unknown>;

beforeEach(() => {
  store.clear();
  for (const k of ['img:a', 'img:b', 'img:c', 'img:d', 'img:e', 'ref:x']) store.set(k, 0);
  const ctx = { chat: [side('img:e')], getRequestHeaders: () => ({ 'Content-Type': 'application/json' }) };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
  routes = {
    '/api/characters/all': () => [{ name: 'Alice', avatar: 'alice.png' }, { name: 'Bob', avatar: 'bob.png' }],
    '/api/characters/chats': (b) => (b.avatar_url === 'alice.png' ? [{ file_name: 'one.jsonl' }, { file_name: 'two.jsonl' }] : { error: true }),
    '/api/chats/get': (b) => (b.file_name === 'one' ? [{ chat_metadata: {} }, side('img:a')] : [{}, { swipe_info: [side('img:b')] }]),
    '/api/groups/all': () => [{ chats: ['g1'] }],
    '/api/chats/group/get': () => [{}, side('img:c')],
  };
  setNativeFetch(async (url, init) => new Response(JSON.stringify(routes[String(url)]!(JSON.parse(String(init?.body))))));
});

describe('image cleanup', () => {
  it('collects keys from character chats, swipes, group chats and the chat in memory', async () => {
    const progress: number[] = [];
    const keys = await referencedImageKeys((p) => progress.push(p.done));
    expect([...keys].sort()).toEqual(['img:a', 'img:b', 'img:c', 'img:e']);
    expect(progress).toEqual([0, 1, 2, 3]);
  });

  it('deletes only unreferenced generated images', async () => {
    expect(await cleanImages()).toEqual({ removed: 1, kept: 4 });
    expect(store.has('img:d')).toBe(false);
    expect(store.has('ref:x')).toBe(true);
  });

  it('deletes nothing when a chat cannot be read', async () => {
    routes['/api/chats/group/get'] = () => ({});
    await expect(cleanImages()).rejects.toThrow('unreadable chat');
    expect(store.size).toBe(6);
  });
});
