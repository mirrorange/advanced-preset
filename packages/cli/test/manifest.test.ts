import { describe, expect, it } from 'vitest';
import { compile, type SourceTree } from '../src/compile';
import { validate } from '../src/validate';
import { isSourcePath } from '../src/io';
import { Diagnostics } from '../src/diagnostics';
import { loadManifest, parsePath } from '../src/manifest';

const ROOT = `formatVersion: 1
id: demo
name: Demo
version: 1.0.0
actors:
  narrator: { name: Nia }
  user: { name: "{{user}}" }
`;
const REGIONS = `regions:
  - { id: top }
  - { id: settings, native: true }
  - { id: history, anchor: historyStart }
  - { id: task, anchor: historyEnd }
  - { id: tail, anchor: tail }
workflowRegion: task
carrier:
  order: [top, charDescription, history, chatHistory, task, tail]
`;
const STRUCTURES = `structures:
  reply: { kind: reply, formatPrompt: { tag: "<reply>", field: "Use {{field}}." } }
  synopsis:
    kind: synopsis
    formatPrompt: { tag: "<synopsis>", field: "Use {{field}}." }
`;
const MISC = `groups:
  style: { label: Style }
  mode: { label: Mode }
params:
  - { id: language, type: text, label: Language }
`;

const WORKFLOW = `---
id: linear
stages:
  - { id: final, actor: narrator, kind: content, label: Write }
---
<!-- @section stage:final -->
Write it.
`;
const tree = (files: Record<string, string>): SourceTree => new Map(Object.entries({ 'workflows/linear.md': WORKFLOW, ...files }));
const build = (t: SourceTree) => {
  const r = compile(t);
  if (r.preset) validate(r.preset, r.map, r.diag);
  return r;
};
const single = () => tree({ 'preset.yaml': ROOT + REGIONS + STRUCTURES + MISC });

