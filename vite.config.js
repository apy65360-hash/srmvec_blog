import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const rootDir = process.cwd();

// Discover all HTML entry points in the root directory dynamically
const htmlFiles = fs.readdirSync(rootDir)
  .filter(file => file.endsWith('.html'));

const input = {};
htmlFiles.forEach(file => {
  const name = file.replace(/\.html$/, '').replace(/[^a-zA-Z0-9]/g, '_');
  input[name] = resolve(rootDir, file);
});

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input,
    },
  },
});