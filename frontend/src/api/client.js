import axios from "axios";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "8080";
const DEV_FRONTEND_PORTS = new Set(["5173", "4173"]);
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const envWsBaseUrl = import.meta.env.VITE_WS_BASE_URL?.trim();

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const normalizeApiBase = (value) => {
  const normalized = trimTrailingSlash(value);
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};

const deriveOriginFromApiBase = (value) => {
  const normalized = trimTrailingSlash(value);
  return normalized.endsWith("/api") ? normalized.slice(0, -4) : normalized;
};

const resolveBackendOrigin = () => {
  if (envWsBaseUrl) {
    return trimTrailingSlash(envWsBaseUrl);
  }

  if (envApiBaseUrl) {
    return deriveOriginFromApiBase(envApiBaseUrl);
  }

  if (typeof window === "undefined") {
    return "";
  }

  const { protocol, hostname, port, origin } = window.location;

  if (DEV_FRONTEND_PORTS.has(port)) {
    return `${protocol}//${hostname}:${BACKEND_PORT}`;
  }

  return origin;
};

export const BACKEND_ORIGIN = resolveBackendOrigin();
export const API_BASE_URL = envApiBaseUrl
  ? normalizeApiBase(envApiBaseUrl)
  : BACKEND_ORIGIN
    ? `${BACKEND_ORIGIN}/api`
    : "/api";
export const WS_BASE_URL = BACKEND_ORIGIN;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

/* REQUEST INTERCEPTOR */

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Do NOT send token for login/register
    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* RESPONSE INTERCEPTOR (OPTIONAL BUT GOOD) */

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (token expired / deleted user)
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirecting to login");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default client;
