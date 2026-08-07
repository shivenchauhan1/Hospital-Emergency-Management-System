import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './patient-portal',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
