import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationRU from "./locales/ru";

i18n
  .use(initReactI18next) // Инициализируем react-i18next
  .init({
    resources: {
      ru: {
        translation: translationRU, // Переводы для русского языка
      },
    },
    lng: "ru", // Язык по умолчанию
    fallbackLng: "ru", // Язык, используемый, если перевод не найден
    interpolation: {
      escapeValue: false, // Не экранировать HTML в переводах
    },
  });

export default i18n;