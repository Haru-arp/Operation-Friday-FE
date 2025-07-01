import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "http://219.241.3.105:30080/",
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
        if (error?.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
