import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, TrendingUp, RefreshCw, Minus, ArrowRightLeft, PlusCircle, Building, TrendingDown, AlertTriangle, Settings, Plus, Calculator } from "lucide-react";
import { getAccountTypeColor } from "@/lib/transactionHelpers";
import clsx from "clsx";

// 11개 거래 유형별 분개 가이드 데이터
const transactionGuides = {
    // 거래 입력 화면 (1-6번)
    cashExpense: {
        name: "현금 지출",
        category: "거래 입력",
        icon: Wallet,
        color: "bg-red-500",
        description: "현금이나 계좌에서 직접 지출하는 경우",
        formula: "비용(+) & 자산(-)",
        examples: [
            {
                name: "현금으로 식비 지출",
                description: "현금으로 점심 식사비 결제",
                debit: "외식",
                debitType: "비용",
                debitChange: "+",
                credit: "현금",
                creditType: "자산",
                creditChange: "-",
                example: "현금으로 점심 1만원 결제",
                amount: 10000,
            },
            {
                name: "계좌이체로 월세 지출",
                description: "은행 계좌에서 월세 이체",
                debit: "월세/관리비",
                debitType: "비용",
                debitChange: "+",
                credit: "예금",
                creditType: "자산",
                creditChange: "-",
                example: "월세 100만원 계좌이체",
                amount: 1000000,
            },
        ],
    },
    creditExpense: {
        name: "외상 지출",
        category: "거래 입력",
        icon: CreditCard,
        color: "bg-purple-500",
        description: "신용카드나 외상으로 지출하는 경우",
        formula: "비용(+) & 부채(+)",
        examples: [
            {
                name: "카드로 식비 지출",
                description: "신용카드로 식사비 결제",
                debit: "외식",
                debitType: "비용",
                debitChange: "+",
                credit: "카드 미지급금",
                creditType: "부채",
                creditChange: "+",
                example: "카드로 저녁 3만원 결제",
                amount: 30000,
            },
            {
                name: "외상으로 물품 구매",
                description: "외상으로 사무용품 구매",
                debit: "기타잡비",
                debitType: "비용",
                debitChange: "+",
                credit: "미지급금",
                creditType: "부채",
                creditChange: "+",
                example: "외상으로 사무용품 5만원 구매",
                amount: 50000,
            },
        ],
    },
    incomeGeneration: {
        name: "수익 발생",
        category: "거래 입력",
        icon: TrendingUp,
        color: "bg-green-500",
        description: "수입이 발생하는 경우",
        formula: "자산(+) & 수익(+)",
        examples: [
            {
                name: "급여 수령",
                description: "월급이 계좌로 입금",
                debit: "예금",
                debitType: "자산",
                debitChange: "+",
                credit: "기본급",
                creditType: "수익",
                creditChange: "+",
                example: "월급 300만원 입금",
                amount: 3000000,
            },
            {
                name: "배당금 수령",
                description: "주식 배당금 입금",
                debit: "예금",
                debitType: "자산",
                debitChange: "+",
                credit: "주식 배당금",
                creditType: "수익",
                creditChange: "+",
                example: "삼성전자 배당금 10만원",
                amount: 100000,
            },
        ],
    },
    assetTransfer: {
        name: "자산 이동",
        category: "거래 입력",
        icon: RefreshCw,
        color: "bg-blue-500",
        description: "자산 간 이동하는 경우",
        formula: "자산(+) & 자산(-)",
        examples: [
            {
                name: "계좌 간 이체",
                description: "A은행에서 B은행으로 이체",
                debit: "예금(신한은행)",
                debitType: "자산",
                debitChange: "+",
                credit: "예금(국민은행)",
                creditType: "자산",
                creditChange: "-",
                example: "국민은행에서 신한은행으로 50만원 이체",
                amount: 500000,
            },
            {
                name: "주식 매수",
                description: "현금으로 주식 구매",
                debit: "장기주식",
                debitType: "자산",
                debitChange: "+",
                credit: "예금",
                creditType: "자산",
                creditChange: "-",
                example: "삼성전자 주식 100만원 매수",
                amount: 1000000,
            },
        ],
    },
    debtRepayment: {
        name: "부채 상환",
        category: "거래 입력",
        icon: Minus,
        color: "bg-orange-500",
        description: "빌린 돈을 갚는 경우",
        formula: "부채(-) & 자산(-)",
        examples: [
            {
                name: "카드대금 납부",
                description: "신용카드 대금 결제",
                debit: "카드 미지급금",
                debitType: "부채",
                debitChange: "-",
                credit: "예금",
                creditType: "자산",
                creditChange: "-",
                example: "카드대금 80만원 납부",
                amount: 800000,
            },
            {
                name: "대출 상환",
                description: "은행 대출 원금 상환",
                debit: "신용대출",
                debitType: "부채",
                debitChange: "-",
                credit: "예금",
                creditType: "자산",
                creditChange: "-",
                example: "신용대출 100만원 상환",
                amount: 1000000,
            },
        ],
    },

    // 설정 화면 기초 설정 (7-11번)
    initialAsset: {
        name: "자산 초기 등록",
        category: "기초 설정",
        icon: PlusCircle,
        color: "bg-emerald-500",
        description: "보유하고 있던 자산을 처음 등록하는 경우",
        formula: "자산(+) & 자본(+)",
        examples: [
            {
                name: "보유 현금 등록",
                description: "지갑에 있던 현금 등록",
                debit: "현금",
                debitType: "자산",
                debitChange: "+",
                credit: "기초자본",
                creditType: "자본",
                creditChange: "+",
                example: "보유 현금 50만원 등록",
                amount: 500000,
            },
            {
                name: "은행 잔고 등록",
                description: "기존 계좌 잔고 등록",
                debit: "예금",
                debitType: "자산",
                debitChange: "+",
                credit: "기초자본",
                creditType: "자본",
                creditChange: "+",
                example: "국민은행 잔고 1000만원 등록",
                amount: 10000000,
            },
        ],
    },
    assetFromDebt: {
        name: "부채로 자산 생성",
        category: "기초 설정",
        icon: Building,
        color: "bg-cyan-500",
        description: "대출로 자산을 구매한 상황을 등록하는 경우",
        formula: "자산(+) & 부채(+)",
        examples: [
            {
                name: "주택담보대출로 집 구매",
                description: "대출로 구매한 아파트 등록",
                debit: "아파트/주택",
                debitType: "자산",
                debitChange: "+",
                credit: "주택담보대출",
                creditType: "부채",
                creditChange: "+",
                example: "대출로 구매한 아파트 5억원 등록",
                amount: 500000000,
            },
            {
                name: "자동차할부로 차량 구매",
                description: "할부로 구매한 자동차 등록",
                debit: "자동차",
                debitType: "자산",
                debitChange: "+",
                credit: "자동차할부",
                creditType: "부채",
                creditChange: "+",
                example: "할부로 구매한 자동차 3000만원 등록",
                amount: 30000000,
            },
        ],
    },
    assetDecrease: {
        name: "자산 감소",
        category: "기초 설정",
        icon: TrendingDown,
        color: "bg-red-600",
        description: "자산이 줄어든 상황을 등록하는 경우",
        formula: "자본(-) & 자산(-)",
        examples: [
            {
                name: "자산 손실 등록",
                description: "투자 손실이나 자산 가치 하락",
                debit: "자본조정",
                debitType: "자본",
                debitChange: "-",
                credit: "장기주식",
                creditType: "자산",
                creditChange: "-",
                example: "주식 투자 손실 200만원 등록",
                amount: 2000000,
            },
            {
                name: "자산 처분",
                description: "자산을 헐값에 처분한 경우",
                debit: "자본조정",
                debitType: "자본",
                debitChange: "-",
                credit: "자동차",
                creditType: "자산",
                creditChange: "-",
                example: "자동차 헐값 처분으로 500만원 손실",
                amount: 5000000,
            },
        ],
    },
    debtOnlyStart: {
        name: "부채만 있는 시작",
        category: "기초 설정",
        icon: AlertTriangle,
        color: "bg-red-700",
        description: "자산 없이 부채만 있는 상황을 등록하는 경우",
        formula: "자본(-) & 부채(+)",
        examples: [
            {
                name: "기존 부채 등록",
                description: "보유하고 있던 부채 등록",
                debit: "기초자본",
                debitType: "자본",
                debitChange: "-",
                credit: "신용대출",
                creditType: "부채",
                creditChange: "+",
                example: "기존 신용대출 1000만원 등록",
                amount: 10000000,
            },
            {
                name: "카드 미지급금 등록",
                description: "기존 카드 미지급금 등록",
                debit: "기초자본",
                debitType: "자본",
                debitChange: "-",
                credit: "카드 미지급금",
                creditType: "부채",
                creditChange: "+",
                example: "기존 카드 미지급금 300만원 등록",
                amount: 3000000,
            },
        ],
    },
    capitalReclassification: {
        name: "자본 재분류",
        category: "기초 설정",
        icon: Settings,
        color: "bg-gray-600",
        description: "자본 계정 간 이동하는 경우",
        formula: "자본(-) & 자본(+)",
        examples: [
            {
                name: "증여 받은 자산",
                description: "가족으로부터 증여받은 경우",
                debit: "기초자본",
                debitType: "자본",
                debitChange: "-",
                credit: "증여/상속",
                creditType: "자본",
                creditChange: "+",
                example: "부모님께 증여받은 1000만원",
                amount: 10000000,
            },
            {
                name: "자본 조정",
                description: "자본 계정 재분류",
                debit: "자본조정",
                debitType: "자본",
                debitChange: "-",
                credit: "기초자본",
                creditType: "자본",
                creditChange: "+",
                example: "자본 계정 재분류 500만원",
                amount: 5000000,
            },
        ],
    },
    debtReplacement: {
        name: "부채 대체",
        category: "기초 설정",
        icon: ArrowRightLeft,
        color: "bg-indigo-500",
        description: "한 부채를 다른 부채로 바꾸는 경우",
        formula: "부채(-) & 부채(+)",
        examples: [
            {
                name: "대출 갈아타기",
                description: "고금리 대출을 저금리 대출로 변경",
                debit: "신용대출(기존)",
                debitType: "부채",
                debitChange: "-",
                credit: "주택담보대출(신규)",
                creditType: "부채",
                creditChange: "+",
                example: "신용대출을 주택담보대출로 2000만원 갈아타기",
                amount: 20000000,
            },
            {
                name: "카드론을 신용대출로 변경",
                description: "카드론을 신용대출로 대체",
                debit: "카드론",
                debitType: "부채",
                debitChange: "-",
                credit: "신용대출",
                creditType: "부채",
                creditChange: "+",
                example: "카드론 500만원을 신용대출로 대체",
                amount: 5000000,
            },
        ],
    },
};

