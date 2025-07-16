import { create } from "zustand";

// "data": [
//     {
//       "type": "ASSET",
//       "groups": [
//         {
//           "groupId": 0,
//           "groupName": "string",
//           "groupDescription": "string",
//           "items": [
//             {
//               "itemId": 0,
//               "itemName": "string",
//               "category": "GENERAL"
//             }
//           ]
//         }
//       ]
//     }

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

interface AccountState {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
    accounts: [],
    setAccounts: (accounts) => set({ accounts }),
}));
