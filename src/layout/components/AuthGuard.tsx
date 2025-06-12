import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

export const AuthGuard = () => {
    const location = useLocation();
    const authed = isAuthenticated();
    console.log(authed);
    // 로그인 상태가 아니고 /login 이 아닌 경우 차단
    if (!authed && location.pathname !== "/login") {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
