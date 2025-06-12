import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { LogOutIcon, LucideWalletCards } from "lucide-react";
import { router, type RouteItem } from "@/constants/routeItems";

interface LinkItem {
  onClickItem?: () => void;
  login?: boolean;
  setLogout?: () => void;
}

export default function Sider({ onClickItem, login, setLogout }: LinkItem) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="w-58 h-full flex flex-col justify-between bg-[#FAFAFA] ">
      <div>
        <div
          onClick={() => {
            navigate("/");
          }}
          className="h-28 p-6 flex items-center justify-center gap-[10px] cursor-pointer"
        >
          <div className="w-[38px] h-[38px] border-[3px] border-[#161421] rounded-[100%] flex items-center justify-center">
            <LucideWalletCards className="h-6 w-6 text-[#161421]" />
          </div>
          <div className="text-[20px] font-bold text-[#161421]">OpFriday</div>
        </div>
        {/** Logo */}
        <nav className="flex flex-col gap-2 mt-[15px] px-6">
          {router.map(({ to, name, icon }: RouteItem) => {
            const isActive = location.pathname === to;
            return (
              <Link
                to={to}
                key={name}
                onClick={onClickItem}
                className={clsx(
                  " flex items-center gap-1.5 px-4 py-3 rounded-[6px] transition-colors duration-200",
                  "hover:bg-purple-100 hover:text-[#8C65F6]",
                  isActive
                    ? "bg-[#8C65F6] text-white font-semibold"
                    : "text-gray-900"
                )}
              >
                {icon}
                <div className="text-[15px] font-medium">{name}</div>
              </Link>
            );
          })}
        </nav>
      </div>
      {login && (
        <div className="h-80 w-full flex flex-col items-center justify-evenly">
          <div className="flex flex-col items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block size-12 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-[16px] text-[#000]">이동희</div>
              <div className="font-light text-[12px] text-gray-600">
                rou012001@gmail.com
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={setLogout}>
            <LogOutIcon className="size-3.5" />
            <div className="text-[12px] text-gray-600">Log out</div>
          </div>
        </div>
      )}
    </aside>
  );
}
