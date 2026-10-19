import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSkills, listSkills, parseSkillFrontmatter, SKILLS_SOURCE } from '../src/skills';
import { init } from '../src/init';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const tmp = () => mkdtempSync(join(tmpdir(), 'ap-skills-'));

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

describe('bundled Agent Skills', () => {
  it('has the three AP skills with matching frontmatter', async () => {
    const skills = await listSkills();
    expect(skills.map((s) => s.name)).toEqual(['ap-preset-authoring', 'ap-preset-design', 'ap-preset-testing']);
    for (const s of skills) {
      expect(s.dir.endsWith(s.name)).toBe(true);
      expect(s.description.length).toBeGreaterThan(50);
      expect(s.description.length).toBeLessThanOrEqual(1024);
      expect(s.name).toMatch(/^[a-z0-9-]{1,64}$/);
    }
  });

  it('parses frontmatter', () => {
    expect(parseSkillFrontmatter('---\nname: x\ndescription: "a: b"\n---\nbody')).toEqual({ name: 'x', description: 'a: b' });
    expect(parseSkillFrontmatter('no frontmatter')).toEqual({});
  });

  it('is in sync with docs/', () => {
    expect(() => execFileSync('node', [join(ROOT, 'scripts/sync-skills.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
  });

  it('contains no template placeholders (init would rewrite them)', () => {
    for (const f of walk(SKILLS_SOURCE)) expect(readFileSync(f, 'utf8'), f).not.toMatch(/__[A-Z_]+__/);
  });

  it('has no broken relative links', () => {
    for (const f of walk(SKILLS_SOURCE).filter((f) => f.endsWith('.md'))) {
      const text = readFileSync(f, 'utf8').replace(/```[\s\S]*?```/g, '');
      for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        const link = m[1];
        if (/^(https?:|#|mailto:)/.test(link)) continue;
        const path = resolve(dirname(f), link.split('#')[0]);
        expect(existsSync(path), `${f} → ${link}`).toBe(true);
      }
    }
  });
});

describe('installSkills', () => {
  it('installs, reports up to date, updates, and leaves other skills alone', async () => {
    const target = join(tmp(), '.agents/skills');
    mkdirSync(join(target, 'my-skill'), { recursive: true });
    writeFileSync(join(target, 'my-skill/SKILL.md'), 'mine');

    const first = await installSkills(target);
    expect(first.every((r) => r.status === 'installed')).toBe(true);
    expect(existsSync(join(target, 'ap-preset-authoring/references/manifest.md'))).toBe(true);

    expect((await installSkills(target)).every((r) => r.status === 'up to date')).toBe(true);

    writeFileSync(join(target, 'ap-preset-design/SKILL.md'), 'edited');
    writeFileSync(join(target, 'ap-preset-testing/stale.md'), 'stale');
    const third = await installSkills(target);
    expect(Object.fromEntries(third.map((r) => [r.name, r.status]))).toEqual({
      'ap-preset-authoring': 'up to date',
      'ap-preset-design': 'updated',
      'ap-preset-testing': 'updated',
    });
    expect(readFileSync(join(target, 'ap-preset-design/SKILL.md'), 'utf8')).toBe(readFileSync(join(SKILLS_SOURCE, 'ap-preset-design/SKILL.md'), 'utf8'));
    expect(existsSync(join(target, 'ap-preset-testing/stale.md'))).toBe(false);
    expect(readFileSync(join(target, 'my-skill/SKILL.md'), 'utf8')).toBe('mine');
    rmSync(dirname(dirname(target)), { recursive: true, force: true });
  });
});

describe('init', () => {
  it('scaffolds a repo with skills, AGENTS.md and placeholders filled', async () => {
    const dir = join(tmp(), 'my-preset');
    await init({ dir, id: 'my-preset', name: 'My Preset', author: 'me' });
    expect(existsSync(join(dir, '.gitignore'))).toBe(true);
    expect(existsSync(join(dir, '.github/workflows/build.yml'))).toBe(true);
    expect(readFileSync(join(dir, 'AGENTS.md'), 'utf8')).toContain('My Preset');
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    expect(pkg.name).toBe('my-preset');
    expect(pkg.scripts.skills).toBe('ap skills install');
    for (const f of walk(dir)) expect(readFileSync(f, 'utf8'), f).not.toMatch(/__(PRESET_ID|PRESET_NAME|AUTHOR|CLI_VERSION)__/);
    // A freshly initialised repo already has the current skills.
    expect((await installSkills(join(dir, '.agents/skills'))).every((r) => r.status === 'up to date')).toBe(true);
    rmSync(dirname(dir), { recursive: true, force: true });
  });
});
