import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
        setSkills(data.skills.join(', '));
        setInterests(data.interests.join(', '));
        if (data.interests.length > 0) {
          const matchRes = await api.get('/users/matches');
          setMatches(matchRes.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', {
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        interests: interests.split(',').map(s => s.trim()).filter(s => s)
      });
      setUser(data);
      setEditing(false);
      const matchRes = await api.get('/users/matches');
      setMatches(matchRes.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Update failed";
      toast.error(errMsg);
    }
  };

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      {/* Welcome Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1e1b4b' }}>
          Welcome back, {user.name.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: '#6b7280' }}>Here's what's happening in your learning circle.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* Left Column: Profile Card */}
        <div>
          <div className="glass-panel">
            <h2 style={{ marginBottom: '20px' }}>My Profile</h2>
            
            {editing ? (
              <form onSubmit={handleUpdate}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>My Skills</label>
                <input 
                  className="form-input" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Java"
                />
                
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>I want to learn</label>
                <input 
                  className="form-input" 
                  value={interests} 
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. AI, Figma"
                />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#6b7280', marginBottom: '10px', fontSize: '0.85rem', textTransform: 'uppercase' }}>I can teach</h4>
                  {user.skills.length ? (
                    user.skills.map(s => <span key={s} className="badge">{s}</span>)
                  ) : <p style={{ fontStyle: 'italic', color: '#999' }}>No skills added</p>}
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#6b7280', marginBottom: '10px', fontSize: '0.85rem', textTransform: 'uppercase' }}>I am learning</h4>
                  {user.interests.length ? (
                    user.interests.map(i => <span key={i} className="badge" style={{ color: '#ec4899' }}>{i}</span>)
                  ) : <p style={{ fontStyle: 'italic', color: '#999' }}>No interests added</p>}
                </div>

                <button onClick={() => setEditing(true)} className="btn btn-secondary" style={{ width: '100%' }}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Matches */}
        <div>
          <h2 style={{ marginBottom: '20px', color: '#1e1b4b' }}>Recommended Mentors 🚀</h2>
          
          {matches.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '50px' }}>
              <p style={{ color: '#6b7280' }}>Update your "Interests" to find mentors!</p>
            </div>
          ) : (
            <div className="grid-layout">
              {matches.map(match => {
                const commonTags = match.skills.filter(skill => user.interests.includes(skill));
                const score = Math.min(commonTags.length * 50, 100);
                
                return (
                  <div key={match._id} className="glass-panel" style={{ padding: '20px', marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0 }}>{match.name}</h3>
                      <span className={`match-score ${score > 80 ? 'score-high' : 'score-mid'}`}>
                        {score}% Match
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '10px' }}>Can teach you:</p>
                    <div style={{ marginBottom: '15px' }}>
                      {match.skills.map(s => (
                        <span key={s} className="badge" style={user.interests.includes(s) ? { background: '#dcfce7', color: '#166534' } : {}}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                      Request Session
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;