/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), loadVersion()],
  optimizeDeps: {
    include: [
      'react-aria > use-sync-external-store/shim/index.js',
      '@arcgis/core/Basemap',
      '@arcgis/core/layers/support/LOD',
      '@arcgis/core/layers/TileLayer',
      '@arcgis/core/layers/VectorTileLayer',
    ],
  },
  test: {
    environment: 'happy-dom',
    include: ['./src/**/*.test.{ts,tsx}'],
  },
});
