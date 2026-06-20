import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { PageHeader, SectionCard, EmptyState, LoadingSpinner } from '../components/UI';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', link: '', type: 'Video', tags: '' });
  const [loading, setLoading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);

  // 1. Fetch Resources
  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } catch (err) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 2. Handle Upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await api.post('/resources', { ...formData, tags: tagsArray });
      
      toast.success('Resource Uploaded!');
      setFormData({ title: '', description: '', link: '', type: 'Video', tags: '' });
      fetchResources();
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Upload failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <PageHeader title="Library 📚" subtitle="Share and discover learning materials." />

      <div className="grid-2col">
        {/* Left: Upload Form */}
        <SectionCard title="Contribute">
          <form onSubmit={handleSubmit} className="form-panel">
            <div style={{ marginBottom: 'var(--space-xs)' }}>
              <label htmlFor="res-title" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Title</label>
              <input 
                id="res-title"
                className="form-input"
                placeholder="React Crash Course" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div style={{ marginBottom: 'var(--space-xs)' }}>
              <label htmlFor="res-desc" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
              <textarea 
                id="res-desc"
                className="form-input"
                placeholder="Brief summary of the resource content..." 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                style={{ height: '80px', resize: 'vertical' }}
                required 
              />
            </div>

            <div style={{ marginBottom: 'var(--space-xs)' }}>
              <label htmlFor="res-link" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Link URL</label>
              <input 
                id="res-link"
                className="form-input"
                placeholder="https://example.com/react-course" 
                value={formData.link} 
                onChange={(e) => setFormData({...formData, link: e.target.value})} 
                required 
              />
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="res-type" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Type</label>
                <select 
                  id="res-type"
                  className="form-input"
                  style={{ marginBottom: 0 }}
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                  <option value="Note">Note</option>
                  <option value="Repo">Repo</option>
                </select>
              </div>
              
              <div style={{ flex: 2 }}>
                <label htmlFor="res-tags" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Tags (comma separated)</label>
                <input 
                  id="res-tags"
                  className="form-input"
                  style={{ marginBottom: 0 }}
                  placeholder="react, webdev, js" 
                  value={formData.tags} 
                  onChange={(e) => setFormData({...formData, tags: e.target.value})} 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderLeftColor: 'white', marginRight: '8px' }}></div>
                  Uploading...
                </>
              ) : 'Upload Resource'}
            </button>
          </form>
        </SectionCard>

        {/* Right: Resource Grid */}
        <div>
          {loadingResources ? (
            <LoadingSpinner message="Loading resources..." />
          ) : resources.length === 0 ? (
            <EmptyState 
              icon="📚"
              title="No resources available"
              description="Be the first to share learning materials with the community!"
              actionText="Upload Resource"
              onAction={() => document.getElementById('res-title')?.focus()}
            />
          ) : (
            <div className="grid-3col">
              {resources.map((res) => {
                let badgeStyle = { background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)' }; // Video
                if (res.type === 'Article') badgeStyle = { background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)' };
                if (res.type === 'Note') badgeStyle = { background: 'rgba(234, 179, 8, 0.08)', color: '#a16207' };
                if (res.type === 'Repo') badgeStyle = { background: 'rgba(168, 85, 247, 0.08)', color: 'var(--secondary)' };

                return (
                  <SectionCard key={res._id} hover={true} className="resource-card">
                    <div className="resource-card-meta">
                      <span className="badge" style={{ ...badgeStyle, margin: 0 }}>
                        {res.type}
                      </span>
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {new Date(res.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </small>
                    </div>

                    <h3 className="resource-card-title">
                      {res.title}
                    </h3>
                    <p className="resource-card-desc">
                      {res.description}
                    </p>

                    <div className="resource-card-tags">
                      {res.tags.map((tag, i) => (
                        <span key={i} className="badge badge-tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>#{tag}</span>
                      ))}
                    </div>

                    <div className="resource-card-footer">
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        By <strong>{res.uploadedBy?.name || 'Unknown'}</strong>
                      </span>
                      <a 
                        href={res.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        View ↗
                      </a>
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;