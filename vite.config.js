import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { resolve } from 'node:path';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'index.html',
        admin: 'admin.html',
        login: 'login.html'
      }
    }
  },
  plugins: [
    sitemap({
      hostname: 'https://aadham5790.github.io/AdamHaneef/',
      routes: ['/', '/#about', '/#skills', '/#experience', '/#education', '/#projects', '/#community', '/#contact'],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }),
    {
      name: 'copy-assets',
      closeBundle() {
        const srcImages = resolve('assets/images');
        const destImages = resolve('dist/assets/images');
        if (existsSync(srcImages)) {
          cpSync(srcImages, destImages, { recursive: true });
        }
        const srcData = resolve('assets/data');
        const destData = resolve('dist/assets/data');
        if (existsSync(srcData)) {
          cpSync(srcData, destData, { recursive: true });
        }
      }
    }
  ],
  define: {
    __ADMIN_HASH__: JSON.stringify(process.env.ADMIN_HASH || '')
  }
});