import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const projectRoot = __dirname;

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
      '@alt-platform/ui': path.resolve(projectRoot, '../../packages/ui/src'),
      clsx: path.resolve(projectRoot, 'node_modules/clsx'),
    },
  },
  optimizeDeps: {
    include: ['@alt-platform/ui', 'clsx'],
  },
  server: {
    host: true,
    port: Number(process.env.VITE_PORT ?? 5173),
    strictPort: true,
    hmr: {
      host: 'localhost',
      clientPort: Number(process.env.VITE_PORT ?? 5173),
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
    fs: {
      allow: [
        path.resolve(projectRoot),
        path.resolve(projectRoot, '..'),
        path.resolve(projectRoot, '../../'),
        path.resolve(projectRoot, '../../packages/ui'),
      ],
    },
  },
  build: {
    outDir: 'dist',
  },
});
