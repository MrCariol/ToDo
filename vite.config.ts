import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Deve corrispondere al nome del repository: l'app è pubblicata su GitHub Pages
  // all'indirizzo https://<utente>.github.io/ToDo/
  base: '/ToDo/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ToDo',
        short_name: 'ToDo',
        description: 'Gestione attività locale con task ricorrenti, vista Oggi e liste personalizzate',
        lang: 'it',
        start_url: '/ToDo/',
        scope: '/ToDo/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d6efd',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
