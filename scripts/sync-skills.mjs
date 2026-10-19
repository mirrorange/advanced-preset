// Copies the docs that the bundled Agent Skills ship with into packages/cli/template/.agents/skills.
//   node scripts/sync-skills.mjs          write the copies
//   node scripts/sync-skills.mjs --check  exit 1 when a copy is stale (used by the tests)
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skills = join(root, 'packages/cli/template/.agents/skills');
const GUIDE_URL = 'https://github.com/mirrorange/advanced-preset/blob/main/docs/guide/';

/** Guide chapters link to siblings relatively; inside a skill those links must point at GitHub. */
function fromGuide(file) {
  const text = readFileSync(join(root, 'docs/guide', file), 'utf8')
    .replace(/\]\((?!https?:|#)([^)\s]+\.md(?:#[^)\s]*)?)\)/g, (_, link) => `](${GUIDE_URL}${link})`)
    .replace(/\n下一章：[^\n]*\n?$/, '');
  const [title, ...rest] = text.split('\n');
  return [title, '', `> 本文件由 \`docs/guide/${file}\` 生成（\`pnpm sync-skills\`），请勿直接修改。`, ...rest].join('\n');
}

/** target file (relative to the skills dir) → expected content */
export function expectedFiles() {
  const out = new Map();
  const refDir = join(root, 'docs/reference');
  for (const f of readdirSync(refDir).filter((f) => f.endsWith('.md')).sort()) {
    out.set(`ap-preset-authoring/references/${f}`, readFileSync(join(refDir, f), 'utf8'));
  }
  out.set('ap-preset-design/references/petals-case-study.md', fromGuide('13-petals-case-study.md'));
  return out;
}

const check = process.argv.includes('--check');
const expected = expectedFiles();
const stale = [];
for (const [rel, content] of expected) {
  const path = join(skills, rel);
  if (!existsSync(path) || readFileSync(path, 'utf8') !== content) stale.push(rel);
}
// Reference copies that no longer exist in docs/reference.
const refCopies = join(skills, 'ap-preset-authoring/references');
if (existsSync(refCopies)) {
  for (const f of readdirSync(refCopies)) {
    const rel = `ap-preset-authoring/references/${f}`;
    if (!expected.has(rel)) stale.push(`${rel} (removed)`);
  }
}

if (check) {
  if (stale.length) {
    console.error(`Agent Skills are out of sync with docs/ (run \`pnpm sync-skills\`):\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }
  console.log('✓ Agent Skills are in sync with docs/');
} else {
  rmSync(refCopies, { recursive: true, force: true });
  for (const [rel, content] of expected) {
    const path = join(skills, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  console.log(`✓ synced ${expected.size} files into ${skills}`);
}
