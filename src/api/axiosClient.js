import axios from "axios";

// Your backend. Override by creating a .env file with:
// REACT_APP_API_BASE_URL=http://localhost:5002
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach the auth token saved at login to every request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set the multipart boundary itself for FormData uploads.
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} => Status:`,
      error.response?.status,
      "Payload:",
      error.response?.data
    );
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("admin_data");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
