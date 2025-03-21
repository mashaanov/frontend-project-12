 
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    },
    signup(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    },
    logout(state) {
      state.isAuth = false;
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        state.isAuth = true;
        state.token = token;
        state.username = localStorage.getItem('username') || null;
      }
    },
  },
});

export const {
  login,
  logout,
  signup,
  initializeAuth,
} = authSlice.actions;
export default authSlice.reducer;
