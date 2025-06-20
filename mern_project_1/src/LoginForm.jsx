import React, { useState } from 'react';
import axios from 'axios';
const Login = ({ updateUserDetails }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = form.username.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedUsername && !trimmedPassword) {
      setError('Both fields are required');
      return;
    }
    if (!trimmedUsername) {
      setError('UserName is required');
      return;
    }
    if (!trimmedPassword) {
      setError('Password is required');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const envUsername = import.meta.env.VITE_LOGIN_USERNAME;
    const envPassword = import.meta.env.VITE_LOGIN_PASSWORD;

    if (trimmedUsername === envUsername && trimmedPassword === envPassword) {
      //Data to be sent to the server
      const body = {
        username: trimmedUsername,
        password: trimmedPassword
      };
      const config = {
        withCredentials: true //Tells axios to include cookie in the request + some other auth headers
      };
      try {
        const response = await axios.post('http://localhost:5001/auth/login', body, config);
        console.log(response);
        updateUserDetails({
      
          username: 'admin',
          password: '123456',
        });

      } catch (error) {
        console.log(error);
        setError({ message: "Somthing went wrong Please try again" });
      }

    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4  bg-cover bg-radial-[at_25%_25%] from-white to-zinc-900 to-75% bg-center bg-no-repeat h-screen w-screen" >
      <div className="bg-white/50 shadow-xl/30  backdrop-blur-sm p-6 rounded-lg w-full max-w-sm hover:bg-white/100">
        <h2 className="text-xl font-semibold mb-4 ">Sign in to Continue</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">UserName</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="UserName"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-900 py-2 rounded-md hover:bg-black text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;