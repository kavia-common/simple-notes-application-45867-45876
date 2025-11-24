import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Conservative settings to maximize Node 18 compatibility in CI
    target: 'es2019',
    cssTarget: 'es2019',
    sourcemap: false,
    minify: 'esbuild',
  },
});
