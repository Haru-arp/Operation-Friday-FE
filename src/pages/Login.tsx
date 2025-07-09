import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hook/useLogin";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
export default function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: login, isPending, isError: _ } = useLogin();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(
            { email, password },
            {
                onSuccess: (res) => {
                    const accessToken = res.data?.accessToken;

                    if (accessToken) {
                        document.cookie = `accessToken=${accessToken}; path=/; max-age=900; SameSite=Strict; Secure`;
                        // ✅ 사용자 정보 캐시 강제 새로고침 → useMe() 안에서 Zustand에 자동 저장
                        queryClient.invalidateQueries({ queryKey: ["me"] });
                        console.log("로그인 성공", res);
                        navigate("/");
                    } else {
                        console.warn("❗️ accessToken이 응답에 없습니다");
                    }
                },
                onError: (err) => {
                    console.log("로그인 실패", err);
                    toast.error("로그인 실패", {
                        description: "이메일 또는 비밀번호가 올바르지 않습니다.",
                        duration: 3000,
                    });
                },
            }
        );
    };

    const handleSocialLogin = (provider: string) => {
        try {
            // 실제 소셜 로그인 로직은 여기에 구현
            // 지금은 간단히 로컬 스토리지에 저장
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("provider", provider);

            // 소셜 로그인 제공자에 따라 다른 사용자 정보 설정
            if (provider === "google") {
                localStorage.setItem("userName", "구글 사용자");
                localStorage.setItem("userEmail", "google@example.com");
            } else if (provider === "kakao") {
                localStorage.setItem("userName", "카카오 사용자");
                localStorage.setItem("userEmail", "kakao@example.com");
            } else if (provider === "naver") {
                localStorage.setItem("userName", "네이버 사용자");
                localStorage.setItem("userEmail", "naver@example.com");
            }

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            console.error(`${provider} 로그인 중 오류 발생:`, error);
        }
    };

    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center space-y-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">F</span>
                        </div>
                        <CardTitle className="text-2xl font-bold">FRIDAY</CardTitle>
                        <CardDescription>AI와 함께하는 스마트 가계부</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">이메일</Label>
                                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span> 로그인 중...
                                    </>
                                ) : (
                                    "로그인"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">또는</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" className="w-full h-12 text-base" onClick={() => handleSocialLogin("google")} disabled={isPending}>
                                <FcGoogle className="mr-3 h-5 w-5" />
                                Google로 로그인
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 bg-[#FEE500] dark:bg-[#FEE500]  hover:bg-[#FEE500]/90 dark:hover:bg-[#FEE500]/90 text-black border-[#FEE500] text-base"
                                onClick={() => handleSocialLogin("kakao")}
                                disabled={isPending}
                            >
                                <RiKakaoTalkFill className="mr-3 h-5 w-5 text-black" />
                                카카오로 로그인
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 bg-[#03C75A] dark:bg-[#03C75A] hover:bg-[#03C75A]/90  dark:hover:bg-[#03C75A]/90 text-white border-[#03C75A] text-base"
                                onClick={() => handleSocialLogin("naver")}
                                disabled={isPending}
                            >
                                <SiNaver className="mr-3 h-5 w-5" />
                                네이버로 로그인
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            계정이 없으신가요?
                            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                                회원가입
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <Toaster richColors theme="system" position="top-center" />
        </>
    );
}
