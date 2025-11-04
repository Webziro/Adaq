import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface AdminLoginProps {
  onLogin: (userData: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com',
    password: '1111',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin-login', formData);
      console.log(res.data);
      setMessage('Admin Login successful!');
      localStorage.setItem('token', res.data.token);

      const decoded: any = jwtDecode(res.data.token);
      const userPosition = decoded.user.position;

      onLogin({
        id: decoded.user.id,
        name: 'Admin User',
        email: formData.email,
        position: userPosition,
        plateRequestStatus: 'pending', // Placeholder
      });
    } catch (err: any) {
      console.error(err.response?.data?.msg || err.message);
      setMessage(err.response?.data?.msg || 'Admin Login failed.');
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminLogin;


