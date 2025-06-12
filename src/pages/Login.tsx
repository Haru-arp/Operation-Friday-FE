import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true);

        setTimeout(() => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("provider", provider);
            localStorage.setItem("userName", "이동희");
            localStorage.setItem("userEmail", "rou012001@gmail.com");
            navigate("/");
        }, 1000);
    };

    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">복</span>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">복식부기 가계부</CardTitle>
                        <CardDescription className="mt-2">AI와 함께하는 스마트 가계부</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full h-12 text-base" onClick={() => handleSocialLogin("google")} disabled={isLoading}>
                        <FcGoogle className="mr-3 h-5 w-5" />
                        Google로 로그인
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 bg-[#FEE500] dark:bg-[#FEE500]  hover:bg-[#FEE500]/90 dark:hover:bg-[#FEE500]/90 text-black border-[#FEE500] text-base"
                        onClick={() => handleSocialLogin("kakao")}
                        disabled={isLoading}
                    >
                        <RiKakaoTalkFill className="mr-3 h-5 w-5 text-black" />
                        카카오로 로그인
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 bg-[#03C75A] dark:bg-[#03C75A] hover:bg-[#03C75A]/90  dark:hover:bg-[#03C75A]/90 text-white border-[#03C75A] text-base"
                        onClick={() => handleSocialLogin("naver")}
                        disabled={isLoading}
                    >
                        <SiNaver className="mr-3 h-5 w-5" />
                        네이버로 로그인
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
