import React, { useState } from 'react';
import './App.css';

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
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
