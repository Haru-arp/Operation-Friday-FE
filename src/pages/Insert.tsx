import type { Transaction } from "@/types/transaction";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  PiggyBank,
  Car,
  Home,
  Utensils,
  ShoppingCart,
  Heart,
  GraduationCap,
  Smartphone,
  Zap,
  RefreshCw,
  DollarSign,
  Calendar,
  Check,
  Info,
  Plus,
  RotateCcw,
  Target,
  HandCoins,
  Receipt,
  Minus,
} from "lucide-react";
type ChangeDirection = "+" | "-" | "±";

type TransactionType =
  | "income"
  | "expense"
  | "transfer"
  | "card"
  | "liability"
  | "investment"
  | "equity"
  | "recurring"
  | "adjustment";
interface FrequentTransaction {
  name: string;
  type: TransactionType; // "income" | "expense" | "card" | ...
  subCategory: string; // 서브카테고리 id
  amount: number;
  icon: LucideIcon;
  color: string;
}

interface TransactionSubCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  debit: string;
  debitChange: ChangeDirection;
  credit: string;
  creditChange: ChangeDirection;
  description: string;
}

const transactionTypes = [
  {
    id: "income",
    name: "수익 (Income)",
    icon: TrendingUp,
    color: "bg-green-500",
    description: "급여, 이자, 배당금 등의 수입",
  },
  {
    id: "expense",
    name: "비용 (Expense)",
    icon: TrendingDown,
    color: "bg-red-500",
    description: "식비, 교통비, 공과금 등의 지출",
  },
  {
    id: "transfer",
    name: "자산이동 (Transfer)",
    icon: RefreshCw,
    color: "bg-blue-500",
    description: "계좌 간 이체, 현금 인출 등",
  },
  {
    id: "card",
    name: "카드거래 (Card)",
    icon: CreditCard,
    color: "bg-purple-500",
    description: "카드 결제, 카드대금 납부",
  },
  {
    id: "liability",
    name: "대출·부채 (Liability)",
    icon: HandCoins,
    color: "bg-orange-500",
    description: "대출 관련 거래",
  },
  {
    id: "investment",
    name: "투자 (Investment)",
    icon: Target,
    color: "bg-indigo-500",
    description: "주식, 펀드, 암호화폐 등 투자",
  },
  {
    id: "equity",
    name: "자본·출자 (Equity)",
    icon: PiggyBank,
    color: "bg-pink-500",
    description: "자본 관련",
  },
  {
    id: "recurring",
    name: "정기거래 (Recurring)",
    icon: RefreshCw,
    color: "bg-teal-500",
    description: "자동 반복 거래",
  },
  {
    id: "adjustment",
    name: "조정·기타 (Adjustment)",
    icon: Receipt,
    color: "bg-gray-500",
    description: "장부 정정, 환율 차이 등",
  },
];

