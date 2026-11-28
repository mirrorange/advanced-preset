import { describe, expect, it } from 'vitest';
import { compile, type SourceTree } from '../src/compile';
import { validate } from '../src/validate';

const MANIFEST = `
id: demo
name: Demo
version: 1.0.0
actors:
  narrator: { name: Nia }
  critic: { name: Cora }
  user: { name: "{{user}}" }
regions:
  - { id: top }
  - { id: history, anchor: historyStart }
  - { id: task, anchor: historyEnd }
  - { id: tail, anchor: tail }
workflowRegion: task
carrier:
  order: [top, history, chatHistory, task, tail]
`;

const tree = (extra = '', min = 'minAdvancedPreset: 1.13.0\n'): SourceTree => new Map(Object.entries({
  'preset.yaml': MANIFEST.replace('version: 1.0.0', `version: 1.0.0\n${min}`) + extra,
  'modules/core.md': '---\nid: core\ntoggle: always\nregion: top\n---\nYou are {{ap::name::narrator}}.\n',
  'workflows/linear.md': `---
id: linear
stages:
  - { id: draft, actor: narrator, kind: text, label: Draft }
  - { id: review, actor: critic, kind: text, label: Review }
  - { id: final, actor: narrator, kind: content, label: Write }
---
<!-- @section stage:draft -->
Draft.
<!-- @section stage:review -->
Review.
<!-- @section stage:final -->
Write.
`,
}));

function build(t: SourceTree) {
  const r = compile(t);
  if (r.preset) validate(r.preset, r.map, r.diag);
  return r;
}
const errors = (r: ReturnType<typeof build>) => r.diag.errors.map((d) => d.message).join('\n');
const messages = (r: ReturnType<typeof build>) => [...r.diag.errors, ...r.diag.warnings].map((d) => d.message).join('\n');

describe('multiModel declaration', () => {
  it('is absent unless declared (hash unchanged, no binding fields in the artifact)', () => {
    const plain = build(tree());
    expect(plain.diag.errors).toEqual([]);
    expect('multiModel' in plain.preset!).toBe(false);
    expect('multiModel' in plain.preset!.configurationDefaults).toBe(false);
    for (const k of ['target', 'bindings', 'binding']) expect(k in plain.preset!.configurationDefaults.connection).toBe(false);
    expect(build(tree('multiModel: false\n')).preset!.hash).toBe(plain.preset!.hash);
    expect(build(tree('multiModel: { enabled: false }\n')).preset!.hash).toBe(plain.preset!.hash);
  });

  it('compiles true / { enabled: true } with the switch off by default', () => {
    for (const decl of ['multiModel: true\n', 'multiModel: { enabled: true }\n']) {
      const r = build(tree(decl));
      expect(r.diag.errors).toEqual([]);
      expect(r.preset!.multiModel).toEqual({});
      expect(r.preset!.configurationDefaults.multiModel).toEqual({ enabled: false, actors: {} });
    }
  });

  it('warns below 1.13.0 and on bad declarations', () => {
    expect(messages(build(tree('multiModel: true\n', '')))).toMatch(/multiModel needs Advanced Preset 1\.13\.0/);
    expect(errors(build(tree('multiModel: please\n')))).toMatch(/multiModel must be `true` or a mapping/);
    expect(messages(build(tree('multiModel: { enabled: true, phases: 2 }\n')))).toMatch(/unknown key `phases`/);
  });

  it('checks multiModel sections of the defaults and recommendations', () => {
    expect(messages(build(tree('configurations:\n  - { id: a, name: A, diff: { multiModel: { enabled: true } } }\n')))).toMatch(/does not declare multiModel/);
    const bad = build(tree('multiModel: true\nconfigurationDefaults: { multiModel: { enabled: yes, actors: { ghost: x, user: default } } }\n'));
    expect(errors(bad)).toMatch(/`enabled` must be a boolean/);
    expect(errors(bad)).toMatch(/unknown actor `ghost`/);
    expect(messages(bad)).toMatch(/the user actor never runs a stage/);
    const ok = build(tree('multiModel: true\nconfigurations:\n  - { id: a, name: A, diff: { multiModel: { enabled: false, actors: { critic: default } } } }\n'));
    expect(ok.diag.errors).toEqual([]);
  });
});

describe('connection bindings in configurations', () => {
  const conf = (diff: string) => tree(`multiModel: true\nconfigurations:\n  - { id: a, name: A, diff: ${diff} }\n`);

  it('accepts bindings, the selected binding and actor mappings', () => {
    const r = build(conf('{ connection: { bindings: { fast: { name: Fast, target: { type: model, model: gpt-x }, transport: prefill } }, binding: fast }, multiModel: { actors: { critic: fast } } }'));
    expect(r.diag.errors).toEqual([]);
    expect(r.preset!.configurations[0]!.diff.connection!.bindings!.fast!.target).toEqual({ type: 'model', model: 'gpt-x' });
  });

  it('flags unknown binding ids, bad targets and bad transport options', () => {
    expect(errors(build(conf('{ connection: { binding: nope } }')))).toMatch(/binding `nope` does not exist/);
    expect(errors(build(conf('{ multiModel: { actors: { critic: nope } } }')))).toMatch(/actor critic: binding `nope` does not exist/);
    expect(errors(build(conf('{ connection: { bindings: { x: { name: X, target: { type: model, model: "" } } } } }')))).toMatch(/model target needs/);
    expect(errors(build(conf('{ connection: { bindings: { x: { name: X, target: { type: web } } } } }')))).toMatch(/target must be/);
    expect(errors(build(conf('{ connection: { bindings: { x: { name: X, target: { type: current }, transport: carrier-pigeon } } } }')))).toMatch(/unknown transport/);
    expect(errors(build(conf('{ connection: { bindings: { default: { name: D, target: { type: current } } } } }')))).toMatch(/is the connection itself/);
    expect(messages(build(conf('{ connection: { target: { type: profile, profile: abc } } }')))).toMatch(/other users will not have it/);
  });
});
