import { useAuthStore } from "@/stores/useAuthStore";

export const logoutClient = () => {
    // accessToken 쿠키 삭제
    document.cookie = "accessToken=; path=/; max-age=0";

    // Zustand 상태 초기화
    useAuthStore.getState().clearUser();

    // 리디렉션
    window.location.href = "/login";
};
