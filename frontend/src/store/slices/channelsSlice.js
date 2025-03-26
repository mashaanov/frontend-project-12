/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import log from 'loglevel';

import routes from '../../routes.js';

log.setLevel('warn');
const getData = async (path) => {
  const token = localStorage.getItem('token');
  if (!token) {
    log.error('Токен отсутствует!');
    return Promise.reject(new Error('Требуется авторизация'));
  }

  try {
    const res = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    log.error('Ошибка при запросе:', e);
    return Promise.reject(e);
  }
};

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getData(routes.getChannels());
      return res.data;
    } catch (e) {
      log.error('Ошибка загрузки каналов:', e);
      return rejectWithValue(
        e.response?.data?.message || 'Ошибка загрузки каналов',
      );
    }
  },
);

export const addChannel = createAsyncThunk(
  'chat/addChannel',
  async (channelName, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const newChannelName = { name: channelName };
      const res = await axios.post(routes.addChannel(), newChannelName, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      log.error('Ошибка создания канала:', e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || 'Ошибка создания канала',
      );
    }
  },
);

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ name, channelId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const renamedChannel = { name };
      const res = await axios.patch(
        routes.renameChannel(channelId),
        renamedChannel,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (e) {
      log.error('Ошибка редактирования канала:', e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || 'Ошибка редактирования канала',
      );
    }
  },
);

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(routes.removeChannel(channelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return channelId;
    } catch (e) {
      log.error('Ошибка удаления канала:', e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || 'Ошибка удаления канала',
      );
    }
  },
);

const initialState = {
  channels: {
    entities: { 1: { id: 1, name: 'general', removable: false } },
    ids: [1],
  },
  activeChannelId: 1,
  status: 'idle',
  errors: {
    fetchChannelsError: null,
    addChannelError: null,
    renameChannelError: null,
    removeChannelError: null,
  },
  isInitialized: false,
};

const channelsSlice = createSlice({
  name: 'channelsState',
  initialState,
  reducers: {
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload;
    },
    getActiveChannel: () => state.activeChannelId,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
        state.errors.fetchChannelsError = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const channels = action.payload || [];
        state.channels.entities = Object.fromEntries(
          channels.map((channel) => [channel.id, channel]),
        );
        state.channels.ids = channels.map((channel) => channel.id);
        state.isInitialized = true;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.errors.fetchChannelsError = {
          message: action.payload || 'Ошибка загрузки каналов',
          timestamp: Date.now(),
        };
        state.isInitialized = false;
      })

      .addCase(addChannel.pending, (state) => {
        state.status = 'loading';
        state.errors.addChannelError = null;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.errors.addChannelError = null;
        const newChannel = action.payload;

        const isDuplicateId = state.channels.ids.includes(newChannel.id);
        const isDuplicateName = state.channels.ids.some(
          (id) => state.channels.entities[id].name === newChannel.name,
        );

        if (!isDuplicateId && !isDuplicateName) {
          state.channels.entities[newChannel.id] = newChannel;
          state.channels.ids.push(newChannel.id);
        } else {
          state.errors.addChannelError = {
            message: 'Канал с таким именем или ID уже существует',
            timestamp: Date.now(),
          };
        }
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.errors.addChannelError = {
          message: action.payload || 'Ошибка создания канала',
          timestamp: Date.now(),
        };
      })

      .addCase(renameChannel.pending, (state) => {
        state.status = 'loading';
        state.errors.renameChannelError = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const renamedChannel = action.payload;
        if (state.channels.entities[renamedChannel.id]) {
          state.channels.entities[renamedChannel.id].name = renamedChannel.name;
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.errors.renameChannelError = {
          message: action.payload || 'Ошибка переименования канала',
          timestamp: Date.now(),
        };
      })

      .addCase(removeChannel.pending, (state) => {
        state.status = 'loading';
        state.errors.removeChannelError = null;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const removedChannelId = action.payload;

        delete state.channels.entities[removedChannelId];
        state.channels.ids = state.channels.ids.filter(
          (id) => id !== removedChannelId,
        );

        if (state.activeChannelId === removedChannelId) {
          state.activeChannelId = 1;
        }
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.errors.removeChannelError = {
          message: action.payload || 'Ошибка удаления канала',
          timestamp: Date.now(),
        };
      });
  },
});

export const {
  setActiveChannel,
  clearMessages,
  appendMessage,
  getActiveChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
