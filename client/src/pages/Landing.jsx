import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { SectionCard } from '../components/UI';

// Reusable Animated Counter component for dynamic database metrics
const AnimatedCounter = ({ target, label, suffix = '', duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined || target === null) return;
    const end = parseInt(target, 10);
    if (isNaN(end) || end === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const totalSteps = 40;
    const stepDuration = Math.floor(duration / totalSteps);
    const increment = Math.ceil(end / totalSteps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: 'var(--space-xl) var(--space-lg)', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: 'var(--space-xs)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {count.toLocaleString()}{suffix}
      </span>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </div>
  );
};

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ activeLearners: 0, resourcesShared: 0, discussionsCreated: 0, mentorConnections: 0 });
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [submittingContact, setSubmittingContact] = useState(false);
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Load public metrics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/users/public-stats');
        setStats(data);
      } catch (err) {
        // Fallback silently if stats endpoint fails
        setStats({ activeLearners: 1, resourcesShared: 1, discussionsCreated: 1, mentorConnections: 1 });
      }
    };
    fetchStats();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      await api.post('/contact', contactData);
      toast.success("Thank you for reaching out! Your message has been sent.");
      setContactData({ name: '', email: '', message: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to send message. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmittingContact(false);
    }
  };

  const handleScroll = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.08) 0%, transparent 60%)' }}>
      
      {/* 1. Sticky Navigation Header */}
      <div className="landing-navbar-wrapper">
        <header className="landing-navbar">
          <div 
            onClick={() => handleScroll('home')} 
            style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
          >
            <img src="/p2pl.jpg" alt="P2PLearn Logo" className="brand-logo-landing" />
            <span>P2P<span style={{ color: '#ffffff' }}>Learn</span></span>
          </div>

          <nav className="landing-nav-links">
            <button onClick={() => handleScroll('home')} className="landing-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
            <button onClick={() => handleScroll('features')} className="landing-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Features</button>
            <button onClick={() => handleScroll('community')} className="landing-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Community</button>
            <button onClick={() => handleScroll('about')} className="landing-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>About</button>
            <button onClick={() => handleScroll('contact')} className="landing-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Contact</button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            {token ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-nav-link" style={{ fontWeight: 600 }}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                  Get Started
                </Link>
              </>
            )}
            
            <button 
              className="nav-toggle" 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: '#ffffff', marginLeft: 'var(--space-xs)' }}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
          </div>
        </header>

        {/* Collapsible Mobile Dropdown */}
        {menuOpen && (
          <div style={{ background: '#0f172a', padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <button onClick={() => handleScroll('home')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>Home</button>
            <button onClick={() => handleScroll('features')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>Features</button>
            <button onClick={() => handleScroll('community')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>Community</button>
            <button onClick={() => handleScroll('about')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>About</button>
            <button onClick={() => handleScroll('contact')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>Contact</button>
          </div>
        )}
      </div>

      {/* 2. Hero Section */}
      <section className="landing-hero">
        <h1 style={{ marginTop: 'var(--space-2xl)' }}>
          Learn Faster Through <br />
          <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Peer Collaboration
          </span>
        </h1>
        <p>
          Connect with peers, exchange skills, and grow faster. Find mentors, share study resources, join discussions, and unlock collaborative learning metrics.
        </p>
        <div className="hero-buttons">
          {token ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
              Get Started
            </Link>
          )}
          <button onClick={() => handleScroll('features')} className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            Explore Community
          </button>
        </div>

        {/* CSS Mockup Illustration Area */}
        <div className="hero-mockup-wrapper">
          <div className="hero-mockup">
            <div style={{ display: 'flex', width: '100%', height: '100%', paddingTop: '30px' }}>
              {/* Mock Sidebar */}
              <div style={{ width: '22%', background: '#f8fafc', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                {/* Active Brand item */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 10px', borderRadius: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  <div style={{ height: '8px', width: '60px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                </div>
                {/* Other Nav items */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                  <div style={{ height: '8px', width: '50px', background: '#cbd5e1', borderRadius: '2px' }}></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                  <div style={{ height: '8px', width: '55px', background: '#cbd5e1', borderRadius: '2px' }}></div>
                </div>
              </div>
              
              {/* Mock Main Dashboard View */}
              <div style={{ flex: 1, padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                {/* Mock Header Greeting */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--dark-indigo)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Welcome back, Om! 👋
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--secondary)', background: 'rgba(168, 85, 247, 0.1)', padding: '2px 6px', borderRadius: '10px' }}>Contributor</span>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>Here is your activity overview for today.</div>
                  </div>
                  <div style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>
                    ⭐ 148 Rep
                  </div>
                </div>

                {/* Grid Content */}
                <div style={{ display: 'flex', gap: '12px', flex: 1, minHeight: 0 }}>
                  
                  {/* Left Mock Panel: Completion & Activity */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Mock Progress Card */}
                    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '6px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-main)' }}>
                        <span>Profile Completion</span>
                        <span style={{ color: '#047857' }}>80%</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '80%', background: 'linear-gradient(90deg, #34d399, #10b981)', borderRadius: '3px' }}></div>
                      </div>
                    </div>

                    {/* Mock Activity List */}
                    <div style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
                        Recent Activity
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem' }}>📚</span>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-main)' }}>
                          Shared: <strong>JS Interview Guide</strong>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem' }}>💬</span>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-main)' }}>
                          Created: <strong>React Routing</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Mock Panel: Mentors Matching */}
                  <div style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
                      Recommended Mentors
                    </div>
                    {/* Mentor Card 1 */}
                    <div style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '4px', padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--dark-indigo)' }}>Kaustubh Mukdam</div>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.5rem', background: '#dcfce7', color: '#166534', padding: '1px 4px', borderRadius: '3px' }}>React</span>
                          <span style={{ fontSize: '0.5rem', background: '#cbd5e1', color: '#334155', padding: '1px 4px', borderRadius: '3px' }}>CSS</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 6px', borderRadius: '10px' }}>
                        95% Match
                      </span>
                    </div>
                    {/* Mentor Card 2 */}
                    <div style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '4px', padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--dark-indigo)' }}>Ryan Dahl</div>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.5rem', background: '#f3e8ff', color: '#6b21a8', padding: '1px 4px', borderRadius: '3px' }}>Node</span>
                          <span style={{ fontSize: '0.5rem', background: '#cbd5e1', color: '#334155', padding: '1px 4px', borderRadius: '3px' }}>Git</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 6px', borderRadius: '10px' }}>
                        80% Match
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="container landing-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <h2 className="landing-section-title">Engineered for Collaborative Success</h2>
        <div className="grid-3col">
          <SectionCard hover={true} title="Peer Matching 🤝">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Our matching algorithm automatically connects you with other learners who possess the skills you want to study.
            </p>
          </SectionCard>

          <SectionCard hover={true} title="Resource Library 📚">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Upload and discover links, videos, crash courses, and cheatsheets shared directly by peer experts.
            </p>
          </SectionCard>

          <SectionCard hover={true} title="Community Forums 💬">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Start topics, ask questions, and collaborate inside open threads with direct, threaded replies.
            </p>
          </SectionCard>

          <SectionCard hover={true} title="Mentor Discovery 🚀">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Find mentors with verified skills list profiles, view match indicators, and send session queries.
            </p>
          </SectionCard>

          <SectionCard hover={true} title="Reputation Badges ⭐">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Earn reputation scores and unlock tags (New Learner, Contributor, Mentor) by contributing value.
            </p>
          </SectionCard>
        </div>
      </section>

      {/* 4. Social Proof Section */}
      <section className="container landing-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <h2 className="landing-section-title">Why Collaborative Learning Wins</h2>
        <div className="social-proof-grid">
          <div className="social-proof-card">
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--space-sm)' }}>🤝</span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-indigo)', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>Peer Learning</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Studying with peers reinforces memory pathways, introduces new perspectives, and promotes long-term academic retention.
            </p>
          </div>

          <div className="social-proof-card">
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--space-sm)' }}>🕵️</span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-indigo)', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>Mentor Discovery</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Bypass generic tutorials. Get direct, customized advice and skills transfer from learners who are a few steps ahead.
            </p>
          </div>

          <div className="social-proof-card">
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--space-sm)' }}>📂</span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-indigo)', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>Resource Exchange</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Stop wasting hours searching the web. Access hand-picked study materials verified and upvoted by the community.
            </p>
          </div>

          <div className="social-proof-card">
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--space-sm)' }}>🗣️</span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-indigo)', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>Open Dialogue</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Post questions and receive contextual feedback from active contributors, creating a dynamic learning circle.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Dynamic Platform Statistics Section */}
      <section id="community" className="container landing-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <h2 className="landing-section-title">Community Momentum</h2>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          <em>Real-time platform activity metrics, queried directly from our database.</em>
        </div>
        <div className="grid-3col" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <AnimatedCounter target={stats.activeLearners} label="Active Learners" />
          <AnimatedCounter target={stats.resourcesShared} label="Resources Shared" />
          <AnimatedCounter target={stats.discussionsCreated} label="Topics Created" />
          <AnimatedCounter target={stats.mentorConnections} label="Verified Mentors" />
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section className="container landing-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <h2 className="landing-section-title">Your Path to Mastery</h2>
        <div className="timeline-container">
          <div className="timeline-step-card">
            <div className="timeline-number">1</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-xs)' }}>Create Profile</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>Sign up and set up a secure learning profile.</p>
          </div>

          <div className="timeline-step-card">
            <div className="timeline-number">2</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-xs)' }}>Share Skills</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>List skills you can teach and tags you want to learn.</p>
          </div>

          <div className="timeline-step-card">
            <div className="timeline-number">3</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-xs)' }}>Find Peers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>Browse matches generated by our mapping system.</p>
          </div>

          <div className="timeline-step-card">
            <div className="timeline-number">4</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-xs)' }}>Learn Together</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>Request sessions, study resources, and grow together.</p>
          </div>
        </div>
      </section>

      {/* 7. About Section */}
      <section id="about" className="container landing-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="card" style={{ padding: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-md)' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7', marginBottom: 'var(--space-md)' }}>
            We believe traditional learning platforms keep students isolated. Our platform was created to break down barriers, allowing students to learn directly from their peers. By exchanging skills, asking questions openly, and exchanging learning assets, we build a decentralized knowledge-sharing community where everyone can be both a student and a mentor.
          </p>
          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7' }}>
            Whether you want to share a React repository, ask a Mongoose question, or find a Python mentor, our platform provides the tools to measure profile progress, earn reputation badges, and track your achievements.
          </p>


           <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--dark-indigo)', marginBottom: 'var(--space-md)', marginTop: 'var(--space-md)' }}>Project Background</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7', marginBottom: 'var(--space-md)' }}>
