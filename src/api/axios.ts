import axios from "axios";
import { refresh } from "./auth";
import { logoutClient } from "@/utils/logout";

export const getAccessTokenFromCookie = (): string | null => {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const setAccessTokenToCookie = (token: string) => {
  document.cookie = `accessToken=${encodeURIComponent(
    token
  )}; path=/; max-age=900; SameSite=Strict; Secure`;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // refreshToken 전송을 위해 필요
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessTokenFromCookie();

  if (token && config.headers) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// ✅ refresh 중복 방지용 플래그 및 큐
let isRefreshing = false;
let failedQueue: Array<(token?: string | null, error?: unknown) => void> = [];

const processQueue = (token: string | null, error: unknown = null) => {
  failedQueue.forEach((cb) => cb(token, error));
  failedQueue = [];
};
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url;
    const originalRequest = error.config;

    const isLoginAttempt = requestUrl?.includes("/login");
    const isRefreshAttempt = requestUrl?.includes("/refresh");

    if (
      (status === 401 || status === 403) &&
      !isLoginAttempt &&
      !isRefreshAttempt &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push((newToken, error) => {
            if (error) return reject(error);
            originalRequest.headers.Authorization = `${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refresh();

        setAccessTokenToCookie(newAccessToken);

        processQueue(newAccessToken);
        // 재요청에 토큰 갱신 후 재시도
        originalRequest.headers.Authorization = `${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(null, refreshError);
        logoutClient(); // refresh 실패 → 로그아웃
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
