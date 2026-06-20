import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
      toast.success('OTP sent to your email!');
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'User not found';
      setError(errMsg);
      toast.error(errMsg);
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
      toast.success('Password Reset Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Invalid or Expired OTP';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <img src="/p2pl.jpg" alt="P2PLearn Logo" className="brand-logo-auth" />
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
                id="forgot-email"
                type="email" 
                placeholder=" " 
                className="form-input"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <label htmlFor="forgot-email">Email Address</label>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderLeftColor: 'white', marginRight: '8px' }}></div>
                  Sending OTP...
                </>
              ) : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="auth-form">
            <div className="input-group">
              <input 
                id="forgot-otp"
                type="text" 
                placeholder=" " 
                className="form-input"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
              <label htmlFor="forgot-otp">Enter 6-digit OTP</label>
            </div>
            <div className="input-group">
              <input 
                id="forgot-new-password"
                type="password" 
                placeholder=" " 
                className="form-input"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
              <label htmlFor="forgot-new-password">New Password</label>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderLeftColor: 'white', marginRight: '8px' }}></div>
                  Resetting...
                </>
              ) : 'Reset Password'}
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