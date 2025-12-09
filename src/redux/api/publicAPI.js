import axios from "axios";

export const publicAPI = axios.create({
  baseURL: "http://95.217.129.211:3000",
});

publicAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
