import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  logoutThunk,
  refreshThunk,
  registerThunk,
} from "./operations";

// 🔹 Берём токен из localStorage (сохраняется после login/register)
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
      // -------------------------
      // REGISTER
      // -------------------------
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.data._id,
          name: action.payload.data.name,
          email: action.payload.data.email,
          avatarUrl: action.payload.data.avatarUrl,
        };
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;

        localStorage.setItem("accessToken", state.token);
      })

      // -------------------------
      // LOGIN
      // -------------------------
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.data._id,
          name: action.payload.data.name,
          email: action.payload.data.email,
          avatarUrl: action.payload.data.avatarUrl,
        };
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;

        localStorage.setItem("accessToken", state.token);
      })

      // -------------------------
      // REFRESH
      // сервер НЕ возвращает user → НЕ трогаем state.user
      // -------------------------
      .addCase(refreshThunk.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRefreshing = false;

        localStorage.setItem("accessToken", state.token);
        // ❗ state.user остаётся прежним — НЕ ЗАТИРАЕМ
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
        // ❗ token НЕ удаляем здесь — только при logout
      })

      // -------------------------
      // LOGOUT
      // -------------------------
      .addCase(logoutThunk.fulfilled, () => {
        localStorage.removeItem("accessToken");

        return {
          user: {
            id: null,
            email: null,
            name: null,
            avatarUrl: null,
          },
          token: null,
          isRefreshing: false,
          isLoggedIn: false,
        };
      });
  },
});

export const authReducer = slice.reducer;