// 세부 카테고리 정의 (증감 정보 포함)
const subCategories = {
  income: [
    {
      id: "salary",
      name: "근로소득",
      icon: Building2,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "급여, 보너스 등",
    },
    {
      id: "business",
      name: "사업·자영업 소득",
      icon: Building2,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "사업 매출, 프리랜서 수입",
    },
    {
      id: "dividend",
      name: "투자소득 (배당금)",
      icon: TrendingUp,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "주식 배당금",
    },
    {
      id: "interest",
      name: "투자소득 (이자)",
      icon: TrendingUp,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "예금 이자, 채권 이자",
    },
    {
      id: "rental",
      name: "임대·렌탈 소득",
      icon: Home,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "부동산 임대료",
    },
    {
      id: "refund",
      name: "세금 환급·리베이트",
      icon: Receipt,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "세금 환급, 캐시백",
    },
    {
      id: "other_income",
      name: "기타수익",
      icon: DollarSign,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "용돈, 선물 등",
    },
  ],
  expense: [
    {
      id: "rent",
      name: "주거비(월세)",
      icon: Home,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "월세, 전세 보증금",
    },
    {
      id: "utilities",
      name: "주거비(관리비)",
      icon: Zap,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "전기, 가스, 수도, 관리비",
    },
    {
      id: "loan_interest",
      name: "주택대출 이자",
      icon: Home,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "대출 이자 지급",
    },
    {
      id: "food",
      name: "식비",
      icon: Utensils,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "외식, 식료품",
    },
    {
      id: "transport",
      name: "교통비",
      icon: Car,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "대중교통, 주유비, 택시",
    },
    {
      id: "communication",
      name: "통신비",
      icon: Smartphone,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "휴대폰, 인터넷",
    },
    {
      id: "utilities_bill",
      name: "공과금",
      icon: Zap,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "전기, 가스, 수도",
    },
    {
      id: "insurance",
      name: "보험료",
      icon: Heart,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "건강보험, 자동차보험",
    },
    {
      id: "medical",
      name: "의료·헬스케어",
      icon: Heart,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "병원비, 약값, 헬스장",
    },
    {
      id: "education",
      name: "학원·교육비",
      icon: GraduationCap,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "학원, 도서, 강의",
    },
    {
      id: "entertainment",
      name: "문화·여가비",
      icon: ShoppingCart,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "영화, 카페, 여행",
    },
    {
      id: "clothing",
      name: "의류·미용",
      icon: ShoppingCart,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "옷, 화장품, 미용실",
    },
    {
      id: "tax",
      name: "세금(소득세 등)",
      icon: Receipt,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "소득세, 재산세",
    },
    {
      id: "donation",
      name: "기부·후원",
      icon: Heart,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "자선단체 기부",
    },
    {
      id: "fees",
      name: "수수료·요금",
      icon: Receipt,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "은행 수수료, 각종 요금",
    },
    {
      id: "subscription",
      name: "구독 서비스",
      icon: Smartphone,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "넷플릭스, 스포티파이 등",
    },
    {
      id: "other_expense",
      name: "기타비용",
      icon: Receipt,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "기타 지출",
    },
  ],
  transfer: [
    {
      id: "account_transfer",
      name: "계좌 간 이체",
      icon: RefreshCw,
      debit: "{to_account}",
      debitChange: "+",
      credit: "{from_account}",
      creditChange: "-",
      description: "은행 간 이체",
    },
    {
      id: "cash_withdraw",
      name: "현금 인출",
      icon: Banknote,
      debit: "{cash}",
      debitChange: "+",
      credit: "{from_account}",
      creditChange: "-",
      description: "ATM 현금 인출",
    },
    {
      id: "cash_deposit",
      name: "현금 입금",
      icon: Banknote,
      debit: "{to_account}",
      debitChange: "+",
      credit: "{cash}",
      creditChange: "-",
      description: "현금을 계좌에 입금",
    },
    {
      id: "p2p_transfer",
      name: "P2P 송금",
      icon: Smartphone,
      debit: "{to_account}",
      debitChange: "+",
      credit: "{from_account}",
      creditChange: "-",
      description: "토스, 카카오페이 송금",
    },
    {
      id: "ewallet",
      name: "전자지갑 충전/인출",
      icon: Smartphone,
      debit: "{e_wallet}",
      debitChange: "±",
      credit: "{account}",
      creditChange: "±",
      description: "페이 충전, 인출",
    },
  ],
  card: [
    {
      id: "card_payment",
      name: "카드승인(결제)",
      icon: CreditCard,
      debit: "{card_receivable}",
      debitChange: "+",
      credit: "{revenue}/{expense}",
      creditChange: "±",
      description: "카드로 결제",
    },
    {
      id: "card_billing",
      name: "카드청구",
      icon: CreditCard,
      debit: "{liability}",
      debitChange: "+",
      credit: "{card_receivable}",
      creditChange: "-",
      description: "카드 청구서 발행",
    },
    {
      id: "card_payment_settle",
      name: "카드대금 결제",
      icon: CreditCard,
      debit: "{liability}",
      debitChange: "-",
      credit: "{account}",
      creditChange: "-",
      description: "카드 대금 납부",
    },
    {
      id: "card_refund",
      name: "카드취소·환불",
      icon: CreditCard,
      debit: "{card_receivable}",
      debitChange: "-",
      credit: "{revenue}/{expense}",
      creditChange: "-",
      description: "결제 취소, 환불",
    },
  ],
  liability: [
    {
      id: "loan_receive",
      name: "대출금 수령",
      icon: HandCoins,
      debit: "{account}",
      debitChange: "+",
      credit: "{liability}",
      creditChange: "+",
      description: "은행 대출 받기",
    },
    {
      id: "loan_repay",
      name: "원금 상환",
      icon: HandCoins,
      debit: "{liability}",
      debitChange: "-",
      credit: "{account}",
      creditChange: "-",
      description: "대출 원금 상환",
    },
    {
      id: "interest_pay",
      name: "이자 상환",
      icon: Receipt,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "대출 이자 지급",
    },
    {
      id: "penalty",
      name: "연체료·벌금",
      icon: Receipt,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "연체료, 벌금",
    },
  ],
  investment: [
    {
      id: "stock_buy",
      name: "주식·ETF 매수",
      icon: TrendingUp,
      debit: "{investment}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "주식, ETF 구매",
    },
    {
      id: "stock_sell",
      name: "주식·ETF 매도",
      icon: TrendingDown,
      debit: "{account}",
      debitChange: "+",
      credit: "{investment}",
      creditChange: "-",
      description: "주식, ETF 판매",
    },
    {
      id: "crypto_buy",
      name: "암호화폐 매수",
      icon: TrendingUp,
      debit: "{investment}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "비트코인, 이더리움 등",
    },
    {
      id: "crypto_sell",
      name: "암호화폐 매도",
      icon: TrendingDown,
      debit: "{account}",
      debitChange: "+",
      credit: "{investment}",
      creditChange: "-",
      description: "암호화폐 판매",
    },
    {
      id: "bond_buy",
      name: "채권 매수",
      icon: Receipt,
      debit: "{investment}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "국채, 회사채 구매",
    },
    {
      id: "bond_sell",
      name: "채권 매도",
      icon: Receipt,
      debit: "{account}",
      debitChange: "+",
      credit: "{investment}",
      creditChange: "-",
      description: "채권 판매",
    },
    {
      id: "dividend_receive",
      name: "배당금 수령",
      icon: TrendingUp,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "배당금 수령",
    },
    {
      id: "capital_gain",
      name: "양도차익 실현",
      icon: TrendingUp,
      debit: "{account}",
      debitChange: "+",
      credit: "{investment_gain}",
      creditChange: "+",
      description: "투자 수익 실현",
    },
  ],
  equity: [
    {
      id: "capital_input",
      name: "개인 자본 투입",
      icon: PiggyBank,
      debit: "{account}",
      debitChange: "+",
      credit: "{equity}",
      creditChange: "+",
      description: "초기 자본 설정",
    },
    {
      id: "retained_earnings",
      name: "이익잉여금 적립",
      icon: PiggyBank,
      debit: "{equity}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "수익 적립",
    },
    {
      id: "owner_draw",
      name: "자본 인출",
      icon: PiggyBank,
      debit: "{equity}",
      debitChange: "-",
      credit: "{account}",
      creditChange: "-",
      description: "개인 용도 인출",
    },
  ],
  recurring: [
    {
      id: "auto_salary",
      name: "월급 자동등록",
      icon: Building2,
      debit: "{account}",
      debitChange: "+",
      credit: "{revenue}",
      creditChange: "+",
      description: "매월 자동 급여",
    },
    {
      id: "auto_subscription",
      name: "구독료 자동이체",
      icon: Smartphone,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "자동 결제 구독",
    },
    {
      id: "auto_insurance",
      name: "보험료·연금 납입",
      icon: Heart,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "자동 보험료 납부",
    },
    {
      id: "auto_utility",
      name: "공과금 자동이체",
      icon: Zap,
      debit: "{expense}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "-",
      description: "자동 공과금 납부",
    },
  ],
  adjustment: [
    {
      id: "book_adjustment",
      name: "장부 정정",
      icon: Receipt,
      debit: "{account}",
      debitChange: "±",
      credit: "{account}",
      creditChange: "±",
      description: "회계 오류 수정",
    },
    {
      id: "fx_adjustment",
      name: "환율 차이",
      icon: RefreshCw,
      debit: "{investment}/{fx_loss}",
      debitChange: "+",
      credit: "{investment}/{fx_gain}",
      creditChange: "+",
      description: "환율 변동 손익",
    },
    {
      id: "balance_carryover",
      name: "잔액 이월",
      icon: RefreshCw,
      debit: "{equity_carryover}",
      debitChange: "+",
      credit: "{account}",
      creditChange: "±",
      description: "기초 잔액 설정",
    },
    {
      id: "depreciation",
      name: "감가상각",
      icon: TrendingDown,
      debit: "{depreciation}",
      debitChange: "+",
      credit: "{accumulated_depr}",
      creditChange: "+",
      description: "자산 감가상각",
    },
  ],
} as const;

