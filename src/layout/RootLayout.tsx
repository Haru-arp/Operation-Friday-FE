import styled from "@emotion/styled";
import Header from "./components/Header";
import Sider from "./components/Sider";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <LayoutContainer>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 size-full">
        {/* 모바일 사이드바 오버레이 */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sider: 모바일에서는 토글, 데스크탑에서는 항상 보임 */}
        <aside
          className={`fixed z-50 top-0 left-0 h-full  shadow-md transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sider onClickItem={() => setSidebarOpen(false)} />
        </aside>
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </LayoutContainer>
  );
};
