import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Forum from './pages/Forum';
import ProtectedRoute from './components/ProtectedRoute';

// Professional Navbar Component
const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? { color: '#6366f1' } : {};

  return (
    <nav className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#6366f1' }}>
        P2P<span style={{ color: '#1e1b4b' }}>Learn</span>
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link" style={isActive('/dashboard')}>Dashboard</Link>
        <Link to="/resources" className="nav-link" style={isActive('/resources')}>Resources</Link>
        <Link to="/forum" className="nav-link" style={isActive('/forum')}>Community</Link>
      </div>
      <button 
        onClick={() => {localStorage.clear(); window.location.href='/login'}} 
        className="btn btn-logout"
      >
        Logout
      </button>
    </nav>
  );
};

// Layout Wrapper to show Navbar only when logged in
const Layout = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  // Don't show navbar on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  
  return (
    <>
      {token && !isAuthPage && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;