import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===================== AXIOS INSTANCE =====================
export const axiosAPI = axios.create({
  baseURL: "http://95.217.129.211:3000/api",
});

// IMPORTANT: restore token on reload
const storedToken = localStorage.getItem("accessToken");
if (storedToken) {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

// ===================== AUTH HEADER HELPERS =====================
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
      const res = await axiosAPI.post("/auth/register", body);
      const data = res.data.data;

      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl,
        })
      );

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
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
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

      // critical: set header immediately
      setAuthHeader(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl,
        })
      );

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
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ===================== LOGOUT =====================
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await axiosAPI.post("/auth/logout");
    } catch {
      // 401 acceptable
    }

    removeAuthHeader();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    return true;
  }
);

// ===================== UPLOAD AVATAR =====================
export const uploadAvatarThunk = createAsyncThunk(
  "auth/uploadAvatar",
  async ({ file, userId }, thunkAPI) => {
    try {
      const id = userId || thunkAPI.getState().auth.user?.id;
      if (!id) {
        return thunkAPI.rejectWithValue("User id is missing");
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosAPI.post(`/users/${id}/avatar`, formData);
      const data = res.data?.data;
      const avatarUrl = data?.avatarUrl || data;

      // persist updated user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.avatarUrl = avatarUrl;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      return avatarUrl;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
