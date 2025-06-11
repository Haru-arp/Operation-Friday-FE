// src/routes/router.tsx
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import { RootLayout } from "../layout/RootLayout";
import Insert from "@/pages/Insert";
import Entries from "@/pages/Entries";

export const routerChildren: RouteObject[] = [
    {
        index: true,
        element: <Home />, //dashboard
    },
    {
        path: "/insert",
        element: <Insert />,
    },
    {
        path: "/entries",
        element: <Entries />,
    },
    {
        path: "/about",
        element: <About />,
    },
];

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: routerChildren,
    },
]);

export default router;
