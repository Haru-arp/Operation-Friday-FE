import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, login, logout, signup } from "../api/auth";
import { getAccessTokenFromCookie } from "@/api/axios";
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

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: getUserInfo,
        staleTime: 1000 * 60 * 5, // 5분 동안 fresh
        select: (res) => res.data,
        enabled: !!getAccessTokenFromCookie(),
    });
};
