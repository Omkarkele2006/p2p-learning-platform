import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title" style={{ color: '#1e1b4b' }}>Create Account</h2>
        <p className="auth-subtitle">Join the community today</p>
        
        {error && <div className="error-box">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input 
              type="text" 
              name="name" 
              placeholder=" " 
              className="form-input"
              onChange={handleChange} 
              required 
            />
            <label>Full Name</label>
          </div>

          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder=" " 
              className="form-input"
              onChange={handleChange} 
              required 
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="password" 
              placeholder=" " 
              className="form-input"
              onChange={handleChange} 
              required 
            />
            <label>Password</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign Up
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