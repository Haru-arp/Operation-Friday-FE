import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hook/usePageTitle";
import dayjs from "dayjs";

interface HeaderProps {
  login?: boolean;
  setLogin?: () => void;
}
export default function Header({ login, setLogin }: HeaderProps) {
  const pageTitle = usePageTitle();
  const date = dayjs();
  const formatted = date.format("YYYY년 M월 D일");
  return (
    <header className="w-full h-25 flex items-center justify-between">
      <div>
        <div className="font-extrabold text-[26px] text-gray-900">
          {pageTitle}
        </div>
        <div className="font-medium text-[14px] text-gray-500">{formatted}</div>
      </div>
      {!login ? (
        <Button onClick={setLogin} size="lg">
          Connect OpFriday
        </Button>
      ) : (
        <div className="flex items-center gap-2 ">
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block size-12 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
          <div className="flex flex-col items-start cursor-pointer">
            <div className="font-bold text-[16px] text-[#000]">이동희</div>
            <div className="font-light text-[12px] text-gray-600">
              rou012001@gmail.com
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// className="font-bold text-[18px] mb-[4px]"
