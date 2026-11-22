import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setNativeFetch } from '@/st/host';

const stored = new Map<string, Blob>();
vi.mock('@/store/media-db', () => ({
  putBlob: vi.fn(async (b: Blob, o: { prefix?: string } = {}) => { const k = `${o.prefix ?? ''}${stored.size + 1}`; stored.set(k, b); return k; }),
  getBlob: vi.fn(async (k: string) => stored.get(k)),
  deleteBlob: vi.fn(async (k: string) => { stored.delete(k); }),
  base64Blob: (data: string, type: string) => new Blob([Buffer.from(data, 'base64')], { type }),
  blobBase64: async (b: Blob) => Buffer.from(await b.arrayBuffer()).toString('base64'),
  gc: vi.fn(),
}));
const preset = { id: 'p', image: {}, structures: { pic: { id: 'pic', kind: 'image' } } };
vi.mock('@/store/presets', () => ({ getPreset: () => preset }));

const { autoGenerateImages, deleteImage, generateImage, imageJobs, imageSettingsRuntime, jobKey, setImagePrompt } = await import('@/app/images');
const { mediaSettings, newImageConnection } = await import('@/store/media');

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 9]);
let chat: any[];
let requests: any[];
let ctx: any;

function sidecar(genId: string) {
  return { v: 1, presetId: 'p', genId, origin: 'story', structures: { pic: { images: [{ prompt: 'a cat', ratio: '1:1' }, { prompt: 'a dog' }] } }, stages: [], events: [] };
}

beforeEach(() => {
  stored.clear();
  imageJobs.clear();
  requests = [];
  const sc = sidecar('g1');
  chat = [{ is_user: false, mes: 'x', swipe_id: 0, swipes: ['x'], swipe_info: [{ extra: { advanced_preset: structuredClone(sc) } }], extra: { advanced_preset: sc } }];
  ctx = { chat, extensionSettings: {}, saveChat: async () => {}, saveSettingsDebounced: () => {}, getRequestHeaders: () => ({}) };
  (globalThis as any).SillyTavern = { getContext: () => ctx };
  const m = mediaSettings();
  const c = { ...newImageConnection('openai', 'c'), apiKey: 'k' };
  m.image = { enabled: true, auto: true, active: c.id, connections: [c] };
  m.cors.mode = 'off';
  setNativeFetch(async (url, init) => { requests.push({ url: String(url), body: JSON.parse(String(init?.body)) }); return new Response(JSON.stringify({ data: [{ b64_json: PNG.toString('base64') }] })); });
});

describe('image generation flow', () => {
  it('runtime vars follow the settings', () => {
    expect(imageSettingsRuntime().vars).toMatchObject({ on: true, auto: true, api: 'openai', prompt: 'instruction', style: false, sfw: true });
    mediaSettings().image.connections[0]!.promptType = 'description';
    expect(imageSettingsRuntime().vars.prompt).toBe('description');
    mediaSettings().image.enabled = false;
    expect(imageSettingsRuntime().vars.on).toBe(false);
  });

  it('auto-generates every prompt and stores keys in both sidecar copies', async () => {
    await autoGenerateImages(0);
    expect(requests.map((r) => r.body.prompt)).toEqual(['a cat', 'a dog']);
    expect(requests[0].body.size).toBe('1024x1024');
    const images = chat[0].extra.advanced_preset.images.pic;
    expect(images).toEqual([{ keys: ['img:1'], shown: 0 }, { keys: ['img:2'], shown: 0 }]);
    expect(chat[0].swipe_info[0].extra.advanced_preset.images.pic[1].keys).toEqual(['img:2']);
    // Already generated: nothing more.
    await autoGenerateImages(0);
    expect(requests).toHaveLength(2);
  });

  it('regenerating appends a version; edited prompts are used; deleting removes one', async () => {
    await generateImage(0, 'pic', 0);
    await setImagePrompt(0, 'pic', 0, 'a black cat');
    await generateImage(0, 'pic', 0);
    expect(requests.at(-1).body.prompt).toBe('a black cat');
    let rec = chat[0].extra.advanced_preset.images.pic[0];
    expect(rec).toMatchObject({ keys: ['img:1', 'img:2'], shown: 1, prompt: 'a black cat' });
    await deleteImage(0, 'pic', 0, 'img:2');
    rec = chat[0].extra.advanced_preset.images.pic[0];
    expect(rec.keys).toEqual(['img:1']);
    expect(rec.shown).toBe(0);
    expect(stored.has('img:2')).toBe(false);
  });

  it('a swiped-away turn still receives its image', async () => {
    let release!: () => void;
    setNativeFetch(async () => { await new Promise<void>((r) => { release = r; }); return new Response(JSON.stringify({ data: [{ b64_json: PNG.toString('base64') }] })); });
    const run = generateImage(0, 'pic', 0);
    await vi.waitFor(() => expect(release).toBeTypeOf('function'));
    // Swipe to a new turn while the image is generated.
    const next = sidecar('g2');
    chat[0].swipe_info.push({ extra: { advanced_preset: structuredClone(next) } });
    chat[0].swipe_id = 1;
    chat[0].extra.advanced_preset = next;
    release();
    await run;
    expect(chat[0].extra.advanced_preset.images).toBeUndefined();
    expect(chat[0].swipe_info[0].extra.advanced_preset.images.pic[0].keys).toEqual(['img:1']);
  });

  it('failures are kept as job errors', async () => {
    setNativeFetch(async () => new Response('{"error":{"message":"quota"}}', { status: 429 }));
    await generateImage(0, 'pic', 1);
    const j = imageJobs.get(jobKey('g1', 'pic', 1));
    expect(j?.status).toBe('error');
    expect(String((j as { error: Error }).error.message)).toBe('HTTP 429: quota');
    expect(chat[0].extra.advanced_preset.images).toBeUndefined();
  });

  it('offers and sends only global references and those of the chat\'s cards', async () => {
    Object.assign(ctx, { characters: [{ name: 'Ann', avatar: 'ann.png' }, { name: 'Bob', avatar: 'bob.png' }], characterId: 0 });
    const c = mediaSettings().image.connections[0]!;
    for (const [i, card] of [undefined, 'ann.png', 'bob.png'].entries()) {
      const blob = `ref:${i + 1}`;
      stored.set(blob, new Blob([PNG], { type: 'image/png' }));
      c.refs.push({ id: `ref${i + 1}`, description: `r${i + 1}`, blob, ...(card ? { card } : {}) });
    }
    expect(imageSettingsRuntime().refs.map((r) => r.id)).toEqual(['ref1', 'ref2']);
    chat[0].extra.advanced_preset.structures.pic.images[0].refs = ['ref1', 'ref2', 'ref3'];
    await generateImage(0, 'pic', 0);
    expect(requests[0].url).toMatch(/images\/edits$/);
    expect(requests[0].body.images).toHaveLength(2);
    // No character open: only the global ones.
    ctx.characterId = undefined;
    expect(imageSettingsRuntime().refs.map((r) => r.id)).toEqual(['ref1']);
  });

  it('auto generation off: nothing happens', async () => {
    mediaSettings().image.auto = false;
    await autoGenerateImages(0);
    expect(requests).toHaveLength(0);
  });
});
