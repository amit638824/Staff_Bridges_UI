import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",   // 🔥 এখানে अपना API base URL डालो
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Token add automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
