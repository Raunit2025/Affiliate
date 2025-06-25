import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { serverEndpoint } from './config';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, password } = form;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Both fields are required');
      return;
    }

    if (trimmedUsername.length < 3 || trimmedPassword.length < 6) {
      setError('Invalid credentials length');
      return;
    }

    const body = { username: trimmedUsername, password: trimmedPassword };
    const config = { withCredentials: true };

    try {
      const res = await axios.post(`${serverEndpoint}/auth/login`, body, config);
      dispatch({
        type: 'SET_USER',
        payload: res.data.user
      });
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const idToken = authResponse?.credential;
      if (!idToken) {
        setError("No ID token received from Google.");
        return;
      }

      const res = await axios.post(`${serverEndpoint}/auth/google-auth`, { idToken }, {
        withCredentials: true
      });

      dispatch({
        type: 'SET_USER',
        payload: res.data.user
      });
    } catch (error) {
      console.error(error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-radial-[at_25%_25%] from-white to-zinc-900 to-75% bg-center bg-no-repeat h-screen w-screen">
      <div className="bg-white/50 shadow-xl/30 backdrop-blur-sm p-6 rounded-lg w-full max-w-sm hover:bg-white/100">
        <h2 className="text-xl font-semibold mb-4">Sign in to Continue</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
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
        <h2 className="text-center my-2 text-sm text-gray-700">OR</h2>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login;
