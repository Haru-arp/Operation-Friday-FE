import { loadTransactionsById, modifyTransaction, registTransactions } from "@/api/transactions";
import type { ModifyTransactionRequest } from "@/components/ui/wizard/transaction-wizard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRegistTransactions = () => {
    return useMutation({
        mutationFn: registTransactions,
    });
};

export const useLoadTransactionDetail = (transactionId: number) => {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => loadTransactionsById(transactionId),
        enabled: !!transactionId,
        select: (res) => res.data.data,
    });
};

export const useModifyTransactions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ transactionId, form }: { transactionId: number; form: ModifyTransactionRequest }) => modifyTransaction(transactionId, form),
        onSuccess: (_, variables) => {
            // 관련 쿼리들 무효화
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["transaction", variables.transactionId] });
        },
    });
};
