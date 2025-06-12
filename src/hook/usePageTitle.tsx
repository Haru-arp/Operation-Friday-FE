import { menuItems } from "@/constants/routeItems";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function usePageTitle() {
    const location = useLocation();

    const title = useMemo(() => {
        const current = menuItems.find((route) => route.path === location.pathname);
        return current?.label ?? "Not Found Page";
    }, [location.pathname]);

    return title;
}
