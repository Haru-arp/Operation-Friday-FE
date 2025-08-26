import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  User,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  FolderPlus,
  FileText,
  Info,
} from "lucide-react";
import { useLoadAccounts } from "@/hook/useAccountData";
import { getAccountData } from "@/utils/accountData";
import type { AccountType, CategoryEnum } from "@/types/transaction";

type AccountSettingType = AccountSettings["type"];

interface CreditCardSettings {
  usageStartDay: number;
  usageEndDay: number;
  paymentDay: number;
  linkedAssetId: string;
  targetAmount?: number;
  installmentRounding: "truncate_1" | "truncate_100"; // 할부 처리 방식
}

interface DebitCardSettings {
  linkedAssetId: string;
}

interface AccountSettings {
  type:
    | "general"
    | "partner"
    | "liquid_cash"
    | "credit_card"
    | "debit_card"
    | "variable"
    | "fixed";
  creditCard?: CreditCardSettings;
  debitCard?: DebitCardSettings;
}

interface Account {
  id: string;
  name: string;
  groupId?: string;
  type: AccountType;
  settings?: AccountSettings;
}

export interface Accounts {
  id: string;
  name: string;
  type: AccountType;
  groupId?: string;
  groupName?: string;
  category: CategoryEnum;
}

interface AccountGroup {
  id: string;
  name: string;
  type: AccountType;
  isExpanded?: boolean;
}

// type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

interface AccountData {
  groups: AccountGroup[];
  accounts: Account[];
}

const accountTypeInfo = {
  ASSET: {
    name: "자산",
    icon: Building2,
    color: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-blue-700",
  },
  LIABILITY: {
    name: "부채",
    icon: CreditCard,
    color: "bg-red-500 hover:bg-red-600",
    textColor: "text-red-700",
  },
  REVENUE: {
    name: "수익",
    icon: TrendingUp,
    color: "bg-green-500 hover:bg-green-600",
    textColor: "text-green-700",
  },
  EXPENSE: {
    name: "비용",
    icon: TrendingDown,
    color: "bg-orange-500 hover:bg-orange-600",
    textColor: "text-orange-700",
  },
  EQUITY: {
    name: "자본",
    icon: User,
    color: "bg-purple-500 hover:bg-purple-600",
    textColor: "text-purple-700",
  },
};

// 계정 종류별 설정 옵션
const accountSettingsOptions = {
  ASSET: [
    {
      value: "general",
      label: "일반 항목",
      description: "특별한 특징이 없는 자산 항목",
    },
    {
      value: "partner",
      label: "거래처 관리 항목",
      description: "받을 돈, 보험상품 등 거래처별 관리",
    },
    {
      value: "liquid_cash",
      label: "유동성 현금",
      description: "쉽고 빠르게 현금화 가능한 자산",
    },
  ],
  LIABILITY: [
    {
      value: "general",
      label: "일반 항목",
      description: "특별한 특징이 없는 부채 항목",
    },
    {
      value: "partner",
      label: "거래처 관리 항목",
      description: "갚을 돈, 대출상품 등 거래처별 관리",
    },
    {
      value: "credit_card",
      label: "신용카드",
      description: "일반적인 신용카드",
    },
    {
      value: "debit_card",
      label: "체크(직불)카드",
      description: "연결된 계좌에서 즉시 차감",
    },
  ],
  EQUITY: [
    {
      value: "general",
      label: "일반 항목",
      description: "특별한 특징이 없는 자본 항목",
    },
  ],
  REVENUE: [
    {
      value: "general",
      label: "일반 항목",
      description: "특별한 특징이 없는 수익 항목",
    },
    {
      value: "fixed",
      label: "고정 항목",
      description: "월급 등 정기적이고 예측 가능한 수익",
    },
    {
      value: "variable",
      label: "유동 항목",
      description: "투잡수익 등 즉흥적이고 들쭉날쭉한 수익",
    },
  ],
  EXPENSE: [
    {
      value: "general",
      label: "일반 항목",
      description: "특별한 특징이 없는 비용 항목",
    },
    {
      value: "fixed",
      label: "고정 항목",
      description: "주거비, 식비 등 정기적이고 예측 가능한 비용",
    },
    {
      value: "variable",
      label: "유동 항목",
      description: "유흥비, 경조사비 등 즉흥적이고 들쭉날쭉한 비용",
    },
  ],
};

