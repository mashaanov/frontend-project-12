import React, { Suspense, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './src/store/store.js';
import './index.scss';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import init from './src/init.js';

const App = React.lazy(() => import('./src/App.jsx'));

const RootComponent = () => {
  const [dependencies, setDependencies] = useState(null);

  useEffect(() => {
    // Запускаем инициализацию и сохраняем зависимости
    init(store.dispatch).then(setDependencies);
  }, []);

  // Пока зависимости не загружены, показываем спиннер
  if (!dependencies) {
    return (
      <div className='center-spinner'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Когда зависимости загружены, рендерим приложение
  return (
    <Provider store={store}>
      <Suspense
        fallback={
          <div className='center-spinner'>
            <Spinner animation='border' role='status' />
          </div>
        }
      >
        <App dependencies={dependencies} />
      </Suspense>
    </Provider>
  );
};

// Рендерим RootComponent в DOM
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);