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

const loadUser = () => {
  try {
    const raw =
      localStorage.getItem("user") || localStorage.getItem("userCache");
    if (!raw) return emptyUser;
    const parsed = JSON.parse(raw);
    return {
      id: parsed.id || parsed._id || null,
      email: parsed.email || null,
      name: parsed.name || parsed.fullName || parsed.username || null,
      avatarUrl: parsed.avatarUrl || parsed.avatar || null,
      bio: parsed.bio || parsed.description || parsed.about || null,
    };
  } catch {
    return emptyUser;
  }
};

/* ===================== INITIAL STATE ===================== */

const initialState = {
  user: loadUser(),
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
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      /* ===== LOGIN ===== */
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })

      /* ===== LOGOUT ===== */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = emptyUser;
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
