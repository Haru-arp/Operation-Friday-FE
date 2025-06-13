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

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "사용자");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, [navigate]);
  return (
    <LayoutContainer>
      <div className="flex flex-1 size-full">
        <Sidebar userName={userName} userEmail={userEmail} />
        <div className=" bg-white dark:bg-gray-900 flex flex-col flex-1 ">
          <main className="flex-1 overflow-y-auto ">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContainer>
  );
};
