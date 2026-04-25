import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookies.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com/api";

/* ===================== AXIOS INSTANCE ===================== */
export const axiosAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ===================== REQUEST INTERCEPTOR ===================== */
// Always attach the latest token from storage
axiosAPI.interceptors.request.use((config) => {
  const tokenFromStorage =
    getCookie("accessToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  if (tokenFromStorage) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tokenFromStorage}`;
  }

  return config;
});

/* ===================== RESTORE AUTH HEADER ON LOAD ===================== */
const storedToken =
  getCookie("accessToken") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token");

if (storedToken) {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

/* ===================== AUTH HEADER HELPERS ===================== */
const setAuthHeader = (token) => {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const removeAuthHeader = () => {
  delete axiosAPI.defaults.headers.common.Authorization;
};

const clearPersistedAuth = () => {
  removeAuthHeader();
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token"); // Important: clear legacy token key as well
  localStorage.removeItem("userId");
};

/* ===================== HELPERS ===================== */
const shapeUser = (raw = {}) => ({
  id: raw._id ?? raw.id ?? raw._id?.$oid ?? null,
  name: raw.name ?? raw.fullName ?? raw.username ?? "",
  email: raw.email ?? "",
  avatarUrl: raw.avatarUrl ?? raw.avatar ?? "",
  bio: raw.bio ?? "",
  role: raw.role ?? "user",
});

const persistAuth = ({ user, accessToken, refreshToken, userId }) => {
  if (accessToken) {
    setAuthHeader(accessToken);
    setCookie("accessToken", accessToken, 7);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);
  }
  if (refreshToken) {
    setCookie("refreshToken", refreshToken, 30);
    localStorage.setItem("refreshToken", refreshToken);
  }
  if (userId) {
    localStorage.setItem("userId", userId);
  }
  return user || null;
};

const extractTokens = (data = {}) => ({
  accessToken:
    data.accessToken ||
    data.token ||
    data?.tokens?.accessToken ||
    data?.tokens?.access ||
    data?.jwt ||
    data?.access_token ||
    null,
  refreshToken:
    data.refreshToken ||
    data?.tokens?.refreshToken ||
    data?.tokens?.refresh ||
    data?.refresh_token ||
    null,
});

/* ===================== AUTO REFRESH ON 401 (SAFE) ===================== */
axiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (!originalRequest) return Promise.reject(error);

    // не трогаем auth endpoints, и не ретраим дважды
    const url = originalRequest.url || "";
    if (
      status !== 401 ||
      originalRequest._retry ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      getCookie("refreshToken") || localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );

      const data = res.data?.data || res.data;
      const { accessToken, refreshToken: newRefreshToken } = extractTokens(data);
      const userData = data.user || data;
      const user = shapeUser(userData);

      persistAuth({
        user,
        accessToken,

        refreshToken: newRefreshToken || refreshToken,
      });

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosAPI(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

/* ===================== REGISTER ===================== */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    try {
      const res = await axiosAPI.post("/auth/register", body);
      const data = res.data?.data || res.data;
      const { accessToken, refreshToken } = extractTokens(data);
      const userData = data.user || data;
      const userId = userData?._id ?? userData?.id;

      persistAuth({ user: null, accessToken, refreshToken, userId });

      const profileRes = await axiosAPI.get(`/users/${userId}`);
      const profileData = profileRes.data?.data || profileRes.data;
      const profileUser = shapeUser(profileData?.user || profileData || {});

      return { user: profileUser, token: accessToken, userId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===================== LOGIN ===================== */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (body, thunkAPI) => {
    try {
      const res = await axiosAPI.post("/auth/login", body);
      const data = res.data?.data || res.data;
      const { accessToken, refreshToken } = extractTokens(data);
      const userData = data.user || data;
      const userId = userData?._id ?? userData?.id;

      persistAuth({ user: null, accessToken, refreshToken, userId });

      const profileRes = await axiosAPI.get(`/users/${userId}`);
      const profileData = profileRes.data?.data || profileRes.data;
      const profileUser = shapeUser(profileData?.user || profileData || {});

      return { user: profileUser, token: accessToken, userId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===================== REFRESH ===================== */
export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const refreshToken =
      getCookie("refreshToken") || localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return thunkAPI.rejectWithValue("Refresh token is missing");
    }

    try {
      const fallbackUserId =
        thunkAPI.getState().auth.userId || localStorage.getItem("userId");
      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );

      const data = res.data?.data || res.data;
      const { accessToken, refreshToken: newRefreshToken } = extractTokens(data);
      const userData = data.user || data;
      const userId = userData?._id ?? userData?.id ?? fallbackUserId;

      if (!userId) {
        return thunkAPI.rejectWithValue("User id is missing");
      }

      persistAuth({
        user: null,
        accessToken,
        refreshToken: newRefreshToken || refreshToken,
        userId,
      });

      const profileRes = await axiosAPI.get(`/users/${userId}`);
      const profileData = profileRes.data?.data || profileRes.data;
      const profileUser = shapeUser(profileData?.user || profileData || {});

      return { user: profileUser, token: accessToken, userId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===================== CURRENT ===================== */
export const fetchCurrentUserThunk = createAsyncThunk(
  "auth/current",
  async (_, thunkAPI) => {
    const token =
      getCookie("accessToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");
    const userId =
      thunkAPI.getState().auth.userId ||
      localStorage.getItem("userId") ||
      null;

    if (!token || !userId) {
      return thunkAPI.rejectWithValue("Access token or user id is missing");
    }

    setAuthHeader(token);

    try {
      const res = await axiosAPI.get(`/users/${userId}`);
      const data = res?.data?.data || res?.data;
      const userData = data?.user || data;
      const user = shapeUser(userData || {});

      persistAuth({
        user: null,
        accessToken: token,
        refreshToken:
          getCookie("refreshToken") || localStorage.getItem("refreshToken"),
        userId,
      });

      return { user, token, userId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===================== UPDATE BIO ===================== */
export const updateBioThunk = createAsyncThunk(
  "auth/updateBio",
  async ({ bio, userId }, thunkAPI) => {
    try {
      const stateAuth = thunkAPI.getState().auth || {};
      const stateUser = stateAuth.user || {};
      const id = userId || stateAuth.userId || stateUser.id || stateUser._id;

      if (!id) return thunkAPI.rejectWithValue("User id is missing");

      // API contract: PATCH /api/users/:userId { bio }
      await axiosAPI.patch(`/users/${id}`, { bio });

      // Reload user from server to ensure bio persisted server-side
      const res = await axiosAPI.get(`/users/${id}`);
      const data = res.data?.data || res.data;
      const userData = data?.user || data || {};

      const shaped = shapeUser(userData);
      const mergedUser = {
        ...stateUser,
        ...shaped,
        id: shaped.id || stateUser.id || id,
        bio: shaped.bio ?? "",
      };

      return mergedUser;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===================== UPLOAD AVATAR ===================== */
export const uploadAvatarThunk = createAsyncThunk(
  "auth/uploadAvatar",
  async ({ file, userId }, thunkAPI) => {
    try {
      const id = userId || thunkAPI.getState().auth.user?.id;
      if (!id) return thunkAPI.rejectWithValue("User id is missing");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosAPI.post(`/users/${id}/avatar`, formData);
      const data = res.data?.data || res.data;
      const avatarUrl =
        data?.avatarUrl ||
        data?.avatar ||
        data?.url ||
        data?.user?.avatarUrl ||
        (typeof data === "string" ? data : "") ||
        "";

      return avatarUrl;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===================== LOGOUT ===================== */
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosAPI.post("/auth/logout");
  } catch {}
  clearPersistedAuth();
  return true;
});



