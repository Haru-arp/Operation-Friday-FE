import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-blue-950 text-white p-4">
            <Link to="/" className="text-xl font-bold">
                Operation Friday
            </Link>
        </header>
    );
}
