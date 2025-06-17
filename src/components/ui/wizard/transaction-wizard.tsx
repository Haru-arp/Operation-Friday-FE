import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, TrendingUp, RefreshCw, HandCoins, DollarSign, Calendar, Check, Info, Clock, ArrowLeftRight, Trash2, Edit2 } from "lucide-react";
// RotateCcw,
import type { Transaction } from "@/types/transaction";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTransactionColor, getTransactionIcon } from "@/lib/transactionHelpers";

type AccountCategory = "asset" | "liability" | "revenue" | "expense";

type AccountsByType = Record<AccountCategory, Account[]>;

interface TransactionType {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    description: string;
    example: string;
    debit: string;
    credit: string;
    category: "지출" | "수익" | "자산 이동";
}

interface Account {
    id: string;
    name: string;
    group: string;
}

interface TransactionWizardProps {
    onSave: (transaction: Transaction) => void;
    presetType?: string;
}

// 주요 거래 유형 (1-5번)
const mainTransactionTypes = [
    {
        id: "cash_expense",
        name: "현금 지출",
        icon: Banknote,
        color: "bg-red-500",
        description: "자산(현금, 계좌)을 써서 비용 발생",
        example: "편의점 결제, 병원비, 배달앱 결제",
        debit: "비용+",
        credit: "자산-",
        category: "지출",
    },
    {
        id: "credit_expense",
        name: "외상 지출",
        icon: CreditCard,
        color: "bg-orange-500",
        description: "신용카드 등 외상으로 지출 발생",
        example: "신용카드 식사 결제, 병원비 카드결제",
        debit: "비용+",
        credit: "부채+",
        category: "지출",
    },
    {
        id: "income",
        name: "수익 발생",
        icon: TrendingUp,
        color: "bg-green-500",
        description: "수익이 자산(현금, 계좌)으로 들어옴",
        example: "월급, 이자수익, 부업 수입",
        debit: "자산+",
        credit: "수익+",
        category: "수익",
    },
    {
        id: "asset_transfer",
        name: "자산 이동",
        icon: RefreshCw,
        color: "bg-blue-500",
        description: "자산 간 이동",
        example: "통장 간 이체, 현금 인출/입금",
        debit: "자산+",
        credit: "자산-",
        category: "자산 이동",
    },
    {
        id: "debt_repayment",
        name: "부채 상환",
        icon: HandCoins,
        color: "bg-purple-500",
        description: "자산으로 부채를 갚음",
        example: "계좌이체로 카드값 결제, 대출 상환",
        debit: "부채-",
        credit: "자산-",
        category: "지출",
    },
] as const satisfies TransactionType[];

// 기본 계정 과목 정의
const getDefaultAccounts = () => {
    try {
        const saved = localStorage.getItem("accounts");
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error("계정 정보 로딩 오류:", error);
    }

    return {
        asset: [
            { id: "cash", name: "현금", group: "현금" },
            { id: "kb_checking", name: "국민은행 당좌", group: "은행계좌" },
            { id: "hana_savings", name: "하나은행 적금", group: "은행계좌" },
            { id: "mirae_stock", name: "미래에셋 주식", group: "증권계좌" },
            { id: "ewallet", name: "전자지갑", group: "전자지갑" },
        ],
        liability: [
            { id: "shinhan_credit", name: "신한카드", group: "신용카드" },
            { id: "kb_credit", name: "국민카드", group: "신용카드" },
            { id: "kb_check", name: "국민체크카드", group: "체크카드" },
            { id: "loan", name: "대출", group: "대출" },
        ],
        revenue: [
            { id: "salary", name: "급여", group: "근로소득" },
            { id: "bonus", name: "상여금", group: "근로소득" },
            { id: "interest", name: "이자수익", group: "투자수익" },
            { id: "other_income", name: "기타수익", group: "기타수익" },
        ],
        expense: [
            { id: "restaurant", name: "외식", group: "식비" },
            { id: "delivery", name: "배달", group: "식비" },
            { id: "coffee", name: "술커피", group: "식비" },
            { id: "transport", name: "교통비", group: "교통비" },
            { id: "housing", name: "주거비", group: "주거비" },
            { id: "utility", name: "공과금", group: "공과금" },
        ],
    };
};

