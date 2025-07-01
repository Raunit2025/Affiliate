import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      
      {/* Header */}
      <header className="p-6 text-center text-2xl font-semibold tracking-widest">
        MERN AUTH PROJECT
      </header>

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
      <footer className="text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} MERN Project. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
