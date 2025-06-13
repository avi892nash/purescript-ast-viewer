import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
    mimeTypes: {
      // Ensure .wasm files are served with the correct MIME type
      '.wasm': 'application/wasm',
    },
  },
  optimizeDeps: {
    exclude: ['web-tree-sitter'] // To prevent Vite from trying to pre-bundle it in a way that might break WASM loading
  }
});
