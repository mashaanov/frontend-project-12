import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      // Проксируем запросы к API
      '/api': {
        target: 'http://localhost:5001',
      },
      // Проксируем WebSocket соединения
      '/socket.io': {
        target: 'ws://localhost:5001',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});
/* Браузеры блокируют запросы с одного домена (например, http://localhost:5002)
// к другому (например, http://localhost:5001),
// если сервер не настроен для разрешения этих запросов.
// Проксирование устраняет эту проблему, так как запросы к /api воспринимаются как локальные.
// */
