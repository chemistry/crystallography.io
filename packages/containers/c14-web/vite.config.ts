import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/frontend',
      filename: 'service-worker.ts',
      injectRegister: false,
      manifest: {
        short_name: 'COD Search',
        name: 'Crystal Structure Search',
        description: 'Crystal Structure Search Online',
        icons: [
          { src: 'icon-48.png', type: 'image/png', sizes: '48x48' },
          { src: 'icon-96.png', type: 'image/png', sizes: '96x96' },
          { src: 'icon-192.png', type: 'image/png', sizes: '192x192' },
          { src: 'icon-512.png', type: 'image/png', sizes: '512x512' },
        ],
        background_color: '#F4F6F9',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0E4575',
        scope: '/',
      },
    }),
  ],
  define: {
    'process.env.BROWSER': 'true',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    outDir: 'dist/static',
    sourcemap: true,
    manifest: 'manifest.json',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
