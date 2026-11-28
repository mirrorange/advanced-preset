/**
 * Multi-model phases at request time: the context a phase's request is built from (its binding's
 * transport and options, its stages, its assembly), the replay of earlier phases in the current
 * phase's transport, and the phase's messages.
 */
import {
  DEFAULT_BINDING, dialogueReplay, objectReplay, toolReplay, turnArtifacts,
  type Phase, type ReplayItem,
} from '@advanced-preset/protocol';
import { st, type ChatMessage } from '@/st/host';
import type { GenerationContext } from './context';
import { renderPrefill, stageRegionMessages, withStageMessages } from './assembler';
import { withBinding, type ResolvedBinding } from './bindings';
import { artifactsOf, fillToolText, prefixesOf, textExpander } from './transports/base';
import { SKIP_SIGNATURE, markOwn } from './transports/signatures';
import type { WireFamily } from '@/st/host';

/**
 * The context a phase's driver works with. One phase on the default binding: the context itself
 * (requests exactly as before multi-model). Otherwise the binding's transport and options, and for a
 * phase of a multi-phase turn its stages / structures and its assembly.
 */
export function phaseView(ctx: GenerationContext, phase: Phase, binding: ResolvedBinding): GenerationContext {
  const phases = ctx.phases ?? [phase];
  if (phases.length === 1) {
    if (binding.id === DEFAULT_BINDING && binding.transport === ctx.transport) return ctx;
    return { ...ctx, transport: binding.transport, config: withBinding(ctx.config, binding) };
  }
  // The first phase was assembled at PROMPT_READY for its transport; later ones are assembled now.
  const assembly = phase.index === 0 && binding.transport === ctx.transport ? ctx.assembly : ctx.phaseAssembly?.(phase, binding.transport) ?? ctx.assembly;
  return {
    ...ctx,
    transport: binding.transport,
    config: withBinding(ctx.config, binding),
    stages: phase.stages,
    structures: phase.structures,
    turn: { stages: ctx.stages, structures: ctx.structures },
    assembly,
  };
}

/** Whether a phase sends the prompt ST built (the first phase, assembled for its own transport). */
export const usesPromptAsBuilt = (ctx: GenerationContext, phase: Phase, view: GenerationContext): boolean =>
  phase.index === 0 && view.transport === ctx.transport;

interface Replay {
  /** Messages after the prompt (plaintext / structured / tool transports). */
  messages: ChatMessage[];
  /** Text appended to the assistant prefill (prefill transport). */
  prefill?: string;
  /** Tools of the replayed tool calls. */
  tools: any[];
}

/**
 * Earlier phases written as the current phase's transport would have produced them: dialogue text
 * (prefill / plaintext), the turn object (structured), or one stage tool call + result per stage
 * (tool transports; on Gemini-signature wires the calls carry the skip-validation signature).
 */
export function replayFor(view: GenerationContext, items: ReplayItem[], family: WireFamily): Replay {
  if (!items.length) return { messages: [], tools: [] };
  const { preset } = view;
  const turnStages = view.turn?.stages ?? view.stages;
  switch (view.transport) {
    case 'prefill':
    case 'plaintext': {
      const text = dialogueReplay(items, {
        prefixes: prefixesOf(view),
        format: view.transport === 'prefill' ? 'prefix' : preset.plaintextFormat,
        contentMarker: preset.contentMarker,
        stages: turnStages,
      });
      return view.transport === 'prefill' ? { messages: [], prefill: text, tools: [] } : { messages: [markOwn<ChatMessage>({ role: 'assistant', content: text })], tools: [] };
    }
    case 'structured':
      return { messages: [markOwn<ChatMessage>({ role: 'assistant', content: JSON.stringify(objectReplay(items, artifactsOf(view))) })], tools: [] };
    case 'tool-single':
    case 'tool-multi': {
      const art = turnArtifacts(preset.tools, view.workflow!, turnStages, view.turn?.structures ?? view.structures, textExpander(view), { stages: items.map((i) => i.stage), structures: items.flatMap((i) => i.structures.map((x) => x.decl)) });
      const calls = toolReplay(items, art);
      const own = artifactsOf(view);
      const after = view.transport === 'tool-multi' ? own.stageTools()[0]?.function.name ?? '' : preset.tools.submit.name;
      const signed = family === 'gemini' || (family === 'openai' && view.config.connection.openAiSignatures);
      const first = calls[0]?.name ?? '';
      const messages: ChatMessage[] = [];
      calls.forEach((c, i) => {
        const id = `call_ap_phase_${c.stage.id}`;
        messages.push(markOwn<ChatMessage>({
          role: 'assistant',
          content: '',
          tool_calls: [{ id, type: 'function', function: { name: c.name, arguments: JSON.stringify(c.arguments) }, ...(signed ? { signature: SKIP_SIGNATURE } : {}) }],
        }));
        const next = calls[i + 1]?.name ?? after;
        messages.push({ role: 'tool', tool_call_id: id, content: fillToolText(view, preset.tools.results.next, { next, first }) });
      });
      return { messages, tools: art.stageTools() };
    }
  }
}

/**
 * Messages of a phase that does not send ST's prompt: the prompt re-rendered with the phase's
 * assembly (history as resolved for the first request), the replay of earlier phases, then the
 * phase's stage regions (a trailing assistant prefill stays last).
 */
export function phaseMessages(view: GenerationContext, phase: Phase, items: ReplayItem[], family: WireFamily): { messages: ChatMessage[]; tools: any[] } {
  const sub = (s: string) => { const x = st().substituteParams(s); return view.fillInput ? view.fillInput(x) : x; };
  const rendered = view.rerender!(view.assembly!);
  const prefill = view.transport === 'prefill' && rendered.historyAt >= 0;
  let messages = prefill ? renderPrefill(view, rendered.messages, rendered.historyAt) : rendered.messages;
  const replay = replayFor(view, items, family);
  if (prefill && replay.prefill) {
    const last = messages[messages.length - 1]!;
    const content = typeof last.content === 'string' ? last.content : '';
    messages = [...messages.slice(0, -1), { ...last, content: content ? `${content}\n\n${replay.prefill}` : replay.prefill }];
  } else if (replay.prefill) {
    messages = [...messages, markOwn<ChatMessage>({ role: 'assistant', content: replay.prefill })];
  }
  messages = [...messages, ...replay.messages];
  const tail = stageRegionMessages(view, view.assembly!, phase.stages, sub);
  return { messages: withStageMessages(messages, tail, prefill), tools: replay.tools };
}
