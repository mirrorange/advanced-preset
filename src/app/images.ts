/**
 * Image generation for messages: the `image.*` runtime for the engine, generating the images of a
 * message's image prompts (automatically after the reply, or on request) and keeping the results in
 * the sidecar (`images`, keys into the media store).
 */
import { reactive } from 'vue';
import { IMAGE_OFF, normalizeImages, type APreset, type ImagePrompt, type StructureDecl } from '@advanced-preset/protocol';
import { st, type STMessage } from '@/st/host';
import { provideMedia } from '@/core/media-vars';
import { getPreset } from '@/store/presets';
import { getSidecar, SIDECAR_KEY, writeSidecar, type Sidecar, type SidecarImage } from '@/store/sidecar';
import { activeConnection, mediaSettings, supportsRefs, type ImageConnection } from '@/store/media';
import { deleteBlob, getBlob, putBlob } from '@/store/media-db';
import { requestImages, type JobRef } from '@/media/image/providers';
import { chatRefs } from '@/media/image/refs';
import { bumpChat } from '@/ui/state';

export type ImageJobState = { status: 'running'; abort: AbortController } | { status: 'error'; error: unknown };

/** Running / failed generations by `genId:structure:index` (not persisted). */
export const imageJobs = reactive(new Map<string, ImageJobState>());
export const jobKey = (genId: string, structure: string, index: number) => `${genId}:${structure}:${index}`;

/** The selected image connection while image generation is on. */
export function imageConnection(): ImageConnection | undefined {
  const m = mediaSettings().image;
  return m.enabled ? activeConnection(m) : undefined;
}

/** Image values for the engine (it ANDs them with the preset's declaration). */
export function imageSettingsRuntime() {
  const m = mediaSettings().image;
  const c = imageConnection();
  if (!c) return { vars: { ...IMAGE_OFF }, refs: [] };
  const refs = supportsRefs(c.api) ? chatRefs(c).map((r) => ({ id: r.id, description: r.description })) : [];
  return {
    vars: { on: true, auto: m.auto, api: c.api, prompt: c.promptType, style: Boolean(c.style.trim()), sfw: c.nsfwBlock, refs: refs.length > 0 },
    refs,
  };
}

export const imageStructures = (preset: APreset | undefined): StructureDecl[] =>
  preset?.image ? Object.values(preset.structures).filter((s) => s.kind === 'image') : [];

/** Image prompts of an image structure in a sidecar. */
export const promptsOf = (sc: Sidecar | undefined, id: string): ImagePrompt[] => normalizeImages(sc?.structures?.[id])?.images ?? [];

/** The prompt to generate from (the user's edit, else the model's). */
export const effectivePrompt = (sc: Sidecar | undefined, id: string, index: number): string =>
  sc?.images?.[id]?.[index]?.prompt ?? promptsOf(sc, id)[index]?.prompt ?? '';

/**
 * The message whose sidecar (current swipe or another swipe slot) has `genId`. The message index is
 * a hint: messages may have been deleted or swiped since the job started.
 */
function locate(genId: string, hint: number): { mesId: number; swipe: number | null } | null {
  const chat = st().chat;
  const check = (i: number) => {
    const m = chat[i];
    if (!m || m.is_user) return null;
    if (getSidecar(m)?.genId === genId) return { mesId: i, swipe: null };
    const s = m.swipe_info?.findIndex((x) => (x?.extra?.[SIDECAR_KEY] as Sidecar | undefined)?.genId === genId) ?? -1;
    return s >= 0 && s !== (m.swipe_id ?? 0) ? { mesId: i, swipe: s } : null;
  };
  const near = check(hint);
  if (near) return near;
  for (let i = chat.length - 1; i >= 0; i--) { const r = check(i); if (r) return r; }
  return null;
}

/** Change the image records of the sidecar with `genId`, wherever it is now; saves the chat. */
export async function updateImages(genId: string, hint: number, mutate: (images: Record<string, SidecarImage[]>) => void): Promise<boolean> {
  const at = locate(genId, hint);
  if (!at) return false;
  const msg = st().chat[at.mesId] as STMessage;
  if (at.swipe === null) {
    const sc = getSidecar(msg)!;
    const images = structuredClone(sc.images ?? {});
    mutate(images);
    writeSidecar(at.mesId, { ...sc, images });
  } else {
    const sc = msg.swipe_info![at.swipe]!.extra![SIDECAR_KEY] as Sidecar;
    const images = structuredClone(sc.images ?? {});
    mutate(images);
    sc.images = images;
  }
  bumpChat();
  await st().saveChat();
  return true;
}

const slot = (images: Record<string, SidecarImage[]>, id: string, index: number): SidecarImage => {
  const list = (images[id] ??= []);
  for (let i = list.length; i <= index; i++) list[i] = { keys: [] };
  return list[index]!;
};

