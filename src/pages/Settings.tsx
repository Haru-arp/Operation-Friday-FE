import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Transaction } from "@/types/transaction";
import { RefreshCw, TrendingUp, HandCoins, TrendingDown, CreditCard } from "lucide-react";
import { InitialTransactionWizard } from "@/components/ui/wizard/initialTransaction-wizard";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModifyName } from "@/hook/useSettings";
import { useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(null);
  const { mutate: modifyName, } = useModifyName();

  const handleSave = () => {

    modifyName({ name: userName }, {
      onSuccess: () => {
        // 2. 사용자 정보 쿼리 무효화 → 자동으로 refetch

        alert("설정이 저장되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["me"] });
        if (user) {
          setUser({
            ...user,
            name: userName  // 새로운 이름으로 업데이트
          });
        }
      },
      onError: (error) => {
        console.error("설정 저장 중 오류 발생:", error);

      }
    });
  }
  const handleInitialTransactionClick = (transactionType: string) => {
    setSelectedTransactionType(transactionType);
    setIsTransactionDialogOpen(true);
  };

  const handleTransactionSave = (transaction: Transaction) => {
    try {
      // 기존 거래 내역 가져오기
      const savedTransactions = localStorage.getItem("transactions");
      let transactions = [];

      if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
      }

      // 새 거래에 ID와 생성 시간 추가
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // 거래 내역 업데이트
      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      alert("거래가 저장되었습니다.");
      setIsTransactionDialogOpen(false);
      setSelectedTransactionType(null);
    } catch (error) {
      console.error("거래 저장 중 오류 발생:", error);
      alert("거래를 저장하는 중 오류가 발생했습니다.");
    }
  };

  const initialTransactionTypes = [
    {
      id: "debt_transfer",
      name: "부채 대체",
      icon: RefreshCw,
      color: "bg-indigo-500",
      description: "대환대출, 리볼빙",
    },
    {
      id: "asset_initial",
      name: "자산 초기 등록",
      icon: TrendingUp,
      color: "bg-emerald-500",
      description: "보유 현금/계좌 등록",
    },
    {
      id: "debt_asset_creation",
      name: "부채로 자산 생성",
      icon: HandCoins,
      color: "bg-cyan-500",
      description: "대출로 만든 자산",
    },
    {
      id: "asset_decrease",
      name: "자산 감소",
      icon: TrendingDown,
      color: "bg-gray-500",
      description: "자본 회수",
    },
    {
      id: "debt_only_start",
      name: "부채만 있는 시작",
      icon: CreditCard,
      color: "bg-rose-500",
      description: "카드값만 있는 상태",
    },
    {
      id: "capital_reclassify",
      name: "자본 재분류",
      icon: RefreshCw,
      color: "bg-violet-500",
      description: "자본 항목 간 이동",
    },
  ];



  useEffect(() => {
    setMounted(true);
    try {
      // 전역 user 정보 우선 사용, 없으면 localStorage fallback
      setUserName(user?.name || "");
      setUserEmail(user?.email || "");
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
    }
  }, [navigate, user]); // user를 dependency에 추가

  if (!mounted) {
    return;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">계정 설정</TabsTrigger>
          <TabsTrigger value="initial">기초 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>계정 설정</CardTitle>
              <CardDescription>계정 정보를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input disabled id="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>저장</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>앱 설정</CardTitle>
              <CardDescription>앱 사용 환경을 설정하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">알림</Label>
                  <p className="text-sm text-muted-foreground">중요 알림을 받아보세요.</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">다크 모드</Label>
                  <p className="text-sm text-muted-foreground">어두운 테마로 사용합니다.</p>
                </div>
                <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => console.log('앱 설정 저장')}>저장</Button>
          </div>
        </TabsContent>

        <TabsContent value="initial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기초 설정</CardTitle>
              <CardDescription>가계부 시작을 위한 초기 자산/부채 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialTransactionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button key={type.id} variant="outline" className="h-20 flex flex-col justify-center" onClick={() => handleInitialTransactionClick(type.id)}>
                      <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mr-2`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="font-medium">{type.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>기초 설정 거래 입력</DialogTitle>
            <DialogDescription>초기 자산/부채 설정을 위한 거래를 입력하세요.</DialogDescription>
          </DialogHeader>
          {selectedTransactionType && <InitialTransactionWizard onSave={handleTransactionSave} transactionType={selectedTransactionType} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
