import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-blue-900 to-indigo-950 text-white">
      <nav className="bg-gradient-to-r from-transparent to-black/30 backdrop-blur-sm sticky top-0 z-50 shadow-lg py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Affiliate++ Logo" className="h-11 w-11" /> 
            <span className="text-3xl font-extrabold text-blue-300 tracking-wider">
              Affiliate++
            </span>
          </Link>

          <div className="space-x-6">
            <Link to="/" className="text-blue-200 hover:text-blue-50 transition duration-300 text-lg font-medium">
              Home
            </Link>
            <Link to="/login" className="text-blue-200 hover:text-blue-50 transition duration-300 text-lg font-medium">
              Login
            </Link>
            <Link to="/register" className="text-blue-200 hover:text-blue-50 transition duration-300 text-lg font-medium">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-blue-100 drop-shadow-lg">
          Affiliate++: Drive Your Success.
        </h1>
        <p className="text-xl text-blue-200 mb-10 max-w-2xl font-light leading-relaxed">
          The ultimate platform to create, organize, and track your affiliate links with powerful analytics and campaign management.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 px-4">
          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Login to Dashboard
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-300 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 text-center text-sm text-blue-300 py-4 border-t border-blue-900/50">
        © {new Date().getFullYear()} Affiliate++. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;