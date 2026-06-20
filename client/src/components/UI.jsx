import React from 'react';

// 1. PageHeader
export const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)', color: 'var(--dark-indigo)', fontWeight: 700 }}>
        {title}
      </h1>
      {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{subtitle}</p>}
      {children && <div style={{ marginTop: 'var(--space-md)' }}>{children}</div>}
    </div>
  );
};

// 2. EmptyState
export const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="empty-state">
      {icon && <span className="empty-icon" role="img" aria-label={title}>{icon}</span>}
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-desc">{description}</p>}
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

// 3. LoadingSpinner
export const LoadingSpinner = ({ message = 'Loading...', small = false }) => {
  if (small) {
    return <div className="spinner spinner-sm" style={{ display: 'inline-block' }}></div>;
  }
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
};

// 4. StatCard
export const StatCard = ({ value, label }) => {
  return (
    <div className="stat-item">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

// 5. SectionCard
export const SectionCard = ({ title, children, className = '', hover = false }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>
      {title && (
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 'var(--space-sm)' }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
