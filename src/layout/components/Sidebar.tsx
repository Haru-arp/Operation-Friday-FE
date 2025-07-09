import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, LogOut, Sparkles, Menu } from "lucide-react";
import { menuItems } from "@/constants/routeItems";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLogout } from "@/hook/useLogin";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
// interface SidebarProps {
//     userName: string;
//     userEmail: string;
// }

export default function Sidebar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const location = useLocation();
    const user = useAuthStore((state) => state.user);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [_mounted, setMounted] = useState(false);
    const { mutate: logout, isPending: _isPending, isError: _isError } = useLogout();
    // 컴포넌트가 마운트된 후에만 테마 관련 UI를 렌더링
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        try {
            logout(undefined, {
                onSuccess: () => {
                    alert("로그아웃 성공");
                    document.cookie = "accessToken=; path=/; max-age=0";
                    useAuthStore.getState().clearUser();
                    queryClient.removeQueries({ queryKey: ["me"] });
                },
                onError: (err) => {
                    console.error("err", err);
                },
            });
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    // 사이드바 내용 컴포넌트 - 데스크톱과 모바일에서 재사용
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* 로고 */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white">FRIDAY</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">AI 가계부</p>
                    </div>
                </div>
            </div>

            {/* 메뉴 */}
            <nav aria-label="주 메뉴" className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                            onClick={() => {
                                navigate(item.path);
                                setIsMobileMenuOpen(false); // 모바일에서 메뉴 클릭 시 사이드바 닫기
                            }}
                        >
                            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mr-3`}>
                                <Icon className="h-4 w-4 text-white" />
                            </div>
                            {item.label}
                        </Button>
                    );
                })}
            </nav>

            {/* AI 프리미엄 */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
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
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-gray-600 dark:text-gray-400"
                        onClick={() => {
                            navigate("/settings");
                            setIsMobileMenuOpen(false);
                        }}
                    >
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

    return (
        <>
            {/* 모바일 햄버거 메뉴 버튼 - 모바일에서만 표시 */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-md">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">메뉴 열기</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0 overflow-y-auto">
                        <SheetTitle className="sr-only">사이드바 메뉴</SheetTitle>
                        <SheetDescription className="sr-only">이 사이드바에서는 페이지 탐색, 사용자 설정, 로그아웃 등을 할 수 있습니다.</SheetDescription>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* 데스크톱 사이드바 - 모바일에서는 숨김 */}
            <div className="hidden md:flex h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col z-20 overflow-hidden">
                <SidebarContent />
            </div>
        </>
    );
}
