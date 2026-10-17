import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
// @ts-expect-error plain ESM helper shared with scripts/write-build-id.mjs
import { computeBuildId } from './scripts/build-id.mjs';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@advanced-preset/protocol': fileURLToPath(new URL('./packages/protocol/src/index.ts', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __AP_BUILD_ID__: JSON.stringify(computeBuildId()),
    __AP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '1.0.0'),
    __VUE_OPTIONS_API__: 'false',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'style',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
