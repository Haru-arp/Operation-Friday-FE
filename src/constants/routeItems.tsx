import { BookA, LayoutDashboard, Notebook, NotebookPen } from "lucide-react";

export interface RouteItem {
  to: string;
  name: string;
  icon?: React.ReactNode;
}

export const router: RouteItem[] = [
  {
    to: "/",
    name: "대시보드",
    icon: <LayoutDashboard className="size-4.5" />,
  },
  {
    to: "/insert",
    name: "거래입력",
    icon: <NotebookPen className="size-4.5" />,
  },
  {
    to: "/entries",
    name: "거래내역",
    icon: <Notebook className="size-4.5" />,
  },
  {
    to: "/about",
    name: "라보멤",
    icon: <BookA className="size-4.5" />,
  },
];
