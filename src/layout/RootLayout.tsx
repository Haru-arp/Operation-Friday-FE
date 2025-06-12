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
  const [login, setLogin] = useState<boolean>(false);
  const onClickLogin = () => {
    setLogin(true);
  };
  const onClickLogout = () => {
    setLogin(false);
  };
  return (
    <LayoutContainer>
      <div className="flex flex-1 size-full">
        <Sider setLogout={onClickLogout} login={login} />
        <div className="bg-[#fff] flex flex-col flex-1 px-[48px] py-[18px]">
          <Header login={login} setLogin={onClickLogin} />
          <main className="flex-1  overflow-y-auto ">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContainer>
  );
};
