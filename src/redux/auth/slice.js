import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  logoutThunk,
  registerThunk,
  refreshThunk,
  fetchCurrentUserThunk,
  uploadAvatarThunk,
  updateBioThunk,
} from "./operations";

const emptyUser = {
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
  bio: null,
};

const loadToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const initialState = {
  user: emptyUser,
  token: loadToken(),
  isLoggedIn: !!loadToken(), // восстановление логина после перезагрузки
  isRefreshing: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      // ===== CURRENT =====
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state) => {
        state.user = emptyUser;
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      })

      // ===== REFRESH =====
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
        state.user = emptyUser;
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      })

      // ===== REGISTER =====
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      // ===== LOGIN =====
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      // ===== LOGOUT =====
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = emptyUser;
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      })

      // ===== UPLOAD AVATAR =====
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        state.user.avatarUrl = action.payload;
      })

      // ===== UPDATE BIO =====
      .addCase(updateBioThunk.fulfilled, (state, action) => {
        state.user.bio = action.payload;
      });
  },
});

export const authReducer = slice.reducer;

