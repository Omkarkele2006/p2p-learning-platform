import React from 'react';
import { formatRelativeTime } from '../utils/formatDate';

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

// 6. ProgressBar
export const ProgressBar = ({ value, suggestion }) => {
  // Determine gradient color depending on percentage score
  let progressBg = 'linear-gradient(90deg, #f87171, #fb923c)'; // low: red-orange
  let textColor = '#b91c1c';
  if (value >= 80) {
    progressBg = 'linear-gradient(90deg, #34d399, #10b981)'; // high: green
    textColor = '#047857';
  } else if (value >= 50) {
    progressBg = 'linear-gradient(90deg, #818cf8, #8b5cf6)'; // medium: indigo-purple
    textColor = '#4338ca';
  }

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Profile Completion</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor }}>{value}%</span>
      </div>
      <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: 'var(--space-sm)' }}>
        <div style={{ height: '100%', width: `${value}%`, background: progressBg, borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
      </div>
      {suggestion && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 1.4 }}>
          <span>💡</span> <em>{suggestion}</em>
        </p>
      )}
    </div>
  );
};

// 7. Badge
export const Badge = ({ text }) => {
  let badgeStyle = { background: '#cbd5e1', color: '#334155' }; // default: New Learner
  if (text === 'Active Member') {
    badgeStyle = { background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' };
  } else if (text === 'Contributor') {
    badgeStyle = { background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)' };
  } else if (text === 'Mentor') {
    badgeStyle = { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-text)' };
  } else if (text === 'Community Leader') {
    badgeStyle = { background: '#fef3c7', color: '#b45309' };
  }

  return (
    <span 
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.3px',
        ...badgeStyle
      }}
    >
      {text}
    </span>
  );
};

// 8. ActivityTimeline
export const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: 'var(--space-md) 0' }}>
        No recent activities recorded yet.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingLeft: 'var(--space-xs)', position: 'relative' }}>
      {/* Dynamic line connecting timeline nodes */}
      <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '15px', width: '2px', background: 'rgba(99, 102, 241, 0.15)' }}></div>
      
      {activities.map((act, index) => {
        let icon = '📝';
        let iconBg = 'rgba(99, 102, 241, 0.1)';
        let iconColor = 'var(--primary)';

        if (act.type === 'discussion') {
          icon = '💬';
          iconBg = 'rgba(99, 102, 241, 0.1)';
          iconColor = 'var(--primary)';
        } else if (act.type === 'reply') {
          icon = '↩️';
          iconBg = 'rgba(168, 85, 247, 0.1)';
          iconColor = 'var(--secondary)';
        } else if (act.type === 'resource') {
          icon = '📚';
          iconBg = 'rgba(16, 185, 129, 0.1)';
          iconColor = 'var(--success-text)';
        }

        return (
          <div key={index} style={{ display: 'flex', gap: 'var(--space-md)', position: 'relative', zIndex: 1 }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ffffff',
                border: `2px solid ${iconColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              {icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500, lineHeight: 1.4 }}>
                {act.description}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {formatRelativeTime(act.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 9. InsightCard
export const InsightCard = ({ title, value, icon, badgeText }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)' }}>
      {icon && (
        <div 
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'var(--primary)',
            flexShrink: 0
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-xs)' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--dark-indigo)' }}>
            {value}
          </span>
          {badgeText && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', background: 'rgba(168, 85, 247, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
