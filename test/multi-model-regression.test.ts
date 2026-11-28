/**
 * Regression: without multi-model (and for presets that do not declare it) every request AP sends
 * is exactly what Advanced Preset 1.12.1 sent. The fixture was captured with 1.12.1's engine
 * (`CAPTURE=1 pnpm vitest run test/multi-model-regression.test.ts` on that version) for Petals 7.12.1,
 * kept in fixtures/petals-7.12.1.apreset.json so later Petals releases do not move the baseline.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveConfiguration, type APreset, type Configuration, type Transport } from '@advanced-preset/protocol';
import type { ChatMessage, STMessage } from '@/st/host';
import { petals712 as petals } from './helpers';

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

const FIXTURE = new URL('./fixtures/requests-1.12.1.json', import.meta.url);

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
    } else message = { content: 'Freesia: a question\n\nPetals: an answer\n\nFreesia: <START_OF_CONTENT>\nThe rain fell.' };
    return new Response(JSON.stringify({ choices: [{ message }] }), { headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;
}

async function requests(transport: Transport, workflow: string, preset: APreset = petals, config?: (c: Configuration) => void): Promise<Record<string, any>[]> {
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
  const resp = await orchestrate(ctx, { chat_completion_source: 'openai', model: 'gpt-x', stream: false, messages: prompt });
  expect(resp.status).toBe(200);
  return bodies;
}

const CASES: [Transport, string][] = (['prefill', 'plaintext', 'structured', 'tool-single', 'tool-multi'] as Transport[]).flatMap((t) => ['linear', 'iterative', 'edit'].map((w) => [t, w] as [Transport, string]));

describe('requests without multi-model are those of 1.12.1', () => {
  it('every transport and workflow', async () => {
    const got: Record<string, unknown> = {};
    for (const [t, w] of CASES) got[`${t}/${w}`] = await requests(t, w);
    if (process.env.CAPTURE) { writeFileSync(FIXTURE, `${JSON.stringify(got, null, 1)}\n`); return; }
    const want = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    for (const k of Object.keys(want)) expect(JSON.stringify(got[k]), k).toBe(JSON.stringify(want[k]));
  });
});

