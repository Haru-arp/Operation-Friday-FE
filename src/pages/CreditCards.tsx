import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Search, CreditCard, Calendar } from "lucide-react";

interface CreditCardInfo {
    id: string;
    name: string;
    paymentDay: number;
    usageStartDay: number;
    usageEndDay: number;
    linkedAsset: string;
}

interface MonthlyDebt {
    cardId: string;
    cardName: string;
    amount: number;
    usagePeriod: string;
    paymentDay: number;
    percentage?: number;
}

interface MonthlyData {
    month: string;
    totalAmount: number;
    cards: MonthlyDebt[];
}

export default function CreditCards() {
    const [startMonth, setStartMonth] = useState("202506");
    const [endMonth, setEndMonth] = useState("202508");
    const [_creditCards, setCreditCards] = useState<CreditCardInfo[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    // const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const sampleCards: CreditCardInfo[] = [
            { id: "1", name: "신한Mr.Life", paymentDay: 14, usageStartDay: 1, usageEndDay: 31, linkedAsset: "신한은행 예금" },
            { id: "2", name: "하나SK패밀리", paymentDay: 13, usageStartDay: 1, usageEndDay: 31, linkedAsset: "하나은행 예금" },
            { id: "3", name: "네이버현대", paymentDay: 12, usageStartDay: 1, usageEndDay: 31, linkedAsset: "국민은행 예금" },
            { id: "4", name: "쿠팡국민", paymentDay: 14, usageStartDay: 1, usageEndDay: 31, linkedAsset: "국민은행 예금" },
        ];

        const sampleMonthlyData: MonthlyData[] = [
            {
                month: "2025-06",
                totalAmount: 2282790,
                cards: [
                    { cardId: "1", cardName: "신한Mr.Life", amount: 1248410, usagePeriod: "05-01 ~ 05-31", paymentDay: 14, percentage: 124 },
                    { cardId: "2", cardName: "하나SK패밀리", amount: 340000, usagePeriod: "05-01 ~ 05-31", paymentDay: 13 },
                    { cardId: "3", cardName: "네이버현대", amount: 617480, usagePeriod: "05-01 ~ 05-31", paymentDay: 12, percentage: 205 },
                    { cardId: "4", cardName: "쿠팡국민", amount: 76900, usagePeriod: "05-01 ~ 05-31", paymentDay: 14 },
                ],
            },
            {
                month: "2025-07",
                totalAmount: 1184787,
                cards: [
                    { cardId: "1", cardName: "신한Mr.Life", amount: 794255, usagePeriod: "06-01 ~ 06-30", paymentDay: 14, percentage: 79 },
                    { cardId: "2", cardName: "하나SK패밀리", amount: 176730, usagePeriod: "06-01 ~ 06-30", paymentDay: 13 },
                    { cardId: "3", cardName: "네이버현대", amount: 213802, usagePeriod: "06-01 ~ 06-30", paymentDay: 12, percentage: 71 },
                    { cardId: "4", cardName: "쿠팡국민", amount: 0, usagePeriod: "06-01 ~ 06-30", paymentDay: 14 },
                ],
            },
        ];

        setCreditCards(sampleCards);
        setMonthlyData(sampleMonthlyData);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ko-KR").format(amount);
    };

    const getProgressValue = (amount: number, totalAmount: number) => {
        return totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="h-6 w-6" /> 신용카드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">월별 신용카드 부채 현황을 확인하세요</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button variant="ghost" className="text-gray-600 dark:text-gray-400">
                        <ChevronLeft className="h-4 w-4 mr-1" /> 이전 기간
                    </Button>

                    <div className="flex flex-wrap gap-2 items-center">
                        <Input value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="w-24 text-center" placeholder="YYYYMM" />
                        <span className="text-gray-500">~</span>
                        <Input value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="w-24 text-center" placeholder="YYYYMM" />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                            연도별
                        </Button>
                        <Button variant="outline" size="sm">
                            분기별
                        </Button>
                        <Button variant="outline" size="sm">
                            월별
                        </Button>
                    </div>

                    <Button variant="ghost" className="text-gray-600 dark:text-gray-400">
                        이후 기간 <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                {monthlyData.map((monthData) => (
                    <div key={monthData.month} className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{monthData.month}</h2>

                        <Card className="border-l-4 border-blue-500">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <CreditCard className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">총 금액</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(monthData.totalAmount)}</span>
                                    <Button variant="ghost" size="sm">
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            {monthData.cards.map((card) => (
                                <Card key={card.cardId} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                                                    <CreditCard className="h-3 w-3 text-white" />
                                                </div>
                                                <span className="truncate font-medium text-gray-900 dark:text-white text-sm sm:text-base">{card.cardName}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                {card.percentage && (
                                                    <Badge variant={card.percentage > 100 ? "destructive" : "secondary"} className="text-xs">
                                                        {card.percentage}%
                                                    </Badge>
                                                )}
                                                <span>{card.usagePeriod}</span>
                                                <span>{card.paymentDay}일</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-2 min-w-0 w-full">
                                            <Progress value={getProgressValue(card.amount, monthData.totalAmount)} className="h-2 w-full" />
                                            <span className="text-right font-semibold text-gray-900 dark:text-white w-full sm:w-[100px]">{formatCurrency(card.amount)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {monthlyData.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">신용카드 데이터가 없습니다</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">계정관리에서 신용카드를 추가하고 거래를 입력해보세요</p>
                            <Button onClick={() => (window.location.href = "/accounts")}>계정관리로 이동</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
