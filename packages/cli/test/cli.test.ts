import { describe, expect, it } from 'vitest';
import { assemble, defaultVars, resolveConfiguration, withUserModules, type UserModule } from '@advanced-preset/protocol';
import { compile, type SourceTree } from '../src/compile';
import { validate } from '../src/validate';
import { Diagnostics } from '../src/diagnostics';
import { compileContent, parseMarkdown } from '../src/markdown';
import { isSourcePath } from '../src/io';

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

  it('strips author comments, including commented-out entries', () => {
    const d = new Diagnostics();
    const f = parseMarkdown('a <!--# note -->\n<!--#\n<!-- @entry id=old -->\nold text\n-->\n<!-- @entry id=x -->\nb\n', ['entry'], d, {});
    expect(d.ok).toBe(true);
    expect(f.chunks).toHaveLength(2);
    expect(f.chunks[0]!.tokens).toEqual([{ kind: 'text', text: 'a\n' }]);
    expect(f.chunks[1]!.head).toMatchObject({ name: 'entry', line: 6 });
  });

  it('reports an unclosed comment with file and line', () => {
    const d = new Diagnostics();
    parseMarkdown('---\nid: m\n---\ntext\n<!--# todo\n', [], d, { file: 'modules/m.md' });
    expect(d.errors[0]).toMatchObject({ message: expect.stringMatching(/unclosed comment/), file: 'modules/m.md', line: 5 });
  });

  it('reports unbalanced blocks', () => {
    const d = new Diagnostics();
    const f = parseMarkdown('<!-- @if modules.x -->\ntext\n', [], d, {});
    compileContent(f.chunks[0]!.tokens, d, { file: 'm.md' });
    expect(d.errors[0]!.message).toMatch(/unclosed/);
  });
});

