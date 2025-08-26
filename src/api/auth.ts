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
  const response = await axiosInstance.post("/api/v1/users/login", form, {
    withCredentials: true,
  });
  return response.data;
};

export const signup = async (form: SignupForm) => {
  const response = await axiosInstance.post("/api/v1/users/signup", form);
  return response.data;
};

export const refresh = async () => {
  const response = await axiosInstance.post(
    "/api/v1/users/refresh",
    {},
    {
      withCredentials: true,
    }
  );
  return response.data.data.accessToken;
};
export const logout = async () => {
  const response = await axiosInstance.delete("/api/v1/users/logout", {
    withCredentials: true,
  });
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get("/api/v1/users/me");
  return response.data;
};
