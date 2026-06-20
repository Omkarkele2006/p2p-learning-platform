import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { PageHeader, SectionCard, EmptyState, LoadingSpinner } from '../components/UI';
import { formatRelativeTime } from '../utils/formatDate';

const Forum = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [replyText, setReplyText] = useState('');
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);

  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get('/discussions');
      setDiscussions(data);
    } catch (err) {
      toast.error('Failed to load forum');
    } finally {
      setLoadingDiscussions(false);
    }
  };

  useEffect(() => { fetchDiscussions(); }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    setLoading(true);
    try {
      await api.post('/discussions', newPost);
      setNewPost({ title: '', content: '' });
      toast.success('Discussion created!');
      fetchDiscussions();
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to post';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/discussions/${id}/reply`, { text: replyText });
      setReplyText('');
      toast.success('Reply posted!');
      fetchDiscussions();
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to reply';
      toast.error(errMsg);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <PageHeader title="Community Forum 💬" subtitle="Ask questions, discuss topics, and help peers." />

      {/* New Post Input */}
      <SectionCard title="Start a Discussion" style={{ borderLeft: '4px solid var(--primary)', marginBottom: 'var(--space-xl)' }}>
        <div className="form-panel">
          <div style={{ marginBottom: 'var(--space-xs)' }}>
            <label htmlFor="post-title" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Topic Title</label>
            <input 
              id="post-title"
              className="form-input"
              placeholder="What's the topic?" 
              value={newPost.title} 
              onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
            />
          </div>
          <div style={{ marginBottom: 'var(--space-xs)' }}>
            <label htmlFor="post-content" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}>Discussion Details</label>
            <textarea 
              id="post-content"
              className="form-input"
              placeholder="Elaborate on your question..." 
              value={newPost.content} 
              onChange={(e) => setNewPost({...newPost, content: e.target.value})} 
              style={{ height: '100px', resize: 'vertical' }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button onClick={handlePostSubmit} className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderLeftColor: 'white', marginRight: '8px' }}></div>
                  Posting...
                </>
              ) : 'Post Discussion'}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Discussion List */}
      <div>
        {loadingDiscussions ? (
          <LoadingSpinner message="Loading discussions..." />
        ) : discussions.length === 0 ? (
          <EmptyState
            icon="💬"
            title="No discussions yet"
            description="Have a question or want to start a topic? Be the first to post!"
            actionText="Create a Discussion"
            onAction={() => document.getElementById('post-title')?.focus()}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {discussions.map((d) => {
              const isActive = activeDiscussion === d._id;
              return (
                <div 
                  key={d._id} 
                  className="card forum-card" 
                  style={{ 
                    border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-glass)'
                  }}
                >
                  {/* Header (Clickable) */}
                  <div 
                    onClick={() => setActiveDiscussion(isActive ? null : d._id)}
                    className={`forum-card-header ${isActive ? 'active' : ''}`}
                  >
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: 'var(--dark-indigo)', fontSize: '1.2rem', fontWeight: 700 }}>{d.title}</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Posted by <strong>{d.author?.name || 'Unknown User'}</strong> • {formatRelativeTime(d.createdAt)} • {d.replies.length} replies
                      </p>
                    </div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                      {isActive ? '−' : '+'}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isActive && (
                    <div className="forum-card-content">
                      <p className="forum-post-text">
                        {d.content}
                      </p>

                      {/* Replies List */}
                      <div className="forum-replies-container">
                        <h4 className="forum-replies-title">Replies</h4>
                        {d.replies.length === 0 ? (
                          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No replies yet. Be the first to share your thoughts!</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {d.replies.map((r, idx) => (
                              <div key={idx} className="forum-reply-item">
                                <div className="forum-reply-meta">
                                  <div className="forum-reply-avatar">
                                    {(r.user?.name || 'Unknown User')[0].toUpperCase()}
                                  </div>
                                  <span className="forum-reply-author">{r.user?.name || 'Unknown User'}</span>
                                  <span className="forum-reply-time">{formatRelativeTime(r.createdAt)}</span>
                                </div>
                                <p className="forum-reply-text">{r.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reply Input */}
                      <div className="forum-reply-form">
                        <label htmlFor={`reply-input-${d._id}`} style={{ display: 'none' }}>Write a reply</label>
                        <input 
                          id={`reply-input-${d._id}`}
                          className="form-input forum-reply-input"
                          placeholder="Write a reply..." 
                          value={replyText} 
                          onChange={(e) => setReplyText(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleReplySubmit(d._id);
                          }}
                        />
                        <button onClick={() => handleReplySubmit(d._id)} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;