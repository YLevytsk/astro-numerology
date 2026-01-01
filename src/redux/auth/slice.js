import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, registerThunk } from "./operations";

const emptyUser = {
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
};

const loadUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : emptyUser;
  } catch {
    return emptyUser;
  }
};

const loadToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const initialState = {
  user: loadUser(),
  token: loadToken(),
  isLoggedIn: !!loadToken(), // восстановление логина после перезагрузки
};

const slice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder

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
      });
  },
});

export const authReducer = slice.reducer;
