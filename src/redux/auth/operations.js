import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookies.js";

/* ===================== AXIOS INSTANCE ===================== */
export const axiosAPI = axios.create({
  baseURL: "http://95.217.129.211:3000/api",
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
  localStorage.removeItem("token"); // ✅ важно: чистим и token тоже
  // keep user/userCache so profile fields (bio) can survive re-login if backend omits them
};

/* ===================== HELPERS ===================== */
const shapeUser = (raw = {}) => ({
  id: raw._id || raw.id || null,
  name: raw.name ?? raw.fullName ?? raw.username ?? "",
  email: raw.email ?? "",
  avatarUrl: raw.avatarUrl ?? raw.avatar ?? "",
  bio: raw.bio ?? raw.description ?? raw.about ?? "",
});

const cacheKeyFromUser = (user = {}) => {
  const id = user.id || user._id;
  if (id) return `userCache_${id}`;
  if (user.email) return `userCache_${user.email}`;
  return null;
};

const readStoredUser = (userHint = null) => {
  try {
    const key = cacheKeyFromUser(userHint || {});
    if (key) {
      const rawKeyed = localStorage.getItem(key);
      if (rawKeyed) return JSON.parse(rawKeyed);
    }

    const raw = localStorage.getItem("user") || localStorage.getItem("userCache");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Merge with cached user to keep profile fields (bio/avatar/etc.) if backend omits them
const mergeWithStoredUser = (user = {}) => {
  const stored = readStoredUser(user);
  if (!stored) return user;

  const sameUser =
    (user.id && stored.id && user.id === stored.id) ||
    (user.email && stored.email && user.email === stored.email);

  const canAssumeSame = !user.id && !user.email;

  if (!sameUser && !canAssumeSame) return user;

  const bio = user.bio && user.bio.trim() ? user.bio : stored.bio ?? "";
  const avatarUrl =
    user.avatarUrl && user.avatarUrl.trim()
      ? user.avatarUrl
      : stored.avatarUrl ?? "";
  const name = user.name && user.name.trim() ? user.name : stored.name ?? "";
  const email =
    user.email && user.email.trim() ? user.email : stored.email ?? "";

  return {
    ...stored,
    ...user,
    bio,
    avatarUrl,
    name,
    email,
  };
};

const persistUserCache = (user) => {
  try {
    const key = cacheKeyFromUser(user || {});
    if (key) {
      localStorage.setItem(key, JSON.stringify(user));
    }
    localStorage.setItem("userCache", JSON.stringify(user));
  } catch {}
};

const persistAuth = ({ user, accessToken, refreshToken }) => {
  let mergedUser = user ? mergeWithStoredUser(user) : null;
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
  if (mergedUser) {
    localStorage.setItem("user", JSON.stringify(mergedUser));
    persistUserCache(mergedUser);
  }
  return mergedUser;
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

const fetchUserFromCurrent = async (token) => {
  if (!token) return null;
  try {
    setAuthHeader(token);
    const res = await axiosAPI.get("/users/current");
    const data = res?.data?.data || res?.data;
    const userData = data?.user || data;
    return shapeUser(userData || {});
  } catch {
    return null;
  }
};

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
        `${axiosAPI.defaults.baseURL}/auth/refresh`,
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
      let user = shapeUser(userData);

      const mergedUser = persistAuth({
        user,
        accessToken,
        refreshToken,
      });
      user = mergedUser || user;

      // Best-effort enrichment (bio, avatar, etc.) if backend omits fields
      try {
        const freshUser = await fetchUserFromCurrent(accessToken);
        if (freshUser) {
          user = freshUser;
          const mergedFresh = persistAuth({
            user,
            accessToken,
            refreshToken,
          });
          user = mergedFresh || user;
        }
      } catch {
        // ignore enrichment errors, keep basic user
      }

      return { user, token: accessToken };
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
      let user = shapeUser(userData);

      const mergedUser = persistAuth({
        user,
        accessToken,
        refreshToken,
      });
      user = mergedUser || user;

      return { user, token: accessToken };
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
      const res = await axios.post(
        `${axiosAPI.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      );

      const data = res.data?.data || res.data;
      const { accessToken, refreshToken: newRefreshToken } = extractTokens(data);
      const userData = data.user || data;
      let user = shapeUser(userData);

      const mergedUser = persistAuth({
        user,
        accessToken,
        refreshToken: newRefreshToken || refreshToken,
      });
      user = mergedUser || user;

      return { user, token: accessToken };
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

    if (!token) {
      return thunkAPI.rejectWithValue("Access token is missing");
    }

    setAuthHeader(token);

    try {
      const res = await axiosAPI.get("/users/current");
      const data = res?.data?.data || res?.data;
      const userData = data?.user || data;
      const user = shapeUser(userData || {});

      const mergedUser = persistAuth({
        user,
        accessToken: token,
        refreshToken:
          getCookie("refreshToken") || localStorage.getItem("refreshToken"),
      });

      return { user: mergedUser || user, token };
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
      const stateUser = thunkAPI.getState().auth.user || {};
      const id = userId || stateUser.id || stateUser._id;

      if (!id) return thunkAPI.rejectWithValue("User id is missing");

      const attemptUpdate = async (url) => {
        try {
          return await axiosAPI.patch(url, { bio });
        } catch (err) {
          if (err.response?.status === 404) return null;
          throw err;
        }
      };

      let res = await attemptUpdate(`/users/${id}`);
      if (!res) res = await attemptUpdate(`/users/${id}/bio`);
      if (!res) return thunkAPI.rejectWithValue("Update bio endpoint is unavailable");

      const data = res.data?.data;
      const newBio = data?.bio ?? data?.description ?? data?.about ?? bio ?? "";

      // persist updated user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.bio = newBio;
        localStorage.setItem("user", JSON.stringify(parsed));
        persistUserCache(parsed);
      }

      return newBio;
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
      const data = res.data?.data;
      const avatarUrl = data?.avatarUrl || data || "";

      // persist updated user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.avatarUrl = avatarUrl;
        localStorage.setItem("user", JSON.stringify(parsed));
        persistUserCache(parsed);
      }

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
