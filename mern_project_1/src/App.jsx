import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Error from "./pages/Error";

import AppLayout from "./layout/AppLayout";
import UserLayout from "./layout/UserLayout";

import { serverEndpoint } from "./config/config";
import { SET_USER } from "./redux/user/actions";

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const response = await axios.get(`${serverEndpoint}/auth/getuser`, {
          withCredentials: true,
        });
        dispatch({ type: SET_USER, payload: response.data.user });
      } catch (err) {
        console.log("User not logged in");
      }
    };

    getLoggedInUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userDetails ? (
            <UserLayout>
              <Navigate to="/dashboard" />
            </UserLayout>
          ) : (
            <AppLayout>
              <Home />
            </AppLayout>
          )
        }
      />

      <Route
        path="/login"
        element={
          userDetails ? (
            <UserLayout>
              <Navigate to="/dashboard" />
            </UserLayout>
          ) : (
            <AppLayout>
              <Login />
            </AppLayout>
          )
        }
      />

      <Route
        path="/register"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Register />
            </AppLayout>
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout>
              <Dashboard />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/logout"
        element={
          userDetails ? (
            <UserLayout>
              <Logout />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/error"
        element={
          userDetails ? (
            <UserLayout>
              <Error />
            </UserLayout>
          ) : (
            <AppLayout>
              <Error />
            </AppLayout>
          )
        }
      />
    </Routes>
  );
}

export default App;
