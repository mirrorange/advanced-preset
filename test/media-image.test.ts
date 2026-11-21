import { deflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { buildImageRequest, geminiImages, readImages, styledPrompt, type ImageJob } from '@/media/image/providers';
import { sniffImage, unzip } from '@/media/image/zip';
import { nextRefId } from '@/media/image/refs';
import { changeImageApi, newImageConnection, type ImageConnection } from '@/store/media';

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const b64 = (b: Uint8Array) => Buffer.from(b).toString('base64');

const conn = (api: ImageConnection['api'], over: Partial<ImageConnection> = {}): ImageConnection => ({ ...newImageConnection(api, 'c'), apiKey: 'KEY', ...over });
const job = (over: Partial<ImageJob> = {}): ImageJob => ({ prompt: 'a cat on a roof', refs: [], ...over });
const bodyOf = async (c: ImageConnection, j: ImageJob) => {
  const r = await buildImageRequest(c, j);
  return { url: r.url, headers: r.init.headers, body: JSON.parse(String(r.init.body)) };
};

describe('style prompt', () => {
  it('appends a sentence for natural language and tags for NovelAI', () => {
    expect(styledPrompt({ api: 'openai', style: 'Watercolor.' }, 'A cat. ')).toBe('A cat.\n\nWatercolor.');
    expect(styledPrompt({ api: 'novelai', style: ', watercolor' }, '1girl, smile,')).toBe('1girl, smile, watercolor');
    expect(styledPrompt({ api: 'gemini', style: ' ' }, 'x')).toBe('x');
  });
});

describe('OpenAI', () => {
  it('generations without references, size from the ratio', async () => {
    const { url, headers, body } = await bodyOf(conn('openai', { style: 'ink' }), job({ ratio: '16:9' }));
    expect(url).toBe('https://api.openai.com/v1/images/generations');
    expect(headers.get('Authorization')).toBe('Bearer KEY');
    expect(body).toMatchObject({ model: 'gpt-image-2.6-flare', prompt: 'a cat on a roof\n\nink', n: 1, size: '1536x1024' });
    expect(body.images).toBeUndefined();
  });

  it('edits (JSON) with references; overrides merge', async () => {
    const c = conn('openai', { baseUrl: 'https://relay.dev/v1/', body: '{"quality":"high","n":null}', headers: { 'X-Relay': '1' } });
    const { url, headers, body } = await bodyOf(c, job({ refs: [{ id: 'ref1', description: 'hero', blob: new Blob([PNG], { type: 'image/png' }) }] }));
    expect(url).toBe('https://relay.dev/v1/images/edits');
    expect(headers.get('x-relay')).toBe('1');
    expect(body.images).toEqual([{ image_url: `data:image/png;base64,${b64(PNG)}` }]);
    expect(body.quality).toBe('high');
    expect('n' in body).toBe(false);
  });

  it('reads b64_json images', async () => {
    const res = new Response(JSON.stringify({ data: [{ b64_json: b64(PNG) }] }));
    const [img] = await readImages(conn('openai'), res);
    expect(img!.type).toBe('image/png');
    expect(new Uint8Array(await img!.arrayBuffer())).toEqual(PNG);
  });
});

describe('Gemini', () => {
  const ref = { id: 'ref2', description: 'the inn', blob: new Blob([PNG], { type: 'image/png' }) };

  it('Interactions request: labelled references, aspect ratio', async () => {
    const { url, headers, body } = await bodyOf(conn('gemini'), job({ ratio: '3:4', refs: [ref] }));
    expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/interactions');
    expect(headers.get('x-goog-api-key')).toBe('KEY');
    expect(body.model).toBe('gemini-nano-banana-2.1');
    expect(body.input).toEqual([
      { type: 'text', text: 'Reference image ref2: the inn' },
      { type: 'image', mime_type: 'image/png', data: b64(PNG) },
      { type: 'text', text: 'a cat on a roof' },
    ]);
    expect(body.response_format).toEqual({ type: 'image', aspect_ratio: '3:4' });
  });

  it('generateContent request', async () => {
    const { url, body } = await bodyOf(conn('gemini', { endpoint: 'generateContent', model: 'gemini-2.5-flash-image' }), job({ ratio: '16:9', refs: [ref] }));
    expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent');
    expect(body.contents[0].parts.at(-1)).toEqual({ text: 'a cat on a roof' });
    expect(body.contents[0].parts[1]).toEqual({ inline_data: { mime_type: 'image/png', data: b64(PNG) } });
    expect(body.generationConfig).toEqual({ responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } });
  });

  it('finds images in both response shapes, not in echoed input', () => {
    const interaction = {
      input: [{ type: 'image', data: 'IN' }],
      steps: [{ type: 'user_input', content: [{ type: 'image', data: 'IN' }] }, { type: 'model_output', content: [{ type: 'text', text: 'Here' }, { type: 'image', mime_type: 'image/jpeg', data: 'OUT' }] }],
      output_image: { type: 'image', mime_type: 'image/jpeg', data: 'OUT' },
    };
    expect(geminiImages(interaction)).toEqual([{ mime: 'image/jpeg', data: 'OUT' }]);
    const gc = { candidates: [{ content: { parts: [{ text: 'x' }, { inlineData: { mimeType: 'image/png', data: 'A' } }] } }] };
    expect(geminiImages(gc)).toEqual([{ mime: 'image/png', data: 'A' }]);
  });

  it('reports the model text when no image came back', async () => {
    const res = new Response(JSON.stringify({ candidates: [{ finishReason: 'IMAGE_SAFETY', content: { parts: [{ text: 'I cannot draw that.' }] } }] }));
    await expect(readImages(conn('gemini'), res)).rejects.toThrow('I cannot draw that. · IMAGE_SAFETY');
  });
});

