import { BACKEND_ORIGIN } from "../api/client";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export function getImageUrl(src) {
  if (!src) return "";
  if (src.startsWith("blob:")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const envBaseUrl = import.meta.env.VITE_WS_BASE_URL?.trim();
  const fallbackBaseUrl =
    envBaseUrl ||
    BACKEND_ORIGIN ||
    (typeof window !== "undefined" ? window.location.origin : "");

  if (!fallbackBaseUrl) return src;

  return `${trimTrailingSlash(fallbackBaseUrl)}/${src.replace(/^\/+/, "")}`;
}
