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
