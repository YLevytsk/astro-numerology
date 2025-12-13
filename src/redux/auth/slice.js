import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, refreshThunk, registerThunk } from "./operations";

const savedToken = localStorage.getItem("accessToken");

const initialState = {
  user: {
    id: null,
    email: null,
    name: null,
    avatarUrl: null,
  },
  token: savedToken || null,
  isRefreshing: false,
  isLoggedIn: !!savedToken,
};

const slice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      // LOGIN
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      // REFRESH
      .addCase(refreshThunk.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
      })

      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = {
          id: null,
          email: null,
          name: null,
          avatarUrl: null,
        };
        state.token = null;
        state.isRefreshing = false;
        state.isLoggedIn = false;
      });
  },
});

export const authReducer = slice.reducer;
