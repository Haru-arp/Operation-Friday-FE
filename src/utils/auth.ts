export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("userEmail"); // 예: 토큰 기반 인증
};
