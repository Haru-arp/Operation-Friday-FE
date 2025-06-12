import styled from "@emotion/styled";

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

export const RootLayout = () => {
    return (
        <LayoutContainer>
            <div className="flex flex-1 size-full">
                <Sidebar userName={"이동희"} userEmail={"rou012001@gmail.com"} />
                <div className=" bg-white dark:bg-gray-900 flex flex-col flex-1 px-[48px] py-[18px]">
                    <main className="flex-1  overflow-y-auto ">
                        <Outlet />
                    </main>
                </div>
            </div>
        </LayoutContainer>
    );
};
