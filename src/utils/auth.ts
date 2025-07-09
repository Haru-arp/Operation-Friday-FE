export const isAuthenticated = (): boolean => {
    const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
    return !!match;
};
