import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      
      {/* Header (Navbar) */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-gray-800">
            MyApp
          </Link>

          <div className="space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Welcome to your MERN App
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-xl">
          Secure authentication system built with MongoDB, Express, React, and Node.js.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition text-white font-medium shadow-md"
          >
            Register
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4 border-t">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
