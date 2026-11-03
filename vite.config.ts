/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), loadVersion()],
  optimizeDeps: {
    include: ['react-aria > use-sync-external-store/shim/index.js'],
  },
  resolve: {
    // this is only applicable when pnpm-linking the utah-design-package
    // dedupe: ['firebase', '@arcgis/core', 'react', 'react-dom'],
  },
  test: {
    environment: 'happy-dom',
    include: ['./src/**/*.test.{ts,tsx}'],
  },
});
