/**
 * Speech synthesis runtime (design §6): what each message speaks, clip generation and caching, and
 * playback of one line or a whole message. The UI (underlines, the message player) only reads
 * `speech` and calls the actions below.
 */
import { reactive } from 'vue';
import { st, toast } from '@/st/host';
import { mediaFetch } from '@/media/net';
import { declaresSpeech } from '@/media/decl';
import { deleteBlob, gc, getBlob, hasBlob, putBlob } from '@/store/media-db';
import { provideMedia, type SpeechRuntime } from '@/core/media-vars';
import { activeConnection, mediaSettings, saveMedia } from '@/store/media';
import { getPreset } from '@/store/presets';
import { getSidecar, writeSidecar } from '@/store/sidecar';
import { bumpChat } from '@/ui/state';
import { speechOf } from '@/app/speech';
import { chatCards } from '@/st/cards';
import { t } from '@/i18n';
import { mediaErrorText } from '@/ui/media/errors';
import type { ChatCard } from '@/st/cards';
import { Clip, type ClipState } from './clip';
import { pausePlayback, Playback, resumePlayback } from './player';
import { providerFor, speakableLine, speechFormat, speechTags } from './providers';
import { bindingOf, clipKey, norm, scopedBindings, segmentsOf, voiceFor, type Segment } from './segments';
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
  return segmentsOf(msg.mes, speechOf(mesId), mediaSettings().speech.narrator, (text, quote) => speakableLine(conn, text, quote), sc.speechText);
}

/**
 * Set what a segment sends to the speech service (provider inline tags included); '' or the
 * model's text reverts to the model's text. The old audio of the segment is deleted.
 */
export async function setSegmentText(mesId: number, segId: string, text: string): Promise<void> {
  const seg = messageSegments(mesId).find((s) => s.id === segId);
  const sc = getSidecar(st().chat[mesId]);
  if (!seg || !sc) return;
  const next = text.trim();
  if (next === seg.text) return;
  await deleteAudio(mesId, [segId]);
  const edits = { ...sc.speechText };
  if (!next || next === (seg.original ?? seg.text)) delete edits[segId];
  else edits[segId] = next;
  const { speechText: _old, ...rest } = sc;
  writeSidecar(mesId, Object.keys(edits).length ? { ...rest, speechText: edits } : rest);
  bumpChat();
  await st().saveChat();
}

// ---- voices -------------------------------------------------------------------------------------

const creating = new Map<string, Promise<string>>();

