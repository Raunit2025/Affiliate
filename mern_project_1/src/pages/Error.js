import { Link } from "react-router-dom"
function Error(){
    return(
    <div className="container text-center">
        <h1>Something went wrong</h1>
        <Link to="/">Link to home</Link>
    </div>
    );
}

export default Error;