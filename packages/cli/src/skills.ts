/** `ap skills`: list and install the Agent Skills bundled with the CLI (template/.agents/skills). */
import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

export const SKILLS_SOURCE = fileURLToPath(new URL('../template/.agents/skills', import.meta.url));
export const DEFAULT_TARGET = '.agents/skills';

export interface SkillInfo {
  name: string;
  description: string;
  dir: string;
}

export type InstallStatus = 'installed' | 'updated' | 'up to date';

export interface InstallResult {
  name: string;
  status: InstallStatus;
}

const isDir = (p: string) => stat(p).then((s) => s.isDirectory(), () => false);

/** The `name` / `description` frontmatter of a SKILL.md. */
export function parseSkillFrontmatter(text: string): { name?: string; description?: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return {};
  const data = parseYaml(m[1]) as Record<string, unknown> | null;
  return {
    name: typeof data?.name === 'string' ? data.name : undefined,
    description: typeof data?.description === 'string' ? data.description : undefined,
  };
}

export async function listSkills(source = SKILLS_SOURCE): Promise<SkillInfo[]> {
  const out: SkillInfo[] = [];
  for (const ent of (await readdir(source, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!ent.isDirectory()) continue;
    const dir = join(source, ent.name);
    const text = await readFile(join(dir, 'SKILL.md'), 'utf8').catch(() => null);
    if (text === null) continue;
    const fm = parseSkillFrontmatter(text);
    out.push({ name: fm.name ?? ent.name, description: fm.description ?? '', dir });
  }
  return out;
}

/** Relative path → content of every file under `dir`. */
async function snapshot(dir: string): Promise<Map<string, Buffer>> {
  const out = new Map<string, Buffer>();
  async function walk(d: string): Promise<void> {
    for (const ent of await readdir(d, { withFileTypes: true })) {
      const p = join(d, ent.name);
      if (ent.isDirectory()) await walk(p);
      else out.set(relative(dir, p).split('\\').join('/'), await readFile(p));
    }
  }
  await walk(dir);
  return out;
}

async function sameTree(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([snapshot(a), snapshot(b)]);
  if (x.size !== y.size) return false;
  for (const [k, v] of x) {
    const w = y.get(k);
    if (!w || !v.equals(w)) return false;
  }
  return true;
}

/**
 * Copy every bundled skill into `target`, replacing same-named skill directories as a whole.
 * Other directories in `target` are left untouched.
 */
export async function installSkills(target: string, source = SKILLS_SOURCE): Promise<InstallResult[]> {
  await mkdir(target, { recursive: true });
  const results: InstallResult[] = [];
  for (const skill of await listSkills(source)) {
    const name = skill.dir.split(/[\\/]/).pop()!;
    const dest = join(target, name);
    let status: InstallStatus = 'installed';
    if (await isDir(dest)) {
      if (await sameTree(skill.dir, dest)) {
        results.push({ name, status: 'up to date' });
        continue;
      }
      status = 'updated';
      await rm(dest, { recursive: true, force: true });
    }
    await cp(skill.dir, dest, { recursive: true });
    results.push({ name, status });
  }
  return results;
}