/** Reference images a prompt picked that the connection offers in this chat (openai / gemini). */
async function jobRefs(c: ImageConnection, ids: string[] | undefined): Promise<JobRef[]> {
  if (!supportsRefs(c.api) || !ids?.length) return [];
  const offered = chatRefs(c);
  const out: JobRef[] = [];
  for (const id of ids) {
    const r = offered.find((x) => x.id === id);
    const blob = r && (await getBlob(r.blob));
    if (r && blob) out.push({ id: r.id, description: r.description, blob });
  }
  return out;
}

export class NoImageConnection extends Error { constructor() { super('No image connection'); this.name = 'NoImageConnection'; } }

/** Generate one image for prompt `index` of image structure `id` on message `mesId`. */
export async function generateImage(mesId: number, id: string, index: number): Promise<void> {
  const sc = getSidecar(st().chat[mesId]);
  if (!sc) return;
  const key = jobKey(sc.genId, id, index);
  if (imageJobs.get(key)?.status === 'running') return;
  const abort = new AbortController();
  imageJobs.set(key, { status: 'running', abort });
  try {
    const c = imageConnection();
    if (!c) throw new NoImageConnection();
    const p = promptsOf(sc, id)[index];
    const prompt = effectivePrompt(sc, id, index);
    if (!p || !prompt.trim()) return;
    const blobs = await requestImages(c, { prompt, ratio: p.ratio, refs: await jobRefs(c, p.refs) }, abort.signal);
    const keys: string[] = [];
    for (const b of blobs) keys.push(await putBlob(b, { prefix: 'img:' }));
    const saved = await updateImages(sc.genId, mesId, (images) => {
      const s = slot(images, id, index);
      s.keys.push(...keys);
      s.shown = s.keys.length - 1;
    });
    if (!saved) for (const k of keys) void deleteBlob(k);
    imageJobs.delete(key);
  } catch (e) {
    if (abort.signal.aborted) imageJobs.delete(key);
    else { imageJobs.set(key, { status: 'error', error: e }); console.warn('[AP] image generation failed', e); }
  } finally {
    if (imageJobs.get(key)?.status === 'running') imageJobs.delete(key);
  }
}

export function cancelImage(genId: string, id: string, index: number): void {
  const j = imageJobs.get(jobKey(genId, id, index));
  if (j?.status === 'running') j.abort.abort();
  else imageJobs.delete(jobKey(genId, id, index));
}

/** Save the user's edit of a prompt ('' or the model's prompt restores the model's). */
export async function setImagePrompt(mesId: number, id: string, index: number, prompt: string): Promise<void> {
  const sc = getSidecar(st().chat[mesId]);
  if (!sc) return;
  const original = promptsOf(sc, id)[index]?.prompt ?? '';
  await updateImages(sc.genId, mesId, (images) => {
    const s = slot(images, id, index);
    if (!prompt.trim() || prompt === original) delete s.prompt;
    else s.prompt = prompt;
  });
}

export async function showImage(mesId: number, id: string, index: number, shown: number): Promise<void> {
  const sc = getSidecar(st().chat[mesId]);
  if (!sc) return;
  await updateImages(sc.genId, mesId, (images) => { slot(images, id, index).shown = shown; });
}

/** Delete one generated image of a prompt. */
export async function deleteImage(mesId: number, id: string, index: number, key: string): Promise<void> {
  const sc = getSidecar(st().chat[mesId]);
  if (!sc) return;
  await updateImages(sc.genId, mesId, (images) => {
    const s = slot(images, id, index);
    const at = s.keys.indexOf(key);
    if (at < 0) return;
    s.keys.splice(at, 1);
    if (s.shown !== undefined && s.shown >= at) s.shown = Math.max(0, s.shown - 1);
  });
  await deleteBlob(key);
}

/** After a reply arrives: generate every image prompt that has no image yet (when auto generation is on). */
export async function autoGenerateImages(mesId: number): Promise<void> {
  const m = mediaSettings().image;
  if (!m.enabled || !m.auto || !imageConnection()) return;
  const sc = getSidecar(st().chat[mesId]);
  if (!sc || sc.origin !== 'story') return;
  for (const decl of imageStructures(getPreset(sc.presetId))) {
    const prompts = promptsOf(sc, decl.id);
    for (let i = 0; i < prompts.length; i++) {
      if (sc.images?.[decl.id]?.[i]?.keys.length) continue;
      // The message may have moved while earlier images were generated.
      const at = locate(sc.genId, mesId);
      if (!at || at.swipe !== null) return;
      await generateImage(at.mesId, decl.id, i);
    }
  }
}

export function installImages(): void {
  provideMedia({ image: imageSettingsRuntime });
}
