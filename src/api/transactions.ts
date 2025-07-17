import type { TransactionRequest } from "@/components/ui/wizard/transaction-wizard";
import axiosInstance from "./axios";

// export const login = async (form: LoginForm) => {
//     const response = await axiosInstance.post("/api/v1/users/login", form);
//     return response.data;
// };
export const loadTransactions = async () => {
    const response = await axiosInstance.get("/api/v1/transactions");
    return response;
};

export const loadTransactionsById = async (id: number) => {
    const response = await axiosInstance.get(`/api/v1/transactions/${id}`);
    return response;
};

export const loadAccount = async () => {
    const response = await axiosInstance.get(`/api/v1/accounts`);
    return response;
};

export const registTransactions = async (form: TransactionRequest) => {
    const response = await axiosInstance.post(`api/v1/transactions`, form);
    return response;
};
