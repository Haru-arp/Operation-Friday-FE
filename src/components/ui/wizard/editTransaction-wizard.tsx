import type { AccountType, } from "@/types/transaction";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Coins, Calendar, Check } from "lucide-react";
import { useLoadAccounts } from "@/hook/useAccountData";
import { getAccountData } from "@/utils/accountData";
import type { Accounts, AccountData, TransactionType, TransactionCategory, ModifyTransactionRequest } from "@/components/ui/wizard/transaction-wizard";
import { transactionTypeMap } from "@/lib/transactionHelpers";
import { useLoadTransactionDetail } from "@/hook/useTransactions";

interface EditTransactionWizardProps {
    onUpdate: (transactionId: number, updateData: ModifyTransactionRequest) => void;
    presetType?: string;
    isUpdateLoading?: boolean;
}

// // 주요 거래 유형 (1-5번)
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

export const EditTransactionWizard = ({ onUpdate, presetType, isUpdateLoading }: EditTransactionWizardProps) => {
    const { transactionId: paramId } = useParams();
    const transactionId = paramId ? Number(paramId) : undefined;
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState<string | null>(null);
    const [item, setItem] = useState("");
    const [debitAccount, setDebitAccount] = useState("");
    const [creditAccount, setCreditAccount] = useState("");
    const [accountData, setAccountData] = useState<AccountData>({
        groups: [],
        accounts: [],
    });

    const { data: transaction, isLoading, isError } = useLoadTransactionDetail(transactionId!);

    // 2. 컴포넌트 내부에서 계정 데이터 로드
    const { data: accounts, isLoading: _isAccountsLoading, isError: _isAccountsError } = useLoadAccounts();

    // 3. 기존 loadAccountData 함수 교체
    useEffect(() => {
        loadAccountData();
    }, [accounts]);

    const loadAccountData = () => {
        try {
            if (accounts) {
                const transAccountData = getAccountData(accounts);
                setAccountData(transAccountData);
            }
        } catch (error) {
            console.error("계정 데이터 로딩 오류:", error);
        }
    };

    useEffect(() => {
        if (transaction) {
            setDate(transaction.transDate); // API 데이터 구조에 맞게 수정
            setItem(transaction.description); // description 사용
            setAmount(String(transaction.amount));
            setMemo(transaction.memo || "");
            setDebitAccount(String(transaction.debitItemId)); // API 데이터 구조에 맞게
            setCreditAccount(String(transaction.creditItemId)); // API 데이터 구조에 맞게

            // subtypeCode로 거래 유형 찾기
            const type = mainTransactionTypes.find((type) => type.id === transaction.subtypeCode);
            if (type) setSelectedType(type);
        }
    }, [transaction]);


    const handleUpdate = () => {
        if (!selectedType || !amount || !debitAccount || !creditAccount || !item) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (!transactionId) {
            alert("거래 ID를 찾을 수 없습니다.");
            return;
        }

        const updateRequest: ModifyTransactionRequest = {
            subtypeCode: selectedType.id,
            transDate: date,
            description: item,
            debitItemId: Number(debitAccount),
            creditItemId: Number(creditAccount),
            amount: Number(amount),
            memo: memo || "",
        };

        onUpdate(Number(transactionId), updateRequest);
    };


    const getGroupName = (groupId: string) => {
        const group = accountData.groups.find((g) => g.id === groupId);
        return group ? group.name : "";
    };

    const getFilteredAccounts = (position: "debit" | "credit") => {
        if (!selectedType) return [];

        const debitType = selectedType.debit;
        const creditType = selectedType.credit;
        let targetAccountType: AccountType | null = null;

        if (position === "debit") {
            if (debitType === "비용") targetAccountType = "EXPENSE";
            if (debitType === "자산+") targetAccountType = "ASSET";
            if (debitType === "부채-") targetAccountType = "LIABILITY";
        } else {
            if (creditType === "자산-") targetAccountType = "ASSET";
            if (creditType === "부채+") targetAccountType = "LIABILITY";
            if (creditType === "수익") targetAccountType = "REVENUE";
        }

        return accountData.accounts
            .filter((acc) => acc.type === targetAccountType)
            .map((acc) => ({
                ...acc,
                groupName: acc.groupId ? getGroupName(acc.groupId) : "그룹 없음",
            }))
            .sort((a, b) => {
                if (a.groupId && !b.groupId) return -1;
                if (!a.groupId && b.groupId) return 1;
                if (a.groupName !== b.groupName) return a.groupName.localeCompare(b.groupName);
                return a.name.localeCompare(b.name);
            });
    };


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

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError || !transaction) {
        return <div>거래를 불러올 수 없습니다.</div>;
    }
    return (
        <div className={`space-y-6 ${isUpdateLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>거래 수정</span>
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
                                    <Input id="date" type="date" value={date} disabled={isUpdateLoading} onChange={(e) => setDate(e.target.value)} className="pl-10" />
                                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {/* 아이템과 금액 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item">아이템</Label>
                                <Input id="item" type="text" placeholder="아이템을 입력하세요" disabled={isUpdateLoading} value={item} onChange={(e) => setItem(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">금액</Label>
                                <div className="relative">
                                    <Input id="amount" type="number" placeholder="0" disabled={isUpdateLoading} value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-10" />
                                    <Coins className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                                            className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${isSelected ? " border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                                        {getFilteredAccounts("debit").map((account: Accounts) => (
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
                                        {getFilteredAccounts("credit").map((account: Accounts) => (
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

                        <Button
                            onClick={handleUpdate}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={!amount || !debitAccount || !creditAccount || !item || isLoading}
                        >
                            {isUpdateLoading ? (
                                <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    수정 중...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    거래 수정
                                </>
                            )}
                        </Button>
                    </>
                </CardContent>
            </Card>
        </div>
    );
};
