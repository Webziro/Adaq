import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

interface UserData {
  id: string;
  name: string;
  email: string;
  nin?: string;
  passport?: string;
  vehicleColor?: string;
  vehicleChassisNumber?: string;
  position: 'user' | 'admin';
  plateRequestStatus?: 'pending' | 'started' | 'in-progress' | 'completed';
}

//The void means indicates that this function doesn't return any value
interface LoginProps {
  onLogin: (userData: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log(res.data);
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);

      const decoded: any = jwtDecode(res.data.token); // Decode the token
      const userPosition = decoded.user.position; // Get user position from token

      // For simplicity, let's assume we fetch full user data or construct it from token
      // In a real app, you might fetch full user profile here
      onLogin({
        id: decoded.user.id,
        name: 'User Name', // Placeholder, fetch from backend or decode more info
        email: formData.email,
        nin: '', // Placeholder
        passport: '', // Placeholder
        vehicleColor: '', // Placeholder
        vehicleChassisNumber: '', // Placeholder
        position: userPosition,
        plateRequestStatus: 'pending', // Placeholder
      });
    } catch (err: any) {
      console.error(err.response?.data?.msg || err.message);
      setMessage(err.response?.data?.msg || 'Login failed.');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome back! Login</h2>
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

export default Login;
