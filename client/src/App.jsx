import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Forum from './pages/Forum';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Professional Navbar Component
const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const initials = user && user.name 
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'U';

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--primary)' }}>
          P2P<span style={{ color: 'var(--dark-indigo)' }}>Learn</span>
        </div>
        
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/resources" 
            className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Resources
          </Link>
          <Link 
            to="/forum" 
            className={`nav-link ${location.pathname === '/forum' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Community
          </Link>
        </div>

        <div className="nav-profile-section">
          {user && <div className="avatar-circle" title={user.name}>{initials}</div>}
          <button 
            onClick={() => {localStorage.clear(); window.location.href='/login'}} 
            className="btn btn-logout"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Logout
          </button>
          
          <button 
            className="nav-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </nav>
    </div>
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
      <Toaster position="top-right" reverseOrder={false} />
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