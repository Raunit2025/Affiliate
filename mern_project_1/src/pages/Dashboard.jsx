import { Link } from "react-router-dom";

function Dashboard({ user }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-radial-[at_25%_25%] from-white to-zinc-900 to-75% bg-center bg-no-repeat h-screen w-screen">
      <div className="bg-white/50 shadow-xl/30 backdrop-blur-sm p-6 rounded-lg w-full max-w-sm hover:bg-white/100 text-center">
        <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>

        <div className="mb-4 text-left space-y-1">
          <p><strong>Username:</strong> {user?.username || "N/A"}</p>
          <p><strong>Password:</strong> {user?.password || "N/A"}</p>
        </div>

        <Link
          to="/logout"
          className="inline-block mt-4 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-black"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
