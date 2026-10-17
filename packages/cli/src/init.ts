/** `ap init <dir>`: scaffold a preset from the bundled template. */
import { cp, mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface InitOptions {
  dir: string;
  id: string;
  name: string;
  author: string;
}

const TEMPLATE = fileURLToPath(new URL('../template', import.meta.url));

async function* files(dir: string): AsyncGenerator<string> {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) yield* files(p);
    else yield p;
  }
}

export async function init(o: InitOptions): Promise<void> {
  const exists = await stat(join(o.dir, 'preset.yaml')).then(() => true, () => false);
  if (exists) throw new Error(`${o.dir} already contains a preset.yaml`);
  await mkdir(o.dir, { recursive: true });
  await cp(TEMPLATE, o.dir, { recursive: true });
  for await (const f of files(o.dir)) {
    if (!/\.(ya?ml|md|json)$|gitignore$/.test(f)) continue;
    const src = await readFile(f, 'utf8');
    const out = src.replaceAll('__PRESET_ID__', o.id).replaceAll('__PRESET_NAME__', o.name).replaceAll('__AUTHOR__', o.author);
    if (out !== src) await writeFile(f, out);
  }
  // npm strips .gitignore from published packages, so the template ships it as `gitignore`.
  const gi = join(o.dir, 'gitignore');
  if (await stat(gi).then(() => true, () => false)) await rename(gi, join(o.dir, '.gitignore'));
}
