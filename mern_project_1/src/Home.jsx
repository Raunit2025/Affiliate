import { Link } from "react-router-dom";

function Home() {
    return(
        <div className="min-h-screen flex items-center justify-center flex-col bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%">
            <h1 className="text-3xl font-bold mb-4">Welcome to MERN Project</h1>
            <Link to="/login" className="hover:text-blue-500 text-2xl ml-4 ">Login</Link>
        </div>
    );
}
export default Home;