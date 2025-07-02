// import { useNavigate } from "react-router-dom";

import { TransactionWizard, type TransactionRequest } from "@/components/ui/wizard/transaction-wizard";

export default function Insert() {
    // const navigate = useNavigate();

    const handleSaveTransaction = (transaction: TransactionRequest) => {
        try {
            const savedTransactions = localStorage.getItem("transactions");
            let transactions = [];

            if (savedTransactions) {
                transactions = JSON.parse(savedTransactions);
            }

            const newTransaction = {
                ...transaction,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };

            transactions.push(newTransaction);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            // navigate("/transactions");
        } catch (err) {
            console.log("거래 저장 중 오류 발생", err);
            alert("거래를 저장하는 중 오류가 발생했습니다.");
        }
    };
    return (
        <div className="max-w-4xl mx-auto">
            <TransactionWizard onSave={handleSaveTransaction} />
        </div>
    );
}
