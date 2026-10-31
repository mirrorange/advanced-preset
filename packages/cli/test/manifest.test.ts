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
      'manifest/structures.yaml': 'structures:\n  reply: { kind: reply }\n  memory:\n    kind: memory\n    history: 2\n',
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
