import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarIcon, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import type { Transaction } from "@/types/transaction";

interface DayData {
    date: number;
    income: number;
    expense: number;
    transfer: number;
    total: number;
    hasTransactions: boolean;
}
export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [calendarData, setCalendarData] = useState<DayData[]>([]);
    const [monthlyTotals, setMonthlyTotals] = useState({
        income: 0,
        expense: 0,
        transfer: 0,
        net: 0,
    });

    // 거래 데이터 로드
    useEffect(() => {
        const loadTransactions = () => {
            try {
                const stored = localStorage.getItem("transactions");
                if (stored) {
                    setTransactions(JSON.parse(stored));
                }
            } catch (error) {
                console.error("거래 데이터 로드 실패:", error);
            }
        };

        loadTransactions();
    }, []);

    // 달력 데이터 계산
    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);

        // 해당 월의 거래만 필터링
        const monthTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= monthStart && transactionDate <= monthEnd;
        });

        // 일별 데이터 계산
        const dailyData: DayData[] = [];
        let totalIncome = 0;
        let totalExpense = 0;
        let totalTransfer = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const dayTransactions = monthTransactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getDate() === day;
            });

            const dayIncome = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

            const dayExpense = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

            const dayTransfer = dayTransactions.filter((t) => t.type === "transfer").reduce((sum, t) => sum + t.amount, 0);

            totalIncome += dayIncome;
            totalExpense += dayExpense;
            totalTransfer += dayTransfer;

            dailyData.push({
                date: day,
                income: dayIncome,
                expense: dayExpense,
                transfer: dayTransfer,
                total: dayIncome - dayExpense,
                hasTransactions: dayTransactions.length > 0,
            });
        }

        setCalendarData(dailyData);
        setMonthlyTotals({
            income: totalIncome,
            expense: totalExpense,
            transfer: totalTransfer,
            net: totalIncome - totalExpense,
        });
    }, [currentDate, transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ko-KR").format(amount);
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    // 달력 시작 요일 계산
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6" />
                        달력
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">월별 수입, 지출, 이체 내역을 확인하세요</p>
                </div>
                <Button onClick={goToToday} variant="outline">
                    오늘로 이동
                </Button>
            </div>

            {/* 월별 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">수입</span>
                        </div>
                        <p className="text-xl font-bold text-green-600 mt-1">+{formatCurrency(monthlyTotals.income)}원</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">지출</span>
                        </div>
                        <p className="text-xl font-bold text-red-600 mt-1">-{formatCurrency(monthlyTotals.expense)}원</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">이체</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(monthlyTotals.transfer)}원</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">순수익</span>
                        </div>
                        <p className={`text-xl font-bold mt-1 ${monthlyTotals.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {monthlyTotals.net >= 0 ? "+" : ""}
                            {formatCurrency(monthlyTotals.net)}원
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 달력 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={goToNextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 달력 그리드 */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* 빈 셀 (이전 달) */}
                        {Array.from({ length: startingDayOfWeek }, (_, index) => (
                            <div key={`empty-${index}`} className="p-2 h-24"></div>
                        ))}

                        {/* 날짜 셀 */}
                        {calendarData.map((dayData) => {
                            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), dayData.date).toDateString();

                            return (
                                <div
                                    key={dayData.date}
                                    className={`p-2 h-24 border border-gray-200 dark:border-gray-700 rounded-lg ${
                                        isToday ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                    } ${dayData.hasTransactions ? "cursor-pointer" : ""}`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>{dayData.date}</div>

                                    {dayData.hasTransactions && (
                                        <div className="space-y-1">
                                            {dayData.income > 0 && (
                                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    +{formatCurrency(dayData.income)}
                                                </Badge>
                                            )}
                                            {dayData.expense > 0 && (
                                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                    -{formatCurrency(dayData.expense)}
                                                </Badge>
                                            )}
                                            {dayData.transfer > 0 && (
                                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {formatCurrency(dayData.transfer)}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
