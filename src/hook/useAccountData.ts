import { loadAccount } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";

export const useLoadAccounts = () => {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: loadAccount,
        select: (res) => res.data.data,
    });
};
