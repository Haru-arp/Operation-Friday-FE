import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Check, Clock, ArrowLeftRight, Trash2, Edit2 } from "lucide-react";
// RotateCcw, CreditCard, Banknote, TrendingUp, RefreshCw, HandCoins
import type { TransactionApi } from "@/types/transaction";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTransactionColor, getTransactionIcon, transactionTypeMap } from "@/lib/transactionHelpers";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/api/transactions";

export type TransactionCategory = "지출" | "수익" | "자산 이동" | "초기 세팅" | "부채 이동" | "자본 회수" | "자본 이동" | "차입";

export interface TransactionType {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    textColor?: string;
    description: string;
    example: string;
    debit: string;
    credit: string;
    category: TransactionCategory;
}

export interface Account {
    id: string;
    name: string;
    groupId?: string;
    type: AccountType;
    groupName?: string;
}

export interface AccountGroup {
    id: string;
    name: string;
    type: AccountType;
}

export interface AccountData {
    groups: AccountGroup[];
    accounts: Account[];
}

export interface TransactionRequest {
    subtypeCode: string;
    transDate: string;
    description: string;
    debitItemId: number;
    creditItemId: number;
    amount: number;
    memo: string;
}

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

interface TransactionWizardProps {
    onSave: (transaction: TransactionRequest) => void;
    presetType?: string;
}

// 주요 거래 유형 (1-5번)

// 확장된 거래 유형 (11개) - 아이콘 매핑 사용
const mainTransactionTypes = Object.entries(transactionTypeMap).map(([id, config]) => ({
    id,
    name: config.name,
    icon: config.icon,
    color: config.color,
    description: getTransactionDescription(id),
    example: getTransactionExample(id),
    debit: getDebitType(id),
    credit: getCreditType(id),
    category: config.category as TransactionCategory,
}));

// 거래 유형별 설명
function getTransactionDescription(id: string): string {
    const descriptions: Record<string, string> = {
        expense_cash: "자산(현금, 계좌)을 써서 비용 발생",
        expense_credit: "신용카드 등 외상으로 지출 발생",
        income: "수익이 자산(현금, 계좌)으로 들어옴",
        asset_transfer: "자산 간 이동",
        debt_repayment: "자산으로 부채를 갚음",
        debt_transfer: "기존 부채를 새 부채로 대체",
        initial_asset: "가계부 시작 시 보유 자산 등록",
        initial_liability: "가계부 시작 시 보유 부채 등록",
        loan: "대출로 자산을 만들었을 때",
        capital_withdraw: "자산을 줄이며 자본도 줄임",
        capital_realloc: "자본 항목 간 이동",
    };
    return descriptions[id] || "";
}

// 거래 유형별 예시
function getTransactionExample(id: string): string {
    const examples: Record<string, string> = {
        expense_cash: "편의점 결제, 병원비, 배달앱 결제",
        expense_credit: "신용카드 식사 결제, 병원비 카드결제",
        income: "월급, 이자수익, 부업 수입",
        asset_transfer: "통장 간 이체, 현금 인출/입금",
        debt_repayment: "계좌이체로 카드값 결제, 대출 상환",
        debt_transfer: "대환대출, 카드 리볼빙, 부채 통합",
        initial_asset: "현금 500만 원 등록, 증여 자산 입력",
        initial_liability: "카드값만 있는 상태로 시작, 기존 대출 등록",
        loan: "전세보증금 대출, 학자금 대출 입금",
        capital_withdraw: "투자금 회수, 오류 정정",
        capital_realloc: "개인자본 → 사업자금, 가족지원금 → 내 자산 전환",
    };
    return examples[id] || "";
}

// 차변 유형
function getDebitType(id: string): string {
    const debitTypes: Record<string, string> = {
        expense_cash: "비용",
        expense_credit: "비용",
        income: "자산+",
        asset_transfer: "자산+",
        debt_repayment: "부채-",
        debt_transfer: "부채-",
        initial_asset: "자산+",
        initial_liability: "자본-",
        loan: "자산+",
        capital_withdraw: "자본-",
        capital_realloc: "자본-",
    };
    return debitTypes[id] || "";
}

// 대변 유형
function getCreditType(id: string): string {
    const creditTypes: Record<string, string> = {
        expense_cash: "자산-",
        expense_credit: "부채+",
        income: "수익",
        asset_transfer: "자산-",
        debt_repayment: "자산-",
        debt_transfer: "부채+",
        initial_asset: "자본+",
        initial_liability: "부채+",
        loan: "부채+",
        capital_withdraw: "자산-",
        capital_realloc: "자본+",
    };
    return creditTypes[id] || "";
}

