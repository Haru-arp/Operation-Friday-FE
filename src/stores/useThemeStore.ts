import { create } from "zustand";

interface ThemeState {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    initializeDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    isDarkMode: false,

    toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });

        // localStorage에 저장
        localStorage.setItem("darkMode", newDarkMode.toString());

        // DOM 클래스 업데이트
        if (newDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    },

    initializeDarkMode: () => {
        // localStorage에서 다크모드 설정 읽기
        const savedDarkMode = localStorage.getItem("darkMode") === "true";
        set({ isDarkMode: savedDarkMode });

        // DOM 클래스 업데이트
        if (savedDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    },
}));
