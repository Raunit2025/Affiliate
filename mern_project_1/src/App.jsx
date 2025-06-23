import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './LoginForm';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Logout from './pages/Logout';



const App = () => {
  const [userDetails, setUserDetails] = useState(null);

  const updateUserDetails = (updatedUserDetails) => {
    setUserDetails(updatedUserDetails);

  }

  const isUserLoggedIn = async () => {
    try{
    const response = await axios.post('http://localhost:5001/auth/is-user-logged-in', {}, {
      withCredentials: true
    });
    updateUserDetails(response.data.user); 
  } catch(error){
    console.log(error);
    }
  };
  useEffect(() => {
    isUserLoggedIn();
  }, []);
  return (
    <Routes>
      <Route path="/" element={userDetails ?
        <Navigate to="/dashboard" /> :
        <Home />}
      />
      <Route path="/login" element={userDetails ?
        <Navigate to="/dashboard" /> :
        <Login updateUserDetails={updateUserDetails} />}
      />

      <Route path="/logout" element={userDetails ? 
        <Logout updateUserDetails={updateUserDetails}/>:
        <Navigate to ="/login" /> }/>
        <Route path="error" element={userDetails ?
          <Error />:
          <Error/>
      }></Route>
      <Route path="/dashboard" element={userDetails ?
        <Dashboard /> :
        <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
