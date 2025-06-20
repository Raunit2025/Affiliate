import axios from "axios";

function Dashboard() {


  const handleLogout = async ({updateUserDetails}) => {
    try {
      await axios.post('http://localhost:5001/auth/logout', {}, { withCredentials: true });
        updateUserDetails({
          username: null,
          password: null,
        });

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
    
    return (
        <div className="text-center" >
            <h1 className=" text-2xl text-center">User Dashboard Page</h1>
            <button
                onClick={handleLogout}
                className=" bg-red-600 text-white rounded hover:bg-red-700 "
            >
                Logout
            </button>
        </div>
    );
}

export default Dashboard;