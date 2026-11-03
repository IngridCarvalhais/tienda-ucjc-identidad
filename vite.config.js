import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/tienda-ucjc-identidad/',
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input: {
        index: resolve(root, 'index.html'),
        remote: resolve(root, 'src/ucjc-identidad.js'),
      },
      output: {
        entryFileNames: (chunk) => (
          chunk.name === 'remote' ? 'remote.js' : 'assets/[name]-[hash].js'
        ),
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
