import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const hardcodedUser = { username: 'admin', password: '123456' };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.username === hardcodedUser.username &&
      formData.password === hardcodedUser.password
    ) {
      setMessage('✅ Login successful!');
    } else {
      setMessage('❌ Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-lg shadow-lg w-72 flex flex-col"
      >
        <h2 className="text-center text-white text-2xl mb-5">Login</h2>
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
          Login
        </button>
        {message && (
          <p className="text-center mt-4 text-sm">{message}</p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