describe('manifest fragments', () => {
  it('builds the same artifact from one file or from fragments', () => {
    const one = build(single());
    expect(one.diag.errors).toEqual([]);
    const split = build(tree({
      'preset.yaml': ROOT,
      'manifest/regions.yaml': REGIONS,
      'manifest/structures.yml': STRUCTURES,
      'manifest/nested/misc.yaml': MISC,
    }));
    expect(split.diag.errors).toEqual([]);
    expect(split.preset!.hash).toBe(one.preset!.hash);
  });

  it('merges mappings at any depth in path order', () => {
    const t = tree({
      'preset.yaml': `${ROOT}${REGIONS}groups:\n  style: { label: Style }\n`,
      'manifest/b.yaml': 'groups:\n  mode: { label: Mode }\nstructures:\n  synopsis: { kind: synopsis }\n',
      'manifest/a.yaml': 'groups:\n  length: { label: Length }\nstructures:\n  reply: { kind: reply }\n',
    });
    const diag = new Diagnostics();
    const m = loadManifest(t, diag)!;
    expect(diag.items).toEqual([]);
    expect(m.files).toEqual(['preset.yaml', 'manifest/a.yaml', 'manifest/b.yaml']);
    expect(Object.keys(m.raw.groups as object)).toEqual(['style', 'length', 'mode']);
    expect(Object.keys(m.raw.structures as object)).toEqual(['reply', 'synopsis']);
    const { preset } = build(t);
    expect(Object.keys(preset!.structures)).toEqual(['reply', 'synopsis']);
  });

  it('rejects a scalar or array defined twice, naming both files', () => {
    const { diag } = build(tree({
      'preset.yaml': ROOT + REGIONS + MISC,
      'manifest/more.yaml': 'params:\n  - { id: length, type: number }\ngroups:\n  style:\n    label: Other\n',
    }));
    expect(diag.errors.map((d) => [d.file, d.line, d.path, d.message])).toEqual([
      ['manifest/more.yaml', 1, 'params', '`params` is already defined in preset.yaml:20'],
      ['manifest/more.yaml', 5, 'groups.style.label', '`groups.style.label` is already defined in preset.yaml:18'],
    ]);
  });

  it('keeps metadata in preset.yaml', () => {
    const { diag, preset } = build(tree({ 'preset.yaml': ROOT + REGIONS, 'manifest/meta.yaml': 'version: 2.0.0\ntheme: { primary: "#f0f" }\n' }));
    expect(diag.errors).toMatchObject([{ file: 'manifest/meta.yaml', line: 1, path: 'version', message: '`version` may only be set in preset.yaml' }]);
    expect(preset!.version).toBe('1.0.0');
  });

  it('writes updateUrl into the artifact and rejects anything but an http(s) URL', () => {
    const ok = build(tree({ 'preset.yaml': `${ROOT}updateUrl: https://github.com/me/demo/blob/main/dist/demo.apreset.json\n${REGIONS}` }));
    expect(ok.diag.errors).toEqual([]);
    expect(ok.preset!.updateUrl).toBe('https://github.com/me/demo/blob/main/dist/demo.apreset.json');
    expect(build(single()).preset!.updateUrl).toBeUndefined();
    const bad = build(tree({ 'preset.yaml': `${ROOT}updateUrl: file:///etc/passwd\n${REGIONS}` }));
    expect(bad.diag.errors).toMatchObject([{ path: 'updateUrl', message: 'updateUrl must be an http(s) URL' }]);
    const fragment = build(tree({ 'preset.yaml': ROOT + REGIONS, 'manifest/meta.yaml': 'updateUrl: https://example.com/x.json\n' }));
    expect(fragment.diag.errors).toMatchObject([{ path: 'updateUrl', message: '`updateUrl` may only be set in preset.yaml' }]);
  });

  it('reports invalid and non-mapping fragments; ignores empty ones', () => {
    const bad = build(tree({ 'preset.yaml': ROOT + REGIONS, 'manifest/bad.yaml': 'a: [1, 2\n' }));
    expect(bad.preset).toBeUndefined();
    expect(bad.diag.errors[0]).toMatchObject({ file: 'manifest/bad.yaml' });
    expect(bad.diag.errors[0]!.message).toMatch(/^invalid YAML/);

    const list = build(tree({ 'preset.yaml': ROOT + REGIONS, 'manifest/list.yaml': '- a\n- b\n', 'manifest/empty.yaml': '# nothing yet\n' }));
    expect(list.diag.errors).toMatchObject([{ file: 'manifest/list.yaml', message: 'a manifest fragment must be a mapping of manifest keys' }]);
  });

  it('locates manifest diagnostics in the defining file and line', () => {
    const { diag } = build(tree({
      'preset.yaml': ROOT + REGIONS,
      'manifest/structures.yaml': 'structures:\n  reply: { kind: reply }\n  memory:\n    kind: memory\n    history: -2\n',
    }));
    expect(diag.errors).toMatchObject([{ file: 'manifest/structures.yaml', line: 5, path: 'structures.memory.history' }]);

    const root = build(tree({ 'preset.yaml': `${ROOT}${REGIONS}regex:\n  - { id: x, pattern: "(" }\n` }));
    expect(root.diag.errors).toMatchObject([{ file: 'preset.yaml', line: 18, path: 'regex[0]' }]);
  });

  it('watches fragment paths as sources', () => {
    expect(isSourcePath('manifest/tools.yaml')).toBe(true);
    expect(isSourcePath('manifest/a/b.yml')).toBe(true);
    expect(isSourcePath('manifest/.draft.yaml')).toBe(false);
    expect(isSourcePath('manifest/notes.md')).toBe(false);
    expect(parsePath('regions[2].merge.wrap')).toEqual(['regions', 2, 'merge', 'wrap']);
  });
});

