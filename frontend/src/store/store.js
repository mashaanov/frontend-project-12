import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice.js';
import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messagesSlice.js';
import modalReducer from './slices/modalSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    channelsState: channelsReducer,
    messagesState: messagesReducer,
    modal: modalReducer,
  },
});

export default store;
