import { Link } from "react-router-dom";

function Dashboard({ user }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-radial-[at_25%_25%] from-white to-zinc-900 to-75% bg-center bg-no-repeat">
      <div className="bg-white/100 shadow-xl/30 backdrop-blur-sm p-6 rounded-lg w-full max-w-md  text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>
        
        {user ? (
          <div className="mb-4 text-left text-gray-700">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="text-red-600">User info not available</p>
        )}

        <Link
          to="/logout"
          className="inline-block bg-gray-900 text-white py-2 px-4 rounded-md mt-4 hover:bg-black"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
