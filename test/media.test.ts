import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IMAGE_OFF, SPEECH_OFF, parseSpeech, type StructureDecl } from '@advanced-preset/protocol';
import { handoff, orchestrate } from '@/core/orchestrator';
import { imageRuntime, mediaRuntime, provideMedia, resetMedia, speechRuntime } from '@/core/media-vars';
import { decodeMode, encodeMode, rewriteHistory, speechHistory, type HistoryItem } from '@/core/history';
import { setNativeFetch } from '@/st/host';
import { ctxFor, petals } from './helpers';

const SPEECH: StructureDecl = { id: 'voice', kind: 'speech', tag: 'speech', field: 'voice', formatPrompt: { tag: '', field: '' } };
const ANNOTATIONS: StructureDecl = { id: 'notes', kind: 'annotations', tag: 'notes', field: 'notes', formatPrompt: { tag: '', field: '' } };

afterEach(() => resetMedia());

describe('media runtime', () => {
  it('is off without a provider or a declaration', () => {
    expect(mediaRuntime().image().vars).toEqual(IMAGE_OFF);
    expect(mediaRuntime().speech().vars).toEqual(SPEECH_OFF);
    provideMedia({ image: () => ({ vars: { ...IMAGE_OFF, on: true, api: 'openai' }, refs: [{ id: 'r1', description: 'Ann' }] }) });
    expect(imageRuntime({}).vars.on).toBe(false);
    expect(imageRuntime({ image: {} })).toEqual({ vars: { ...IMAGE_OFF, on: true, api: 'openai', refs: true }, refs: [{ id: 'r1', description: 'Ann' }] });
  });

  it('derives refs / characters and drops refs for NovelAI', () => {
    provideMedia({ image: () => ({ vars: { ...IMAGE_OFF, on: true, api: 'novelai', refs: true }, refs: [{ id: 'r1', description: 'x' }] }) });
    expect(imageRuntime({ image: {} })).toEqual({ vars: { ...IMAGE_OFF, on: true, api: 'novelai' }, refs: [] });
    provideMedia({ speech: () => ({ vars: { ...SPEECH_OFF, on: true, api: 'fish' }, format: 'f', characters: [' Ann ', 'Ann', ''] }) });
    expect(speechRuntime({ speech: {} })).toMatchObject({ vars: { on: true, characters: true }, characters: ['Ann'], format: 'f' });
    provideMedia({ speech: () => ({ vars: { ...SPEECH_OFF, api: 'fish' }, format: 'f', characters: ['Ann'] }) });
    expect(speechRuntime({ speech: {} })).toEqual({ vars: SPEECH_OFF, format: '', characters: [] });
  });

  it('survives a failing provider', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    provideMedia({ speech: () => { throw new Error('boom'); } });
    expect(speechRuntime({ speech: {} }).vars).toEqual(SPEECH_OFF);
    err.mockRestore();
  });
});