describe('compile + validate', () => {
  it('warns when allowNone is declared on a group that is not an exclusive set', () => {
    const t = tree();
    t.set('preset.yaml', MANIFEST.replace('style: { label: Style, allowNone: true }', 'style: { label: Style, allowNone: true }\n  misc: { label: Misc, allowNone: true }'));
    const warns = build(t).diag.warnings.map((w) => w.message).join('\n');
    expect(warns).toMatch(/group `misc`: allowNone only applies to an exclusive set/);
    expect(warns).not.toMatch(/group `style`: allowNone/);
  });

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

describe('tools section', () => {
  const withTools = (tools: string, stages?: string) => {
    const t = tree();
    t.set('preset.yaml', `${MANIFEST}${tools}`);
    if (stages) t.set('workflows/linear.md', t.get('workflows/linear.md')!.replace(/stages:\n(  - .*\n)+/, `stages:\n${stages}`));
    return build(t);
  };

  it('defaults to the format-1 names when omitted', () => {
    const { preset } = build(tree());
    expect(preset!.formatVersion).toBe(3);
    expect(preset!.tools.submit.name).toBe('ap_submit_turn');
    expect(preset!.tools.stage.name).toBe('ap_stage_{{stage}}');
  });

  it('compiles names, params, descriptions and stage overrides', () => {
    const { preset, diag } = withTools(`
tools:
  turn: { name: demo_turn, field: "{{stage}}_{{n}}", description: "Turn of {{ap::name::narrator}}" }
  submit: { name: submit_turn, description: Submit everything }
  stage: { name: "{{stage}}", description: "{{label}}", param: { name: text, description: Stage text } }
  patch: { old: Old text }
  envelope: { thinking: { name: reasoning } }
  results: { done: All done }
`, `  - { id: plan, actor: narrator, kind: text, label: Plan, tool: { name: make_plan, param: plan }, field: { description: The plan } }
  - { id: final, actor: narrator, kind: content, label: Write }
`);
    expect(diag.errors).toEqual([]);
    const p = preset!;
    expect(p.tools.turn).toEqual({ name: 'demo_turn', field: '{{stage}}_{{n}}', description: 'Turn of {{ap::name::narrator}}', fieldDescription: '{{label}}' });
    expect(p.tools.stage.param).toEqual({ name: 'text', description: 'Stage text' });
    expect(p.tools.envelope.thinking.name).toBe('reasoning');
    expect(p.tools.envelope.result.name).toBe('result');
    expect(p.tools.results.done).toBe('All done');
    expect(p.workflows[0]!.stages[0]!.tool).toEqual({ name: 'make_plan', param: { name: 'plan' } });
    expect(p.workflows[0]!.stages[0]!.field).toEqual({ description: 'The plan' });
  });

  it('compiles envelope.when and asks for the AP version that reads it', () => {
    const { preset, diag } = withTools(`
tools:
  envelope: { when: 'transport != "structured"' }
`);
    expect(diag.errors).toEqual([]);
    expect(preset!.tools.envelope.when).toBeDefined();
    expect(preset!.tools.envelope.thinking.name).toBe('thinking');
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/tools\.envelope\.when needs Advanced Preset 1\.11\.1/);
  });

  it('accepts legacy keys with a warning', () => {
    const { preset, diag } = withTools(`
tools:
  submit: Submit it.
  stagePrefix: x_
  stageResult: Next {{next}}
`);
    expect(diag.errors).toEqual([]);
    expect(preset!.tools.submit).toEqual({ name: 'ap_submit_turn', description: 'Submit it.' });
    expect(preset!.tools.stage.name).toBe('x_{{stage}}');
    expect(preset!.tools.results.next).toBe('Next {{next}}');
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/legacy tools keys/);
  });

  it('flags invalid and colliding names', () => {
    const { diag } = withTools(`
tools:
  submit: { name: "bad name" }
  stage: { name: same, param: z_reply }
  turn: { field: z_reply }
`);
    const msgs = diag.errors.map((e) => e.message).join('\n');
    expect(msgs).toMatch(/tools.submit.name `bad name`/);
    expect(msgs).toMatch(/tool `same` is also used by stage plan/);
    expect(msgs).toMatch(/field `z_reply` collides with a structure field/);
    expect(msgs).toMatch(/tool parameter `z_reply` collides with a structure field/);
  });

  it('prefixes structure fields so they sort after the stages (I-94)', () => {
    const { preset, diag } = build(tree({ 'preset.yaml': MANIFEST.replace('field: "Use the reply field." } }', 'field: "Use the `{{field}}` field." }, description: "Reply in `{{field}}`." }') }));
    expect(preset!.tools.structurePrefix).toBe('z_');
    expect(preset!.structures.reply).toMatchObject({ field: 'z_reply', description: 'Reply in `z_reply`.', formatPrompt: { field: 'Use the `z_reply` field.' } });
    expect(diag.warnings.map((w) => w.message).join('\n')).not.toMatch(/sorts before/);
  });

  it('honours tools.structurePrefix and warns about order and stale names', () => {
    const { preset, diag } = withTools(`
tools:
  structurePrefix: ""
  stage: { param: text }
`);
    expect(preset!.structures.reply!.field).toBe('reply');
    const warnings = diag.warnings.map((w) => w.message).join('\n');
    expect(warnings).toMatch(/structure field `reply` sorts before stage field `step\d_/);
    expect(warnings).toMatch(/structure field `reply` sorts before `text` of tool/);
    const stale = build(tree({ 'preset.yaml': MANIFEST.replace('field: "Use the reply field."', 'field: "Use the `reply` field."') }));
    expect(stale.diag.warnings.map((w) => w.message).join('\n')).toMatch(/mentions `reply`, but the field is `z_reply`/);
    const bad = withTools('tools:\n  structurePrefix: "1x"\n');
    expect(bad.diag.errors.map((e) => e.message).join('\n')).toMatch(/tools.structurePrefix `1x`/);
  });

  it('warns when stage fields do not sort in order', () => {
    const { diag } = withTools('tools:\n  turn: { field: "{{stage}}" }\n');
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/stage field `\w+` sorts before `\w+`/);
  });

  it('checks structure sub-field descriptions', () => {
    const t = tree();
    t.set('preset.yaml', MANIFEST.replace('structures:\n', 'structures:\n  synopsis: { kind: synopsis, properties: { time: When, mood: x }, formatPrompt: { tag: a, field: b } }\n'));
    const { preset, diag } = build(t);
    expect(diag.errors.map((e) => e.message).join('\n')).toMatch(/synopsis has no sub-field `mood`/);
    expect(preset!.structures.synopsis!.properties).toEqual({ time: 'When' });
  });

  it('compiles inline annotations: shared format text, history, no field collisions', () => {
    const t = tree();
    t.set('preset.yaml', MANIFEST.replace('structures:\n', 'structures:\n  annotations: { kind: annotations, field: reply, history: 2, formatPrompt: { tag: "Use {==x==}{>>y<<}." } }\n'));
    const { preset, diag } = build(t);
    expect(diag.errors).toEqual([]);
    expect(preset!.structures.annotations).toMatchObject({ kind: 'annotations', history: 2, formatPrompt: { tag: 'Use {==x==}{>>y<<}.', field: 'Use {==x==}{>>y<<}.' } });
    const bad = tree();
    bad.set('preset.yaml', MANIFEST.replace('structures:\n', 'structures:\n  annotations: { kind: annotations, history: -1 }\n'));
    expect(build(bad).diag.errors.map((e) => e.message).join('\n')).toMatch(/annotations take a number/);
    const obj = tree();
    obj.set('preset.yaml', MANIFEST.replace('structures:\n', 'structures:\n  annotations: { kind: annotations, history: { depth: 2 } }\n'));
    expect(build(obj).diag.errors.map((e) => e.message).join('\n')).toMatch(/annotations take a number/);
  });
});

describe('thought signatures', () => {
  const withSignatures = (yaml: string, min = '') => {
    const t = tree();
    t.set('preset.yaml', `${MANIFEST.replace('version: 1.0.0', `version: 1.0.0${min ? `\nminAdvancedPreset: ${min}` : ''}`)}${yaml}`);
    return build(t);
  };
  const turn = (sig: string) => `
syntheticTurns:
  - id: init
    user: Start
    tool: { name: start_workflow }
    thoughtSignature: ${sig}
    response: { single: Go, multi: Go }
`;

  it('compiles a plain signature and signatures by channel', () => {
    expect(withSignatures(turn('abc')).preset!.syntheticTurns[0]!.thoughtSignature).toBe('abc');
    const { preset, diag } = withSignatures(turn('{ vertex: v1, aistudio: a1 }'), '1.11.0');
    expect(diag.errors).toEqual([]);
    expect(preset!.syntheticTurns[0]!.thoughtSignature).toEqual({ vertex: 'v1', aistudio: 'a1' });
    expect(withSignatures(turn('{ openai: x }'), '1.11.0').diag.errors.map((e) => e.message).join('\n')).toMatch(/unknown thought signature channel `openai`/);
  });

  it('checks channels and the AP version they need', () => {
    const conf = (v: string) => `  - { id: g, name: G, diff: { connection: { sendThoughtSignature: ${v} } } }\n`;
    const withConf = (v: string, min = '') => {
      const t = tree();
      const manifest = MANIFEST.replace('version: 1.0.0', `version: 1.0.0${min ? `\nminAdvancedPreset: ${min}` : ''}`);
      t.set('preset.yaml', manifest.replace('configurations:\n', `configurations:\n${conf(v)}`));
      return build(t).diag;
    };
    expect(withConf('true').errors).toEqual([]);
    expect(withConf('aistudio', '1.11.0').errors).toEqual([]);
    expect(withConf('aistudio').warnings.map((w) => w.message).join('\n')).toMatch(/thought signature channels need Advanced Preset 1\.11\.0/);
    expect(withConf('openai', '1.11.0').errors.map((e) => e.message).join('\n')).toMatch(/unknown sendThoughtSignature `openai`/);
    expect(withSignatures(turn('{ vertex: v1 }')).diag.warnings.map((w) => w.message).join('\n')).toMatch(/thought signatures by channel need Advanced Preset 1\.11\.0/);
  });
});

describe('structure layout (I-134 – I-137)', () => {
  const STATUS = '  status: { kind: status, ui: { position: top }, order: { before: "@content" }, properties: { weather: Sky }, formatPrompt: { tag: "<status/>", field: "Fill `{{field}}`." } }\n';
  const layoutTree = (opts: { tools?: string; structures?: string; stages?: string; front?: string; min?: string; extra?: Record<string, string> } = {}) => {
    const t = tree(opts.extra);
    let m = MANIFEST.replace('structures:\n', `structures:\n${opts.structures ?? ''}`);
    m += `minAdvancedPreset: ${opts.min ?? '1.10.0'}\n${opts.tools ?? ''}`;
    t.set('preset.yaml', m);
    let wf = t.get('workflows/linear.md')!;
    if (opts.stages) wf = wf.replace(/stages:\n(  - .*\n)+/, `stages:\n${opts.stages}`);
    if (opts.front) wf = wf.replace('---\n<!--', `${opts.front}---\n<!--`);
    t.set('workflows/linear.md', wf);
    return build(t);
  };
  const msgs = (xs: { message: string }[]) => xs.map((x) => x.message).join('\n');

  it('compiles tools.orderPrefix and keeps {{field}} for the runtime', () => {
    const { preset, diag } = layoutTree({ tools: 'tools:\n  orderPrefix: true\n  turn: { field: "{{stage}}" }\n', structures: STATUS });
    expect(msgs(diag.errors)).toBe('');
    expect(msgs(diag.warnings)).not.toMatch(/sorts before/);
    const p = preset!;
    expect(p.tools.orderPrefix).toBe('{{n}}_');
    expect(p.tools.structurePrefix).toBe('');
    expect(p.structures.status).toMatchObject({ kind: 'status', field: 'status', order: { before: '@content' }, ui: { position: 'top' }, formatPrompt: { field: 'Fill `{{field}}`.' } });
    expect(p.structures.reply!.field).toBe('reply');
  });

  it('validates orderPrefix templates and ignores structurePrefix with a warning', () => {
    expect(msgs(layoutTree({ tools: 'tools:\n  orderPrefix: "step_"\n' }).diag.errors)).toMatch(/must contain `\{\{n\}\}`/);
    expect(msgs(layoutTree({ tools: 'tools:\n  orderPrefix: "{{n}}-"\n' }).diag.errors)).toMatch(/may only hold/);
    const r = layoutTree({ tools: 'tools:\n  orderPrefix: "s{{n}}_"\n  structurePrefix: z_\n  turn: { field: "{{stage}}" }\n' });
    expect(msgs(r.diag.warnings)).toMatch(/structurePrefix is ignored/);
    expect(r.preset!.tools.orderPrefix).toBe('s{{n}}_');
  });

  it('compiles stage order and workflow structures.order, checking references', () => {
    const ok = layoutTree({
      tools: 'tools:\n  orderPrefix: true\n',
      structures: STATUS,
      stages: '  - { id: plan, actor: narrator, kind: text, label: Plan, order: 10 }\n  - { id: final, actor: narrator, kind: content, label: Write, order: 20 }\n',
      front: 'structures:\n  order: { status: { after: plan }, reply: 15 }\n',
    });
    expect(msgs(ok.diag.errors)).toBe('');
    const wf = ok.preset!.workflows.find((w) => w.id === 'linear')!;
    expect(wf.stages.map((s) => s.order)).toEqual([10, 20]);
    expect(wf.structureOrder).toEqual({ status: { after: 'plan' }, reply: 15 });
    const bad = layoutTree({
      structures: STATUS,
      stages: '  - { id: plan, actor: narrator, kind: text, label: Plan, order: 200 }\n  - { id: final, actor: narrator, kind: content, label: Write }\n',
      front: 'structures:\n  order: { status: { after: nowhere }, reply: "sideways", ghost: 5 }\n',
    });
    const e = msgs(bad.diag.errors);
    expect(e).toMatch(/stage final: order 200 must be greater/);
    expect(e).toMatch(/unknown stage `nowhere`/);
    expect(e).toMatch(/order must be a number or/);
    expect(msgs(bad.diag.warnings)).toMatch(/structures.order: unknown structure `ghost`/);
  });

  it('allows a single status structure with ::last and its sub-fields', () => {
    const r = layoutTree({ tools: 'tools:\n  orderPrefix: true\n', structures: STATUS + '  status2: { kind: status, properties: { mood: x } }\n', extra: { 'modules/s.md': '---\nid: s\nregion: top\nstructures: [status]\n---\n{{ap::structure::status}} {{ap::structure::status::last}}\n' } });
    const e = msgs(r.diag.errors);
    expect(e).toMatch(/only one structure of kind status/);
    expect(e).toMatch(/status has no sub-field `mood`/);
    expect(e).not.toMatch(/::last/);
  });

  it('compiles custom structure components from inline text and ui/ files', () => {
    const r = layoutTree({
      structures: '  card: { kind: custom, ui: { position: bottom, order: 50, template: ./ui/card.ejs, style: "b { color: red }" } }\n  mod: { kind: custom, ui: { module: "export function mount() {}" } }\n',
      extra: { 'ui/card.ejs': '<b><%= value %></b>\n' },
    });
    expect(msgs(r.diag.errors)).toBe('');
    expect(r.preset!.structures.card!.ui).toEqual({ position: 'bottom', order: 50, template: '<b><%= value %></b>\n', style: 'b { color: red }' });
    expect(r.preset!.structures.mod!.ui!.module).toMatch(/mount/);
    const bad = layoutTree({ structures: '  card: { kind: custom, ui: { position: left, template: ./ui/missing.ejs, module: ./other.js } }\n  options: { kind: options, ui: { template: x } }\n' });
    const e = msgs(bad.diag.errors);
    expect(e).toMatch(/ui.position must be top \| bottom/);
    expect(e).toMatch(/file `ui\/missing.ejs` not found/);
    expect(e).toMatch(/component files live under ui\//);
    expect(e).toMatch(/only custom structures bring their own component/);
    const broken = layoutTree({ structures: '  card: { kind: custom, ui: { template: "<% if (x) { %>" } }\n  mod: { kind: custom, ui: { module: "function mount() {}" } }\n' });
    expect(msgs(broken.diag.errors)).toMatch(/structure card: ui.template:/);
    expect(msgs(broken.diag.warnings)).toMatch(/structure mod: ui.module exports nothing/);
  });

  it('warns when layout features need a newer Advanced Preset', () => {
    const r = layoutTree({ min: '1.9.0', tools: 'tools:\n  orderPrefix: true\n', structures: STATUS });
    expect(msgs(r.diag.warnings)).toMatch(/tools.orderPrefix, structure order, status structures, structure ui need Advanced Preset 1.10.0/);
  });

  it('checks the alphabetical order of explicitly placed legacy structures', () => {
    const r = layoutTree({ structures: STATUS, tools: 'tools:\n  turn: { field: "{{stage}}" }\n  structurePrefix: ""\n', stages: '  - { id: a_plan, actor: narrator, kind: text, label: Plan }\n  - { id: b_final, actor: narrator, kind: content, label: Write }\n' });
    expect(msgs(r.diag.warnings)).toMatch(/structure field `status` sorts after stage field `b_final`/);
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

describe('locales', () => {
  it('translates the preset name and description', () => {
    const { preset, diag } = build(tree({ 'preset.yaml': MANIFEST, 'locales/zh-cn.yaml': 'name: 测试预设\ndescription: 一段描述\n', 'locales/ja.yaml': 'name: [x]\n' }));
    expect(diag.errors).toEqual([]);
    expect(preset!.locales['zh-cn']).toMatchObject({ name: '测试预设', description: '一段描述' });
    const warns = diag.warnings.map((w) => w.message).join('\n');
    expect(warns).toMatch(/name must be a string/);
    expect(warns).not.toMatch(/description must be a string/);
  });
});

describe('insertion points & user modules', () => {
  const POINTS = `
insertionPoints:
  - { id: intro-end, label: After intro, region: top, order: 1000 }
  - { id: guide, label: Guidelines, description: Inside the block., region: guide, order: 5 }
migrations:
  - { from: "<1.0.0", rename: { insertionPoints: { old: intro-end, older: gone }, modules: { s: style-a } } }
`;

  it('compiles points and checks migration targets', () => {
    const { preset, diag } = build(tree({ 'preset.yaml': MANIFEST + POINTS, 'locales/zh-cn.yaml': 'insertionPoints: { guide: { label: 指南 }, nope: { label: x } }\n' }));
    expect(diag.errors).toEqual([]);
    expect(preset!.insertionPoints).toEqual([
      { id: 'intro-end', label: 'After intro', region: 'top', order: 1000 },
      { id: 'guide', label: 'Guidelines', description: 'Inside the block.', region: 'guide', order: 5 },
    ]);
    const warns = diag.warnings.map((w) => w.message).join('\n');
    expect(warns).toMatch(/`older` is renamed to `gone`/);
    expect(warns).not.toMatch(/`old` is renamed/);
    expect(warns).toMatch(/insertionPoints\.nope does not exist/);

    const bad = build(tree({ 'preset.yaml': `${MANIFEST}insertionPoints:\n  - { id: a, region: settings }\n  - { id: a, region: top }\n  - { id: B, region: top }\n  - { id: c, region: nowhere }\n` }));
    const msgs = bad.diag.errors.map((e) => e.message).join('\n');
    expect(msgs).toMatch(/region `settings` is native/);
    expect(msgs).toMatch(/duplicate insertion point `a`/);
    expect(msgs).toMatch(/kebab-case/);
    expect(msgs).toMatch(/unknown region `nowhere`/);
  });

  it('assembles user modules at their points', () => {
    const p = build(tree({ 'preset.yaml': MANIFEST + POINTS })).preset!;
    const config = resolveConfiguration(p, 'fast', undefined);
    const modules: UserModule[] = [
      { id: 'u1', name: 'Mine', enabled: true, vars: [], trigger: { match: 'all', rules: [] }, entries: [
        { id: 'a', point: 'intro-end', text: 'Also {{ap::name::narrator}}.' },
        { id: 'b', point: 'guide', text: 'Mine first.' },
        { id: 'c', point: 'intro-end', role: 'user', text: 'As user.' },
      ] },
      { id: 'u2', name: 'Off', enabled: true, vars: [], trigger: { match: 'all', rules: [{ kind: 'var', path: 'transport', op: '==', value: 'structured' }] }, entries: [{ id: 'a', point: 'intro-end', text: 'never' }] },
    ];
    const { preset } = withUserModules(p, modules);
    const a = assemble({ preset, config, vars: defaultVars(preset, config) });
    expect(a.regions.top!.map((m) => [m.role, m.content])).toEqual([
      ['system', 'You are Nia.\nSpeak with prefixes.\nWrite in the story language.'],
      ['system', 'Also Nia.'],
      ['user', 'As user.'],
    ]);
    expect(a.regions.guide).toEqual([{ role: 'system', content: '<guidelines>\nMine first.\n\nStyle A.\n</guidelines>' }]);
  });
});

describe('user module sources', () => {
  const EXTRA = `
insertionPoints:
  - { id: intro-end, label: After intro, region: top, order: 1000 }
  - { id: guide, label: Guidelines, region: guide, order: 5 }
vars:
  questions: { type: dict, label: Questions }
`;
  const STYLE = `---
name: Custom style
description: Start your own style.
point: guide
when: '!meta.pure'
vars:
  questions:
    my-style: How does {{ap::name::narrator}} keep the style?
---
<!--# Replace the text below.
<!-- @entry point=intro-end --> is text inside this comment
-->
## My style

Short sentences.

\`\`\`
<!-- @entry point=nowhere -->
\`\`\`

<!-- @entry point=intro-end role=user -->

Remember the style.
`;
  const ZH = `---
name: 自定义文风
point: guide
---
<!--# 在下面写文风 -->
## 我的文风
`;

  it('keeps the raw text, splits entries and compiles translations', () => {
    const { preset, diag } = build(tree({
      'preset.yaml': MANIFEST + EXTRA,
      'user-module-templates/style.md': STYLE,
      'user-module-templates/style.zh-CN.md': ZH,
      'locales/zh-cn.yaml': 'userModuleTemplates: { style: { name: 文风 }, nope: { name: x } }\nuserModules: { gone: { name: x } }\n',
    }));
    expect(diag.errors).toEqual([]);
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/userModuleTemplates\.nope does not exist/);
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/userModules\.gone does not exist/);
    expect(preset!.userModules).toEqual([]);
    const [tpl] = preset!.userModuleTemplates;
    expect(tpl).toMatchObject({
      id: 'style',
      name: 'Custom style',
      description: 'Start your own style.',
      vars: [{ var: 'questions', type: 'dict', items: [{ key: 'my-style', value: 'How does {{ap::name::narrator}} keep the style?' }] }],
      trigger: { match: 'all', rules: [{ kind: 'expr', source: '!meta.pure' }] },
    });
    expect(tpl!.entries).toEqual([
      { point: 'guide', text: '<!--# Replace the text below.\n<!-- @entry point=intro-end --> is text inside this comment\n-->\n## My style\n\nShort sentences.\n\n```\n<!-- @entry point=nowhere -->\n```' },
      { point: 'intro-end', role: 'user', text: 'Remember the style.' },
    ]);
    expect(tpl!.locales).toEqual({ 'zh-cn': { name: '自定义文风', entries: [{ point: 'guide', text: '<!--# 在下面写文风 -->\n## 我的文风' }], vars: [], trigger: { match: 'all', rules: [] } } });
  });

  it('reports bad points, roles, triggers, variables and directives', () => {
    const { diag } = build(tree({
      'preset.yaml': MANIFEST + EXTRA,
      'user-module-templates/bad.md': `---
trigger: { match: any, rules: [{ kind: var, path: params.nope, op: on }, { kind: wat }] }
vars: { nope: x }
color: red
---
<!-- @entry point=gone -->
x
<!-- @entry point=guide role=robot -->
<!-- @if -->
`,
      'user-module-templates/loose.md': 'Text without a point.\n',
      'user-module-templates/Bad_Name.md': '',
      'user-module-templates/orphan.zh-cn.md': '',
      'user-module-templates/both.md': '---\npoint: guide\nwhen: x\ntrigger: { rules: [] }\n---\nx\n',
      'user-module-templates/on.md': '---\npoint: guide\nenabled: false\n---\nx\n',
      'user-modules/Bad_Name.md': '',
      'user-modules/flag.md': '---\npoint: guide\nenabled: maybe\ndescription: x\n---\nx\n',
      'user-modules/orphan.zh-cn.md': '',
    }));
    const errors = diag.errors.map((e) => `${e.file}: ${e.message}`).join('\n');
    expect(errors).toMatch(/bad\.md: unknown insertion point `gone`/);
    expect(errors).toMatch(/bad\.md: role must be/);
    expect(errors).toMatch(/bad\.md: trigger has 1 invalid rule/);
    expect(errors).toMatch(/bad\.md: unknown variable `nope`/);
    expect(errors).toMatch(/bad\.md: unknown param `nope` in condition/);
    expect(errors).toMatch(/bad\.md: .*@if/);
    expect(errors).toMatch(/loose\.md: text before the first `@entry` needs `point`/);
    expect(errors).toMatch(/user-module-templates\/Bad_Name\.md: user module template files are/);
    expect(errors).toMatch(/user-module-templates\/orphan\.zh-cn\.md: translation of unknown user module template `orphan`/);
    expect(errors).toMatch(/both\.md: use either `when` or `trigger`/);
    expect(errors).toMatch(/user-modules\/Bad_Name\.md: user module files are `user-modules\/<id>\.md`/);
    expect(errors).toMatch(/user-modules\/orphan\.zh-cn\.md: translation of unknown user module `orphan`/);
    expect(errors).toMatch(/flag\.md: `enabled` must be true or false/);
    const warnings = diag.warnings.map((w) => `${w.file}: ${w.message}`).join('\n');
    expect(warnings).toMatch(/unknown frontmatter key `color` in a user module template/);
    expect(warnings).toMatch(/on\.md: `enabled` only applies to bundled user modules/);
    expect(warnings).toMatch(/flag\.md: `description` is only shown for user module templates/);
  });

  it('previews templates as user modules', async () => {
    const { templateModules, preview } = await import('../src/preview');
    const { preset } = build(tree({ 'preset.yaml': MANIFEST + EXTRA, 'user-module-templates/style.md': STYLE, 'user-module-templates/style.zh-cn.md': ZH }));
    expect(templateModules(preset!, ['nope'])).toMatch(/unknown user module template nope \(have: style\)/);
    const [en] = templateModules(preset!, ['all']) as UserModule[];
    expect(en).toMatchObject({ id: 'tpl-style', name: 'Custom style', enabled: true });
    expect(en!.entries.map((e) => e.id)).toEqual(['e1', 'e2']);
    const [zh] = templateModules(preset!, ['style'], 'zh-cn') as UserModule[];
    expect(zh!.name).toBe('自定义文风');
    const out = preview(preset!, { config: 'fast', userModules: [en!] });
    expect(out).toContain('## My style\n\nShort sentences.');
    expect(out).not.toContain('Replace the text below');
    expect(out).toContain('Remember the style.');
  });

  it('compiles bundled user modules in the same format', () => {
    const { preset, diag } = build(tree({
      'preset.yaml': MANIFEST + EXTRA,
      'user-modules/style.md': STYLE.replace('description: Start your own style.\n', ''),
      'user-modules/style.zh-cn.md': ZH,
      'user-modules/quiet.md': '---\nname: Quiet\nenabled: false\npoint: guide\ntrigger: { match: any, rules: [{ kind: keyword, target: recent, depth: 2, words: [hush], op: any }] }\n---\nBe quiet.\n',
    }));
    expect(diag.errors).toEqual([]);
    expect(diag.warnings.filter((w) => w.file?.startsWith('user-modules/'))).toEqual([]);
    const [quiet, style] = preset!.userModules;
    expect(quiet).toEqual({
      id: 'quiet', name: 'Quiet', enabled: false, entries: [{ point: 'guide', text: 'Be quiet.' }], vars: [],
      trigger: { match: 'any', rules: [{ kind: 'keyword', target: 'recent', depth: 2, words: ['hush'], op: 'any' }] },
    });
    expect(style).not.toHaveProperty('enabled');
    expect(style!.entries).toHaveLength(2);
    expect(style!.locales?.['zh-cn']?.name).toBe('自定义文风');
    expect(preset!.userModuleTemplates).toEqual([]);
  });

  it('carries switched-off entries, variable updates, keys and items', () => {
    const { preset, diag } = build(tree({
      'preset.yaml': MANIFEST + EXTRA + '  tags: list\n  note: string\n',
      'user-modules/parts.md': `---
vars:
  questions:
    a: Kept?
    b: !off Dropped?
  tags: [one, !off two]
  note: !off Quiet note.
---
<!-- @entry point=guide enabled=false -->
Off.
<!-- @entry point=intro-end -->
On.
`,
      'user-modules/bad.md': '---\nname: !off x\npoint: guide\n---\nx\n<!-- @entry point=guide enabled=maybe -->\ny\n',
    }));
    const errors = diag.errors.map((e) => `${e.file}: ${e.message}`);
    expect(errors.filter((e) => e.startsWith('user-modules/parts.md'))).toEqual([]);
    expect(errors.join('\n')).toMatch(/bad\.md: `!off` switches off a variable update/);
    expect(errors.join('\n')).toMatch(/bad\.md: @entry `enabled` must be true or false/);
    const parts = preset!.userModules.find((m) => m.id === 'parts')!;
    expect(parts.entries).toEqual([{ point: 'guide', text: 'Off.', enabled: false }, { point: 'intro-end', text: 'On.' }]);
    expect(parts.vars).toEqual([
      { var: 'questions', type: 'dict', items: [{ key: 'a', value: 'Kept?' }, { key: 'b', value: 'Dropped?', enabled: false }] },
      { var: 'tags', type: 'list', items: ['one', { text: 'two', enabled: false }] },
      { var: 'note', type: 'string', text: 'Quiet note.', enabled: false },
    ]);
  });

  it('previews bundled modules as a fresh install gets them', async () => {
    const { bundledModules, preview } = await import('../src/preview');
    const { preset } = build(tree({
      'preset.yaml': MANIFEST + EXTRA,
      'user-modules/style.md': STYLE.replace('description: Start your own style.\n', ''),
      'user-modules/style.zh-cn.md': ZH,
      'user-modules/quiet.md': '---\nname: Quiet\nenabled: false\npoint: guide\n---\nBe quiet.\n',
    }));
    expect((bundledModules(preset!) as UserModule[]).map((m) => m.id)).toEqual(['style']);
    expect((bundledModules(preset!, ['all']) as UserModule[]).map((m) => m.id)).toEqual(['quiet', 'style']);
    expect(bundledModules(preset!, ['none'])).toEqual([]);
    expect(bundledModules(preset!, ['nope'])).toMatch(/unknown bundled user module nope \(have: quiet, style\)/);
    expect((bundledModules(preset!, undefined, 'zh-cn') as UserModule[])[0]!.name).toBe('自定义文风');
    const out = preview(preset!, { config: 'fast', userModules: bundledModules(preset!) as UserModule[] });
    expect(out).toContain('## My style');
    expect(out).not.toContain('Be quiet.');
  });
});

describe('build variables', () => {
  const VARS = `
vars:
  questions: { type: dict, label: Questions }
  notes: { type: string, separator: "\\n" }
  tags: list
`;
  const mods = {
    'modules/q.md': `---
id: q
toggle: always
region: task
when: stages.plan
vars:
  questions: { outline: "Outline for {{ap::name::narrator}}?", tone: Tone? }
  notes: First.
  tags: one
---
{{ap::var::questions::values}}
{{ap::var::questions::outline}} {{ap::var::tags::0}}
{{ap::var::notes}} {{ap::var::tags}}
`,
    'modules/style/a.md': `---
id: style-a
group: style
exclusive: style
default: true
region: guide
vars:
  questions: { style: A? }
  tags: [a1, a2]
---
Style A.
`,
    'modules/style/b.md': `---
id: style-b
group: style
exclusive: style
region: guide
vars:
  questions: { style: B?, tone: null }
---
Style B.
`,
  };

  it('compiles declarations and updates and assembles them', () => {
    const { preset, diag } = build(tree({ 'preset.yaml': MANIFEST + VARS, ...mods }));
    expect(diag.errors).toEqual([]);
    expect(preset!.vars).toEqual([
      { id: 'questions', type: 'dict', label: 'Questions' },
      { id: 'notes', type: 'string', separator: '\n' },
      { id: 'tags', type: 'list' },
    ]);
    expect(preset!.modules.find((m) => m.id === 'style-b')!.vars).toEqual([{ var: 'questions', type: 'dict', items: [{ key: 'style', value: 'B?' }, { key: 'tone', value: null }] }]);
    // Exclusive members setting the same key never clash.
    expect(diag.warnings.map((w) => w.message).join('\n')).not.toMatch(/key `style`/);
    const config = resolveConfiguration(preset!, 'default', undefined);
    const a = assemble({ preset: preset!, config, vars: defaultVars(preset!, config) });
    expect(a.regions.task![0]!.content).toBe('- Outline for Nia?\n- Tone?\n- A?\nOutline for Nia? one\nFirst. - one\n- a1\n- a2');
  });

  it('flags bad declarations, updates and reads', () => {
    const { diag } = build(tree({
      'preset.yaml': `${MANIFEST + VARS}  bad: { type: tree }
  unread: list
`,
      ...mods,
      'modules/x.md': `---
id: x
toggle: always
region: top
when: stages.nope
questions: { mandatory: [a] }
vars:
  questions: { outline: Mine?, deep: { a: 1 } }
  notes: [a]
  tags: [[nested]]
  ghost: 1
---
{{ap::var::ghost}} {{ap::var::notes::0}} {{ap::var::tags::first}} {{ap::var::questions::nokey}}
`,
    }));
    const errs = diag.errors.map((e) => e.message).join('\n');
    expect(errs).toMatch(/variable type must be/);
    expect(errs).toMatch(/replaced by build variables/);
    expect(errs).toMatch(/values must be plain \(deep\)/);
    expect(errs).toMatch(/`notes` is a string variable/);
    expect(errs).toMatch(/`tags` is a list variable/);
    expect(errs).toMatch(/unknown variable `ghost` \(declare/);
    expect(errs).toMatch(/unknown stage `nope`/);
    expect(errs).toMatch(/var::ghost\}\}: unknown variable/);
    expect(errs).toMatch(/string variables take no selector/);
    expect(errs).toMatch(/list variables take an index/);
    const warns = diag.warnings.map((w) => w.message).join('\n');
    expect(warns).toMatch(/no module sets key `nokey`/);
    expect(warns).toMatch(/variable unread is never read/);
  });

  it('warns on dict keys set by modules active together', () => {
    const { diag } = build(tree({
      'preset.yaml': MANIFEST + VARS,
      ...mods,
      'modules/y.md': '---\nid: y\ntoggle: always\nregion: top\nvars:\n  questions: { outline: Again? }\n---\nY\n',
    }));
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/key `outline` is set by q, y \(the later module wins\)/);
  });
});

