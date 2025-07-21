import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverEndpoint } from "../config/config";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${serverEndpoint}/auth/logout`, {}, {
        withCredentials: true
      });
       document.cookie = `jwtToken=;
          expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `refreshToken=; 
          expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      dispatch({ type: 'CLEAR_USER' });
      navigate('/login');
    } catch (error) {
      console.error(error);
      navigate('/error');
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
}

export default Logout;
