import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LoadingSpinner, EmptyState, SectionCard, StatCard } from '../components/UI';

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

  if (!user) {
    return (
      <div className="container">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="container">
      {/* Welcome Hero Section */}
      <div className="hero-card">
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: 'var(--space-xs)' }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem' }}>
            Ready to learn or share your knowledge today? Here is your circle activity overview.
          </p>
        </div>
        <div className="hero-stats">
          <StatCard value={user.reputation} label="Reputation" />
          <StatCard value={user.skills.length} label="Skills" />
          <StatCard value={user.interests.length} label="Interests" />
          <StatCard value={matches.length} label="Matches Found" />
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Profile Card */}
        <SectionCard title="My Profile">
          {editing ? (
            <form onSubmit={handleUpdate} className="form-panel">
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="profile-skills" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.9rem', fontWeight: 600 }}>My Skills (comma separated)</label>
                <input 
                  id="profile-skills"
                  className="form-input" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Java, CSS"
                />
              </div>
              
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="profile-interests" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.9rem', fontWeight: 600 }}>I want to learn (comma separated)</label>
                <input 
                  id="profile-interests"
                  className="form-input" 
                  value={interests} 
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. AI, Figma, Node"
                />
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>I can teach</h4>
                {user.skills.length ? (
                  user.skills.map(s => <span key={s} className="badge">{s}</span>)
                ) : <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills added yet</p>}
              </div>

              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>I am learning</h4>
                {user.interests.length ? (
                  user.interests.map(i => <span key={i} className="badge badge-interests">{i}</span>)
                ) : <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No interests added yet</p>}
              </div>

              <button onClick={() => setEditing(true)} className="btn btn-secondary" style={{ width: '100%' }}>
                Edit Profile
              </button>
            </>
          )}
        </SectionCard>

        {/* Right Column: Matches */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-lg)' }}>
            Recommended Mentors 🚀
          </h2>
          
          {matches.length === 0 ? (
            <EmptyState
              icon="🤝"
              title="No peer matches found"
              description="We couldn't find any mentors matching your interests. Try adding more tags you want to learn!"
              actionText="Edit Profile"
              onAction={() => setEditing(true)}
            />
          ) : (
            <div className="grid-3col">
              {matches.map(match => {
                const commonTags = match.skills.filter(skill => user.interests.includes(skill));
                const score = Math.min(commonTags.length * 50, 100);
                
                return (
                  <SectionCard key={match._id} hover={true} className="card-hover">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-indigo)', margin: 0 }}>{match.name}</h3>
                      <span className={`match-score ${score > 80 ? 'score-high' : 'score-mid'}`}>
                        {score}% Match
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', fontWeight: 500 }}>Can teach you:</p>
                    <div style={{ marginBottom: 'var(--space-lg)', minHeight: '60px' }}>
                      {match.skills.map(s => (
                        <span key={s} className="badge" style={user.interests.includes(s) ? { background: '#dcfce7', color: '#166534' } : {}}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                      Request Session
                    </button>
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

export default Dashboard;