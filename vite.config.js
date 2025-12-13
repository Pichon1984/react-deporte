import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      '/api': 'http://localhost:3000', // 👈 redirige las llamadas al backend
    },
  },
});

