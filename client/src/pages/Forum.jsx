import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Forum = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [replyText, setReplyText] = useState('');
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get('/discussions');
      setDiscussions(data);
    } catch (err) {
      alert('Failed to load forum');
    }
  };

  useEffect(() => { fetchDiscussions(); }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/discussions', newPost);
      setNewPost({ title: '', content: '' });
      fetchDiscussions();
    } catch (err) {
      alert('Failed to post');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/discussions/${id}/reply`, { text: replyText });
      setReplyText('');
      fetchDiscussions();
    } catch (err) {
      alert('Failed to reply');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1e1b4b' }}>Community Forum 💬</h1>
        <p style={{ color: '#6b7280' }}>Ask questions, discuss topics, and help peers.</p>
      </div>

      {/* New Post Input */}
      <div className="glass-panel" style={{ marginBottom: '40px', borderLeft: '4px solid #6366f1' }}>
        <h3 style={{ marginBottom: '15px' }}>Start a Discussion</h3>
        <input 
          className="form-input"
          placeholder="What's the topic?" 
          value={newPost.title} 
          onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
        />
        <textarea 
          className="form-input"
          placeholder="Elaborate on your question..." 
          value={newPost.content} 
          onChange={(e) => setNewPost({...newPost, content: e.target.value})} 
          style={{ height: '100px', resize: 'vertical' }}
        />
        <div style={{ textAlign: 'right' }}>
          <button onClick={handlePostSubmit} className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post Discussion'}
          </button>
        </div>
      </div>

      {/* Discussion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {discussions.map((d) => {
          const isActive = activeDiscussion === d._id;
          return (
            <div 
              key={d._id} 
              className="glass-panel" 
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                transition: 'all 0.3s ease',
                border: isActive ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.5)'
              }}
            >
              {/* Header (Clickable) */}
              <div 
                onClick={() => setActiveDiscussion(isActive ? null : d._id)}
                style={{ 
                  padding: '20px', 
                  cursor: 'pointer', 
                  background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#1e1b4b' }}>{d.title}</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    Posted by <strong>{d.author?.name || 'User'}</strong> • {d.replies.length} replies
                  </p>
                </div>
                <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                  {isActive ? '−' : '+'}
                </div>
              </div>

              {/* Expanded Content */}
              {isActive && (
                <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#374151', margin: '20px 0' }}>
                    {d.content}
                  </p>

                  {/* Replies List */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase' }}>Replies</h4>
                    {d.replies.length === 0 ? (
                      <p style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '0.9rem' }}>No replies yet. Be the first!</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {d.replies.map((r, idx) => (
                          <div key={idx} style={{ paddingBottom: '10px', borderBottom: idx !== d.replies.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#c7d2fe', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                U
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>User</span>
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#4b5563', paddingLeft: '32px' }}>{r.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Input */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      className="form-input"
                      style={{ marginBottom: 0, background: 'white' }}
                      placeholder="Write a reply..." 
                      value={replyText} 
                      onChange={(e) => setReplyText(e.target.value)} 
                    />
                    <button onClick={() => handleReplySubmit(d._id)} className="btn btn-primary">
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forum;