// 자주 사용하는 거래 템플릿
const frequentTransactions: FrequentTransaction[] = [
  {
    name: "식비 지출",
    type: "expense",
    subCategory: "food",
    amount: 10000,
    icon: Utensils,
    color: "text-red-500",
  },
  {
    name: "교통비 지출",
    type: "expense",
    subCategory: "transport",
    amount: 5000,
    icon: Car,
    color: "text-red-500",
  },
  {
    name: "카드 결제",
    type: "card",
    subCategory: "card_payment",
    amount: 30000,
    icon: CreditCard,
    color: "text-purple-500",
  },
  {
    name: "월급 입금",
    type: "income",
    subCategory: "salary",
    amount: 3000000,
    icon: Building2,
    color: "text-green-500",
  },
];

// 계정 과목 정의
const accounts = {
  asset: [
    { id: "cash", name: "현금" },
    { id: "checking", name: "당좌예금" },
    { id: "savings", name: "보통예금" },
    { id: "time_deposit", name: "정기예금" },
    { id: "investment_stock", name: "투자자산(주식)" },
    { id: "investment_crypto", name: "투자자산(암호화폐)" },
    { id: "investment_bond", name: "투자자산(채권)" },
    { id: "real_estate", name: "부동산" },
    { id: "car", name: "자동차" },
    { id: "ewallet", name: "전자지갑" },
  ],
  liability: [
    { id: "credit_card", name: "신용카드" },
    { id: "long_term_loan", name: "장기차입금" },
    { id: "short_term_loan", name: "단기차입금" },
    { id: "mortgage", name: "주택담보대출" },
    { id: "car_loan", name: "자동차대출" },
    { id: "payables", name: "미지급금" },
  ],
  revenue: [
    { id: "salary_revenue", name: "급여수익" },
    { id: "business_revenue", name: "영업수익" },
    { id: "investment_revenue", name: "투자수익" },
    { id: "interest_revenue", name: "이자수익" },
    { id: "rental_revenue", name: "임대수익" },
    { id: "other_revenue", name: "기타수익" },
  ],
  expense: [
    { id: "housing_expense", name: "주거비" },
    { id: "utility_expense", name: "공과금" },
    { id: "interest_expense", name: "이자비용" },
    { id: "food_expense", name: "식비" },
    { id: "transport_expense", name: "교통비" },
    { id: "communication_expense", name: "통신비" },
    { id: "insurance_expense", name: "보험료" },
    { id: "medical_expense", name: "의료비" },
    { id: "education_expense", name: "교육비" },
    { id: "entertainment_expense", name: "문화여가비" },
    { id: "clothing_expense", name: "의류미용비" },
    { id: "tax_expense", name: "세금비용" },
    { id: "donation_expense", name: "기부금" },
    { id: "fee_expense", name: "수수료비용" },
    { id: "subscription_expense", name: "구독료" },
  ],
  equity: [
    { id: "capital", name: "자본금" },
    { id: "retained_earnings", name: "이익잉여금" },
    { id: "current_earnings", name: "당기순이익" },
  ],
};

