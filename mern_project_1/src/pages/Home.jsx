import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%">

      {/* Header
      <header className="bg-white/70 backdrop-blur-md shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">MERN Auth App</h1>
          <nav>
            <Link to="/login" className="pr-2 text-blue-600 hover:underline">Login</Link>
            <Link to="/" className="pr-2 text-blue-600 hover:underline">Home</Link>
            <Link to="#" className="pr-2 text-blue-600 hover:underline">About</Link>
            <Link to="#" className="pr-2 text-blue-600 hover:underline">Contact Us</Link>
          </nav>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center flex-col text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to MERN Project</h1>
        <Link
          to="/login"
          className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black transition"
        >
          Login
        </Link>
      </main>

      {/* Footer
      <footer className="bg-white/70 backdrop-blur-md text-center py-3 text-sm text-gray-700 shadow-inner">
        © {new Date().getFullYear()} MERN Auth App. All rights reserved.
      </footer> */}
    </div>
  );
}

export default Home;
