import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,png,svg}'],
      },
      manifest: {
        name: 'PWA App',
        short_name: 'PWA App',
        theme_color: '#ffffff',
        icons: [
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192"
          },
        ],
      }
    })
  ],
})