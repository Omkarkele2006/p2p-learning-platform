import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', link: '', type: 'Video', tags: '' });

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
    try {
      // Convert comma-separated tags to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      
      await api.post('/resources', { ...formData, tags: tagsArray });
      
      alert('Resource Uploaded!');
      setFormData({ title: '', description: '', link: '', type: 'Video', tags: '' }); // Reset form
      fetchResources(); // Refresh list
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📚 Resource Library</h1>

      {/* Upload Section */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Share a Resource</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            placeholder="Title (e.g., React Crash Course)" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required style={{ padding: '8px' }}
          />
          <input 
            placeholder="Description" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            required style={{ padding: '8px' }}
          />
          <input 
            placeholder="Link (URL)" 
            value={formData.link} 
            onChange={(e) => setFormData({...formData, link: e.target.value})} 
            required style={{ padding: '8px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ padding: '8px' }}
            >
              <option value="Video">Video</option>
              <option value="Article">Article</option>
              <option value="Note">Note</option>
            </select>
            <input 
              placeholder="Tags (e.g., React, Frontend)" 
              value={formData.tags} 
              onChange={(e) => setFormData({...formData, tags: e.target.value})} 
              style={{ flex: 1, padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ background: 'blue', color: 'white', padding: '10px', border: 'none' }}>
            Upload Resource
          </button>
        </form>
      </div>

      {/* List Section */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {resources.map((res) => (
          <div key={res._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{res.title} <span style={{ fontSize: '0.8em', background: '#eee', padding: '2px 5px', borderRadius: '4px' }}>{res.type}</span></h3>
            <p>{res.description}</p>
            <p><strong>Tags:</strong> {res.tags.join(', ')}</p>
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Uploaded by: <strong>{res.uploadedBy?.name || 'Unknown'}</strong>
            </p>
            <a href={res.link} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
              View Resource →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;