import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

export interface RouteItem {
    to: string;
    name: string;
    icon?: React.ReactNode;
}

interface LinkItem {
    onClickItem?: () => void;
}

const router: RouteItem[] = [
    {
        to: "/",
        name: "대시보드",
    },
    {
        to: "/insert",
        name: "거래입력",
    },
    {
        to: "/entries",
        name: "거래내역",
    },
    {
        to: "/about",
        name: "라보멤",
    },
];

export default function Sider({ onClickItem }: LinkItem) {
    const location = useLocation();

    return (
        <aside className="w-60 h-full bg-[#fff] px-[12px] py-[18px] ">
            <nav className="flex flex-col gap-2">
                {router.map(({ to, name }: RouteItem) => {
                    const isActive = location.pathname === to;
                    return (
                        <Link
                            to={to}
                            key={name}
                            onClick={onClickItem}
                            className={clsx(
                                "text-[14px] font-medium px-[4px] py-[6px] rounded-[6px] transition-colors duration-200",
                                "hover:bg-purple-100 hover:text-[#a989ff]",
                                isActive ? "bg-[#a989ff] text-white font-semibold" : "text-gray-900"
                            )}
                        >
                            {name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
