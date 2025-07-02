import type { TransactionApi } from "@/types/transaction";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Wallet, Target, Calendar, BarChart3, ArrowLeftRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getTransactionColor, getTransactionIcon } from "@/lib/transactionHelpers";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/api/transactions";
export default function Home() {
    const [transactions, setTransactions] = useState<TransactionApi[]>([]);
    const useTransactions = () => {
        return useQuery({
            queryKey: ["transactions"],
            queryFn: loadTransactions,
            select: (res) => res.data.data,
        });
    };
    const { data: Alltransactions, isLoading: _isLoading, isError: _isError } = useTransactions();

    const navigate = useNavigate();

    const dashboardData = useMemo(() => {
        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();

        //이번 달 데이터
        const monthlyTransactions = transactions.filter((t) => {
            const date = dayjs(t.transDate);
            return date.month() === currentMonth && date.year() === currentYear;
        });

        const monthlyIncome = monthlyTransactions.filter((t) => t.categoryType === "income").reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpense = monthlyTransactions.filter((t) => t.categoryType === "expense").reduce((sum, t) => sum + t.amount, 0);

        const monthlyNet = monthlyIncome - monthlyExpense;

        //자산 계산
        // const totalAssets = transactions.filter((t) => t.accountType === "asset").reduce((sum, t) => (t.categoryType === "income" ? sum + t.amount : sum - t.amount), 0);

        // const totalLiabilities = transactions.filter((t) => t.accountType === "liability").reduce((sum, t) => (t.categoryType === "expense" ? sum + t.amount : sum - t.amount), 0);

        // const netWorth = totalAssets - totalLiabilities;

        //최근 6개월간 추이
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const targetDate = dayjs().subtract(i, "month");
            const year = targetDate.year(); // 연도
            const month = targetDate.month(); // 월 (0부터 시작)

            const monthTransactions = transactions.filter((t) => {
                const date = dayjs(t.transDate);
                return date.month() === month && date.year() === year;
            });

            const income = monthTransactions.filter((t) => t.categoryType === "income").reduce((sum, t) => sum + t.amount, 0);
            const expense = monthTransactions.filter((t) => t.categoryType === "expense").reduce((sum, t) => sum + t.amount, 0);
            monthlyTrend.push({
                month: targetDate.format("MMM"),
                income,
                expense,
                net: income - expense,
            });
        }

        // 카테고리별 지출 (원형 그래프용)
        const expenseByCategory = monthlyTransactions
            .filter((t) => t.categoryType === "expense")
            .reduce((acc, t) => {
                acc[t.debitItemName] = (acc[t.debitItemName] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        const pieChartData = Object.entries(expenseByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([category, amount], index) => ({
                name: category,
                value: amount,
                color: `hsl(${index * 60}, 70%, 60%)`,
            }));

        return {
            monthlyIncome,
            monthlyExpense,
            monthlyNet,
            // totalAssets,
            // totalLiabilities,
            // netWorth,
            monthlyTrend,
            pieChartData,
        };
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 5);

    useEffect(() => {
        // const savedTransactions = localStorage.getItem("transactions");
        if (Alltransactions) {
            setTransactions(Alltransactions);
        }
    }, [navigate, Alltransactions]);

    return (
        <div>
            {/** header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">대시보드</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{dayjs().format("YYYY년 M월 D일")}</p>
            </div>

            {/** 주요 지표 카드 4개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">이번 달 수입</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.monthlyIncome.toLocaleString()}원</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">전월 대비 +5.2%</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">이번 달 지출</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.monthlyExpense.toLocaleString()}원</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">전월 대비 -2.1%</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                                <TrendingDown className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">순자산</p>
                                {/* <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.netWorth.toLocaleString()}원</p> */}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">자산 - 부채</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                                <Wallet className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">이번 달 손익</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {dashboardData.monthlyNet >= 0 ? "+" : ""}
                                    {dashboardData.monthlyNet.toLocaleString()}원
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">수입 - 지출</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 꺾은선 그래프 - 월별 추이 */}
                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">월별 수입/지출 추이</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboardData.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        border: "1px solid #374151",
                                        borderRadius: "8px",
                                        color: "#F9FAFB",
                                    }}
                                />
                                <Line type="monotone" dataKey="income" stroke="#6B7280" strokeWidth={2} name="수입" />
                                <Line type="monotone" dataKey="expense" stroke="#9CA3AF" strokeWidth={2} name="지출" />
                                <Line type="monotone" dataKey="net" stroke="#8B5CF6" strokeWidth={2} name="순손익" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">이번 달 지출 분포</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.pieChartData.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p>아직 지출 데이터가 없습니다</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dashboardData.pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dashboardData.pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                            color: "#F9FAFB",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 목표 달성률 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Target className="h-5 w-5" />
                            저축 목표
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">이번 달 목표</span>
                                    <span className="font-bold text-gray-900 dark:text-white">500,000원</span>
                                </div>
                                <Progress value={75} className="h-3" />
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>375,000원 달성</span>
                                    <span>75%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Calendar className="h-5 w-5" />
                            예산 관리
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">이번 달 예산</span>
                                    <span className="font-bold text-gray-900 dark:text-white">1,200,000원</span>
                                </div>
                                <Progress value={65} className="h-3" />
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>780,000원 사용</span>
                                    <span>65%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">투자 수익률</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">+8.5%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">전체 포트폴리오</div>
                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>투자원금</span>
                                    <span>5,000,000원</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>평가금액</span>
                                    <span>5,425,000원</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 최근 거래 */}
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">최근 거래</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>아직 거래 내역이 없습니다.</p>
                            <p className="text-sm">첫 거래를 입력해보세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentTransactions.map((transaction, index) => (
                                <div
                                    key={`${transaction.id}-${index}`}
                                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">{getTransactionIcon(transaction.subtypeCode || "")}</div>
                                        <div>
                                            <h4 className="text-sm text-gray-900 dark:text-white">
                                                <span className="font-bold">{transaction.description}</span>
                                                {transaction.memo && <span className="font-normal"> - {transaction.memo}</span>}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{transaction.debitItemName}</span>
                                                <ArrowLeftRight className="h-3 w-3" />
                                                <span>{transaction.creditItemName}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(transaction.transDate).toLocaleDateString("ko-KR")}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${getTransactionColor(transaction.categoryType)}`}>{transaction.amount.toLocaleString()}원</p>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                                transaction.categoryType === "income"
                                                    ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                                                    : transaction.categoryType === "expense"
                                                    ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                                                    : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                            }`}
                                        >
                                            {transaction.categoryType === "income" ? "수입" : transaction.categoryType === "expense" ? "지출" : "이체"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
