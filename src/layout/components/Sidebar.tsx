import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, LogOut, Sparkles, Moon, Sun } from "lucide-react";
import { menuItems } from "@/constants/routeItems";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SidebarProps {
    userName: string;
    userEmail: string;
}

export default function Sidebar({ userName, userEmail }: SidebarProps) {
    const router = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkMode = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(darkMode);
        if (darkMode) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem("darkMode", newDarkMode.toString());
        if (newDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router("/login");
    };

    return (
        <div className="h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* 로고 */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">복</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">복식부기</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">AI 가계부</p>
                    </div>
                </div>
            </div>

            {/* 메뉴 */}
            <nav className="overflow-y-auto flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Button
                            key={item.path}
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start h-12 ${
                                isActive
                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => router(item.path)}
                        >
                            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mr-3`}>
                                <Icon className="h-4 w-4 text-white" />
                            </div>
                            {item.label}
                        </Button>
                    );
                })}
            </nav>

            {/* 다크모드 토글 */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isDarkMode ? <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" /> : <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
                        <Label htmlFor="dark-mode" className="text-sm text-gray-600 dark:text-gray-400">
                            다크모드
                        </Label>
                    </div>
                    <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                </div>
            </div>

            {/* AI 프리미엄 */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium text-sm">AI 프리미엄</span>
                    </div>
                    <p className="text-xs opacity-90 mb-3">스마트 분석과 맞춤 조언을 받아보세요</p>
                    <Button size="sm" variant="secondary" className="w-full text-xs">
                        업그레이드
                    </Button>
                </div>
            </div>

            {/* 사용자 정보 */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                    {/* <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{userName.charAt(0)}</AvatarFallback>
                    </Avatar> */}
                    <div className="h-10 w-10 rounded-full">
                        <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex h-full w-full items-center justify-center rounded-full">{userName.charAt(0)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-gray-900 dark:text-white">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 dark:text-gray-400" onClick={() => router("/settings")}>
                        <Settings className="h-4 w-4 mr-2" />
                        설정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 dark:text-gray-400">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