P2PLearn was developed as part of ASEP (Applied Science and Engineering Project) during the academic year 2024–25 under the Department of Engineering, Sciences and Humanities (DESH), Vishwakarma Institute of Technology (VIT), Pune.          </p>
          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7', fontWeight: 600 }}>
Project Team: Om Karkele, Kartik Mandhane, Yash Kashid, Siddharth Karle, Kartik Singh, Vedant Kasle          </p>
          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.7' , marginTop: 'var(--space-md)'}}>
Together, the team designed and developed P2PLearn as a full-stack peer-to-peer learning platform focused on connecting students, encouraging knowledge sharing, and building a stronger learning community.          </p>

        </div>
      </section>

      {/* 8. Contact Section */}
      <section id="contact" className="container landing-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <h2 className="landing-section-title">Get In Touch</h2>
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="card">
          <form onSubmit={handleContactSubmit} className="form-panel">
            <div>
              <label htmlFor="contact-name" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.88rem', fontWeight: 600 }}>Your Name</label>
              <input 
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="What should we call you?"
                value={contactData.name}
                onChange={(e) => setContactData({...contactData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.88rem', fontWeight: 600 }}>Email Address</label>
              <input 
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-message" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.88rem', fontWeight: 600 }}>Message</label>
              <textarea 
                id="contact-message"
                className="form-input"
                placeholder="Tell us what you think..."
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
                style={{ height: '100px', resize: 'vertical' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submittingContact}>
              {submittingContact ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* 9. Pre-Footer CTA Conversion Banner */}
      <section className="container" style={{ padding: 'var(--space-2xl) 0' }}>
        <div className="cta-banner">
          <h2>Ready to Start Learning?</h2>
          <p>Create your account, share your skills list, and connect with peer mentors today.</p>
          <div className="hero-buttons" style={{ marginBottom: 0 }}>
            {token ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--dark-indigo)', padding: '12px 24px' }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--dark-indigo)', padding: '12px 24px' }}>
                  Create Account
                </Link>
                <button onClick={() => handleScroll('features')} className="btn btn-secondary" style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#ffffff', padding: '12px 24px' }}>
                  Explore Features
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer className="landing-footer-wrapper">
        <div className="landing-footer">
          <div>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>P2PLearn</span>
            <span style={{ fontSize: '0.9rem', display: 'block', marginTop: 'var(--space-xs)' }}>
              © 2026 Peer Learning Platform. All rights reserved.
            </span>
          </div>
          <div className="landing-footer-links">
            <Link to="/privacy-policy" className="landing-footer-link">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="landing-footer-link">Terms & Conditions</Link>
            <button onClick={() => handleScroll('contact')} className="landing-footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Contact</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
