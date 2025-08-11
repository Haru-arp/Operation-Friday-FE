import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { EditTransactionWizard } from "@/components/ui/wizard/editTransaction-wizard";
import { useModifyTransactions } from "@/hook/useTransactions";
import type { ModifyTransactionRequest } from "@/components/ui/wizard/transaction-wizard";
export default function EditTransaction() {
  const location = useLocation();
  const from = location.state?.from || "/transactions"; // 기본값 설정
  const navigate = useNavigate();

  const { mutate: modifyTransaction, isPending } = useModifyTransactions();

  const handleUpdateTransaction = (transactionId: number, updateData: ModifyTransactionRequest) => {
    modifyTransaction(
      { transactionId, form: updateData },
      {
        onSuccess: () => {
          alert("거래가 수정되었습니다.");
          navigate(from);
        },
        onError: (error) => {
          console.error("거래 수정 실패:", error);
          alert("거래 수정 중 오류가 발생했습니다.");
        }
      }
    );
  };
  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        뒤로 가기
      </Button>
      <EditTransactionWizard onUpdate={handleUpdateTransaction} isUpadateLoading={isPending} />
    </div>
  );
}
