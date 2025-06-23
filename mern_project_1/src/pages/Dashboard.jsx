import { Link } from "react-router-dom";
function Dashboard() {
    
    
    return (
        <div className="text-center" >
            <h1 className=" text-2xl text-center">User Dashboard Page</h1>
            <Link to="/logout">Logout</Link>
        </div>
    );
}

export default Dashboard;