/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/loop-conductor',

  server: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths()],
});
