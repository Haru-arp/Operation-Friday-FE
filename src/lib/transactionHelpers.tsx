// src/lib/transactionHelpers.ts
import {
  Banknote,
  TrendingUp,
  ArrowLeftRight,
  CreditCard,
  RefreshCw,
  HandCoins,
} from "lucide-react";
import type { JSX } from "react";

/** 거래 타입 (문자열 기반) */
export type TransactionType = "income" | "expense" | "transfer" | string;
export type transactionTypeId =
  | "cash_expense"
  | "credit_expense"
  | "income"
  | "asset_transfer"
  | "debt_repayment"
  | string;
/** 거래 아이콘 반환 함수 */
export const getTransactionIcon = (
  type: transactionTypeId
): JSX.Element | null => {
  const size = "h-4 w-4";

  switch (type) {
    case "income":
      return <TrendingUp className={`${size} text-green-500`} />;
    case "cash_expense":
      return <Banknote className={`${size} text-red-500`} />;
    case "debt_repayment":
      return <HandCoins className={`${size} text-purple-500`} />;
    case "credit_expense":
      return <CreditCard className={`${size} text-orange-500`} />;
    case "asset_transfer":
      return <RefreshCw className={`${size} text-blue-500`} />;
    default:
      return null;
  }
};

// r거래 내역에서의 아이콘
// const getTransactionIcon = (type: string) => {
//     switch (type) {
//         case "income":
//             return <TrendingUp className="h-4 w-4 text-green-500" />;
//         case "expense":
//             return <TrendingDown className="h-4 w-4 text-red-500" />;
//         case "transfer":
//             return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
//         default:
//             return null;
//     }
// };
/** 가이드에서 쓰는 글씨색 함수 */
export const getAccountTypeColor = (type: string) => {
  switch (type) {
    case "자산":
      return "text-blue-600 dark:text-blue-400";
    case "부채":
      return "text-red-600 dark:text-red-400";
    case "자본":
      return "text-purple-600 dark:text-purple-400";
    case "수익":
      return "text-green-600 dark:text-green-400";
    case "비용":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

/** 거래 색상 클래스 반환 함수 */
export const getTransactionColor = (type: TransactionType): string => {
  switch (type) {
    case "income":
      return "text-green-600";
    case "expense":
      return "text-red-600";
    case "transfer":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

// /** 거래 색상 클래스 반환 함수 */
// export const getTransactionColor = (type: transactionTypeId): string => {
//   switch (type) {
//     case "income":
//       return "text-green-600";
//     case "cash_expense":
//       return "text-red-600";
//     case "debt_repayment":
//       return "text-purple-600";
//     case "credit_expense":
//       return "text-orange-600";
//     case "asset_transfer":
//       return "text-blue-600";
//     default:
//       return "text-gray-600";
//   }
// };
