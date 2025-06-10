import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tailwind.css";

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
