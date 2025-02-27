import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5002"; // Проверь, что сервер действительно работает на этом адресе
export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ WebSocket подключён, ID сокета:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ Ошибка подключения к WebSocket:", error);
});