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

// type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

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

export interface TransactionDetailApi {
    id: number;
    subtypeCode: SubTypeCodeType;
    transDate: string;
    description: string;
    debitItemId: number;
    creditItemId: number;
    amount: number;
    memo: number;
    createdAt: string;
    updatedAt: string;
}
export interface TransactionApi extends TransactionDetailApi {
    // creditItemId: number; //오른쪽
    // debitItemId: number; //왼쪽
    categoryType: "income" | "expense" | "transfer"; //Enum으로 묶기
    creditItemName: string;
    debitItemName: string;
    subtypeName: string;
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

/////////////////SWAGGER 기반///////////////////////
export type AccountType = "ASSET" | "EQUITY" | "EXPENSE" | "LIABILITY" | "REVENUE";
export type CategoryEnum = "GENERAL" | "TRADING_PARTNER" | "LIQUIDITY_CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "FIXED" | "FLOATING";
export interface groupItems {
    category: CategoryEnum;
    itemId: number;
    itemName: string;
}

export interface group {
    groupDescription: string;
    groupId: number;
    groupName: string;
    items: groupItems[];
}

export interface Account {
    type: AccountType;
    groups: group[];
}
