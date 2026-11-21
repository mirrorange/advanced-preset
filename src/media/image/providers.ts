/**
 * Image providers: request construction and response parsing for OpenAI (Image API), Gemini
 * (Interactions or generateContent) and NovelAI. The request body is the built-in default deep-merged
 * with the connection's body override; headers likewise.
 */
import type { ImageRatio } from '@advanced-preset/protocol';
import type { ImageConnection } from '@/store/media';
import { IMAGE_DEFAULTS } from '@/store/media';
import { base64Blob, blobBase64 } from '@/store/media-db';
import { ensureOk, mediaFetch } from '../net';
import { bodyOverride, deepMerge, joinUrl, mergeHeaders } from '../request';
import { sniffImage, unzip } from './zip';

export interface JobRef { id: string; description: string; blob: Blob }
export interface ImageJob {
  prompt: string;
  ratio?: ImageRatio;
  /** Reference images picked for this prompt (openai / gemini). */
  refs: JobRef[];
}
export interface BuiltRequest { url: string; init: RequestInit & { headers: Headers } }

type Obj = Record<string, unknown>;

/** The prompt with the connection's style prompt appended (a sentence for natural language, tags for NovelAI). */
export function styledPrompt(c: Pick<ImageConnection, 'api' | 'style'>, prompt: string): string {
  const p = prompt.trim();
  const style = c.style.trim();
  if (!style) return p;
  if (c.api === 'novelai') return `${p.replace(/[,\s]+$/, '')}, ${style.replace(/^[,\s]+/, '')}`;
  return `${p}\n\n${style}`;
}

const OPENAI_SIZES: Record<ImageRatio, string> = { '1:1': '1024x1024', '3:4': '1024x1536', '9:16': '1024x1536', '4:3': '1536x1024', '16:9': '1536x1024' };
const NOVELAI_SIZES: Record<ImageRatio, [number, number]> = { '1:1': [1024, 1024], '3:4': [832, 1216], '9:16': [832, 1216], '4:3': [1216, 832], '16:9': [1216, 832] };

const dataUrl = async (b: Blob) => `data:${b.type || 'image/png'};base64,${await blobBase64(b)}`;
const base = (c: ImageConnection) => c.baseUrl.trim() || IMAGE_DEFAULTS[c.api].baseUrl;
const model = (c: ImageConnection) => c.model.trim() || IMAGE_DEFAULTS[c.api].model;
const json = (headers: Headers, body: Obj): RequestInit & { headers: Headers } => ({ method: 'POST', headers, body: JSON.stringify(body) });

async function openaiRequest(c: ImageConnection, job: ImageJob): Promise<BuiltRequest> {
  const prompt = styledPrompt(c, job.prompt);
  const body: Obj = { model: model(c), prompt, n: 1, size: job.ratio ? OPENAI_SIZES[job.ratio] : 'auto' };
  if (job.refs.length) body.images = await Promise.all(job.refs.map(async (r) => ({ image_url: await dataUrl(r.blob) })));
  const headers = mergeHeaders({ 'Content-Type': 'application/json', ...(c.apiKey ? { Authorization: `Bearer ${c.apiKey}` } : {}) }, c);
  return { url: joinUrl(base(c), job.refs.length ? 'images/edits' : 'images/generations'), init: json(headers, deepMerge(body, bodyOverride(c))) };
}

/** Text that tells Gemini which reference image is which. */
const refLabel = (r: JobRef) => (r.description ? `Reference image ${r.id}: ${r.description}` : `Reference image ${r.id}`);

async function geminiRequest(c: ImageConnection, job: ImageJob): Promise<BuiltRequest> {
  const prompt = styledPrompt(c, job.prompt);
  const refs = await Promise.all(job.refs.map(async (r) => ({ ref: r, mime: r.blob.type || 'image/png', data: await blobBase64(r.blob) })));
  const key: Record<string, string> = c.apiKey ? { 'x-goog-api-key': c.apiKey } : {};
  if (c.endpoint === 'generateContent') {
    const parts: Obj[] = [];
    for (const r of refs) parts.push({ text: refLabel(r.ref) }, { inline_data: { mime_type: r.mime, data: r.data } });
    parts.push({ text: prompt });
    const generationConfig: Obj = { responseModalities: ['IMAGE'] };
    if (job.ratio) generationConfig.imageConfig = { aspectRatio: job.ratio };
    const headers = mergeHeaders({ 'Content-Type': 'application/json', ...key }, c);
    const body = deepMerge({ contents: [{ role: 'user', parts }], generationConfig }, bodyOverride(c));
    return { url: joinUrl(base(c), `models/${encodeURIComponent(model(c))}:generateContent`), init: json(headers, body) };
  }
  const input: Obj[] = [];
  for (const r of refs) input.push({ type: 'text', text: refLabel(r.ref) }, { type: 'image', mime_type: r.mime, data: r.data });
  input.push({ type: 'text', text: prompt });
  const format: Obj = { type: 'image' };
  if (job.ratio) format.aspect_ratio = job.ratio;
  const headers = mergeHeaders({ 'Content-Type': 'application/json', 'Api-Revision': '2026-05-20', ...key }, c);
  const body = deepMerge({ model: model(c), input, response_format: format }, bodyOverride(c));
  return { url: joinUrl(base(c), 'interactions'), init: json(headers, body) };
}

