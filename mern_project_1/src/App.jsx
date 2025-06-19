import React, { use, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './LoginForm';
import Dashboard from './pages/Dashboard';




const App = () => {
  const [userDetails, setUserDetails] = useState(null);

  const updateUserDetails = (updatedUserDetails) => {
    setUserDetails(updatedUserDetails);
  }
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
      <Route path="/dashboard" element={userDetails ?
        <Dashboard /> :
        <Navigate to="/login" />} 
      />
    </Routes>
  );
};

export default App;