/** A ZIP with one deflated entry. */
function zipOf(name: string, data: Uint8Array): Uint8Array {
  const comp = deflateRawSync(data);
  const n = Buffer.from(name);
  const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(8, 8); local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(n.length, 26);
  const cd = Buffer.alloc(46); cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(8, 10); cd.writeUInt32LE(comp.length, 20); cd.writeUInt32LE(data.length, 24); cd.writeUInt16LE(n.length, 28); cd.writeUInt32LE(0, 42);
  const cdOffset = local.length + n.length + comp.length;
  const eocd = Buffer.alloc(22); eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(1, 8); eocd.writeUInt16LE(1, 10); eocd.writeUInt32LE(cd.length + n.length, 12); eocd.writeUInt32LE(cdOffset, 16);
  return new Uint8Array(Buffer.concat([local, n, comp, cd, n, eocd]));
}

describe('NovelAI', () => {
  it('request: tags with style, negative prompt, size from the ratio; no references', async () => {
    const c = conn('novelai', { style: 'watercolor', negative: 'lowres' });
    const { url, body } = await bodyOf(c, job({ prompt: '1girl, smile', ratio: '16:9', refs: [{ id: 'r', description: '', blob: new Blob([PNG]) }] }));
    expect(url).toBe('https://image.novelai.net/ai/generate-image');
    expect(body.input).toBe('1girl, smile, watercolor');
    expect(body.model).toBe('nai-diffusion-4-5-full');
    expect(body.parameters).toMatchObject({ width: 1216, height: 832, negative_prompt: 'lowres' });
    expect(body.parameters.v4_prompt.caption.base_caption).toBe('1girl, smile, watercolor');
    expect(body.parameters.v4_negative_prompt.caption.base_caption).toBe('lowres');
  });

  it('reads the zipped image', async () => {
    const [img] = await readImages(conn('novelai'), new Response(zipOf('image_0.png', PNG) as BodyInit));
    expect(img!.type).toBe('image/png');
    expect(new Uint8Array(await img!.arrayBuffer())).toEqual(PNG);
  });

  it('unzip and sniff', async () => {
    expect((await unzip(zipOf('a.png', PNG)))[0]!.name).toBe('a.png');
    await expect(unzip(new Uint8Array(30))).rejects.toThrow('Not a ZIP');
    expect(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0]))).toBe('image/jpeg');
    expect(sniffImage(new TextEncoder().encode('<svg xmlns="…"></svg>'))).toBe('image/svg+xml');
  });
});

describe('connections', () => {
  it('switching API keeps edited endpoint / model, follows defaults otherwise', () => {
    const c = newImageConnection('openai', 'c');
    changeImageApi(c, 'novelai');
    expect(c).toMatchObject({ api: 'novelai', baseUrl: 'https://image.novelai.net', model: 'nai-diffusion-4-5-full', nsfwBlock: false });
    c.model = 'my-model';
    c.nsfwBlock = true;
    changeImageApi(c, 'gemini');
    expect(c).toMatchObject({ api: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', model: 'my-model', nsfwBlock: true });
  });
  it('reference ids', () => {
    expect(nextRefId([])).toBe('ref1');
    expect(nextRefId([{ id: 'ref1' }, { id: 'ref3' }])).toBe('ref2');
  });
});
