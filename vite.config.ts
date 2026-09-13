import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// Fully static export: no server bindings, database, or hosted runtime.
export default defineConfig({
  base: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`,
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
  server: { host: '127.0.0.1', port: 6699, strictPort: true },
  preview: { host: '127.0.0.1', port: 6699, strictPort: true },
});