describe('synopsis history & token saving', () => {
  const withManifest = (structures: string, rest = '') =>
    tree({ 'preset.yaml': MANIFEST.replace('structures:\n', `structures:\n${structures}`) + rest });

  it('compiles synopsis history and the user input mode', () => {
    const r = build(withManifest(`  synopsis:
    kind: synopsis
    history: 3
    historyTemplate: "{{content}}\\n<synopsis>{{time}}</synopsis>"
`, `tokenSaving:
  userInput: remove
configurationDefaults:
  tokenSaving: { keepFullTurns: 4 }
`));
    expect(r.diag.errors).toEqual([]);
    const s = r.preset!.structures.synopsis!;
    expect(s.history).toBe(3);
    expect(s.historyTemplate).toBe('{{content}}\n<synopsis>{{time}}</synopsis>');
    expect(r.preset!.tokenSaving.userInput).toBe('remove');
    expect(r.preset!.configurationDefaults.tokenSaving).toMatchObject({ enabled: false, keepFullTurns: 4, userInput: 'remove' });
  });

  it('defaults to truncate and the default history template', () => {
    const r = build(withManifest('  synopsis: { kind: synopsis, history: 2 }\n'));
    expect(r.preset!.tokenSaving.userInput).toBe('truncate');
    expect(r.preset!.structures.synopsis!.historyTemplate).toMatch(/^\{\{content\}\}/);
    expect(r.preset!.structures.reply!.history).toBeUndefined();
  });

  it('flags bad values', () => {
    const r = build(tree({ 'preset.yaml': MANIFEST
      .replace('structures:\n', 'structures:\n  synopsis: { kind: synopsis, history: -1, historyTemplate: "{{time}}" }\n  options: { kind: options, historyTemplate: "x" }\n')
      .replace('diff: { connection: { transport: prefill } }', 'diff: { tokenSaving: { userInput: nope } }') + 'tokenSaving:\n  userInput: drop\n' }));
    const msgs = [...r.diag.errors, ...r.diag.warnings].map((d) => d.message).join('\n');
    expect(msgs).toMatch(/history` must be a non-negative integer/);
    expect(msgs).toMatch(/no `\{\{content\}\}`/);
    expect(msgs).toMatch(/`historyTemplate` only applies to synopsis structures/);
    expect(r.diag.errors.filter((d) => /userInput/.test(d.message))).toHaveLength(2);
  });
});

describe('structure history (I-139)', () => {
  const withManifest = (structures: string, rest = '') =>
    tree({ 'preset.yaml': MANIFEST.replace('version: 1.0.0', 'version: 1.0.0\nminAdvancedPreset: 1.10.0').replace('structures:\n', `structures:\n${structures}`) + rest });

  it('compiles history objects on any kind, and a number as shorthand', () => {
    const r = build(withManifest(`  status:
    kind: status
    history:
      depth: 1
      template: "<status>{{date}} {{time}}</status>"
      position: before
      when: 'transport in ["plaintext", "prefill"]'
  synopsis:
    kind: synopsis
    history: { depth: 3, template: "<synopsis>{{event}}</synopsis>", position: 450 }
  options: { kind: options, history: 2 }
  notes: { kind: custom, shape: kv, history: { template: "{{mood}}" } }
`));
    expect(r.diag.errors).toEqual([]);
    expect(r.diag.warnings.map((w) => w.message).join('\n')).not.toMatch(/history (key|placeholder)|is not a|minAdvancedPreset/);
    const s = r.preset!.structures;
    expect(s.status!.history).toEqual({ depth: 1, template: '<status>{{date}} {{time}}</status>', position: 'before', when: expect.objectContaining({ t: 'bin', op: 'in' }) });
    expect(s.synopsis!.history).toEqual({ depth: 3, template: '<synopsis>{{event}}</synopsis>', position: 450 });
    expect(s.synopsis!.historyTemplate).toBeUndefined();
    expect(s.options!.history).toEqual({ depth: 2, template: '{{value}}' });
    expect(s.notes!.history).toEqual({ depth: 1, template: '{{mood}}' });
  });

  it('flags bad values, stray placeholders and old version requirements', () => {
    const r = build(tree({ 'preset.yaml': MANIFEST.replace('structures:\n', `structures:
  status: { kind: status, history: { depth: -1, template: "{{content}} {{nope}}", position: middle, when: "unknown.x", extra: 1 } }
  synopsis: { kind: synopsis, history: { depth: 1 }, historyTemplate: "{{content}}" }
`) }));
    const errors = r.diag.errors.map((d) => d.message).join('\n');
    const warnings = r.diag.warnings.map((d) => d.message).join('\n');
    expect(errors).toMatch(/history.depth` must be a non-negative integer/);
    expect(errors).toMatch(/history.position` must be before \| after \| a number/);
    expect(errors).toMatch(/unknown variable `unknown.x`/);
    expect(warnings).toMatch(/unknown history key `extra`/);
    expect(warnings).toMatch(/`\{\{content\}\}` is not a history placeholder/);
    expect(warnings).toMatch(/`\{\{nope\}\}` is not a status field/);
    expect(warnings).toMatch(/`historyTemplate` is ignored with a `history` object/);
    expect(warnings).toMatch(/structure history need Advanced Preset 1.10.0/);
  });

  it('checks `last.<id>` conditions', () => {
    const r = build(withManifest('  status: { kind: status }\n  synopsis: { kind: synopsis, history: { when: "last.status && last.synopsis && last.nope" } }\n'));
    const errors = r.diag.errors.map((d) => d.message).join('\n');
    expect(errors).toMatch(/`last.synopsis`: only custom and status structures keep a last value/);
    expect(errors).toMatch(/unknown structure `nope` in condition/);
    expect(errors).not.toMatch(/last.status/);
  });
});

describe('cache optimization defaults', () => {
  it('fills the built-in defaults and accepts overrides', () => {
    const plain = build(tree({ 'preset.yaml': MANIFEST }));
    expect(plain.preset!.configurationDefaults.cache).toEqual({ enabled: false, ttlMinutes: 5, maxDeferredTurns: 6 });
    const r = build(tree({ 'preset.yaml': MANIFEST + 'configurationDefaults:\n  cache: { maxDeferredTurns: 8 }\n' }));
    expect(r.diag.errors).toEqual([]);
    expect(r.preset!.configurationDefaults.cache).toEqual({ enabled: false, ttlMinutes: 5, maxDeferredTurns: 8 });
  });

  it('flags bad values', () => {
    const r = build(tree({ 'preset.yaml': MANIFEST.replace('diff: { connection: { transport: prefill } }', 'diff: { cache: { ttlMinutes: -1 } }')
      + 'configurationDefaults:\n  cache: { enabled: yes please, maxDeferredTurns: many, ttl: 5 }\n' }));
    const errors = r.diag.errors.map((d) => d.message).join('\n');
    expect(errors).toMatch(/`enabled` must be a boolean/);
    expect(errors).toMatch(/`maxDeferredTurns` must be a number/);
    expect(errors).toMatch(/`ttlMinutes` must be a number/);
    expect(r.diag.warnings.map((d) => d.message).join('\n')).toMatch(/unknown cache option `ttl`/);
  });
});

describe('templates (I-109)', () => {
  const TPL = `---
id: tpl
toggle: always
region: top
---
Before {{ap::name::narrator}}.
<!-- @template -->
<% if (params.language) { -%>
Lang: <%- params.language %> / <%- macro('name', 'narrator') %> {{ap::param::language}}
<% } -%>
<%- vars.notes %> <%- '{{ap::' + 'frob}}' %>
<!-- @end -->
`;

  it('compiles templates with their file and line and renders them', () => {
    const manifest = MANIFEST.replace('version: 1.0.0', 'version: 1.0.0\nminAdvancedPreset: 1.9.0') + 'vars:\n  notes: string\n';
    const { preset, diag } = build(tree({ 'preset.yaml': manifest, 'modules/tpl.md': TPL }));
    expect(diag.errors).toEqual([]);
    const warns = diag.warnings.map((w) => w.message).join('\n');
    // Macros are checked in the literal text only; template reads count as reads.
    expect(warns).not.toMatch(/frob|never read|minAdvancedPreset/);
    const piece = preset!.entries.find((e) => e.id === 'tpl/main')!.content[0]!.pieces[1]!;
    expect(piece.template).toEqual({ file: 'modules/tpl.md', line: 8 });
    const config = resolveConfiguration(preset!, 'default', { params: { language: 'French' } });
    const a = assemble({ preset: preset!, config, vars: defaultVars(preset!, config) });
    expect(a.warnings).toEqual([]);
    expect(a.regions.top!.map((m) => m.content).join('\n')).toContain('Before Nia.\nLang: French / Nia French');
  });

  it('reports template errors at their source line and checks references', () => {
    const bad = `---
id: bad
toggle: always
region: top
---
text
<!-- @template -->
ok
<%= params.language
<!-- @end -->
<!-- @template --><%- vars.ghost %> <%- params['nope'] %> <%- modules.core %> <%- stages.x %> <%- {{ap::nope}} %><!-- @end -->
`;
    const { diag } = build(tree({ 'modules/bad.md': bad }));
    expect(diag.errors).toContainEqual(expect.objectContaining({ message: 'template: Could not find matching close tag for "<%=".', file: 'modules/bad.md', line: 9 }));
    const warns = diag.warnings.map((w) => w.message);
    expect(warns).toContain('template reads unknown variable `ghost`');
    expect(warns).toContain('template reads unknown param `nope`');
    expect(warns).toContain('template reads unknown stage `x`');
    expect(warns).not.toContain('template reads unknown module `core`');
    expect(warns.join('\n')).toMatch(/templates need Advanced Preset 1\.9\.0/);
    // Code is not scanned for macros.
    expect(diag.errors.map((e) => e.message).join('\n')).not.toMatch(/ap::nope/);
  });

  it('treats dynamic use of vars as reading every variable', () => {
    const manifest = MANIFEST + 'vars:\n  notes: string\n  tags: list\n';
    const t = tree({ 'preset.yaml': manifest, 'modules/tpl.md': '---\nid: tpl\ntoggle: always\nregion: top\n---\n<!-- @template --><%- Object.keys(vars).join() %><!-- @end -->\n' });
    expect(build(t).diag.warnings.map((w) => w.message).join('\n')).not.toMatch(/never read/);
  });
});

describe('list params', () => {
  const withParams = (params: string, extra = '') => tree({
    'preset.yaml': MANIFEST.replace('params:\n  - { id: language, type: text, label: Language, unset: the story language }', `params:\n  - { id: language, type: text, label: Language, unset: the story language }\n${params}`) + extra,
  });
  const LIST = '  - { id: banned, type: list, label: Banned, default: [" a ", a, b], separator: " / " }';

  it('compiles list params, normalizes defaults and checks the AP version', () => {
    const { preset, diag } = build(withParams(LIST, 'configurationDefaults:\n  params: { banned: [x, y, x] }\n'));
    expect(diag.errors).toEqual([]);
    expect(preset!.params.find((p) => p.id === 'banned')).toEqual({ id: 'banned', type: 'list', label: 'Banned', default: ['a', 'b'], separator: ' / ' });
    expect(preset!.configurationDefaults.params.banned).toEqual(['x', 'y']);
    expect(diag.warnings.map((w) => w.message).join('\n')).toMatch(/list params need Advanced Preset 1\.9\.0/);
    const ok = build(withParams(LIST, 'minAdvancedPreset: 1.9.0\n'));
    expect(ok.diag.warnings.map((w) => w.message).join('\n')).not.toMatch(/list params need/);
  });

  it('reports values of the wrong shape and options that do not apply', () => {
    const patch = (t: SourceTree, from: string, to: string) => t.set('preset.yaml', t.get('preset.yaml')!.replace(from, to));
    const { diag } = build(patch(withParams(
      '  - { id: banned, type: list, label: Banned, default: a, options: [x] }\n  - { id: n, type: number, label: N, default: "3", separator: "," }',
      'configurationDefaults:\n  params: { language: [x] }\n',
    ), 'diff: { connection: { transport: prefill } }', 'diff: { params: { banned: [1] } }'));
    const errors = diag.errors.map((e) => e.message).join('\n');
    expect(errors).toMatch(/default of a list param must be a list of strings/);
    expect(errors).toMatch(/default of a number param must be a number/);
    expect(errors).toMatch(/configurationDefaults\.params\.language: a text param needs a string or number/);
    expect(errors).toMatch(/configurations\[0\]\.diff\.params\.banned: a list param needs a list of strings/);
    const warnings = diag.warnings.map((w) => w.message).join('\n');
    expect(warnings).toMatch(/`options` does not apply to list params/);
    expect(warnings).toMatch(/`separator` only applies to list params/);
  });

  it('sets params in previews with --param', async () => {
    const { parseParamArg } = await import('../src/preview');
    const { preset } = build(withParams(LIST + '\n  - { id: n, type: number, label: N }'));
    expect(parseParamArg(preset!, 'banned=x, y ,x')).toEqual({ id: 'banned', value: ['x', 'y'] });
    expect(parseParamArg(preset!, 'banned=["a, b","c"]')).toEqual({ id: 'banned', value: ['a, b', 'c'] });
    expect(parseParamArg(preset!, 'banned=')).toEqual({ id: 'banned', value: [] });
    expect(parseParamArg(preset!, 'n=12')).toEqual({ id: 'n', value: 12 });
    expect(parseParamArg(preset!, 'language=English')).toEqual({ id: 'language', value: 'English' });
    expect(parseParamArg(preset!, 'n=x')).toMatch(/expected a number/);
    expect(parseParamArg(preset!, 'banned=[1]')).toMatch(/JSON array of strings/);
    expect(parseParamArg(preset!, 'nope=1')).toMatch(/unknown param `nope`/);
    expect(parseParamArg(preset!, 'banned')).toMatch(/expects id=value/);
  });
});

describe('input shaping (I-128)', () => {
  const withShaping = (shaping: string, extraModule = '') => {
    const t = tree({ 'preset.yaml': MANIFEST.replace('version: 1.0.0', 'version: 1.0.0\nminAdvancedPreset: 1.9.0')
      .replace('  - { id: task, anchor: historyEnd }', '  - { id: task, anchor: historyEnd }\n  - { id: input, merge: { wrap: input } }')
      .replace('chatHistory, task, tail]', 'chatHistory, task, input, tail]') + shaping });
    t.set('modules/input.md', `---
id: input
toggle: always
region: input
when: input.shaped
---
${extraModule || '{{ap::input::text}}'}
`);
    return t;
  };
  const messages = (r: ReturnType<typeof build>) => [...r.diag.errors, ...r.diag.warnings].map((d) => d.message).join('\n');

  it('is absent unless declared (hash unchanged)', () => {
    const plain = build(tree());
    expect(plain.preset!.inputShaping).toBeUndefined();
    expect('inputShaping' in plain.preset!).toBe(false);
    expect(build(tree()).preset!.hash).toBe(plain.preset!.hash);
  });

  it('compiles extract and wrap with the default template', () => {
    const ex = build(withShaping('inputShaping:\n  mode: extract\n'));
    expect(ex.diag.errors).toEqual([]);
    expect(messages(ex)).not.toMatch(/input/i);
    expect(ex.preset!.inputShaping).toEqual({ mode: 'extract', template: '<input>\n{{content}}\n</input>' });
    const wrap = build(withShaping('inputShaping: { mode: wrap, template: "<{{ap::name::user}}>{{content}}</{{ap::name::user}}>" }\n', 'Answer the input.'));
    expect(wrap.diag.errors).toEqual([]);
    expect(wrap.preset!.inputShaping).toEqual({ mode: 'wrap', template: '<{{ap::name::user}}>{{content}}</{{ap::name::user}}>' });
  });

  it('flags bad declarations, lost input and old AP versions', () => {
    expect(build(withShaping('inputShaping: { mode: move }\n')).diag.errors.map((e) => e.message).join('\n')).toMatch(/inputShaping\.mode must be one of wrap, extract/);
    expect(build(withShaping('inputShaping: wrap\n')).diag.errors.map((e) => e.message).join('\n')).toMatch(/must be a mapping/);
    const w = messages(build(withShaping('inputShaping: { mode: wrap, template: "<input/>", tag: x }\n', 'Hi.')));
    expect(w).toMatch(/no \{\{content\}\}/);
    expect(w).toMatch(/unknown key `tag`/);
    expect(messages(build(withShaping('inputShaping: { mode: extract, template: "x{{content}}" }\n')))).toMatch(/only used by `wrap`/);
    expect(messages(build(withShaping('inputShaping: { mode: extract }\n', 'Nothing here.')))).toMatch(/no prompt uses \{\{ap::input::text\}\}/);
    expect(messages(build(withShaping('')))).toMatch(/always empty: the preset declares no inputShaping/);
    expect(messages(build(withShaping('', '{{ap::input::nope}}')))).toMatch(/expected meta \| text/);
    const old = withShaping('inputShaping: { mode: extract }\n');
    old.set('preset.yaml', old.get('preset.yaml')!.replace('minAdvancedPreset: 1.9.0\n', ''));
    expect(messages(build(old))).toMatch(/input shaping needs Advanced Preset 1\.9\.0/);
  });

  it('previews a shaped turn with --input', async () => {
    const { preview } = await import('../src/preview');
    const ex = build(withShaping('inputShaping: { mode: extract }\n')).preset!;
    const out = preview(ex, { input: 'Open the door.' });
    expect(out).toMatch(/input shaping: extract\n/);
    expect(out).toMatch(/━━ input [^\n]*\n\[system\]\n<input>\nOpen the door\.\n<\/input>/);
    expect(out).toMatch(/last user message[^\n]*\n\(extracted/);
    expect(preview(ex, {})).toMatch(/input shaping: extract \(not shaped: no --input\)[\s\S]*━━ input \(empty\)/);
    const wrap = build(withShaping('inputShaping: { mode: wrap }\n', 'Answer the input.')).preset!;
    const json = JSON.parse(preview(wrap, { input: 'Hi {{user}}', json: true }));
    expect(json.historyInput).toBe('<input>\nHi {{user}}\n</input>');
    expect(json.vars.input).toEqual({ shaped: true });
  });
});

describe('storylines', () => {
  const withStorylines = (decl: string, min = 'minAdvancedPreset: 1.10.0\n', body = 'Side: {{ap::storyline}}') => {
    const t = tree({ 'preset.yaml': MANIFEST.replace('version: 1.0.0', `version: 1.0.0\n${min}`) + decl });
    t.set('modules/side.md', `---\nid: side\ntoggle: always\nregion: task\nwhen: "!storyline.main"\n---\n${body}\n`);
    return t;
  };
  const messages = (r: ReturnType<typeof build>) => [...r.diag.errors, ...r.diag.warnings].map((d) => d.message).join('\n');

  it('is absent unless declared (hash unchanged)', () => {
    const plain = build(tree());
    expect('storylines' in plain.preset!).toBe(false);
    expect('storylines' in plain.preset!.configurationDefaults).toBe(false);
    expect(build(tree()).preset!.hash).toBe(plain.preset!.hash);
  });

  it('compiles `true` and custom separators with the user switch', () => {
    const on = build(withStorylines('storylines: true\n'));
    expect(on.diag.errors).toEqual([]);
    expect(messages(on)).toMatch(/no module requests a storyline structure/);
    expect(on.preset!.storylines).toEqual({ separator: '<!-- Start of Storyline {{storyline}} -->', mainSeparator: '<!-- Start of the main storyline -->' });
    expect(on.preset!.configurationDefaults.storylines).toEqual({ enabled: true, freezeVariables: 'all' });
    const custom = build(withStorylines('storylines: { separator: "[{{storyline}}]" }\nconfigurationDefaults: { storylines: { enabled: false } }\n'));
    expect(custom.diag.errors).toEqual([]);
    expect(custom.preset!.storylines).toEqual({ separator: '[{{storyline}}]', mainSeparator: '<!-- Start of the main storyline -->' });
    expect(custom.preset!.configurationDefaults.storylines).toEqual({ enabled: false, freezeVariables: 'all' });
  });

  it('flags bad declarations, undeclared use and old AP versions', () => {
    expect(build(withStorylines('storylines: yes please\n')).diag.errors.map((e) => e.message).join('\n')).toMatch(/storylines must be `true` or a mapping/);
    const w = messages(build(withStorylines('storylines: { separator: "---", tag: x }\n')));
    expect(w).toMatch(/has no \{\{storyline\}\}/);
    expect(w).toMatch(/unknown key `tag`/);
    expect(messages(build(withStorylines('')))).toMatch(/always describe the main storyline/);
    expect(messages(build(withStorylines('storylines: true\n', '', 'x')))).toMatch(/storylines need Advanced Preset 1\.10\.0/);
    expect(messages(build(withStorylines('storylines: true\n', undefined, '{{ap::storyline::nope}}')))).toMatch(/expected no argument/);
    expect(messages(build(withStorylines('storylines: true\n', undefined, 'x')))).not.toMatch(/unknown variable/);
  });

  it('previews a storyline with --storyline', async () => {
    const { preview } = await import('../src/preview');
    const p = build(withStorylines('storylines: true\n')).preset!;
    expect(preview(p, {})).toMatch(/storyline: main\n/);
    const out = preview(p, { storyline: 'ifRain', storylineNew: true });
    expect(out).toMatch(/storyline: ifRain \(if-line\) \(new\) \(grouped\)/);
    expect(preview(p, { storylineGrouped: true })).toMatch(/storyline: main \(grouped\)\n/);
    expect(out).toMatch(/Side: ifRain/);
    const json = JSON.parse(preview(p, { storyline: 'cellar', json: true }));
    expect(json.vars.storyline).toEqual({ name: 'cellar', main: false, if: false, new: false, grouped: true, naming: false, namingMain: false, switching: false, frozen: true });
    expect(preview(p, { storyline: 'cellar' })).toMatch(/storyline: cellar \(grouped\) \(variables frozen\)/);
    expect(preview(p, {})).not.toMatch(/variables frozen/);
  });

  it('checks the freeze mode and previews it (I-163)', async () => {
    const { preview } = await import('../src/preview');
    const bad = build(withStorylines('storylines: true\nconfigurationDefaults: { storylines: { freezeVariables: true } }\n'));
    expect(bad.diag.errors.map((e) => e.message).join('\n')).toMatch(/freezeVariables` must be one of all \/ if \/ off/);
    const p = build(withStorylines('storylines: true\nconfigurationDefaults: { storylines: { freezeVariables: if } }\n')).preset!;
    expect(p.configurationDefaults.storylines!.freezeVariables).toBe('if');
    expect(JSON.parse(preview(p, { storyline: 'cellar', json: true })).vars.storyline.frozen).toBe(false);
    expect(JSON.parse(preview(p, { storyline: 'ifRain', json: true })).vars.storyline.frozen).toBe(true);
    expect(messages(build(withStorylines('storylines: true\n', undefined, '<!-- @if storyline.frozen -->x<!-- @end -->')))).not.toMatch(/unknown variable/);
  });

  const withNaming = (decl = 'storylines: true\n') => {
    const t = withStorylines(decl);
    t.set('manifest/naming.yaml', 'structures:\n  storyline:\n    kind: storyline\n    properties: { name: The new name, previous_main: The old name }\n    formatPrompt: { tag: "<storyline>", field: "{{field}}" }\n');
    t.set('modules/naming.md', '---\nid: naming\ntoggle: always\nregion: task\nwhen: storyline.naming || storyline.namingMain\nstructures: [storyline]\n---\nName it.<!-- @if storyline.namingMain --> Name the old one too.<!-- @end -->\n');
    return t;
  };

  it('compiles the storyline structure and checks its use (I-158)', () => {
    const r = build(withNaming());
    expect(r.diag.errors).toEqual([]);
    expect(messages(r)).not.toMatch(/storyline/i);
    expect(r.preset!.structures.storyline).toMatchObject({ kind: 'storyline', properties: { name: 'The new name', previous_main: 'The old name' } });
    expect(messages(build(withNaming('')))).toMatch(/storyline structures are only requested when a storyline is named/);
    const bad = withNaming();
    bad.set('manifest/naming.yaml', bad.get('manifest/naming.yaml')!.replace('previous_main: The old name', 'old: x'));
    expect(build(bad).diag.errors.map((e) => e.message).join('\n')).toMatch(/storyline has no sub-field `old` \(expected name \| previous_main\)/);
  });

  it('previews naming turns: --storyline ?, --storyline-switch, --storyline-naming-main', async () => {
    const { preview } = await import('../src/preview');
    const p = build(withNaming()).preset!;
    expect(preview(p, { storyline: 'cellar' })).not.toMatch(/Name it/);
    const side = preview(p, { storyline: '?' });
    expect(side).toMatch(/storyline: \? \(new\) \(grouped\) \(AI names it\)/);
    expect(side).toMatch(/structures: storyline/);
    expect(side).toMatch(/Name it\./);
    expect(side).not.toMatch(/Name the old one/);
    expect(preview(p, { storyline: 'if?' })).toMatch(/storyline: \? \(if-line\) \(new\) \(grouped\) \(AI names it\)/);
    const sw = preview(p, { storyline: '?', storylineSwitch: true, storylineNamingMain: true, transport: 'structured', json: true });
    const json = JSON.parse(sw);
    expect(json.vars.storyline).toMatchObject({ main: true, naming: true, namingMain: true, switching: true });
    const schema = JSON.stringify(json.schema);
    expect(schema).toContain('previous_main');
    const only = JSON.parse(preview(p, { storyline: 'B', storylineSwitch: true, storylineNamingMain: true, transport: 'structured', json: true }));
    expect(only.vars.storyline).toMatchObject({ name: 'B', main: true, naming: false, namingMain: true });
    expect(JSON.stringify(only.schema)).toMatch(/"required":\["previous_main"\]/);
  });
});

