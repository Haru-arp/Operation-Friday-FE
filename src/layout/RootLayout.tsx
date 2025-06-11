import styled from "@emotion/styled";
import Header from "./components/Header";
import Sider from "./components/Sider";
import { Outlet } from "react-router-dom";

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

export const RootLayout = () => {
    return (
        <LayoutContainer>
            <Header />
            <div className="flex flex-1 size-full">
                <Sider />
                <main className="flex-1 px-[28px] py-[24px] overflow-y-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </LayoutContainer>
    );
};
