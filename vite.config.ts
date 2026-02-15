import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/homepage/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        works: path.resolve(__dirname, 'works/index.html'),
        youtube: path.resolve(__dirname, 'youtube/index.html'),
        records: path.resolve(__dirname, 'records/index.html'),
      },
    },
  },
})
