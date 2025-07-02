import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../api/auth";

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: signup,
    });
};
