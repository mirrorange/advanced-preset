/**
 * Speech synthesis runtime (design §6): what each message speaks, clip generation and caching, and
 * playback of one line or a whole message. The UI (underlines, the message player) only reads
 * `speech` and calls the actions below.
 */
import { reactive } from 'vue';
import { st, toast } from '@/st/host';
import { mediaFetch } from '@/media/net';
import { declaresSpeech } from '@/media/decl';
import { gc, getBlob, hasBlob, putBlob } from '@/store/media-db';
import { provideMedia, type SpeechRuntime } from '@/core/media-vars';
import { activeConnection, mediaSettings, saveMedia } from '@/store/media';
import { getPreset } from '@/store/presets';
import { getSidecar } from '@/store/sidecar';
import { speechOf } from '@/app/speech';
import { t } from '@/i18n';
import { mediaErrorText } from '@/ui/media/errors';
import { Clip, type ClipState } from './clip';
import { pausePlayback, Playback, resumePlayback } from './player';
import { speakableLine, speechFormat, speechProvider, speechTags } from './providers';
import { clipKey, segmentsOf, voiceFor, type Segment } from './segments';
import type { SpeechConnection, SpeechEnv, VoiceRef } from './types';
import { pcmToWav, wavToPcm } from './wav';

export const env: SpeechEnv = { fetch: (url, init) => mediaFetch(url, init as RequestInit & { signal?: AbortSignal }), blob: getBlob };

/** Reactive state for the UI. */
export const speech = reactive({
  /** Clip state by clip key (absent: not generated in this session, may still be cached). */
  clips: {} as Record<string, ClipState>,
  /** What is playing: message, segment, and whether the whole message is being read. */
  playing: null as { mesId: number; segId: string; all: boolean } | null,
  paused: false,
  /** Messages whose clips are being generated in the background. */
  generating: {} as Record<number, boolean>,
});

/** The active speech connection, when speech synthesis is on. */
export function speechConnection(): SpeechConnection | undefined {
  const s = mediaSettings().speech;
  return s.enabled ? activeConnection(s) : undefined;
}

/** Segments of a message (none unless its preset declares speech and synthesis is on). */
export function messageSegments(mesId: number): Segment[] {
  const msg = st().chat[mesId];
  const conn = speechConnection();
  if (!msg || msg.is_user || !conn) return [];
  const sc = getSidecar(msg);
  if (!sc || !declaresSpeech(getPreset(sc.presetId))) return [];
  return segmentsOf(msg.mes, speechOf(mesId), mediaSettings().speech.narrator, (text, quote) => speakableLine(conn.api, text, quote));
}

// ---- voices -------------------------------------------------------------------------------------

const creating = new Map<string, Promise<string>>();

/** A voice the provider can use: clones get their provider-side id (created once, stored in the settings). */
async function usableVoice(conn: SpeechConnection, voice: VoiceRef | null, signal: AbortSignal): Promise<VoiceRef | null> {
  if (voice?.kind !== 'clone' || voice.id) return voice;
  const provider = speechProvider(conn.api);
  if (!provider?.createClone) return voice;
  const k = `${conn.id}:${voice.audio}:${voice.consent ?? ''}`;
  let p = creating.get(k);
  if (!p) {
    p = provider.createClone(env, conn, voice, signal);
    creating.set(k, p);
    p.catch(() => creating.delete(k));
  }
  const id = await p;
  // `voice` is the settings object: the id persists with the connection.
  voice.id = id;
  saveMedia();
  return voice;
}

// ---- clips --------------------------------------------------------------------------------------

const MEMORY = 48;
const clips = new Map<string, Clip>();

function remember(key: string, clip: Clip): Clip {
  clips.delete(key);
  clips.set(key, clip);
  for (const k of clips.keys()) {
    if (clips.size <= MEMORY) break;
    if (clips.get(k)!.state !== 'loading') clips.delete(k);
    else break;
  }
  return clip;
}

const keyOf = (conn: SpeechConnection, seg: Segment) => clipKey(conn, voiceFor(conn, seg), seg.text);

