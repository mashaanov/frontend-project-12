import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      // Проксирование API-запросов
      "/api": {
        target: "http://localhost:4173",
        changeOrigin: true, // Изменение Origin-заголовка
      },
      // Проксирование WebSocket соединений
      "/socket.io": {
        target: "ws://localhost:4173",
        ws: true,
        changeOrigin: true, // Добавляем для корректной работы
      },
    },
  },
});