describe('speech history', () => {
  const ai = (raw: string): HistoryItem => {
    const r = parseSpeech(raw);
    return { is_user: false, mes: r.text, extra: { advanced_preset: { v: 1, turn: 'story', structures: {}, speech: r.spans } } };
  };
  const user = (mes: string): HistoryItem => ({ is_user: true, mes });
  const base = { trigger: '', wrap: false, tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 0 }, synopsisTemplate: '', realIndex: (i: number) => i, currentInput: -1 };
  const items = [user('u1'), ai('A <speech character="X">[sigh] b</speech> c'), user('u2'), ai('D <speech character="Y">e</speech> f'), user('u3')];

  it('sends clean text by default and re-injects the last N messages', () => {
    expect(rewriteHistory(items, base).map((m) => m.mes)).toEqual(['u1', 'A b c', 'u2', 'D e f', 'u3']);
    expect(rewriteHistory(items, { ...base, speech: { depth: 2, tag: 'speech' } }).map((m) => m.mes))
      .toEqual(['u1', 'A <speech character="X">[sigh] b</speech> c', 'u2', 'D <speech character="Y">e</speech> f', 'u3']);
    expect(rewriteHistory(items, { ...base, speech: { depth: 1, tag: 'speech' } })[1]!.mes).toBe('A b c');
  });

  it('stores the rendering compactly', () => {
    for (const m of [{ body: 'full' as const, speech: true }, { body: 'full' as const, annotations: true, speech: true, echo: ['a', 'b'] }, { body: 'full' as const, annotations: true }]) expect(decodeMode(encodeMode(m))).toEqual(m);
    expect(encodeMode({ body: 'full', annotations: true, speech: true })).toBe('fav');
    expect(decodeMode('fya+s', 'syn')).toEqual({ body: 'full', annotations: true, echo: ['syn', 's'] });
  });

  it('applies only while speech is on and requested', () => {
    const preset = { ...petals, speech: {}, structures: { ...petals.structures, voice: { ...SPEECH, history: 3 } }, modules: [...petals.modules, { id: 'v', name: 'v', toggle: 'always', default: true, structures: ['voice'], vars: [] }] } as typeof petals;
    const config = petals.configurationDefaults;
    expect(speechHistory(preset, config, { speech: { ...SPEECH_OFF, on: true } })).toEqual({ depth: 3, tag: 'speech' });
    expect(speechHistory(preset, config, { speech: SPEECH_OFF })).toBeUndefined();
    expect(speechHistory({ ...preset, speech: undefined }, config, { speech: { ...SPEECH_OFF, on: true } })).toBeUndefined();
  });
});

describe('orchestrated speech lines', () => {
  const reply = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { headers: { 'Content-Type': 'application/json' } });
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => 'en' });
    vi.stubGlobal('location', { href: 'http://localhost:8000/' });
    (globalThis as any).toastr = { warning: vi.fn(), error: vi.fn(), info: vi.fn() };
    (globalThis as any).SillyTavern = { getContext: () => ({ chat: [], mainApi: 'openai', chatCompletionSettings: {}, getRequestHeaders: () => ({}), isToolCallingSupported: () => true, eventSource: { emit: async () => undefined } }) };
    handoff.pending = null;
  });
  afterEach(() => { delete (globalThis as any).SillyTavern; delete (globalThis as any).toastr; vi.unstubAllGlobals(); });

  const run = async (text: string, structures: StructureDecl[]) => {
    setNativeFetch((async () => reply(text)) as typeof fetch);
    const ctx = ctxFor('plaintext', 'linear', {}, { ...petals, speech: {} });
    ctx.structures = [...ctx.structures, ...structures];
    const resp = await orchestrate(ctx, { chat_completion_source: 'openai', model: 'x', stream: false, messages: [{ role: 'user', content: 'Hi' }] }, new AbortController().signal);
    return { content: (await resp.json()).choices[0].message.content as string, sidecar: handoff.pending!.outcome.sidecar };
  };

  it('keeps the line in mes and the span in the sidecar, with a provider cleaner', async () => {
    provideMedia({ speech: () => ({ vars: { ...SPEECH_OFF, on: true, api: 'minimax' }, format: '', characters: [], cleaner: /\((?:laughs|sighs)\)\s*/g }) });
    const ctx = await run('Rain. <speech character="Ann">(sighs) Again?</speech> Yes.', [SPEECH]);
    expect(ctx.content).toContain('Rain. Again? Yes.');
    expect(ctx.sidecar.speech).toMatchObject([{ character: 'Ann', quote: 'Again?', text: '(sighs) Again?' }]);
  });

  it('anchors annotations inside speech lines on the final text', async () => {
    const out = await run('<speech character="Ann">{==Again==}{>>tired<<}? Fine.</speech>', [ANNOTATIONS, SPEECH]);
    expect(out.content).toContain('Again? Fine.');
    const mes = out.content.slice(out.content.indexOf('Again'));
    expect(out.sidecar.speech![0]!.quote).toBe('Again? Fine.');
    expect(out.sidecar.annotations).toMatchObject([{ quote: 'Again', comment: 'tired' }]);
    expect(mes.slice(0, 5)).toBe('Again');
  });

  it('leaves the markup alone when speech is not requested', async () => {
    const out = await run('<speech character="Ann">Hi</speech>', []);
    expect(out.content).toContain('<speech character="Ann">Hi</speech>');
    expect(out.sidecar.speech).toBeUndefined();
  });
});
