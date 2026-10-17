// Writes dist/build.json with the content-derived build id (must match the id embedded by vite.config.ts).
import { writeFileSync } from 'node:fs';
import { computeBuildId } from './build-id.mjs';

const id = computeBuildId();
writeFileSync(new URL('../dist/build.json', import.meta.url), JSON.stringify({ id }, null, 2) + '\n');
console.log(`build id ${id}`);