function novelaiRequest(c: ImageConnection, job: ImageJob): BuiltRequest {
  const prompt = styledPrompt(c, job.prompt);
  const negative = (c.negative ?? '').trim();
  const [width, height] = NOVELAI_SIZES[job.ratio ?? '3:4'];
  const parameters: Obj = {
    params_version: 3, width, height, scale: 5, sampler: 'k_euler_ancestral', steps: 28, n_samples: 1,
    ucPreset: 0, qualityToggle: true, sm: false, sm_dyn: false, dynamic_thresholding: false, cfg_rescale: 0,
    noise_schedule: 'karras', legacy: false, legacy_v3_extend: false, add_original_image: true, use_coords: false,
    seed: Math.floor(Math.random() * 4294967295), characterPrompts: [],
    v4_prompt: { caption: { base_caption: prompt, char_captions: [] }, use_coords: false, use_order: true },
    v4_negative_prompt: { caption: { base_caption: negative, char_captions: [] }, legacy_uc: false },
    negative_prompt: negative, deliberate_euler_ancestral_bug: false, prefer_brownian: true,
  };
  const headers = mergeHeaders({ 'Content-Type': 'application/json', ...(c.apiKey ? { Authorization: `Bearer ${c.apiKey}` } : {}) }, c);
  const body = deepMerge({ input: prompt, model: model(c), action: 'generate', parameters }, bodyOverride(c));
  return { url: joinUrl(base(c), 'ai/generate-image'), init: json(headers, body) };
}

/** The HTTP request for one image prompt (reference images are dropped for NovelAI). */
export async function buildImageRequest(c: ImageConnection, job: ImageJob): Promise<BuiltRequest> {
  switch (c.api) {
    case 'openai': return openaiRequest(c, job);
    case 'gemini': return geminiRequest(c, job);
    case 'novelai': return novelaiRequest(c, { ...job, refs: [] });
  }
}

/** Inline images anywhere in a Gemini response (Interactions `{ type: 'image', data }`, generateContent `inlineData`). */
export function geminiImages(j: unknown): { mime: string; data: string }[] {
  const out: { mime: string; data: string }[] = [];
  const walk = (v: unknown, key = ''): void => {
    if (!v || typeof v !== 'object' || key === 'input' || key === 'contents') return;
    if (Array.isArray(v)) { v.forEach((x) => walk(x)); return; }
    const o = v as Obj;
    const inline = (o.inlineData ?? o.inline_data) as Obj | undefined;
    if (inline && typeof inline.data === 'string') { out.push({ mime: String(inline.mimeType ?? inline.mime_type ?? 'image/png'), data: inline.data }); return; }
    if (o.type === 'image' && typeof o.data === 'string') { out.push({ mime: String(o.mime_type ?? o.mimeType ?? 'image/png'), data: o.data }); return; }
    for (const [k, x] of Object.entries(o)) walk(x, k);
  };
  // Interactions: images of model output steps; the `output_image` convenience field repeats the last one.
  const steps = (j as { steps?: { type?: string; content?: unknown }[] })?.steps;
  if (Array.isArray(steps)) steps.filter((s) => s.type === 'model_output').forEach((s) => walk(s.content));
  if (!out.length) walk(j);
  const seen = new Set<string>();
  return out.filter((x) => (seen.has(x.data) ? false : (seen.add(x.data), true)));
}

/** Text the model returned instead of an image (refusals), for the error message. */
function geminiText(j: unknown): string {
  const texts: string[] = [];
  const walk = (v: unknown, key = ''): void => {
    if (!v || typeof v !== 'object' || key === 'input' || key === 'contents') return;
    if (Array.isArray(v)) { v.forEach((x) => walk(x)); return; }
    const o = v as Obj;
    if (typeof o.text === 'string' && !o.thought) texts.push(o.text);
    for (const [k, x] of Object.entries(o)) if (k !== 'text') walk(x, k);
  };
  walk(j);
  const reason = (j as { candidates?: { finishReason?: string }[]; promptFeedback?: { blockReason?: string } })?.promptFeedback?.blockReason
    ?? (j as { candidates?: { finishReason?: string }[] })?.candidates?.[0]?.finishReason;
  return [texts.join(' ').trim(), reason && reason !== 'STOP' ? reason : ''].filter(Boolean).join(' · ');
}

const blobOf = (bytes: Uint8Array, fallback = 'image/png') => new Blob([bytes as BlobPart], { type: sniffImage(bytes) ?? fallback });

/** Images of a successful response. */
export async function readImages(c: ImageConnection, res: Response, signal?: AbortSignal): Promise<Blob[]> {
  if (c.api === 'novelai') {
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (sniffImage(bytes)) return [blobOf(bytes)];
    const entries = await unzip(bytes);
    return entries.filter((e) => sniffImage(e.data)).map((e) => blobOf(e.data));
  }
  const j = (await res.json()) as unknown;
  if (c.api === 'gemini') {
    const images = geminiImages(j).map((x) => base64Blob(x.data, x.mime));
    if (!images.length) throw new Error(geminiText(j) || 'No image in the response');
    return images;
  }
  const data = ((j as { data?: { b64_json?: string; url?: string }[] })?.data ?? []);
  const out: Blob[] = [];
  for (const d of data) {
    if (d.b64_json) { const b = base64Blob(d.b64_json, 'image/png'); out.push(blobOf(new Uint8Array(await b.arrayBuffer()))); }
    else if (d.url) out.push(await (await ensureOk(await mediaFetch(d.url, { signal }))).blob());
  }
  if (!out.length) throw new Error('No image in the response');
  return out;
}

/** Generate the images of one prompt. */
export async function requestImages(c: ImageConnection, job: ImageJob, signal?: AbortSignal): Promise<Blob[]> {
  const { url, init } = await buildImageRequest(c, job);
  const res = await ensureOk(await mediaFetch(url, { ...init, signal }));
  return readImages(c, res, signal);
}
