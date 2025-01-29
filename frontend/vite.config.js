import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      "/api": {
        target: "http://localhost:5001", // куда перенаправить запрос
      },
    },
  },
});

/* Браузеры блокируют запросы с одного домена (например, http://localhost:5002) к другому (например, http://localhost:5001), 
// если сервер не настроен для разрешения этих запросов. Проксирование устраняет эту проблему, так как запросы к /api воспринимаются как локальные. 
// */
