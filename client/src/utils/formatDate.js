export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  if (diffMs < 0) return 'Just now'; // Handle slight client/server clock offset
  
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) {
    return 'Just now';
  }
  
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  
  // Format as e.g. "Jun 20, 2026"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
