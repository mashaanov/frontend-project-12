import React, { Suspense, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import Rollbar from 'rollbar';
import { Spinner } from 'react-bootstrap';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import log from 'loglevel';

import store from './store/store.js';
import translationRU from './locales/ru.js';
import { fetchChannels } from './store/slices/channelsSlice.js';
import { appendMessage } from './store/slices/messagesSlice.js';

const App = React.lazy(() => import('./App.jsx'));
log.setLevel('info');

const initializeApp = async (socket) => {
  await i18n.use(initReactI18next).init({
    resources: { ru: { translation: translationRU } },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

  log.info('✅ Локализация i18n инициализирована');

  const rollbar = new Rollbar({
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: 'testenv',
  });

  log.info('✅ Rollbar инициализирован');

  leoProfanity.add(leoProfanity.getDictionary('ru'));
  log.info('✅ Фильтр ненормативной лексики активирован');

  socket.on('connect', () => {
    log.info('✅ WebSocket подключён, ID сокета:', socket.id);
  });

  socket.on('connect_error', (error) => {
    log.error('❌ Ошибка подключения к WebSocket:', error);
    rollbar.error('WebSocket connection error', error);
  });

  socket.on('newMessage', (msg) => {
    log.info('📩 Получено сообщение:', msg);
    store.dispatch(appendMessage(msg));
  });

  socket.on('newChannel', () => {
    log.info('📡 Новый канал добавлен');
    store.dispatch(fetchChannels());
  });

  socket.on('renameChannel', () => {
    log.info('🔄 Канал переименован');
    store.dispatch(fetchChannels());
  });

  socket.on('removeChannel', () => {
    log.info('🗑 Канал удалён');
    store.dispatch(fetchChannels());
  });

  return {
    rollbar,
    socket,
    leoProfanity,
    i18n,
  };
};

const Init = ({ socket }) => {
  const [dependencies, setDependencies] = useState(null);

  useEffect(() => {
    initializeApp(socket).then(setDependencies);
  }, [socket]);

  if (!dependencies) {
    return (
      <div className="center-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Suspense
        fallback={
          (
            <div className="center-spinner">
              <Spinner animation="border" role="status" />
            </div>
          )
        }
      >
        <App dependencies={dependencies} />
      </Suspense>
    </Provider>
  );
};

export default Init;