describe('SillyTavern regex scripts & Quick Reply sets', () => {
  const at110 = (extra: Record<string, string>) => {
    const t = tree(extra);
    t.set('preset.yaml', MANIFEST.replace('version: 1.0.0', 'version: 1.0.0\nminAdvancedPreset: 1.10.0'));
    return t;
  };
  const messages = (r: ReturnType<typeof build>) => [...r.diag.errors, ...r.diag.warnings].map((d) => `${d.file ?? ''} ${d.path ?? ''} ${d.message}`).join('\n');

  it('are absent unless written (hash unchanged)', () => {
    const plain = build(tree());
    expect('regexScripts' in plain.preset!).toBe(false);
    expect('quickReplySets' in plain.preset!).toBe(false);
  });

  it('compiles regex scripts in ST form, ordered by file, with stable ids', () => {
    const r = build(at110({
      'regex-scripts/20-hide.yaml': 'scriptName: Hide thinking\nfindRegex: "/<thinking>[\\\\s\\\\S]*?<\\\\/thinking>/gi"\nplacement: [ai-output]\nmarkdownOnly: true\n',
      'regex-scripts/10-list.json': JSON.stringify([
        { id: 'from-st-export', scriptName: 'A', findRegex: 'a+', replaceString: 'b', placement: [1, 2], trimStrings: ['x'], substituteRegex: 0, minDepth: null, maxDepth: 3, disabled: true },
        { findRegex: '{{char}}', substituteRegex: 'raw', placement: 'user-input', promptOnly: true, runOnEdit: false },
      ]),
    }));
    expect(r.diag.errors).toEqual([]);
    expect(r.diag.warnings.filter((d) => d.file?.startsWith('regex-scripts') || /regex/.test(d.message))).toEqual([]);
    const s = r.preset!.regexScripts!;
    expect(s.map((x) => x.scriptName)).toEqual(['A', '10-list 2', 'Hide thinking']);
    expect(s[0]).toEqual({ id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/), scriptName: 'A', findRegex: 'a+', replaceString: 'b', trimStrings: ['x'], placement: [1, 2], disabled: true, markdownOnly: false, promptOnly: false, runOnEdit: true, substituteRegex: 0, minDepth: null, maxDepth: 3 });
    expect(s[1]).toMatchObject({ substituteRegex: 1, placement: [1], promptOnly: true, runOnEdit: false });
    expect(s[2]).toMatchObject({ placement: [2], markdownOnly: true, findRegex: '/<thinking>[\\s\\S]*?<\\/thinking>/gi' });
    expect(new Set(s.map((x) => x.id)).size).toBe(3);
    expect(build(at110({ 'regex-scripts/20-hide.yaml': 'findRegex: x\nplacement: [2]\n' })).preset!.regexScripts![0]!.id).toBe(s[2]!.id);
  });

  it('reports bad regex scripts', () => {
    const m = messages(build(tree({
      'regex-scripts/a.yaml': 'findRegex: "/(/g"\nplacement: [ai-output, chat]\nfoo: 1\nmaxDepth: x\nreplaceString: "{{ap::name::narrator}}"\n',
      'regex-scripts/b.yaml': 'replaceString: x\n',
      'regex-scripts/c.yaml': 'findRegex: x\n',
    })));
    expect(m).toMatch(/a\.yaml findRegex `findRegex` is not a valid regular expression/);
    expect(m).toMatch(/unknown placement `chat`/);
    expect(m).toMatch(/unknown regex script field `foo`/);
    expect(m).toMatch(/`maxDepth` must be an integer/);
    expect(m).toMatch(/macros are not expanded in regex scripts/);
    expect(m).toMatch(/b\.yaml findRegex `findRegex` is required/);
    expect(m).toMatch(/c\.yaml placement no `placement`: the script never runs/);
    expect(m).toMatch(/regex scripts need Advanced Preset 1\.10\.0/);
  });

  const SET = `
qrList:
  - id: meta
    label: Meta
    icon: fa-at
    title: Talk to {{ap::name::narrator}}
    message: "/setinput {{input}} @{{ap::name::narrator}}"
    contextList: [more, { set: Someone Else, isChained: true }]
  - label: Second
    executeOnAi: true
`;

  it('compiles Quick Reply sets with every ST field, own context menus resolved', () => {
    const r = build(at110({
      'quick-replies/main.yaml': SET,
      'quick-replies/more.json': JSON.stringify({ version: 2, name: 'Demo extra', disableSend: true, color: '#ff0000', onlyBorderColor: true, idIndex: 4, qrList: [{ id: 3, label: 'X', message: 'hi', preventAutoExecute: false, isHidden: true, automationId: 'a1' }] }),
      'locales/zh-cn.yaml': 'quickReplySets:\n  main: { qrList: { meta: { label: 元指令, title: "和 {{ap::name::narrator}} 说话" } } }\n',
    }));
    expect(r.diag.errors).toEqual([]);
    expect(messages(r)).toMatch(/context menu set `Someone Else` is not one of the preset's sets/);
    const [main, more] = r.preset!.quickReplySets!;
    expect(main).toMatchObject({ id: 'main', name: 'AP · Demo', global: true, visible: true, disableSend: false, placeBeforeInput: false, injectInput: false, color: 'transparent', onlyBorderColor: false });
    expect(main!.qrList[0]).toEqual({
      id: 'meta', label: 'Meta', icon: 'fa-at', showLabel: false, title: 'Talk to {{ap::name::narrator}}', message: '/setinput {{input}} @{{ap::name::narrator}}',
      contextList: [{ set: 'Demo extra', isChained: false }, { set: 'Someone Else', isChained: true }], preventAutoExecute: true, isHidden: false, automationId: '',
      executeOnStartup: false, executeOnUser: false, executeOnAi: false, executeOnChatChange: false, executeOnGroupMemberDraft: false, executeOnNewChat: false, executeBeforeGeneration: false,
    });
    expect(main!.qrList[1]).toMatchObject({ id: '2', label: 'Second', executeOnAi: true });
    expect(more).toMatchObject({ id: 'more', name: 'Demo extra', disableSend: true, color: '#ff0000', onlyBorderColor: true });
    expect(more!.qrList[0]).toMatchObject({ id: '3', preventAutoExecute: false, isHidden: true, automationId: 'a1' });
  });

  it('reports bad Quick Reply sets and translations', () => {
    const m = messages(build(tree({
      'quick-replies/My Set.yaml': SET,
      'quick-replies/a.yaml': 'qrList:\n  - { id: x, icon: fa-solid fa-at, message: "{{ap::param::language}} {{ap::name::nobody}}" }\n  - { id: x, label: y, showLabel: yes }\n  - {}\n',
      'quick-replies/b.yaml': 'name: AP · Demo\nqrList: oops\nfoo: 1\n',
      'locales/zh-cn.yaml': 'quickReplySets:\n  a: { qrList: { nope: { label: x }, x: { message: "{{ap::lang}}" } } }\n  zzz: {}\n',
    })));
    expect(m).toMatch(/My Set\.yaml {2}a Quick Reply set file name must be lower-case kebab-case/);
    expect(m).toMatch(/`icon` is one Font Awesome class/);
    expect(m).toMatch(/\{\{ap::param::language\}\}: quick replies only expand/);
    expect(m).toMatch(/unknown actor `nobody`/);
    expect(m).toMatch(/duplicate quick reply id `x`/);
    expect(m).toMatch(/`showLabel` must be true or false/);
    expect(m).toMatch(/without `label` or `icon`/);
    expect(m).toMatch(/`qrList` \(the quick replies\) must be a list/);
    expect(m).toMatch(/unknown Quick Reply set field `foo`/);
    expect(m).toMatch(/sets `a` and `b` are both named `AP · Demo`/);
    expect(m).toMatch(/quickReplySets\.a\.qrList\.nope does not exist/);
    expect(m).toMatch(/quickReplySets\.zzz does not exist/);
    expect(m).toMatch(/quickReplySets\.a\.qrList\.x\.message \{\{ap::lang\}\}: quick replies only expand/);
    expect(m).toMatch(/Quick Reply sets need Advanced Preset 1\.10\.0/);
  });
});