/** The clip of a segment: in memory, from the cache, or synthesized now. */
export const clipOf = (conn: SpeechConnection, seg: Segment): Promise<Clip> => clipFor(conn, voiceFor(conn, seg), seg.text);

async function clipFor(conn: SpeechConnection, voice: VoiceRef | null, text: string): Promise<Clip> {
  const key = clipKey(conn, voice, text);
  const known = clips.get(key);
  if (known && known.state !== 'error') return remember(key, known);
  const cached = await getBlob(key).catch(() => undefined);
  const pcm = cached ? wavToPcm(await cached.arrayBuffer()) : null;
  if (pcm) {
    speech.clips[key] = 'ready';
    return remember(key, Clip.of(pcm.pcm, pcm.sampleRate));
  }
  const provider = speechProvider(conn.api);
  if (!provider) throw new Error(`Unknown speech API ${conn.api}`);
  speech.clips[key] = 'loading';
  const clip = new Clip(async (signal) => {
    const usable = await usableVoice(conn, voice, signal);
    return provider.synthesize(env, { conn, text, voice: usable, signal });
  }, (c) => {
    speech.clips[key] = c.state;
    if (c.state === 'ready') void putBlob(pcmToWav(c.pcm(), c.sampleRate), { key }).catch((e) => console.warn('[AP] speech cache write failed', e));
  });
  return remember(key, clip);
}

/** State of a segment's clip for the UI ('ready' also for cached clips once looked up). */
export function segmentState(seg: Segment): ClipState | undefined {
  const conn = speechConnection();
  return conn ? speech.clips[keyOf(conn, seg)] : undefined;
}

/** Look up which segments of a message are cached (so the UI can show them as ready). */
export async function probeCache(segs: Segment[]): Promise<void> {
  const conn = speechConnection();
  if (!conn) return;
  for (const seg of segs) {
    const key = keyOf(conn, seg);
    if (speech.clips[key]) continue;
    if (await hasBlob(key).catch(() => false)) speech.clips[key] ??= 'ready';
  }
}

function report(e: unknown): void {
  if (e instanceof DOMException && e.name === 'AbortError') return;
  console.error('[AP] speech synthesis failed', e);
  toast('error', mediaErrorText(e), t('media.speech'));
}

// ---- playback -----------------------------------------------------------------------------------

let current: { playback: Playback | null; cancelled: boolean } | null = null;

export function stopSpeech(): void {
  if (current) { current.cancelled = true; current.playback?.stop(); }
  current = null;
  speech.playing = null;
  speech.paused = false;
  void resumePlayback();
}

export async function togglePause(): Promise<void> {
  if (!speech.playing) return;
  if (speech.paused) { await resumePlayback(); speech.paused = false; }
  else { await pausePlayback(); speech.paused = true; }
}

/** Play segments of a message in order from `from` (one segment unless `all`), prefetching the next one. */
async function run(mesId: number, segs: Segment[], from: number, all: boolean): Promise<void> {
  stopSpeech();
  const conn = speechConnection();
  if (!conn || !segs[from]) return;
  const run = { playback: null as Playback | null, cancelled: false };
  current = run;
  const last = all ? segs.length - 1 : from;
  try {
    let next: Promise<Clip> | null = clipOf(conn, segs[from]!);
    for (let i = from; i <= last && !run.cancelled; i++) {
      const clip: Clip = await next!;
      next = i < last ? clipOf(conn, segs[i + 1]!) : null;
      if (run.cancelled) break;
      speech.playing = { mesId, segId: segs[i]!.id, all };
      run.playback = new Playback(clip);
      await run.playback.run();
    }
  } catch (e) {
    if (!run.cancelled) report(e);
  } finally {
    if (current === run) { current = null; speech.playing = null; speech.paused = false; }
  }
}

/** Click on a line: pause / resume it when it is playing, else play it. */
export function playLine(mesId: number, segId: string): void {
  const p = speech.playing;
  if (p && p.mesId === mesId && p.segId === segId) { void togglePause(); return; }
  const segs = messageSegments(mesId);
  const i = segs.findIndex((s) => s.id === segId);
  if (i >= 0) void run(mesId, segs, i, false);
}

