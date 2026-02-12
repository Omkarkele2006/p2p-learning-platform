import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', link: '', type: 'Video', tags: '' });
  const [loading, setLoading] = useState(false);

  // 1. Fetch Resources
  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } catch (err) {
      alert('Failed to fetch resources');
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
      
      alert('Resource Uploaded!');
      setFormData({ title: '', description: '', link: '', type: 'Video', tags: '' });
      fetchResources();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1e1b4b' }}>Library 📚</h1>
        <p style={{ color: '#6b7280' }}>Share and discover learning materials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left: Upload Form */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '20px' }}>Contribute</h3>
          <form onSubmit={handleSubmit}>
            <input 
              className="form-input"
              placeholder="Title (e.g., React Crash Course)" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
            <input 
              className="form-input"
              placeholder="Description" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
            />
            <input 
              className="form-input"
              placeholder="Link URL" 
              value={formData.link} 
              onChange={(e) => setFormData({...formData, link: e.target.value})} 
              required 
            />
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <select 
                className="form-input"
                style={{ marginBottom: 0, width: '120px' }}
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Video">Video</option>
                <option value="Article">Article</option>
                <option value="Note">Note</option>
                <option value="Repo">Repo</option>
              </select>
              
              <input 
                className="form-input"
                style={{ marginBottom: 0 }}
                placeholder="Tags (comma separated)" 
                value={formData.tags} 
                onChange={(e) => setFormData({...formData, tags: e.target.value})} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </form>
        </div>

        {/* Right: Resource Grid */}
        <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {resources.map((res) => (
            <div key={res._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', margin: 0 }}>
                  {res.type}
                </span>
                <small style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  {new Date(res.createdAt).toLocaleDateString()}
                </small>
              </div>

              <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0' }}>{res.title}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', flex: 1, marginBottom: '15px' }}>
                {res.description}
              </p>

              <div style={{ marginBottom: '15px' }}>
                {res.tags.map((tag, i) => (
                  <span key={i} className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>#{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;