import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import type { APreset } from '@advanced-preset/protocol';
import { compile, type CompileResult, type SourceTree } from './compile';
import { validate } from './validate';
import { FRAGMENT_RE } from './manifest';

const SOURCE_RE = /^(preset\.ya?ml|modules\/.+\.md|workflows\/[^/]+\.md|module-templates\/[^/]+\.md|locales\/[^/]+\.ya?ml)$/;

export function isSourcePath(rel: string): boolean {
  const p = rel.split(sep).join('/');
  return SOURCE_RE.test(p) || FRAGMENT_RE.test(p);
}

async function walk(dir: string, root: string, out: SourceTree): Promise<void> {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules' || ent.name === 'dist') continue;
    const abs = join(dir, ent.name);
    if (ent.isDirectory()) await walk(abs, root, out);
    else {
      const rel = relative(root, abs).split(sep).join('/');
      if (isSourcePath(rel)) out.set(rel === 'preset.yml' ? 'preset.yaml' : rel, await readFile(abs, 'utf8'));
    }
  }
}

export async function readTree(root: string): Promise<SourceTree> {
  const tree: SourceTree = new Map();
  await walk(root, root, tree);
  return tree;
}

/** Compile + validate a preset directory. */
export async function buildDir(root: string): Promise<CompileResult> {
  const result = compile(await readTree(root));
  if (result.preset) validate(result.preset, result.map, result.diag);
  return result;
}

export async function writeArtifact(preset: APreset, outDir: string): Promise<string> {
  await mkdir(outDir, { recursive: true });
  const file = join(outDir, `${preset.id}.apreset.json`);
  await writeFile(file, JSON.stringify(preset, null, 2) + '\n');
  return file;
}
