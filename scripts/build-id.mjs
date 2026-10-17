// Content-derived build id: identical sources ⇒ identical id. Embedded into the bundle and written to
// dist/build.json; at runtime a mismatch means the files on disk are newer than the running code (§17).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'packages/protocol/src', 'i18n', 'dist/presets', 'package.json'];

function walk(p, out) {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) for (const f of readdirSync(p).sort()) walk(join(p, f), out);
  else out.push(p);
}

export function computeBuildId(root = process.cwd()) {
  const files = [];
  for (const r of ROOTS) walk(join(root, r), files);
  const h = createHash('sha256');
  for (const f of files.sort()) {
    h.update(relative(root, f).replaceAll('\\', '/'));
    h.update('\0');
    h.update(readFileSync(f));
    h.update('\0');
  }
  return h.digest('hex').slice(0, 16);
}