/** A voice the provider can use: clones get their provider-side id (created once, stored in the settings). */
async function usableVoice(conn: SpeechConnection, voice: VoiceRef | null, signal: AbortSignal): Promise<VoiceRef | null> {
  if (voice?.kind !== 'clone' || voice.id) return voice;
  const provider = providerFor(conn);
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

/** The voice picked for a character without one, global or for one of the chat's cards; `null`: cancelled. */
export type VoiceAsker = (conn: SpeechConnection, character: string, cards: ChatCard[]) => Promise<{ voice: VoiceRef; card?: string } | null>;

let askVoice: VoiceAsker = async () => null;
/** Set by the UI: the dialog that asks for a voice. */
export const setVoiceAsker = (f: VoiceAsker) => { askVoice = f; };

/** Avatar keys of the current chat's cards. */
const cardKeys = () => chatCards().map((c) => c.key);

const asking = new Map<string, Promise<boolean>>();
let asked: Promise<unknown> = Promise.resolve();

/** Make sure `character` has a voice, asking the user (one dialog at a time, once per character). False: cancelled. */
function ensureVoice(conn: SpeechConnection, character: string): Promise<boolean> {
  const k = `${conn.id}\n${norm(character)}`;
  let p = asking.get(k);
  if (p) return p;
  p = asked.then(async () => {
    if (voiceFor(conn, { kind: 'speech', character }, cardKeys()) !== undefined) return true;
    const cards = chatCards();
    const r = await askVoice(conn, character, cards);
    if (!r) return false;
    const same = (b: { character: string; card?: string }) => norm(b.character) === norm(character) && (b.card ?? '') === (r.card ?? '');
    const b = conn.bindings.find(same);
    if (b) b.voice = r.voice;
    else conn.bindings.push({ character, voice: r.voice, ...(r.card ? { card: r.card } : {}) });
    saveMedia();
    return true;
  }).finally(() => asking.delete(k));
  asked = p.catch(() => undefined);
  asking.set(k, p);
  return p;
}

/** The segments that have a voice, after asking for the characters that have none (cancelled ones are skipped). */
async function voiced(conn: SpeechConnection, segs: Segment[]): Promise<Segment[]> {
  const keys = cardKeys();
  const missing = new Map<string, string>();
  for (const s of segs) if (voiceFor(conn, s, keys) === undefined) missing.set(norm(s.character), s.character);
  for (const name of missing.values()) await ensureVoice(conn, name);
  const now = cardKeys();
  return segs.filter((s) => voiceFor(conn, s, now) !== undefined);
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

/** Cache key of a segment's clip; none while its character has no voice. */
function keyOf(conn: SpeechConnection, seg: Segment): string | undefined {
  const voice = voiceFor(conn, seg, cardKeys());
  return voice === undefined ? undefined : clipKey(conn, voice, seg.text);
}

/** The clip of a voiced segment: in memory, from the cache, or synthesized now. */
function clipOf(conn: SpeechConnection, seg: Segment): Promise<Clip> {
  const voice = voiceFor(conn, seg, cardKeys());
  if (voice === undefined) return Promise.reject(new Error(`No voice for ${seg.character}`));
  return clipFor(conn, voice, seg.text);
}

const looking = new Map<string, Promise<Clip>>();

function clipFor(conn: SpeechConnection, voice: VoiceRef | null, text: string): Promise<Clip> {
  const key = clipKey(conn, voice, text);
  const known = clips.get(key);
  if (known && known.state !== 'error') return Promise.resolve(remember(key, known));
  // Concurrent requests for the same clip share one cache lookup and synthesis.
  let p = looking.get(key);
  if (!p) {
    p = newClip(conn, voice, text, key).finally(() => looking.delete(key));
    looking.set(key, p);
  }
  return p;
}

async function newClip(conn: SpeechConnection, voice: VoiceRef | null, text: string, key: string): Promise<Clip> {
  const cached = await getBlob(key).catch(() => undefined);
  const pcm = cached ? wavToPcm(await cached.arrayBuffer()) : null;
  if (pcm) {
    speech.clips[key] = 'ready';
    return remember(key, Clip.of(pcm.pcm, pcm.sampleRate));
  }
  const provider = providerFor(conn);
  if (!provider) throw new Error(`Unknown speech API ${conn.api}`);
  speech.clips[key] = 'loading';
  const clip = new Clip(async (signal) => {
    const usable = await usableVoice(conn, voice, signal);
    return provider.synthesize(env, { conn, text, voice: usable, signal });
  }, (c) => {
    // Deleted (or regenerated) meanwhile.
    if (clips.get(key) !== c) return;
    speech.clips[key] = c.state;
    if (c.state === 'ready') void putBlob(pcmToWav(c.pcm(), c.sampleRate), { key }).catch((e) => console.warn('[AP] speech cache write failed', e));
  });
  return remember(key, clip);
}

/** State of a segment's clip for the UI ('ready' also for cached clips once looked up). */
export function segmentState(seg: Segment): ClipState | undefined {
  const conn = speechConnection();
  const key = conn && keyOf(conn, seg);
  return key ? speech.clips[key] : undefined;
}

/** Look up which segments of a message are cached (so the UI can show them as ready). */
export async function probeCache(segs: Segment[]): Promise<void> {
  const conn = speechConnection();
  if (!conn) return;
  for (const seg of segs) {
    const key = keyOf(conn, seg);
    if (!key || speech.clips[key]) continue;
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
async function run(mesId: number, all: Segment[], from: number, whole: boolean): Promise<void> {
  stopSpeech();
  const conn = speechConnection();
  if (!conn || !all[from]) return;
  const run = { playback: null as Playback | null, cancelled: false };
  current = run;
  try {
    const segs = await voiced(conn, whole ? all.slice(from) : [all[from]!]);
    if (run.cancelled || !segs.length) return;
    const last = segs.length - 1;
    let next: Promise<Clip> | null = clipOf(conn, segs[0]!);
    for (let i = 0; i <= last && !run.cancelled; i++) {
      const clip: Clip = await next!;
      next = i < last ? clipOf(conn, segs[i + 1]!) : null;
      if (run.cancelled) break;
      speech.playing = { mesId, segId: segs[i]!.id, all: whole };
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

const holds = new Set<() => (VoiceRef | null)[]>();

/** Keep the reference audio of voices not yet in the settings (a voice being picked); returns the release. */
export function holdVoices(voices: () => (VoiceRef | null)[]): () => void {
  holds.add(voices);
  return () => { holds.delete(voices); };
}

/** Delete stored reference audio no connection uses any more. */
export async function gcVoices(): Promise<void> {
  const keep = new Set<string>();
  for (const c of mediaSettings().speech.connections) {
    for (const v of [c.narrator, ...c.bindings.map((b) => b.voice), ...[...holds].flatMap((h) => h())]) {
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
  if (!messageSegments(mesId).length) return;
  speech.generating[mesId] = true;
  try {
    const segs = await voiced(conn, messageSegments(mesId));
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

/** Synthesize one segment without playing it. */
export async function generateLine(mesId: number, segId: string): Promise<void> {
  const conn = speechConnection();
  const seg = messageSegments(mesId).find((s) => s.id === segId);
  if (!conn || !seg) return;
  try {
    const [voicedSeg] = await voiced(conn, [seg]);
    if (!voicedSeg) return;
    const clip = await clipOf(conn, voicedSeg);
    await clip.done;
    if (clip.state === 'error') throw clip.error;
  } catch (e) {
    report(e);
  }
}

/** A message's speech as one WAV file (missing clips are generated first). */
export async function messageAudio(mesId: number): Promise<Blob | null> {
  const conn = speechConnection();
  if (!conn) return null;
  const parts: Uint8Array[] = [];
  let rate = 0;
  for (const seg of await voiced(conn, messageSegments(mesId))) {
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

/** Forget the generated audio of a message's lines (all without `segIds`), in memory and in the cache. */
export async function deleteAudio(mesId: number, segIds?: string[]): Promise<void> {
  const conn = speechConnection();
  if (!conn) return;
  const p = speech.playing;
  if (p && p.mesId === mesId && (!segIds || segIds.includes(p.segId))) stopSpeech();
  for (const seg of messageSegments(mesId)) {
    if (segIds && !segIds.includes(seg.id)) continue;
    const key = keyOf(conn, seg);
    if (!key) continue;
    clips.get(key)?.abort();
    clips.delete(key);
    delete speech.clips[key];
    await deleteBlob(key).catch(() => undefined);
  }
}

/** Discard and synthesize again: one line (then played) or the whole message. */
export async function regenerate(mesId: number, segId?: string): Promise<void> {
  await deleteAudio(mesId, segId ? [segId] : undefined);
  if (segId) playLine(mesId, segId);
  else await generateMessage(mesId);
}

/** Names of the characters with a voice in the current chat (a card's binding over a global one of the same name). */
function boundCharacters(conn: SpeechConnection): string[] {
  const scoped = scopedBindings(conn, cardKeys());
  const out = new Map<string, string>();
  for (const b of scoped) {
    const k = norm(b.character);
    if (!b.character.trim() || out.has(k)) continue;
    const hit = bindingOf(scoped, b.character);
    if (hit) out.set(k, hit.character);
  }
  return [...out.values()];
}

/** `speech.*` variables, format notes, bound characters and the display cleaner for the engine. */
function runtime(): SpeechRuntime {
  const s = mediaSettings().speech;
  const conn = speechConnection();
  const api: SpeechRuntime['vars']['api'] = conn?.api ?? '';
  const tags = speechTags(conn);
  return {
    vars: { on: Boolean(conn), auto: s.auto, api, narrator: s.narrator, characters: false },
    format: speechFormat(conn),
    characters: conn ? boundCharacters(conn) : [],
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
