import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './LoginForm';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import Error from './pages/Error';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverEndpoint } from "./config";

const App = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/is-user-logged-in`, {}, {
        withCredentials: true
      });
      dispatch({
        type: 'SET_USER',
        payload: response.data.user
      });
    } catch (error) {
      console.error("Auto login check failed:", error.response?.data || error.message);
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={userDetails ? <Navigate to="/dashboard" /> : <Home />}
      />
      <Route
        path="/login"
        element={userDetails ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/logout"
        element={userDetails ? <Logout /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={userDetails ? <Dashboard user={userDetails} /> : <Navigate to="/login" />}
      />
      <Route path="/error" element={<Error />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
