import { describe, expect, it } from 'vitest';
import { assemble, defaultVars, resolveConfiguration } from '@advanced-preset/protocol';
import { compile, type SourceTree } from '../src/compile';
import { validate } from '../src/validate';
import { Diagnostics } from '../src/diagnostics';
import { compileContent, parseMarkdown } from '../src/markdown';

const MANIFEST = `
id: demo
name: Demo
version: 1.0.0
actors:
  narrator: { name: Nia }
  user: { name: "{{user}}" }
regions:
  - { id: top }
  - { id: guide, merge: { wrap: guidelines } }
  - { id: settings, native: true }
  - { id: history, anchor: historyStart }
  - { id: task, anchor: historyEnd }
  - { id: tail, anchor: tail }
workflowRegion: task
params:
  - { id: language, type: text, label: Language, unset: the story language }
groups:
  style: { label: Style, allowNone: true }
structures:
  reply: { kind: reply, tag: Reply, formatPrompt: { tag: "<Reply>…</Reply>", field: "Use the reply field." } }
regex:
  - { id: summary, pattern: "(summary|总结)", requires: meta.pure }
meta:
  tasks: { summary: flags.summary }
carrier:
  order: [top, guide, { main: false }, charDescription, history, chatHistory, task, tail]
configurations:
  - { id: fast, name: Fast, diff: { connection: { transport: prefill } } }
`;

const tree = (extra: Record<string, string> = {}): SourceTree =>
  new Map(Object.entries({
    'preset.yaml': MANIFEST,
    'modules/core.md': `---
id: core
toggle: always
region: top
---
<!-- @entry id=intro -->
You are {{ap::name::narrator}}.
<!-- @style dialogue -->
Speak with prefixes.
<!-- @style imperative -->
Fill the fields.
<!-- @end -->
Write in {{ap::param::language}}.

<!-- @entry id=meta region=task when="meta.pure" -->
Reply only. {{ap::structure::reply}}
`,
    'modules/style/a.md': `---
id: style-a
group: style
exclusive: style
default: true
region: guide
---
Style A.
`,
    'modules/style/b.md': `---
id: style-b
group: style
exclusive: style
default: true
region: guide
order: 10
---
Style B.
`,
    'workflows/linear.md': `---
id: linear
stages:
  - { id: plan, actor: narrator, kind: text, label: Plan }
  - { id: final, actor: narrator, kind: content, label: Write }
---
<!-- @section intro style=dialogue -->
{{ap::prefix::narrator}}Let's go.
<!-- @section intro style=imperative -->
Run the workflow.
<!-- @section stage:plan -->
Plan the scene.
<!-- @section stage:final -->
Write it.
<!-- @section outro style=dialogue -->
\`\`\`
{{ap::workflow::summary}}
<!-- @as assistant -->
\`\`\`
`,
    'workflows/task.md': `---
id: task
kind: task
stages:
  - { id: thinking, actor: narrator, kind: text, tag: thinking, label: Thinking }
  - { id: content, actor: narrator, kind: content, optional: true, label: Output }
---
<!-- @section stage:thinking -->
Think.
<!-- @section stage:content -->
Answer.
`,
    ...extra,
  }));

function build(t: SourceTree) {
  const r = compile(t);
  if (r.preset) validate(r.preset, r.map, r.diag);
  return r;
}

describe('markdown directives', () => {
  it('splits entries, keeps comments and literal fences', () => {
    const d = new Diagnostics();
    const f = parseMarkdown('a\n<!-- Workflow Start -->\n<!-- @entry id=x -->\nb\n```\n<!-- @entry id=y -->\n```\n', ['entry'], d, {});
    expect(f.chunks).toHaveLength(2);
    expect(f.chunks[0]!.tokens[0]).toEqual({ kind: 'text', text: 'a\n<!-- Workflow Start -->\n' });
    expect(f.chunks[1]!.head!.attrs.id).toBe('x');
    expect(JSON.stringify(f.chunks[1]!.tokens)).toContain('@entry id=y');
  });

  it('compiles @as / @if / @else into blocks and conditional pieces', () => {
    const d = new Diagnostics();
    const f = parseMarkdown('one <!-- @if params.x != "" -->X<!-- @else -->none<!-- @end -->\n<!-- @as assistant -->\nok\n', [], d, {});
    const c = compileContent(f.chunks[0]!.tokens, d, {});
    expect(d.ok).toBe(true);
    expect(c).toHaveLength(2);
    expect(c[0]!.pieces.map((p) => p.text)).toEqual(['one ', 'X', 'none', '\n']);
    expect(c[0]!.pieces[2]!.when).toMatchObject({ t: 'not' });
    expect(c[1]).toMatchObject({ role: 'assistant' });
  });

  it('reports unbalanced blocks', () => {
    const d = new Diagnostics();
    const f = parseMarkdown('<!-- @if modules.x -->\ntext\n', [], d, {});
    compileContent(f.chunks[0]!.tokens, d, { file: 'm.md' });
    expect(d.errors[0]!.message).toMatch(/unclosed/);
  });
});

