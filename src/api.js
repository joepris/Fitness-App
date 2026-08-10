import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_FITNESS_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const serverMessage =
      (typeof data?.error === "string" && data.error) ||
      data?.message ||
      error.response?.statusText;

    const customError = new Error(
      serverMessage || `API error: ${status ?? "unknown"}`
    );
    customError.status = status;
    customError.message = serverMessage || customError.message;
    customError.data = data;

    return Promise.reject(customError);
  }
);

export default api;