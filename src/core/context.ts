/**
 * GenerationContext (§5.1): one per generation, created by the interceptor or at PROMPT_READY
 * (whichever comes first) and carried through FetchGate → Orchestrator → sidecar via `id`.
 */
import type { APreset, Assembly, Configuration, Stage, StructureDecl, Transport, Workflow } from '@advanced-preset/protocol';
import type { MetaParse } from '@advanced-preset/protocol';

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
  createdAt: number;
  /** Set once FetchGate took over the request. */
  claimed?: boolean;
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
