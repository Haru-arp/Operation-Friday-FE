// import { useNavigate } from "react-router-dom";

import { TransactionWizard, type TransactionRequest } from "@/components/ui/wizard/transaction-wizard";
import { useRegistTransactions } from "@/hook/useTransactions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Insert() {
    const { mutate: regist } = useRegistTransactions();
    const queryClient = useQueryClient();

    const handleSaveTransaction = async (transaction: TransactionRequest) => {
        try {
            // const savedTransactions = localStorage.getItem("transactions");
            // let transactions = [];

            // if (savedTransactions) {
            //     transactions = JSON.parse(savedTransactions);
            // }

            // const newTransaction = {
            //     ...transaction,
            //     id: Date.now().toString(),
            //     createdAt: new Date().toISOString(),
            // };

            // transactions.push(newTransaction);
            // localStorage.setItem("transactions", JSON.stringify(transactions));
            // // navigate("/transactions");
            regist(transaction, {
                onSuccess: async (res) => {
                    console.log("res", res);
                    toast.success("등록 성공", {
                        duration: 3000,
                    });
                    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
                },
                onError: (err) => {
                    console.log("등록 실패", err);
                    toast.error("등록 실패", {
                        duration: 3000,
                    });
                },
            });
        } catch (err) {
            console.log("거래 저장 중 오류 발생", err);
            alert("거래를 저장하는 중 오류가 발생했습니다.");
        }
    };
    return (
        <div className="max-w-4xl mx-auto">
            <TransactionWizard onSave={handleSaveTransaction} />
            <Toaster richColors theme="system" position="top-center" />
        </div>
    );
}
