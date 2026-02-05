import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [editing, setEditing] = useState(false);
  
  // Form State for updates
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');

  const navigate = useNavigate();

  // 1. Fetch User Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
        setSkills(data.skills.join(', '));
        setInterests(data.interests.join(', '));
        
        // If we have interests, try to find matches
        if (data.interests.length > 0) {
          const matchRes = await api.get('/users/matches');
          setMatches(matchRes.data);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // 2. Handle Profile Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Split comma-separated string into arrays
      const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
      const interestArray = interests.split(',').map(s => s.trim()).filter(s => s);

      const { data } = await api.put('/users/profile', {
        skills: skillArray,
        interests: interestArray
      });
      
      setUser(data);
      setEditing(false);
      alert("Profile Updated!");
      
      // Refresh matches after update
      const matchRes = await api.get('/users/matches');
      setMatches(matchRes.data);

    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Hello, {user.name} 👋</h1>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ background: 'red', color: 'white' }}>
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>My Profile</h2>
        {editing ? (
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '10px' }}>
              <label><strong>Skills (comma separated):</strong></label>
              <input 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                style={{ width: '100%', padding: '8px' }}
                placeholder="e.g. React, C++, Python"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label><strong>I want to learn (comma separated):</strong></label>
              <input 
                value={interests} 
                onChange={(e) => setInterests(e.target.value)} 
                style={{ width: '100%', padding: '8px' }}
                placeholder="e.g. Node.js, AI, DevOps"
              />
            </div>
            <button type="submit" style={{ background: 'green', color: 'white' }}>Save Changes</button>
            <button type="button" onClick={() => setEditing(false)} style={{ marginLeft: '10px' }}>Cancel</button>
          </form>
        ) : (
          <div>
            <p><strong>Skills:</strong> {user.skills.length ? user.skills.join(', ') : "No skills added"}</p>
            <p><strong>Interests:</strong> {user.interests.length ? user.interests.join(', ') : "No interests added"}</p>
            <button onClick={() => setEditing(true)} style={{ marginTop: '10px' }}>Edit Profile</button>
          </div>
        )}
      </div>

      {/* Matches Section */}
      <div style={{ marginTop: '30px' }}>
        <h2>Recommended Mentors 🎯</h2>
        {matches.length === 0 ? (
          <p>No matches found yet. Update your interests or wait for more users!</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {matches.map(match => (
              <div key={match._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h3>{match.name}</h3>
                <p>Can teach: <strong>{match.skills.join(', ')}</strong></p>
                <p>Reputation: ⭐ {match.reputation || 0}</p>
                <button style={{ background: '#007bff', color: 'white' }}>Request Session</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;