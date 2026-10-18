/**
 * Orchestrator (§10): runs the request segments of one taken-over generation with the transport
 * driver, streams live stages to the UI, applies patches / fallbacks, builds the sidecar and returns
 * a synthesised response that only carries story content (D1, D2, D20).
 */
import {
  applyPatches, partialTagTail, replyToPlainText, stripComments, terminalContentIndex,
  type MemoryOp, type PatchResult, type TurnResult,
} from '@advanced-preset/protocol';
import { nativeFetch, st, streamContextOf, toast } from '@/st/host';
import { presetState } from '@/store/config';
import { applyMemoryOps, type ChatEvent } from '@/store/eventlog';
import type { Sidecar, SidecarStage, TurnKind } from '@/store/sidecar';
import { t } from '@/i18n';
import type { GenerationContext } from './context';
import { createDriver, type CallerInfo } from './transports';
import { presetToolNames } from './transports/base';
import { encodeJson, errorResponse, familyOf, streamEncoder, type EncodedToolCall } from './encoder';
import { BackendError, readResponse, type ReadState } from './reader';
import { live, startLive, updateLive, type LiveGeneration } from './live';
import { recordRequest } from './debug';

export const GENERATE_URL = '/api/backends/chat-completions/generate';

export interface Outcome {
  content: string;
  reasoning: string;
  toolCalls?: EncodedToolCall[];
  sidecar: Sidecar;
}

/** Sidecar waiting for its message (MESSAGE_RECEIVED). */
export const handoff = { pending: null as null | { ctx: GenerationContext; outcome: Outcome; at: number } };

const isAbort = (e: unknown) => (e as Error)?.name === 'AbortError';

function capabilityError(ctx: GenerationContext): string | null {
  if ((ctx.transport === 'tool-single' || ctx.transport === 'tool-multi') && !st().isToolCallingSupported()) return t('error.toolsUnsupported');
  return null;
}

export async function orchestrate(ctx: GenerationContext, base: Record<string, any>, signal?: AbortSignal | null): Promise<Response> {
  const source = String(base.chat_completion_source ?? '');
  const family = familyOf(source, base);
  const stream = Boolean(base.stream);
  const err = capabilityError(ctx);
  if (err) { toast('error', err, 'Advanced Preset'); return errorResponse(err, 400); }

  const ours = ctx.origin === 'task' ? presetToolNames(ctx.preset) : new Set<string>();
  const caller: CallerInfo = ctx.origin === 'task'
    ? { tools: (base.tools ?? []).filter((x: any) => !ours.has(x?.function?.name ?? '')), toolChoice: base.tool_choice, schema: base.json_schema ?? undefined }
    : { tools: [] };
  const g = startLive(ctx, stream);

  if (!stream) {
    try {
      const outcome = await run(ctx, base, caller, g, signal ?? undefined, () => undefined);
      return new Response(JSON.stringify(encodeJson(family, outcome)), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      return failure(g, e);
    }
  }

  const enc = streamEncoder(family);
  const encoder = new TextEncoder();
  const ts = new TransformStream<Uint8Array, Uint8Array>();
  const writer = ts.writable.getWriter();
  const write = (s: string) => (s ? writer.write(encoder.encode(s)).catch(() => undefined) : Promise.resolve());
  let streamed = '';
  void (async () => {
    try {
      const outcome = await run(ctx, base, caller, g, signal ?? undefined, (text) => {
        if (text.startsWith(streamed) && text.length > streamed.length) { void write(enc.text(text.slice(streamed.length))); streamed = text; }
      });
      // Whatever was not streamed (patched content, held-back tails, task replies) goes out now.
      if (outcome.content.startsWith(streamed)) await write(enc.text(outcome.content.slice(streamed.length)));
      if (outcome.reasoning) await write(enc.reasoning(outcome.reasoning));
      if (outcome.toolCalls?.length) await write(enc.toolCalls(outcome.toolCalls));
      await write(enc.end());
    } catch (e) {
      if (!isAbort(e)) { await write(enc.error(messageOf(e))); failure(g, e); }
    } finally {
      await writer.close().catch(() => undefined);
    }
  })();
  return new Response(ts.readable, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } });
}

const messageOf = (e: unknown) => (e instanceof Error ? e.message : String(e));

