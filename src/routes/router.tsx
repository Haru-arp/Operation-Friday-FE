import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import { RootLayout } from "../layout/RootLayout";
import Insert from "@/pages/Insert";
import Entries from "@/pages/Entries";
import LoginPage from "@/pages/Login";
import { AuthGuard } from "@/layout/components/AuthGuard";
import Settings from "@/pages/Settings";
import Signup from "@/pages/Signup";
import EditTransaction from "@/pages/EditTransaction";
import Accounts from "@/pages/Accounts";
import Guide from "@/pages/Guide";

export const routerChildren: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />, //dashboard
      },

      {
        path: "/transaction/new",
        element: <Insert />,
      },
      {
        path: "/transaction/edit/:transactionId",
        element: <EditTransaction />,
      },
      {
        path: "/transactions",
        element: <Entries />,
      },
      {
        path: "/analytics",
        element: "analytics",
      },
      {
        path: "/goals",
        element: "goals",
      },
      {
        path: "/ai-chat",
        element: "ai-chat",
      },
      {
        path: "/accounts",
        element: <Accounts />,
      },
      {
        path: "/guide",
        element: <Guide />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
];

const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: routerChildren,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
