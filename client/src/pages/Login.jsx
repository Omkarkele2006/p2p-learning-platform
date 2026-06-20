import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const githubCode = searchParams.get('code');
    if (githubCode) handleGithubLogin(githubCode);
  }, [searchParams]);

  const handleGithubLogin = async (code) => {
    try {
      const res = await api.post('/auth/github', { code });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch {
      setError('GitHub Login Failed');
      toast.error('GitHub Login Failed');
    }
  };

  const handleGithubRedirect = () => {
    const CLIENT_ID = "Ov23liRMU5o9nG8jphYt";
    const REDIRECT_URI = "http://localhost:5173/login";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Login failed';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title" style={{ color: '#1e1b4b' }}>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue your learning journey</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            {/* The placeholder=" " is CRITICAL for your CSS to work */}
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

          <div style={{ textAlign: 'right', marginBottom: '15px', fontSize: '0.85rem' }}>
            <Link to="/forgot-password" style={{ color: '#6366f1', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>

          <button className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '20px 0', color: '#6b7280', fontSize: '0.8rem' }}>OR</div>

        <button className="btn btn-secondary" onClick={handleGithubRedirect} style={{ width: '100%', gap: '10px' }}>
          <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Continue with GitHub
        </button>

        <p className="bottom-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;