function failure(g: LiveGeneration, e: unknown): Response {
  g.status = isAbort(e) ? 'aborted' : 'error';
  g.error = messageOf(e);
  if (e instanceof BackendError) return new Response(e.body || JSON.stringify({ error: { message: e.message } }), { status: e.status, headers: { 'Content-Type': 'application/json' } });
  return errorResponse(messageOf(e));
}

async function run(
  ctx: GenerationContext,
  base: Record<string, any>,
  caller: CallerInfo,
  g: LiveGeneration,
  signal: AbortSignal | undefined,
  onContent: (text: string) => void,
): Promise<Outcome> {
  const source = String(base.chat_completion_source ?? '');
  const driver = createDriver({ ctx, base, messages: base.messages ?? [], caller, family: familyOf(source, base) });
  const terminal = terminalContentIndex(ctx.stages);
  const terminalId = terminal >= 0 ? ctx.stages[terminal]!.id : null;
  const hasPatch = ctx.stages.some((s) => s.kind === 'patch');
  // Only the terminal content of a story turn streams into the message; drafts and patched text stay in the UI.
  const gate = ctx.origin === 'story' && !caller.schema && !hasPatch && terminalId !== null;
  const maxSteps = ctx.transport === 'tool-multi' ? Math.max(1, ctx.config.connection.maxSteps) : 1;
  const started = Date.now();
  let reasoning = '';
  let usage: unknown;
  let requests = 0;
  let interrupted = false;
  let callerToolCalls: EncodedToolCall[] | undefined;
  /** Partial turn at the moment of an abort (parsed as non-final so open stages stay open). */
  let partial: TurnResult | undefined;

  for (let step = 0; step < maxSteps; step++) {
    g.step = step;
    const body = driver.body(step);
    const rec = recordRequest({ genId: ctx.id, step, at: Date.now(), request: body });
    requests++;
    let read: ReadState = { text: '', reasoning: '', toolCalls: [] };
    try {
      const resp = await nativeFetch(GENERATE_URL, { method: 'POST', headers: st().getRequestHeaders(), body: JSON.stringify(body), signal });
      let lastUi = 0;
      for await (const r of readResponse(resp, streamContextOf(body), Boolean(body.stream), signal)) {
        read = r;
        const now = Date.now();
        if (now - lastUi < 50) continue;
        lastUi = now;
        const turn = driver.progress(r, false);
        updateLive(g, turn, reasoning + r.reasoning);
        if (gate && terminalId) {
          const text = turn.stages[terminalId]?.text ?? '';
          if (text) onContent(text.slice(0, text.length - partialTagTail(text)).trimEnd());
        }
      }
      rec.response = read.text || JSON.stringify(read.toolCalls);
      rec.durationMs = Date.now() - rec.at;
      rec.usage = read.usage;
    } catch (e) {
      rec.error = messageOf(e);
      if (isAbort(e) || signal?.aborted) { interrupted = true; partial = driver.progress(read, false); break; }
      throw e;
    }
    reasoning += read.reasoning;
    usage = read.usage ?? usage;
    driver.progress(read, true);
    const verdict = driver.complete(read, step);
    if (verdict.callerToolCalls) {
      callerToolCalls = verdict.callerToolCalls.map((c) => ({ id: c.id || `call_${step}`, name: c.name, arguments: c.arguments || '{}', signature: c.signature }));
      break;
    }
    if (verdict.done) break;
  }

  const turn = partial ?? driver.result();
  if (interrupted) for (const s of Object.values(turn.stages)) if (s.status === 'streaming') s.status = 'interrupted';
  updateLive(g, turn, reasoning);
  const outcome = finish(ctx, turn, driver.rawText(), driver.callerResult?.(), reasoning, { usage, requests, durationMs: Date.now() - started, interrupted });
  outcome.toolCalls = callerToolCalls;
  if (callerToolCalls) outcome.content = '';
  g.status = interrupted ? 'aborted' : 'done';
  return outcome;
}

