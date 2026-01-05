import axios from "axios";
import { getCookie } from "../../utils/cookies.js";

/**
 * Axios instance для ВСЕХ авторизованных запросов
 */
export const privateAPI = axios.create({
  baseURL: "http://95.217.129.211:3000/api",
});

/* ===================== AUTH HEADER ===================== */

/**
 * Установить Authorization header
 */
export const setAuthHeader = (token) => {
  privateAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/**
 * Очистить Authorization header
 */
export const clearAuthHeader = () => {
  delete privateAPI.defaults.headers.common.Authorization;
};

/* ===================== REQUEST INTERCEPTOR ===================== */
privateAPI.interceptors.request.use(
  (config) => {
    const token =
      config.__token ||
      localStorage.getItem("accessToken") ||
      getCookie("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
/**
 * ❗ ВАЖНО:
 * - НЕ делаем refresh
 * - НЕ делаем logout
 * - refresh управляется ТОЛЬКО через Redux (refreshThunk)
 */
privateAPI.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);



