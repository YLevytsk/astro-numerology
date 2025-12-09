import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Создаём API-клиент
export const axiosAPI = axios.create({
  baseURL: "http://95.217.129.211:3000",
});

// Функции для токена
const setAuthHeader = (token) => {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const removeAuthHeader = () => {
  axiosAPI.defaults.headers.common.Authorization = "";
};

// ===================== REGISTER =====================
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    try {
      const response = await axiosAPI.post("/api/auth/register", body);
      const token = response.data?.data?.accessToken;

      if (token) {
        setAuthHeader(token);
        localStorage.setItem("accessToken", token);
      }

      return response.data;
    } catch (_error) {
      return thunkAPI.rejectWithValue(
        _error.response?.data?.message || _error.message
      );
    }
  }
);

// ===================== LOGIN =====================
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (body, thunkAPI) => {
    try {
      const response = await axiosAPI.post("/api/auth/login", body);
      const token = response.data?.data?.accessToken;

      if (token) {
        setAuthHeader(token);
        localStorage.setItem("accessToken", token);
      }

      return response.data;
    } catch (_error) {
      return thunkAPI.rejectWithValue(
        _error.response?.data?.message || _error.message
      );
    }
  }
);

// ===================== LOGOUT =====================
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const accessToken = state.auth.token;

      if (!accessToken) {
        return thunkAPI.rejectWithValue("No access token in state");
      }

      await axiosAPI.post("/api/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      removeAuthHeader();
      localStorage.removeItem("accessToken");

      return true;
    } catch (_error) {
      return thunkAPI.rejectWithValue(
        _error.response?.data?.message || _error.message
      );
    }
  }
);

// ===================== REFRESH =====================
export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const response = await axiosAPI.post("/api/auth/refresh");
      const { accessToken } = response.data?.data || {};

      if (accessToken) {
        setAuthHeader(accessToken);
        localStorage.setItem("accessToken", accessToken);
      }

      return response.data;
    } catch (_error) {
      if (_error.response?.status === 401) {
        return thunkAPI.rejectWithValue("Unauthorized");
      }

      return thunkAPI.rejectWithValue(
        _error.response?.data?.message || _error.message
      );
    }
  }
);


