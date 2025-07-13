import axios from "axios";

export const API_BASE_URL = "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

uploadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("base", import.meta.env.VITE_BASE_URL);