describe('compile + validate', () => {
  it('builds a clean artifact', () => {
    const { preset, diag } = build(tree());
    expect(diag.errors).toEqual([]);
    expect(preset!.hash).toMatch(/^[0-9a-f]{16}$/);
    expect(preset!.carrier.prompt_order.map((o) => o.identifier)).toEqual(['ap_top', 'ap_guide', 'main', 'charDescription', 'ap_history', 'chatHistory', 'ap_task', 'ap_tail']);
    expect(preset!.carrier.prompts.find((p) => p.identifier === 'ap_top')!.content).toBe('⟦ap:region:top⟧');
    expect(preset!.configurationDefaults.connection.workflow).toBe('linear');
    expect(preset!.configurationDefaults.modules).toEqual({ 'style-a': true, 'style-b': true });
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/several modules enabled by default/);
    // literal @as inside the fenced block stays text
    const outro = preset!.workflows[0]!.sections.outro.dialogue!;
    expect(outro).toHaveLength(1);
    expect(outro[0]!.pieces[0]!.text).toContain('<!-- @as assistant -->');
  });

  it('is deterministic', () => {
    expect(build(tree()).preset!.hash).toBe(build(tree()).preset!.hash);
  });

  it('flags unknown references', () => {
    const { diag } = build(tree({
      'modules/bad.md': `---
id: bad
group: style
region: nowhere
when: modules.missing || transport == "fax"
structures: [ghost]
---
{{ap::name::ghost}} {{ap::param::nope}} {{ap::frob}}
`,
    }));
    const msgs = diag.errors.map((e) => e.message).join('\n');
    expect(msgs).toMatch(/unknown module `missing`/);
    expect(msgs).toMatch(/`transport` is never "fax"/);
    expect(msgs).toMatch(/unknown structure `ghost`/);
    expect(msgs).toMatch(/unknown region `nowhere`/);
    expect(msgs).toMatch(/unknown actor `ghost`/);
    expect(msgs).toMatch(/unknown param `nope`/);
    expect(msgs).toMatch(/unknown macro/);
  });
});

describe('assemble', () => {
  it('renders regions per style with exclusive winners and macros', () => {
    const { preset } = build(tree());
    const p = preset!;
    const config = resolveConfiguration(p, 'fast', undefined);
    const a = assemble({ preset: p, config, vars: defaultVars(p, config) });
    expect(a.vars.style).toBe('dialogue');
    expect(a.regions.top![0]!.content).toBe('You are Nia.\nSpeak with prefixes.\nWrite in the story language.');
    // style-a wins (path order) and the region is wrapped
    expect(a.regions.guide).toEqual([{ role: 'system', content: '<guidelines>\nStyle A.\n</guidelines>' }]);
    expect(a.regions.task![0]!.content).toContain("Nia: Let's go.");
    expect(a.regions.task![0]!.content).toContain('Start -> Plan (Nia) -> Write (Nia) -> (End)');

    const imperative = resolveConfiguration(p, 'fast', { connection: { transport: 'structured' }, params: { language: 'English' } });
    const b = assemble({ preset: p, config: imperative, vars: { ...defaultVars(p, imperative), meta: { present: true, pure: true, mixed: false, task: null, recent: false } } });
    expect(b.regions.top![0]!.content).toBe('You are Nia.\nFill the fields.\nWrite in English.');
    expect(b.regions.task!.map((m) => m.content).join('\n')).toContain('Reply only. Use the reply field.');
    expect(b.regions.task!.map((m) => m.content).join('\n')).toContain('### Step 1: Plan (Nia)');
  });
});
