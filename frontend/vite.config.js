import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        // Проксируем все запросы
        changeOrigin: true,
        target: 'http://localhost:5001',
      }
    }
  }
})
