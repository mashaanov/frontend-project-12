import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { io } from "socket.io-client";
import Rollbar from "rollbar";
import leoProfanity from "leo-profanity";
import translationRU from "./locales/ru";

const SOCKET_URL = "wss://frontend-project-12-38ag.onrender.com/";

const init = async () => {
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
  const socket = io(SOCKET_URL, { withCredentials: true });

  socket.on("connect", () => {
    console.log("✅ WebSocket подключён, ID сокета:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Ошибка подключения к WebSocket:", error);
    rollbar.error("WebSocket connection error", error);
  });

  // Возвращаем все зависимости
  return { i18n, rollbar, socket, leoProfanity };
};

export default init;
