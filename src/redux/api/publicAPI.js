import axios from "axios";

export const publicAPI = axios.create({
  baseURL: "http://95.217.129.211:3000/api",
});

// ❗ НИКАКИХ Authorization
publicAPI.defaults.headers.common.Authorization = undefined;

