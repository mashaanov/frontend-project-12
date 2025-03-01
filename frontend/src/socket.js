import { io } from "socket.io-client";

const SOCKET_URL = "https://frontend-project-12-38ag.onrender.com/";
export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ WebSocket подключён, ID сокета:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ Ошибка подключения к WebSocket:", error);
});