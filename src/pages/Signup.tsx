import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { useState } from "react";
import { useSignup } from "@/hook/useLogin";

export default function Signup() {
    const navigate = useNavigate();
    const { mutate: signup, isPending, isError } = useSignup();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // if (!agreeTerms) {
        //     alert("이용약관에 동의해주세요.");
        //     return;
        // }

        setIsLoading(true);

        try {
            // 실제 회원가입 로직은 여기에 구현
            signup(
                {
                    email,
                    password,
                    name,
                },
                {
                    onSuccess: (res) => {
                        console.log("회원가입 성공", res);
                        navigate("/");
                    },
                    onError: (err) => {
                        console.log("회원가입 실패", err);
                    },
                }
            );
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            setIsLoading(false);
        }
    };

    const handleSocialSignup = (provider: string) => {
        setIsLoading(true);

        try {
            // 실제 소셜 회원가입 로직은 여기에 구현
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
            console.error(`${provider} 회원가입 중 오류 발생:`, error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">F</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
                    <CardDescription>FRIDAY 서비스를 이용하기 위한 계정을 만드세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">닉네임</Label>
                            <Input id="name" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">비밀번호 확인</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        {/* <div className="flex items-center space-x-2">
                            <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(!!checked)} />
                            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <span className="text-gray-700 dark:text-gray-300">
                                    <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                        이용약관
                                    </Link>
                                    에 동의합니다
                                </span>
                            </label>
                        </div> */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span> 가입 중...
                                </>
                            ) : (
                                "가입하기"
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
                        <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2" onClick={() => handleSocialSignup("google")} disabled={isLoading}>
                            <FcGoogle className="h-5 w-5" />
                            Google로 회원가입
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-[#FEE500]"
                            onClick={() => handleSocialSignup("kakao")}
                            disabled={isLoading}
                        >
                            <RiKakaoTalkFill className="h-5 w-5 text-black" />
                            카카오로 회원가입
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#03C75A]/90 text-white border-[#03C75A]"
                            onClick={() => handleSocialSignup("naver")}
                            disabled={isLoading}
                        >
                            <SiNaver className="h-5 w-5" />
                            네이버로 회원가입
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        이미 계정이 있으신가요?
                        <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                            로그인
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
