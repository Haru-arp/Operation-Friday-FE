import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "https://friday.ai.kr",
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken && config.headers) {
        config.headers.Authorization = `${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url;

        //로그인 API 요청은 예외 처리 (redirect 금지)
        const isLoginAttempt = requestUrl?.includes("/login");
        if (status === 401 && !isLoginAttempt) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
