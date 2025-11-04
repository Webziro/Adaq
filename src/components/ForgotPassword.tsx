import React, { useState } from 'react';
import axios from 'axios';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      console.log('Reset code response:', res.data);
      
      setMessage('A reset code has been sent to your email. Check your console in development mode.');
      
      // Automatically move to next step after 1 second
      setTimeout(() => {
        setStep('code');
        setMessage('');
      }, 1500);
      
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.msg || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetCode.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-reset-code', { 
        email, 
        code: resetCode 
      });
      console.log('Verify code response:', res.data);
      
      setMessage('Code verified! Please enter your new password.');
      
      // Move to reset step
      setTimeout(() => {
        setStep('reset');
        setMessage('');
      }, 1000);
      
    } catch (err: any) {
      console.error('Verify code error:', err);
      setError(err.response?.data?.msg || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        code: resetCode,
        newPassword
      });
      console.log('Reset password response:', res.data);
      
      setMessage('Password reset successful! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);
      
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.msg || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('A new reset code has been sent to your email.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      
      {step === 'email' && (
        <form onSubmit={handleRequestReset}>
          <p className="instruction-text">
            Enter your email address and we'll send you a code to reset your password.
          </p>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="your.email@example.com"
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      )}
      
      {step === 'code' && (
        <form onSubmit={handleVerifyCode}>
          <p className="instruction-text">
            Enter the 6-digit code sent to <strong>{email}</strong>
            <br />
            <small>Check your console in development mode</small>
          </p>
          <div className="form-group">
            <label htmlFor="code">Reset Code:</label>
            <input
              type="text"
              id="code"
              value={resetCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setResetCode(value);
                  setError('');
                }
              }}
              required
              disabled={loading}
              maxLength={6}
              placeholder="000000"
              className="code-input"
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading || resetCode.length !== 6}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button 
            type="button" 
            onClick={handleResendCode} 
            className="secondary-button"
            disabled={loading}
          >
            Resend Code
          </button>
          <button 
            type="button" 
            onClick={() => {
              setStep('email');
              setResetCode('');
              setError('');
              setMessage('');
            }} 
            className="back-link"
          >
            Use Different Email
          </button>
        </form>
      )}
      
      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <p className="instruction-text">
            Create a new password for your account.
          </p>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              required
              disabled={loading}
              minLength={6}
              placeholder="At least 6 characters"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              required
              disabled={loading}
              placeholder="Re-enter your password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      
      {step === 'email' && (
        <button onClick={onBack} className="back-link">
          Back to Login
        </button>
      )}
    </div>
  );
};

export default ForgotPassword;