export const TransactionWizard = ({ onSave, presetType }: TransactionWizardProps) => {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState<string | null>(null);
    const [debitAccount, setDebitAccount] = useState("");
    const [creditAccount, setCreditAccount] = useState("");
    const [accounts] = useState<AccountsByType>(getDefaultAccounts());
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [item, setItem] = useState("");
    // 최근 거래 내역 로드
    useEffect(() => {
        try {
            const savedTransactions = localStorage.getItem("transactions");
            if (savedTransactions) {
                const transactions = JSON.parse(savedTransactions);
                // 최근 10개만 표시
                setRecentTransactions(transactions.slice(-10).reverse());
                setTransactions(transactions);
            }
        } catch (error) {
            console.error("거래 내역 로딩 오류:", error);
        }
    }, []);

    // presetType이 있으면 해당 타입으로 초기화
    useEffect(() => {
        if (presetType) {
            const preset = mainTransactionTypes.find((t) => t.id === presetType);
            if (preset) {
                setSelectedType(preset);
                setMemo(`${preset.name} - `);
            }
        }
    }, [presetType]);

    // 초기화
    const resetForm = () => {
        if (presetType) return;
        setSelectedType(null);
        setAmount("");
        setMemo(null);
        setItem("");
        setDebitAccount("");
        setCreditAccount("");
    };

    // 거래 유형 선택
    const handleTypeSelect = (type: TransactionType) => {
        setSelectedType(type);
        setMemo(null);
        setDebitAccount("");
        setCreditAccount("");
    };

    // 거래 저장
    const handleSave = () => {
        if (!selectedType || !amount || !debitAccount || !creditAccount) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        const transaction: Transaction = {
            id: "",
            date,
            item: item,
            description: memo ?? "",
            amount: Number(amount),
            leftAccount: debitAccount,
            rightAccount: creditAccount,
            leftAccountName: getAccountName(debitAccount),
            rightAccountName: getAccountName(creditAccount),
            type: selectedType.category === "수익" ? "income" : selectedType.category === "자산 이동" ? "transfer" : "expense",
            accountType: "asset",
            createdAt: "",
        };

        onSave(transaction);

        // 최근 거래 내역 업데이트
        const newTransaction = {
            ...transaction,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setRecentTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]);

        if (!presetType) {
            resetForm();
        }
    };

    const handleDelete = (id: string, description?: string) => {
        const label = description?.trim() ? `"${description}"` : "이 거래";
        if (confirm(`${label}를 삭제하시겠습니까?`)) {
            handleDeleteTransaction(id);
        }
    };
    const handleDeleteTransaction = (id: string) => {
        try {
            const updatedTransactions = transactions.filter((t) => t.id !== id);
            setTransactions(updatedTransactions);
            setRecentTransactions(updatedTransactions.slice(-10).reverse()); // ✅ 추가
            localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
        } catch (error) {
            console.error("거래 삭제 중 오류 발생:", error);
            alert("거래를 삭제하는 중 오류가 발생했습니다.");
        }
    };

    // 계정명 조회
    const getAccountName = (accountId: string) => {
        for (const accountType of Object.values(accounts)) {
            const account = accountType.find((acc: Account) => acc.id === accountId);
            if (account) return account.name;
        }
        return accountId;
    };

    // 선택된 거래 유형에 따른 계정 필터링
    const getFilteredAccounts = (position: "debit" | "credit") => {
        if (!selectedType) return [];

        const debitType = selectedType.debit;
        const creditType = selectedType.credit;

        if (position === "debit") {
            if (debitType === "비용+") return accounts.expense;
            if (debitType === "자산+") return accounts.asset;
            if (debitType === "부채-") return accounts.liability;
        } else {
            if (creditType === "자산-") return accounts.asset;
            if (creditType === "부채+") return accounts.liability;
            if (creditType === "수익+") return accounts.revenue;
        }

        return [];
    };

    return (
        <div className="space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>새 거래 입력</span>
                        {selectedType && !presetType && (
                            <Button variant="ghost" size="sm" onClick={resetForm}>
                                초기화
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <>
                        {/* 기본 정보 입력 */}
                        <div className="grid grid-cols-1">
                            <div className="space-y-2">
                                <Label htmlFor="date">날짜</Label>
                                <div className="relative">
                                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" />
                                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {/* 아이템과 금액 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item">아이템</Label>
                                <Input id="item" type="text" placeholder="아이템을 입력하세요" value={item} onChange={(e) => setItem(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">금액</Label>
                                <div className="relative">
                                    <Input id="amount" type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-10" />
                                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                                </div>
                            </div>
                        </div>
                        {/* 거래 유형 선택 */}
                        <div className="space-y-3">
                            <Label>거래 유형</Label>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                {mainTransactionTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = selectedType?.id === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                                                isSelected ? " border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            }`}
                                            onClick={() => handleTypeSelect(type)}
                                        >
                                            <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mb-2`}>
                                                <Icon className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-xs font-medium text-center">{type.name}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedType && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedType.description}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{selectedType.example}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                            차변: {selectedType.debit}
                                        </Badge>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                            대변: {selectedType.credit}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 계정 선택 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="debit-account">차변 계정 ({selectedType?.debit})</Label>
                                <Select value={debitAccount} onValueChange={setDebitAccount}>
                                    <SelectTrigger id="debit-account">
                                        <SelectValue placeholder="차변 계정 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getFilteredAccounts("debit").map((account: Account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-500 mr-2">[{account.group}]</span>
                                                    {account.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credit-account">대변 계정 ({selectedType?.credit})</Label>
                                <Select value={creditAccount} onValueChange={setCreditAccount}>
                                    <SelectTrigger id="credit-account">
                                        <SelectValue placeholder="대변 계정 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getFilteredAccounts("credit").map((account: Account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-500 mr-2">[{account.group}]</span>
                                                    {account.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="memo">메모 (선택)</Label>
                            <Textarea id="memo" placeholder="거래 내용을 입력하세요" value={memo ?? ""} onChange={(e) => setMemo(e.target.value)} rows={2} />
                        </div>
                        {/* 거래 요약 */}
                        {debitAccount && creditAccount && amount && (
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200">
                                    <div className="font-medium mb-1">거래 요약</div>
                                    <div className="text-sm">
                                        <strong>차변:</strong> {getAccountName(debitAccount)} {Number(amount).toLocaleString()}원
                                        <Badge variant="outline" className="ml-1">
                                            {selectedType?.debit.includes("+") ? "증가" : "감소"}
                                        </Badge>
                                        <br />
                                        <strong>대변:</strong> {getAccountName(creditAccount)} {Number(amount).toLocaleString()}원
                                        <Badge variant="outline" className="ml-1">
                                            {selectedType?.credit.includes("+") ? "증가" : "감소"}
                                        </Badge>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={!amount || !debitAccount || !creditAccount || !item}>
                            <Check className="mr-2 h-4 w-4" /> 거래 저장
                        </Button>
                    </>
                </CardContent>
            </Card>
            {/* 최근 거래 내역 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        최근 거래 내역
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">아직 거래 내역이 없습니다</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">첫 거래를 입력해보세요</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((transaction, index) => (
                                <div
                                    key={`${transaction.id}-${index}`}
                                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">{getTransactionIcon(transaction.type)}</div>
                                        <div>
                                            <h4 className="text-sm text-gray-900 dark:text-white">
                                                <span className="font-bold">{transaction.item}</span>
                                                {transaction.description && <span className="font-normal"> - {transaction.description}</span>}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{transaction.leftAccountName}</span>
                                                <ArrowLeftRight className="h-3 w-3" />
                                                <span>{transaction.rightAccountName}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(transaction.date).toLocaleDateString("ko-KR")}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>{transaction.amount.toLocaleString()}원</p>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    transaction.type === "income"
                                                        ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                                                        : transaction.type === "expense"
                                                        ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                                                        : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                                }`}
                                            >
                                                {transaction.type === "income" ? "수입" : transaction.type === "expense" ? "지출" : "이체"}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(`/transaction/edit/${transaction.id}`, {
                                                        state: { from: location.pathname },
                                                    })
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(transaction.id, transaction.description ?? "")}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
