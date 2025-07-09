import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import { useMe } from "@/hook/useLogin";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export const AuthGuard = () => {
    const location = useLocation();
    const authed = isAuthenticated();

    const { data: userInfo, isLoading } = useMe();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (userInfo && !user) {
            setUser(userInfo);
        }
    }, [userInfo, user, setUser]);
    // 로그인 상태가 아니고 /login 이 아닌 경우 차단
    if (!authed && location.pathname !== "/login") {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (authed && isLoading) {
        return <div></div>; // 또는 <Loading />
    }

    return <Outlet />;
};
