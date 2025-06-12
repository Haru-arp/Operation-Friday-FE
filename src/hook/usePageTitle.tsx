import { router } from "@/constants/routeItems";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function usePageTitle() {
  const location = useLocation();

  const title = useMemo(() => {
    const current = router.find((route) => route.to === location.pathname);
    return current?.name ?? "Not Found Page";
  }, [location.pathname]);

  return title;
}
