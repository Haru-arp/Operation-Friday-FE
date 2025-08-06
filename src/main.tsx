import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tailwind.css";
import { useThemeStore } from "./stores/useThemeStore";

// 앱 시작 시 다크모드 초기화
useThemeStore.getState().initializeDarkMode();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

// Service Worker 등록
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
            (registration) => {
                console.log("Service Worker registered: ", registration);
            },
            (err) => {
                console.log("Service Worker registration failed: ", err);
            }
        );
    });
}
