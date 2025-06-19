import {
  LayoutDashboard,
  PlusCircle,
  List,
  Wallet,
  BookOpen,
  Calendar,
  CreditCard,
} from "lucide-react";
// BarChart3, Target, MessageCircle,
export const menuItems = [
  { icon: LayoutDashboard, label: "대시보드", path: "/", color: "bg-gray-500" },
  {
    icon: PlusCircle,
    label: "거래입력",
    path: "/transaction/new",
    color: "bg-gray-600",
  },
  {
    icon: List,
    label: "거래내역",
    path: "/transactions",
    color: "bg-gray-700",
  },
  { icon: Wallet, label: "계정관리", path: "/accounts", color: "bg-gray-700" },
  { icon: Calendar, label: "달력", path: "/calendar", color: "bg-blue-500" },
  {
    icon: CreditCard,
    label: "신용카드",
    path: "/credit-cards",
    color: "bg-indigo-500",
  },

  // { icon: BarChart3, label: "분석", path: "/analytics", color: "bg-gray-500" },
  // { icon: Target, label: "목표관리", path: "/goals", color: "bg-gray-600" },
  // { icon: MessageCircle, label: "AI 상담", path: "/ai-chat", color: "bg-purple-500" },
  { icon: BookOpen, label: "분개가이드", path: "/guide", color: "bg-blue-500" },
];
