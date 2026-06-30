import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  base: '/thee13fitness/',
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://gajjubhaih.github.io/thee13fitness',
      dynamicRoutes: [
        '/login',
        '/signup',
        '/checkout',
        '/dashboard',
        '/admin',
        '/store'
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          charts: ['recharts'],
        },
      },
    },
  },
})
