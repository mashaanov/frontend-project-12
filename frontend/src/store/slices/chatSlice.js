/* eslint-disable sort-keys */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import routes from "../../routes.js";

const getData = async (path) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Пользователь не авторизован");
  const res = await axios.get(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchChannels = createAsyncThunk(
  "chat/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      return await getData(routes.getChannels());
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Ошибка загрузки каналов"
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      return await getData(routes.getMessages());
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Ошибка загрузки сообщений"
      );
    }
  }
);

const initialState = {
  channels: {
    entities: {},
    ids: [],
  },
  messages: {
    entities: {},
    ids: [],
  },
  activeChannelId: null,
  status: "idle",
  errors: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChannel: (state, action) => {
      const { id } = action.payload;
      state.activeChannelId = id;
    },
    addMessage: (state, action) => {
      const { id } = action.payload;
      state.messages.entities[id] = action.payload;
      state.messages.ids.push(id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = "loading";
        state.errors = [];
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.channels.entities = Object.fromEntries(
          action.payload.map((channel) => [channel.id, channel])
        );
        state.channels.ids = Object.keys(state.channels.entities);
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.errors = [];
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages.entities = Object.fromEntries(
          action.payload.map((msg) => [msg.id, msg])
        );
        state.messages.ids = Object.keys(state.messages.entities);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      });
  },
});

export const { setActiveChannel, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
