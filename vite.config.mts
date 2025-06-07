import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tsconfigPaths({ projects: ['./tsconfig.json'] }),
      angular(),
    ],
    resolve: {
      alias: {
        '@environments': path.resolve(__dirname, 'src/environments'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@core': path.resolve(__dirname, 'src/app/core'),
        '@feat': path.resolve(__dirname, 'src/app/features'),
        '@shared': path.resolve(__dirname, 'src/app/shared'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
