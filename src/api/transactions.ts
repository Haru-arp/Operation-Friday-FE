import axiosInstance from "./axios";

// export const login = async (form: LoginForm) => {
//     const response = await axiosInstance.post("/api/v1/users/login", form);
//     return response.data;
// };
export const loadTransactions = async () => {
    const response = await axiosInstance.get("/api/v1/transactions");
    return response;
};
