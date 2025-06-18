import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
    setMessage('✅ Registration successful!');
    
    
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-lg shadow-lg w-80 flex flex-col"
      >
        <h2 className="text-center text-white text-2xl mb-5">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mb-4 p-2 text-sm border border-gray-800 rounded bg-black text-white placeholder-gray-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 p-2 text-sm border border-gray-800 rounded bg-black text-white placeholder-gray-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mb-4 p-2 text-sm border border-gray-800 rounded bg-black text-white placeholder-gray-500"
        />

        <button
          type="submit"
          className="p-2 text-base bg-white text-black rounded hover:bg-gray-300 transition"
        >
          Register
        </button>

        {message && <p className="text-center mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