export default function Insert() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<TransactionSubCategory | null>(
    null
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");

  // 초기화
  const resetForm = () => {
    setTransactionType(null);
    setSubCategory(null);
    setAmount("");
    setMemo("");
    setDebitAccount("");
    setCreditAccount("");
    setIsExpanded(false);
  };

  // 자주 사용하는 거래 선택
  const handleFrequentTransactionSelect = (
    transaction: FrequentTransaction
  ) => {
    setTransactionType(transaction.type);

    const found =
      subCategories[transaction.type].find(
        (c) => c.id === transaction.subCategory
      ) ?? null;
    setSubCategory(found);

    setAmount(transaction.amount.toString());
    setMemo(`${transaction.name}`);
    setIsExpanded(true);

    if (transaction.type === "expense") {
      setDebitAccount("food_expense");
      setCreditAccount("cash");
    } else if (transaction.type === "income") {
      setDebitAccount("savings");
      setCreditAccount("salary_revenue");
    }
  };

  // 거래 유형 선택
  const handleTypeSelect = (typeId: string) => {
    setTransactionType(typeId);
    setSubCategory(null);
    setIsExpanded(true);
  };

  // 세부 카테고리 선택
  const handleSubCategorySelect = (category: TransactionSubCategory) => {
    setSubCategory(category);
    setMemo(`${category.name} 거래`);
  };

  // 거래 저장
  const handleSave = () => {
    if (
      !transactionType ||
      !subCategory ||
      !amount ||
      !debitAccount ||
      !creditAccount
    ) {
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
      type:
        transactionType === "income"
          ? "income"
          : transactionType === "expense"
          ? "expense"
          : "transfer",
      accountType: "asset",
      createdAt: "",
    };

    handleSaveTransaction(transaction);
    resetForm();
  };

  // 계정명 조회
  const getAccountName = (accountId: string) => {
    for (const accountType of Object.values(accounts)) {
      const account = accountType.find((acc) => acc.id === accountId);
      if (account) return account.name;
    }
    return accountId;
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    try {
      const savedTransactions = localStorage.getItem("transactions");
      let transactions = [];

      if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
      }

      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      navigate("/transactions");
    } catch (err) {
      console.log("거래 저장 중 오류 발생", err);
      alert("거래를 저장하는 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>새 거래 입력</span>
            {isExpanded && (
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <RotateCcw className="h-4 w-4 mr-1" />
                초기화
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isExpanded ? (
            //간단한 입력 모드
            <div className="space-y-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">모든 거래 유형</TabsTrigger>
                  <TabsTrigger value="quick">자주 쓰는 거래</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {transactionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                          onClick={() => handleTypeSelect(type.id)}
                        >
                          <div
                            className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center mr-3`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {type.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {type.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="quick" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {frequentTransactions.map((transaction, index) => {
                      const Icon = transaction.icon;
                      return (
                        <button
                          key={index}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                          onClick={() =>
                            handleFrequentTransactionSelect(transaction)
                          }
                        >
                          <Icon
                            className={`h-6 w-6 ${transaction.color} mr-3`}
                          />
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {transaction.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.amount.toLocaleString()}원
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => setIsExpanded(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                상세 입력 모드
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {!transactionType && (
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    거래 유형 선택
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {transactionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                          onClick={() => handleTypeSelect(type.id)}
                        >
                          <div
                            className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mr-3`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {type.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {type.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 세부 카테고리 선택 */}
              {transactionType && !subCategory && (
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    세부 카테고리 선택
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subCategories[
                      transactionType as keyof typeof subCategories
                    ].map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                          onClick={() => handleSubCategorySelect(category)}
                        >
                          <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                              {category.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {category.description}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                차변: {category.debit}{" "}
                                {category.debitChange === "+" ? (
                                  <Plus className="h-3 w-3 ml-1 text-green-600" />
                                ) : category.debitChange === "-" ? (
                                  <Minus className="h-3 w-3 ml-1 text-red-600" />
                                ) : (
                                  <span className="ml-1">±</span>
                                )}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                대변: {category.credit}{" "}
                                {category.creditChange === "+" ? (
                                  <Plus className="h-3 w-3 ml-1 text-green-600" />
                                ) : category.creditChange === "-" ? (
                                  <Minus className="h-3 w-3 ml-1 text-red-600" />
                                ) : (
                                  <span className="ml-1">±</span>
                                )}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* 상세 정보 입력 */}
              {subCategory && (
                <div className="space-y-4">
                  {/* 분개 미리보기 */}
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
                            {subCategory.debit}
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            {subCategory.debitChange === "+" ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : subCategory.debitChange === "-" ? (
                              <Minus className="h-4 w-4 text-red-600" />
                            ) : (
                              <span className="text-gray-600">±</span>
                            )}
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {subCategory.debitChange === "+"
                                ? "증가"
                                : subCategory.debitChange === "-"
                                ? "감소"
                                : "증감"}
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
                            {subCategory.credit}
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            {subCategory.creditChange === "+" ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : subCategory.creditChange === "-" ? (
                              <Minus className="h-4 w-4 text-red-600" />
                            ) : (
                              <span className="text-gray-600">±</span>
                            )}
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {subCategory.creditChange === "+"
                                ? "증가"
                                : subCategory.creditChange === "-"
                                ? "감소"
                                : "증감"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="debit-account">차변 계정</Label>
                      <Select
                        value={debitAccount}
                        onValueChange={setDebitAccount}
                      >
                        <SelectTrigger id="debit-account">
                          <SelectValue placeholder="차변 계정 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(accounts).map(
                            ([type, accountList]) => (
                              <div key={type}>
                                <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                  {type === "asset" && "자산"}
                                  {type === "liability" && "부채"}
                                  {type === "revenue" && "수익"}
                                  {type === "expense" && "비용"}
                                  {type === "equity" && "자본"}
                                </div>
                                {accountList.map((account) => (
                                  <SelectItem
                                    key={account.id}
                                    value={account.id}
                                  >
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </div>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credit-account">대변 계정</Label>
                      <Select
                        value={creditAccount}
                        onValueChange={setCreditAccount}
                      >
                        <SelectTrigger id="credit-account">
                          <SelectValue placeholder="대변 계정 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(accounts).map(
                            ([type, accountList]) => (
                              <div key={type}>
                                <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                  {type === "asset" && "자산"}
                                  {type === "liability" && "부채"}
                                  {type === "revenue" && "수익"}
                                  {type === "expense" && "비용"}
                                  {type === "equity" && "자본"}
                                </div>
                                {accountList.map((account) => (
                                  <SelectItem
                                    key={account.id}
                                    value={account.id}
                                  >
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </div>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 거래 요약 */}
                  {debitAccount && creditAccount && amount && (
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 dark:text-blue-200">
                        <div className="font-medium mb-1">거래 요약</div>
                        <div className="text-sm">
                          <strong>차변:</strong> {getAccountName(debitAccount)}{" "}
                          {Number(amount).toLocaleString()}원{" "}
                          <Badge variant="outline" className="ml-1">
                            {subCategory.debitChange === "+"
                              ? "증가"
                              : subCategory.debitChange === "-"
                              ? "감소"
                              : "증감"}
                          </Badge>
                          <br />
                          <strong>대변:</strong> {getAccountName(creditAccount)}{" "}
                          {Number(amount).toLocaleString()}원{" "}
                          <Badge variant="outline" className="ml-1">
                            {subCategory.creditChange === "+"
                              ? "증가"
                              : subCategory.creditChange === "-"
                              ? "감소"
                              : "증감"}
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
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
