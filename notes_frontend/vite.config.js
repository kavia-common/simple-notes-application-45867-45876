import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config
 * - Designed to work with Node 18.20.x by pinning vite@5 and @vitejs/plugin-react@4
 * - Dev/preview default to port 3000 and host 0.0.0.0 to match CI invocation
 */
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow explicit host/port to be provided via npm scripts
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
  build: {
    // Conservative settings to maximize Node 18 compatibility in CI
    target: 'es2019',
    cssTarget: 'es2019',
    sourcemap: false,
    minify: 'esbuild',
  },
  optimizeDeps: {
    // Ensure deps are prebundled with esbuild suitable for Node 18
    esbuildOptions: {
      target: 'es2019',
    },
  },
});
