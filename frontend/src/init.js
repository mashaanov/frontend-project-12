import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { io } from "socket.io-client";
import Rollbar from "rollbar";
import leoProfanity from "leo-profanity";
import translationRU from "./locales/ru";
import { fetchChannels } from "./store/slices/chatSlice.js";
import { fetchMessages } from "./store/slices/chatSlice.js";

const init = async (dispatch) => {
  // 1. Инициализация i18n (локализация)
  await i18n.use(initReactI18next).init({
    resources: {
      ru: {
        translation: translationRU,
      },
    },
    lng: "ru",
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
  });
  console.log("✅ Локализация i18n инициализирована");

  // 2. Инициализация Rollbar для логирования ошибок
  const rollbar = new Rollbar({
    accessToken: "6b20a85d609b4f5f828ebc6a32158aa1",
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: "testenv",
  });
  console.log("✅ Rollbar инициализирован");

  // 3. Настройка фильтрации сообщений (цензура)
  leoProfanity.add(leoProfanity.getDictionary("ru"));
  console.log("✅ Фильтр ненормативной лексики активирован");

  // 4. Настройка WebSocket
  const socket = io();

  socket.on("connect", () => {
    console.log("✅ WebSocket подключён, ID сокета:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Ошибка подключения к WebSocket:", error);
    rollbar.error("WebSocket connection error", error);
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

  // Возвращаем все зависимости
  return { i18n, rollbar, socket, leoProfanity };
};

export default init;
