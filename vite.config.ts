import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { markdownLitPlugin } from './vite-plugin-markdown-lit';

export default defineConfig({
  plugins: [
    tailwindcss(),
    markdownLitPlugin(),
  ],
});
