import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CreditCard,
  Calendar,
} from "lucide-react";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 샘플 데이터 로드
  useEffect(() => {
    const sampleCards: CreditCardInfo[] = [
      {
        id: "1",
        name: "신한Mr.Life",
        paymentDay: 14,
        usageStartDay: 1,
        usageEndDay: 31,
        linkedAsset: "신한은행 예금",
      },
      {
        id: "2",
        name: "하나SK패밀리",
        paymentDay: 13,
        usageStartDay: 1,
        usageEndDay: 31,
        linkedAsset: "하나은행 예금",
      },
      {
        id: "3",
        name: "네이버현대",
        paymentDay: 12,
        usageStartDay: 1,
        usageEndDay: 31,
        linkedAsset: "국민은행 예금",
      },
      {
        id: "4",
        name: "쿠팡국민",
        paymentDay: 14,
        usageStartDay: 1,
        usageEndDay: 31,
        linkedAsset: "국민은행 예금",
      },
    ];

    const sampleMonthlyData: MonthlyData[] = [
      {
        month: "2025-06",
        totalAmount: 2282790,
        cards: [
          {
            cardId: "1",
            cardName: "신한Mr.Life",
            amount: 1248410,
            usagePeriod: "05-01 ~ 05-31",
            paymentDay: 14,
            percentage: 124,
          },
          {
            cardId: "2",
            cardName: "하나SK패밀리",
            amount: 340000,
            usagePeriod: "05-01 ~ 05-31",
            paymentDay: 13,
          },
          {
            cardId: "3",
            cardName: "네이버현대",
            amount: 617480,
            usagePeriod: "05-01 ~ 05-31",
            paymentDay: 12,
            percentage: 205,
          },
          {
            cardId: "4",
            cardName: "쿠팡국민",
            amount: 76900,
            usagePeriod: "05-01 ~ 05-31",
            paymentDay: 14,
          },
        ],
      },
      {
        month: "2025-07",
        totalAmount: 1184787,
        cards: [
          {
            cardId: "1",
            cardName: "신한Mr.Life",
            amount: 794255,
            usagePeriod: "06-01 ~ 06-30",
            paymentDay: 14,
            percentage: 79,
          },
          {
            cardId: "2",
            cardName: "하나SK패밀리",
            amount: 176730,
            usagePeriod: "06-01 ~ 06-30",
            paymentDay: 13,
          },
          {
            cardId: "3",
            cardName: "네이버현대",
            amount: 213802,
            usagePeriod: "06-01 ~ 06-30",
            paymentDay: 12,
            percentage: 71,
          },
          {
            cardId: "4",
            cardName: "쿠팡국민",
            amount: 0,
            usagePeriod: "06-01 ~ 06-30",
            paymentDay: 14,
          },
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

  const navigateMonth = (direction: "prev" | "next") => {
    // 월 네비게이션 로직 (실제 구현 시 추가)
    console.log(`Navigate ${direction}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                신용카드
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                월별 신용카드 부채 현황을 확인하세요
              </p>
            </div>
          </div>

          {/* 기간 선택 및 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigateMonth("prev")}
              className="text-gray-600 dark:text-gray-400"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              이전 기간
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-24 text-center"
                  placeholder="YYYYMM"
                />
                <span className="text-gray-500">~</span>
                <Input
                  type="text"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="w-24 text-center"
                  placeholder="YYYYMM"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
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
            </div>

            <Button
              variant="ghost"
              onClick={() => navigateMonth("next")}
              className="text-gray-600 dark:text-gray-400"
            >
              이후 기간
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* 총합 섹션 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isCollapsed ? "" : "rotate-90"
              }`}
            />
            총합
          </Button>
        </div>

        {/* 월별 데이터 */}
        <div className="space-y-8">
          {monthlyData.map((monthData) => (
            <div key={monthData.month} className="space-y-4">
              {/* 월 헤더 */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {monthData.month}
                </h2>
              </div>

              {/* 총 금액 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        총 금액
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(monthData.totalAmount)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 개별 카드 */}
              <div className="space-y-3">
                {monthData.cards.map((card) => (
                  <Card
                    key={card.cardId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                            <CreditCard className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {card.cardName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {card.percentage && (
                            <Badge
                              variant={
                                card.percentage > 100
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {card.percentage}%
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {card.usagePeriod}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {card.paymentDay}일
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress
                            value={getProgressValue(
                              card.amount,
                              monthData.totalAmount
                            )}
                            className="h-2"
                          />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white min-w-[100px] text-right">
                          {card.amount > 0 ? formatCurrency(card.amount) : "0"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {monthlyData.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                신용카드 데이터가 없습니다
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                계정관리에서 신용카드를 추가하고 거래를 입력해보세요
              </p>
              <Button onClick={() => (window.location.href = "/accounts")}>
                계정관리로 이동
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
