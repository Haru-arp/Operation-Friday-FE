import type { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
} from "lucide-react";
export default function Entries() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "income" | "expense" | "transfer"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "description">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [_isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const itemsPerPage = 10;

  // 필터링 및 검색
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.leftAccountName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.rightAccountName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // 정렬
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "description":
        comparison = a.description.localeCompare(b.description);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (id: string, description: string) => {
    if (confirm(`"${description}" 거래를 삭제하시겠습니까?`)) {
      handleDeleteTransaction(id);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "expense":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "transfer":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600";
      case "expense":
        return "text-red-600";
      case "transfer":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  useEffect(() => {
    try {
      // 거래 내역 가져오기
      const savedTransactions = localStorage.getItem("transactions");
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleDeleteTransaction = (id: string) => {
    try {
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error("거래 삭제 중 오류 발생:", error);
      alert("거래를 삭제하는 중 오류가 발생했습니다.");
    }
  };

  //   const handleUpdateTransaction = (updatedTransaction: Transaction) => {
  //     try {
  //       const updatedTransactions = transactions.map((t) =>
  //         t.id === updatedTransaction.id ? updatedTransaction : t
  //       );
  //       setTransactions(updatedTransactions);
  //       localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  //     } catch (error) {
  //       console.error("거래 업데이트 중 오류 발생:", error);
  //       alert("거래를 업데이트하는 중 오류가 발생했습니다.");
  //     }
  //   };

  return (
    <div className="md:p-8 space-y-6">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              거래내역
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              모든 거래 내역을 확인하고 관리하세요
            </p>
          </div>
          <Button
            onClick={() => navigate("/transaction/new")}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" />새 거래
          </Button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="거래 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 타입 필터 */}
            <Select
              value={filterType}
              onValueChange={(
                value: "all" | "income" | "expense" | "transfer"
              ) => setFilterType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="거래 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="income">수입</SelectItem>
                <SelectItem value="expense">지출</SelectItem>
                <SelectItem value="transfer">이체</SelectItem>
              </SelectContent>
            </Select>

            {/* 정렬 기준 */}
            <Select
              value={sortBy}
              onValueChange={(value: "date" | "amount" | "description") =>
                setSortBy(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">날짜순</SelectItem>
                <SelectItem value="amount">금액순</SelectItem>
                <SelectItem value="description">제목순</SelectItem>
              </SelectContent>
            </Select>

            {/* 정렬 순서 */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="justify-start"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === "asc" ? "오름차순" : "내림차순"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 거래 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>거래 목록</span>
            <Badge variant="outline">총 {filteredTransactions.length}건</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || filterType !== "all"
                  ? "검색 결과가 없습니다"
                  : "거래 내역이 없습니다"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterType !== "all"
                  ? "다른 검색어나 필터를 시도해보세요"
                  : "첫 거래를 추가해보세요"}
              </p>
              {!searchTerm && filterType === "all" && (
                <Button
                  onClick={() => navigate("/transaction/new")}
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  거래 추가하기
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{transaction.leftAccountName}</span>
                        <ArrowLeftRight className="h-3 w-3" />
                        <span>{transaction.rightAccountName}</span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(transaction.date).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {transaction.amount.toLocaleString()}원
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          transaction.type === "income"
                            ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                            : transaction.type === "expense"
                            ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                            : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                        }`}
                      >
                        {transaction.type === "income"
                          ? "수입"
                          : transaction.type === "expense"
                          ? "지출"
                          : "이체"}
                      </Badge>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/transaction/edit/${transaction.id}`)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(transaction.id, transaction.description)
                        }
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>

              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
