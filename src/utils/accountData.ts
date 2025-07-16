import type { AccountData, AccountGroup, Accounts } from "@/components/ui/wizard/transaction-wizard";
import type { Account } from "@/types/transaction";

export function getAccountData(data: Account[]): AccountData {
    const groups: AccountGroup[] = [];
    const accounts: Accounts[] = [];

    data.forEach((account) => {
        const type = account.type;

        account.groups.forEach((group) => {
            const groupIdStr = String(group.groupId);

            groups.push({
                id: groupIdStr,
                name: group.groupName,
                type,
            });

            group.items.forEach((item) => {
                accounts.push({
                    id: String(item.itemId),
                    name: item.itemName,
                    category: item.category,
                    type,
                    groupId: groupIdStr,
                    groupName: group.groupName,
                });
            });
        });
    });

    return { groups, accounts };
}
