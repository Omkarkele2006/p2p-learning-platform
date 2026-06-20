import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password confirmation match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    // Explicit verification for required checkboxes
    if (!agreedToPrivacy || !agreedToTerms) {
      setError('You must accept the Privacy Policy and Terms & Conditions');
      toast.error('You must accept the Privacy Policy and Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the peer learning community today</p>
        
        {error && <div className="error-box">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input 
              id="register-name"
              type="text" 
              name="name" 
              placeholder=" " 
              className="form-input"
              value={formData.name}
              onChange={handleChange} 
              required 
            />
            <label htmlFor="register-name">Full Name</label>
          </div>

          <div className="input-group">
            <input 
              id="register-email"
              type="email" 
              name="email" 
              placeholder=" " 
              className="form-input"
              value={formData.email}
              onChange={handleChange} 
              required 
            />
            <label htmlFor="register-email">Email Address</label>
          </div>

          <div className="input-group">
            <input 
              id="register-password"
              type="password" 
              name="password" 
              placeholder=" " 
              className="form-input"
              value={formData.password}
              onChange={handleChange} 
              required 
            />
            <label htmlFor="register-password">Password</label>
          </div>

          <div className="input-group">
            <input 
              id="register-confirm-password"
              type="password" 
              name="confirmPassword" 
              placeholder=" " 
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange} 
              required 
            />
            <label htmlFor="register-confirm-password">Confirm Password</label>
          </div>

          {/* Legal Pages Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xs)' }}>
              <input 
                id="checkbox-privacy"
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                style={{ width: 'auto', marginTop: '4px', cursor: 'pointer' }}
                required
              />
              <label htmlFor="checkbox-privacy" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</Link>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xs)' }}>
              <input 
                id="checkbox-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ width: 'auto', marginTop: '4px', cursor: 'pointer' }}
                required
              />
              <label htmlFor="checkbox-terms" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms & Conditions</Link>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            disabled={loading || !agreedToPrivacy || !agreedToTerms}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderLeftColor: 'white', marginRight: '8px' }}></div>
                Signing Up...
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;