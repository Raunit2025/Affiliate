import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetPasswordClick = () => {
    setIsDropdownOpen(false); // Close dropdown immediately
    // Navigate to ResetPassword page, indicating it's from the user header
    navigate("/reset-password", { state: { fromUserHeader: true } });
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Affiliate++
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 focus:outline-none"
          >
            <span>{userDetails ? userDetails.name : "Account"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50">
              <li>
                {/* New: Reset Password Link */}
                <button
                  onClick={handleResetPasswordClick}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Reset Password
                </button>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
