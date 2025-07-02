export const subtypeCode = {
    ASSET_TRANSFER: "ASSET_TRANSFER",
    CAPITAL_REALLOC: "CAPITAL_REALLOC",
    CAPITAL_WITHDRAW: "CAPITAL_WITHDRAW",
    DEBT_REPAYMENT: "DEBT_REPAYMENT",
    DEBT_TRANSFER: "DEBT_TRANSFER",
    EXPENSE_CASH: "EXPENSE_CASH",
    EXPENSE_CREDIT: "EXPENSE_CREDIT",
    INCOME: "INCOME",
    INITIAL_ASSET: "INITIAL_ASSET",
    INITIAL_LIABILITY: "INITIAL_LIABILITY",
    LOAN: "LOAN",
} as const;

export type SubTypeCodeType = keyof typeof subtypeCode;

type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export interface Transaction {
    id: string;
    date: string;
    item: string;
    description?: string;
    amount: number;
    leftAccount: string;
    rightAccount: string;
    leftAccountName: string;
    rightAccountName: string;
    type: "income" | "expense" | "transfer";
    accountType: string;
    createdAt: string;
    transactionTypeId?: string;
}

export interface TransactionApi {
    amount: number;
    categoryType: "income" | "expense" | "transfer"; //Enum으로 묶기
    createdAt: string;
    creditItemId: number; //오른쪽
    creditItemName: string;
    debitItemId: number; //왼쪽
    debitItemName: string;
    description: string;
    id: number;
    memo: string;
    subtypeCode: SubTypeCodeType; // Enum
    subtypeName: string;
    transDate: string;
    updatedAt: string;
}

// ASSET_TRANSFER
// CAPITAL_REALLOC
// CAPITAL_WITHDRAW
// DEBT_REPAYMENT
// DEBT_TRANSFER
// EXPENSE_CASH
// EXPENSE_CREDIT
// INCOME
// INITIAL_ASSET
// INITIAL_LIABILITY
// LOAN

// public enum AccountType {
//     ASSET, LIABILITY, REVENUE, EXPENSE, EQUITY
// }
// public enum AccountCategory {
//     GENERAL, TRADING_PARTNER, LIQUIDITY_CASH, CREDIT_CARD, DEBIT_CARD, FIXED, FLOATING
// }
// public enum TransactionCategoryType {
//     INCOME, EXPENSE, TRANSFER
// }
// debit - credit (왼쪽, 오른쪽)
// 차변 - 대변
// accountType - 자산, 부채, 자본, 비용, 수익
