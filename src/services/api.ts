import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const override = localStorage.getItem("api_url_override");
    if (override && override.trim()) {
      return override.trim().replace(/\/$/, "");
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://task-manager-app-ntlt.onrender.com/api"
  );
};

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamic BaseURL & Auth Interceptor
api.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseUrl();
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
