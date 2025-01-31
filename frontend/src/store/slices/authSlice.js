/* eslint-disable sort-keys */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  token: null,
  username: null,
  password: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
    logout(state) {
      state.isAuth = false;
      state.token = null;
      state.username = null;
      state.password = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
