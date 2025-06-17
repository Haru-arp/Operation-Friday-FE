import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  RefreshCw,
  Target,
  Plus,
  Minus,
  Calculator,
} from "lucide-react";

// 최신화된 분개 가이드 데이터
const transactionGuides = {
  income: {
    name: "수익 (Income)",
    icon: TrendingUp,
    color: "bg-green-500",
    description: "들어오는 수입에 대한 분개",
    examples: [
      {
        name: "근로소득",
        description: "월급, 상여금, 야근수당",
        debit: "예금",
        debitChange: "+",
        credit: "기본급",
        creditChange: "+",
        example: "월급 300만원 입금",
        amount: 3000000,
      },
      {
        name: "투자수익 (배당금)",
        description: "주식 배당금",
        debit: "예금",
        debitChange: "+",
        credit: "주식 배당금",
        creditChange: "+",
        example: "삼성전자 배당금 10만원",
        amount: 100000,
      },
      {
        name: "이자수익",
        description: "예금 이자, 적금 이자",
        debit: "예금",
        debitChange: "+",
        credit: "예적금 이자",
        creditChange: "+",
        example: "정기예금 이자 5만원",
        amount: 50000,
      },
      {
        name: "부업소득",
        description: "아르바이트, 프리랜서",
        debit: "예금",
        debitChange: "+",
        credit: "프리랜서",
        creditChange: "+",
        example: "프리랜서 수입 50만원",
        amount: 500000,
      },
    ],
  },
  expense: {
    name: "비용 (Expense)",
    icon: TrendingDown,
    color: "bg-red-500",
    description: "나가는 지출에 대한 분개",
    examples: [
      {
        name: "식비",
        description: "외식, 배달, 식료품",
        debit: "외식",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "점심 식사 1만원",
        amount: 10000,
      },
      {
        name: "교통비",
        description: "대중교통, 주유비, 택시",
        debit: "대중교통",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "지하철 요금 1,500원",
        amount: 1500,
      },
      {
        name: "주거비",
        description: "월세, 관리비, 공과금",
        debit: "월세/관리비",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "월세 100만원",
        amount: 1000000,
      },
      {
        name: "문화/여가비",
        description: "영화, 여행, 취미활동",
        debit: "영화/공연",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "영화 관람 1만5천원",
        amount: 15000,
      },
    ],
  },
  transfer: {
    name: "자산이동 (Transfer)",
    icon: RefreshCw,
    color: "bg-blue-500",
    description: "자산 간 이동에 대한 분개",
    examples: [
      {
        name: "계좌 간 이체",
        description: "은행 간 이체",
        debit: "예금(입금계좌)",
        debitChange: "+",
        credit: "예금(출금계좌)",
        creditChange: "-",
        example: "국민은행에서 신한은행으로 50만원 이체",
        amount: 500000,
      },
      {
        name: "현금 인출",
        description: "ATM 현금 인출",
        debit: "현금",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "ATM에서 10만원 인출",
        amount: 100000,
      },
      {
        name: "투자자산 매수",
        description: "주식, 펀드 구매",
        debit: "장기주식",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "삼성전자 주식 100만원 매수",
        amount: 1000000,
      },
    ],
  },
  card: {
    name: "카드거래 (Card)",
    icon: CreditCard,
    color: "bg-purple-500",
    description: "신용카드 관련 분개",
    examples: [
      {
        name: "카드 결제",
        description: "카드로 결제",
        debit: "외식",
        debitChange: "+",
        credit: "카드 미지급금",
        creditChange: "+",
        example: "카드로 식비 3만원 결제",
        amount: 30000,
      },
      {
        name: "카드대금 납부",
        description: "카드 대금 결제",
        debit: "카드 미지급금",
        debitChange: "-",
        credit: "예금",
        creditChange: "-",
        example: "카드대금 80만원 납부",
        amount: 800000,
      },
      {
        name: "카드론 이용",
        description: "카드론 사용",
        debit: "예금",
        debitChange: "+",
        credit: "카드론",
        creditChange: "+",
        example: "카드론 50만원 이용",
        amount: 500000,
      },
    ],
  },
  investment: {
    name: "투자 (Investment)",
    icon: Target,
    color: "bg-indigo-500",
    description: "투자 관련 분개",
    examples: [
      {
        name: "주식 매수",
        description: "주식, ETF 구매",
        debit: "장기주식",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "삼성전자 주식 100만원 매수",
        amount: 1000000,
      },
      {
        name: "주식 매도",
        description: "주식, ETF 판매",
        debit: "예금",
        debitChange: "+",
        credit: "장기주식",
        creditChange: "-",
        example: "LG전자 주식 50만원 매도",
        amount: 500000,
      },
      {
        name: "부동산 투자",
        description: "부동산 구매",
        debit: "아파트/주택",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "아파트 3억원 구매",
        amount: 300000000,
      },
      {
        name: "연금저축 납입",
        description: "연금저축 적립",
        debit: "연금저축",
        debitChange: "+",
        credit: "예금",
        creditChange: "-",
        example: "연금저축 월 30만원 납입",
        amount: 300000,
      },
    ],
  },
};
export default function Guide() {
  const [selectedType, setSelectedType] =
    useState<keyof typeof transactionGuides>("income");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          복식부기 분개 가이드
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          거래 유형별 정확한 분개 방법을 학습하세요
        </p>
      </div>

      <Tabs
        value={selectedType}
        onValueChange={(value) =>
          setSelectedType(value as keyof typeof transactionGuides)
        }
      >
        <TabsList className="grid w-full h-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
          {Object.entries(transactionGuides).map(([key, guide]) => {
            const Icon = guide.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                <div
                  className={`w-6 h-6 ${guide.color} rounded-md flex items-center justify-center`}
                >
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">{guide.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(transactionGuides).map(([key, guide]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div
                    className={`w-10 h-10 ${guide.color} rounded-lg flex items-center justify-center`}
                  >
                    <guide.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl">{guide.name}</div>
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {guide.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {guide.examples.map((example, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {example.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {example.description}
                          </p>
                          <div className="mt-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                            >
                              예시: {example.example}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(example.amount)}
                          </div>
                        </div>
                      </div>

                      {/* 분개 구조 */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            분개 구조
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              차변 (DR)
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                              <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                                {example.debit}
                              </div>
                              <div className="flex items-center justify-center mt-1">
                                {example.debitChange === "+" ? (
                                  <Plus className="h-4 w-4 text-green-600" />
                                ) : example.debitChange === "-" ? (
                                  <Minus className="h-4 w-4 text-red-600" />
                                ) : (
                                  <span className="text-gray-600">±</span>
                                )}
                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                  {example.debitChange === "+"
                                    ? "증가"
                                    : example.debitChange === "-"
                                    ? "감소"
                                    : "증감"}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mt-1">
                                {formatCurrency(example.amount)}
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              대변 (CR)
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border-2 border-green-200 dark:border-green-700">
                              <div className="font-medium text-green-900 dark:text-green-100 text-sm">
                                {example.credit}
                              </div>
                              <div className="flex items-center justify-center mt-1">
                                {example.creditChange === "+" ? (
                                  <Plus className="h-4 w-4 text-green-600" />
                                ) : example.creditChange === "-" ? (
                                  <Minus className="h-4 w-4 text-red-600" />
                                ) : (
                                  <span className="text-gray-600">±</span>
                                )}
                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                  {example.creditChange === "+"
                                    ? "증가"
                                    : example.creditChange === "-"
                                    ? "감소"
                                    : "증감"}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-green-900 dark:text-green-100 mt-1">
                                {formatCurrency(example.amount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