function finish(
  ctx: GenerationContext,
  turn: TurnResult,
  raw: string,
  callerResult: unknown,
  reasoning: string,
  diag: { usage: unknown; requests: number; durationMs: number; interrupted: boolean },
): Outcome {
  const { preset, config } = ctx;
  const warnings = [...ctx.warnings, ...turn.warnings];
  let content = turn.content;

  // Patches (D19): applied to the terminal content; the draft is kept for revert / re-apply.
  let draft: string | undefined;
  let patched: string | undefined;
  let patchResults: PatchResult[] | undefined;
  const patchStage = ctx.stages.find((s) => s.kind === 'patch');
  const patches = patchStage ? turn.stages[patchStage.id]?.patches : undefined;
  if (patchStage && patches?.length && content && !diag.interrupted) {
    const r = applyPatches(content, patches);
    draft = content;
    patched = r.text;
    patchResults = r.results;
    content = r.text;
    const failed = r.results.filter((x) => x.status !== 'applied').length;
    if (failed) warnings.push(`patches: ${failed}/${r.results.length} skipped`);
  }

  // Fallback (D20): content stage → plain assistant text.
  if (!content && ctx.origin === 'story' && config.connection.finalFallback) {
    const plain = stripComments(raw).trim();
    if (plain && !raw.trim().startsWith('{')) { content = plain; warnings.push('fallback: plain text used as content'); }
  }

  const kindOf = (k: string) => Object.values(preset.structures).find((s) => s.kind === k);
  const replyDecl = kindOf('reply');
  const reply = replyDecl ? (turn.structures[replyDecl.id] as string | undefined) : undefined;
  const impersonateDecl = kindOf('impersonate');
  const recapDecl = kindOf('recap');
  const memoryDecl = kindOf('memory');

  let turnKind: TurnKind = ctx.meta.mixed ? 'meta-mixed' : 'story';
  let mes = content;
  if (ctx.origin === 'task') {
    if (ctx.stType === 'script' || ctx.stType === 'quiet') {
      mes = callerResult !== undefined ? JSON.stringify(callerResult) : content || stripComments(raw).trim();
    } else if (!content) {
      turnKind = ctx.meta.task === 'summary' ? 'summary' : ctx.meta.task === 'impersonate' ? 'impersonate' : 'meta-pure';
      mes = reply ? replyToPlainText(reply) : '';
      if (!mes && impersonateDecl && typeof turn.structures[impersonateDecl.id] === 'string') mes = '…';
      if (!mes && recapDecl && turn.structures[recapDecl.id]) mes = '…';
    }
  }
  if (!mes && !diag.interrupted) throw new Error(t('error.emptyTurn'));

  // Events: chat memory as sidecar events, global memory applied now (D13), recap (§12.3).
  const events: ChatEvent[] = [];
  const persisted = ctx.interceptorRan && ctx.stType !== 'quiet';
  if (persisted && memoryDecl && Array.isArray(turn.structures[memoryDecl.id])) events.push(...applyMemoryOps(presetState(preset), turn.structures[memoryDecl.id] as MemoryOp[]));
  if (persisted && recapDecl && typeof turn.structures[recapDecl.id] === 'string') {
    const at = ctx.inputIndex >= 0 ? ctx.inputIndex : st().chat.length - 1;
    events.push({ type: 'recap.set', text: turn.structures[recapDecl.id] as string, coversUpTo: at - 1, source: 'model' });
  }

  const stages: SidecarStage[] = ctx.stages.map((s) => {
    const r = turn.stages[s.id];
    return {
      id: s.id, actor: s.actor, kind: s.kind, label: s.label,
      ...(r?.text ? { text: r.text } : {}),
      ...(s.kind === 'patch' && (patchResults || r?.patches) ? { patches: patchResults ?? (r!.patches as PatchResult[]) } : {}),
      status: r?.status === 'done' ? 'done' : r?.status === 'interrupted' ? 'interrupted' : 'missing',
    };
  });
  const sidecar: Sidecar = {
    v: 1,
    presetId: preset.id,
    presetVersion: preset.version,
    genId: ctx.id,
    origin: ctx.origin,
    transport: ctx.transport,
    workflow: ctx.workflow?.id ?? '',
    turn: turnKind,
    stages,
    ...(draft !== undefined ? { draft, patched } : {}),
    patchesApplied: draft !== undefined,
    structures: turn.structures,
    events,
    ...(ctx.meta.segments.length ? { metaInput: ctx.meta.segments } : {}),
    ...(reasoning ? { reasoning } : {}),
    diagnostics: { warnings, requests: diag.requests, usage: diag.usage, durationMs: diag.durationMs },
  };
  const outcome: Outcome = { content: mes, reasoning, sidecar };
  if (persisted) handoff.pending = { ctx, outcome, at: Date.now() };
  else void st().eventSource.emit('advanced_preset_generation_completed', { genId: ctx.id, sidecar });
  if (live.current?.genId === ctx.id) live.current.structures = turn.structures;
  return outcome;
}
