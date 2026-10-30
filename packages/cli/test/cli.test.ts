import { describe, expect, it } from 'vitest';
import { assemble, defaultVars, resolveConfiguration, withUserModules, type UserModule } from '@advanced-preset/protocol';
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
    bad.set('preset.yaml', MANIFEST.replace('structures:\n', 'structures:\n  annotations: { kind: annotations, history: -1 }\n  options: { kind: options, history: 1 }\n'));
    const msgs = build(bad).diag.errors.map((e) => e.message).join('\n');
    expect(msgs).toMatch(/history` must be a non-negative integer/);
    expect(msgs).toMatch(/only annotations and synopsis structures support `history`/);
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
      .replace('structures:\n', 'structures:\n  synopsis: { kind: synopsis, history: -1, historyTemplate: "{{time}}" }\n  options: { kind: options, history: 2 }\n')
      .replace('diff: { connection: { transport: prefill } }', 'diff: { tokenSaving: { userInput: nope } }') + 'tokenSaving:\n  userInput: drop\n' }));
    const msgs = [...r.diag.errors, ...r.diag.warnings].map((d) => d.message).join('\n');
    expect(msgs).toMatch(/history` must be a non-negative integer/);
    expect(msgs).toMatch(/no `\{\{content\}\}`/);
    expect(msgs).toMatch(/only annotations and synopsis structures support `history`/);
    expect(r.diag.errors.filter((d) => /userInput/.test(d.message))).toHaveLength(2);
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
