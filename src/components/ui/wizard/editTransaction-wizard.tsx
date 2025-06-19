import type { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Banknote,
  TrendingUp,
  RefreshCw,
  HandCoins,
  DollarSign,
  Calendar,
  Check,
} from "lucide-react";

import type {
  Account,
  AccountData,
  AccountType,
  TransactionType,
} from "@/components/ui/wizard/transaction-wizard";

interface EditTransactionWizardProps {
  onUpdate: (transaction: Transaction) => void;
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
    debit: "비용",
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
    debit: "비용",
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
    credit: "수익",
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

export const EditTransactionWizard = ({
  onUpdate,
  presetType,
}: EditTransactionWizardProps) => {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const [selectedType, setSelectedType] = useState<TransactionType | null>(
    null
  );
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState<string | null>(null);
  const [item, setItem] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [_type, setType] = useState<Transaction["type"]>("expense");
  const [accountData, setAccountData] = useState<AccountData>({
    groups: [],
    accounts: [],
  });
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const getTypeFromCategory = (
    category: string
  ): "income" | "expense" | "transfer" => {
    switch (category) {
      case "수익":
        return "income";
      case "자산 이동":
        return "transfer";
      default:
        return "expense";
    }
  };

  // 계정 데이터 로드
  useEffect(() => {
    loadAccountData();
    loadTransaction();
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

  const loadTransaction = () => {
    try {
      const saved = localStorage.getItem("transactions");
      if (saved) {
        const list: Transaction[] = JSON.parse(saved);
        const target = list.find((t) => t.id === transactionId);
        if (target) {
          setTransaction(target);
          setDate(target.date);
          setItem(target.item);
          setAmount(String(target.amount));
          setMemo(target.description ?? "");
          setDebitAccount(target.leftAccount);
          setCreditAccount(target.rightAccount);

          //   const type = mainTransactionTypes.find((type) => {
          //     if (target.type === "income") return type.category === "수익";
          //     if (target.type === "transfer")
          //       return type.category === "자산 이동";
          //     return type.category === "지출";
          //   });
          //   if (type) setSelectedType(type);
          const type = mainTransactionTypes.find(
            (type) => type.id === target.transactionTypeId
          );
          if (type) setSelectedType(type);
        } else {
          alert("해당 거래를 찾을 수 없습니다.");
          navigate("/transactions");
        }
      }
    } catch (err) {
      console.error("거래 불러오기 오류", err);
    }
  };

  const handleUpdate = () => {
    if (!selectedType || !amount || !debitAccount || !creditAccount) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!transaction) return;

    const updatedTransaction: Transaction = {
      ...transaction,
      date,
      item,
      description: memo ?? "",
      amount: Number(amount),
      leftAccount: debitAccount,
      rightAccount: creditAccount,
      leftAccountName: getAccountName(debitAccount),
      rightAccountName: getAccountName(creditAccount),
      transactionTypeId: selectedType.id,
      type: getTypeFromCategory(selectedType.category),
    };

    onUpdate(updatedTransaction);
  };

  const getAccountName = (accountId: string) => {
    const account = accountData.accounts.find((acc) => acc.id === accountId);
    return account ? account.name : accountId;
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
      if (debitType === "비용") targetAccountType = "expense";
      if (debitType === "자산+") targetAccountType = "asset";
      if (debitType === "부채-") targetAccountType = "liability";
    } else {
      if (creditType === "자산-") targetAccountType = "asset";
      if (creditType === "부채+") targetAccountType = "liability";
      if (creditType === "수익") targetAccountType = "revenue";
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
        if (a.groupName !== b.groupName)
          return a.groupName.localeCompare(b.groupName);
        return a.name.localeCompare(b.name);
      });
  };

  useEffect(() => {
    // 거래 찾기
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const foundTransaction = transactions.find(
        (t: Transaction) => t.id === transactionId
      );
      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        navigate("/transactions");
      }
    }
  }, [navigate, transactionId]);

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
    setType(getTypeFromCategory(type.category));
    setSelectedType(type);
    setMemo(null);
    setDebitAccount("");
    setCreditAccount("");
  };

  if (!transaction) {
    return <div>Loading...</div>;
  }
  return (
    <div className="space-y-6">
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
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            {/* 아이템과 금액 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item">아이템</Label>
                <Input
                  id="item"
                  type="text"
                  placeholder="아이템을 입력하세요"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">금액</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                    원
                  </span>
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
                        isSelected
                          ? " border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      <div
                        className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mb-2`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-xs font-medium text-center">
                        {type.name}
                      </div>
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
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                    >
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
                          <span className="text-xs text-gray-500 mr-2">
                            [{account.groupName}]
                          </span>
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
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 text-xs"
                    >
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
                          <span className="text-xs text-gray-500 mr-2">
                            [{account.groupName}]
                          </span>
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
              <Textarea
                id="memo"
                placeholder="거래 내용을 입력하세요"
                value={memo ?? ""}
                onChange={(e) => setMemo(e.target.value)}
                rows={2}
              />
            </div>

            <Button
              onClick={handleUpdate}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!amount || !debitAccount || !creditAccount || !item}
            >
              <Check className="mr-2 h-4 w-4" /> 거래 수정
            </Button>
          </>
        </CardContent>
      </Card>
    </div>
  );
};
