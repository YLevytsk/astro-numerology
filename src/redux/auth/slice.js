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
import { getCookie } from "../../utils/cookies.js";

/* ===================== HELPERS ===================== */

const emptyUser = {
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
  bio: null,
};

const loadToken = () => {
  try {
    return (
      getCookie("accessToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token")
    );
  } catch {
    return null;
  }
};

/* ===================== INITIAL STATE ===================== */

const initialState = {
  user: emptyUser,
  userId: null,
  token: loadToken(),
  isLoggedIn: Boolean(loadToken()),
  isRefreshing: false,
};

/* ===================== SLICE ===================== */

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ===== CURRENT USER (НИКОГДА НЕ ЛОГАУТИТ) ===== */
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload.userId || action.payload.user?.id;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state) => {
        // ❗ намеренно НЕ сбрасываем auth
        state.isRefreshing = false;
      })

      /* ===== REFRESH (ЕДИНСТВЕННОЕ МЕСТО, ГДЕ МОЖНО ЛОГАУТИТЬ) ===== */
      .addCase(refreshThunk.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload.userId || action.payload.user?.id;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshThunk.rejected, (state) => {
        // keep existing auth data; just stop refreshing
        state.isLoggedIn = Boolean(state.token);
        state.isRefreshing = false;
      })

      /* ===== REGISTER ===== */
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload.userId || action.payload.user?.id;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      /* ===== LOGIN ===== */
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload.userId || action.payload.user?.id;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      /* ===== LOGOUT ===== */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = emptyUser;
        state.userId = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      })

      /* ===== UPLOAD AVATAR ===== */
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatarUrl = action.payload;
        }
      })

      /* ===== UPDATE BIO ===== */
      .addCase(updateBioThunk.fulfilled, (state, action) => {
        state.user = action.payload || state.user;
      });
  },
});

export const authReducer = slice.reducer;
