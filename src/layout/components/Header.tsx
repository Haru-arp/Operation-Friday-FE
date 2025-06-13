import { Home, PlusCircle, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="font-bold text-lg">
            복식부기 가계부
          </Link>
          <nav className="flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`p-2 rounded-md ${
                location.pathname === "/dashboard"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Home className="h-5 w-5" />
            </Link>
            <Link
              to="/transaction/new"
              className={`p-2 rounded-md ${
                location.pathname === "/transaction/new"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <PlusCircle className="h-5 w-5" />
            </Link>
            <Link
              to="/settings"
              className={`p-2 rounded-md ${
                location.pathname === "/settings"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Settings className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
