/** Multi-model workflows end to end: interceptor → PROMPT_READY → one request per phase. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, parseDialogue, resolveConfiguration, type APreset, type Configuration, type ConnectionBinding, type Transport } from '@advanced-preset/protocol';
import type { ChatMessage, STMessage } from '@/st/host';
import { petals } from './helpers';

const state: { preset: APreset; config: Configuration } = { preset: petals, config: resolveConfiguration(petals, 'other', {}) };
vi.mock('@/store/settings', async (orig) => ({ ...(await orig<object>()), settings: () => ({ enabled: true }) }));
vi.mock('@/store/carrier', () => ({ activeCarrierPresetId: () => state.preset.id }));
vi.mock('@/store/presets', () => ({ getPreset: () => state.preset }));
vi.mock('@/store/config', async (orig) => ({ ...(await orig<object>()), activeConfiguration: () => state.config, presetState: () => ({ userModules: [], globalMemory: { log: [], cursor: 0 } }) }));
vi.mock('@/store/eventlog', async (orig) => ({ ...(await orig<object>()), chatMemory: () => ({}), globalMemory: () => ({}), currentRecap: () => null }));
vi.mock('@/store/user-modules', async (orig) => ({ ...(await orig<object>()), userModules: () => [] }));

const { advancedPresetInterceptor } = await import('@/core/interceptor');
const { onPromptReady } = await import('@/core/assembler');
const { registry } = await import('@/core/context');
const { orchestrate } = await import('@/core/orchestrator');
const { setNativeFetch } = await import('@/st/host');
const { handoff } = await import('@/core/orchestrator');
const { artifactsOf } = await import('@/core/transports/base');


let realChat: STMessage[];
beforeEach(() => {
  realChat = [];
  vi.stubGlobal('localStorage', { getItem: () => 'en', setItem: () => undefined });
  vi.stubGlobal('location', { href: 'http://localhost:8000/' });
  (globalThis as any).toastr = { warning: () => undefined, error: () => undefined, info: () => undefined, success: () => undefined };
  (globalThis as any).SillyTavern = {
    getContext: () => ({
      chat: realChat, name1: 'Me', name2: 'Bot', groupId: null, substituteParams: (s: string) => s,
      chatCompletionSettings: { chat_completion_source: 'openai' }, getCurrentChatId: () => 'chat-1',
      saveSettingsDebounced: () => {}, extensionSettings: {}, mainApi: 'openai', isToolCallingSupported: () => true,
      getRequestHeaders: () => ({}), eventSource: { emit: async () => undefined },
    }),
  };
});
afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; registry.setPending(null); registry.takeArmed(); vi.unstubAllGlobals(); });

const user = (n: number, mes = `input ${n}`): STMessage => ({ is_user: true, name: 'Me', mes, send_date: `u${n}` } as STMessage);
const ai = (n: number): STMessage => ({ is_user: false, name: 'Bot', mes: `story ${n}`, send_date: `a${n}` } as STMessage);

function stPrompt(preset: APreset, history: STMessage[]): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const r of preset.regions) {
    if (r.beforeStage) continue;
    out.push({ role: 'system', content: `⟦ap:region:${r.id}⟧` });
    if (r.id !== preset.anchors.historyStart) continue;
    for (const m of history) out.push({ role: m.is_user ? 'user' : 'assistant', content: m.mes });
  }
  return out;
}

/** A value for a JSON schema node (deterministic). */
function fill(schema: any, key = ''): unknown {
  if (schema?.type === 'array') return [];
  if (schema?.type === 'object' && schema.properties) return Object.fromEntries(Object.keys(schema.properties).map((k) => [k, fill(schema.properties[k], k)]));
  if (schema?.type === 'object') return {};
  return `text of ${key}`;
}

let dialogueReply = '';
const DIALOGUE = 'Freesia: a question\n\nPetals: an answer\n\nFreesia: <START_OF_CONTENT>\nThe rain fell.';
beforeEach(() => { dialogueReply = DIALOGUE; });

