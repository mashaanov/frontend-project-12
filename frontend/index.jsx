import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import './index.scss';
/* eslint-disable no-trailing-spaces */

import Init from './src/init.jsx';

const run = async () => {
  const socket = io();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Init socket={socket} />
    </React.StrictMode>,
  );
};

run();
