// src/api/api.js
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  // baseURL: BASE_URL+'/api', // your backend
});

// Attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token)
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
