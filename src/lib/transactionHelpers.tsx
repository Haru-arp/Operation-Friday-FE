// src/lib/transactionHelpers.ts
import { Banknote, TrendingUp, ArrowLeftRight } from "lucide-react";
import type { JSX } from "react";

/** 거래 타입 (문자열 기반) */
export type TransactionType = "income" | "expense" | "transfer" | string;

/** 거래 아이콘 반환 함수 */
export const getTransactionIcon = (type: TransactionType): JSX.Element | null => {
    const size = "h-4 w-4";

    switch (type) {
        case "income":
            return <TrendingUp className={`${size} text-green-500`} />;
        case "expense":
            return <Banknote className={`${size} text-red-500`} />;
        case "transfer":
            return <ArrowLeftRight className={`${size} text-blue-500`} />;
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
