/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import log from 'loglevel';

import routes from '../../routes.js';
log.setLevel('warn');

export const addMessage = createAsyncThunk(
  'chat/sendMessage',
  async (newMessage, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(routes.addMessage(), newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      log.error('Ошибка добавления сообщения', e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || 'Ошибка добавления канала',
      );
    }
  },
);

export const removeMessage = createAsyncThunk(
  'chat/removeMessage',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(routes.removeMessage(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      log.error('Ошибка удаления сообщения', e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || 'Ошибка удаления канала',
      );
    }
  },
);

const initialState = {
  messages: {
    byChannelId: {
      1: [],
    },
  },
  status: 'idle',
  errors: {
    addMessageError: null,
    fetchMessagesError: null,
    removeMessageError: null,
  },
  isInitialized: false,
};

const messagesSlice = createSlice({
  name: 'messagesState',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = { entities: {}, ids: [] };
    },
    appendMessage: (state, action) => {
      const newMessage = action.payload;
      const { channelId } = newMessage;
      if (!state.messages.byChannelId[channelId]) {
        state.messages.byChannelId[channelId] = [];
      }
      state.messages.byChannelId[channelId].push(action.payload);
    },
    clearMessagesByChannel: (channelId) => {
      if (state.messages.byChannelId[channelId]) {
        delete state.messages.byChannelId[channelId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMessage.fulfilled, (state) => {
        state.status = 'succeeded';
        state.errors.addMessageError = null;
      })
      .addCase(addMessage.pending, (state) => {
        state.status = 'loading';
        state.errors.addMessageError = null;
      })

      .addCase(addMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.errors.addMessageError = {
          message: action.payload?.message || 'Ошибка добавления сообщения',
          timestamp: Date.now(),
        };
      })

      .addCase(removeMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const removedMessageId = action.payload.id;

        Object.keys(state.messages.byChannelId).forEach((channelId) => {
          state.messages.byChannelId[channelId] = state.messages.byChannelId[
            channelId
          ].filter((msg) => msg.id !== removedMessageId);
        });
      })
      .addCase(removeMessage.pending, (state) => {
        state.status = 'pending';
        state.errors.removeMessageError = null;
      })
      .addCase(removeMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.errors.removeMessageError = {
          message: action.payload || 'Ошибка удаления сообщения',
          timestamp: Date.now(),
        };
      });
  },
});

export const { clearMessages, appendMessage, clearMessagesByChannel } = messagesSlice.actions;
export default messagesSlice.reducer;
