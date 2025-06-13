import styled from "@emotion/styled";

import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const RootLayout = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "사용자");
    setUserEmail(localStorage.getItem("userEmail") || "");
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <LayoutContainer>
      <div className="bg-gray-50 dark:bg-gray-900 flex flex-1 size-full">
        <Sidebar userName={userName} userEmail={userEmail} />
        <div className="flex flex-col flex-1 min-h-screen pt-16 md:pt-0  ">
          <main className="p-4 flex-1 overflow-y-auto ">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContainer>
  );
};