const categories = [
    { id: "transaction", name: "거래 입력", description: "일상적인 거래 입력 시 사용" },
    { id: "setup", name: "기초 설정", description: "초기 자산/부채 등록 시 사용" },
];

export default function Guide() {
    const [selectedCategory, setSelectedCategory] = useState("transaction");
    const [selectedType, setSelectedType] = useState<keyof typeof transactionGuides>("cashExpense");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(amount);
    };

    const filteredGuides = Object.entries(transactionGuides).filter(([_, guide]) => {
        if (selectedCategory === "transaction") {
            return guide.category === "거래 입력";
        } else {
            return guide.category === "기초 설정";
        }
    });

    useEffect(() => {
        if (selectedCategory === "setup") {
            setSelectedType("initialAsset");
        } else {
            // fallback: transaction이면 첫 번째 항목 선택
            const firstGuide = Object.entries(transactionGuides).find(([_, guide]) => guide.category === "거래 입력");
            if (firstGuide) {
                setSelectedType(firstGuide[0] as keyof typeof transactionGuides);
            }
        }
    }, [selectedCategory]);

    return (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">복식부기 분개 가이드</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">11가지 거래 유형별 정확한 분개 방법을 학습하세요</p>
            </div>

            {/* 카테고리 선택 */}
            <div className="flex gap-4 mb-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(category.id); // 이것만
                        }}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            selectedCategory === category.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                    >
                        <div className="text-left">
                            <div className="font-semibold">{category.name}</div>
                            <div className="text-xs opacity-80">{category.description}</div>
                        </div>
                    </button>
                ))}
            </div>

            <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as keyof typeof transactionGuides)}>
                <TabsList className="h-full flex flex-wrap justify-center bg-gray-100 dark:bg-gray-800 p-1">
                    {filteredGuides.map(([key, guide]) => {
                        const Icon = guide.icon;
                        return (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
                            >
                                <div className={`w-8 h-8 ${guide.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-xs font-medium text-center leading-tight">{guide.name}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {filteredGuides.map(([key, guide]) => (
                    <TabsContent key={key} value={key} className="mt-6">
                        <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                                    <div className={`w-12 h-12 ${guide.color} rounded-lg flex items-center justify-center`}>
                                        <guide.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xl">{guide.name}</div>
                                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">{guide.description}</div>
                                        <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                            {guide.formula}
                                        </Badge>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {guide.examples.map((example, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{example.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{example.description}</p>
                                                    <div className="mt-2">
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                                            예시: {example.example}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(example.amount)}</div>
                                                </div>
                                            </div>

                                            {/* 분개 구조 */}
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calculator className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                                    <span className="font-medium text-gray-900 dark:text-white">분개 구조</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">차변 (DR)</div>
                                                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                                                            <div className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">{example.debit}</div>
                                                            <div className={`text-xs font-medium mb-2 ${getAccountTypeColor(example.debitType)}`}>({example.debitType})</div>
                                                            <div className="flex items-center justify-center mb-2">
                                                                {example.debitChange === "+" ? <Plus className="h-4 w-4 text-green-600" /> : <Minus className="h-4 w-4 text-red-600" />}
                                                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">{example.debitChange === "+" ? "증가" : "감소"}</span>
                                                            </div>
                                                            <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(example.amount)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">대변 (CR)</div>
                                                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
                                                            <div className="font-medium text-green-900 dark:text-green-100 text-sm mb-1">{example.credit}</div>
                                                            <div className={`text-xs font-medium mb-2 ${getAccountTypeColor(example.creditType)}`}>({example.creditType})</div>
                                                            <div className="flex items-center justify-center mb-2">
                                                                {example.creditChange === "+" ? <Plus className="h-4 w-4 text-green-600" /> : <Minus className="h-4 w-4 text-red-600" />}
                                                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">{example.creditChange === "+" ? "증가" : "감소"}</span>
                                                            </div>
                                                            <div className="text-sm font-semibold text-green-900 dark:text-green-100">{formatCurrency(example.amount)}</div>
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
