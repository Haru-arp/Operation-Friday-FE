import { registTransactions } from "@/api/transactions";
import { useMutation } from "@tanstack/react-query";

export const useRegistTransactions = () => {
    return useMutation({
        mutationFn: registTransactions,
    });
};
