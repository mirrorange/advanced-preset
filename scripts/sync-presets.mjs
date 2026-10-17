// Copies the locked built-in preset artifacts into dist/presets (D24) and writes the index.
import { readdirSync, copyFileSync, writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const sources = (process.argv.slice(2).length ? process.argv.slice(2) : ['../petals-preset/dist']).map((p) => resolve(p));
const out = resolve('dist/presets');
mkdirSync(out, { recursive: true });
const index = [];
for (const dir of sources) {
  if (!existsSync(dir)) { console.warn(`skip ${dir} (missing)`); continue; }
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.apreset.json'))) {
    copyFileSync(join(dir, f), join(out, f));
    const a = JSON.parse(readFileSync(join(out, f), 'utf8'));
    index.push({ file: f, id: a.id, version: a.version, hash: a.hash });
    console.log(`${a.id}@${a.version} (${a.hash})`);
  }
}
writeFileSync(join(out, 'index.json'), JSON.stringify(index, null, 2) + '\n');