/** The backend: answers every request in the shape its transport expects. */
function backend(bodies: Record<string, any>[]) {
  return (async (_url: string, init: RequestInit) => {
    const body = JSON.parse(String(init.body));
    bodies.push(body);
    let message: Record<string, unknown>;
    if (body.json_schema) message = { content: JSON.stringify(fill(body.json_schema.value)) };
    else if (Array.isArray(body.tools) && body.tools.length) {
      const called = new Set(body.messages.flatMap((m: any) => (m.tool_calls ?? []).map((c: any) => c.function.name)));
      const tool = body.tools.find((t: any) => !called.has(t.function.name) && Object.keys(t.function.parameters?.properties ?? {}).length) ?? body.tools[body.tools.length - 1];
      message = { content: '', tool_calls: [{ id: `c${bodies.length}`, type: 'function', function: { name: tool.function.name, arguments: JSON.stringify(fill(tool.function.parameters)) } }] };
    } else message = { content: dialogueReply };
    return new Response(JSON.stringify({ choices: [{ message }] }), { headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;
}

let last: { ctx: any; prompt: ChatMessage[]; reply: string } = null!;

async function requests(transport: Transport, workflow: string, preset: APreset = petals, config?: (c: Configuration) => void, source = 'openai'): Promise<Record<string, any>[]> {
  state.preset = preset;
  state.config = resolveConfiguration(preset, 'other', { connection: { transport, workflow } });
  config?.(state.config);
  const chat = [user(1), ai(1), user(2, 'go north')];
  realChat.splice(0, realChat.length, ...chat);
  const copy = chat.map((m) => ({ ...m }));
  await advancedPresetInterceptor(copy, 0, () => {}, 'normal');
  const prompt = stPrompt(preset, copy);
  await onPromptReady({ chat: prompt, dryRun: false });
  const ctx = registry.takeArmed()!;
  const bodies: Record<string, any>[] = [];
  setNativeFetch(backend(bodies));
  const resp = await orchestrate(ctx, { chat_completion_source: source, model: 'gpt-x', stream: false, messages: prompt });
  expect(resp.status).toBe(200);
  last = { ctx, prompt, reply: (await resp.json()).choices[0].message.content };
  return bodies;
}


/** Petals declaring multi-model, with a stage region before `planning`. */
function mmPreset(): APreset {
  const p = cloneData(petals);
  p.multiModel = {};
  p.regions.push({ id: 'plan_prompt', role: 'system', merge: 'join', separator: '\n\n', beforeStage: 'planning' });
  const always = p.modules.find((m) => m.toggle === 'always')!;
  p.entries.push({ id: `${always.id}/plan`, module: always.id, region: 'plan_prompt', order: 0, content: [{ pieces: [{ text: 'PLAN NOW (phase {{ap::name::editor}})' }] }] });
  return p;
}

const binding = (transport: Transport, model = 'reviewer-model'): ConnectionBinding => ({ name: 'Reviewer', target: { type: 'model', model }, transport, assumeToolSupport: true } as ConnectionBinding);

/** Multi-model on: the editor (Petals) runs on binding `rev`. */
const multi = (transport: Transport, on = true) => (c: Configuration) => {
  c.connection.bindings = { rev: binding(transport) };
  c.multiModel = { enabled: on, actors: { editor: 'rev' } };
};

const text = (m: ChatMessage) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content));
const props = (b: Record<string, any>) => Object.keys(b.json_schema?.value?.properties ?? {});
const toolNames = (b: Record<string, any>) => (b.tools ?? []).map((t: any) => t.function.name);
/** Turn-wide field name of a stage of the last generation. */
const tool = (id: string) => artifactsOf(last.ctx).toolOf(last.ctx.stages.find((s: any) => s.id === id));
const field = (id: string) => artifactsOf(last.ctx).fieldOf(last.ctx.stages.find((s: any) => s.id === id));

describe('multi-model phases', () => {
  it('one request per run of an actor, each on its binding, the earlier phases replayed', async () => {
    const bodies = await requests('structured', 'linear', mmPreset(), multi('tool-multi'));
    expect(bodies).toHaveLength(3);
    const [a, b, c] = bodies as Record<string, any>[];
    // 1: the narrator asks, on the default binding, with ST's prompt and only its own field.
    expect(a!.model).toBe('gpt-x');
    expect(a!.messages).toEqual(last.prompt);
    expect(props(a!)).toEqual([field('questions')]);
    expect(JSON.stringify(a)).not.toContain('PLAN NOW');
    // 2: Petals plans on the reviewer model with tools; the questions come back as a synthetic tool call.
    expect(b!.model).toBe('reviewer-model');
    expect(b!.json_schema).toBeUndefined();
    expect(toolNames(b!)).toEqual(expect.arrayContaining([tool('questions'), tool('planning')]));
    const replayed = b!.messages.find((m: any) => m.tool_calls?.[0]?.function.name === tool('questions'));
    const q = last.ctx.stages[0];
    expect(JSON.parse(replayed.tool_calls[0].function.arguments)).toEqual({ [artifactsOf(last.ctx).paramOf(q)]: `text of ${field('questions')}` });
    expect(replayed.tool_calls[0]).not.toHaveProperty('signature');
    const at = b!.messages.indexOf(replayed);
    expect(b!.messages[at + 1]).toMatchObject({ role: 'tool', tool_call_id: replayed.tool_calls[0].id });
    // The stage region of `planning` comes after the replay, the synthetic turn (if any) after it.
    const plan = b!.messages.findIndex((m: any) => text(m).startsWith('PLAN NOW'));
    expect(plan).toBeGreaterThan(at + 1);
    expect(b!.messages.slice(plan + 1).every((m: any) => m.role !== 'system')).toBe(true);
    // 3: the narrator writes; the earlier stages as the turn object, the turn-wide field names.
    expect(c!.model).toBe('gpt-x');
    expect(props(c!)).toContain(field('final'));
    expect(props(c!)).not.toContain(field('planning'));
    const obj = JSON.parse(text(c!.messages.at(-1)));
    expect(Object.keys(obj)).toEqual([field('questions'), field('planning')]);
    // Petals' status bar is placed before the content: Freesia's content phase writes it, not Petals.
    expect(last.ctx.phases.map((p: any) => p.structures.map((x: any) => x.id))).toEqual([[], [], ['synopsis', 'status', 'options']]);
    const status = artifactsOf(last.ctx).structureFieldOf(last.ctx.structures.find((x: any) => x.id === 'status'));
    expect(props(c!)).toContain(status);
    expect(JSON.stringify(b!.tools)).not.toContain(status);
    expect(JSON.stringify(c)).not.toContain('PLAN NOW');
    // Merged result: the content of the last phase, every stage done, requests per phase.
    expect(last.reply).toBe(`text of ${field('final')}`);
    const sc = handoff.pending!.outcome.sidecar;
    expect(sc.stages.map((s: any) => s.status)).toEqual(['done', 'done', 'done']);
    expect(sc.diagnostics!.phases!.map((p) => [p.actor, p.binding, p.transport, p.requests])).toEqual([
      ['narrator', 'default', 'structured', 1], ['editor', 'rev', 'tool-multi', 1], ['narrator', 'default', 'structured', 1],
    ]);
  });

  it('phase variables: multiModel, phase.stages / index / actor per request', async () => {
    await requests('structured', 'linear', mmPreset(), multi('structured'));
    const ctx = last.ctx;
    expect(ctx.assembly.vars.multiModel).toBe(true);
    expect(ctx.assembly.vars.phase).toEqual({ stages: { questions: true }, index: 0, actor: 'narrator' });
    const second = ctx.phaseAssembly(ctx.phases[1], 'prefill');
    expect(second.vars.phase).toEqual({ stages: { planning: true }, index: 1, actor: 'editor' });
    expect(second.vars.transport).toBe('prefill');
    expect(second.vars.style).toBe(ctx.preset.styles.prefill);
  });

  it('prefill phase: the replay continues the assistant prefill, stage regions just before it', async () => {
    dialogueReply = 'Petals: an answer\n\nFreesia: <START_OF_CONTENT>\nThe rain fell.';
    const bodies = await requests('structured', 'linear', mmPreset(), multi('prefill'));
    const b = bodies[1]!;
    const msgs = b.messages as ChatMessage[];
    expect(msgs.at(-1)!.role).toBe('assistant');
    expect(text(msgs.at(-1)!).endsWith(`: text of ${field('questions')}`)).toBe(true);
    expect(text(msgs.at(-2)!)).toMatch(/^PLAN NOW/);
    expect(b.json_schema).toBeUndefined();
    // The prefill reply (dialogue) is parsed over the phase's stage only.
    expect(handoff.pending!.outcome.sidecar.stages[1]!.status).toBe('done');
  });

  it('plaintext phase: the replay is an assistant message in dialogue form', async () => {
    const bodies = await requests('structured', 'linear', mmPreset(), multi('plaintext'));
    const msgs = bodies[1]!.messages as ChatMessage[];
    const replay = msgs.findLast((m) => m.role === 'assistant')!;
    const p = last.ctx.preset as APreset;
    const back = parseDialogue(text(replay), { stages: last.ctx.stages.slice(0, 1), prefixes: { narrator: `${p.actors.narrator!.name}: `, editor: `${p.actors.editor!.name}: ` }, user: p.user, contentMarker: p.contentMarker, structures: [], format: p.plaintextFormat, final: true });
    expect(back.stages.questions!.text).toBe(`text of ${field('questions')}`);
    expect(text(msgs.at(-1)!)).toMatch(/^PLAN NOW/);
  });

  it('dialogue phases stop where the next phase starts; the overflow is dropped', async () => {
    const p = mmPreset();
    const narrator = p.actors.narrator!.name;
    const editor = p.actors.editor!.name;
    dialogueReply = `${editor}: the plan\n\n${narrator}: <START_OF_CONTENT>\nA story written too early.`;
    const bodies = await requests('structured', 'linear', p, multi('plaintext'));
    expect(bodies[1]!.stop).toEqual([`\n${narrator}:`]);
    const sc = handoff.pending!.outcome.sidecar;
    expect(sc.stages.find((s: any) => s.id === 'planning')!.text).toBe('the plan');
    expect(JSON.stringify(sc.stages)).not.toContain('written too early');
    // Prefill: the stop is added to the preset's own.
    dialogueReply = `${editor}: plan B\n${narrator}: and more`;
    const pre = await requests('structured', 'linear', p, multi('prefill'));
    expect(pre[1]!.stop).toEqual([...p.stop, `\n${narrator}:`]);
    expect(handoff.pending!.outcome.sidecar.stages.find((s: any) => s.id === 'planning')!.text).toBe('plan B');
  });

  it('the last phase (and multi-model off) gets no phase stop', async () => {
    dialogueReply = 'Freesia: <START_OF_CONTENT>\nThe end. Petals: said the sprite.';
    const p = mmPreset();
    const c = (cfg: Configuration) => { multi('structured')(cfg); cfg.connection.transport = 'plaintext'; };
    const bodies = await requests('plaintext', 'linear', p, c);
    expect(bodies).toHaveLength(3);
    expect(bodies[0]!.stop).toEqual([`\n${p.actors.editor!.name}:`]);
    expect(bodies[2]!.stop).toBeUndefined();
    const off = await requests('plaintext', 'linear', p, multi('structured', false));
    expect(off[0]!.stop).toBeUndefined();
  });

  it('Gemini: replayed tool calls carry the skip-validation signature', async () => {
    const bodies = await requests('structured', 'linear', mmPreset(), multi('tool-single'), 'makersuite');
    const replayed = bodies[1]!.messages.find((m: any) => m.tool_calls?.[0]?.function.name === tool('questions'));
    expect(replayed.tool_calls[0].signature).toBe('skip_thought_signature_validator');
    expect(toolNames(bodies[1]!)).toContain(petals.tools.submit.name);
  });

  it('multi-model off: one request on the selected binding, stage regions at its tail', async () => {
    const bodies = await requests('structured', 'linear', mmPreset(), multi('tool-multi', false));
    expect(bodies).toHaveLength(1);
    expect(bodies[0]!.model).toBe('gpt-x');
    expect(text(bodies[0]!.messages.at(-1))).toMatch(/^PLAN NOW/);
    expect(last.ctx.assembly.vars.multiModel).toBe(false);
    expect(last.ctx.assembly.vars.phase.stages).toEqual({ questions: true, planning: true, final: true });
  });

  it('selected binding without multi-model: its transport and target', async () => {
    const bodies = await requests('structured', 'linear', petals, (c) => { c.connection.bindings = { rev: binding('tool-single') }; c.connection.binding = 'rev'; });
    expect(bodies).toHaveLength(1);
    expect(bodies[0]!.model).toBe('reviewer-model');
    expect(toolNames(bodies[0]!)).toContain(petals.tools.submit.name);
  });

  it('presets that do not declare multiModel ignore the switch', async () => {
    const bodies = await requests('structured', 'linear', petals, multi('tool-multi'));
    expect(bodies).toHaveLength(1);
    expect(last.ctx.assembly.vars.multiModel).toBe(false);
  });
});
