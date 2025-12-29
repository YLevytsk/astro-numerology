import axios from "axios";

/**
 * Axios instance для ВСЕХ авторизованных запросов
 */
export const privateAPI = axios.create({
  baseURL: "http://95.217.129.211:3000/api",
});

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

