import { useLocation } from "react-router-dom";
import type { Transaction } from "@/types/transaction";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { EditTransactionWizard } from "@/components/ui/wizard/editTransaction-wizard";
export default function EditTransaction() {
  const location = useLocation();
  const from = location.state?.from || "/transactions"; // 기본값 설정
  const navigate = useNavigate();

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const updatedTransactions = transactions.map((t: Transaction) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    }
    navigate(from);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        뒤로 가기
      </Button>
      <EditTransactionWizard onUpdate={handleUpdateTransaction} />
    </div>
  );
}

//   <Card>
//     <CardHeader>
//       <CardTitle>거래 수정</CardTitle>
//     </CardHeader>
//     <CardContent className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="date">거래일자</Label>
//           <Input
//             id="date"
//             type="date"
//             value={formData.date}
//             onChange={(e) =>
//               setFormData({ ...formData, date: e.target.value })
//             }
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="amount">금액</Label>
//           <Input
//             id="amount"
//             type="number"
//             value={formData.amount}
//             onChange={(e) =>
//               setFormData({ ...formData, amount: e.target.value })
//             }
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="item">아이템</Label>
//           <Input
//             id="item"
//             type="text"
//             placeholder="아이템을 입력하세요"
//             value={formData.item}
//             onChange={(e) =>
//               setFormData({ ...formData, item: e.target.value })
//             }
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="description">거래 설명</Label>
//           <Input
//             id="description"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="leftAccount">출처 계정</Label>
//           <Input
//             id="leftAccount"
//             value={formData.leftAccountName}
//             onChange={(e) =>
//               setFormData({ ...formData, leftAccountName: e.target.value })
//             }
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="rightAccount">대상 계정</Label>
//           <Input
//             id="rightAccount"
//             value={formData.rightAccountName}
//             onChange={(e) =>
//               setFormData({ ...formData, rightAccountName: e.target.value })
//             }
//           />
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <Button
//           variant="outline"
//           onClick={() => navigate(-1)}
//           className="flex-1"
//         >
//           취소
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           className="flex-1 bg-black hover:bg-gray-800"
//         >
//           <Save className="h-4 w-4 mr-2" />
//           저장
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
