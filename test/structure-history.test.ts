import { describe, expect, it } from 'vitest';
import {
  fillHistoryTemplate, historyEchoOf, historyPlacement, insertPieces, legacyHistoryPieces, parseExpr, resolveConfiguration, cloneData, defaultVars,
  type APreset, type StructureDecl, type Workflow,
} from '@advanced-preset/protocol';
import { historyEchoes, rewriteHistory, type HistoryItem, type RewriteOptions } from '@/core/history';
import { stickyRewrite } from '@/core/cache';
import { petals } from './helpers';

const decl = (o: Partial<StructureDecl> & Pick<StructureDecl, 'id' | 'kind'>): StructureDecl => ({ tag: o.id, field: o.id, formatPrompt: { tag: '', field: '' }, ...o });
const wf = { stages: [{ id: 'plan', kind: 'thinking' }, { id: 'story', kind: 'content' }, { id: 'review', kind: 'thinking' }] } as unknown as Workflow;

describe('structure history: declarations', () => {
  it('reads legacy synopsis history as raw pieces around {{content}}', () => {
    expect(legacyHistoryPieces('{{content}}\n\n<s>{{time}}</s>')).toEqual([{ template: '\n\n<s>{{time}}</s>', position: 'after', raw: true }]);
    expect(legacyHistoryPieces('<a>{{content}}</a>')).toEqual([
      { template: '<a>', position: 'before', raw: true },
      { template: '</a>', position: 'after', raw: true },
    ]);
    expect(historyEchoOf(decl({ id: 's', kind: 'synopsis', history: 2 }))?.pieces[0]?.template).toMatch(/^\n\n\[\{\{time\}\}/);
    expect(historyEchoOf(decl({ id: 's', kind: 'synopsis', history: 0 }))).toBeUndefined();
    expect(historyEchoOf(decl({ id: 'a', kind: 'annotations', history: 2 }))).toBeUndefined();
    expect(historyEchoOf(decl({ id: 'o', kind: 'options', history: 2 }))).toBeUndefined();
  });

  it('places pieces by position, else by the structure order relative to the content stage', () => {
    const status = decl({ id: 'status', kind: 'status', order: { before: '@content' } });
    const synopsis = decl({ id: 'synopsis', kind: 'synopsis' });
    expect(historyPlacement(wf, status, undefined)).toEqual({ key: 200, rank: -1 });
    expect(historyPlacement(wf, synopsis, undefined)).toEqual({ key: 200, rank: 1 });
    expect(historyPlacement(wf, decl({ id: 'x', kind: 'custom', order: { after: 'plan' } }), undefined)).toEqual({ key: 100, rank: 1 });
    expect(historyPlacement(wf, decl({ id: 'x', kind: 'custom', order: 250 }), undefined)).toEqual({ key: 250, rank: 1 });
    expect(historyPlacement(wf, synopsis, 'before')).toEqual({ key: 200, rank: -1 });
    expect(historyPlacement(wf, status, 'after')).toEqual({ key: 200, rank: 1 });
    expect(historyPlacement(wf, status, 150)).toEqual({ key: 150, rank: 1 });
    // Per-workflow order wins over the declaration.
    expect(historyPlacement({ ...wf, structureOrder: { synopsis: { before: 'story' } } }, synopsis, undefined)).toEqual({ key: 200, rank: -1 });
    // Without a workflow: `before` orders go before the text, everything else after it.
    expect(historyPlacement(undefined, status, undefined)).toEqual({ key: 0, rank: -1 });
  });

  it('fills field placeholders and {{value}}', () => {
    const st = { date: '05-01', weekday: 'Mon', time: '08:00', location: 'Home', weather: 'Rain' };
    expect(fillHistoryTemplate('<status>{{date}} {{time}} {{missing}} {{user}}</status>', 'status', st)).toBe('<status>05-01 08:00 {{missing}} {{user}}</status>');
    expect(fillHistoryTemplate('{{value}}', 'status', st)).toBe('05-01 Mon 08:00 | Home | Rain');
    expect(fillHistoryTemplate('{{weather}}', 'status', { date: 'x' })).toBe('');
    expect(fillHistoryTemplate('[{{value}}]', 'custom', 'free text')).toBe('[free text]');
    expect(fillHistoryTemplate('{{mood}} / {{value}}', 'custom', { mood: 'calm', hp: '3' })).toBe('calm / mood: calm\nhp: 3');
    expect(fillHistoryTemplate('{{value}}', 'options', [{ label: 'Go', content: 'I go.' }])).toBe('- Go: I go.');
  });

  it('inserts pieces around the text: blank lines, raw pieces glued, sorted by key / rank / order', () => {
    const out = insertPieces('BODY', 200, [
      { text: 'after-2', key: 200, rank: 1, order: 2 },
      { text: 'before', key: 200, rank: -1, order: 0 },
      { text: 'early', key: 100, rank: 1, order: 5 },
      { text: 'after-1', key: 200, rank: 1, order: 1 },
      { text: '', key: 300, rank: 1, order: 0 },
    ]);
    expect(out).toBe('early\n\nbefore\n\nBODY\n\nafter-1\n\nafter-2');
    expect(insertPieces('B', 0, [{ text: '<a>', key: 0, rank: -1, order: 0, raw: true }, { text: '</a>', key: 0, rank: 1, order: 1, raw: true }])).toBe('<a>B</a>');
  });
});

// ---- rewriting ---------------------------------------------------------------------------------

const status = (n: number) => ({ date: `Day${n}`, weekday: '', time: `0${n}:00`, location: `L${n}`, weather: 'Sun' });
const syn = (n: number) => ({ time: `T${n}`, location: `L${n}`, event: `E${n}`, summary: `S${n}` });
const ai = (n: number, structures: Record<string, unknown> = { status: status(n), synopsis: syn(n) }): HistoryItem => ({
  is_user: false, name: 'Bot', mes: `story ${n}`, send_date: `a${n}`, extra: { advanced_preset: { v: 1, turn: 'story', structures } },
});
const user = (n: number): HistoryItem => ({ is_user: true, name: 'Me', mes: `input ${n}`, send_date: `u${n}` });
const chat = (n: number) => { const out: HistoryItem[] = []; for (let i = 1; i < n; i++) out.push(user(i), ai(i)); out.push(user(n)); return out; };

/** A copy of Petals with history declared on status and synopsis. */
function preset(status: StructureDecl['history'], synopsis: StructureDecl['history']): APreset {
  const p = cloneData(petals);
  p.structures.status!.history = status;
  p.structures.synopsis!.history = synopsis;
  delete p.structures.synopsis!.historyTemplate;
  return p;
}
const base = (items: HistoryItem[], p: APreset, transport: 'plaintext' | 'structured' = 'plaintext', o: Partial<RewriteOptions> = {}): RewriteOptions => {
  const config = resolveConfiguration(p, p.defaultConfiguration, {});
  config.modules['status-bar'] = true;
  config.modules['event-synopsis'] = true;
  config.connection.transport = transport;
  const workflow = p.workflows.find((w) => w.id === 'linear');
  return {
    trigger: '', wrap: true,
    tokenSaving: { enabled: false, keepFullTurns: 2, truncateUserAfter: 0, userInput: 'keep' },
    synopsisTemplate: '[{{time}}] {{event}}', synopsisId: 'synopsis',
    echoes: historyEchoes(p, config, defaultVars(p, config, { transport }), workflow),
    recap: null, realIndex: (i) => i, currentInput: items.length - 1,
    ...o,
  };
};
const plaintextOnly = parseExpr('transport in ["plaintext", "prefill"]');

describe('structure history: rewriting', () => {
  it('status goes before the text (its order), synopsis after it; each with its own depth', () => {
    const p = preset({ depth: 1, template: '<status>{{date}} {{time}}</status>' }, { depth: 2, template: '<synopsis>{{event}}</synopsis>' });
    const items = chat(4);
    const out = rewriteHistory(items, base(items, p)).filter((m) => !m.is_user).map((m) => m.mes);
    expect(out).toEqual([
      'story 1',
      'story 2\n\n<synopsis>E2</synopsis>',
      '<status>Day3 03:00</status>\n\nstory 3\n\n<synopsis>E3</synopsis>',
    ]);
  });

  it('explicit positions and sort keys override the default placement', () => {
    const p = preset({ depth: 1, template: 'S', position: 'after' }, { depth: 1, template: 'Y', position: 1 });
    const items = chat(2);
    expect(rewriteHistory(items, base(items, p))[1]!.mes).toBe('Y\n\nstory 1\n\nS');
  });

  it('conditions select structures per request', () => {
    const p = preset({ depth: 1, template: 'S', when: plaintextOnly }, { depth: 1, template: 'Y', when: parseExpr('!modules.status-bar || transport in ["plaintext", "prefill"]') });
    const items = chat(2);
    expect(rewriteHistory(items, base(items, p, 'plaintext'))[1]!.mes).toBe('S\n\nstory 1\n\nY');
    expect(rewriteHistory(items, base(items, p, 'structured'))[1]!.mes).toBe('story 1');
  });

  it('skips structures without a value, and the message being continued', () => {
    const p = preset({ depth: 2, template: 'S{{date}}' }, undefined);
    const items = [user(1), ai(1, { synopsis: syn(1) }), user(2), ai(2)];
    const o = base(items, p, 'plaintext', { currentInput: -1 });
    expect(rewriteHistory(items, o).map((m) => m.mes)).toEqual(['input 1', 'story 1', 'input 2', 'SDay2\n\nstory 2']);
    expect(rewriteHistory(items, { ...o, continuing: 3 })[3]!.mes).toBe('story 2');
  });

  it('keeps legacy synopsis history output byte for byte', () => {
    const p = cloneData(petals);
    delete p.structures.status!.history;
    p.structures.synopsis!.history = 1;
    p.structures.synopsis!.historyTemplate = '{{content}} | {{time}}';
    const items = chat(2);
    expect(rewriteHistory(items, base(items, p))[1]!.mes).toBe('story 1 | T1');
  });

  it('sticky rendering keeps a structure the current rules no longer carry', () => {
    const p = preset({ depth: 1, template: 'S', when: plaintextOnly }, undefined);
    const items = chat(2);
    const prev = { a1: 'f+status' };
    const rw = stickyRewrite(items, base(items, p, 'structured'), prev, (i) => items[i]!.send_date!);
    const e = rw.entries.find((x) => x.key === 'a1')!;
    expect(e.sticky).toBe('S\n\nstory 1');
    expect(e.fresh).toBe('story 1');
    expect(e.stickyMode).toBe('f+status');
    expect(e.freshMode).toBe('f');
  });
});
