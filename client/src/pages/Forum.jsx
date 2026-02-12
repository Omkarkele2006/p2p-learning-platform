import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Forum = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [replyText, setReplyText] = useState('');
  const [activeDiscussion, setActiveDiscussion] = useState(null); // Which thread is open?

  // 1. Fetch Discussions
  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get('/discussions');
      setDiscussions(data);
    } catch (err) {
      alert('Failed to load forum');
    }
  };

  useEffect(() => { fetchDiscussions(); }, []);

  // 2. Create Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/discussions', newPost);
      alert('Discussion Started!');
      setNewPost({ title: '', content: '' });
      fetchDiscussions();
    } catch (err) {
      alert('Failed to post');
    }
  };

  // 3. Handle Reply
  const handleReplySubmit = async (id) => {
    try {
      await api.post(`/discussions/${id}/reply`, { text: replyText });
      alert('Reply added!');
      setReplyText('');
      fetchDiscussions(); // Refresh to see new reply
    } catch (err) {
      alert('Failed to reply');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>💬 Discussion Forum</h1>

      {/* New Post Form */}
      <div style={{ background: '#eef', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Ask the Community</h3>
        <input 
          placeholder="Topic Title" 
          value={newPost.title} 
          onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <textarea 
          placeholder="What's on your mind?" 
          value={newPost.content} 
          onChange={(e) => setNewPost({...newPost, content: e.target.value})} 
          style={{ width: '100%', padding: '8px', height: '80px', marginBottom: '10px' }}
        />
        <button onClick={handlePostSubmit} style={{ background: 'purple', color: 'white', padding: '10px', border: 'none' }}>
          Post Discussion
        </button>
      </div>

      {/* Discussion List */}
      <div>
        {discussions.map((d) => (
          <div key={d._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
            <h3 style={{ cursor: 'pointer', color: 'darkblue' }} onClick={() => setActiveDiscussion(activeDiscussion === d._id ? null : d._id)}>
              {d.title} {activeDiscussion === d._id ? '🔼' : '🔽'}
            </h3>
            <p>{d.content}</p>
            <small>Posted by: {d.author?.name || 'User'}</small>

            {/* Replies Section (Only shows if active) */}
            {activeDiscussion === d._id && (
              <div style={{ marginTop: '15px', paddingLeft: '20px', borderLeft: '3px solid #ddd' }}>
                <h4>Replies:</h4>
                {d.replies.map((r, idx) => (
                  <p key={idx} style={{ background: '#f9f9f9', padding: '5px' }}>
                    <strong>User:</strong> {r.text}
                  </p>
                ))}
                
                {/* Add Reply Input */}
                <div style={{ marginTop: '10px', display: 'flex' }}>
                  <input 
                    placeholder="Write a reply..." 
                    value={replyText} 
                    onChange={(e) => setReplyText(e.target.value)} 
                    style={{ flex: 1, padding: '5px' }}
                  />
                  <button onClick={() => handleReplySubmit(d._id)} style={{ background: 'orange', border: 'none', padding: '5px 10px' }}>
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;