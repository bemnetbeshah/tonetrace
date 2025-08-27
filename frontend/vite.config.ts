import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/design-system': path.resolve(__dirname, './src/design-system'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}) 