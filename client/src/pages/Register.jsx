import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the community today</p>
        
        {error && <div className="error-box">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input 
              id="register-name"
              type="text" 
              name="name" 
              placeholder=" " 
              className="form-input"
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
              onChange={handleChange} 
              required 
            />
            <label htmlFor="register-password">Password</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
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