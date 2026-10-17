import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: { '@advanced-preset/protocol': fileURLToPath(new URL('./packages/protocol/src/index.ts', import.meta.url)) },
  },
  test: {
    include: ['packages/*/test/**/*.test.ts', 'test/**/*.test.ts'],
    environment: 'node',
  },
});
