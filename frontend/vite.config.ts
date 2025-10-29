import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    // Set default API base URL untuk development
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://localhost:3000/api')
  },
  server: {
    port: 5173,
    host: true
  }
})