/** The message player: read every segment from `segId` (default: the start). */
export function playMessage(mesId: number, segId?: string): void {
  const segs = messageSegments(mesId);
  const i = segId ? Math.max(0, segs.findIndex((s) => s.id === segId)) : 0;
  void run(mesId, segs, i, true);
}

/** Try a voice with a short sample sentence. */
export async function previewVoice(conn: SpeechConnection, voice: VoiceRef | null): Promise<void> {
  stopSpeech();
  const run = { playback: null as Playback | null, cancelled: false };
  current = run;
  try {
    const clip = await clipFor(conn, voice, t('media.speech.sample'));
    if (run.cancelled) return;
    run.playback = new Playback(clip);
    await run.playback.run();
  } catch (e) {
    if (!run.cancelled) report(e);
  } finally {
    if (current === run) current = null;
  }
}

/** Delete stored reference audio no connection uses any more. */
export async function gcVoices(): Promise<void> {
  const keep = new Set<string>();
  for (const c of mediaSettings().speech.connections) {
    for (const v of [c.voice, c.narrator, ...c.bindings.map((b) => b.voice)]) {
      if (v?.kind !== 'clone') continue;
      keep.add(v.audio);
      if (v.consent) keep.add(v.consent);
    }
  }
  await gc('voice:', keep).catch(() => undefined);
}

/** Synthesize every segment of a message without playing (auto generation / "Generate all"). */
export async function generateMessage(mesId: number): Promise<void> {
  const conn = speechConnection();
  if (!conn || speech.generating[mesId]) return;
  const segs = messageSegments(mesId);
  if (!segs.length) return;
  speech.generating[mesId] = true;
  try {
    for (const seg of segs) {
      const clip = await clipOf(conn, seg);
      await clip.done;
      if (clip.state === 'error') throw clip.error;
    }
  } catch (e) {
    report(e);
  } finally {
    delete speech.generating[mesId];
  }
}

/** A message's speech as one WAV file (missing clips are generated first). */
export async function messageAudio(mesId: number): Promise<Blob | null> {
  const conn = speechConnection();
  if (!conn) return null;
  const parts: Uint8Array[] = [];
  let rate = 0;
  for (const seg of messageSegments(mesId)) {
    const clip = await clipOf(conn, seg);
    await clip.done;
    if (clip.state !== 'ready') continue;
    if (rate && clip.sampleRate !== rate) continue;
    rate = clip.sampleRate;
    parts.push(clip.pcm());
  }
  if (!rate) return null;
  const all = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { all.set(p, at); at += p.length; }
  return pcmToWav(all, rate);
}

/** `speech.*` variables, format notes, bound characters and the display cleaner for the engine. */
function runtime(): SpeechRuntime {
  const s = mediaSettings().speech;
  const conn = speechConnection();
  const api: SpeechRuntime['vars']['api'] = conn?.api ?? '';
  const tags = speechTags(api);
  return {
    vars: { on: Boolean(conn), auto: s.auto, api, narrator: s.narrator, characters: false },
    format: speechFormat(api),
    characters: conn?.bindings.filter((b) => b.voice).map((b) => b.character) ?? [],
    ...(tags ? { cleaner: tags } : {}),
  };
}

const CACHE_DAYS = 30;

export function installSpeechRuntime(): void {
  provideMedia({ speech: runtime });
  void gc('tts:', new Set(), CACHE_DAYS * 86_400_000).catch(() => undefined);
  const { eventSource, eventTypes: E } = st();
  // A finished reply: pre-generate its audio when automatic generation is on.
  eventSource.on('advanced_preset_message_updated', (id: unknown) => {
    const mesId = Number(id);
    if (!Number.isNaN(mesId) && mediaSettings().speech.auto) void generateMessage(mesId);
  });
  for (const e of [E.CHAT_CHANGED]) if (e) eventSource.on(e, stopSpeech);
}
