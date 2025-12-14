import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===================== AXIOS INSTANCE =====================
export const axiosAPI = axios.create({
  baseURL: "http://95.217.129.211:4000/api", // правильно: порт 4000 + /api
});

// Устанавливаем Authorization header
const setAuthHeader = (token) => {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// Удаляем header
const removeAuthHeader = () => {
  delete axiosAPI.defaults.headers.common.Authorization;
};

// ===================== REGISTER =====================
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    try {
      const res = await axiosAPI.post("/auth/register", body);
      const data = res.data.data;

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      return {
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl,
        },
        token: data.accessToken,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===================== LOGIN =====================
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (body, thunkAPI) => {
    try {
      const res = await axiosAPI.post("/auth/login", body);
      const data = res.data.data;

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      return {
        user: {
          id: data._id,
          name: data.name,
          email: data.email || null,
          avatarUrl: data.avatarUrl,
        },
        token: data.accessToken,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===================== REFRESH =====================
export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        removeAuthHeader();
        return thunkAPI.rejectWithValue("No refresh token");
      }

      const res = await axiosAPI.post("/auth/refresh", { refreshToken });
      const data = res.data.data;

      if (!data?.accessToken) {
        removeAuthHeader();
        return thunkAPI.rejectWithValue("Unauthorized");
      }

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return {
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl,
        },
        token: data.accessToken,
      };
    } catch {
      removeAuthHeader();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return thunkAPI.rejectWithValue("Unauthorized");
    }
  }
);

// ===================== LOGOUT =====================
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      await axiosAPI.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      removeAuthHeader();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