describe('Tavern Helper scripts', () => {
  const at110 = (extra: Record<string, string>) => {
    const t = tree(extra);
    t.set('preset.yaml', MANIFEST.replace('version: 1.0.0', 'version: 1.0.0\nminAdvancedPreset: 1.10.0'));
    return t;
  };
  const messages = (r: ReturnType<typeof build>) => [...r.diag.errors, ...r.diag.warnings].map((d) => `${d.file ?? ''} ${d.path ?? ''} ${d.message}`).join('\n');
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  it('are absent unless written (hash unchanged)', () => {
    expect('tavernHelperScripts' in build(tree()).preset!).toBe(false);
  });

  it('compiles scripts, folders and Tavern Helper exports, with code files and stable ids', () => {
    const exported = {
      type: 'script', enabled: false, name: 'Exported', id: 'f3c1-from-export', content: 'console.log(1)', info: 'notes',
      button: { enabled: true, buttons: [{ name: 'Go', visible: false }] }, data: { a: 1 }, export_with: { data: false, button: true },
    };
    const r = build(at110({
      'tavern-helper-scripts/20-main.yaml': 'name: Main\ncontent: ./tavern-helper-scripts/src/main.js\nbutton: { buttons: [Roll] }\n',
      'tavern-helper-scripts/src/main.js': 'export const x = 1;\n',
      'tavern-helper-scripts/10-exported.json': JSON.stringify(exported),
      'tavern-helper-scripts/30-tools.yaml': 'name: Tools\nicon: fa-solid fa-toolbox\nscripts:\n  - { name: A, content: "a()" }\n  - { content: "b()", enabled: false }\n',
    }));
    expect(r.diag.errors).toEqual([]);
    expect(r.diag.warnings.filter((d) => d.file?.startsWith('tavern-helper') || /Tavern Helper/.test(d.message))).toEqual([]);
    const s = r.preset!.tavernHelperScripts!;
    expect(s.map((x) => x.name)).toEqual(['Exported', 'Main', 'Tools']);
    expect(s[0]).toEqual({ ...exported, id: expect.stringMatching(UUID) });
    expect(s[1]).toEqual({
      type: 'script', enabled: true, name: 'Main', id: expect.stringMatching(UUID), content: 'export const x = 1;\n', info: '',
      button: { enabled: true, buttons: [{ name: 'Roll', visible: true }] }, data: {}, export_with: { data: true, button: true },
    });
    expect(s[2]).toMatchObject({ type: 'folder', enabled: true, name: 'Tools', icon: 'fa-solid fa-toolbox', id: expect.stringMatching(UUID) });
    expect('color' in s[2]!).toBe(false);
    const folder = s[2] as Extract<(typeof s)[number], { type: 'folder' }>;
    expect(folder.scripts.map((x) => [x.name, x.enabled, x.content])).toEqual([['A', true, 'a()'], ['30-tools 2', false, 'b()']]);
    const ids = [s[0]!.id, s[1]!.id, s[2]!.id, ...folder.scripts.map((x) => x.id)];
    expect(new Set(ids).size).toBe(5);
    // Same place → same id, whatever the content; the export's own id is replaced.
    expect(build(at110({ 'tavern-helper-scripts/20-main.yaml': 'content: other()\n' })).preset!.tavernHelperScripts![0]!.id).toBe(s[1]!.id);
    expect(r.preset!.tavernHelperScripts).not.toContainEqual(expect.objectContaining({ id: 'f3c1-from-export' }));
  });

  it('reads a list of trees from one file', () => {
    const r = build(at110({ 'tavern-helper-scripts/all.json': JSON.stringify([{ name: 'One', content: '1' }, { type: 'folder', name: 'F', scripts: [{ content: '2' }] }]) }));
    expect(r.diag.errors).toEqual([]);
    expect(r.preset!.tavernHelperScripts!.map((x) => [x.type, x.name])).toEqual([['script', 'One'], ['folder', 'F']]);
  });

  it('reports bad scripts', () => {
    const m = messages(build(tree({
      'tavern-helper-scripts/a.yaml': 'name: A\nfoo: 1\ncontent: ./elsewhere/a.js\n',
      'tavern-helper-scripts/b.yaml': 'name: B\n',
      'tavern-helper-scripts/c.yaml': 'content: ./tavern-helper-scripts/missing.js\n',
      'tavern-helper-scripts/d.yaml': 'type: folder\nscripts:\n  - { type: folder, scripts: [] }\n  - x\n',
      'tavern-helper-scripts/e.yaml': 'type: macro\n',
      'tavern-helper-scripts/f.yaml': 'content: x\nbutton: { buttons: [{ visible: true }] }\ndata: [1]\n',
      'tavern-helper-scripts/g.yaml': 'content: x\nenabled: yes\n',
    })));
    expect(m).toMatch(/a\.yaml foo unknown Tavern Helper script field `foo`/);
    expect(m).toMatch(/g\.yaml enabled `enabled` must be true or false/);
    expect(m).toMatch(/script files live under tavern-helper-scripts\//);
    expect(m).toMatch(/b\.yaml content `content` .* is required/);
    expect(m).toMatch(/file `tavern-helper-scripts\/missing\.js` not found/);
    expect(m).toMatch(/d\.yaml scripts\[0\] folders cannot contain folders/);
    expect(m).toMatch(/d\.yaml scripts\[1\] a Tavern Helper script must be a mapping/);
    expect(m).toMatch(/e\.yaml type `type` must be script or folder/);
    expect(m).toMatch(/a button is `<name>` or `\{ name, visible \}`/);
    expect(m).toMatch(/f\.yaml data `data` must be a mapping/);
    expect(m).toMatch(/Tavern Helper scripts need Advanced Preset 1\.10\.0/);
  });

  it('keeps code files in the source tree', () => {
    expect(isSourcePath('tavern-helper-scripts/src/main.js')).toBe(true);
    expect(isSourcePath('tavern-helper-scripts/main.yaml')).toBe(true);
  });
});

describe('preset file (I-170)', () => {
  it('reads build.installer (default true) without touching the artifact', () => {
    const plain = build(tree());
    expect(plain.build).toEqual({ installer: true });
    const off = build(tree({ 'preset.yaml': `${MANIFEST}build: { installer: false }\n` }));
    expect(off.build).toEqual({ installer: false });
    expect(off.preset!.hash).toBe(plain.preset!.hash);
    expect((off.preset as Record<string, unknown>).build).toBeUndefined();
    const bad = build(tree({ 'preset.yaml': `${MANIFEST}build: { installer: maybe, other: 1 }\n` }));
    expect(bad.diag.errors.map((e) => e.message).join('\n')).toMatch(/build\.installer` must be true or false/);
    expect(bad.diag.warnings.map((w) => w.message).join('\n')).toMatch(/unknown build key `other`/);
  });

  it('writes the preset file with the default sampling, with or without the installer', async () => {
    const { mkdtemp, readFile: read } = await import('node:fs/promises');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const { writePresetFile } = await import('../src/io');
    const { upgradeArtifact, PRESET_FILE_FIELD, INSTALLER_SCRIPT_ID } = await import('@advanced-preset/protocol');
    const { preset } = build(tree());
    const dir = await mkdtemp(join(tmpdir(), 'ap-'));
    const file = await writePresetFile(preset!, dir);
    expect(file).toBe(join(dir, 'demo.apreset.json'));
    const json = JSON.parse(await read(file, 'utf8'));
    expect(json.extensions[PRESET_FILE_FIELD].artifact.hash).toBe(preset!.hash);
    expect(json.extensions.tavern_helper.scripts[0].id).toBe(INSTALLER_SCRIPT_ID);
    expect(upgradeArtifact(json)).toEqual(preset);
    for (const [k, v] of Object.entries(resolveConfiguration(preset!, preset!.defaultConfiguration, undefined).sampling)) expect(json[k]).toEqual(v);
    const bare = JSON.parse(await read(await writePresetFile(preset!, dir, { installer: false }), 'utf8'));
    expect(bare.extensions.tavern_helper).toBeUndefined();
  });
});
