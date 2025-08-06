import axiosInstance from "./axios";

// export const login = async (form: LoginForm) => {
//     const response = await axiosInstance.post("/api/v1/users/login", form);
//     return response.data;
// };
export const modifyName = async (body: {name: string}) => {
    const response = await axiosInstance.patch("/api/v1/users",body);
    return response;
};
