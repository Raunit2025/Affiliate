import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-800">
          MyApp
        </Link>

        <div className="space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
