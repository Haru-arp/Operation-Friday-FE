interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="relative flex items-center bg-blue-600 text-white h-14 md:h-16 px-4">
      {/* 햄버거 메뉴 버튼 */}
      <button
        onClick={onToggleSidebar}
        className="cursor-pointer md:hidden absolute left-4 z-10"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 제목 */}
      <h1 className="w-full text-center text-lg font-semibold md:text-left md:pl-0 md:ml-0">
        Operation Friday
      </h1>
    </header>
  );
}
