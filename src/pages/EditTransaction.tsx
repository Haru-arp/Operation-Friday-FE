import type { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
export default function EditTransaction() {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    leftAccountName: "",
    rightAccountName: "",
  });

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const updatedTransactions = transactions.map((t: Transaction) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    }
    navigate("/transactions");
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.description || !formData.amount) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!transaction || !transaction.id) {
      alert("잘못된 거래입니다.");
      return;
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      id: transaction.id, // 명시적으로 설정
      date: formData.date,
      description: formData.description,
      amount: Number(formData.amount),
      leftAccountName: formData.leftAccountName,
      rightAccountName: formData.rightAccountName,
    };

    handleUpdateTransaction(updatedTransaction);
  };

  useEffect(() => {
    // 거래 찾기
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const foundTransaction = transactions.find(
        (t: Transaction) => t.id === transactionId
      );
      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        navigate("/transactions");
      }
    }
  }, [navigate, transactionId]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount.toString(),
        leftAccountName: transaction.leftAccountName,
        rightAccountName: transaction.rightAccountName,
      });
    }
  }, [transaction]);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        뒤로 가기
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>거래 수정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">거래일자</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">금액</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">거래 설명</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leftAccount">출처 계정</Label>
              <Input
                id="leftAccount"
                value={formData.leftAccountName}
                onChange={(e) =>
                  setFormData({ ...formData, leftAccountName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rightAccount">대상 계정</Label>
              <Input
                id="rightAccount"
                value={formData.rightAccountName}
                onChange={(e) =>
                  setFormData({ ...formData, rightAccountName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
