import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
await build({
  entryPoints: ['src/cli.ts'],
  outfile: 'dist/ap.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  banner: { js: "#!/usr/bin/env node\nimport { createRequire as __apCreateRequire } from 'node:module';\nconst require = __apCreateRequire(import.meta.url);" },
  mainFields: ['module', 'main'],
  define: { __AP_VERSION__: JSON.stringify(pkg.version) },
  alias: { '@advanced-preset/protocol': fileURLToPath(new URL('../protocol/src/index.ts', import.meta.url)) },
  legalComments: 'none',
  logLevel: 'info',
});
