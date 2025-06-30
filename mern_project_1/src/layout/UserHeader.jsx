import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Dashboard
        </Link>

        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 focus:outline-none">
            <span>{userDetails ? userDetails.name : "Account"}</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul className="absolute right-0 hidden group-hover:block mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50">
            <li>
              <Link
                to="/logout"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
