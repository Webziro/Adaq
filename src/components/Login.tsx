import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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

interface LoginProps {
  onLogin: (userData: UserData) => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log(res.data);
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);

      const decoded: any = jwtDecode(res.data.token);
      const userPosition = decoded.user.position;

      onLogin({
        id: decoded.user.id,
        name: 'User Name',
        email: formData.email,
        nin: '',
        passport: '',
        vehicleColor: '',
        vehicleChassisNumber: '',
        position: userPosition,
        plateRequestStatus: 'pending',
      });
    } catch (err: any) {
      console.error(err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <p className="instruction-text">Sign in to continue to your account</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="your.email@example.com"
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
            disabled={loading}
            placeholder="Enter your password"
          />
        </div>
        
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button 
            type="button" 
            onClick={onForgotPassword}
            className="back-link"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            Forgot Password?
          </button>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;