describe('stage regions (beforeStage)', () => {
  const withStageRegion = (stageId: string, extra = '') => tree({
    'preset.yaml': ROOT + 'minAdvancedPreset: 1.13.0\n' + REGIONS.replace('  - { id: tail, anchor: tail }', `  - { id: tail, anchor: tail }\n  - { id: final_prompt, beforeStage: ${stageId}${extra} }`) + STRUCTURES + MISC,
  });
  const messages = (r: ReturnType<typeof build>) => [...r.diag.errors, ...r.diag.warnings].map((d) => d.message);

  it('compile without a Carrier anchor', () => {
    const r = build(withStageRegion('final'));
    expect(r.diag.errors).toEqual([]);
    expect(r.preset!.regions.find((x) => x.id === 'final_prompt')).toMatchObject({ beforeStage: 'final' });
    expect(r.preset!.carrier.prompts.some((p) => p.identifier.includes('final_prompt'))).toBe(false);
  });

  it('must name a stage, cannot be native, and need 1.13.0', () => {
    expect(messages(build(withStageRegion('nope')))).toContainEqual(expect.stringContaining('beforeStage `nope` is not a stage'));
    expect(messages(build(withStageRegion('final', ', native: true')))).toContainEqual(expect.stringContaining('cannot be native'));
    const old = build(tree({ 'preset.yaml': ROOT + REGIONS.replace('  - { id: tail, anchor: tail }', '  - { id: tail, anchor: tail }\n  - { id: final_prompt, beforeStage: final }') + STRUCTURES + MISC }));
    expect(messages(old)).toContainEqual(expect.stringContaining('stage regions need Advanced Preset 1.13.0'));
  });

  it('phase variables are known to conditions', () => {
    const wf = WORKFLOW.replace('kind: content, label: Write }', 'kind: content, label: Write, when: "!multiModel || phase.stages.final || phase.index == 0 || phase.actor == \\"narrator\\"" }');
    expect(build(tree({ 'preset.yaml': ROOT + REGIONS + STRUCTURES + MISC, 'workflows/linear.md': wf })).diag.errors).toEqual([]);
    const bad = WORKFLOW.replace('kind: content, label: Write }', 'kind: content, label: Write, when: "phase.stages.nope" }');
    expect(messages(build(tree({ 'preset.yaml': ROOT + REGIONS + STRUCTURES + MISC, 'workflows/linear.md': bad })))).toContainEqual(expect.stringContaining('unknown stage `nope`'));
  });
});


describe('ap preview with multi-model', () => {
  const WF2 = `---
id: linear
stages:
  - { id: plan, actor: editor, kind: text, label: Plan }
  - { id: final, actor: narrator, kind: content, label: Write }
---
<!-- @section stage:plan -->
Plan it{{ap::name::editor}}.
<!-- @section stage:final -->
Write it.
`;
  const files = () => tree({
    'preset.yaml': ROOT.replace('  user: { name: "{{user}}" }', '  editor: { name: Ed }\n  user: { name: "{{user}}" }') + 'minAdvancedPreset: 1.13.0\nmultiModel: true\n'
      + REGIONS.replace('  - { id: tail, anchor: tail }', '  - { id: tail, anchor: tail }\n  - { id: write_cue, beforeStage: final }') + STRUCTURES + MISC,
    'workflows/linear.md': WF2,
    'modules/cue.md': '---\nid: cue\ntoggle: always\nregion: write_cue\n---\nWRITE NOW\n',
  });

  it('--phase renders that phase: its stages, stage regions and the replay of earlier phases', async () => {
    const { preview } = await import('../src/preview');
    const r = build(files());
    expect(r.diag.errors).toEqual([]);
    const p = r.preset!;
    const first = preview(p, { multiModel: true, transport: 'structured' });
    expect(first).toMatch(/multi-model phase 0\/1: editor · stages plan/);
    expect(first).toMatch(/write_cue \(before stage final, not in this phase's request\)/);
    expect(first).not.toContain('WRITE NOW');
    const second = preview(p, { phase: 1, transport: 'plaintext' });
    expect(second).toMatch(/multi-model phase 1\/1: narrator · stages final/);
    expect(second).toMatch(/write_cue \(before stage final, request tail\)[^\n]*\n\[system\]\nWRITE NOW/);
    expect(second).toMatch(/earlier phases replayed \(plaintext, placeholder text\)[^\n]*\nEd: \(output of plan\)/);
    const json = JSON.parse(preview(p, { phase: 1, transport: 'structured', json: true }));
    expect(json.vars.multiModel).toBe(true);
    expect(json.vars.phase).toEqual({ stages: { final: true }, index: 1, actor: 'narrator' });
    expect(Object.keys(json.schema.value.properties)).not.toContain(Object.keys(json.phase.replay)[0]);
    expect(() => preview(p, { phase: 2 })).toThrow(/expected 0–1/);
    const off = preview(p, {});
    expect(off).toMatch(/write_cue \(before stage final, request tail\)[^\n]*\n\[system\]\nWRITE NOW/);
  });
});

