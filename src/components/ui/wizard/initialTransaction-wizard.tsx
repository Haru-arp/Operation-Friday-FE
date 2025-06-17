import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  TrendingUp,
  RefreshCw,
  HandCoins,
  DollarSign,
  Calendar,
  Check,
  Info,
  Plus,
  Minus,
  TrendingDown,
} from "lucide-react";
import type { Transaction } from "@/types/transaction";

interface InitialTransactionWizardProps {
  onSave: (transaction: Transaction) => void;
  transactionType: string;
}

interface Account {
  id: string;
  name: string;
  groupId: string;
}

interface AccountGroup {
  id: string;
  name: string;
  type: AccountType;
  parentId?: string;
}

type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

interface AccountData {
  groups: AccountGroup[];
  accounts: Account[];
}

interface AccountWithGroupPath extends Account {
  groupPath: string;
}

// 설정용 거래 유형 (6-11번)
const settingTransactionTypes = {
  debt_transfer: {
    id: "debt_transfer",
    name: "부채 대체",
    icon: RefreshCw,
    color: "bg-indigo-500",
    description: "기존 부채를 새 부채로 대체",
    example: "대환대출, 리볼빙",
    debit: "부채-",
    credit: "부채+",
    category: "부채 이동",
    guide:
      "기존에 있던 부채를 새로운 부채로 바꾸는 거래입니다. 예를 들어 신용카드 대금을 대환대출로 갚거나, 카드 리볼빙을 이용하는 경우입니다.",
  },
  asset_initial: {
    id: "asset_initial",
    name: "자산 초기 등록",
    icon: TrendingUp,
    color: "bg-emerald-500",
    description: "가계부 시작 시 보유 자산 등록",
    example: "현금 500만 원 등록, 증여 자산 입력",
    debit: "자산+",
    credit: "자본+",
    category: "초기 세팅",
    guide:
      "가계부를 시작할 때 현재 보유하고 있는 자산을 등록하는 거래입니다. 현금, 예금, 투자자산 등을 초기 자본으로 설정합니다.",
  },
  debt_asset_creation: {
    id: "debt_asset_creation",
    name: "부채로 자산 생성",
    icon: HandCoins,
    color: "bg-cyan-500",
    description: "대출로 자산을 만들었을 때",
    example: "전세보증금 대출, 학자금 대출 입금",
    debit: "자산+",
    credit: "부채+",
    category: "초기 세팅",
    guide:
      "대출을 받아서 자산이 생긴 경우입니다. 전세보증금 대출, 학자금 대출 등으로 계좌에 돈이 들어온 상황을 기록합니다.",
  },
  asset_decrease: {
    id: "asset_decrease",
    name: "자산 감소 (자본 회수)",
    icon: TrendingDown,
    color: "bg-gray-500",
    description: "자산을 줄이며 자본도 줄임",
    example: "투자금 회수, 오류 정정",
    debit: "자본-",
    credit: "자산-",
    category: "자본 회수",
    guide:
      "개인 자본에서 자산을 빼내는 거래입니다. 투자금을 회수하거나 장부 오류를 정정할 때 사용합니다.",
  },
  debt_only_start: {
    id: "debt_only_start",
    name: "부채만 있는 시작",
    icon: CreditCard,
    color: "bg-rose-500",
    description: "자산 없이 부채만 존재",
    example: "카드값만 있는 상태로 시작",
    debit: "자본-",
    credit: "부채+",
    category: "초기 세팅",
    guide:
      "가계부를 시작할 때 자산은 없고 부채만 있는 상황을 기록합니다. 신용카드 대금이나 대출만 있는 상태에서 시작하는 경우입니다.",
  },
  capital_reclassify: {
    id: "capital_reclassify",
    name: "자본 재분류",
    icon: RefreshCw,
    color: "bg-violet-500",
    description: "자본 항목 간 이동",
    example: "개인자본 → 사업자금, 가족지원금 → 내 자산 전환",
    debit: "자본-",
    credit: "자본+",
    category: "자본 이동",
    guide:
      "자본의 성격을 바꾸는 거래입니다. 개인 자본을 사업 자금으로 전환하거나, 가족 지원금을 개인 자산으로 전환하는 경우입니다.",
  },
};
export const InitialTransactionWizard = ({
  onSave,
  transactionType,
}: InitialTransactionWizardProps) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [accountData, setAccountData] = useState<AccountData>({
    groups: [],
    accounts: [],
  });

  const selectedType =
    settingTransactionTypes[
      transactionType as keyof typeof settingTransactionTypes
    ];

  // 계정 데이터 로드
  useEffect(() => {
    loadAccountData();
  }, []);

  useEffect(() => {
    if (selectedType) {
      setMemo(`${selectedType.name} - `);
    }
  }, [selectedType]);

  const loadAccountData = () => {
    try {
      const saved = localStorage.getItem("accountData");
      if (saved) {
        setAccountData(JSON.parse(saved));
      }
    } catch (error) {
      console.error("계정 데이터 로딩 오류:", error);
    }
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
      description: memo,
      amount: Number(amount),
      leftAccount: debitAccount,
      rightAccount: creditAccount,
      leftAccountName: getAccountName(debitAccount),
      rightAccountName: getAccountName(creditAccount),
      type: selectedType.category === "초기 세팅" ? "transfer" : "expense",
      accountType: "asset",
      createdAt: "",
    };

    onSave(transaction);
  };

  // 계정명 조회
  const getAccountName = (accountId: string) => {
    const account = accountData.accounts.find((acc) => acc.id === accountId);
    return account ? account.name : accountId;
  };

  // 상위 그룹명 조회 (계층 구조 표시용)
  const getFullGroupPath = (groupId: string): string => {
    const group = accountData.groups.find((g) => g.id === groupId);
    if (!group) return "";

    if (group.parentId) {
      const parentPath = getFullGroupPath(group.parentId);
      return parentPath ? `${parentPath} > ${group.name}` : group.name;
    }
    return group.name;
  };

  // 선택된 거래 유형에 따른 계정 필터링
  const getFilteredAccounts = (position: "debit" | "credit") => {
    if (!selectedType) return [];

    const debitType = selectedType.debit;
    const creditType = selectedType.credit;

    let targetAccountType: AccountType | null = null;

    if (position === "debit") {
      if (debitType === "자산+") targetAccountType = "asset";
      if (debitType === "부채-") targetAccountType = "liability";
      if (debitType === "자본-") targetAccountType = "equity";
    } else {
      if (creditType === "자산-") targetAccountType = "asset";
      if (creditType === "부채+") targetAccountType = "liability";
      if (creditType === "자본+") targetAccountType = "equity";
    }

    if (!targetAccountType) return [];

    // 해당 타입의 그룹들을 찾고, 그 그룹에 속한 계정들만 반환
    const relevantGroupIds = accountData.groups
      .filter((group) => group.type === targetAccountType)
      .map((group) => group.id);

    return accountData.accounts
      .filter((account) => relevantGroupIds.includes(account.groupId))
      .map((account) => ({
        ...account,
        groupPath: getFullGroupPath(account.groupId),
      }))
      .sort((a, b) => a.groupPath.localeCompare(b.groupPath));
  };

  if (!selectedType) {
    return <div>잘못된 거래 유형입니다.</div>;
  }

  const Icon = selectedType.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${selectedType.color} rounded-lg flex items-center justify-center`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div>{selectedType.name}</div>
            <div className="text-sm font-normal text-gray-500">
              {selectedType.category}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 거래 설명 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            이 거래는 언제 사용하나요?
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            {selectedType.guide}
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            <strong>예시:</strong> {selectedType.example}
          </div>
        </div>

        {/* 분개 구조 표시 */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            분개 구조
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                차변 (DR)
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                  {selectedType.debit}
                </div>
                <div className="flex items-center justify-center mt-1">
                  {selectedType.debit.includes("+") ? (
                    <Plus className="h-4 w-4 text-green-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                    {selectedType.debit.includes("+") ? "증가" : "감소"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                대변 (CR)
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border-2 border-green-200 dark:border-green-700">
                <div className="font-medium text-green-900 dark:text-green-100 text-sm">
                  {selectedType.credit}
                </div>
                <div className="flex items-center justify-center mt-1">
                  {selectedType.credit.includes("+") ? (
                    <Plus className="h-4 w-4 text-green-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                    {selectedType.credit.includes("+") ? "증가" : "감소"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 기본 정보 입력 */}
        <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="memo">메모</Label>
          <Textarea
            id="memo"
            placeholder="거래 내용을 입력하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
          />
        </div>

        {/* 계정 선택 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="debit-account">
              차변 계정 ({selectedType.debit})
            </Label>
            <Select value={debitAccount} onValueChange={setDebitAccount}>
              <SelectTrigger id="debit-account">
                <SelectValue placeholder="차변 계정 선택" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredAccounts("debit").map(
                  (account: AccountWithGroupPath) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-xs text-gray-500">
                          {account.groupPath}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit-account">
              대변 계정 ({selectedType.credit})
            </Label>
            <Select value={creditAccount} onValueChange={setCreditAccount}>
              <SelectTrigger id="credit-account">
                <SelectValue placeholder="대변 계정 선택" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredAccounts("credit").map(
                  (account: AccountWithGroupPath) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-xs text-gray-500">
                          {account.groupPath}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 거래 요약 */}
        {debitAccount && creditAccount && amount && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="font-medium mb-1">거래 요약</div>
              <div className="text-sm">
                <strong>차변:</strong> {getAccountName(debitAccount)}{" "}
                {Number(amount).toLocaleString()}원{" "}
                <Badge variant="outline" className="ml-1">
                  {selectedType.debit.includes("+") ? "증가" : "감소"}
                </Badge>
                <br />
                <strong>대변:</strong> {getAccountName(creditAccount)}{" "}
                {Number(amount).toLocaleString()}원{" "}
                <Badge variant="outline" className="ml-1">
                  {selectedType.credit.includes("+") ? "증가" : "감소"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={!amount || !debitAccount || !creditAccount}
        >
          <Check className="mr-2 h-4 w-4" /> 거래 저장
        </Button>
      </CardContent>
    </Card>
  );
};
