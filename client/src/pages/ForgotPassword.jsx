import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      alert('OTP sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      alert('Password Reset Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or Expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">
          {step === 1 ? 'Reset Password' : 'Verify OTP'}
        </h2>
        <p className="auth-subtitle">
          {step === 1 ? 'Enter your email to receive a code' : 'Check your email for the code'}
        </p>
        
        {error && <div className="error-box">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={sendOtp} className="auth-form">
            <div className="input-group">
              <input 
                type="email" 
                placeholder=" " 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <label>Email Address</label>
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="auth-form">
            <div className="input-group">
              <input 
                type="text" 
                placeholder=" " 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
              <label>Enter 6-digit OTP</label>
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder=" " 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
              <label>New Password</label>
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <p className="bottom-text">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;