export const TransactionWizard = ({ onSave, presetType }: TransactionWizardProps) => {
    const navigate = useNavigate();
    const useTransactions = () => {
        return useQuery({
            queryKey: ["transactions"],
            queryFn: loadTransactions,
            select: (res) => res.data.data,
        });
    };
    const { data: Alltransactions, isLoading: _isLoading, isError: _isError } = useTransactions();
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState<string | null>(null);
    const [debitAccount, setDebitAccount] = useState<string>("");
    const [creditAccount, setCreditAccount] = useState<string>("");
    const [accountData, setAccountData] = useState<AccountData>({
        groups: [],
        accounts: [],
    });

    const [recentTransactions, setRecentTransactions] = useState<TransactionApi[]>([]);
    const [transactions, setTransactions] = useState<TransactionApi[]>([]);
    const [item, setItem] = useState("");
    // 계정 데이터 로드
    useEffect(() => {
        loadAccountData();
    }, []);

    const loadAccountData = () => {
        try {
            const saved = localStorage.getItem("accountData");
            if (saved) {
                const data = JSON.parse(saved);
                setAccountData(data);
                console.log("로드된 계정 데이터:", data); // 디버깅용
            }
        } catch (error) {
            console.error("계정 데이터 로딩 오류:", error);
        }
    };

    // 최근 거래 내역 로드
    useEffect(() => {
        try {
            // const savedTransactions = localStorage.getItem("transactions");
            if (Alltransactions) {
                // const transactions = JSON.parse(savedTransactions);
                // 최근 10개만 표시
                setTransactions(Alltransactions);
                setRecentTransactions(Alltransactions.slice(-10).reverse());
            }
        } catch (error) {
            console.error("거래 내역 로딩 오류:", error);
        }
    }, [navigate, Alltransactions]);

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
        //         "subtypeCode": "string",
        // "transDate": "2025-07-02",
        // "description": "string",
        // "debitItemId": 0,
        // "creditItemId": 0,
        // "amount": 0,
        // "memo": "string"
        //transaction form만 보내면 됨
        const transaction: TransactionRequest = {
            transDate: date,
            description: item,
            memo: memo || "",
            amount: Number(amount),
            debitItemId: Number(debitAccount),
            creditItemId: Number(creditAccount),
            subtypeCode: selectedType.id,
        };

        onSave(transaction);

        // // 최근 거래 내역 업데이트
        // const newTransaction = {
        //     ...transaction,
        //     id: Date.now().toString(),
        //     createdAt: new Date().toISOString(),
        // };
        // setRecentTransactions((prev) => [newTransaction, ...prev.slice(0, 9)]);

        // if (!presetType) {
        //     resetForm();
        // }
    };

    const handleDelete = (id: number, description?: string) => {
        const label = description?.trim() ? `"${description}"` : "이 거래";
        if (confirm(`${label}를 삭제하시겠습니까?`)) {
            handleDeleteTransaction(id);
        }
    };
    const handleDeleteTransaction = (id: number) => {
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

    // const getAccountName = (accountId: string) => {
    //     const account = accountData.accounts.find((acc) => acc.id === accountId);
    //     return account ? account.name : accountId;
    // };

    // 그룹명 조회
    const getGroupName = (groupId: string) => {
        const group = accountData.groups.find((g) => g.id === groupId);
        return group ? group.name : "";
    };

    // 선택된 거래 유형에 따른 계정 필터링
    const getFilteredAccounts = (position: "debit" | "credit") => {
        if (!selectedType) return [];

        const debitType = selectedType.debit;
        const creditType = selectedType.credit;

        let targetAccountType: AccountType | null = null;

        if (position === "debit") {
            if (debitType === "비용") targetAccountType = "expense";
            if (debitType === "자산+") targetAccountType = "asset";
            if (debitType === "부채-") targetAccountType = "liability";
            if (debitType === "자본-") targetAccountType = "equity";
        } else {
            if (creditType === "자산-") targetAccountType = "asset";
            if (creditType === "부채+") targetAccountType = "liability";
            if (creditType === "수익") targetAccountType = "revenue";
            if (creditType === "자본+") targetAccountType = "equity";
        }

        if (!targetAccountType) return [];

        // 해당 타입의 계정들만 반환
        const filteredAccounts = accountData.accounts
            .filter((account) => account.type === targetAccountType)
            .map((account) => ({
                ...account,
                groupName: account.groupId ? getGroupName(account.groupId) : "그룹 없음",
            }))
            .sort((a, b) => {
                // 그룹별로 정렬, 그룹 없는 것들은 맨 아래
                if (a.groupId && !b.groupId) return -1;
                if (!a.groupId && b.groupId) return 1;
                if (a.groupName !== b.groupName) return a.groupName.localeCompare(b.groupName);
                return a.name.localeCompare(b.name);
            });

        console.log(`${position} 계정 필터링 결과:`, filteredAccounts); // 디버깅용
        return filteredAccounts;
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
                            <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
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
                        </div>

                        {/* 계정 선택 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="debit-account">
                                    차변 계정
                                    {selectedType && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                            차변: {selectedType?.debit}
                                        </Badge>
                                    )}
                                </Label>
                                <Select value={debitAccount} onValueChange={setDebitAccount}>
                                    <SelectTrigger id="debit-account">
                                        <SelectValue placeholder="차변 계정 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getFilteredAccounts("debit").map((account: Account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-500 mr-2">[{account.groupName}]</span>
                                                    {account.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credit-account">
                                    대변 계정
                                    {selectedType && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                            대변: {selectedType?.credit}
                                        </Badge>
                                    )}
                                </Label>
                                <Select value={creditAccount} onValueChange={setCreditAccount}>
                                    <SelectTrigger id="credit-account">
                                        <SelectValue placeholder="대변 계정 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getFilteredAccounts("credit").map((account: Account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-500 mr-2">[{account.groupName}]</span>
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

                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${getTransactionColor(transaction.categoryType)}`}>{transaction.amount.toLocaleString()}원</p>
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
