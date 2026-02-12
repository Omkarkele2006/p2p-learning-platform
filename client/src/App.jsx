import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources'; // <--- Import
import Forum from './pages/Forum';         // <--- Import

// Simple Navigation Bar
const Navbar = () => (
  <nav style={{ padding: '15px', background: '#333', color: 'white', display: 'flex', gap: '20px' }}>
    <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
    <Link to="/resources" style={{ color: 'white', textDecoration: 'none' }}>Resources</Link>
    <Link to="/forum" style={{ color: 'white', textDecoration: 'none' }}>Forum</Link>
    <button onClick={() => {localStorage.clear(); window.location.href='/login'}} style={{ marginLeft: 'auto', background: 'red', border: 'none', color: 'white' }}>Logout</button>
  </nav>
);

function App() {
  return (
    <Router>
      {/* Show Navbar only if logged in (simple check) */}
      {localStorage.getItem('token') && <Navbar />} 
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} /> {/* New Route */}
        <Route path="/forum" element={<Forum />} />         {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;