import axiosInstance from "./axios";

export interface LoginForm {
    email: string;
    password: string;
}

export interface SignupForm {
    email: string;
    password: string;
    name: string;
}

export const login = async (form: LoginForm) => {
    const response = await axiosInstance.post("/api/v1/users/login", form);
    return response.data;
};

export const signup = async (form: SignupForm) => {
    const response = await axiosInstance.post("/api/v1/users", form);
    return response.data;
};
