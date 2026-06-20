import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
        <h1 style={{ color: 'var(--dark-indigo)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 'var(--space-lg)' }}>Last Updated: June 20, 2026</p>
        
        <div style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p>
            Welcome to the Peer Learning Platform ("we", "our", "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, store, and process personal data when you access or use our platform.
          </p>
          
          <h2 style={{ color: 'var(--dark-indigo)', fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--space-md)' }}>1. Information We Collect</h2>
          <p>
            We collect information that you directly provide to us, including your full name, email address, profile skills, interests, bio details, and content uploaded to resources or discussion channels. We also cache authentication tokens inside local storage.
          </p>
          
          <h2 style={{ color: 'var(--dark-indigo)', fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--space-md)' }}>2. How We Use Your Information</h2>
          <p>
            Your information is used solely to facilitate peer-to-peer matching, provide forum updates, enable sharing of user-submitted materials, calculate profile completion metrics, and secure authentication channels.
          </p>
          
          <h2 style={{ color: 'var(--dark-indigo)', fontSize: '1.3rem', fontWeight: 700, marginTop: 'var(--space-md)' }}>3. Data Retention and Security</h2>
          <p>
            We deploy secure encryption protocols to protect passwords and profile metadata. Your personal data is stored as long as your account remains active on the platform. You may edit or remove your profile information at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
