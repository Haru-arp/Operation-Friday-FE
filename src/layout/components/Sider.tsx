import { Link } from "react-router-dom";

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
    name: "Home",
  },
  {
    to: "/about",
    name: "About",
  },
];

export default function Sider({ onClickItem }: LinkItem) {
  return (
    <aside className="w-40 h-full bg-gray-100 p-[12px] border-r-gray-200 border-r-[1px]">
      <nav className="flex flex-col gap-2">
        {router.map(({ to, name }: RouteItem) => (
          <Link
            to={to}
            key={name}
            onClick={onClickItem}
            className="px-[4px] py-[3px] rounded-[4px] hover:bg-gray-300 "
          >
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
