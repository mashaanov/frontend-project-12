/* eslint-disable sort-keys */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import routes from "../../routes.js";

const getData = async (path) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Токен отсутствует!");
    return Promise.reject("Требуется авторизация");
  }

  console.log("Отправляем запрос на:", path); // Логируем путь запроса

  try {
    const res = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ответ от сервера при получении данных:", res); // Логируем ответ
    return res;
  } catch (e) {
    console.error("Ошибка при запросе:", e); // Логируем ошибку
    return Promise.reject(e);
  }
};

export const fetchChannels = createAsyncThunk(
  "chat/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getData(routes.getChannels());
      return res.data;
    } catch (e) {
      console.error("Ошибка загрузки каналов:", e);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка загрузки каналов"
      );
    }
  }
);

export const addChannel = createAsyncThunk(
  "chat/addChannel",
  async (channelName, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const newChannelName = { name: channelName };
      const res = await axios.post(routes.addChannel(), newChannelName, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Ответ от сервера:", res.data);
      return res.data;
    } catch (e) {
      console.error("Ошибка создания канала:", e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка создания канала"
      );
    }
  }
);

export const renameChannel = createAsyncThunk(
  "chat/renameChannel",
  async ({ name, channelId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const renamedChannel = { name };
      const res = await axios.patch(
        routes.renameChannel(channelId),
        renamedChannel,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Ответ от сервера:", res.data);
      return res.data;
    } catch (e) {
      console.error("Ошибка редактирования канала:", e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка редактирования канала"
      );
    }
  }
);

export const removeChannel = createAsyncThunk(
  "chat/removeChannel",
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(routes.removeChannel(channelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Ответ от сервера:", res.data);
      return channelId;
    } catch (e) {
      console.error("Ошибка удаления канала:", e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка удаления канала"
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getData(routes.getMessages());
      return res.data;
    } catch (e) {
      console.error("Ошибка получения сообщений", e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка получения сообщений"
      );
    }
  }
);

export const addMessage = createAsyncThunk(
  "chat/sendMessage",
  async (newMessage, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(routes.addMessage(), newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Ответ сервера:", res.data);
      return res.data;
    } catch (e) {
      console.error("Ошибка добавления сообщения", e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка добавления канала"
      );
    }
  }
);

export const removeMessage = createAsyncThunk(
  "chat/removeMessage",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(routes.removeMessage(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Ответ сервера:", res.data);
      return res.data;
    } catch (e) {
      console.error("Ошибка удаления сообщения", e.response?.data);
      return rejectWithValue(
        e.response?.data?.message || "Ошибка удаления канала"
      );
    }
  }
);

const initialState = {
  channels: {
    entities: { 1: { id: 1, name: "general", removable: false } },
    ids: [1],
  },
  messages: {
    byChannelId: {
      1: [],
    },
  },
  activeChannelId: 1,
  status: "idle",
  errors: {
    fetchChannelsError: null,
    addChannelError: null,
    renameChannelError: null,
    removeChannelError: null,
    addMessageError: null,
    fetchMessagesError: null,
    removeMessageError: null,
  },
  isInitialized: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload;
    },
    clearMessages: (state) => {
      state.messages = { entities: {}, ids: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = "loading";
        state.errors.fetchChannelsError = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = "succeeded";
        const channels = action.payload || [];
        state.channels.entities = Object.fromEntries(
          channels.map((channel) => [channel.id, channel])
        );
        state.channels.ids = channels.map((channel) => channel.id);
        state.isInitialized = true;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = "failed";
        state.errors.fetchChannelsError = {
          message: action.payload || "Ошибка загрузки каналов",
          timestamp: Date.now(),
        };
        state.isInitialized = false;
      })

      .addCase(addChannel.pending, (state) => {
        state.status = "loading";
        state.errors.addChannelError = null;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.errors.addChannelError = null;
        const newChannel = action.payload;

        const isDuplicateId = state.channels.ids.includes(newChannel.id);
        const isDuplicateName = state.channels.ids.some(
          (id) => state.channels.entities[id].name === newChannel.name
        );

        if (!isDuplicateId && !isDuplicateName) {
          state.channels.entities[newChannel.id] = newChannel;
          state.channels.ids.push(newChannel.id);
        } else {
          state.errors.addChannelError = {
            message: "Канал с таким именем или ID уже существует",
            timestamp: Date.now(),
          };
        }
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.status = "failed";
        state.errors.addChannelError = {
          message: action.payload || "Ошибка создания канала",
          timestamp: Date.now(),
        };
      })

      .addCase(renameChannel.pending, (state) => {
        state.status = "loading";
        state.errors.renameChannelError = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const renamedChannel = action.payload;
        if (state.channels.entities[renamedChannel.id]) {
          state.channels.entities[renamedChannel.id].name = renamedChannel.name;
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.status = "failed";
        state.errors.renameChannelError = {
          message: action.payload || "Ошибка переименования канала",
          timestamp: Date.now(),
        };
      })

      .addCase(removeChannel.pending, (state) => {
        state.status = "loading";
        state.errors.removeChannelError = null;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedChannelId = action.payload;

        // Удаляем канал
        delete state.channels.entities[removedChannelId];
        state.channels.ids = state.channels.ids.filter(
          (id) => id !== removedChannelId
        );

        // Удаляем сообщения для этого канала
        delete state.messages.byChannelId[removedChannelId];

        // Если активный канал был удалён, переключаемся на канал по умолчанию
        if (state.activeChannelId === removedChannelId) {
          state.activeChannelId = 1; // или другой канал по умолчанию
        }
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.status = "failed";
        state.errors.removeChannelError = {
          message: action.payload || "Ошибка удаления канала",
          timestamp: Date.now(),
        };
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newMessage = action.payload;
        const { channelId } = newMessage;

        // Если канала ещё нет в структуре, создаём его
        if (!state.messages.byChannelId[channelId]) {
          state.messages.byChannelId[channelId] = [];
        }

        // Добавляем сообщение в массив для соответствующего канала
        state.messages.byChannelId[channelId].push(newMessage);
        state.errors.addMessageError = null;
      })
      .addCase(addMessage.pending, (state) => {
        state.status = "loading";
        state.errors.addMessageError = null;
      })

      .addCase(addMessage.rejected, (state, action) => {
        state.status = "failed";
        state.errors.addMessageError = {
          message: action.payload?.message || "Ошибка добавления сообщения",
          timestamp: Date.now(),
        };
      })

      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.errors.fetchMessagesError = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        const messages = action.payload || [];

        // Группируем сообщения по channelId
        const messagesByChannelId = messages.reduce((acc, msg) => {
          if (!acc[msg.channelId]) {
            acc[msg.channelId] = [];
          }
          acc[msg.channelId].push(msg);
          return acc;
        }, {});

        // Сохраняем сообщения в структуре byChannelId
        state.messages.byChannelId = messagesByChannelId;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.errors.fetchMessagesError = {
          message: action.payload || "Ошибка получения сообщений",
          timestamp: Date.now(),
        };
      })
      .addCase(removeMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedMessageId = action.payload.id; // Извлекаем id из ответа сервера

        for (const channelId in state.messages.byChannelId) {
          state.messages.byChannelId[channelId] = state.messages.byChannelId[
            channelId
          ].filter((msg) => msg.id !== removedMessageId);
        }
      })
      .addCase(removeMessage.pending, (state) => {
        state.status = "pending";
        state.errors.removeMessageError = null;
      })
      .addCase(removeMessage.rejected, (state, action) => {
        state.status = "failed";
        state.errors.removeMessageError = {
          message: action.payload || "Ошибка удаления сообщения",
          timestamp: Date.now(),
        };
      });
  },
});

export const { setActiveChannel, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
