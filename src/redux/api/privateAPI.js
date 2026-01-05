import axios from "axios";
import { getCookie } from "../../utils/cookies.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

/**
 * Axios instance for all authenticated requests
 */
export const privateAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ===================== AUTH HEADER ===================== */

/**
 * Install Authorization header
 */
export const setAuthHeader = (token) => {
  privateAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/**
 * Clear Authorization header
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
 * IMPORTANT
 * - Do not auto-refresh here
 * - Do not auto-logout here
 * - Refresh is controlled only via Redux (refreshThunk)
 */
privateAPI.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
