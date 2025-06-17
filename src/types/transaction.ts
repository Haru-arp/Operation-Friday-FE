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
}
