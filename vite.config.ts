/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/slalom/',
  server: {
    port: 3000,
  },
  build: {
    // Ensure all assets get content hashes for cache busting
    rollupOptions: {
      output: {
        // Include content hash in entry file names
        entryFileNames: 'assets/[name]-[hash].js',
        // Include content hash in chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        // Include content hash in asset file names (CSS, images, etc.)
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
