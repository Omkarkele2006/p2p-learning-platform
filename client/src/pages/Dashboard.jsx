import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  LoadingSpinner, 
  EmptyState, 
  SectionCard, 
  StatCard,
  ProgressBar,
  Badge,
  ActivityTimeline,
  InsightCard 
} from '../components/UI';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [bio, setBio] = useState('');
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      const profileRes = await api.get('/users/profile');
      setUser(profileRes.data);
      setSkills(profileRes.data.skills.join(', '));
      setInterests(profileRes.data.interests.join(', '));
      setBio(profileRes.data.bio || '');

      const summaryRes = await api.get('/users/activity-summary');
      setSummary(summaryRes.data);

      const activitiesRes = await api.get('/users/recent-activity');
      setActivities(activitiesRes.data);

      if (profileRes.data.interests.length > 0) {
        const matchRes = await api.get('/users/matches');
        setMatches(matchRes.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error("Failed to load dashboard statistics.");
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', {
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        interests: interests.split(',').map(s => s.trim()).filter(s => s),
        bio: bio
      });
      setUser(data);
      setEditing(false);
      toast.success("Profile updated successfully!");
      loadDashboardData();
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Update failed";
      toast.error(errMsg);
    }
  };

  const getCompletenessSuggestion = () => {
    if (!user) return '';
    if (!user.skills || user.skills.length === 0) {
      return "Add skills to help others find you as a mentor.";
    }
    if (!user.interests || user.interests.length === 0) {
      return "Add interests to improve your mentor matches.";
    }
    if (!user.bio || user.bio.trim() === '') {
      return "Write a brief bio about yourself to reach 80% completion.";
    }
    if (summary && summary.discussionCount === 0 && summary.replyCount === 0 && summary.resourceCount === 0) {
      return "Share a resource or post a discussion to reach 100% completion.";
    }
    return "Great job! Your profile is 100% complete.";
  };

  if (!user || loadingData) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-xs)' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '700', margin: 0 }}>
              Welcome back, {user.name}! 👋
            </h1>
            {summary && <Badge text={summary.badge} />}
          </div>
          <p style={{ opacity: 0.9, fontSize: '1rem', marginTop: 'var(--space-xs)' }}>
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

      {/* Activity Insights Cards */}
      {summary && (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-md)' }}>
            Activity Insights 📊
          </h2>
          <div className="grid-3col" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 'var(--space-md)' }}>
            <InsightCard title="Discussions" value={summary.discussionCount} icon="💬" />
            <InsightCard title="Replies" value={summary.replyCount} icon="↩️" />
            <InsightCard title="Resources" value={summary.resourceCount} icon="📚" />
            <InsightCard title="Matches" value={summary.matchCount} icon="🤝" />
            <InsightCard title="Reputation" value={summary.reputation} icon="⭐" badgeText={summary.badge} />
          </div>
        </div>
      )}

      <div className="grid-2col">
        {/* Left Column: Profile Card & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <SectionCard title="My Profile">
            {/* Profile Completion Score Meter */}
            {summary && (
              <div style={{ marginBottom: 'var(--space-lg)', background: 'rgba(255,255,255,0.45)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <ProgressBar 
                  value={summary.profileCompletion} 
                  suggestion={getCompletenessSuggestion()} 
                />
              </div>
            )}

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

                <div style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="profile-bio" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.9rem', fontWeight: 600 }}>About Me / Bio</label>
                  <textarea 
                    id="profile-bio"
                    className="form-input" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell peers about your background, expertise and learning goals..."
                    style={{ height: '80px', resize: 'vertical' }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>About Me</h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontStyle: user.bio ? 'normal' : 'italic', lineHeight: 1.5 }}>
                    {user.bio || "No bio added yet. Click edit profile to add one!"}
                  </p>
                </div>

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

          {/* Recent Activity Timeline Widget */}
          <SectionCard title="Recent Activity 🕒">
            <ActivityTimeline activities={activities} />
          </SectionCard>
        </div>

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
                const commonSkills = match.skills.filter(skill => user.interests.includes(skill));
                const score = Math.min(commonSkills.length * 50, 100);
                
                const sharedInterests = match.interests ? match.interests.filter(i => user.interests.includes(i)) : [];
                const sharedSkills = match.skills ? match.skills.filter(s => user.skills.includes(s)) : [];

                return (
                  <SectionCard key={match._id} hover={true} className="card-hover">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-indigo)', margin: 0 }}>{match.name}</h3>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>
                          Reputation: <strong>{match.reputation || 0}</strong>
                        </small>
                      </div>
                      <span className={`match-score ${score > 80 ? 'score-high' : 'score-mid'}`}>
                        {score}% Match
                      </span>
                    </div>

                    {/* Shared Skills & Interests Counts */}
                    <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-xs) var(--space-sm)', marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Shared Interests:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sharedInterests.length}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Shared Skills:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sharedSkills.length}</span>
                      </div>
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