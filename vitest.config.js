import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: 'tests/unit/setup-file.js',
    include: [
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      include: ['src/**/*.js', 'src/**/*.vue'],
      extension: ['.js', '.vue'],
      enabled: true,
      provider: 'v8',
      reporter: [
        ['lcov', { projectRoot: './src' }],
        ['json', { file: 'coverage.json' }],
        ['text'],
      ],
      perFile: true,
      all: true,
      reportsDirectory: './reports',
    },
    globals: true,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/quasar-variables.scss',
    }),
    jsconfigPaths(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});
