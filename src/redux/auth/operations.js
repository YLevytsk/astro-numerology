import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setCookie,
  getCookie,
  deleteCookie,
} from "../../utils/cookies.js";

// ===================== AXIOS INSTANCE =====================
export const axiosAPI = axios.create({
  baseURL: "http://95.217.129.211:3000/api",
});

// IMPORTANT: restore token on reload (prefer cookies, fallback to localStorage)
// try cookies first, then both accessToken and token keys in localStorage
const storedToken =
  getCookie("accessToken") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token");
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

// ===================== HELPERS =====================
const shapeUser = (raw = {}) => ({
  id: raw._id || raw.id || null,
  name: raw.name ?? raw.fullName ?? raw.username ?? "",
  email: raw.email ?? "",
  avatarUrl: raw.avatarUrl ?? raw.avatar ?? "",
  bio: raw.bio ?? raw.description ?? raw.about ?? "",
});

const persistAuth = ({ user, accessToken, refreshToken }) => {
  if (accessToken) {
    setAuthHeader(accessToken);
    setCookie("accessToken", accessToken, 7);
    localStorage.setItem("accessToken", accessToken);
    // also store under generic key for compatibility
    localStorage.setItem("token", accessToken);
  }
  if (refreshToken) {
    setCookie("refreshToken", refreshToken, 30);
    localStorage.setItem("refreshToken", refreshToken);
  }
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

// ===================== REGISTER =====================
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    try {
      const res = await axiosAPI.post("/auth/register", body);
      const data = res.data?.data || res.data;
      const userData = data.user || data;
      const user = shapeUser(userData);

      persistAuth({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      return {
        user,
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
      const data = res.data?.data || res.data;
      const userData = data.user || data;
      const user = shapeUser(userData);

      persistAuth({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      return {
        user,
        token: data.accessToken,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ===================== REFRESH =====================
export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const refreshToken =
      getCookie("refreshToken") || localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return thunkAPI.rejectWithValue("Refresh token is missing");
    }

    try {
      const res = await axiosAPI.post("/auth/refresh", { refreshToken });
      const data = res.data?.data || res.data;
      const userData = data.user || data;
      const user = shapeUser(userData);

      persistAuth({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
      });

      return {
        user,
        token: data.accessToken,
      };
    } catch (err) {
      removeAuthHeader();
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ===================== CURRENT =====================
export const fetchCurrentUserThunk = createAsyncThunk(
  "auth/current",
  async (_, thunkAPI) => {
    const token =
      getCookie("accessToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Access token is missing");
    }

    setAuthHeader(token);

    const clearAuth = () => {
      removeAuthHeader();
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    };

    try {
      const res = await axiosAPI.get("/users/current");

      const data = res?.data?.data || res?.data;
      const userData = data?.user || data;
      const user = shapeUser(userData || {});

      persistAuth({
        user,
        accessToken: token,
        refreshToken: getCookie("refreshToken") || localStorage.getItem("refreshToken"),
      });

      return {
        user,
        token,
      };
    } catch (err) {
      clearAuth();
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ===================== UPDATE BIO =====================
export const updateBioThunk = createAsyncThunk(
  "auth/updateBio",
  async ({ bio, userId }, thunkAPI) => {
    try {
      const stateUser = thunkAPI.getState().auth.user || {};
      const id =
        userId ||
        stateUser.id ||
        stateUser._id;
      if (!id) {
        return thunkAPI.rejectWithValue("User id is missing");
      }

      // Try generic user update first, then legacy /bio route as a fallback
      const attemptUpdate = async (url) => {
        try {
          return await axiosAPI.patch(url, { bio });
        } catch (err) {
          if (err.response?.status === 404) {
            return null;
          }
          throw err;
        }
      };

      let res = await attemptUpdate(`/users/${id}`);
      if (!res) {
        res = await attemptUpdate(`/users/${id}/bio`);
      }
      if (!res) {
        return thunkAPI.rejectWithValue("Update bio endpoint is unavailable");
      }

      const data = res.data?.data;
      const newBio =
        data?.bio ??
        data?.description ??
        data?.about ??
        bio ??
        "";

      // persist updated user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.bio = newBio;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      return newBio;
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
  async (_, thunkAPI) => {
    try {
      await axiosAPI.post("/auth/logout");
    } catch {
      // 401 acceptable
    }

    removeAuthHeader();
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
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
