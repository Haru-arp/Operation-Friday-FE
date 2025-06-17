import React from "react";
import { useState, useEffect } from "react";
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
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  groupId?: string;
  type: AccountType;
}

interface AccountGroup {
  id: string;
  name: string;
  type: AccountType;
  isExpanded?: boolean;
}

type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

interface AccountData {
  groups: AccountGroup[];
  accounts: Account[];
}

const accountTypeInfo = {
  asset: {
    name: "자산",
    icon: Building2,
    color: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-blue-700",
  },
  liability: {
    name: "부채",
    icon: CreditCard,
    color: "bg-red-500 hover:bg-red-600",
    textColor: "text-red-700",
  },
  revenue: {
    name: "수익",
    icon: TrendingUp,
    color: "bg-green-500 hover:bg-green-600",
    textColor: "text-green-700",
  },
  expense: {
    name: "비용",
    icon: TrendingDown,
    color: "bg-orange-500 hover:bg-orange-600",
    textColor: "text-orange-700",
  },
  equity: {
    name: "자본",
    icon: User,
    color: "bg-purple-500 hover:bg-purple-600",
    textColor: "text-purple-700",
  },
};

// 새로운 계정 구조
const defaultAccountData: AccountData = {
  groups: [
    // 자산 그룹
    { id: "asset_cash", name: "현금성 자산", type: "asset" },
    { id: "asset_investment", name: "투자자산", type: "asset" },
    { id: "asset_realestate", name: "부동산", type: "asset" },
    { id: "asset_other", name: "기타자산", type: "asset" },

    // 부채 그룹
    { id: "liability_card", name: "신용카드", type: "liability" },
    { id: "liability_loan", name: "대출", type: "liability" },
    { id: "liability_other", name: "기타부채", type: "liability" },

    // 자본 그룹
    { id: "equity_net", name: "순자산", type: "equity" },

    // 수익 그룹
    { id: "revenue_labor", name: "근로소득", type: "revenue" },
    { id: "revenue_business", name: "사업소득", type: "revenue" },
    { id: "revenue_investment", name: "투자수익", type: "revenue" },
    { id: "revenue_other", name: "기타수익", type: "revenue" },

    // 비용 그룹
    { id: "expense_housing", name: "주거비", type: "expense" },
    { id: "expense_living", name: "생활비", type: "expense" },
    { id: "expense_health", name: "의료/건강비", type: "expense" },
    { id: "expense_culture", name: "문화/여가비", type: "expense" },
    { id: "expense_social", name: "사회적비용", type: "expense" },
    { id: "expense_financial", name: "금융/세금/기타", type: "expense" },
  ],
  accounts: [
    // === 자산 계정 ===
    // 현금성 자산
    { id: "cash", name: "현금", groupId: "asset_cash", type: "asset" },
    { id: "deposit", name: "예금", groupId: "asset_cash", type: "asset" },
    { id: "savings", name: "적금", groupId: "asset_cash", type: "asset" },
    {
      id: "time_deposit",
      name: "정기예금",
      groupId: "asset_cash",
      type: "asset",
    },
    {
      id: "short_fund",
      name: "단기투자(펀드)",
      groupId: "asset_cash",
      type: "asset",
    },
    {
      id: "short_stock",
      name: "단기투자(주식)",
      groupId: "asset_cash",
      type: "asset",
    },

    // 투자자산
    {
      id: "long_stock",
      name: "장기주식",
      groupId: "asset_investment",
      type: "asset",
    },
    {
      id: "pension_savings",
      name: "연금저축",
      groupId: "asset_investment",
      type: "asset",
    },
    {
      id: "retirement_pension",
      name: "퇴직연금",
      groupId: "asset_investment",
      type: "asset",
    },
    {
      id: "pension_insurance",
      name: "연금보험",
      groupId: "asset_investment",
      type: "asset",
    },
    {
      id: "life_insurance",
      name: "종신보험",
      groupId: "asset_investment",
      type: "asset",
    },

    // 부동산
    {
      id: "apartment",
      name: "아파트/주택",
      groupId: "asset_realestate",
      type: "asset",
    },
    {
      id: "commercial",
      name: "상가/오피스텔",
      groupId: "asset_realestate",
      type: "asset",
    },
    { id: "land", name: "토지", groupId: "asset_realestate", type: "asset" },
    {
      id: "presale",
      name: "분양권",
      groupId: "asset_realestate",
      type: "asset",
    },

    // 기타자산
    { id: "car", name: "자동차", groupId: "asset_other", type: "asset" },
    {
      id: "electronics",
      name: "전자제품",
      groupId: "asset_other",
      type: "asset",
    },
    { id: "furniture", name: "가구", groupId: "asset_other", type: "asset" },
    {
      id: "loan_to_others",
      name: "대여금",
      groupId: "asset_other",
      type: "asset",
    },
    {
      id: "deposit_paid",
      name: "보증금",
      groupId: "asset_other",
      type: "asset",
    },

    // === 부채 계정 ===
    // 신용카드
    {
      id: "card_unpaid",
      name: "카드 미지급금",
      groupId: "liability_card",
      type: "liability",
    },
    {
      id: "card_loan",
      name: "카드론",
      groupId: "liability_card",
      type: "liability",
    },
    {
      id: "cash_advance",
      name: "현금서비스",
      groupId: "liability_card",
      type: "liability",
    },

    // 대출
    {
      id: "mortgage",
      name: "주택담보대출",
      groupId: "liability_loan",
      type: "liability",
    },
    {
      id: "credit_loan",
      name: "신용대출",
      groupId: "liability_loan",
      type: "liability",
    },
    {
      id: "jeonse_loan",
      name: "전세자금대출",
      groupId: "liability_loan",
      type: "liability",
    },
    {
      id: "auto_loan",
      name: "자동차할부",
      groupId: "liability_loan",
      type: "liability",
    },
    {
      id: "student_loan",
      name: "학자금대출",
      groupId: "liability_loan",
      type: "liability",
    },

    // 기타부채
    {
      id: "personal_debt",
      name: "개인차용금",
      groupId: "liability_other",
      type: "liability",
    },
    {
      id: "unpaid_bills",
      name: "미지급금",
      groupId: "liability_other",
      type: "liability",
    },
    {
      id: "overdraft",
      name: "마이너스통장",
      groupId: "liability_other",
      type: "liability",
    },

    // === 자본 계정 ===
    // 순자산
    {
      id: "initial_capital",
      name: "기초자본",
      groupId: "equity_net",
      type: "equity",
    },
    {
      id: "capital_adjustment",
      name: "자본조정",
      groupId: "equity_net",
      type: "equity",
    },
    {
      id: "capital_withdrawal",
      name: "자본인출",
      groupId: "equity_net",
      type: "equity",
    },
    {
      id: "gift_inheritance",
      name: "증여/상속",
      groupId: "equity_net",
      type: "equity",
    },

    // === 수익 계정 ===
    // 근로소득
    {
      id: "salary_basic",
      name: "기본급",
      groupId: "revenue_labor",
      type: "revenue",
    },
    {
      id: "salary_bonus",
      name: "상여금",
      groupId: "revenue_labor",
      type: "revenue",
    },
    {
      id: "salary_overtime",
      name: "야근수당",
      groupId: "revenue_labor",
      type: "revenue",
    },
    {
      id: "part_time",
      name: "아르바이트",
      groupId: "revenue_labor",
      type: "revenue",
    },
    {
      id: "freelance",
      name: "프리랜서",
      groupId: "revenue_labor",
      type: "revenue",
    },

    // 사업소득
    {
      id: "business_income",
      name: "개인사업 수입",
      groupId: "revenue_business",
      type: "revenue",
    },
    {
      id: "rental_income",
      name: "임대수입",
      groupId: "revenue_business",
      type: "revenue",
    },
    {
      id: "online_sales",
      name: "온라인판매",
      groupId: "revenue_business",
      type: "revenue",
    },

    // 투자수익
    {
      id: "stock_dividend",
      name: "주식 배당금",
      groupId: "revenue_investment",
      type: "revenue",
    },
    {
      id: "stock_profit",
      name: "주식 매매차익",
      groupId: "revenue_investment",
      type: "revenue",
    },
    {
      id: "deposit_interest",
      name: "예적금 이자",
      groupId: "revenue_investment",
      type: "revenue",
    },
    {
      id: "fund_profit",
      name: "펀드 수익",
      groupId: "revenue_investment",
      type: "revenue",
    },
    {
      id: "realestate_profit",
      name: "부동산 매매차익",
      groupId: "revenue_investment",
      type: "revenue",
    },

    // 기타수익
    {
      id: "allowance",
      name: "용돈",
      groupId: "revenue_other",
      type: "revenue",
    },
    { id: "pension", name: "연금", groupId: "revenue_other", type: "revenue" },
    {
      id: "insurance_payout",
      name: "보험금",
      groupId: "revenue_other",
      type: "revenue",
    },
    { id: "prize", name: "상금", groupId: "revenue_other", type: "revenue" },
    {
      id: "tax_refund",
      name: "환급금",
      groupId: "revenue_other",
      type: "revenue",
    },
    {
      id: "gift_money",
      name: "증여",
      groupId: "revenue_other",
      type: "revenue",
    },

    // === 비용 계정 ===
    // 주거비
    {
      id: "rent",
      name: "월세/관리비",
      groupId: "expense_housing",
      type: "expense",
    },
    {
      id: "mortgage_payment",
      name: "주택대출(원금+이자)",
      groupId: "expense_housing",
      type: "expense",
    },
    {
      id: "electricity",
      name: "전기요금",
      groupId: "expense_housing",
      type: "expense",
    },
    {
      id: "gas",
      name: "가스요금",
      groupId: "expense_housing",
      type: "expense",
    },
    {
      id: "water",
      name: "수도요금",
      groupId: "expense_housing",
      type: "expense",
    },
    {
      id: "mobile",
      name: "휴대폰요금",
      groupId: "expense_housing",
      type: "expense",
    },
    {
      id: "internet",
      name: "인터넷요금",
      groupId: "expense_housing",
      type: "expense",
    },

    // 생활비
    {
      id: "groceries",
      name: "식료품",
      groupId: "expense_living",
      type: "expense",
    },
    {
      id: "restaurant",
      name: "외식",
      groupId: "expense_living",
      type: "expense",
    },
    {
      id: "delivery",
      name: "배달",
      groupId: "expense_living",
      type: "expense",
    },
    {
      id: "public_transport",
      name: "대중교통",
      groupId: "expense_living",
      type: "expense",
    },
    { id: "taxi", name: "택시", groupId: "expense_living", type: "expense" },
    {
      id: "parking",
      name: "주차비",
      groupId: "expense_living",
      type: "expense",
    },
    { id: "fuel", name: "기름값", groupId: "expense_living", type: "expense" },
    {
      id: "cosmetics",
      name: "화장품",
      groupId: "expense_living",
      type: "expense",
    },
    {
      id: "clothing",
      name: "의류",
      groupId: "expense_living",
      type: "expense",
    },
    {
      id: "daily_goods",
      name: "생활용품",
      groupId: "expense_living",
      type: "expense",
    },

    // 의료/건강비
    {
      id: "hospital",
      name: "병원비",
      groupId: "expense_health",
      type: "expense",
    },
    {
      id: "medicine",
      name: "약값",
      groupId: "expense_health",
      type: "expense",
    },
    {
      id: "health_checkup",
      name: "건강검진",
      groupId: "expense_health",
      type: "expense",
    },
    { id: "gym", name: "헬스장", groupId: "expense_health", type: "expense" },
    {
      id: "beauty",
      name: "이미용비",
      groupId: "expense_health",
      type: "expense",
    },

    // 문화/여가비
    { id: "travel", name: "여행", groupId: "expense_culture", type: "expense" },
    {
      id: "movie",
      name: "영화/공연",
      groupId: "expense_culture",
      type: "expense",
    },
    {
      id: "hobby",
      name: "취미활동",
      groupId: "expense_culture",
      type: "expense",
    },
    {
      id: "game",
      name: "게임/앱결제",
      groupId: "expense_culture",
      type: "expense",
    },
    {
      id: "books",
      name: "도서구입",
      groupId: "expense_culture",
      type: "expense",
    },

    // 사회적비용
    {
      id: "wedding_gift",
      name: "축의금",
      groupId: "expense_social",
      type: "expense",
    },
    {
      id: "funeral_gift",
      name: "조의금",
      groupId: "expense_social",
      type: "expense",
    },
    {
      id: "company_dinner",
      name: "회식",
      groupId: "expense_social",
      type: "expense",
    },
    { id: "meeting", name: "모임", groupId: "expense_social", type: "expense" },
    { id: "gift", name: "선물", groupId: "expense_social", type: "expense" },
    {
      id: "education",
      name: "학원/강의",
      groupId: "expense_social",
      type: "expense",
    },
    {
      id: "certification",
      name: "자격증",
      groupId: "expense_social",
      type: "expense",
    },

    // 금융/세금/기타
    {
      id: "health_insurance",
      name: "건강보험료",
      groupId: "expense_financial",
      type: "expense",
    },
    {
      id: "car_insurance",
      name: "자동차보험료",
      groupId: "expense_financial",
      type: "expense",
    },
    {
      id: "life_insurance_fee",
      name: "생명보험료",
      groupId: "expense_financial",
      type: "expense",
    },
    { id: "tax", name: "세금", groupId: "expense_financial", type: "expense" },
    {
      id: "fee",
      name: "수수료",
      groupId: "expense_financial",
      type: "expense",
    },
    { id: "fine", name: "벌금", groupId: "expense_financial", type: "expense" },
    {
      id: "investment_cost",
      name: "투자비용",
      groupId: "expense_financial",
      type: "expense",
    },
    {
      id: "misc",
      name: "기타잡비",
      groupId: "expense_financial",
      type: "expense",
    },
  ],
};
export default function Accounts() {
  const [accountData, setAccountData] =
    useState<AccountData>(defaultAccountData);
  const [selectedType, setSelectedType] = useState<AccountType>("asset");
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccountGroup | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [groupFormData, setGroupFormData] = useState({ name: "" });
  const [accountFormData, setAccountFormData] = useState({
    name: "",
    groupId: "",
  });

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = () => {
    try {
      const saved = localStorage.getItem("accountData");
      if (saved) {
        setAccountData(JSON.parse(saved));
      } else {
        saveAccountData(defaultAccountData);
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
        asset: data.accounts.filter((a) => a.type === "asset"),
        liability: data.accounts.filter((a) => a.type === "liability"),
        equity: data.accounts.filter((a) => a.type === "equity"),
        revenue: data.accounts.filter((a) => a.type === "revenue"),
        expense: data.accounts.filter((a) => a.type === "expense"),
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
    setIsAccountDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setAccountFormData({ name: account.name, groupId: account.groupId || "" });
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

    const newData = { ...accountData };

    if (editingAccount) {
      const index = newData.accounts.findIndex(
        (a) => a.id === editingAccount.id
      );
      if (index !== -1) {
        newData.accounts[index] = {
          ...editingAccount,
          name: accountFormData.name,
          groupId: accountFormData.groupId || undefined,
        };
      }
    } else {
      const newAccount: Account = {
        id: `account_${Date.now()}`,
        name: accountFormData.name,
        groupId: accountFormData.groupId || undefined,
        type: selectedType,
      };
      newData.accounts.push(newAccount);
    }

    setAccountData(newData);
    saveAccountData(newData);
    setIsAccountDialogOpen(false);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? "계정 수정" : "계정 추가"}
            </DialogTitle>
            <DialogDescription>
              {accountTypeInfo[selectedType].name} 계정을{" "}
              {editingAccount ? "수정" : "추가"}합니다.
            </DialogDescription>
          </DialogHeader>
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
