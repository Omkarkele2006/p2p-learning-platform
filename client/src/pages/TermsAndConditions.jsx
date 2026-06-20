import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg)' }}>
      <Link 
        to="/" 
        style={{ 
          color: 'var(--primary)', 
          textDecoration: 'none', 
          fontWeight: 600, 
          display: 'inline-flex', 
          alignItems: 'center', 
          marginBottom: 'var(--space-lg)',
          gap: 'var(--space-xs)'
        }}
      >
        ← Back to Home
      </Link>
      
      <div className="card" style={{ padding: 'var(--space-2xl)' }}>
        <h1 style={{ color: 'var(--dark-indigo)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Terms and Conditions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 'var(--space-lg)' }}>Last Updated: June 20, 2026</p>
        
        <div style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p>
            Please read these Terms and Conditions carefully before using our Peer Learning Platform. By creating an account or accessing our services, you agree to comply with and be bound by these Terms.
          </p>
          
          <h2 style={{ color: 'var(--dark-indigo)', fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--space-md)' }}>1. Account Registration and Security</h2>
          <p>
            You must provide accurate, current, and complete information during registration. You are responsible for keeping your password confidential and securing access to your registered account.
          </p>
          
          <h2 style={{ color: 'var(--dark-indigo)', fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--space-md)' }}>2. Acceptable Platform Behavior</h2>
          <p>
            Peer interaction must remain professional, academic, and respectful. Sharing unauthorized course material, spamming discussion boards, or utilizing aggressive language is strictly prohibited. We reserve the right to suspend accounts violating these conditions.
          </p>
          
          <h2 style={{ color: 'var(--dark-indigo)', fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--space-md)' }}>3. Content Submissions</h2>
          <p>
            You retain ownership of any resources or topics you post. However, by uploading content, you grant the platform a license to display, distribute, and index your materials for collaborative peer learning functions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
