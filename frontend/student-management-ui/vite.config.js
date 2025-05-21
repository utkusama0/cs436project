import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // This lets you call fetch("/api/…") in production **and**
  // use Vite’s proxy during `npm run dev`.
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // ignored in prod build
    },
  },
});
