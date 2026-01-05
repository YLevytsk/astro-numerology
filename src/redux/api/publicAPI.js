import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com/api";

export const publicAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});



