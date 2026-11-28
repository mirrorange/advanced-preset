/**
 * GenerationContext (§5.1): one per generation, created by the interceptor or at PROMPT_READY
 * (whichever comes first) and carried through FetchGate → Orchestrator → sidecar via `id`.
 */
import type { APreset, Assembly, BindingTarget, Configuration, Phase, SpeechCleaner, Stage, StructureDecl, Transport, Workflow } from '@advanced-preset/protocol';
import type { ChatMessage } from '@/st/host';
import type { KeywordTexts, MetaParse } from '@advanced-preset/protocol';
import type { CacheState, StickyEntry } from './cache';
import type { StorylineTurn } from './storylines';

export type Origin = 'story' | 'task';

export interface GenerationContext {
  id: string;
  preset: APreset;
  config: Configuration;
  origin: Origin;
  /** normal | regenerate | swipe | continue | quiet | impersonate | script */
  stType: string;
  interceptorRan: boolean;
  dryRun: boolean;
  meta: MetaParse & { task: 'summary' | 'impersonate' | null };
  flags: Record<string, boolean>;
  transport: Transport;
  workflow?: Workflow;
  stages: Stage[];
  structures: StructureDecl[];
  assembly?: Assembly;
  /** Index of the user message that triggered the turn (in the real chat). */
  inputIndex: number;
  /** Text of the existing message for `continue`. */
  continueFrom?: string;
  /** Chat text scanned by user-module keyword rules. */
  keywords?: KeywordTexts;
  createdAt: number;
  /** Cache optimization: history messages rendered both ways, identified by markers (interceptor / backfill). */
  sticky?: { chat: string; entries: StickyEntry[]; omitted: Record<string, string> };
  /** Cache optimization: state to store once the request succeeded (`touch`: only refresh its time). */
  cacheCommit?: { chat: string; next: Omit<CacheState, 'at'>; touch: boolean };
  /** Input shaping: the user message ending the history was marked; `texts` are the renderings it may carry. */
  input?: { texts: string[] };
  /** Input shaping applied at PROMPT_READY (`input.shaped`). */
  inputShaped?: boolean;
  /** Storylines (presets that declare them, switched on): the current storyline and the history groups. */
  storylines?: StorylineTurn;
  /** Display cleaner of inline speech lines, fixed for the turn (`null`: the default). */
  speechCleaner?: SpeechCleaner | null;
  /** A backend rejected the built-in thought signature: later requests leave it out. */
  signatureFallback?: boolean;
  /** Set once FetchGate took over the request. */
  claimed?: boolean;
  /** Multi-model story turn (the preset declares it, the configuration switched it on): one request per phase. */
  multiModel?: boolean;
  /** Target of the binding the first request runs on (cache fingerprint). */
  firstTarget?: BindingTarget;
  /** Phases of the turn (one without multi-model), planned at PROMPT_READY. */
  phases?: Phase[];
  /** Phase view of a multi-model turn: the whole turn's stages / structures (names and numbering are turn-wide). */
  turn?: { stages: Stage[]; structures: StructureDecl[] };
  /** The first request's prompt rendered again with another assembly (later phases; history as resolved for the first request). */
  rerender?: (assembly: Assembly) => { messages: ChatMessage[]; historyAt: number };
  /** Assembly of a later phase (variables of its binding's transport and `phase.*`). */
  phaseAssembly?: (phase: Phase, transport: Transport) => Assembly;
  /** Input shaping: fills the `{{ap::input::text}}` slots of text rendered after PROMPT_READY. */
  fillInput?: (text: string) => string;
  warnings: string[];
}

let counter = 0;
export const newGenId = () => `ap-${Date.now().toString(36)}-${(++counter).toString(36)}`;

/** Contexts waiting for their request (by id) and the one prepared by the interceptor. */
const contexts = new Map<string, GenerationContext>();
let pending: GenerationContext | null = null;
let armed: GenerationContext | null = null;

export const registry = {
  setPending(ctx: GenerationContext | null) { pending = ctx; },
  takePending(): GenerationContext | null { const p = pending; pending = null; return p; },
  peekPending: () => pending,
  /** Context assembled at PROMPT_READY and waiting for CHAT_COMPLETION_SETTINGS_READY. */
  arm(ctx: GenerationContext) { armed = ctx; contexts.set(ctx.id, ctx); },
  takeArmed(): GenerationContext | null { const a = armed; armed = null; return a; },
  get: (id: string) => contexts.get(id),
  release(id: string) { contexts.delete(id); },
  /** Drop contexts that never reached a request (aborted before fetch). */
  sweep(maxAgeMs = 10 * 60_000) {
    const now = Date.now();
    for (const [id, c] of contexts) if (now - c.createdAt > maxAgeMs) contexts.delete(id);
  },
};
