import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@': resolve(__dirname, './src/'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
