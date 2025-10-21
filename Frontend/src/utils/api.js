import axios from "axios";

const API = axios.create({
  baseURL: "https://apna-gpt.onrender.com/api", // ✅ your correct backend
});

// Automatically attach JWT if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
