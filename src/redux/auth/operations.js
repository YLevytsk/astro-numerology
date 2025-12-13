import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const axiosAPI = axios.create({
  baseURL: "http://95.217.129.211:3000",
  withCredentials: true,
});

// Устанавливаем токен
const setAuthHeader = (token) => {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const removeAuthHeader = () => {
  delete axiosAPI.defaults.headers.common.Authorization;
};

// ===================== REGISTER =====================
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    try {
      const res = await axiosAPI.post("/api/auth/register", body);

      const data = res.data.data;

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

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
      const res = await axiosAPI.post("/api/auth/login", body);
      const data = res.data.data;

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

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
      const res = await axiosAPI.post("/api/auth/refresh");
      const data = res.data.data;

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

      return {
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl,
        },
        token: data.accessToken,
      };
    } catch  {
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
        "/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      removeAuthHeader();
      localStorage.removeItem("accessToken");

      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


