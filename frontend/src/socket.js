// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "wss://frontend-project-12-38ag.onrender.com";

const initSocket = (dispatch) => {
  const socket = io(SOCKET_URL, { withCredentials: true });

  socket.on("connect", () => {
    console.log("✅ WebSocket подключён, ID сокета:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Ошибка подключения к WebSocket:", error);
  });

  // Слушатель для события новых сообщений
  socket.on("newMessage", () => {
    console.log("Получено событие: обновление сообщений");
    dispatch(fetchMessages());
  });

  // Слушатель для события нового канала
  socket.on("newChannel", () => {
    console.log("Получено событие: новый канал");
    dispatch(fetchChannels());
  });

  // Слушатель для события переименования канала
  socket.on("renameChannel", () => {
    console.log("Получено событие: канал переименован");
    dispatch(fetchChannels());
  });

  // Слушатель для события удаления канала
  socket.on("removeChannel", () => {
    console.log("Получено событие: канал удалён");
    dispatch(fetchChannels());
  });

  return socket;
};

export default initSocket;
