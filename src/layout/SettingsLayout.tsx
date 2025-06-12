import { Outlet } from "react-router-dom";

export const SettingsLayout = () => {
    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <Outlet />
        </div>
    );
};