export default function Accounts() {
  const {
    data: accounts,
    isLoading: _isAccountsLoading,
    isError: _isAccountsError,
  } = useLoadAccounts();

  const [accountData, setAccountData] = useState<AccountData>({
    groups: [],
    accounts: [],
  });
  const [selectedType, setSelectedType] = useState<AccountType>("ASSET");
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccountGroup | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [groupFormData, setGroupFormData] = useState({ name: "" });
  const [accountFormData, setAccountFormData] = useState({
    name: "",
    groupId: "",
  });
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    type: "general",
  });

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

  const saveAccountData = (data: AccountData) => {
    try {
      localStorage.setItem("accountData", JSON.stringify(data));
      // 기존 거래 입력에서 사용하던 형식으로도 저장 (호환성)
      const legacyFormat = {
        asset: data.accounts.filter((a) => a.type === "ASSET"),
        liability: data.accounts.filter((a) => a.type === "LIABILITY"),
        equity: data.accounts.filter((a) => a.type === "EQUITY"),
        revenue: data.accounts.filter((a) => a.type === "REVENUE"),
        expense: data.accounts.filter((a) => a.type === "EXPENSE"),
      };
      localStorage.setItem("accounts", JSON.stringify(legacyFormat));
    } catch (error) {
      console.error("계정 데이터 저장 오류:", error);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newData = {
      ...accountData,
      groups: accountData.groups.map((group) =>
        group.id === groupId
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      ),
    };
    setAccountData(newData);
    saveAccountData(newData);
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setGroupFormData({ name: "" });
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: AccountGroup) => {
    setEditingGroup(group);
    setGroupFormData({ name: group.name });
    setIsGroupDialogOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (
      confirm(
        "이 그룹을 삭제하면 그룹에 속한 계정들은 그룹 없는 상태가 됩니다. 계속하시겠습니까?"
      )
    ) {
      const newData = {
        groups: accountData.groups.filter((g) => g.id !== groupId),
        accounts: accountData.accounts.map((a) =>
          a.groupId === groupId ? { ...a, groupId: undefined } : a
        ),
      };
      setAccountData(newData);
      saveAccountData(newData);
    }
  };

  const handleSaveGroup = () => {
    if (!groupFormData.name) {
      alert("그룹명을 입력해주세요.");
      return;
    }

    const newData = { ...accountData };

    if (editingGroup) {
      const index = newData.groups.findIndex((g) => g.id === editingGroup.id);
      if (index !== -1) {
        newData.groups[index] = {
          ...editingGroup,
          name: groupFormData.name,
        };
      }
    } else {
      const newGroup: AccountGroup = {
        id: `${selectedType}_group_${Date.now()}`,
        name: groupFormData.name,
        type: selectedType,
      };
      newData.groups.push(newGroup);
    }

    setAccountData(newData);
    saveAccountData(newData);
    setIsGroupDialogOpen(false);
  };

  const handleAddAccount = (groupId?: string) => {
    setEditingAccount(null);
    setAccountFormData({ name: "", groupId: groupId || "" });
    setAccountSettings({ type: "general" });
    setIsAccountDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setAccountFormData({ name: account.name, groupId: account.groupId || "" });
    setAccountSettings(account.settings || { type: "general" });
    setIsAccountDialogOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const newData = {
        ...accountData,
        accounts: accountData.accounts.filter((a) => a.id !== accountId),
      };
      setAccountData(newData);
      saveAccountData(newData);
    }
  };

  const handleSaveAccount = () => {
    if (!accountFormData.name) {
      alert("계정명을 입력해주세요.");
      return;
    }

    // 신용카드/직불카드 설정 검증
    if (accountSettings.type === "credit_card" && accountSettings.creditCard) {
      if (!accountSettings.creditCard.linkedAssetId) {
        alert("대금결제항목을 선택해주세요.");
        return;
      }
    }

    if (accountSettings.type === "debit_card" && accountSettings.debitCard) {
      if (!accountSettings.debitCard.linkedAssetId) {
        alert("연결된 자산 계정을 선택해주세요.");
        return;
      }
    }

    const newData = { ...accountData };
    const accountWithSettings = {
      id: editingAccount?.id || `account_${Date.now()}`,
      name: accountFormData.name,
      groupId: accountFormData.groupId || undefined,
      type: selectedType,
      settings: accountSettings,
    };

    if (editingAccount) {
      const index = newData.accounts.findIndex(
        (a) => a.id === editingAccount.id
      );
      if (index !== -1) {
        newData.accounts[index] = accountWithSettings;
      }
    } else {
      newData.accounts.push(accountWithSettings);
    }

    setAccountData(newData);
    saveAccountData(newData);
    setIsAccountDialogOpen(false);
    setAccountSettings({ type: "general" }); // 폼 초기화
  };

  const getGroupsByType = (type: AccountType) => {
    return accountData.groups.filter((g) => g.type === type);
  };

  const getAccountsByType = (type: AccountType) => {
    return accountData.accounts.filter((a) => a.type === type);
  };

  const getAccountsByGroup = (groupId: string) => {
    return accountData.accounts.filter((a) => a.groupId === groupId);
  };

  const getUngroupedAccounts = (type: AccountType) => {
    return accountData.accounts.filter((a) => a.type === type && !a.groupId);
  };

  const getSettingsBadge = (account: Account) => {
    if (!account.settings || account.settings.type === "general") return null;

    const settingsLabels = {
      partner: "거래처",
      liquid_cash: "유동성",
      credit_card: "신용카드",
      debit_card: "직불카드",
      fixed: "고정",
      variable: "유동",
    };

    const colors = {
      partner: "bg-purple-100 text-purple-800",
      liquid_cash: "bg-blue-100 text-blue-800",
      credit_card: "bg-red-100 text-red-800",
      debit_card: "bg-green-100 text-green-800",
      fixed: "bg-gray-100 text-gray-800",
      variable: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge className={`text-xs ${colors[account.settings.type]}`}>
        {settingsLabels[account.settings.type]}
      </Badge>
    );
  };

  const renderGroup = (group: AccountGroup) => {
    const accounts = getAccountsByGroup(group.id);
    const isExpanded = group.isExpanded !== false;

    return (
      <div key={group.id} className="mb-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleGroupExpansion(group.id)}
              className="p-0 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <FolderPlus className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{group.name}</span>
            <Badge variant="outline" className="text-xs">
              {accounts.length}개
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleAddAccount(group.id)}>
                <Plus className="h-4 w-4 mr-2" />
                계정 추가
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                <Edit className="h-4 w-4 mr-2" />
                그룹 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteGroup(group.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                그룹 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isExpanded && (
          <div className="ml-4 space-y-2">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{account.name}</span>
                  {getSettingsBadge(account)}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAccount(account)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUngroupedAccounts = (type: AccountType) => {
    const accounts = getUngroupedAccounts(type);

    if (accounts.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-600">그룹 없는 계정</span>
            <Badge variant="outline" className="text-xs">
              {accounts.length}개
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border ml-4"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>{account.name}</span>
                {getSettingsBadge(account)}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditAccount(account)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getAvailableGroups = () => {
    return accountData.groups.filter((g) => g.type === selectedType);
  };

  const getAssetAccounts = () => {
    return accountData.accounts.filter((a) => a.type === "ASSET");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 페이지 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          계정 관리
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          자산, 부채, 수익, 비용 계정을 관리하세요
        </p>
      </div>

      {/* 계정 유형 탭 */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {Object.entries(accountTypeInfo).map(([type, info]) => {
            const Icon = info.icon;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as AccountType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  isSelected
                    ? `${info.color} text-white shadow-sm`
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 계정 유형의 내용 */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {React.createElement(accountTypeInfo[selectedType].icon, {
                className: "h-5 w-5",
              })}
              {accountTypeInfo[selectedType].name} 계정
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAddGroup()}
                size="sm"
                variant="outline"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                그룹 추가
              </Button>
              <Button onClick={() => handleAddAccount()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                계정 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 그룹들 */}
            {getGroupsByType(selectedType).map((group) => renderGroup(group))}

            {/* 그룹 없는 계정들 */}
            {renderUngroupedAccounts(selectedType)}

            {/* 계정이 하나도 없는 경우 */}
            {getAccountsByType(selectedType).length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {accountTypeInfo[selectedType].name} 계정이 없습니다
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  첫 번째 계정을 추가해보세요
                </p>
                <Button onClick={() => handleAddAccount()}>
                  <Plus className="h-4 w-4 mr-2" />
                  계정 추가
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 그룹 추가/수정 다이얼로그 */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "그룹 수정" : "그룹 추가"}
            </DialogTitle>
            <DialogDescription>
              {accountTypeInfo[selectedType].name} 그룹을{" "}
              {editingGroup ? "수정" : "추가"}합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">그룹명</Label>
              <Input
                id="group-name"
                value={groupFormData.name}
                onChange={(e) =>
                  setGroupFormData({ ...groupFormData, name: e.target.value })
                }
                placeholder="그룹명을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGroupDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleSaveGroup}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계정 추가/수정 다이얼로그 */}
      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? "계정 수정" : "계정 추가"}
            </DialogTitle>
            <DialogDescription>
              {accountTypeInfo[selectedType].name} 계정을{" "}
              {editingAccount ? "수정" : "추가"}합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">계정명</Label>
                <Input
                  id="account-name"
                  value={accountFormData.name}
                  onChange={(e) =>
                    setAccountFormData({
                      ...accountFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="계정명을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-group">소속 그룹 (선택사항)</Label>
                <select
                  id="account-group"
                  value={accountFormData.groupId}
                  onChange={(e) =>
                    setAccountFormData({
                      ...accountFormData,
                      groupId: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="">그룹 없음</option>
                  {getAvailableGroups().map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 계정 종류 선택 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>계정 종류</Label>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="grid gap-3">
                {accountSettingsOptions[selectedType]?.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      accountSettings.type === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setAccountSettings({
                        ...accountSettings,
                        type: option.value as AccountSettingType,
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={accountSettings.type === option.value}
                        onChange={() =>
                          setAccountSettings({
                            ...accountSettings,
                            type: option.value as AccountSettingType,
                          })
                        }
                        className="text-blue-600"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 신용카드 추가 설정 */}
            {accountSettings.type === "credit_card" && (
              <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  신용카드 설정
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usage-start">사용기간 시작일</Label>
                    <Input
                      id="usage-start"
                      type="number"
                      min="1"
                      max="31"
                      value={accountSettings.creditCard?.usageStartDay || ""}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          creditCard: {
                            usageStartDay:
                              accountSettings.creditCard?.usageStartDay ?? 1,
                            usageEndDay:
                              accountSettings.creditCard?.usageEndDay ?? 31,
                            paymentDay:
                              accountSettings.creditCard?.paymentDay ?? 15,
                            linkedAssetId:
                              accountSettings.creditCard?.linkedAssetId ?? "",
                            targetAmount:
                              Number.parseInt(e.target.value) || undefined,
                            installmentRounding:
                              accountSettings.creditCard
                                ?.installmentRounding === "truncate_1" ||
                              accountSettings.creditCard
                                ?.installmentRounding === "truncate_100"
                                ? accountSettings.creditCard.installmentRounding
                                : "truncate_1", // ✅ 타입 보장
                          },
                        })
                      }
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage-end">사용기간 종료일</Label>
                    <Input
                      id="usage-end"
                      type="number"
                      min="1"
                      max="31"
                      value={accountSettings.creditCard?.usageEndDay || ""}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          creditCard: {
                            usageStartDay:
                              accountSettings.creditCard?.usageStartDay ?? 1,
                            usageEndDay:
                              accountSettings.creditCard?.usageEndDay ?? 31,
                            paymentDay:
                              accountSettings.creditCard?.paymentDay ?? 15,
                            linkedAssetId:
                              accountSettings.creditCard?.linkedAssetId ?? "",
                            targetAmount:
                              Number.parseInt(e.target.value) || undefined,
                            installmentRounding:
                              accountSettings.creditCard
                                ?.installmentRounding === "truncate_1" ||
                              accountSettings.creditCard
                                ?.installmentRounding === "truncate_100"
                                ? accountSettings.creditCard.installmentRounding
                                : "truncate_1", // ✅ 타입 보장
                          },
                        })
                      }
                      placeholder="31"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-day">결제일</Label>
                  <Input
                    id="payment-day"
                    type="number"
                    min="1"
                    max="31"
                    value={accountSettings.creditCard?.paymentDay || ""}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        creditCard: {
                          usageStartDay:
                            accountSettings.creditCard?.usageStartDay ?? 1,
                          usageEndDay:
                            accountSettings.creditCard?.usageEndDay ?? 31,
                          paymentDay:
                            accountSettings.creditCard?.paymentDay ?? 15,
                          linkedAssetId:
                            accountSettings.creditCard?.linkedAssetId ?? "",
                          targetAmount:
                            Number.parseInt(e.target.value) || undefined,
                          installmentRounding:
                            accountSettings.creditCard?.installmentRounding ===
                              "truncate_1" ||
                            accountSettings.creditCard?.installmentRounding ===
                              "truncate_100"
                              ? accountSettings.creditCard.installmentRounding
                              : "truncate_1", // ✅ 타입 보장
                        },
                      })
                    }
                    placeholder="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linked-asset">대금결제항목</Label>
                  <select
                    id="linked-asset"
                    value={accountSettings.creditCard?.linkedAssetId || ""}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        creditCard: {
                          usageStartDay:
                            accountSettings.creditCard?.usageStartDay ?? 1,
                          usageEndDay:
                            accountSettings.creditCard?.usageEndDay ?? 31,
                          paymentDay:
                            accountSettings.creditCard?.paymentDay ?? 15,
                          linkedAssetId:
                            accountSettings.creditCard?.linkedAssetId ?? "",
                          targetAmount:
                            Number.parseInt(e.target.value) || undefined,
                          installmentRounding:
                            accountSettings.creditCard?.installmentRounding ===
                              "truncate_1" ||
                            accountSettings.creditCard?.installmentRounding ===
                              "truncate_100"
                              ? accountSettings.creditCard.installmentRounding
                              : "truncate_1", // ✅ 타입 보장
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="">자산 계정 선택</option>
                    {getAssetAccounts().map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-amount">
                    목표 사용금액 (선택사항)
                  </Label>
                  <Input
                    id="target-amount"
                    type="number"
                    value={accountSettings.creditCard?.targetAmount || ""}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        creditCard: {
                          usageStartDay:
                            accountSettings.creditCard?.usageStartDay ?? 1,
                          usageEndDay:
                            accountSettings.creditCard?.usageEndDay ?? 31,
                          paymentDay:
                            accountSettings.creditCard?.paymentDay ?? 15,
                          linkedAssetId:
                            accountSettings.creditCard?.linkedAssetId ?? "",
                          targetAmount:
                            Number.parseInt(e.target.value) || undefined,
                          installmentRounding:
                            accountSettings.creditCard?.installmentRounding ===
                              "truncate_1" ||
                            accountSettings.creditCard?.installmentRounding ===
                              "truncate_100"
                              ? accountSettings.creditCard.installmentRounding
                              : "truncate_1", // ✅ 타입 보장
                        },
                      })
                    }
                    placeholder="월 목표 사용금액"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installment-rounding">
                    할부입력시 처리방식
                  </Label>
                  <select
                    id="installment-rounding"
                    value={
                      accountSettings.creditCard?.installmentRounding ||
                      "truncate_1"
                    }
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        creditCard: {
                          ...accountSettings.creditCard,
                          usageStartDay:
                            accountSettings.creditCard?.usageStartDay || 1,
                          usageEndDay:
                            accountSettings.creditCard?.usageEndDay || 31,
                          paymentDay:
                            accountSettings.creditCard?.paymentDay || 15,
                          linkedAssetId:
                            accountSettings.creditCard?.linkedAssetId || "",
                          installmentRounding: e.target.value as
                            | "truncate_1"
                            | "truncate_100",
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="truncate_1">
                      1원 미만 절삭 (국민, 농협, 비씨, 우리, 하나)
                    </option>
                    <option value="truncate_100">
                      100원 미만 절삭 (롯데, 삼성, 신한, 현대)
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* 직불카드 추가 설정 */}
            {accountSettings.type === "debit_card" && (
              <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  직불카드 설정
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="debit-linked-asset">연결된 자산 계정</Label>
                  <select
                    id="debit-linked-asset"
                    value={accountSettings.debitCard?.linkedAssetId || ""}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        debitCard: {
                          linkedAssetId: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="">자산 계정 선택</option>
                    {getAssetAccounts().map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAccountDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleSaveAccount}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
