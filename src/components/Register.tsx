import React, { useState } from 'react';
import axios from 'axios'; // Import axios

interface RegisterProps {
  onRegister: (userData: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  // Must contain at least 6 characters, special characters, numbers, uppercase and lowercase letters
    if (formData.password !== formData.confirmPassword || formData.password.length < 6 || !/[!@#$%^&*]/.test(formData.password) || !/[0-9]/.test(formData.password) || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password)) {
      setMessage('Passwords do not match or do not meet complexity requirements.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log(res.data);
      setMessage('Registration successful!');
      // Assuming your backend returns a token upon successful registration
      localStorage.setItem('token', res.data.token);
      // You might want to fetch user data after successful registration
      // and then call onRegister with the fetched user data.
      // For now, let's simulate a successful registration.
      onRegister({ ...formData, id: 'some-generated-id', plateRequestStatus: 'pending' });
    } catch (err: any) {
      console.error(err.response?.data?.msg || err.message);
      setMessage(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
